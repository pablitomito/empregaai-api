import dotenv from "dotenv";
import express from "express";
import cors from "cors";



dotenv.config();

// Conecta ao MongoDB (executa automaticamente dentro do arquivo)
import "./config/mongodb";

// Rotas
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/ai.routes";
import subscriptionRoutes from "./routes/subscriptionRoutes"; // caso exista

// Inicializa o Express
const app = express();

// Middlewares globais
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://www.pablito.my"],
    credentials: true,
  })
);
 /// testando 

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/subscription", subscriptionRoutes); // só se existir

// Porta
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor online na porta ${PORT}`);
});
