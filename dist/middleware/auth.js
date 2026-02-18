"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = exports.requireCompleteProfile = exports.premiumOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Helper: Converter tempo em string (ex: "7d") para segundos
const parseExpiresIn = (value, defaultSeconds) => {
    if (!value)
        return defaultSeconds;
    const match = value.match(/^(\d+)([smhd])$/);
    if (!match)
        return defaultSeconds;
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
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({ success: false, message: 'Não autorizado. Por favor, faça login.' });
            return;
        }
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await User_1.default.findById(decoded.userId).select('-password');
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
    }
    catch (error) {
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
exports.protect = protect;
// Middleware: Usuário Premium
const premiumOnly = async (req, res, next) => {
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
    }
    catch {
        res.status(500).json({ success: false, message: 'Erro ao verificar status Premium.' });
    }
};
exports.premiumOnly = premiumOnly;
// Middleware: Perfil completo
const requireCompleteProfile = async (req, res, next) => {
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
    }
    catch {
        res.status(500).json({ success: false, message: 'Erro ao verificar perfil.' });
    }
};
exports.requireCompleteProfile = requireCompleteProfile;
// Helper: Gerar JWT Token
const generateToken = (userId, email) => {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const expiresInSeconds = parseExpiresIn(process.env.JWT_EXPIRES_IN, 7 * 24 * 60 * 60); // 7 dias
    const options = { expiresIn: expiresInSeconds };
    return jsonwebtoken_1.default.sign({ userId, email }, secret, options);
};
exports.generateToken = generateToken;
// Helper: Gerar Refresh Token
const generateRefreshToken = (userId) => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
    const options = { expiresIn: 30 * 24 * 60 * 60 }; // 30 dias em segundos
    return jsonwebtoken_1.default.sign({ userId, type: 'refresh' }, secret, options);
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=auth.js.map