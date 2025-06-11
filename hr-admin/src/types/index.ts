// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'customer';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  profileImage?: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  customerType: 'individual' | 'business';
  registrationDate: Date;
  totalPurchases: number;
  status: 'active' | 'inactive';
  tags: string[];
}

export interface Sale {
  id: string;
  customerId: string;
  employeeId: string;
  products: SaleItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'installment';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'cancelled';
  saleDate: Date;
  status: 'draft' | 'confirmed' | 'delivered' | 'cancelled';
  notes?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warranty?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  minStock: number;
  description?: string;
  specifications: Record<string, any>;
  images: string[];
  status: 'active' | 'inactive' | 'discontinued';
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  investmentAmount: number;
  investmentDate: Date;
  shareholding: number; // percentage
  documents: Document[];
  status: 'active' | 'inactive';
  returns: InvestmentReturn[];
}

export interface InvestmentReturn {
  id: string;
  amount: number;
  date: Date;
  type: 'dividend' | 'profit_share' | 'bonus';
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  category: 'customer' | 'product' | 'sale' | 'general';
  usageCount: number;
  createdAt: Date;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  status: 'active' | 'inactive' | 'draft';
  category: string;
  submissions: FormSubmission[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'file';
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedBy?: string;
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewNotes?: string;
}

export interface SMS {
  id: string;
  recipients: string[];
  message: string;
  status: 'pending' | 'sent' | 'failed' | 'scheduled';
  scheduledAt?: Date;
  sentAt?: Date;
  cost: number;
  campaign?: string;
  template?: string;
  deliveryReport: SMSDeliveryReport[];
}

export interface SMSDeliveryReport {
  phoneNumber: string;
  status: 'delivered' | 'failed' | 'pending';
  deliveredAt?: Date;
  errorMessage?: string;
}

export interface Document {
  id: string;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  category: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
  parentId?: string; // for versioning
  permissions: DocumentPermission[];
  downloadCount: number;
  description?: string;
}

export interface DocumentPermission {
  userId: string;
  role: string;
  permissions: ('read' | 'write' | 'delete' | 'share')[];
}

export interface AITask {
  id: string;
  type: 'text_generation' | 'image_analysis' | 'data_analysis' | 'chatbot' | 'automation';
  title: string;
  description?: string;
  input: any;
  output?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  cost?: number;
  model?: string;
  parameters?: Record<string, any>;
}

export interface Report {
  id: string;
  title: string;
  type: 'sales' | 'customer' | 'employee' | 'financial' | 'inventory' | 'custom';
  description?: string;
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  format: 'pdf' | 'excel' | 'csv' | 'html';
  recipients: string[];
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
  status: 'active' | 'inactive';
}

export interface ReportParameter {
  name: string;
  type: 'date' | 'select' | 'number' | 'text';
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string; // HH:mm format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  isActive: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  category: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  status: 'active' | 'inactive' | 'draft';
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  executions: WorkflowExecution[];
}

export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'event' | 'webhook';
  config: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'loop' | 'delay';
  name: string;
  config: Record<string, any>;
  nextSteps: string[];
  order: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  currentStep?: string;
  logs: WorkflowLog[];
  context: Record<string, any>;
}

export interface WorkflowLog {
  stepId: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
}

export interface Database {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'mongodb' | 'sqlite' | 'oracle';
  host: string;
  port: number;
  database: string;
  username: string;
  isConnected: boolean;
  lastConnection?: Date;
  tables: DatabaseTable[];
  backups: DatabaseBackup[];
  queries: DatabaseQuery[];
}

export interface DatabaseTable {
  name: string;
  rowCount: number;
  sizeInMB: number;
  lastUpdated: Date;
  columns: DatabaseColumn[];
}

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: string;
}

export interface DatabaseBackup {
  id: string;
  fileName: string;
  filePath: string;
  sizeInMB: number;
  createdAt: Date;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'failed' | 'in_progress';
}

export interface DatabaseQuery {
  id: string;
  name: string;
  sql: string;
  description?: string;
  category: string;
  isFavorite: boolean;
  lastExecuted?: Date;
  executionTime?: number;
  createdBy: string;
  createdAt: Date;
}

// Theme and UI Types
export interface Theme {
  mode: 'light' | 'dark';
}

export interface MenuItem {
  id: string;
  title: string;
  icon: any;
  path: string;
  description?: string;
  children?: MenuItem[];
}

export interface NotificationConfig {
  email: boolean;
  sms: boolean;
  push: boolean;
  types: string[];
}

export interface SystemSettings {
  companyName: string;
  companyLogo?: string;
  timezone: string;
  currency: string;
  language: 'fa' | 'en';
  theme: Theme;
  notifications: NotificationConfig;
  backupSettings: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number; // days
  };
  securitySettings: {
    sessionTimeout: number; // minutes
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    twoFactorEnabled: boolean;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard Stats
export interface DashboardStats {
  sales: {
    today: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    active: number;
  };
  employees: {
    total: number;
    present: number;
    absent: number;
    onLeave: number;
  };
  inventory: {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
  };
}