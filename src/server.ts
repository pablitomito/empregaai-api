import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cvRoutes from "./routes/cvRoutes";
import stripeRoutes from "./routes/stripe";
import webhookRoutes from "./routes/webhookRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

// ⚠️ 1. Webhook do Stripe precisa vir ANTES do express.json()
app.use("/api/stripe", webhookRoutes);

// ⚠️ 2. Agora sim podemos ativar o JSON parser
app.use(express.json());

// Rotas normais
app.use("/api/cv", cvRoutes);
app.use("/api/stripe", stripeRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "EmpregaAI Backend",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`📍 Webhook Stripe: http://localhost:${PORT}/api/stripe/webhook`);
});
