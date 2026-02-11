import { Request, Response, NextFunction } from 'express';

// Classe customizada para erros da aplicação
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware global de tratamento de erros
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
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
    const errors = Object.values(err.errors).map((e: any) => e.message);
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

// Middleware: Rota não encontrada (404)
export const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
};

// Helper: Wrapper para async/await
export const asyncHandler =
  (fn: Function) => (_req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(_req, res, next)).catch(next);
  };
