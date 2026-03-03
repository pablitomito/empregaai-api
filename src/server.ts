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
const allowedOrigins = [
  "https://empregaai.vercel.app",
  "https://www.pablito.my",
  "https://pablito.my",
  "http://localhost:3000"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
