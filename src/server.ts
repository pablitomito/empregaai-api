import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Carrega o arquivo .env

const app = express();
app.use(express.json()); // Importante para o servidor ler o que vem do frontend

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;

// Configuração do CORS
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Conexão com o MongoDB
mongoose.connect(MONGO_URI as string)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('❌ Erro ao ligar ao MongoDB:', err));

// 1. Criar o "Molde" do Usuário (Schema)
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// 2. Rota de Registro REAL
app.post('/api/auth/register', async (req, res): Promise<any> => { // Adicionamos : Promise<any> para o TS não reclamar
  try {
    const { fullName, email, password } = req.body;

    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      // O return aqui é essencial para o TS saber que a função para aqui
      return res.status(400).json({ message: "Este e-mail já está cadastrado." });
    }

    // Criar novo usuário
    const newUser = await User.create({
      fullName,
      email,
      password 
    });

    // Sempre retornar a resposta final
    return res.status(201).json({
      success: true,
      data: {
        token: "token_real_" + newUser._id, 
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email
        }
      }
    });

  } catch (error) {
    console.error(error);
    // Garantir que o catch também retorne uma resposta
    return res.status(500).json({ message: "Erro interno no servidor ao criar conta." });
  }
});
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Servidor a rodar na porta ${PORT}`);
});