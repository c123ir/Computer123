// =====================================================
// 🔧 فایل: src/modules/form-builder/services/database/factory.ts
// =====================================================

import { DatabaseType, DatabaseConfig } from '../../types';
import { DatabaseService } from './interface';
import { PostgreSQLService } from './postgresql.service';

/**
 * Database Service Interface
 */
export interface DatabaseService {
  // Form Operations
  getForms(filters?: any): Promise<any>;
  getForm(id: string): Promise<any>;
  createForm(data: any): Promise<any>;
  updateForm(id: string, data: any): Promise<any>;
  deleteForm(id: string): Promise<void>;
  
  // Response Operations
  getFormResponses(formId: string, filters?: any): Promise<any>;
  createFormResponse(data: any): Promise<any>;
  
  // Stats and Health
  getStats(): Promise<any>;
  healthCheck(): Promise<any>;
  
  // Connection
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

/**
 * Firebase Service Implementation (Disabled)
 */
class FirebaseService implements DatabaseService {
  async createForm(): Promise<string> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getForm(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async updateForm(): Promise<void> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async deleteForm(): Promise<void> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async listForms(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async searchForms(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async duplicateForm(): Promise<string> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getForms(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async createFormResponse(): Promise<string> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async createResponse(): Promise<string> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getFormResponses(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getResponses(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getResponse(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async updateResponse(): Promise<void> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async deleteResponse(): Promise<void> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async deleteAllResponses(): Promise<void> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getTemplates(): Promise<any[]> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getTemplate(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async createFormFromTemplate(): Promise<string> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getFormStats(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getOverallStats(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getDashboardStats(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async exportData(): Promise<Blob> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async importData(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async createBackup(): Promise<Blob> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async restoreFromBackup(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async healthCheck(): Promise<any> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async testConnection(): Promise<boolean> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async clearCache(): Promise<void> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async optimize(): Promise<void> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async getConfig(): Promise<Record<string, any>> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
  
  async updateConfig(): Promise<void> {
    throw new Error('Firebase service disabled - using PostgreSQL instead');
  }
}

/**
 * Database Factory
 */
export class DatabaseFactory {
  /**
   * ایجاد service بر اساس نوع پایگاه داده
   */
  static createService(config: DatabaseConfig): DatabaseService {
    switch (config.type) {
      case 'firebase':
        console.warn('🔄 Firebase service disabled - redirecting to PostgreSQL');
        return new PostgreSQLService();
        
      case 'postgresql':
        console.log('✅ Using PostgreSQL backend service');
        return new PostgreSQLService();
        
      default:
        console.log('⚠️ Unknown database type, defaulting to PostgreSQL');
        return new PostgreSQLService();
    }
  }

  /**
   * بررسی پشتیبانی از نوع پایگاه داده
   */
  static isSupported(type: DatabaseType): boolean {
    switch (type) {
      case 'postgresql':
        return true;
      case 'firebase':
        return false; // Disabled
      default:
        return false;
    }
  }

  /**
   * لیست انواع پشتیبانی شده
   */
  static getSupportedTypes(): DatabaseType[] {
    return ['postgresql'];
  }
}

export default DatabaseFactory;