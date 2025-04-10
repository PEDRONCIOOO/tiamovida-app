import nodemailer from 'nodemailer';

export async function sendSuccessEmail(to: string, name: string, link: string) {
  const transporter = nodemailer.createTransport({
    host: 'tiamovida@app.com',
    port: 587,
    secure: false,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Sua carta foi enviada com sucesso!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fdf6f9;">
        <h2 style="color: #d63384;">Olá, ${name}! 💖</h2>
        <p>Recebemos seu pedido e ele está pronto para ser acessado:</p>
        <a href="${link}" style="color: #fff; background-color: #d63384; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
          Ver Minha Carta
        </a>
        <p style="margin-top: 20px;">Com carinho,<br/>Equipe Tiamovida 💌</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 E-mail enviado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
  }
}
