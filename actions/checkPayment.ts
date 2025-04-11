'use server';

import { checkPaymentStatus } from '@/lib/mercadopago';
import { updateLetterStatus } from './createLetter';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Verifica o status de um pagamento
 */
export async function checkPayment(paymentId: string) {
  try {
    // Verificar status no Mercado Pago
    const paymentStatus = await checkPaymentStatus(paymentId);
    
    if (!paymentStatus.success) {
      return { success: false, error: 'Erro ao verificar status do pagamento' };
    }

    if (!paymentStatus.status || !paymentStatus.statusDetail) {
      return { success: false, error: 'Status do pagamento incompleto' };
    }
    
    // Atualizar status no Firestore
    const paymentRef = doc(db, 'payments', paymentId);
    const paymentDoc = await getDoc(paymentRef);
    
    if (!paymentDoc.exists()) {
      return { success: false, error: 'Pagamento não encontrado' };
    }
    
    await updateDoc(paymentRef, {
      status: paymentStatus.status,
      statusDetail: paymentStatus.statusDetail,
      updatedAt: new Date()
    });
    
    // Se o pagamento foi aprovado, atualizar status da carta
    if (paymentStatus.status === 'approved' && paymentStatus.externalReference) {
      const slug = paymentStatus.externalReference;
      await updateLetterStatus(slug, 'paid');
    }
    
    // Se o pagamento foi rejeitado ou cancelado
    if (['rejected', 'cancelled'].includes(paymentStatus.status) && paymentStatus.externalReference) {
      const slug = paymentStatus.externalReference;
      await updateLetterStatus(slug, 'cancelled');
    }
    
    return { 
      success: true, 
      status: paymentStatus.status,
      statusDetail: paymentStatus.statusDetail
    };
  } catch (error: unknown) {
    console.error('Erro ao verificar pagamento:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: 'Erro ao verificar pagamento' };
    }
  }
}
