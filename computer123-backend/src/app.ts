// src/app.ts - Express App Setup

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import formsRoutes from './routes/forms.routes';
import responsesRoutes from './routes/responses.routes';
import templatesRoutes from './routes/templates.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/forms', formsRoutes);
app.use('/api/responses', responsesRoutes);
app.use('/api/templates', templatesRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

---

// src/server.ts - Server Entry Point

import app from './app';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Database connection test
async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown() {
  console.log('🔄 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

startServer();

---

// src/config/database.ts - Database Configuration

import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances in development
const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export { prisma };

---

// src/types/form.types.ts - Shared Types (مطابق Frontend)

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation: ValidationRules;
  styling: FieldStyling;
  options?: FieldOption[];
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  metadata: FormMetadata;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PAUSED';
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submitterInfo?: any;
  metadata: ResponseMetadata;
  status: 'DRAFT' | 'COMPLETED' | 'PARTIAL';
  submittedAt: string;
  duration?: number;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  formData: Omit<Form, 'id' | 'metadata'>;
  preview?: string;
  tags: string[];
  popularity: number;
  isActive: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query filters
export interface FormFilters {
  search?: string;
  status?: string;
  category?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'responses';
  sortOrder?: 'asc' | 'desc';
}

---

// src/services/form.service.ts - Business Logic

import { prisma } from '../config/database';
import { Form, FormFilters, PaginatedResponse } from '../types/form.types';
import { Prisma } from '@prisma/client';

export class FormService {
  
  // ایجاد فرم جدید
  async createForm(data: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): Promise<Form> {
    const form = await prisma.form.create({
      data: {
        name: data.name,
        description: data.description,
        fields: data.fields as Prisma.JsonValue,
        settings: data.settings as Prisma.JsonValue,
        styling: data.styling as Prisma.JsonValue,
        metadata: data.metadata as Prisma.JsonValue,
        status: data.status as any,
        category: data.category,
        tags: data.tags || [],
        createdBy: data.metadata.createdBy,
      }
    });

    return this.transformFormFromDB(form);
  }

  // دریافت فرم با ID
  async getFormById(id: string): Promise<Form | null> {
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        _count: {
          select: { responses: true }
        }
      }
    });

    if (!form) return null;
    return this.transformFormFromDB(form);
  }

  // لیست فرم‌ها با فیلتر
  async getForms(filters: FormFilters): Promise<PaginatedResponse<Form>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.FormWhereInput = {};
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.createdBy) {
      where.createdBy = filters.createdBy;
    }

    // Build orderBy
    const orderBy: Prisma.FormOrderByWithRelationInput = {};
    const sortBy = filters.sortBy || 'updatedAt';
    const sortOrder = filters.sortOrder || 'desc';

    if (sortBy === 'responses') {
      orderBy.responses = { _count: sortOrder };
    } else {
      orderBy[sortBy as keyof Prisma.FormOrderByWithRelationInput] = sortOrder;
    }

    // Execute queries
    const [forms, total] = await Promise.all([
      prisma.form.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: { responses: true }
          }
        }
      }),
      prisma.form.count({ where })
    ]);

    const transformedForms = forms.map(form => this.transformFormFromDB(form));

    return {
      success: true,
      data: transformedForms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // ویرایش فرم
  async updateForm(id: string, data: Partial<Form>): Promise<Form | null> {
    try {
      const form = await prisma.form.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.fields && { fields: data.fields as Prisma.JsonValue }),
          ...(data.settings && { settings: data.settings as Prisma.JsonValue }),
          ...(data.styling && { styling: data.styling as Prisma.JsonValue }),
          ...(data.metadata && { metadata: data.metadata as Prisma.JsonValue }),
          ...(data.status && { status: data.status as any }),
          ...(data.category !== undefined && { category: data.category }),
          ...(data.tags && { tags: data.tags }),
          ...(data.metadata?.updatedBy && { updatedBy: data.metadata.updatedBy }),
        }
      });

      return this.transformFormFromDB(form);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // Form not found
      }
      throw error;
    }
  }

  // حذف فرم
  async deleteForm(id: string): Promise<boolean> {
    try {
      await prisma.form.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false; // Form not found
      }
      throw error;
    }
  }

  // کپی فرم
  async cloneForm(id: string, createdBy: string): Promise<Form | null> {
    const originalForm = await this.getFormById(id);
    if (!originalForm) return null;

    const clonedData = {
      ...originalForm,
      name: `${originalForm.name} (کپی)`,
      status: 'DRAFT' as const,
      metadata: {
        ...originalForm.metadata,
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    delete (clonedData as any).id;
    delete (clonedData as any).createdAt;
    delete (clonedData as any).updatedAt;

    return await this.createForm(clonedData);
  }

  // Helper: Transform database result to API format
  private transformFormFromDB(dbForm: any): Form {
    return {
      id: dbForm.id,
      name: dbForm.name,
      description: dbForm.description,
      fields: dbForm.fields,
      settings: dbForm.settings,
      styling: dbForm.styling,
      metadata: {
        ...dbForm.metadata,
        ...(dbForm._count?.responses !== undefined && {
          stats: {
            ...dbForm.metadata.stats,
            totalSubmissions: dbForm._count.responses
          }
        })
      },
      status: dbForm.status,
      category: dbForm.category,
      tags: dbForm.tags,
      createdAt: dbForm.createdAt.toISOString(),
      updatedAt: dbForm.updatedAt.toISOString()
    };
  }
}

---

// src/controllers/forms.controller.ts - API Controllers

import { Request, Response, NextFunction } from 'express';
import { FormService } from '../services/form.service';
import { ApiResponse, FormFilters } from '../types/form.types';

const formService = new FormService();

export class FormsController {
  
  // GET /api/forms
  async getForms(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: FormFilters = {
        search: req.query.search as string,
        status: req.query.status as string,
        category: req.query.category as string,
        createdBy: req.query.createdBy as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await formService.getForms(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/forms/:id
  async getFormById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const form = await formService.getFormById(id);
      
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      res.json({
        success: true,
        data: form
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/forms
  async createForm(req: Request, res: Response, next: NextFunction) {
    try {
      const formData = {
        ...req.body,
        metadata: {
          ...req.body.metadata,
          createdBy: req.body.metadata?.createdBy || 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          status: req.body.status || 'DRAFT'
        }
      };

      const form = await formService.createForm(formData);
      
      res.status(201).json({
        success: true,
        data: form,
        message: 'Form created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/forms/:id
  async updateForm(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        metadata: {
          ...req.body.metadata,
          updatedAt: new Date().toISOString(),
          updatedBy: req.body.metadata?.updatedBy || 'system'
        }
      };

      const form = await formService.updateForm(id, updateData);
      
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      res.json({
        success: true,
        data: form,
        message: 'Form updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/forms/:id
  async deleteForm(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await formService.deleteForm(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      res.json({
        success: true,
        message: 'Form deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/forms/:id/clone
  async cloneForm(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { createdBy } = req.body;
      
      const clonedForm = await formService.cloneForm(id, createdBy || 'system');
      
      if (!clonedForm) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      res.status(201).json({
        success: true,
        data: clonedForm,
        message: 'Form cloned successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/forms/:id/status
  async updateFormStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, updatedBy } = req.body;
      
      const form = await formService.updateForm(id, { 
        status,
        metadata: {
          updatedBy: updatedBy || 'system',
          updatedAt: new Date().toISOString()
        }
      });
      
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      res.json({
        success: true,
        data: form,
        message: `Form ${status.toLowerCase()} successfully`
      });
    } catch (error) {
      next(error);
    }
  }
}