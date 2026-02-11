import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Estender tipo Request do Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: string;
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
}

// Helper: Converter tempo em string (ex: "7d") para segundos
const parseExpiresIn = (value: string | undefined, defaultSeconds: number): number => {
  if (!value) return defaultSeconds;

  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return defaultSeconds;

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return amount;
    case 'm': return amount * 60;
    case 'h': return amount * 60 * 60;
    case 'd': return amount * 24 * 60 * 60;
    default: return defaultSeconds;
  }
};

// Middleware: Proteger rotas
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Não autorizado. Por favor, faça login.' });
      return;
    }

    const secret: string = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as JWTPayload;

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ success: false, message: 'Usuário não encontrado. Token inválido.' });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ success: false, message: 'Conta desativada. Entre em contato com o suporte.' });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ success: false, message: 'Token inválido.' });
      return;
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Token expirado. Por favor, faça login novamente.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Erro ao verificar autenticação.' });
  }
};

// Middleware: Usuário Premium
export const premiumOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
      return;
    }

    if (!req.user.isPremium()) {
      res.status(403).json({
        success: false,
        message: 'Acesso negado. Esta funcionalidade é exclusiva para usuários Premium.',
        upgrade: {
          required: true,
          plan: 'premium',
          price: '€3,99/mês',
          benefits: [
            'Currículos ilimitados',
            'Envio automático até 50 vagas/dia',
            'Cartas de apresentação personalizadas',
            'Matching inteligente de vagas',
          ],
        },
      });
      return;
    }

    next();
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao verificar status Premium.' });
  }
};

// Middleware: Perfil completo
export const requireCompleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
      return;
    }

    if (!req.user.hasCompletedProfile()) {
      res.status(400).json({
        success: false,
        message: 'Por favor, complete seu perfil antes de continuar.',
        redirect: '/onboarding',
      });
      return;
    }

    next();
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao verificar perfil.' });
  }
};

// Helper: Gerar JWT Token
export const generateToken = (userId: string, email: string): string => {
  const secret: string = process.env.JWT_SECRET || 'fallback_secret';
  const expiresInSeconds = parseExpiresIn(process.env.JWT_EXPIRES_IN, 7 * 24 * 60 * 60); // 7 dias

  const options: SignOptions = { expiresIn: expiresInSeconds };
  return jwt.sign({ userId, email }, secret, options);
};

// Helper: Gerar Refresh Token
export const generateRefreshToken = (userId: string): string => {
  const secret: string = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
  const options: SignOptions = { expiresIn: 30 * 24 * 60 * 60 }; // 30 dias em segundos

  return jwt.sign({ userId, type: 'refresh' }, secret, options);
};
