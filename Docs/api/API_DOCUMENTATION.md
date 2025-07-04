# مستندات API

## معرفی
این سند API‌های اصلی سیستم را توصیف می‌کند. API‌ها در دو بخش REST و GraphQL ارائه می‌شوند.

## REST API

### 1. مدیریت فرم‌ها

#### 1.1. ایجاد فرم جدید
```http
POST /api/forms
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "فرم جدید",
  "description": "توضیحات فرم",
  "fields": [
    {
      "type": "text",
      "label": "نام",
      "required": true
    }
  ],
  "settings": {
    "submitLabel": "ثبت",
    "showReset": true
  }
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "فرم جدید",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

#### 1.2. دریافت فرم
```http
GET /api/forms/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "فرم جدید",
    "fields": [...],
    "settings": {...},
    "metadata": {...}
  }
}
```

#### 1.3. به‌روزرسانی فرم
```http
PUT /api/forms/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "نام جدید",
  "fields": [...]
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "نام جدید",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

### 2. مدیریت منوها

#### 2.1. ایجاد منو
```http
POST /api/menus
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "منوی جدید",
  "type": "form",
  "config": {
    "formId": "uuid",
    "viewType": "list"
  },
  "permissions": ["view_menu"]
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "منوی جدید"
  }
}
```

#### 2.2. دریافت ساختار منو
```http
GET /api/menus/structure
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "منو اصلی",
        "children": [...]
      }
    ]
  }
}
```

### 3. مدیریت پاسخ‌ها

#### 3.1. ثبت پاسخ
```http
POST /api/forms/{formId}/responses
Content-Type: application/json
Authorization: Bearer {token}

{
  "data": {
    "field1": "value1",
    "field2": "value2"
  },
  "metadata": {
    "browser": "Chrome",
    "platform": "Web"
  }
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "submittedAt": "2024-01-01T12:00:00Z"
  }
}
```

#### 3.2. دریافت پاسخ‌ها
```http
GET /api/forms/{formId}/responses
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
```

## GraphQL API

### 1. Schema

#### 1.1. Types
```graphql
type Form {
  id: ID!
  name: String!
  description: String
  fields: [FormField!]!
  settings: JSONObject
  metadata: JSONObject
  responses: [FormResponse!]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type FormField {
  id: ID!
  type: String!
  label: String!
  required: Boolean!
  config: JSONObject
  validation: JSONObject
}

type Menu {
  id: ID!
  title: String!
  type: MenuType!
  config: JSONObject
  children: [Menu!]
  form: Form
}

type FormResponse {
  id: ID!
  form: Form!
  data: JSONObject!
  submittedAt: DateTime!
}
```

#### 1.2. Queries
```graphql
type Query {
  # فرم‌ها
  form(id: ID!): Form
  forms(filter: FormFilter): [Form!]!
  
  # منوها
  menu(id: ID!): Menu
  menuStructure: [Menu!]!
  
  # پاسخ‌ها
  formResponses(
    formId: ID!
    filter: ResponseFilter
    pagination: PaginationInput
  ): FormResponseConnection!
}
```

#### 1.3. Mutations
```graphql
type Mutation {
  # فرم‌ها
  createForm(input: CreateFormInput!): Form!
  updateForm(id: ID!, input: UpdateFormInput!): Form!
  deleteForm(id: ID!): Boolean!
  
  # منوها
  createMenu(input: CreateMenuInput!): Menu!
  updateMenu(id: ID!, input: UpdateMenuInput!): Menu!
  moveMenuItem(id: ID!, parentId: ID): Menu!
  
  # پاسخ‌ها
  submitFormResponse(
    formId: ID!
    data: JSONObject!
  ): FormResponse!
}
```

### 2. نمونه‌های استفاده

#### 2.1. دریافت فرم با فیلدها
```graphql
query GetForm($id: ID!) {
  form(id: $id) {
    id
    name
    fields {
      id
      type
      label
      required
      config
    }
    settings
  }
}
```

#### 2.2. دریافت ساختار منو
```graphql
query GetMenuStructure {
  menuStructure {
    id
    title
    type
    children {
      id
      title
      type
      form {
        id
        name
      }
    }
  }
}
```

#### 2.3. ثبت پاسخ فرم
```graphql
mutation SubmitResponse($formId: ID!, $data: JSONObject!) {
  submitFormResponse(
    formId: $formId,
    data: $data
  ) {
    id
    submittedAt
  }
}
```

## میان‌افزارها

### 1. احراز هویت
```typescript
interface AuthMiddleware {
  // بررسی توکن
  validateToken(token: string): Promise<User>;
  
  // بررسی دسترسی
  checkPermission(user: User, resource: string, action: string): boolean;
  
  // بررسی نقش
  checkRole(user: User, role: string): boolean;
}
```

### 2. لاگینگ
```typescript
interface LoggingMiddleware {
  // لاگ درخواست
  logRequest(req: Request, res: Response): void;
  
  // لاگ خطا
  logError(error: Error, context: ErrorContext): void;
  
  // لاگ عملیات
  logOperation(operation: Operation, result: OperationResult): void;
}
```

### 3. کش
```typescript
interface CacheMiddleware {
  // کش درخواست
  cacheResponse(key: string, data: any, ttl: number): void;
  
  // دریافت از کش
  getCached(key: string): Promise<any>;
  
  // حذف از کش
  invalidateCache(pattern: string): void;
}
```

## مدیریت خطاها

### 1. کدهای خطا
```typescript
enum ErrorCodes {
  // خطاهای احراز هویت
  INVALID_TOKEN = 'AUTH001',
  TOKEN_EXPIRED = 'AUTH002',
  INSUFFICIENT_PERMISSIONS = 'AUTH003',
  
  // خطاهای فرم
  FORM_NOT_FOUND = 'FORM001',
  INVALID_FORM_DATA = 'FORM002',
  VALIDATION_ERROR = 'FORM003',
  
  // خطاهای منو
  MENU_NOT_FOUND = 'MENU001',
  INVALID_MENU_TYPE = 'MENU002',
  CIRCULAR_DEPENDENCY = 'MENU003'
}
```

### 2. ساختار پاسخ خطا
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string; // فقط در محیط توسعه
  };
}
```

## نکات امنیتی

### 1. احراز هویت
- استفاده از JWT
- تنظیم مدت اعتبار توکن
- Refresh token

### 2. دسترسی‌ها
- RBAC (Role-Based Access Control)
- دسترسی در سطح فیلد
- لاگ دسترسی‌ها

### 3. امنیت API
- Rate limiting
- CORS
- Input validation

## چک‌لیست پیاده‌سازی

### فاز 1: API‌های پایه
- [ ] پیاده‌سازی CRUD فرم‌ها
- [ ] پیاده‌سازی CRUD منوها
- [ ] مدیریت پاسخ‌ها
- [ ] میان‌افزارهای پایه

### فاز 2: GraphQL
- [ ] تعریف Schema
- [ ] پیاده‌سازی Resolver‌ها
- [ ] بهینه‌سازی Query‌ها
- [ ] مدیریت خطاها

### فاز 3: امنیت و کارایی
- [ ] پیاده‌سازی احراز هویت
- [ ] مدیریت دسترسی‌ها
- [ ] کش‌گذاری
- [ ] Rate limiting

### فاز 4: مستندسازی و تست
- [ ] مستندات Swagger/OpenAPI
- [ ] تست‌های یکپارچگی
- [ ] تست‌های امنیتی
- [ ] مستندات GraphQL 