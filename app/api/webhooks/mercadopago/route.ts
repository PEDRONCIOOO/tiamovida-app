import { NextRequest, NextResponse } from 'next/server';
import { checkPaymentStatus } from '@/lib/mercadopago';
import { updateLetterStatus } from '@/actions/createLetter';
import { getLetter } from '@/lib/utills';
import { sendPaymentConfirmationEmail } from '@/lib/sendEmail';

export async function POST(req: NextRequest) {
  try {
    // Verificar se a requisição é do Mercado Pago
    const signature = req.headers.get('x-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    }
    
    // Obter dados da requisição
    const data = await req.json();
    
    // Verificar se é uma notificação de pagamento
    if (data.type !== 'payment') {
      return NextResponse.json({ message: 'Notificação recebida, mas não é de pagamento' });
    }
    
    // Obter ID do pagamento
    const paymentId = data.data.id;
    
    // Verificar status do pagamento
    const paymentStatus = await checkPaymentStatus(paymentId);
    
    if (!paymentStatus.success) {
      return NextResponse.json({ error: 'Erro ao verificar status do pagamento' }, { status: 500 });
    }
    
    // Se o pagamento foi aprovado
    if (paymentStatus.status === 'approved') {
      // Obter referência externa (slug da carta)
      const slug = paymentStatus.externalReference;
      
      // Atualizar status da carta
      await updateLetterStatus(slug, 'paid');
      
      // Obter dados da carta para enviar e-mail
      const letterResult = await getLetter(slug);
      
      if (letterResult.success) {
        const letter = letterResult.letter;
        const userEmail = letter.letterData.userEmail;
        const userName = letter.letterData.coupleNames.split(' ')[0];
        
        // Enviar e-mail de confirmação
        if (userEmail) {
          await sendPaymentConfirmationEmail(
            userEmail,
            userName,
            `${process.env.NEXT_PUBLIC_BASE_URL}/love/${slug}`
          );
        }
      }
      
      return NextResponse.json({ message: 'Pagamento processado com sucesso' });
    }
    
    // Se o pagamento foi rejeitado ou cancelado
    if (['rejected', 'cancelled'].includes(paymentStatus.status)) {
      const slug = paymentStatus.externalReference;
      await updateLetterStatus(slug, 'cancelled');
      
      return NextResponse.json({ message: 'Pagamento rejeitado ou cancelado' });
    }
    
    return NextResponse.json({ message: 'Notificação recebida' });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}