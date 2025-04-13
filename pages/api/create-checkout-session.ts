import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-03-31.basil',
});

const plans = {
  basic: { amount: 2900, description: 'Plano Básico - 1 ano, 3 fotos' },
  premium: { amount: 4900, description: 'Plano Premium - Pra sempre, 7 fotos, música' },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Expect plan, temporaryId, and coupleNames from the client
      const { plan, temporaryId, coupleNames } = req.body;

      if (!plan || !temporaryId || !coupleNames) {
         return res.status(400).json({ error: 'Dados incompletos para criar checkout (plan, temporaryId, coupleNames)' });
      }

      const selectedPlanDetails = plans[plan as keyof typeof plans];
      if (!selectedPlanDetails) {
        return res.status(400).json({ error: 'Plano inválido selecionado' });
      }

      const { amount, description } = selectedPlanDetails;

      // --- Store Temporary Data (Example using Firestore - adapt if needed) ---
      // You might store the full formData (except files) temporarily here
      // linked to temporaryId before creating the session.
      // Example: await saveTemporaryData(temporaryId, { formData });
      // For simplicity here, we assume essential data is passed directly.
      // ---

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'boleto'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: { name: description },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/create`,
        billing_address_collection: 'required',
        // --- Add metadata ---
        metadata: {
          plan: plan,
          temporaryId: temporaryId, // Link to the data/files
          coupleNames: coupleNames, // Base for slug generation
          // Add other small, critical data if not storing temporarily elsewhere
        }
        // --- End metadata ---
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Stripe Error:', message);
      res.status(500).json({ error: 'Erro ao criar sessão de checkout', details: message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Método não permitido');
  }
}
