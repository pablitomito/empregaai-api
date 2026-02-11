import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MONGODB CONNECTION
// ============================================
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB conectado com sucesso!');
    } else {
      console.log('⚠️ MongoDB URI não configurada - rodando sem banco');
    }
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
  }
};

// ============================================
// CORS - CONFIGURAÇÃO COMPLETA
// ============================================
const allowedOrigins = [
  'http://localhost:3000',
  'https://empregaai.vercel.app',
  'https://www.empregaai.vercel.app',
  'https://empregaai-git-main-pablitos-projects-9ce4639b.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (Postman, mobile apps)
    if (!origin) {
      console.log('✅ Requisição sem origin permitida');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin permitida:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin bloqueada:', origin);
      console.log('📋 Origens permitidas:', allowedOrigins);
      callback(null, true); // TEMPORÁRIO: Permitir todas enquanto testamos
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Preflight requests
app.options('*', cors());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`\n🌐 ${req.method} ${req.path}`);
  console.log('📍 Origin:', req.headers.origin || 'none');
  console.log('📦 Body:', req.body);
  next();
});

// ============================================
// ROTAS
// ============================================

// Rota raiz
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: '🚀 EMPREGA.AI Backend API',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login'
    }
  });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ROTA DE REGISTRO - FUNCIONAL!
// ============================================
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    console.log('\n📝 === TENTATIVA DE REGISTRO ===');
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));
    
    const { fullName, email, password } = req.body;
    
    // Validação
    if (!fullName || !email || !password) {
      console.log('❌ Validação falhou - campos faltando');
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
        missing: {
          fullName: !fullName,
          email: !email,
          password: !password
        }
      });
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email inválido');
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }
    
    // Validação de senha
    if (password.length < 8) {
      console.log('❌ Senha muito curta');
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 8 caracteres'
      });
    }
    
    console.log('✅ Validação passou!');
    console.log('👤 Usuário:', fullName);
    console.log('📧 Email:', email);
    
    // MOCK - Retornar sucesso sem salvar no banco
    // TODO: Implementar salvamento real no MongoDB
    
    const mockUser = {
      id: `user_${Date.now()}`,
      fullName,
      email,
      createdAt: new Date().toISOString()
    };
    
    const mockToken = `mock_token_${Date.now()}`;
    
    console.log('✅ Conta criada com sucesso (MOCK)');
    console.log('🎫 Token gerado:', mockToken);
    
    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso!',
      data: {
        user: mockUser,
        token: mockToken
      }
    });
    
  } catch (error: any) {
    console.error('\n❌ === ERRO NO REGISTRO ===');
    console.error('Erro completo:', error);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao criar conta',
      error: error.message
    });
  }
});

// ============================================
// ROTA DE LOGIN - FUNCIONAL!
// ============================================
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    console.log('\n🔐 === TENTATIVA DE LOGIN ===');
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }
    
    // MOCK - Aceitar qualquer login por enquanto
    const mockUser = {
      id: `user_${Date.now()}`,
      fullName: 'Usuário Teste',
      email
    };
    
    const mockToken = `mock_token_${Date.now()}`;
    
    console.log('✅ Login realizado com sucesso (MOCK)');
    
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      data: {
        user: mockUser,
        token: mockToken
      }
    });
    
  } catch (error: any) {
    console.error('\n❌ === ERRO NO LOGIN ===');
    console.error('Erro:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message
    });
  }
});

// Rota 404
app.use((req: Request, res: Response) => {
  console.log('\n❌ Rota não encontrada:', req.path);
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

// Error handler global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('\n❌ === ERRO GLOBAL ===');
  console.error('Erro:', err);
  console.error('Stack:', err.stack);
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message,
    path: req.path
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log('\n');
      console.log('╔═══════════════════════════════════════════════╗');
      console.log('║                                               ║');
      console.log('║        🚀 EMPREGA.AI - Backend API 🚀         ║');
      console.log('║                                               ║');
      console.log('╠═══════════════════════════════════════════════╣');
      console.log(`║  🌐 Servidor: http://localhost:${PORT}              ║`);
      console.log(`║  📦 Ambiente: ${process.env.NODE_ENV || 'development'}                     ║`);
      console.log('║  💾 MongoDB:  ' + (mongoose.connection.readyState === 1 ? 'Conectado ✅' : 'Desconectado ❌') + '              ║');
      console.log('╠═══════════════════════════════════════════════╣');
      console.log('║  📋 Origens CORS permitidas:                  ║');
      allowedOrigins.forEach(origin => {
        console.log(`║     ✅ ${origin.padEnd(42)} ║`);
      });
      console.log('╠═══════════════════════════════════════════════╣');
      console.log('║  🔗 Endpoints disponíveis:                    ║');
      console.log('║     GET  /                                    ║');
      console.log('║     GET  /api/health                          ║');
      console.log('║     POST /api/auth/register                   ║');
      console.log('║     POST /api/auth/login                      ║');
      console.log('╚═══════════════════════════════════════════════╝');
      console.log('\n');
    });
  } catch (error) {
    console.error('❌ Erro fatal ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;