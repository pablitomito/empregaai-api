import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI não está definida no .env');
  process.exit(1);
}
// ── Rotas ─────────────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes';
import cvRoutes from './routes/cvRoutes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/userRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import jobRoutes from './routes/jobRoutes';
import stripeRoutes from './routes/stripe';

// ⚠️ Webhook importado separadamente — precisa de raw body ANTES do express.json()
import webhookRoutes from './routes/webhookRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'https://empregaai.vercel.app',
  'https://www.pablito.my',
  'https://pablito.my',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sem origin (ex: mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqueado para origem: ${origin}`));
    },
    credentials: true,
  })
);

// ── FIX #2: Webhook do Stripe ANTES do express.json() ────────────────────────
// O Stripe precisa do raw body para verificar a assinatura.
// Se o express.json() processar primeiro, a verificação falha com erro 400.
app.use('/api/stripe/webhook', webhookRoutes);

// ── Body parsers (depois do webhook) ─────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/stripe', stripeRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'EmpregaAI Backend',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── FIX #4: Error handler tipado para TypeScript ──────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Erro não tratado:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── FIX #1: Uma única conexão MongoDB ─────────────────────────────────────────
// Removido connect DB() + mongoose.connect() duplicado.
// Usa apenas uma chamada com opções de reconexão automática.
mongoose
  .connect(process.env.MONGODB_URI!, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ MongoDB conectado');

    app.listen(PORT, () => {
      console.log(`🚀 EmpregaAI Backend na porta ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
      console.log(`💳 Stripe webhook: http://localhost:${PORT}/api/stripe/webhook`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1); // Para o processo se não conseguir conectar
  });

export default app;