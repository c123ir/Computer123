import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { Logger } from '../utils/logger';
import { Prisma } from '@prisma/client';

export class FormsController {
  // Get all forms
  async getForms(req: Request, res: Response) {
    try {
      const forms = await prisma.form.findMany();
      res.json({
        success: true,
        data: forms
      });
    } catch (error) {
      Logger.error('Error getting forms:', error);
      res.status(500).json({
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

      res.json({
        success: true,
        data: form
      });
    } catch (error) {
      Logger.error('Error getting form by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get form'
      });
    }
  }

  // Create new form
  async createForm(req: Request, res: Response) {
    try {
      const formData = req.body;
      
      const form = await prisma.form.create({
        data: {
          name: formData.name,
          description: formData.description || '',
          fieldsData: formData.fields || [],
          settings: formData.settings || {},
          styling: formData.styling || {},
          metadata: formData.metadata || {},
          status: 'DRAFT',
          createdBy: 'system', // TODO: Get from auth
          category: formData.category,
          tags: formData.tags || []
        } as Prisma.FormCreateInput
      });

      res.status(201).json({
        success: true,
        data: form
      });
    } catch (error) {
      Logger.error('Error creating form:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create form'
      });
    }
  }

  // Update form
  async updateForm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const formData = req.body;

      const form = await prisma.form.update({
        where: { id },
        data: {
          name: formData.name,
          description: formData.description,
          fieldsData: formData.fields,
          settings: formData.settings,
          styling: formData.styling,
          metadata: formData.metadata,
          status: formData.status,
          updatedBy: 'system', // TODO: Get from auth
          category: formData.category,
          tags: formData.tags
        } as Prisma.FormUpdateInput
      });

      res.json({
        success: true,
        data: form
      });
    } catch (error) {
      Logger.error('Error updating form:', error);
      res.status(500).json({
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

      res.json({
        success: true,
        message: 'Form deleted successfully'
      });
    } catch (error) {
      Logger.error('Error deleting form:', error);
      res.status(500).json({
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
          fieldsData: originalForm.fieldsData,
          settings: originalForm.settings,
          styling: originalForm.styling,
          metadata: {
            ...originalForm.metadata as Record<string, unknown>,
            version: 1
          },
          status: 'DRAFT',
          createdBy: 'system', // TODO: Get from auth
          category: originalForm.category,
          tags: originalForm.tags
        } as Prisma.FormCreateInput
      });

      res.status(201).json({
        success: true,
        data: clonedForm
      });
    } catch (error) {
      Logger.error('Error cloning form:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clone form'
      });
    }
  }

  // Update form status
  async updateFormStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const form = await prisma.form.update({
        where: { id },
        data: { status }
      });

      res.json({
        success: true,
        data: form
      });
    } catch (error) {
      Logger.error('Error updating form status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update form status'
      });
    }
  }
}
