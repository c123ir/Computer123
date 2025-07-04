import { Request, Response } from 'express';
import { Logger } from '../utils/logger';

export const notFound = (req: Request, res: Response) => {
  Logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      forms: {
        base: '/api/forms',
        endpoints: [
          'GET /',
          'POST /',
          'GET /:id',
          'PUT /:id',
          'DELETE /:id',
          'POST /:id/clone',
          'PATCH /:id/status',
          'GET /:id/responses',
          'POST /:id/responses'
        ]
      },
      menus: {
        base: '/api/menus',
        endpoints: [
          'GET /tree',
          'GET /:id',
          'POST /',
          'PUT /:id',
          'DELETE /:id',
          'POST /reorder',
          'POST /:id/move'
        ]
      },
      system: {
        base: '/',
        endpoints: [
          'GET /health'
        ]
      }
    }
  });
}; 