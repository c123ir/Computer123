"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const form_service_1 = require("../services/form.service");
const router = (0, express_1.Router)();
router.post('/:formId/panels', async (req, res) => {
    try {
        const { formId } = req.params;
        const panel = await form_service_1.FormService.createPanel(formId, req.body);
        res.json({ success: true, data: panel });
    }
    catch (error) {
        console.error('Error creating panel:', error);
        res.status(500).json({ success: false, message: error.message || 'خطا در ایجاد پنل' });
    }
});
router.put('/panels/:panelId', async (req, res) => {
    try {
        const { panelId } = req.params;
        const panel = await form_service_1.FormService.updatePanel(panelId, req.body);
        res.json({ success: true, data: panel });
    }
    catch (error) {
        console.error('Error updating panel:', error);
        res.status(500).json({ success: false, message: error.message || 'خطا در به‌روزرسانی پنل' });
    }
});
router.post('/panels/:panelId/fields/:fieldId', async (req, res) => {
    try {
        const { panelId, fieldId } = req.params;
        const field = await form_service_1.FormService.addFieldToPanel(panelId, fieldId);
        res.json({ success: true, data: field });
    }
    catch (error) {
        console.error('Error adding field to panel:', error);
        res.status(500).json({ success: false, message: error.message || 'خطا در اضافه کردن فیلد به پنل' });
    }
});
router.delete('/panels/:panelId/fields/:fieldId', async (req, res) => {
    try {
        const { fieldId } = req.params;
        const field = await form_service_1.FormService.removeFieldFromPanel(fieldId);
        res.json({ success: true, data: field });
    }
    catch (error) {
        console.error('Error removing field from panel:', error);
        res.status(500).json({ success: false, message: error.message || 'خطا در حذف فیلد از پنل' });
    }
});
router.get('/panels/:panelId/fields', async (req, res) => {
    try {
        const { panelId } = req.params;
        const fields = await form_service_1.FormService.getPanelFields(panelId);
        res.json({ success: true, data: fields });
    }
    catch (error) {
        console.error('Error getting panel fields:', error);
        res.status(500).json({ success: false, message: error.message || 'خطا در دریافت فیلدهای پنل' });
    }
});
router.put('/panels/:panelId/fields/reorder', async (req, res) => {
    try {
        const { panelId } = req.params;
        const { fieldIds } = req.body;
        const fields = await form_service_1.FormService.reorderPanelFields(panelId, fieldIds);
        res.json({ success: true, data: fields });
    }
    catch (error) {
        console.error('Error reordering panel fields:', error);
        res.status(500).json({ success: false, message: error.message || 'خطا در مرتب‌سازی فیلدهای پنل' });
    }
});
exports.default = router;
//# sourceMappingURL=form.routes.js.map