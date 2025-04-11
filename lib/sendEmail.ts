import nodemailer from 'nodemailer';

/**
 * Configuração do transporter para envio de e-mails
 */
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.resend.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'resend',
      pass: process.env.RESEND_API_KEY || process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Envia e-mail de sucesso após criação da carta
 */
export async function sendSuccessEmail(to: string, name: string, link: string) {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@tiamovida.app',
    to,
    subject: 'Sua carta foi enviada com sucesso!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fdf6f9;">
        <h2 style="color: #d63384;">Olá, ${name}! 💖</h2>
        <p>Recebemos seu pedido e ele está pronto para ser acessado:</p>
        <a href="${link}" style="display: inline-block; color: #fff; background-color: #d63384; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 15px 0;">
          Ver Minha Carta
        </a>
        <p style="margin-top: 20px;">Com carinho,<br/>Equipe Tiamovida 💌</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 E-mail enviado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    return false;
  }
}

/**
 * Envia e-mail de confirmação de pagamento
 */
export async function sendPaymentConfirmationEmail(to: string, name: string, link: string) {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@tiamovida.app',
    to,
    subject: 'Pagamento confirmado! Sua carta está pronta',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fdf6f9;">
        <h2 style="color: #d63384;">Olá, ${name}! 💖</h2>
        <p>Seu pagamento foi confirmado e sua carta de amor está pronta para ser compartilhada!</p>
        <a href="${link}" style="display: inline-block; color: #fff; background-color: #d63384; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 15px 0;">
          Ver Minha Carta
        </a>
        <p>Agora você pode compartilhar este link com quem você ama.</p>
        <p style="margin-top: 20px;">Com carinho,<br/>Equipe Tiamovida 💌</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 E-mail de confirmação de pagamento enviado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail de confirmação de pagamento:', error);
    return false;
  }
}