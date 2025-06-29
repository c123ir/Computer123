// =====================================================
// 🔧 فایل: src/modules/form-builder/hooks/useFormsAPI.ts
// =====================================================

import { useMemo } from 'react';
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
 * Hook برای استفاده از Forms API
 */
export const useFormsAPI = () => {
  const formsAPI = useMemo(() => new FormsAPIService(API_BASE_URL), []);

  return {
    formsAPI,
    // Shortcuts
    getForms: formsAPI.getForms.bind(formsAPI),
    getForm: formsAPI.getForm.bind(formsAPI),
    createForm: formsAPI.createForm.bind(formsAPI),
    updateForm: formsAPI.updateForm.bind(formsAPI),
    deleteForm: formsAPI.deleteForm.bind(formsAPI),
    duplicateForm: formsAPI.duplicateForm.bind(formsAPI),
    updateFormStatus: formsAPI.updateFormStatus.bind(formsAPI),
    getFormResponses: formsAPI.getFormResponses.bind(formsAPI),
    getStats: formsAPI.getStats.bind(formsAPI),
    healthCheck: formsAPI.healthCheck.bind(formsAPI),
  };
};

export default useFormsAPI;
