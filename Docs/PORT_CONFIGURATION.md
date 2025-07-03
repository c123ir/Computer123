# راهنمای پیکربندی پورت‌ها

## پورت‌های جدید پروژه

🚀 **Frontend (React)**: پورت `3990`  
🔧 **Backend (Node.js + PostgreSQL)**: پورت `3995`

## راه‌اندازی سریع

### 1. تنظیم Frontend
فایل `.env` را در مسیر `hr-admin/` ایجاد کنید:

```bash
# Frontend Development Server Port
PORT=3990

# PostgreSQL Backend API Configuration
REACT_APP_API_URL=http://localhost:3995/api
REACT_APP_BACKEND_HOST=localhost
REACT_APP_BACKEND_PORT=3995

# Database Type
REACT_APP_DATABASE_TYPE=postgresql

# Firebase disabled - using PostgreSQL
REACT_APP_IS_DEMO_MODE=false

# Development Environment
NODE_ENV=development
REACT_APP_ENV=development
```

### 2. تنظیم Backend
فایل `.env` را در مسیر `computer123-backend/` ایجاد کنید:

```bash
# Server Port
PORT=3995

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/computer123_forms"

# CORS Configuration
CORS_ORIGIN=http://localhost:3990

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key

# Environment
NODE_ENV=development
```

## راه‌اندازی پروژه

### Frontend (React)
```bash
cd hr-admin
npm install
npm start
```
✅ Frontend در دسترس خواهد بود: `http://localhost:3990`

### Backend (Node.js)
```bash
cd computer123-backend
npm install
npm run dev
```
✅ Backend در دسترس خواهد بود: `http://localhost:3995`

## تست اتصال

### تست Backend API:
```bash
curl http://localhost:3995/api/health
curl http://localhost:3995/api/forms
```

### تست Frontend:
مرورگر را باز کرده و به آدرس زیر بروید:
```
http://localhost:3990
```

## نکات مهم

1. **Docker**: اگر از Docker استفاده می‌کنید، port mapping ها را در `docker-compose.yml` بروزرسانی کنید
2. **Firewall**: مطمئن شوید که پورت‌های 3990 و 3995 در firewall باز هستند
3. **Environment Variables**: همیشه متغیرهای محیطی را قبل از اجرای پروژه تنظیم کنید
4. **Database**: PostgreSQL باید روی پورت 5432 (default) یا پورت تنظیم شده در DATABASE_URL اجرا شود

## مشکلات متداول

### خطای "Port already in use"
```bash
# Windows
netstat -ano | findstr :3990
netstat -ano | findstr :3995

# macOS/Linux
lsof -ti:3990
lsof -ti:3995
```

### خطای CORS
مطمئن شوید که `CORS_ORIGIN` در backend درست تنظیم شده باشد:
```bash
CORS_ORIGIN=http://localhost:3990
```

### خطای اتصال API
بررسی کنید که `REACT_APP_API_URL` در frontend درست باشد:
```bash
REACT_APP_API_URL=http://localhost:3995/api
```

---

**📝 نکته**: این پورت‌ها برای جلوگیری از تداخل با پورت‌های متداول 3000 و 3001 انتخاب شده‌اند. 