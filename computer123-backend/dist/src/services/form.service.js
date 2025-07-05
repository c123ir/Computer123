"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FormService {
    static async createPanel(formId, panelData) {
        try {
            const panel = await prisma.formField.create({
                data: {
                    formId,
                    type: 'panel',
                    label: panelData.title || 'پنل جدید',
                    isPanel: true,
                    required: false,
                    order: panelData.order || 0,
                    config: {},
                    panelConfig: {
                        columns: panelData.columns || 1,
                        collapsible: panelData.collapsible || true,
                        defaultCollapsed: panelData.defaultCollapsed || false,
                        padding: panelData.padding || 'md',
                        margin: panelData.margin || 'md',
                        shadow: panelData.shadow || 'md',
                        backgroundColor: panelData.backgroundColor || '#ffffff',
                        borderColor: panelData.borderColor || '#e5e7eb',
                        borderRadius: panelData.borderRadius || 8,
                        backgroundOpacity: panelData.backgroundOpacity || 1
                    }
                }
            });
            return panel;
        }
        catch (error) {
            console.error('Error creating panel:', error);
            throw error;
        }
    }
    static async updatePanel(panelId, panelData) {
        try {
            const panel = await prisma.formField.update({
                where: { id: panelId },
                data: {
                    label: panelData.title,
                    panelConfig: {
                        columns: panelData.columns,
                        collapsible: panelData.collapsible,
                        defaultCollapsed: panelData.defaultCollapsed,
                        padding: panelData.padding,
                        margin: panelData.margin,
                        shadow: panelData.shadow,
                        backgroundColor: panelData.backgroundColor,
                        borderColor: panelData.borderColor,
                        borderRadius: panelData.borderRadius,
                        backgroundOpacity: panelData.backgroundOpacity
                    }
                }
            });
            return panel;
        }
        catch (error) {
            console.error('Error updating panel:', error);
            throw error;
        }
    }
    static async addFieldToPanel(panelId, fieldId) {
        try {
            const field = await prisma.formField.update({
                where: { id: fieldId },
                data: {
                    parentId: panelId
                }
            });
            return field;
        }
        catch (error) {
            console.error('Error adding field to panel:', error);
            throw error;
        }
    }
    static async removeFieldFromPanel(fieldId) {
        try {
            const field = await prisma.formField.update({
                where: { id: fieldId },
                data: {
                    parentId: null
                }
            });
            return field;
        }
        catch (error) {
            console.error('Error removing field from panel:', error);
            throw error;
        }
    }
    static async getPanelFields(panelId) {
        try {
            const fields = await prisma.formField.findMany({
                where: {
                    parentId: panelId
                },
                orderBy: {
                    order: 'asc'
                }
            });
            return fields;
        }
        catch (error) {
            console.error('Error getting panel fields:', error);
            throw error;
        }
    }
    static async reorderPanelFields(panelId, fieldIds) {
        try {
            const updates = fieldIds.map((fieldId, index) => prisma.formField.update({
                where: { id: fieldId },
                data: { order: index }
            }));
            await prisma.$transaction(updates);
            return await this.getPanelFields(panelId);
        }
        catch (error) {
            console.error('Error reordering panel fields:', error);
            throw error;
        }
    }
}
exports.FormService = FormService;
//# sourceMappingURL=form.service.js.map