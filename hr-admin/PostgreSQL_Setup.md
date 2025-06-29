# راهنمای تنظیم PostgreSQL Backend

## تغییرات انجام شده

✅ **PostgreSQL Backend متصل شد:**
- Firebase service غیرفعال شد
- PostgreSQL service فعال شد  
- API calls حالا به backend PostgreSQL ارسال می‌شوند

## تنظیمات مورد نیاز

### 1. متغیرهای محیطی
فایل `.env` خود را بروزرسانی کنید:

```bash
# PostgreSQL Backend API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_BACKEND_HOST=localhost
REACT_APP_BACKEND_PORT=3001

# Database Type
REACT_APP_DATABASE_TYPE=postgresql

# Firebase غیرفعال شد
REACT_APP_IS_DEMO_MODE=false
```

### 2. Backend API Endpoints
Backend شما باید این endpoint ها را پشتیبانی کند:

#### Forms Management
- `GET /api/forms` - لیست فرم‌ها
- `POST /api/forms` - ایجاد فرم جدید
- `GET /api/forms/:id` - دریافت فرم
- `PUT /api/forms/:id` - بروزرسانی فرم
- `DELETE /api/forms/:id` - حذف فرم
- `POST /api/forms/:id/duplicate` - کپی فرم

#### Form Responses
- `GET /api/forms/:id/responses` - پاسخ‌های فرم
- `POST /api/forms/:id/responses` - ثبت پاسخ جدید
- `GET /api/responses/:id` - دریافت پاسخ خاص
- `PUT /api/responses/:id` - بروزرسانی پاسخ
- `DELETE /api/responses/:id` - حذف پاسخ

#### Templates
- `GET /api/templates` - لیست template ها
- `GET /api/templates/:id` - دریافت template
- `POST /api/templates/:id/create-form` - ایجاد فرم از template

#### Analytics
- `GET /api/forms/:id/stats` - آمار فرم
- `GET /api/stats` - آمار کلی
- `GET /api/dashboard/stats` - آمار dashboard

#### System
- `GET /api/health` - بررسی سلامت
- `POST /api/cache/clear` - پاکسازی cache
- `POST /api/database/optimize` - بهینه‌سازی

### 3. Response Format
Backend باید پاسخ‌ها را در این format ارسال کند:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "totalPages": 5,
    "total": 100,
    "limit": 20
  }
}
```

## فایل‌های تغییر کرده

1. `src/modules/form-builder/services/database/factory.ts` - PostgreSQL service فعال شد
2. `src/modules/form-builder/services/formService.ts` - استفاده از PostgreSQL factory
3. `src/config/firebase.ts` - Firebase غیرفعال شد
4. `src/modules/form-builder/services/database/firebase.service.ts` - Firebase service ساده‌سازی شد
5. `src/components/common/FirebaseConnectionTest.tsx` - تبدیل به PostgreSQL connection test
6. `src/App.tsx` - بروزرسانی imports و components
7. `.env` - تنظیمات PostgreSQL API

## وضعیت فعلی

✅ **Build موفق**: پروژه با موفقیت compile می‌شود (بدون خطا)  
✅ **Runtime آماده**: پروژه روی http://localhost:3000 در دسترس است  
✅ **API Ready**: تمام API calls به PostgreSQL backend ارسال می‌شوند  
✅ **Connection Test**: PostgreSQL backend connection test در development mode فعال است  
✅ **Bundle Size**: حجم bundle کاهش یافت (Firebase dependencies حذف شد)  

## تست Backend

Backend خود را تست کنید:

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/forms
```

اگر backend روی port دیگری است، متغیر `REACT_APP_API_URL` را تغییر دهید.

## نکات مهم

- Firebase کاملاً غیرفعال شده و دیگر API calls به آن ارسال نمی‌شود
- تمام database operations حالا از PostgreSQL service استفاده می‌کند
- Error handling برای connection problems در نظر گرفته شده
- Cache system همچنان فعال است برای بهبود performance 