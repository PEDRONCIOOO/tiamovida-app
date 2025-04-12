import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-03-31.basil', // Use your desired API version
});

// Define plan details
const plans = {
  basic: {
    amount: 2900, // R$29.00 in cents
    description: 'Plano Básico - 1 ano, 3 fotos',
  },
  premium: {
    amount: 4900, // R$49.00 in cents
    description: 'Plano Premium - Pra sempre, 7 fotos, música',
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { plan } = req.body; // Expect 'basic' or 'premium'

      // Validate plan and get details
      const selectedPlanDetails = plans[plan as keyof typeof plans];

      if (!selectedPlanDetails) {
        return res.status(400).json({ error: 'Plano inválido selecionado' });
      }

      const { amount, description } = selectedPlanDetails;

      // Create Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], 
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: description,
              },
              unit_amount: amount, // Use dynamic amount
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // Adjust success URL as needed
        cancel_url: `${req.headers.origin}/create`, // Redirect back to create page on cancel
        billing_address_collection: 'required', // Optional: Collect billing address
        metadata: { // Optional: Add metadata like the plan selected
          plan: plan,
          // Add other relevant data from formData if needed, passed from frontend
        }
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err: unknown) { // Using specific Stripe error type
      console.error('Stripe Error:', (err as Error).message); // Cast to Error to access message safely
      res.status(500).json({ error: 'Erro ao criar sessão de checkout', details: (err as Error).message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Método não permitido');
  }
}
