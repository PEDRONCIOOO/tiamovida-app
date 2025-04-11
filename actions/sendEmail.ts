'use server';

import { sendSuccessEmail } from '@/lib/sendEmail';

/**
 * Server Action para enviar e-mail
 */
export async function sendEmail(data: {
  to: string;
  name: string;
  link: string;
  type: 'success' | 'payment' | 'reminder';
}) {
  try {
    const { to, name, link, type } = data;
    
    if (!to || !name || !link) {
      return { success: false, error: 'Dados incompletos para envio de e-mail' };
    }
    
    await sendSuccessEmail(to, name, link);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error: 'Ocorreu um erro ao enviar o e-mail' };
  }
}
