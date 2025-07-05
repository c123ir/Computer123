import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FormService {
  /**
   * ایجاد یک پنل جدید در فرم
   */
  static async createPanel(formId: string, panelData: any) {
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
    } catch (error) {
      console.error('Error creating panel:', error);
      throw error;
    }
  }

  /**
   * به‌روزرسانی تنظیمات پنل
   */
  static async updatePanel(panelId: string, panelData: any) {
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
    } catch (error) {
      console.error('Error updating panel:', error);
      throw error;
    }
  }

  /**
   * اضافه کردن فیلد به پنل
   */
  static async addFieldToPanel(panelId: string, fieldId: string) {
    try {
      const field = await prisma.formField.update({
        where: { id: fieldId },
        data: {
          parentId: panelId
        }
      });

      return field;
    } catch (error) {
      console.error('Error adding field to panel:', error);
      throw error;
    }
  }

  /**
   * حذف فیلد از پنل
   */
  static async removeFieldFromPanel(fieldId: string) {
    try {
      const field = await prisma.formField.update({
        where: { id: fieldId },
        data: {
          parentId: null
        }
      });

      return field;
    } catch (error) {
      console.error('Error removing field from panel:', error);
      throw error;
    }
  }

  /**
   * دریافت فیلدهای داخل پنل
   */
  static async getPanelFields(panelId: string) {
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
    } catch (error) {
      console.error('Error getting panel fields:', error);
      throw error;
    }
  }

  /**
   * مرتب‌سازی فیلدهای داخل پنل
   */
  static async reorderPanelFields(panelId: string, fieldIds: string[]) {
    try {
      const updates = fieldIds.map((fieldId, index) => 
        prisma.formField.update({
          where: { id: fieldId },
          data: { order: index }
        })
      );

      await prisma.$transaction(updates);

      return await this.getPanelFields(panelId);
    } catch (error) {
      console.error('Error reordering panel fields:', error);
      throw error;
    }
  }
}
