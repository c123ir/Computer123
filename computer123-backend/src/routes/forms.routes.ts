// src/routes/forms.routes.ts

import express from 'express';
import { FormsController } from '../controllers/forms.controller';
import { validateForm } from '../middleware/validate.middleware';

const router = express.Router();
const formsController = new FormsController();

// Forms CRUD
router.get('/', formsController.getForms.bind(formsController));
router.get('/:id', formsController.getFormById.bind(formsController));
router.post('/', validateForm, formsController.createForm.bind(formsController));
router.put('/:id', validateForm, formsController.updateForm.bind(formsController));
router.delete('/:id', formsController.deleteForm.bind(formsController));

// Form operations
router.post('/:id/clone', formsController.cloneForm.bind(formsController));
router.patch('/:id/status', formsController.updateFormStatus.bind(formsController));

export default router;

---

// src/routes/responses.routes.ts

import { Router } from 'express';
// ResponsesController will be implemented later

const router = Router();

// Placeholder routes for now
router.get('/', (req, res) => {
  res.json({ message: 'Responses endpoints - Coming soon!' });
});

export default router;

---

// src/routes/templates.routes.ts

import { Router } from 'express';
// TemplatesController will be implemented later

const router = Router();

// Placeholder routes for now
router.get('/', (req, res) => {
  res.json({ 
    message: 'Templates endpoints - Coming soon!',
    templates: [
      {
        id: 'contact',
        name: 'فرم تماس با ما',
        category: 'عمومی',
        popularity: 95
      },
      {
        id: 'registration', 
        name: 'فرم ثبت‌نام',
        category: 'آموزش',
        popularity: 88
      }
    ]
  });
});

export default router;

---

// src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Duplicate entry found';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
    }
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack 
    })
  });
};

---

// src/middleware/notFound.middleware.ts

import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      forms: '/api/forms',
      health: '/health'
    }
  });
};

---

// src/middleware/validate.middleware.ts

import { Request, Response, NextFunction } from 'express';

// Basic form validation
export const validateForm = (req: Request, res: Response, next: NextFunction) => {
  const { name, fields } = req.body;

  // Required fields check
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Form name is required'
    });
  }

  if (!fields || !Array.isArray(fields)) {
    return res.status(400).json({
      success: false,
      error: 'Form fields must be an array'
    });
  }

  // Validate each field
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    
    if (!field.id || !field.type || !field.label) {
      return res.status(400).json({
        success: false,
        error: `Field at index ${i} is missing required properties (id, type, label)`
      });
    }
  }

  // Form name length check
  if (name.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Form name cannot exceed 255 characters'
    });
  }

  next();
};

---

// src/utils/logger.ts

interface LogData {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp?: string;
}

export class Logger {
  static log({ level, message, data }: Omit<LogData, 'timestamp'>) {
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data })
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify(logEntry, null, 2));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  static info(message: string, data?: any) {
    this.log({ level: 'info', message, data });
  }

  static warn(message: string, data?: any) {
    this.log({ level: 'warn', message, data });
  }

  static error(message: string, data?: any) {
    this.log({ level: 'error', message, data });
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log({ level: 'debug', message, data });
    }
  }
}

---

// package.json scripts section

{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "lint": "eslint src/**/*.ts",
    "test": "jest",
    "type-check": "tsc --noEmit"
  }
}