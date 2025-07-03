import express from 'express';
declare const app: import("express-serve-static-core").Express;
export default app;
import app from './app';
import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
declare global {
    var __prisma: PrismaClient | undefined;
}
export { prisma };
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
import { prisma } from '../config/database';
import { Form, FormFilters, PaginatedResponse } from '../types/form.types';
import { Prisma } from '@prisma/client';
export declare class FormService {
    createForm(data: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): Promise<Form>;
    getFormById(id: string): Promise<Form | null>;
    getForms(filters: FormFilters): Promise<PaginatedResponse<Form>>;
    updateForm(id: string, data: Partial<Form>): Promise<Form | null>;
    deleteForm(id: string): Promise<boolean>;
    cloneForm(id: string, createdBy: string): Promise<Form | null>;
    private transformFormFromDB;
}
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/form.types';
export declare class FormsController {
    getForms(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFormById(req: Request, res: Response, next: NextFunction): Promise<express.Response<any, Record<string, any>> | undefined>;
    createForm(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateForm(req: Request, res: Response, next: NextFunction): Promise<express.Response<any, Record<string, any>> | undefined>;
    deleteForm(req: Request, res: Response, next: NextFunction): Promise<express.Response<any, Record<string, any>> | undefined>;
    cloneForm(req: Request, res: Response, next: NextFunction): Promise<express.Response<any, Record<string, any>> | undefined>;
    updateFormStatus(req: Request, res: Response, next: NextFunction): Promise<express.Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=app.d.ts.map