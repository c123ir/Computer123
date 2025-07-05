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

// Note: API_BASE_URL is defined in FormsAPIService class below if needed

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
 * Forms API Service (Currently unused - kept for future HTTP API implementation)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const formsAPI = {
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
      const form = await FormService.updateForm(id, data);
      if (!form) throw new Error('Updated form not found');
      return form;
    }, []),

    deleteForm: useCallback(async (id: string): Promise<void> => {
      await FormService.deleteForm(id);
    }, []),

    cloneForm: useCallback(async (id: string): Promise<Form> => {
      const newId = await FormService.cloneForm(id);
      const form = await FormService.getForm(newId);
      if (!form) throw new Error('Cloned form not found');
      return form;
    }, []),

    updateFormStatus: useCallback(async (id: string, status: Form['status']): Promise<Form> => {
      const form = await FormService.updateFormStatus(id, status);
      if (!form) throw new Error('Form not found after status update');
      return form;
    }, []),

    getForms: useCallback(async (filters?: FormFilters): Promise<Form[]> => {
      try {
        console.log('🔍 Query filters:', filters);
        const forms = await FormService.getForms(filters);
        console.log('📦 Forms response:', forms);
        return forms;
      } catch (error) {
        console.error('❌ Error fetching forms:', error);
        throw error;
      }
    }, [])
  };

  return { formsAPI };
};

export default useFormsAPI;
