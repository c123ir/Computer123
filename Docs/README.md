# مستندات فنی پروژه فرم‌ساز پویا

## فهرست مستندات

### 1. معماری و ساختار کلی
- [معماری سیستم](./architecture/ARCHITECTURE.md)
- [نقشه راه فنی](./architecture/TECHNICAL_ROADMAP.md)
- [استراتژی توسعه](./architecture/DEVELOPMENT_STRATEGY.md)

### 2. پایگاه داده
- [ساختار پایگاه داده](./database/DATABASE_STRUCTURE.md)
- [روابط و وابستگی‌ها](./database/RELATIONSHIPS.md)
- [استراتژی مهاجرت](./database/MIGRATION_STRATEGY.md)

### 3. فرم‌ساز
- [موتور فرم‌ساز](./form-builder/FORM_ENGINE.md)
- [انواع فیلدها](./form-builder/FIELD_TYPES.md)
- [سیستم اعتبارسنجی](./form-builder/VALIDATION_SYSTEM.md)
- [روابط بین فرم‌ها](./form-builder/FORM_RELATIONSHIPS.md)

### 4. سیستم منو
- [ساختار منوی پویا](./menu-system/MENU_STRUCTURE.md)
- [مدیریت دسترسی‌ها](./menu-system/ACCESS_CONTROL.md)
- [یکپارچه‌سازی با فرم‌ساز](./menu-system/FORM_INTEGRATION.md)

### 5. API و سرویس‌ها
- [مستندات API](./api/API_DOCUMENTATION.md)
- [سرویس‌های پایه](./api/CORE_SERVICES.md)
- [میان‌افزارها](./api/MIDDLEWARE.md)

### 6. رابط کاربری
- [کامپوننت‌های اصلی](./ui/CORE_COMPONENTS.md)
- [فرم‌های پویا](./ui/DYNAMIC_FORMS.md)
- [مدیریت state](./ui/STATE_MANAGEMENT.md)

### 7. امنیت
- [استراتژی امنیتی](./security/SECURITY_STRATEGY.md)
- [مدیریت دسترسی‌ها](./security/ACCESS_CONTROL.md)
- [لاگ و ممیزی](./security/LOGGING_AUDIT.md)

### 8. تست و کیفیت
- [استراتژی تست](./testing/TEST_STRATEGY.md)
- [تست‌های خودکار](./testing/AUTOMATED_TESTS.md)
- [کنترل کیفیت](./testing/QUALITY_CONTROL.md)

### 9. عملیات و نگهداری
- [راهنمای استقرار](./ops/DEPLOYMENT_GUIDE.md)
- [پایش و نگهداری](./ops/MONITORING.md)
- [بهینه‌سازی عملکرد](./ops/PERFORMANCE.md)

## نحوه استفاده از مستندات

1. برای شروع، ابتدا [معماری سیستم](./architecture/ARCHITECTURE.md) را مطالعه کنید.
2. سپس به بخش مورد نظر خود مراجعه کنید.
3. هر بخش شامل:
   - توضیحات فنی
   - دیاگرام‌ها
   - مثال‌های کاربردی
   - چک‌لیست‌های اجرایی

## مشارکت در مستندات

1. لطفاً قبل از ایجاد تغییرات، [راهنمای مشارکت](CONTRIBUTING.md) را مطالعه کنید.
2. تغییرات خود را در شاخه جداگانه ایجاد کنید.
3. درخواست Pull Request ثبت کنید.

## نگهداری مستندات

- مستندات به صورت مداوم به‌روزرسانی می‌شوند.
- هر تغییر در کد باید با به‌روزرسانی مستندات مرتبط همراه باشد.
- نسخه‌های قدیمی مستندات در تاریخچه Git حفظ می‌شوند. 