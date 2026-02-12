import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;

app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Conexão MongoDB
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Conectado'))
    .catch((err) => console.error('❌ Erro Mongo:', err));
}

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

// ROTA DE REGISTRO
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Este e-mail já está cadastrado." });
    }

    const newUser = await User.create({ fullName, email, password });

    return res.status(201).json({
      success: true,
      data: {
        token: "token_real_" + newUser._id,
        user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar conta." });
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Servidor na porta ${PORT}`);
});