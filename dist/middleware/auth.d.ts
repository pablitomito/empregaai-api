import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            userId?: string;
        }
    }
}
export declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const premiumOnly: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireCompleteProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const generateToken: (userId: string, email: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
//# sourceMappingURL=auth.d.ts.map