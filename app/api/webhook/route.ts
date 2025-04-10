import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendSuccessEmail } from '@/lib/sendEmail';

export const config = {
  api: {
    bodyParser: false, // necessário para validar assinatura
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Erro de verificação de webhook:', err);
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  // 🎯 Evento relevante
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email || '';
    const customerName = session.customer_details?.name || 'Visitante';
    const cartaLink = `https://tiamovida.com/love/${session.id}`;

    await sendSuccessEmail(customerEmail, customerName, cartaLink);
  }

  return NextResponse.json({ received: true });
}
