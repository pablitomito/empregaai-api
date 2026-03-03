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
  pdfUrl: string,
  pdfBuffer?: Buffer
): Promise<void> {
  
  const attachments = pdfBuffer 
    ? [{
        filename: `CV_${name.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    : [];

  await transporter.sendMail({
    from: `"Emprega.AI" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: '🎉 O seu CV Premium está pronto!',
    html: generateEmailHTML(name, pdfUrl),
    attachments
  });
  
  console.log(`✅ Email enviado para ${email}`);
}

function generateEmailHTML(name: string, pdfUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
        }
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .welcome {
          font-size: 20px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 16px 32px;
          background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 12px;
          font-weight: bold;
          margin: 20px 0;
        }
        .card {
          background: #f9fafb;
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .card h3 {
          margin-top: 0;
          color: #1f2937;
        }
        .checklist {
          list-style: none;
          padding: 0;
        }
        .checklist li {
          padding: 8px 0;
          padding-left: 30px;
          position: relative;
        }
        .checklist li:before {
          content: "✅";
          position: absolute;
          left: 0;
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .stats {
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
          text-align: center;
        }
        .stat {
          flex: 1;
        }
        .stat-number {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
        }
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="container">
        
        <!-- Header -->
        <div class="header">
          <h1>🎉 CV Premium Pronto!</h1>
        </div>

        <!-- Content -->
        <div class="content">
          
          <p class="welcome">
            Olá <strong>${name}</strong>,
          </p>

          <p>
            Parabéns! O seu CV Premium foi gerado com sucesso pela nossa Inteligência Artificial! 🚀
          </p>

          <p>
            O seu currículo está otimizado para passar nos filtros ATS (sistemas de tracking de candidaturas) 
            e impressionar recrutadores. 
          </p>

          <center>
            <a href="${pdfUrl}" class="button">
              📥 Descarregar CV Premium
            </a>
          </center>

          <!-- O que incluímos -->
          <div class="card">
            <h3>📄 O que incluímos no seu CV:</h3>
            <ul class="checklist">
              <li>Design profissional otimizado para ATS</li>
              <li>Layout adaptado ao seu perfil profissional</li>
              <li>Keywords estratégicas para o seu setor</li>
              <li>Formatação que passa em todos os filtros</li>
            </ul>
          </div>

          <!-- Próximos Passos -->
          <div class="card">
            <h3>🎯 Próximos Passos:</h3>
            <ul class="checklist">
              <li>Faça download do seu CV anexado neste email</li>
              <li>Aceda ao dashboard para acompanhar candidaturas</li>
              <li>A distribuição automática começará em breve</li>
              <li>Receberá notificações de cada resposta</li>
            </ul>
          </div>

          <!-- Estatísticas -->
          <div class="stats">
            <div class="stat">
              <div class="stat-number">93%</div>
              <div class="stat-label">Taxa de Sucesso</div>
            </div>
            <div class="stat">
              <div class="stat-number">7 dias</div>
              <div class="stat-label">Até 1ª Entrevista</div>
            </div>
            <div class="stat">
              <div class="stat-number">50+</div>
              <div class="stat-label">Portais Atingidos</div>
            </div>
          </div>

          <p>
            <strong>Importante:</strong> O seu CV estará disponível para download por <strong>30 dias</strong>. 
            Guarde uma cópia local.
          </p>

          <p>
            Alguma dúvida? Responda a este email ou aceda ao nosso 
            <a href="https://empregaai.com/suporte" style="color: #2563eb;">centro de suporte</a>.
          </p>

          <p style="margin-top: 30px;">
            Boa sorte na sua procura! 💪<br>
            <strong>Equipa Emprega.AI</strong>
          </p>

        </div>

        <!-- Footer -->
        <div class="footer">
          <p>© 2026 Emprega.AI • Feito em Portugal 🇵🇹</p>
          <p>
            <a href="https://empregaai.com" style="color: #2563eb; text-decoration: none;">
              empregaai.com
            </a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}