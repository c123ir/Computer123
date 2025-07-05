import { Request, Response, NextFunction } from 'express';
export declare const validateForm: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateMenu: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateMenuReorder: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateMenuMove: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=validate.middleware.d.ts.map