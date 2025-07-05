import { Request, Response } from 'express';
import { Logger } from '../utils/logger';

export const notFound = (req: Request, res: Response) => {
  Logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      forms: '/api/forms',
      health: '/health'
    }
  });
}; 