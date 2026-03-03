import { Request, Response } from 'express';
import Stripe from 'stripe';
import { generateCVPDF } from '../services/cv-generator/generator';
import { uploadCVToR2 } from '../services/storage/r2-client';
import { sendCVEmail } from '../services/email/sender';
import { UserCVData } from '../services/cv-generator/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const rawBody = req.body; // Raw buffer do body
  
  let event: Stripe.Event;
  
  try {
    // Verifica assinatura do webhook
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Processa evento de pagamento confirmado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('✅ Pagamento confirmado! Session ID:', session.id);
    console.log('💰 Valor:', (session.amount_total! / 100).toFixed(2), session.currency?.toUpperCase());
    
    // Extrai dados do metadata
    const userId = session.metadata?.userId;
    const userEmail = session.customer_email;
    const userName = session.metadata?.userName || 'Cliente';
    
    if (!userId || !userEmail) {
      console.error('❌ Dados incompletos no webhook:', { userId, userEmail });
      return res.status(400).json({ 
        error: 'userId ou email não encontrado no metadata' 
      });
    }
    
    console.log('👤 Gerando CV para:', userName, `(${userEmail})`);
    
    // Monta dados do CV baseado no metadata do Stripe
    const userData: UserCVData = {
      name: userName,
      email: userEmail,
      phone: session.metadata?.userPhone || '+351 912 345 678',
      location: session.metadata?.userLocation || 'Lisboa, Portugal',
      role: session.metadata?.userRole || 'Profissional',
      summary: session.metadata?.userSummary || 
        'Profissional qualificado com experiência comprovada, em busca de novos desafios e oportunidades de crescimento.',
      
      // SUBSTITUA ISSO PELOS DADOS REAIS DO SEU BANCO DE DADOS
      experiences: JSON.parse(session.metadata?.experiences || '[{"title":"Cargo","company":"Empresa","location":"Lisboa","startDate":"2020","endDate":"2024","current":true,"description":"Descrição da experiência."}]'),
      
      education: JSON.parse(session.metadata?.education || '[{"degree":"Licenciatura","institution":"Universidade","location":"Portugal","year":"2020"}]'),
      
      skills: session.metadata?.skills?.split(',') || ['Competência 1', 'Competência 2', 'Competência 3'],
      
      languages: session.metadata?.languages 
        ? JSON.parse(session.metadata.languages)
        : [{ name: 'Português', level: 'Nativo' }, { name: 'Inglês', level: 'Fluente' }],
      
      industry: session.metadata?.userIndustry || 'general',
      experienceYears: parseInt(session.metadata?.experienceYears || '5')
    };
    
    // Processa geração de CV de forma assíncrona
    processCV(userData, userId).catch(error => {
      console.error('❌ Erro ao processar CV:', error);
    });
    
    // Responde imediatamente ao Stripe (importante!)
    return res.json({ received: true, userId });
  }
  
  // Outros eventos
  console.log(`ℹ️ Evento não processado: ${event.type}`);
  return res.json({ received: true });
}

// Função assíncrona para processar CV
async function processCV(userData: UserCVData, userId: string) {
  try {
    console.log('🎨 Gerando PDF...');
    const pdfBuffer = await generateCVPDF(userData);
    
    console.log('☁️ Fazendo upload para R2...');
    const pdfUrl = await uploadCVToR2(pdfBuffer, userId);
    
    console.log('📧 Enviando email com PDF...');
    await sendCVEmail(
      userData.email, 
      userData.name, 
      pdfUrl,
      pdfBuffer // Anexa PDF ao email
    );
    
    console.log('✅ CV processado com sucesso!');
    console.log('🔗 URL do PDF:', pdfUrl);
    
    // Opcional: salvar no banco de dados
    // await saveCVToDatabase(userId, pdfUrl);
    
  } catch (error) {
    console.error('❌ Erro no processamento do CV:', error);
    // Aqui você pode implementar retry logic ou notificar admin
    throw error;
  }
}