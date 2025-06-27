// src/modules/form-builder/types/database.types.ts

/**
 * نوع پایگاه داده
 */
export type DatabaseType = 'firebase' | 'postgresql' | 'mongodb' | 'sqlite' | 'localstorage';

/**
 * تنظیمات پایگاه داده
 */
export interface DatabaseConfig {
  /** نوع پایگاه داده */
  type: DatabaseType;
  /** رشته اتصال (برای SQL databases) */
  connectionString?: string;
  /** تنظیمات اضافی */
  options?: Record<string, any>;
  /** تنظیمات Firebase */
  firebase?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  /** تنظیمات PostgreSQL */
  postgresql?: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl?: boolean;
  };
  /** تنظیمات MongoDB */
  mongodb?: {
    uri: string;
    database: string;
    options?: Record<string, any>;
  };
}

/**
 * فیلترهای query
 */
export interface QueryFilters {
  /** فیلتر بر اساس فیلدها */
  [key: string]: any;
  
  /** فیلترهای خاص */
  status?: 'draft' | 'published' | 'archived' | 'paused';
  createdBy?: string;
  category?: string;
  tags?: string[];
  
  /** فیلتر تاریخ */
  dateRange?: {
    from: string;
    to: string;
    field: 'createdAt' | 'updatedAt';
  };
  
  /** جستجوی متنی */
  search?: {
    query: string;
    fields: string[];
  };
}

/**
 * تنظیمات مرتب‌سازی
 */
export interface SortOptions {
  /** فیلد مرتب‌سازی */
  field: string;
  /** جهت مرتب‌سازی */
  direction: 'asc' | 'desc';
}

/**
 * تنظیمات صفحه‌بندی
 */
export interface PaginationOptions {
  /** شماره صفحه (شروع از 1) */
  page: number;
  /** تعداد آیتم در هر صفحه */
  limit: number;
  /** offset (جایگزین page) */
  offset?: number;
}

/**
 * نتیجه صفحه‌بندی شده
 */
export interface PaginatedResult<T> {
  /** داده‌ها */
  data: T[];
  /** اطلاعات صفحه‌بندی */
  pagination: {
    /** صفحه فعلی */
    currentPage: number;
    /** تعداد کل صفحات */
    totalPages: number;
    /** تعداد کل آیتم‌ها */
    totalItems: number;
    /** تعداد آیتم در این صفحه */
    itemsPerPage: number;
    /** آیا صفحه بعدی وجود دارد؟ */
    hasNextPage: boolean;
    /** آیا صفحه قبلی وجود دارد؟ */
    hasPreviousPage: boolean;
  };
}

/**
 * تراکنش پایگاه داده
 */
export interface DatabaseTransaction {
  /** شناسه تراکنش */
  id: string;
  /** شروع تراکنش */
  begin(): Promise<void>;
  /** commit تراکنش */
  commit(): Promise<void>;
  /** rollback تراکنش */
  rollback(): Promise<void>;
  /** وضعیت تراکنش */
  status: 'pending' | 'committed' | 'rolledback';
}

/**
 * تنظیمات backup
 */
export interface BackupOptions {
  /** نوع backup */
  type: 'full' | 'incremental' | 'differential';
  /** مقصد backup */
  destination: string;
  /** فشرده‌سازی */
  compression: boolean;
  /** رمزگذاری */
  encryption?: {
    enabled: boolean;
    algorithm: string;
    key: string;
  };
  /** فیلترها */
  filters?: {
    tables?: string[];
    dateRange?: {
      from: string;
      to: string;
    };
  };
}

/**
 * آمار پایگاه داده
 */
export interface DatabaseStats {
  /** تعداد کل فرم‌ها */
  totalForms: number;
  /** تعداد کل پاسخ‌ها */
  totalResponses: number;
  /** تعداد فرم‌های فعال */
  activeForms: number;
  /** اندازه پایگاه داده (بایت) */
  databaseSize: number;
  /** آخرین backup */
  lastBackup?: string;
  /** آمار عملکرد */
  performance: {
    /** متوسط زمان query (میلی‌ثانیه) */
    averageQueryTime: number;
    /** تعداد query های امروز */
    todayQueries: number;
    /** خطاهای اخیر */
    recentErrors: number;
  };
}

/**
 * Event های پایگاه داده
 */
export type DatabaseEvent = 
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'queryExecuted'
  | 'transactionStarted'
  | 'transactionCommitted'
  | 'transactionRolledback'
  | 'backupCreated'
  | 'dataImported'
  | 'dataExported';

/**
 * Listener برای event های پایگاه داده
 */
export interface DatabaseEventListener {
  /** نوع event */
  event: DatabaseEvent;
  /** callback function */
  callback: (data: any) => void;
  /** شناسه listener */
  id: string;
}

/**
 * تنظیمات connection pool
 */
export interface ConnectionPoolConfig {
  /** حداقل تعداد connection */
  minConnections: number;
  /** حداکثر تعداد connection */
  maxConnections: number;
  /** timeout برای acquire connection (میلی‌ثانیه) */
  acquireTimeoutMillis: number;
  /** timeout برای idle connection (میلی‌ثانیه) */
  idleTimeoutMillis: number;
  /** بررسی health connection */
  testOnBorrow: boolean;
  /** query برای test connection */
  validationQuery?: string;
}

/**
 * تنظیمات cache
 */
export interface CacheConfig {
  /** فعال/غیرفعال */
  enabled: boolean;
  /** نوع cache */
  type: 'memory' | 'redis' | 'memcached';
  /** TTL پیش‌فرض (ثانیه) */
  defaultTTL: number;
  /** حداکثر اندازه cache (آیتم) */
  maxSize: number;
  /** تنظیمات Redis */
  redis?: {
    host: string;
    port: number;
    password?: string;
    database?: number;
  };
}

/**
 * تنظیمات migration
 */
export interface MigrationConfig {
  /** مسیر فایل‌های migration */
  migrationsPath: string;
  /** جدول ذخیره تاریخچه migration */
  migrationsTable: string;
  /** اجرای خودکار */
  autoRun: boolean;
  /** پشتیبان‌گیری قبل از migration */
  backupBeforeMigration: boolean;
}

/**
 * اطلاعات migration
 */
export interface MigrationInfo {
  /** شناسه migration */
  id: string;
  /** نام migration */
  name: string;
  /** تاریخ اجرا */
  executedAt: string;
  /** مدت زمان اجرا (میلی‌ثانیه) */
  executionTime: number;
  /** وضعیت */
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolledback';
  /** پیام خطا (در صورت شکست) */
  errorMessage?: string;
}

/**
 * تنظیمات index
 */
export interface IndexConfig {
  /** نام index */
  name: string;
  /** فیلدها */
  fields: string[];
  /** نوع index */
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'spgist' | 'brin';
  /** یکتا بودن */
  unique: boolean;
  /** partial index */
  where?: string;
  /** تنظیمات اضافی */
  options?: Record<string, any>;
}

/**
 * آمار performance
 */
export interface PerformanceMetrics {
  /** آمار query ها */
  queries: {
    /** تعداد کل */
    total: number;
    /** تعداد موفق */
    successful: number;
    /** تعداد ناموفق */
    failed: number;
    /** متوسط زمان (میلی‌ثانیه) */
    averageTime: number;
    /** کندترین query */
    slowestQuery: {
      sql: string;
      time: number;
      timestamp: string;
    };
  };
  /** آمار connection */
  connections: {
    /** فعال */
    active: number;
    /** آماده */
    idle: number;
    /** حداکثر */
    max: number;
    /** تعداد کل connection های ایجاد شده */
    totalCreated: number;
  };
  /** آمار cache */
  cache?: {
    /** hit rate (درصد) */
    hitRate: number;
    /** تعداد کل request */
    totalRequests: number;
    /** تعداد hit */
    hits: number;
    /** تعداد miss */
    misses: number;
    /** اندازه فعلی */
    currentSize: number;
  };
}

/**
 * Log entry پایگاه داده
 */
export interface DatabaseLogEntry {
  /** شناسه log */
  id: string;
  /** زمان */
  timestamp: string;
  /** سطح log */
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  /** پیام */
  message: string;
  /** نوع عملیات */
  operation: 'query' | 'transaction' | 'connection' | 'migration' | 'backup';
  /** مدت زمان (میلی‌ثانیه) */
  duration?: number;
  /** جزئیات اضافی */
  metadata?: Record<string, any>;
  /** خطا (در صورت وجود) */
  error?: {
    message: string;
    stack: string;
    code?: string;
  };
}

/**
 * تنظیمات monitoring
 */
export interface MonitoringConfig {
  /** فعال/غیرفعال */
  enabled: boolean;
  /** interval چک سلامت (میلی‌ثانیه) */
  healthCheckInterval: number;
  /** threshold های هشدار */
  alertThresholds: {
    /** زمان query (میلی‌ثانیه) */
    slowQueryTime: number;
    /** درصد connection pool */
    connectionPoolUsage: number;
    /** خطاهای متوالی */
    consecutiveErrors: number;
    /** اندازه پایگاه داده (بایت) */
    databaseSize: number;
  };
  /** webhook برای alert */
  alertWebhook?: string;
  /** ایمیل alert */
  alertEmail?: string[];
}

/**
 * Export options
 */
export interface ExportOptions {
  /** فرمت export */
  format: 'json' | 'csv' | 'xlsx' | 'xml' | 'sql';
  /** فیلترها */
  filters?: QueryFilters;
  /** فیلدهای export */
  fields?: string[];
  /** شامل metadata */
  includeMetadata: boolean;
  /** فشرده‌سازی */
  compression?: 'gzip' | 'zip' | 'none';
  /** تنظیمات خاص فرمت */
  formatOptions?: {
    /** برای CSV */
    delimiter?: string;
    encoding?: string;
    /** برای Excel */
    sheetName?: string;
    /** برای JSON */
    pretty?: boolean;
  };
}

/**
 * Import options
 */
export interface ImportOptions {
  /** فرمت منبع */
  sourceFormat: 'json' | 'csv' | 'xlsx' | 'xml' | 'sql';
  /** نحوه برخورد با conflict */
  conflictResolution: 'skip' | 'overwrite' | 'merge' | 'error';
  /** validation */
  validateData: boolean;
  /** ایجاد backup قبل از import */
  createBackup: boolean;
  /** batch size */
  batchSize: number;
  /** mapping فیلدها */
  fieldMapping?: Record<string, string>;
}

/**
 * نتیجه عملیات batch
 */
export interface BatchResult {
  /** تعداد کل */
  total: number;
  /** تعداد موفق */
  successful: number;
  /** تعداد ناموفق */
  failed: number;
  /** لیست خطاها */
  errors: {
    index: number;
    error: string;
    data?: any;
  }[];
  /** مدت زمان کل (میلی‌ثانیه) */
  duration: number;
}

/**
 * تنظیمات replication
 */
export interface ReplicationConfig {
  /** فعال/غیرفعال */
  enabled: boolean;
  /** نوع replication */
  type: 'master-slave' | 'master-master' | 'cluster';
  /** آدرس master */
  masterUrl?: string;
  /** لیست slave ها */
  slaves?: string[];
  /** تأخیر replication (میلی‌ثانیه) */
  replicationDelay: number;
  /** auto failover */
  autoFailover: boolean;
}

/**
 * Health check result
 */
export interface HealthCheckResult {
  /** وضعیت کلی */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** زمان چک */
  timestamp: string;
  /** مدت زمان response (میلی‌ثانیه) */
  responseTime: number;
  /** جزئیات بررسی‌ها */
  checks: {
    /** نام چک */
    name: string;
    /** وضعیت */
    status: 'pass' | 'fail' | 'warn';
    /** پیام */
    message?: string;
    /** اطلاعات اضافی */
    details?: Record<string, any>;
  }[];
  /** آمار سیستم */
  system?: {
    /** استفاده از CPU (درصد) */
    cpuUsage: number;
    /** استفاده از RAM (درصد) */
    memoryUsage: number;
    /** فضای دیسک (درصد) */
    diskUsage: number;
  };
}