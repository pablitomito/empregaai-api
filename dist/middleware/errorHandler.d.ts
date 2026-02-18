import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare const errorHandler: (err: any, _req: Request, res: Response, _next: NextFunction) => void;
export declare const notFound: (_req: Request, res: Response, _next: NextFunction) => void;
export declare const asyncHandler: (fn: any) => (req: any, res: any, next: any) => void;
//# sourceMappingURL=errorHandler.d.ts.map