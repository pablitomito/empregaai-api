import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json()); // ESSA LINHA É OBRIGATÓRIA
app.use(cors());

const PORT = process.env.PORT || 5000;
// Aqui ele tenta ler de qualquer um dos nomes que possas ter posto no Render/Vercel
const MONGO_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;


// ... dentro do teu app

app.use(cors({
  origin: 'https://www.pablito.my', // O teu domínio exato do frontend
  credentials: true,               // Permite o envio de cookies/tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// LIGAÇÃO AO MONGO (Sem travar o servidor)
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Conectado'))
    .catch((err) => console.error('❌ Erro na conexão Mongo:', err.message));
} else {
  console.warn('⚠️ Atenção: MONGO_URI não encontrada nas variáveis de ambiente!');
}

// 1. Definição da estrutura do Usuário
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ESTE É O CAMPO NOVO:
  profileStatus: { type: String, default: 'pending' } 
});

// 2. Criação do Modelo (se já tiveres 'const User = ...', apenas garante que ele usa o schema acima)
const User = mongoose.models.User || mongoose.model('User', userSchema);

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    // 1. Forçamos os dados a serem Strings puras para não haver erro de tipo
    const email = String(req.body.email).trim();
    const password = String(req.body.password).trim();

    console.log(`Tentativa de login: ${email}`);

    // 2. Procuramos o usuário
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log("Usuário não existe no banco.");
      return res.status(401).json({ message: "E-mail não encontrado." });
    }

    // 3. O TESTE REAL: Vamos logar no console o que está a acontecer
    console.log("Senha do Banco:", `"${user.password}"`);
    console.log("Senha Enviada:", `"${password}"`);

    // Comparamos garantindo que ambos são strings
    if (String(user.password) !== String(password)) {
      console.log("O servidor acha que são diferentes!");
      return res.status(401).json({ message: "Senha incorreta no sistema." });
    }

    // Se chegou aqui, deu certo!
   // No final da tua rota de login, quando o login dá certo:
return res.status(200).json({
  success: true,
  data: {
    token: "...",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileStatus: user.profileStatus // ADICIONA ESTA LINHA AQUI
    }
  }
});
    

  } catch (error: any) {
    return res.status(500).json({ message: "Erro: " + error.message });
  }
});
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Servidor online na porta ${PORT}`);
});