# 📚 راهنمای کامل Migration به PostgreSQL + Backend
## مجتمع کامپیوتر یک دو سه - فرم‌ساز

**تاریخ:** 29 ژوئن 2025  
**وضعیت فعلی:** React Frontend + Firebase (مشکل‌دار)  
**هدف:** React Frontend + Node.js Backend + PostgreSQL  

---

## 🎯 **خلاصه اجرایی**

### **وضعیت فعلی:**
- ✅ React Frontend با فرم‌ساز کامل
- ✅ Database Abstraction Layer آماده  
- ❌ Firebase connection issues
- ❌ عدم کنترل کامل بر database

### **هدف نهایی:**
- ✅ Frontend مستقل با localStorage موقت
- ✅ Node.js + Express Backend
- ✅ PostgreSQL Database محلی
- ✅ REST API کامل برای فرم‌ساز
- ✅ آماده‌سازی برای production deployment

---

## 🏗️ **Architecture جدید**

```
┌─────────────────┐    HTTP/REST     ┌─────────────────┐    SQL/ORM    ┌─────────────────┐
│   React App     │ ◄─────────────► │  Node.js API    │ ◄───────────► │   PostgreSQL    │
│   (Frontend)    │                 │   (Backend)     │               │   (Database)    │
│                 │                 │                 │               │                 │
│ - FormBuilder   │                 │ - Express       │               │ - forms table   │
│ - FormsList     │                 │ - Prisma ORM    │               │ - responses     │
│ - CreateModal   │                 │ - TypeScript    │               │ - users table   │
│ - FormCard      │                 │ - Validation    │               │ - templates     │
└─────────────────┘                 └─────────────────┘               └─────────────────┘
```

---

## 📋 **Migration Plan - مرحله به مرحله**

### **Phase 1: Local Database Setup** ⏱️ *2-3 ساعت*

#### **1.1 PostgreSQL Installation**
```bash
# Windows (Chocolatey):
choco install postgresql

# Windows (Direct):
# دانلود از: https://www.postgresql.org/download/windows/

# macOS (Homebrew):
brew install postgresql
brew services start postgresql

# Linux (Ubuntu):
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### **1.2 Database Setup**
```sql
-- اتصال به PostgreSQL
psql -U postgres

-- ایجاد database
CREATE DATABASE computer123_forms;

-- ایجاد user اختصاصی
CREATE USER form_builder WITH PASSWORD 'your_secure_password';

-- دادن دسترسی‌ها
GRANT ALL PRIVILEGES ON DATABASE computer123_forms TO form_builder;

-- خروج
\q
```

#### **1.3 Environment Variables**
```bash
# .env.local (برای backend)
DATABASE_URL="postgresql://form_builder:your_secure_password@localhost:5432/computer123_forms"
NODE_ENV=development
PORT=3001
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000

# .env (برای frontend - آپدیت)
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_DATABASE_TYPE=postgresql
REACT_APP_ENV=development
```

---

### **Phase 2: Backend Development** ⏱️ *4-5 ساعت*

#### **2.1 Project Structure**
```
computer123-backend/
├── src/
│   ├── config/
│   │   ├── database.ts         # Prisma configuration
│   │   └── env.ts              # Environment validation
│   ├── controllers/
│   │   ├── forms.controller.ts      # Form CRUD operations
│   │   ├── responses.controller.ts  # Response management
│   │   └── templates.controller.ts  # Form templates
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Authentication
│   │   ├── validate.middleware.ts   # Request validation
│   │   └── error.middleware.ts      # Error handling
│   ├── models/
│   │   └── index.ts            # Prisma client export
│   ├── routes/
│   │   ├── forms.routes.ts     # Forms endpoints
│   │   ├── responses.routes.ts # Responses endpoints
│   │   └── index.ts            # Route aggregation
│   ├── services/
│   │   ├── form.service.ts     # Business logic
│   │   ├── response.service.ts # Response logic
│   │   └── validation.service.ts # Form validation
│   ├── types/
│   │   ├── form.types.ts       # Form types (shared with frontend)
│   │   └── api.types.ts        # API response types
│   ├── utils/
│   │   ├── logger.ts           # Logging utility
│   │   └── helpers.ts          # Helper functions
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Initial data
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
└── README.md
```

#### **2.2 Database Schema (Prisma)**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Form {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(255)
  description String?  @db.Text
  
  // JSON fields for flexibility
  fields      Json     // فیلدهای فرم
  settings    Json     // تنظیمات عمومی فرم
  styling     Json     // تنظیمات ظاهری
  metadata    Json     // اطلاعات meta
  
  // Status and tracking
  status      FormStatus @default(DRAFT)
  version     Int        @default(1)
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relations
  responses   FormResponse[]
  
  // Indexes
  @@index([status])
  @@index([createdAt])
  @@map("forms")
}

model FormResponse {
  id            String   @id @default(cuid())
  formId        String   @map("form_id")
  
  // Response data
  answers       Json     // پاسخ‌های کاربر
  submitterInfo Json?    @map("submitter_info") // اطلاعات ارسال‌کننده
  metadata      Json     // اطلاعات meta پاسخ
  
  // Status and timing
  status        ResponseStatus @default(COMPLETED)
  submittedAt   DateTime @default(now()) @map("submitted_at")
  duration      Int?     // مدت زمان پر کردن (ثانیه)
  
  // Relations
  form Form @relation(fields: [formId], references: [id], onDelete: Cascade)
  
  // Indexes
  @@index([formId])
  @@index([submittedAt])
  @@map("form_responses")
}

model FormTemplate {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(255)
  description String   @db.Text
  category    String   @db.VarChar(100)
  
  // Template data
  formData    Json     @map("form_data") // ساختار فرم template
  preview     String?  @db.Text // URL تصویر پیش‌نمایش
  tags        String[] // برچسب‌ها
  
  // Metadata
  popularity  Int      @default(0) // محبوبیت
  isActive    Boolean  @default(true) @map("is_active")
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@index([category])
  @@index([popularity])
  @@map("form_templates")
}

enum FormStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  PAUSED
}

enum ResponseStatus {
  DRAFT
  COMPLETED
  PARTIAL
}
```

#### **2.3 API Endpoints Design**
```typescript
// REST API Structure

// Forms Management
GET    /api/forms              // لیست فرم‌ها + فیلتر + جستجو
POST   /api/forms              // ایجاد فرم جدید
GET    /api/forms/:id          // جزئیات فرم
PUT    /api/forms/:id          // ویرایش فرم
DELETE /api/forms/:id          // حذف فرم
POST   /api/forms/:id/clone    // کپی فرم

// Form Status Management
PATCH  /api/forms/:id/status   // تغییر وضعیت فرم
PATCH  /api/forms/:id/publish  // انتشار فرم
PATCH  /api/forms/:id/archive  // آرشیو فرم

// Form Responses
GET    /api/forms/:id/responses         // پاسخ‌های یک فرم
POST   /api/forms/:id/responses         // ثبت پاسخ جدید
GET    /api/forms/:id/responses/export  // خروجی Excel/CSV
GET    /api/forms/:id/analytics         // آمار فرم

// Form Templates
GET    /api/templates          // لیست templates
GET    /api/templates/:id      // جزئیات template
POST   /api/forms/from-template/:templateId // ایجاد فرم از template

// Public API (برای فرم‌های منتشر شده)
GET    /api/public/forms/:id   // فرم عمومی
POST   /api/public/forms/:id/submit // ارسال پاسخ
```

---

### **Phase 3: Frontend Integration** ⏱️ *2-3 ساعت*

#### **3.1 API Service Layer**
```typescript
// src/services/api/client.ts
class ApiClient {
  private baseURL = process.env.REACT_APP_API_URL;
  
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // CRUD methods
  get<T>(endpoint: string) { return this.request<T>(endpoint); }
  post<T>(endpoint: string, data: any) { 
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }); 
  }
  put<T>(endpoint: string, data: any) { 
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }); 
  }
  delete<T>(endpoint: string) { 
    return this.request<T>(endpoint, { method: 'DELETE' }); 
  }
}

export const apiClient = new ApiClient();
```

#### **3.2 PostgreSQL Database Service**
```typescript
// src/modules/form-builder/services/database/postgresql.service.ts
export class PostgreSQLService implements DatabaseService {
  private apiClient = new ApiClient();

  async create(collectionName: string, data: any): Promise<string> {
    if (collectionName === 'forms') {
      const response = await this.apiClient.post<{id: string}>('/forms', data);
      return response.id;
    }
    throw new Error(`Collection ${collectionName} not supported`);
  }

  async read(collectionName: string, id: string): Promise<any> {
    if (collectionName === 'forms') {
      return await this.apiClient.get(`/forms/${id}`);
    }
    return null;
  }

  async update(collectionName: string, id: string, data: any): Promise<boolean> {
    try {
      if (collectionName === 'forms') {
        await this.apiClient.put(`/forms/${id}`, data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async delete(collectionName: string, id: string): Promise<boolean> {
    try {
      if (collectionName === 'forms') {
        await this.apiClient.delete(`/forms/${id}`);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async list(collectionName: string, filters?: FormFilters): Promise<any[]> {
    if (collectionName === 'forms') {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.category) queryParams.append('category', filters.category);
      
      return await this.apiClient.get(`/forms?${queryParams.toString()}`);
    }
    return [];
  }

  // سایر متدها...
}
```

#### **3.3 Database Factory Update**
```typescript
// src/modules/form-builder/services/database/factory.ts
export class DatabaseServiceFactory {
  static create(type: DatabaseType): DatabaseService {
    switch (type) {
      case 'firebase':
        return new FirebaseService();
      case 'postgresql':
        return new PostgreSQLService(); // جدید!
      case 'localStorage':
        return new LocalStorageService();
      case 'memory':
        return new MemoryDatabaseService();
      default:
        throw new Error(`Database type ${type} not supported`);
    }
  }
}
```

---

### **Phase 4: Development Workflow** ⏱️ *1 ساعت*

#### **4.1 Development Scripts**
```json
// package.json (Backend)
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  }
}

// package.json (Frontend) - آپدیت
{
  "scripts": {
    "start": "react-scripts start",
    "start:with-backend": "concurrently \"npm run start\" \"cd ../computer123-backend && npm run dev\"",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

#### **4.2 Docker Setup (اختیاری برای آینده)**
```dockerfile
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: computer123_forms
      POSTGRES_USER: form_builder
      POSTGRES_PASSWORD: your_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./computer123-backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://form_builder:your_secure_password@postgres:5432/computer123_forms
    depends_on:
      - postgres

  frontend:
    build: ./hr-admin
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://backend:3001/api

volumes:
  postgres_data:
```

---

## 🔄 **Migration Steps - اجرایی**

### **مرحله ۱: Backup وضعیت فعلی** 
```bash
# ذخیره کد فعلی
git add .
git commit -m "Pre-PostgreSQL migration backup"
git branch postgresql-migration
git checkout postgresql-migration
```

### **مرحله ۲: Database Setup**
```bash
# نصب PostgreSQL
# ایجاد database
# تست اتصال
psql -U form_builder -d computer123_forms -h localhost
```

### **مرحله ۳: Backend Development**
```bash
# ایجاد پروژه backend
mkdir computer123-backend
cd computer123-backend
npm init -y

# نصب dependencies
npm install express prisma @prisma/client bcryptjs jsonwebtoken cors helmet morgan
npm install -D @types/express @types/bcryptjs @types/jsonwebtoken @types/cors nodemon tsx typescript

# Setup Prisma
npx prisma init
# کپی schema.prisma از بالا
npx prisma migrate dev --name initial
npx prisma generate
```

### **مرحله ۴: Frontend Integration**
```bash
# بازگشت به frontend
cd ../hr-admin

# نصب dependencies جدید
npm install axios @tanstack/react-query

# آپدیت Database Factory
# تست integration
```

### **مرحله ۵: Testing & Validation**
```bash
# تست backend
cd computer123-backend
npm run dev

# تست frontend (terminal جدید)
cd hr-admin
npm start

# تست کامل workflow:
# 1. ایجاد فرم جدید
# 2. ذخیره در PostgreSQL
# 3. نمایش در لیست
# 4. ویرایش فرم
# 5. حذف فرم
```

---

## 📊 **Success Metrics**

### **Technical KPIs:**
- ✅ Database connection success rate: 100%
- ✅ API response time: < 200ms
- ✅ Form creation time: < 5 seconds
- ✅ Data integrity: 100%
- ✅ Zero data loss during migration

### **Functional KPIs:**
- ✅ تمام فیچرهای فرم‌ساز کار کند
- ✅ CRUD operations روی فرم‌ها
- ✅ فیلتر و جستجو
- ✅ Templates integration
- ✅ Response management

---

## 🚀 **Production Readiness**

### **مرحله بعدی (آینده):**
```bash
# Deployment options:
1. VPS + Docker         # کنترل کامل
2. Railway + PostgreSQL # ساده و سریع  
3. Vercel + Supabase   # Serverless
4. AWS + RDS           # Enterprise scale
```

### **Performance Optimization:**
```typescript
// Caching strategy
- Redis برای session management
- Query caching برای forms
- CDN برای static assets
- Database indexing optimization
```

### **Security:**
```typescript
// Security measures
- JWT authentication
- Input validation & sanitization
- SQL injection prevention (Prisma)
- Rate limiting
- HTTPS enforcement
- Environment variables
```

---

## 🎯 **روادمپ اجرا**

### **هفته ۱: Database + Backend Core**
- Database setup و schema
- Basic CRUD APIs
- Authentication skeleton

### **هفته ۲: Frontend Integration**
- API service layer
- Database service update
- Testing و debugging

### **هفته ۳: Advanced Features**
- Response management
- Analytics و reporting
- Performance optimization

### **هفته ۴: Production Preparation**
- Security hardening
- Deployment setup
- Documentation
- Testing coverage

---

## 💡 **نکات مهم**

### **⚠️ نکات Migration:**
1. **تدریجی باشید** - یک feature در هر مرحله
2. **Backup همیشه** - قبل از هر تغییر
3. **Test محلی** - قبل از production
4. **Documentation** - هر تغییر مستند کنید

### **🔧 Troubleshooting:**
1. **PostgreSQL connection issues** - بررسی port و credentials
2. **CORS errors** - تنظیم header های مناسب
3. **TypeScript errors** - sync کردن types بین frontend/backend
4. **Performance issues** - monitoring و profiling

---

**آماده شروع هستیم! 🚀**

*این مستند roadmap کامل شما برای migration به PostgreSQL است. هر مرحله detail دارد و step-by-step اجرا می‌شود.*