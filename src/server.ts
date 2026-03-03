import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cvRoutes from "./routes/cvRoutes";
import stripeRoutes from "./routes/stripe";
import webhookRoutes from "./routes/webhookRoutes";
import authRoutes from "./routes/authRoutes";
import mongoose from "mongoose";

import connectDB from "./config/database";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

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
app.use(express.json());

app.use("/api/auth", authRoutes);

// ⚠️ 1. Webhook do Stripe precisa vir ANTES do express.json()
app.use("/api/stripe", webhookRoutes);

// ⚠️ 2. Agora sim podemos ativar o JSON parser


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

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`📍 Webhook Stripe: http://localhost:${PORT}/api/stripe/webhook`);
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});