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
  const formService = FormService.getInstance();

  const formsAPI: FormsAPI = {
    getForms: useCallback(async (filters?: FormFilters): Promise<PaginatedResponse<Form>> => {
      const result = await formService.searchForms(filters || {});
      return {
        data: result.data,
        pagination: {
          currentPage: filters?.page || 1,
          totalPages: Math.ceil(result.total / (filters?.limit || 10)),
          totalItems: result.total,
          pageSize: filters?.limit || 10
        },
        total: result.total
      };
    }, [formService]),

    getForm: useCallback(async (id: string): Promise<Form> => {
      return await formService.getForm(id);
    }, [formService]),

    createForm: useCallback(async (data: CreateFormDto): Promise<Form> => {
      return await formService.createForm(data);
    }, [formService]),

    updateForm: useCallback(async (id: string, data: UpdateFormDto): Promise<Form> => {
      return await formService.updateForm(id, data);
    }, [formService]),

    deleteForm: useCallback(async (id: string): Promise<void> => {
      await formService.deleteForm(id);
    }, [formService]),

    duplicateForm: useCallback(async (id: string): Promise<Form> => {
      return await formService.duplicateForm(id);
    }, [formService]),

    updateFormStatus: useCallback(async (id: string, status: Form['status']): Promise<Form> => {
      return await formService.updateForm(id, { status });
    }, [formService]),

    getFormResponses: useCallback(async (formId: string, filters?: FormFilters): Promise<PaginatedResponse<FormResponse>> => {
      return await formService.getFormResponses(formId, filters);
    }, [formService]),

    getStats: useCallback(async (): Promise<DatabaseStats> => {
      return await formService.getStats();
    }, [formService]),

    healthCheck: useCallback(async (): Promise<HealthCheckResult> => {
      return await formService.healthCheck();
    }, [formService])
  };

  return { formsAPI };
};

export default useFormsAPI;
