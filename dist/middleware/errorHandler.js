"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFound = exports.errorHandler = exports.AppError = void 0;
// Classe customizada para erros da aplicação
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Middleware global de tratamento de erros
const errorHandler = (err, _req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Erro interno do servidor';
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Erro:', err);
    }
    if (err.name === 'CastError') {
        err = new AppError(`ID inválido: ${err.value}`, 400);
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err = new AppError(`${field} já existe. Por favor, use outro valor.`, 400);
    }
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        err = new AppError(`Dados inválidos: ${errors.join('. ')}`, 400);
    }
    if (err.name === 'JsonWebTokenError') {
        err = new AppError('Token inválido. Por favor, faça login novamente.', 401);
    }
    if (err.name === 'TokenExpiredError') {
        err = new AppError('Token expirado. Por favor, faça login novamente.', 401);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
// Middleware: Rota não encontrada (404)
const notFound = (_req, res, _next) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
    });
};
exports.notFound = notFound;
// Helper: Wrapper para async/await
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map