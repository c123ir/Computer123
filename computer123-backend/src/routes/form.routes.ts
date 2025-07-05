import { Router } from 'express';
import { FormService } from '../services/form.service';

const router = Router();

// ... existing routes ...

/**
 * ایجاد پنل جدید
 */
router.post('/:formId/panels', async (req, res) => {
  try {
    const { formId } = req.params;
    const panel = await FormService.createPanel(formId, req.body);
    res.json({ success: true, data: panel });
  } catch (error: any) {
    console.error('Error creating panel:', error);
    res.status(500).json({ success: false, message: error.message || 'خطا در ایجاد پنل' });
  }
});

/**
 * به‌روزرسانی تنظیمات پنل
 */
router.put('/panels/:panelId', async (req, res) => {
  try {
    const { panelId } = req.params;
    const panel = await FormService.updatePanel(panelId, req.body);
    res.json({ success: true, data: panel });
  } catch (error: any) {
    console.error('Error updating panel:', error);
    res.status(500).json({ success: false, message: error.message || 'خطا در به‌روزرسانی پنل' });
  }
});

/**
 * اضافه کردن فیلد به پنل
 */
router.post('/panels/:panelId/fields/:fieldId', async (req, res) => {
  try {
    const { panelId, fieldId } = req.params;
    const field = await FormService.addFieldToPanel(panelId, fieldId);
    res.json({ success: true, data: field });
  } catch (error: any) {
    console.error('Error adding field to panel:', error);
    res.status(500).json({ success: false, message: error.message || 'خطا در اضافه کردن فیلد به پنل' });
  }
});

/**
 * حذف فیلد از پنل
 */
router.delete('/panels/:panelId/fields/:fieldId', async (req, res) => {
  try {
    const { fieldId } = req.params;
    const field = await FormService.removeFieldFromPanel(fieldId);
    res.json({ success: true, data: field });
  } catch (error: any) {
    console.error('Error removing field from panel:', error);
    res.status(500).json({ success: false, message: error.message || 'خطا در حذف فیلد از پنل' });
  }
});

/**
 * دریافت فیلدهای داخل پنل
 */
router.get('/panels/:panelId/fields', async (req, res) => {
  try {
    const { panelId } = req.params;
    const fields = await FormService.getPanelFields(panelId);
    res.json({ success: true, data: fields });
  } catch (error: any) {
    console.error('Error getting panel fields:', error);
    res.status(500).json({ success: false, message: error.message || 'خطا در دریافت فیلدهای پنل' });
  }
});

/**
 * مرتب‌سازی فیلدهای داخل پنل
 */
router.put('/panels/:panelId/fields/reorder', async (req, res) => {
  try {
    const { panelId } = req.params;
    const { fieldIds } = req.body;
    const fields = await FormService.reorderPanelFields(panelId, fieldIds);
    res.json({ success: true, data: fields });
  } catch (error: any) {
    console.error('Error reordering panel fields:', error);
    res.status(500).json({ success: false, message: error.message || 'خطا در مرتب‌سازی فیلدهای پنل' });
  }
});

export default router; 