// src/modules/form-builder/services/database/interface.ts

import {
    Form,
    FormResponse,
    FormTemplate,
    CreateFormDto,
    UpdateFormDto,
    FormFilters,
    PaginationOptions,
    PaginatedResult,
    SortOptions,
    DatabaseStats,
    ExportOptions,
    ImportOptions,
    BatchResult,
    HealthCheckResult
  } from '../../types';
  
  /**
   * Interface اصلی برای تمام سرویس‌های پایگاه داده
   * این interface abstraction layer را فراهم می‌کند
   */
  export interface DatabaseService {
    // =================================
    // Form Management
    // =================================
  
    /**
     * ایجاد فرم جدید
     * @param form اطلاعات فرم
     * @returns شناسه فرم ایجاد شده
     */
    createForm(form: CreateFormDto): Promise<string>;
  
    /**
     * دریافت فرم بر اساس شناسه
     * @param id شناسه فرم
     * @returns فرم یا null
     */
    getForm(id: string): Promise<Form | null>;
  
    /**
     * بروزرسانی فرم
     * @param id شناسه فرم
     * @param updates تغییرات
     */
    updateForm(id: string, updates: UpdateFormDto): Promise<void>;
  
    /**
     * حذف فرم
     * @param id شناسه فرم
     */
    deleteForm(id: string): Promise<void>;
  
    /**
     * لیست فرم‌ها با فیلتر و صفحه‌بندی
     * @param filters فیلترها
     * @param pagination صفحه‌بندی
     * @param sort مرتب‌سازی
     * @returns لیست فرم‌ها
     */
    listForms(
      filters?: FormFilters,
      pagination?: PaginationOptions,
      sort?: SortOptions
    ): Promise<PaginatedResult<Form>>;
  
    /**
     * جستجو در فرم‌ها
     * @param query متن جستجو
     * @param filters فیلترها
     * @param pagination صفحه‌بندی
     * @returns نتایج جستجو
     */
    searchForms(
      query: string,
      filters?: FormFilters,
      pagination?: PaginationOptions
    ): Promise<PaginatedResult<Form>>;
  
    /**
     * کپی فرم
     * @param id شناسه فرم مبدا
     * @param newName نام فرم جدید
     * @returns شناسه فرم کپی شده
     */
    duplicateForm(id: string, newName: string): Promise<string>;
  
    // =================================
    // Form Responses
    // =================================
  
    /**
     * ثبت پاسخ جدید
     * @param formId شناسه فرم
     * @param response پاسخ‌ها
     * @param metadata اطلاعات اضافی
     * @returns شناسه پاسخ
     */
    createResponse(
      formId: string,
      response: Record<string, any>,
      metadata?: Record<string, any>
    ): Promise<string>;
  
    /**
     * دریافت پاسخ‌های یک فرم
     * @param formId شناسه فرم
     * @param filters فیلترها
     * @param pagination صفحه‌بندی
     * @returns لیست پاسخ‌ها
     */
    getResponses(
      formId: string,
      filters?: QueryFilters,
      pagination?: PaginationOptions
    ): Promise<PaginatedResult<FormResponse>>;
  
    /**
     * دریافت یک پاسخ خاص
     * @param responseId شناسه پاسخ
     * @returns پاسخ یا null
     */
    getResponse(responseId: string): Promise<FormResponse | null>;
  
    /**
     * بروزرسانی پاسخ
     * @param responseId شناسه پاسخ
     * @param updates تغییرات
     */
    updateResponse(
      responseId: string,
      updates: Partial<FormResponse>
    ): Promise<void>;
  
    /**
     * حذف پاسخ
     * @param responseId شناسه پاسخ
     */
    deleteResponse(responseId: string): Promise<void>;
  
    /**
     * حذف تمام پاسخ‌های یک فرم
     * @param formId شناسه فرم
     */
    deleteAllResponses(formId: string): Promise<void>;
  
    // =================================
    // Templates
    // =================================
  
    /**
     * لیست template ها
     * @param category دسته‌بندی
     * @returns لیست template ها
     */
    getTemplates(category?: string): Promise<FormTemplate[]>;
  
    /**
     * دریافت template
     * @param id شناسه template
     * @returns template یا null
     */
    getTemplate(id: string): Promise<FormTemplate | null>;
  
    /**
     * ایجاد فرم از template
     * @param templateId شناسه template
     * @param formName نام فرم جدید
     * @returns شناسه فرم ایجاد شده
     */
    createFormFromTemplate(templateId: string, formName: string): Promise<string>;
  
    // =================================
    // Analytics & Statistics
    // =================================
  
    /**
     * آمار یک فرم
     * @param formId شناسه فرم
     * @returns آمار فرم
     */
    getFormStats(formId: string): Promise<{
      totalViews: number;
      totalSubmissions: number;
      completionRate: number;
      averageTime: number;
      topExitFields: string[];
      submissionsByDate: { date: string; count: number }[];
    }>;
  
    /**
     * آمار کلی
     * @returns آمار کل سیستم
     */
    getOverallStats(): Promise<DatabaseStats>;
  
    /**
     * آمار dashboard
     * @param userId شناسه کاربر
     * @returns آمار dashboard
     */
    getDashboardStats(userId?: string): Promise<{
      totalForms: number;
      totalResponses: number;
      recentActivity: any[];
      popularForms: Form[];
      trendsData: any[];
    }>;
  
    // =================================
    // Data Management
    // =================================
  
    /**
     * Export داده‌ها
     * @param formId شناسه فرم (اختیاری)
     * @param options تنظیمات export
     * @returns فایل export شده
     */
    exportData(formId?: string, options?: ExportOptions): Promise<Blob>;
  
    /**
     * Import داده‌ها
     * @param file فایل import
     * @param options تنظیمات import
     * @returns نتیجه import
     */
    importData(file: File, options?: ImportOptions): Promise<BatchResult>;
  
    /**
     * Backup تمام داده‌ها
     * @returns فایل backup
     */
    createBackup(): Promise<Blob>;
  
    /**
     * Restore از backup
     * @param backupFile فایل backup
     * @returns نتیجه restore
     */
    restoreFromBackup(backupFile: File): Promise<BatchResult>;
  
    // =================================
    // System Management
    // =================================
  
    /**
     * بررسی سلامت پایگاه داده
     * @returns نتیجه بررسی
     */
    healthCheck(): Promise<HealthCheckResult>;
  
    /**
     * تست اتصال
     * @returns آیا متصل است؟
     */
    testConnection(): Promise<boolean>;
  
    /**
     * پاکسازی cache
     */
    clearCache(): Promise<void>;
  
    /**
     * بهینه‌سازی پایگاه داده
     */
    optimize(): Promise<void>;
  
    /**
     * دریافت تنظیمات
     */
    getConfig(): Promise<Record<string, any>>;
  
    /**
     * بروزرسانی تنظیمات
     * @param config تنظیمات جدید
     */
    updateConfig(config: Record<string, any>): Promise<void>;
  }
  
  /**
   * Interface برای Real-time updates
   */
  export interface RealtimeService {
    /**
     * Subscribe به تغییرات فرم
     * @param formId شناسه فرم
     * @param callback تابع callback
     * @returns unsubscribe function
     */
    subscribeToForm(
      formId: string,
      callback: (form: Form) => void
    ): () => void;
  
    /**
     * Subscribe به پاسخ‌های جدید
     * @param formId شناسه فرم
     * @param callback تابع callback
     * @returns unsubscribe function
     */
    subscribeToResponses(
      formId: string,
      callback: (response: FormResponse) => void
    ): () => void;
  
    /**
     * ارسال event real-time
     * @param event نوع event
     * @param data داده‌ها
     */
    emit(event: string, data: any): void;
  
    /**
     * Listen به event
     * @param event نوع event
     * @param callback تابع callback
     * @returns unsubscribe function
     */
    on(event: string, callback: (data: any) => void): () => void;
  }
  
  /**
   * Interface برای Cache Management
   */
  export interface CacheService {
    /**
     * دریافت از cache
     * @param key کلید
     * @returns مقدار یا null
     */
    get<T>(key: string): Promise<T | null>;
  
    /**
     * ذخیره در cache
     * @param key کلید
     * @param value مقدار
     * @param ttl مدت زمان (ثانیه)
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
  
    /**
     * حذف از cache
     * @param key کلید
     */
    delete(key: string): Promise<void>;
  
    /**
     * پاکسازی کل cache
     */
    clear(): Promise<void>;
  
    /**
     * بررسی وجود کلید
     * @param key کلید
     * @returns آیا وجود دارد؟
     */
    exists(key: string): Promise<boolean>;
  
    /**
     * تنظیم TTL جدید
     * @param key کلید
     * @param ttl مدت زمان جدید (ثانیه)
     */
    expire(key: string, ttl: number): Promise<void>;
  }
  
  /**
   * Interface برای File Storage
   */
  export interface StorageService {
    /**
     * آپلود فایل
     * @param file فایل
     * @param path مسیر
     * @returns URL فایل
     */
    uploadFile(file: File, path: string): Promise<string>;
  
    /**
     * حذف فایل
     * @param path مسیر فایل
     */
    deleteFile(path: string): Promise<void>;
  
    /**
     * دریافت URL فایل
     * @param path مسیر فایل
     * @returns URL فایل
     */
    getFileUrl(path: string): Promise<string>;
  
    /**
     * لیست فایل‌ها
     * @param folder پوشه
     * @returns لیست فایل‌ها
     */
    listFiles(folder: string): Promise<string[]>;
  
    /**
     * کپی فایل
     * @param sourcePath مسیر مبدا
     * @param destPath مسیر مقصد
     */
    copyFile(sourcePath: string, destPath: string): Promise<void>;
  }