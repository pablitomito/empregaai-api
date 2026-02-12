import express from 'express'; 
// Ou simplesmente remove os nomes que o erro acusou
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json()); // ESSA LINHA É OBRIGATÓRIA


const PORT = process.env.PORT || 5000;
// Aqui ele tenta ler de qualquer um dos nomes que possas ter posto no Render/Vercel
const MONGO_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;


// ... dentro do teu app

app.use(cors({
  origin: 'https://www.pablito.my', // O teu domínio exato (sem a barra no fim!)
  credentials: true,               // Permite o envio de cookies/auth headers
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
  profileStatus: { type: String, default: 'pending' }
});

// 2. Criação do Modelo (se já tiveres 'const User = ...', apenas garante que ele usa o schema acima)
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ROTA DE LOGIN (Ajustada e Profissional)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Procurar o usuário pelo email (usando trim para evitar erros de digitação)
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // 2. Se o usuário não existir
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "E-mail ou palavra-passe incorretos." 
      });
    }

    // 3. Verificar a senha (comparação direta por enquanto)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "E-mail ou palavra-passe incorretos." 
      });
    }

    // 4. SUCESSO! Retornar os dados necessários para o Frontend
    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso!",
      data: {
        token: "token_gerado_" + user._id, // Depois substituiremos por um JWT real
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileStatus: user.profileStatus // FUNDAMENTAL para a lógica do Dashboard
        }
      }
    });

  } catch (error: any) {
    console.error("Erro no login:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erro interno no servidor." 
    });
  }
});
// ROTA DE CADASTRO (O que estava a faltar!)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Verificar se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Este e-mail já está registado." });
    }

    // 2. Criar o novo usuário (com o status 'pending' que combinámos!)
    const newUser = new User({
      fullName,
      email,
      password, // Depois vamos colocar Bcrypt aqui!
      profileStatus: 'pending' 
    });

    // 3. Salvar no MongoDB
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso!",
      data: {
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profileStatus: newUser.profileStatus
        }
      }
    });

  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return res.status(500).json({ message: "Erro ao criar conta." });
  }
});

  
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Servidor online na porta ${PORT}`);
});

