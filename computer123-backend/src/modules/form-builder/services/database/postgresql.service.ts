// src/modules/form-builder/services/database/postgresql.service.ts

import { apiClient } from '../../../../services/api/client';
import { DatabaseService, FormFilters } from './interface';
import { Form, FormResponse } from '@prisma/client';

export class PostgreSQLService implements DatabaseService {
  
  async create(collectionName: string, data: any): Promise<string> {
    if (collectionName === 'forms') {
      const response = await apiClient.post<{success: boolean, data: Form}>('/forms', data);
      return response.data.id;
    }
    
    if (collectionName === 'form_responses') {
      const response = await apiClient.post<{success: boolean, data: FormResponse}>(`/forms/${data.formId}/responses`, data);
      return response.data.id;
    }
    
    throw new Error(`Collection ${collectionName} not supported`);
  }

  async read(collectionName: string, id: string): Promise<any> {
    if (collectionName === 'forms') {
      const response = await apiClient.get<{success: boolean, data: Form}>(`/forms/${id}`);
      return response.data;
    }
    
    if (collectionName === 'form_responses') {
      const response = await apiClient.get<{success: boolean, data: FormResponse}>(`/responses/${id}`);
      return response.data;
    }
    
    return null;
  }

  async update(collectionName: string, id: string, data: any): Promise<boolean> {
    try {
      if (collectionName === 'forms') {
        await apiClient.put(`/forms/${id}`, data);
        return true;
      }
      
      if (collectionName === 'form_responses') {
        await apiClient.put(`/responses/${id}`, data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Update failed:', error);
      return false;
    }
  }

  async delete(collectionName: string, id: string): Promise<boolean> {
    try {
      if (collectionName === 'forms') {
        await apiClient.delete(`/forms/${id}`);
        return true;
      }
      
      if (collectionName === 'form_responses') {
        await apiClient.delete(`/responses/${id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }

  async list(collectionName: string, filters?: FormFilters): Promise<any[]> {
    if (collectionName === 'forms') {
      const params = new URLSearchParams();
      
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await apiClient.get<{success: boolean, data: Form[]}>(`/forms?${params.toString()}`);
      return response.data || [];
    }
    
    if (collectionName === 'form_templates') {
      const response = await apiClient.get<{success: boolean, data: Form[]}>('/templates');
      return response.data || [];
    }
    
    return [];
  }

  async count(collectionName: string, filters?: FormFilters): Promise<number> {
    if (collectionName === 'forms') {
      const response = await this.list(collectionName, { ...filters, limit: 1 });
      // Backend should return pagination info, for now return array length
      return response.length;
    }
    return 0;
  }

  // Extended methods for forms
  async cloneForm(id: string, createdBy: string): Promise<string> {
    const response = await apiClient.post<{success: boolean, data: Form}>(`/forms/${id}/clone`, { createdBy });
    return response.data.id;
  }

  async updateFormStatus(id: string, status: string, updatedBy: string): Promise<boolean> {
    try {
      await apiClient.patch(`/forms/${id}/status`, { status, updatedBy });
      return true;
    } catch (error) {
      console.error('Status update failed:', error);
      return false;
    }
  }

  async getFormResponses(formId: string): Promise<FormResponse[]> {
    const response = await apiClient.get<{success: boolean, data: FormResponse[]}>(`/forms/${formId}/responses`);
    return response.data || [];
  }

  async submitFormResponse(formId: string, answers: Record<string, any>, submitterInfo?: any): Promise<string> {
    const response = await apiClient.post<{success: boolean, data: FormResponse}>(`/forms/${formId}/responses`, {
      answers,
      submitterInfo
    });
    return response.data.id;
  }
} 