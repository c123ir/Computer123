// src/modules/form-builder/services/database/factory.ts

import { DatabaseService, RealtimeService, CacheService, StorageService } from './interface';
import { FirebaseService } from './firebase.service';
import { DatabaseType, DatabaseConfig } from '../../types';

/**
 * Factory برای ایجاد instance های مختلف Database Service
 * این pattern امکان تغییر آسان پایگاه داده را فراهم می‌کند
 */
export class DatabaseServiceFactory {
  private static instances: Map<string, DatabaseService> = new Map();
  private static config: DatabaseConfig | null = null;

  /**
   * تنظیم configuration
   */
  static configure(config: DatabaseConfig): void {
    this.config = config;
    console.log(`🔧 Database configured for: ${config.type}`);
  }

  /**
   * ایجاد Database Service بر اساس نوع
   */
  static create(type?: DatabaseType): DatabaseService {
    // استفاده از نوع پیش‌فرض از environment variable
    const databaseType = type || (process.env.REACT_APP_DATABASE_TYPE as DatabaseType) || 'firebase';
    
    // بررسی instance موجود
    if (this.instances.has(databaseType)) {
      return this.instances.get(databaseType)!;
    }

    let service: DatabaseService;

    switch (databaseType) {
      case 'firebase':
        service = new FirebaseService();
        break;
        
      case 'postgresql':
        // service = new PostgreSQLService();
        throw new Error('PostgreSQL service not implemented yet');
        
      case 'mongodb':
        // service = new MongoDBService();
        throw new Error('MongoDB service not implemented yet');
        
      case 'sqlite':
        // service = new SQLiteService();
        throw new Error('SQLite service not implemented yet');
        
      case 'localstorage':
        // service = new LocalStorageService();
        throw new Error('LocalStorage service not implemented yet');
        
      default:
        throw new Error(`Unsupported database type: ${databaseType}`);
    }

    // cache کردن instance
    this.instances.set(databaseType, service);
    
    console.log(`✅ Database service created: ${databaseType}`);
    return service;
  }

  /**
   * ایجاد Realtime Service
   */
  static createRealtimeService(type?: DatabaseType): RealtimeService {
    const databaseType = type || (process.env.REACT_APP_DATABASE_TYPE as DatabaseType) || 'firebase';
    
    switch (databaseType) {
      case 'firebase':
        return new FirebaseRealtimeService();
        
      default:
        throw new Error(`Realtime service not available for: ${databaseType}`);
    }
  }

  /**
   * ایجاد Cache Service
   */
  static createCacheService(type?: 'memory' | 'localstorage' | 'redis'): CacheService {
    const cacheType = type || 'memory';
    
    switch (cacheType) {
      case 'memory':
        return new MemoryCacheService();
        
      case 'localstorage':
        return new LocalStorageCacheService();
        
      case 'redis':
        throw new Error('Redis cache service not implemented yet');
        
      default:
        throw new Error(`Unsupported cache type: ${cacheType}`);
    }
  }

  /**
   * ایجاد Storage Service
   */
  static createStorageService(type?: 'firebase' | 'aws' | 'local'): StorageService {
    const storageType = type || 'firebase';
    
    switch (storageType) {
      case 'firebase':
        return new FirebaseStorageService();
        
      case 'aws':
        throw new Error('AWS storage service not implemented yet');
        
      case 'local':
        throw new Error('Local storage service not implemented yet');
        
      default:
        throw new Error(`Unsupported storage type: ${storageType}`);
    }
  }

  /**
   * دریافت تمام instance های فعال
   */
  static getActiveInstances(): string[] {
    return Array.from(this.instances.keys());
  }

  /**
   * پاکسازی تمام instance ها
   */
  static clearInstances(): void {
    this.instances.clear();
    console.log('🧹 All database instances cleared');
  }

  /**
   * بررسی دسترسی به نوع پایگاه داده
   */
  static isAvailable(type: DatabaseType): boolean {
    switch (type) {
      case 'firebase':
        return true; // همیشه در دسترس
        
      case 'postgresql':
      case 'mongodb':
      case 'sqlite':
      case 'localstorage':
        return false; // هنوز پیاده‌سازی نشده
        
      default:
        return false;
    }
  }

  /**
   * دریافت اطلاعات پایگاه داده فعال
   */
  static getCurrentDatabaseInfo(): {
    type: DatabaseType;
    isConnected: boolean;
    config: any;
  } {
    const currentType = (process.env.REACT_APP_DATABASE_TYPE as DatabaseType) || 'firebase';
    
    return {
      type: currentType,
      isConnected: this.instances.has(currentType),
      config: this.config
    };
  }
}

/**
 * Firebase Realtime Service Implementation
 */
class FirebaseRealtimeService implements RealtimeService {
  subscribeToForm(formId: string, callback: (form: any) => void): () => void {
    // TODO: Implement Firebase realtime subscription
    console.warn('Firebase realtime subscription not implemented yet');
    return () => {};
  }

  subscribeToResponses(formId: string, callback: (response: any) => void): () => void {
    // TODO: Implement Firebase realtime subscription
    console.warn('Firebase realtime subscription not implemented yet');
    return () => {};
  }

  emit(event: string, data: any): void {
    // TODO: Implement Firebase realtime emit
    console.warn('Firebase realtime emit not implemented yet');
  }

  on(event: string, callback: (data: any) => void): () => void {
    // TODO: Implement Firebase realtime listener
    console.warn('Firebase realtime listener not implemented yet');
    return () => {};
  }
}

/**
 * Memory Cache Service Implementation
 */
class MemoryCacheService implements CacheService {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    const expiry = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiry });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async expire(key: string, ttl: number): Promise<void> {
    const item = this.cache.get(key);
    if (item) {
      item.expiry = Date.now() + (ttl * 1000);
      this.cache.set(key, item);
    }
  }
}

/**
 * LocalStorage Cache Service Implementation
 */
class LocalStorageCacheService implements CacheService {
  private prefix = 'form_builder_cache_';

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) {
        return null;
      }

      const parsed = JSON.parse(item);
      
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return parsed.value as T;
    } catch (error) {
      console.error('Error getting from localStorage cache:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    try {
      const expiry = Date.now() + (ttl * 1000);
      const item = JSON.stringify({ value, expiry });
      localStorage.setItem(this.prefix + key, item);
    } catch (error) {
      console.error('Error setting to localStorage cache:', error);
    }
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(this.prefix + key);
  }

  async clear(): Promise<void> {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }

  async exists(key: string): Promise<boolean> {
    const item = localStorage.getItem(this.prefix + key);
    
    if (!item) {
      return false;
    }

    try {
      const parsed = JSON.parse(item);
      
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(this.prefix + key);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    const item = localStorage.getItem(this.prefix + key);
    if (item) {
      try {
        const parsed = JSON.parse(item);
        parsed.expiry = Date.now() + (ttl * 1000);
        localStorage.setItem(this.prefix + key, JSON.stringify(parsed));
      } catch (error) {
        console.error('Error updating expiry in localStorage cache:', error);
      }
    }
  }
}

/**
 * Firebase Storage Service Implementation
 */
class FirebaseStorageService implements StorageService {
  async uploadFile(file: File, path: string): Promise<string> {
    // TODO: Implement Firebase Storage upload
    // اگر Storage فعال نباشد، خطا برگردان
    if (process.env.REACT_APP_ENABLE_STORAGE !== 'true') {
      throw new Error('File upload is disabled. Storage service not available.');
    }
    
    throw new Error('Firebase Storage upload not implemented yet');
  }

  async deleteFile(path: string): Promise<void> {
    if (process.env.REACT_APP_ENABLE_STORAGE !== 'true') {
      throw new Error('File operations disabled. Storage service not available.');
    }
    
    throw new Error('Firebase Storage delete not implemented yet');
  }

  async getFileUrl(path: string): Promise<string> {
    if (process.env.REACT_APP_ENABLE_STORAGE !== 'true') {
      throw new Error('File operations disabled. Storage service not available.');
    }
    
    throw new Error('Firebase Storage getFileUrl not implemented yet');
  }

  async listFiles(folder: string): Promise<string[]> {
    if (process.env.REACT_APP_ENABLE_STORAGE !== 'true') {
      return [];
    }
    
    throw new Error('Firebase Storage listFiles not implemented yet');
  }

  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    if (process.env.REACT_APP_ENABLE_STORAGE !== 'true') {
      throw new Error('File operations disabled. Storage service not available.');
    }
    
    throw new Error('Firebase Storage copyFile not implemented yet');
  }
}

/**
 * Helper functions برای تست و debugging
 */
export class DatabaseTestUtils {
  /**
   * تست اتصال تمام سرویس‌های موجود
   */
  static async testAllConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    const availableTypes: DatabaseType[] = ['firebase'];
    
    for (const type of availableTypes) {
      try {
        if (DatabaseServiceFactory.isAvailable(type)) {
          const service = DatabaseServiceFactory.create(type);
          results[type] = await service.testConnection();
        } else {
          results[type] = false;
        }
      } catch (error) {
        console.error(`Error testing ${type}:`, error);
        results[type] = false;
      }
    }
    
    return results;
  }

  /**
   * تست عملکرد cache
   */
  static async testCachePerformance(): Promise<{
    memory: number;
    localStorage: number;
  }> {
    const testData = { test: 'data', timestamp: Date.now() };
    const iterations = 1000;

    // Test Memory Cache
    const memoryCache = DatabaseServiceFactory.createCacheService('memory');
    const memoryStart = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      await memoryCache.set(`test_${i}`, testData);
      await memoryCache.get(`test_${i}`);
    }
    
    const memoryTime = performance.now() - memoryStart;

    // Test LocalStorage Cache
    const localCache = DatabaseServiceFactory.createCacheService('localstorage');
    const localStart = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      await localCache.set(`test_${i}`, testData);
      await localCache.get(`test_${i}`);
    }
    
    const localTime = performance.now() - localStart;

    // Cleanup
    await memoryCache.clear();
    await localCache.clear();

    return {
      memory: memoryTime,
      localStorage: localTime
    };
  }

  /**
   * تولید داده‌های تست
   */
  static generateTestForm(): any {
    return {
      name: `Test Form ${Date.now()}`,
      description: 'A test form generated by DatabaseTestUtils',
      fields: [
        {
          id: 'field_1',
          type: 'text',
          label: 'نام کامل',
          required: true,
          validation: { minLength: 2, maxLength: 50 },
          styling: { width: '100%' },
          placeholder: 'نام خود را وارد کنید'
        },
        {
          id: 'field_2',
          type: 'email',
          label: 'ایمیل',
          required: true,
          validation: {},
          styling: { width: '100%' },
          placeholder: 'example@email.com'
        }
      ],
      settings: {
        submitButtonText: 'ارسال',
        showProgressBar: false,
        allowSaveDraft: true,
        showFieldNumbers: false,
        formWidth: 'medium'
      },
      styling: {
        theme: 'default',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        primaryColor: '#3b82f6',
        fontFamily: 'Vazirmatn',
        fontSize: 14,
        borderRadius: 8,
        spacing: 'normal'
      }
    };
  }

  /**
   * تولید پاسخ تست
   */
  static generateTestResponse(formId: string): any {
    return {
      formId,
      answers: {
        field_1: 'نام تست',
        field_2: 'test@example.com'
      },
      submitter: {
        ip: '127.0.0.1',
        userAgent: 'Test Agent'
      }
    };
  }
}

/**
 * Configuration Manager برای تنظیمات پایگاه داده
 */
export class DatabaseConfigManager {
  private static readonly CONFIG_KEY = 'database_config';

  /**
   * ذخیره تنظیمات
   */
  static saveConfig(config: DatabaseConfig): void {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      DatabaseServiceFactory.configure(config);
      console.log('✅ Database config saved');
    } catch (error) {
      console.error('❌ Error saving database config:', error);
    }
  }

  /**
   * بارگذاری تنظیمات
   */
  static loadConfig(): DatabaseConfig | null {
    try {
      const configStr = localStorage.getItem(this.CONFIG_KEY);
      if (configStr) {
        const config = JSON.parse(configStr) as DatabaseConfig;
        DatabaseServiceFactory.configure(config);
        return config;
      }
    } catch (error) {
      console.error('❌ Error loading database config:', error);
    }
    return null;
  }

  /**
   * حذف تنظیمات
   */
  static clearConfig(): void {
    localStorage.removeItem(this.CONFIG_KEY);
    console.log('🧹 Database config cleared');
  }

  /**
   * دریافت تنظیمات پیش‌فرض
   */
  static getDefaultConfig(): DatabaseConfig {
    return {
      type: 'firebase',
      options: {
        enableCache: true,
        cacheSize: 100,
        enableRealtime: false,
        enableStorage: process.env.REACT_APP_ENABLE_STORAGE === 'true'
      }
    };
  }

  /**
   * اعتبارسنجی تنظیمات
   */
  static validateConfig(config: DatabaseConfig): string[] {
    const errors: string[] = [];

    if (!config.type) {
      errors.push('Database type is required');
    }

    if (!DatabaseServiceFactory.isAvailable(config.type)) {
      errors.push(`Database type '${config.type}' is not available`);
    }

    if (config.type === 'firebase' && config.firebase) {
      const firebase = config.firebase;
      const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
      
      for (const field of requiredFields) {
        if (!firebase[field as keyof typeof firebase]) {
          errors.push(`Firebase ${field} is required`);
        }
      }
    }

    return errors;
  }
}

/**
 * Export اصلی factory
 */
export default DatabaseServiceFactory;