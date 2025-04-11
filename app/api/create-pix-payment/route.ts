import { NextRequest, NextResponse } from 'next/server';
import { createPixPayment } from '@/lib/mercadopago';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { slug, email, name, amount } = data;
    
    if (!slug || !email || !name || !amount) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    // Criar pagamento no Mercado Pago
    const payment = await createPixPayment({
      transactionAmount: amount,
      description: `Carta de amor - ${slug}`,
      payerEmail: email,
      payerFirstName: name.split(' ')[0],
      payerLastName: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
      externalReference: slug,
    });
    
    if (!payment.success) {
      return NextResponse.json(
        { error: payment.error },
        { status: 500 }
      );
    }
    
    // Salvar informações do pagamento no Firestore
    await setDoc(doc(db, 'payments', payment.paymentId.toString()), {
      slug,
      email,
      name,
      amount,
      paymentId: payment.paymentId,
      status: 'pending',
      createdAt: new Date(),
      expirationDate: payment.expirationDate,
    });
    
    return NextResponse.json(payment);
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar pagamento PIX' },
      { status: 500 }
    );
  }
}

// npm install mercadopago uuid
// npm install @types/uuid --save-dev