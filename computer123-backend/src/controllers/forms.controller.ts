import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { Logger } from '../utils/logger';
import { Prisma, FormStatus } from '@prisma/client';
import { Form } from '../types/form.types';

export class FormsController {
  // Convert database form to API form
  private convertToApiForm(dbForm: any): Form {
    return {
      id: dbForm.id,
      name: dbForm.name,
      description: dbForm.description,
      fields: JSON.parse(dbForm.fieldsData || '[]'),
      settings: JSON.parse(dbForm.settings || '{}'),
      styling: JSON.parse(dbForm.styling || '{}'),
      metadata: JSON.parse(dbForm.metadata || '{}'),
      status: dbForm.status,
      category: dbForm.category,
      tags: dbForm.tags,
      createdAt: dbForm.createdAt,
      updatedAt: dbForm.updatedAt
    };
  }

  // Get all forms
  async getForms(req: Request, res: Response) {
    try {
      const forms = await prisma.form.findMany();
      return res.json({
        success: true,
        data: forms.map(form => this.convertToApiForm(form))
      });
    } catch (error) {
      Logger.error('Error getting forms:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get forms'
      });
    }
  }

  // Get form by ID
  async getFormById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const form = await prisma.form.findUnique({
        where: { id }
      });

      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      return res.json({
        success: true,
        data: this.convertToApiForm(form)
      });
    } catch (error) {
      Logger.error('Error getting form by ID:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get form'
      });
    }
  }

  // Create new form
  async createForm(req: Request<any, any, Form>, res: Response) {
    try {
      const formData = req.body;
      
      const form = await prisma.form.create({
        data: {
          name: formData.name,
          description: formData.description || '',
          fieldsData: JSON.stringify(formData.fields || []) as any,
          settings: JSON.stringify(formData.settings || {}) as any,
          styling: JSON.stringify(formData.styling || {}) as any,
          metadata: JSON.stringify({
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'DRAFT',
            version: 1
          }) as any,
          status: 'DRAFT',
          createdBy: 'system', // TODO: Get from auth
          category: formData.category,
          tags: formData.tags || []
        }
      });

      return res.status(201).json({
        success: true,
        data: this.convertToApiForm(form)
      });
    } catch (error) {
      Logger.error('Error creating form:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create form'
      });
    }
  }

  // Update form
  async updateForm(req: Request<{ id: string }, any, Partial<Form>>, res: Response) {
    try {
      const { id } = req.params;
      const formData = req.body;

      const updateData: Prisma.FormUpdateInput = {
        ...(formData.name && { name: formData.name }),
        ...(formData.description && { description: formData.description }),
        ...(formData.fields && { fieldsData: JSON.stringify(formData.fields) as any }),
        ...(formData.settings && { settings: JSON.stringify(formData.settings) as any }),
        ...(formData.styling && { styling: JSON.stringify(formData.styling) as any }),
        ...(formData.metadata && { metadata: JSON.stringify(formData.metadata) as any }),
        ...(formData.status && { status: formData.status }),
        updatedBy: 'system', // TODO: Get from auth
        ...(formData.category && { category: formData.category }),
        ...(formData.tags && { tags: formData.tags })
      };

      const form = await prisma.form.update({
        where: { id },
        data: updateData
      });

      return res.json({
        success: true,
        data: this.convertToApiForm(form)
      });
    } catch (error) {
      Logger.error('Error updating form:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update form'
      });
    }
  }

  // Delete form
  async deleteForm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.form.delete({
        where: { id }
      });

      return res.json({
        success: true,
        message: 'Form deleted successfully'
      });
    } catch (error) {
      Logger.error('Error deleting form:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete form'
      });
    }
  }

  // Clone form
  async cloneForm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const originalForm = await prisma.form.findUnique({
        where: { id }
      });

      if (!originalForm) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      const clonedForm = await prisma.form.create({
        data: {
          name: `${originalForm.name} (کپی)`,
          description: originalForm.description,
          fieldsData: JSON.stringify(JSON.parse(originalForm.fieldsData || '[]')) as any,
          settings: JSON.stringify(JSON.parse(originalForm.settings || '{}')) as any,
          styling: JSON.stringify(JSON.parse(originalForm.styling || '{}')) as any,
          metadata: JSON.stringify({
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'DRAFT',
            version: 1
          }) as any,
          status: 'DRAFT',
          createdBy: 'system', // TODO: Get from auth
          category: originalForm.category,
          tags: originalForm.tags
        }
      });

      return res.status(201).json({
        success: true,
        data: this.convertToApiForm(clonedForm)
      });
    } catch (error) {
      Logger.error('Error cloning form:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to clone form'
      });
    }
  }

  // Update form status
  async updateFormStatus(req: Request<{ id: string }, any, { status: FormStatus }>, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const form = await prisma.form.update({
        where: { id },
        data: { status }
      });

      return res.json({
        success: true,
        data: this.convertToApiForm(form)
      });
    } catch (error) {
      Logger.error('Error updating form status:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update form status'
      });
    }
  }
}
