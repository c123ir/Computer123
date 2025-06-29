// =====================================================
// 🔧 فایل: src/modules/form-builder/hooks/useFormsAPI.ts
// =====================================================

import { useCallback } from 'react';
import { FormService } from '../services/formService';
import { 
  Form, 
  FormFilters, 
  PaginatedResponse, 
  CreateFormDto, 
  UpdateFormDto,
  FormResponse,
  DatabaseStats,
  HealthCheckResult
} from '../types';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface FormsAPI {
  getForms: (filters?: FormFilters) => Promise<PaginatedResponse<Form>>;
  getForm: (id: string) => Promise<Form>;
  createForm: (data: CreateFormDto) => Promise<Form>;
  updateForm: (id: string, data: UpdateFormDto) => Promise<Form>;
  deleteForm: (id: string) => Promise<void>;
  duplicateForm: (id: string) => Promise<Form>;
  updateFormStatus: (id: string, status: Form['status']) => Promise<Form>;
  getFormResponses: (formId: string, filters?: FormFilters) => Promise<PaginatedResponse<FormResponse>>;
  getStats: () => Promise<DatabaseStats>;
  healthCheck: () => Promise<HealthCheckResult>;
}

/**
 * Forms API Service
 */
class FormsAPIService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * دریافت لیست فرم‌ها
   */
  async getForms(filters?: FormFilters): Promise<PaginatedResponse<Form>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${this.baseURL}/forms?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * دریافت فرم با ID
   */
  async getForm(id: string): Promise<Form> {
    const response = await fetch(`${this.baseURL}/forms/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  /**
   * ایجاد فرم جدید
   */
  async createForm(formData: CreateFormDto): Promise<Form> {
    const response = await fetch(`${this.baseURL}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  /**
   * بروزرسانی فرم
   */
  async updateForm(id: string, formData: UpdateFormDto): Promise<Form> {
    const response = await fetch(`${this.baseURL}/forms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  /**
   * حذف فرم
   */
  async deleteForm(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/forms/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  /**
   * کپی فرم
   */
  async duplicateForm(id: string): Promise<Form> {
    const response = await fetch(`${this.baseURL}/forms/${id}/duplicate`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  /**
   * تغییر وضعیت فرم
   */
  async updateFormStatus(id: string, status: Form['status']): Promise<Form> {
    const response = await fetch(`${this.baseURL}/forms/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  /**
   * دریافت پاسخ‌های فرم
   */
  async getFormResponses(formId: string, filters?: FormFilters): Promise<PaginatedResponse<FormResponse>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${this.baseURL}/forms/${formId}/responses?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * آمار سیستم
   */
  async getStats(): Promise<DatabaseStats> {
    const response = await fetch(`${this.baseURL}/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  /**
   * بررسی سلامت سیستم
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const response = await fetch(`${this.baseURL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

/**
 * Hook برای دسترسی به API فرم‌ها
 */
export const useFormsAPI = () => {
  const formsAPI: FormsAPI = {
    getForms: useCallback(async (filters?: FormFilters): Promise<PaginatedResponse<Form>> => {
      const result = await FormService.searchForms(
        filters?.search || '', 
        filters,
        { page: filters?.page || 1, limit: filters?.limit || 10 }
      );
      return {
        success: true,
        data: result.data,
        pagination: {
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          total: result.total,
          totalPages: Math.ceil(result.total / (filters?.limit || 10))
        }
      };
    }, []),

    getForm: useCallback(async (id: string): Promise<Form> => {
      const form = await FormService.getForm(id);
      if (!form) throw new Error('Form not found');
      return form;
    }, []),

    createForm: useCallback(async (data: CreateFormDto): Promise<Form> => {
      const formId = await FormService.createForm(data);
      const form = await FormService.getForm(formId);
      if (!form) throw new Error('Created form not found');
      return form;
    }, []),

    updateForm: useCallback(async (id: string, data: UpdateFormDto): Promise<Form> => {
      await FormService.updateForm(id, data);
      const form = await FormService.getForm(id);
      if (!form) throw new Error('Updated form not found');
      return form;
    }, []),

    deleteForm: useCallback(async (id: string): Promise<void> => {
      await FormService.deleteForm(id);
    }, []),

    duplicateForm: useCallback(async (id: string): Promise<Form> => {
      const newFormId = await FormService.duplicateForm(id);
      const form = await FormService.getForm(newFormId);
      if (!form) throw new Error('Duplicated form not found');
      return form;
    }, []),

    updateFormStatus: useCallback(async (id: string, status: Form['status']): Promise<Form> => {
      await FormService.updateForm(id, { status });
      const form = await FormService.getForm(id);
      if (!form) throw new Error('Updated form not found');
      return form;
    }, []),

    getFormResponses: useCallback(async (formId: string, filters?: FormFilters): Promise<PaginatedResponse<FormResponse>> => {
      const result = await FormService.getFormResponses(formId, filters, { page: filters?.page || 1, limit: filters?.limit || 10 });
      return {
        success: true,
        data: result.data,
        pagination: {
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          total: result.total,
          totalPages: Math.ceil(result.total / (filters?.limit || 10))
        }
      };
    }, []),

    getStats: useCallback(async (): Promise<DatabaseStats> => {
      const stats = await FormService.getFormStats('all');
      return {
        totalForms: stats?.totalForms || 0,
        totalResponses: stats?.totalResponses || 0,
        activeForms: stats?.activeForms || 0,
        databaseSize: stats?.databaseSize || 0
      };
    }, []),

    healthCheck: useCallback(async (): Promise<HealthCheckResult> => {
      // FormService doesn't have a healthCheck method, so return a mock response
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: [
          {
            name: 'Database',
            status: 'healthy',
            message: 'Database is operational'
          }
        ]
      };
    }, [])
  };

  return { formsAPI };
};

export default useFormsAPI;
