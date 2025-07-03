declare const router: import("express-serve-static-core").Router;
export default router;
export default router;
export default router;
import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorHandler: (error: AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response) => void;
export declare const validateForm: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare class Logger {
    static log({ level, message, data }: Omit<LogData, 'timestamp'>): void;
    static info(message: string, data?: any): void;
    static warn(message: string, data?: any): void;
    static error(message: string, data?: any): void;
    static debug(message: string, data?: any): void;
}
//# sourceMappingURL=forms.routes.d.ts.map