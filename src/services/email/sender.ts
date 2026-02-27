import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendCVEmail(
  email: string,
  name: string,
  pdfUrl: string
): Promise<void> {
  await transporter.sendMail({
    from: `"EmpregaAI" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: '✅ O seu CV Premium está pronto!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px;">
          <h1 style="color: white; margin: 0;">🎉 CV Premium Pronto!</h1>
        </div>
        <div style="padding: 30px;">
          <p>Olá <strong>${name}</strong>,</p>
          <p>O seu CV Premium foi gerado com sucesso!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${pdfUrl}" style="display: inline-block; padding: 15px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              📥 Descarregar CV Premium
            </a>
          </div>
          <p><strong>Próximos passos:</strong></p>
          <ul>
            <li>✅ Download do CV concluído</li>
            <li>🚀 Distribuição automática para +50 portais</li>
            <li>📧 Notificações de respostas</li>
          </ul>
        </div>
      </div>
    `,
  });
}