// =====================================================
// 🔧 فایل: src/modules/form-builder/services/database/postgresql.service.ts
// =====================================================

import { DatabaseService } from './interface';
import {
  Form,
  FormResponse,
  FormTemplate,
  CreateFormDto,
  UpdateFormDto,
  FormFilters as QueryFilters,
  PaginationOptions,
  PaginatedResult,
  SortOptions,
  DatabaseStats,
  ExportOptions,
  ImportOptions,
  BatchResult,
  HealthCheckResult
} from '../../types';
import { getApiUrl } from '../../../../utils/api';

/**
 * PostgreSQL Service Implementation
 * این service از HTTP API برای ارتباط با PostgreSQL backend استفاده می‌کند
 */
export class PostgreSQLService implements DatabaseService {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || getApiUrl();
  }

  // =================================
  // Form Management
  // =================================

  async createForm(form: CreateFormDto): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/forms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data?.id || result.id;
    } catch (error) {
      console.error('❌ Error creating form:', error);
      throw error;
    }
  }

  async getForm(id: string): Promise<Form | null> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${id}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Error getting form:', error);
      throw error;
    }
  }

  async updateForm(id: string, updates: UpdateFormDto): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error updating form:', error);
      throw error;
    }
  }

  async deleteForm(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error deleting form:', error);
      throw error;
    }
  }

  async listForms(
    filters?: QueryFilters,
    pagination?: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginatedResult<Form>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, String(v)));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }

      if (pagination) {
        if (pagination.page) params.append('page', String(pagination.page));
        if (pagination.limit) params.append('limit', String(pagination.limit));
      }

      if (sort) {
        params.append('sortBy', sort.field);
        params.append('sortOrder', sort.direction);
      }

      const response = await fetch(`${this.baseURL}/forms?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Convert backend response to our PaginatedResult format
      return {
        data: result.data || [],
        pagination: {
          currentPage: result.pagination?.page || 1,
          totalPages: result.pagination?.totalPages || 1,
          totalItems: result.pagination?.total || 0,
          itemsPerPage: result.pagination?.limit || 10,
          hasNextPage: (result.pagination?.page || 1) < (result.pagination?.totalPages || 1),
          hasPreviousPage: (result.pagination?.page || 1) > 1
        }
      };
    } catch (error) {
      console.error('❌ Error listing forms:', error);
      throw error;
    }
  }

  async searchForms(
    query: string,
    filters?: QueryFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Form>> {
    const searchFilters = { ...filters, search: query };
    return this.listForms(searchFilters, pagination);
  }

  async duplicateForm(id: string, newName: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data?.id || result.id;
    } catch (error) {
      console.error('❌ Error duplicating form:', error);
      throw error;
    }
  }

  async getForms(
    userId?: string,
    filters?: QueryFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Form>> {
    const userFilters = userId ? { ...filters, userId } : filters;
    return this.listForms(userFilters, pagination);
  }

  // =================================
  // Form Responses
  // =================================

  async createFormResponse(
    formId: string,
    response: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const responseData = {
        formId,
        answers: response,
        metadata
      };

      const apiResponse = await fetch(`${this.baseURL}/forms/${formId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      return result.data?.id || result.id;
    } catch (error) {
      console.error('❌ Error creating form response:', error);
      throw error;
    }
  }

  async createResponse(
    formId: string,
    response: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<string> {
    return this.createFormResponse(formId, response, metadata);
  }

  async getFormResponses(
    formId: string,
    filters?: QueryFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<FormResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      if (pagination) {
        if (pagination.page) params.append('page', String(pagination.page));
        if (pagination.limit) params.append('limit', String(pagination.limit));
      }

      const response = await fetch(`${this.baseURL}/forms/${formId}/responses?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        data: result.data || [],
        pagination: {
          currentPage: result.pagination?.page || 1,
          totalPages: result.pagination?.totalPages || 1,
          totalItems: result.pagination?.total || 0,
          itemsPerPage: result.pagination?.limit || 10,
          hasNextPage: (result.pagination?.page || 1) < (result.pagination?.totalPages || 1),
          hasPreviousPage: (result.pagination?.page || 1) > 1
        }
      };
    } catch (error) {
      console.error('❌ Error getting form responses:', error);
      throw error;
    }
  }

  async getResponses(
    formId: string,
    filters?: QueryFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<FormResponse>> {
    return this.getFormResponses(formId, filters, pagination);
  }

  async getResponse(responseId: string): Promise<FormResponse | null> {
    try {
      const response = await fetch(`${this.baseURL}/responses/${responseId}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Error getting response:', error);
      throw error;
    }
  }

  async updateResponse(responseId: string, updates: Partial<FormResponse>): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/responses/${responseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error updating response:', error);
      throw error;
    }
  }

  async deleteResponse(responseId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/responses/${responseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error deleting response:', error);
      throw error;
    }
  }

  async deleteAllResponses(formId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${formId}/responses`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error deleting all responses:', error);
      throw error;
    }
  }

  // =================================
  // Templates
  // =================================

  async getTemplates(category?: string): Promise<FormTemplate[]> {
    try {
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`${this.baseURL}/templates?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('❌ Error getting templates:', error);
      return [];
    }
  }

  async getTemplate(id: string): Promise<FormTemplate | null> {
    try {
      const response = await fetch(`${this.baseURL}/templates/${id}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Error getting template:', error);
      return null;
    }
  }

  async createFormFromTemplate(templateId: string, formName: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/templates/${templateId}/create-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data?.id || result.id;
    } catch (error) {
      console.error('❌ Error creating form from template:', error);
      throw error;
    }
  }

  // =================================
  // Analytics & Statistics
  // =================================

  async getFormStats(formId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${formId}/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Error getting form stats:', error);
      return {
        totalViews: 0,
        totalSubmissions: 0,
        completionRate: 0,
        averageTime: 0,
        topExitFields: [],
        submissionsByDate: []
      };
    }
  }

  async getOverallStats(): Promise<DatabaseStats> {
    try {
      const response = await fetch(`${this.baseURL}/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Error getting overall stats:', error);
      return {
        totalForms: 0,
        totalResponses: 0,
        activeForms: 0,
        databaseSize: 0,
        performance: {
          averageQueryTime: 0,
          todayQueries: 0,
          recentErrors: 0
        }
      };
    }
  }

  async getDashboardStats(userId?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(`${this.baseURL}/dashboard/stats?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Error getting dashboard stats:', error);
      return {
        totalForms: 0,
        totalResponses: 0,
        recentActivity: [],
        popularForms: [],
        trendsData: []
      };
    }
  }

  // =================================
  // Data Management
  // =================================

  async exportData(formId?: string, options?: ExportOptions): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (formId) params.append('formId', formId);
      if (options?.format) params.append('format', options.format);
      if (options?.includeResponses) params.append('includeResponses', 'true');

      const response = await fetch(`${this.baseURL}/export?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      console.error('❌ Error exporting data:', error);
      throw error;
    }
  }

  async importData(file: File, options?: ImportOptions): Promise<BatchResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options?.format) formData.append('format', options.format);
      if (options?.overwrite) formData.append('overwrite', 'true');

      const response = await fetch(`${this.baseURL}/import`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      throw error;
    }
  }

  async createBackup(): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseURL}/backup`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      console.error('❌ Error creating backup:', error);
      throw error;
    }
  }

  async restoreFromBackup(backupFile: File): Promise<BatchResult> {
    try {
      const formData = new FormData();
      formData.append('backup', backupFile);

      const response = await fetch(`${this.baseURL}/backup/restore`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Error restoring backup:', error);
      throw error;
    }
  }

  // =================================
  // System Management
  // =================================

  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const start = Date.now();
      const response = await fetch(`${this.baseURL}/health`);
      const responseTime = Date.now() - start;

      if (!response.ok) {
        return {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          responseTime,
          checks: [
            {
              name: 'PostgreSQL API',
              status: 'fail',
              message: `HTTP ${response.status}: ${response.statusText}`
            }
          ]
        };
      }

      const result = await response.json();
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        responseTime,
        checks: [
          {
            name: 'PostgreSQL API',
            status: 'pass',
            message: 'Connected successfully'
          },
          ...(result.checks || [])
        ]
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime: 0,
        checks: [
          {
            name: 'PostgreSQL API',
            status: 'fail',
            message: `Connection failed: ${error}`
          }
        ]
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async clearCache(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/cache/clear`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.warn('Cache clear failed, but continuing...');
      }
    } catch (error) {
      console.warn('Cache clear not available:', error);
    }
  }

  async optimize(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/database/optimize`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.warn('Database optimization failed, but continuing...');
      }
    } catch (error) {
      console.warn('Database optimization not available:', error);
    }
  }

  async getConfig(): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.baseURL}/config`);

      if (!response.ok) {
        return {};
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.warn('Config retrieval failed:', error);
      return {};
    }
  }

  async updateConfig(config: Record<string, any>): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error updating config:', error);
      throw error;
    }
  }
} 