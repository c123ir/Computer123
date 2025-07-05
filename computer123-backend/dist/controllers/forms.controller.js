"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsController = void 0;
const database_1 = require("../config/database");
const logger_1 = require("../utils/logger");
class FormsController {
    convertToApiForm(dbForm) {
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
    async getForms(req, res) {
        try {
            const forms = await database_1.prisma.form.findMany();
            return res.json({
                success: true,
                data: forms.map(form => this.convertToApiForm(form))
            });
        }
        catch (error) {
            logger_1.Logger.error('Error getting forms:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to get forms'
            });
        }
    }
    async getFormById(req, res) {
        try {
            const { id } = req.params;
            const form = await database_1.prisma.form.findUnique({
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
        }
        catch (error) {
            logger_1.Logger.error('Error getting form by ID:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to get form'
            });
        }
    }
    async createForm(req, res) {
        try {
            const formData = req.body;
            const form = await database_1.prisma.form.create({
                data: {
                    name: formData.name,
                    description: formData.description || '',
                    fieldsData: JSON.stringify(formData.fields || []),
                    settings: JSON.stringify(formData.settings || {}),
                    styling: JSON.stringify(formData.styling || {}),
                    metadata: JSON.stringify({
                        createdBy: 'system',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        status: 'DRAFT',
                        version: 1
                    }),
                    status: 'DRAFT',
                    createdBy: 'system',
                    category: formData.category,
                    tags: formData.tags || []
                }
            });
            return res.status(201).json({
                success: true,
                data: this.convertToApiForm(form)
            });
        }
        catch (error) {
            logger_1.Logger.error('Error creating form:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to create form'
            });
        }
    }
    async updateForm(req, res) {
        try {
            const { id } = req.params;
            const formData = req.body;
            const updateData = {
                ...(formData.name && { name: formData.name }),
                ...(formData.description && { description: formData.description }),
                ...(formData.fields && { fieldsData: JSON.stringify(formData.fields) }),
                ...(formData.settings && { settings: JSON.stringify(formData.settings) }),
                ...(formData.styling && { styling: JSON.stringify(formData.styling) }),
                ...(formData.metadata && { metadata: JSON.stringify(formData.metadata) }),
                ...(formData.status && { status: formData.status }),
                updatedBy: 'system',
                ...(formData.category && { category: formData.category }),
                ...(formData.tags && { tags: formData.tags })
            };
            const form = await database_1.prisma.form.update({
                where: { id },
                data: updateData
            });
            return res.json({
                success: true,
                data: this.convertToApiForm(form)
            });
        }
        catch (error) {
            logger_1.Logger.error('Error updating form:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to update form'
            });
        }
    }
    async deleteForm(req, res) {
        try {
            const { id } = req.params;
            await database_1.prisma.form.delete({
                where: { id }
            });
            return res.json({
                success: true,
                message: 'Form deleted successfully'
            });
        }
        catch (error) {
            logger_1.Logger.error('Error deleting form:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to delete form'
            });
        }
    }
    async cloneForm(req, res) {
        try {
            const { id } = req.params;
            const originalForm = await database_1.prisma.form.findUnique({
                where: { id }
            });
            if (!originalForm) {
                return res.status(404).json({
                    success: false,
                    error: 'Form not found'
                });
            }
            const clonedForm = await database_1.prisma.form.create({
                data: {
                    name: `${originalForm.name} (کپی)`,
                    description: originalForm.description,
                    fieldsData: JSON.stringify(JSON.parse(originalForm.fieldsData || '[]')),
                    settings: JSON.stringify(JSON.parse(originalForm.settings || '{}')),
                    styling: JSON.stringify(JSON.parse(originalForm.styling || '{}')),
                    metadata: JSON.stringify({
                        createdBy: 'system',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        status: 'DRAFT',
                        version: 1
                    }),
                    status: 'DRAFT',
                    createdBy: 'system',
                    category: originalForm.category,
                    tags: originalForm.tags
                }
            });
            return res.status(201).json({
                success: true,
                data: this.convertToApiForm(clonedForm)
            });
        }
        catch (error) {
            logger_1.Logger.error('Error cloning form:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to clone form'
            });
        }
    }
    async updateFormStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const form = await database_1.prisma.form.update({
                where: { id },
                data: { status }
            });
            return res.json({
                success: true,
                data: this.convertToApiForm(form)
            });
        }
        catch (error) {
            logger_1.Logger.error('Error updating form status:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to update form status'
            });
        }
    }
}
exports.FormsController = FormsController;
//# sourceMappingURL=forms.controller.js.map