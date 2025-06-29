// src/services/api/client.ts

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
      },
      (error: AxiosError) => {
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`, error.response?.data);
        
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request<T>(config: Parameters<AxiosInstance['request']>[0]): Promise<T> {
    try {
      const response = await this.instance.request(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || 
          error.response?.data?.message || 
          error.message || 
          'API request failed'
        );
      }
      throw error;
    }
  }

  // Convenience methods
  async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: 'GET', url, params });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PATCH', url, data });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url });
  }
}

export const apiClient = new ApiClient();

---

// src/modules/form-builder/services/database/postgresql.service.ts

import { apiClient } from '../../../../services/api/client';
import { DatabaseService, FormFilters } from './interface';
import { Form, FormResponse, FormTemplate } from '../../types';

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
      const response = await apiClient.get<{success: boolean, data: FormTemplate[]}>('/templates');
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

---

// src/modules/form-builder/services/database/factory.ts (آپدیت)

import { DatabaseService } from './interface';
import { FirebaseService } from './firebase.service';
import { PostgreSQLService } from './postgresql.service';
import { MemoryDatabaseService } from './memory.service';
import { LocalStorageService } from './localStorage.service';

export type DatabaseType = 'firebase' | 'postgresql' | 'memory' | 'localStorage';

export class DatabaseServiceFactory {
  private static instance: DatabaseService | null = null;
  private static currentType: DatabaseType | null = null;

  static create(type: DatabaseType): DatabaseService {
    // Return existing instance if same type
    if (this.instance && this.currentType === type) {
      return this.instance;
    }

    // Create new instance
    switch (type) {
      case 'firebase':
        this.instance = new FirebaseService();
        break;
      case 'postgresql':
        this.instance = new PostgreSQLService();
        break;
      case 'memory':
        this.instance = new MemoryDatabaseService();
        break;
      case 'localStorage':
        this.instance = new LocalStorageService();
        break;
      default:
        throw new Error(`Database type ${type} not supported`);
    }

    this.currentType = type;
    console.log(`📊 Database service switched to: ${type.toUpperCase()}`);
    
    return this.instance;
  }

  static getCurrentType(): DatabaseType | null {
    return this.currentType;
  }

  static reset(): void {
    this.instance = null;
    this.currentType = null;
  }
}

---

// src/modules/form-builder/hooks/useFormsAPI.ts - React Query Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DatabaseServiceFactory } from '../services/database/factory';
import { Form, FormFilters } from '../types';

const getDatabaseService = () => {
  const dbType = process.env.REACT_APP_DATABASE_TYPE as any || 'postgresql';
  return DatabaseServiceFactory.create(dbType);
};

// Forms Query Keys
export const formsKeys = {
  all: ['forms'] as const,
  lists: () => [...formsKeys.all, 'list'] as const,
  list: (filters: FormFilters) => [...formsKeys.lists(), filters] as const,
  details: () => [...formsKeys.all, 'detail'] as const,
  detail: (id: string) => [...formsKeys.details(), id] as const,
};

// Get Forms List
export const useFormsList = (filters: FormFilters = {}) => {
  return useQuery({
    queryKey: formsKeys.list(filters),
    queryFn: async () => {
      const db = getDatabaseService();
      return await db.list('forms', filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Single Form
export const useForm = (id: string) => {
  return useQuery({
    queryKey: formsKeys.detail(id),
    queryFn: async () => {
      const db = getDatabaseService();
      return await db.read('forms', id);
    },
    enabled: !!id,
  });
};

// Create Form Mutation
export const useCreateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>) => {
      const db = getDatabaseService();
      return await db.create('forms', formData);
    },
    onSuccess: () => {
      // Invalidate forms list
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};

// Update Form Mutation
export const useUpdateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Form> }) => {
      const db = getDatabaseService();
      return await db.update('forms', id, data);
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific form and lists
      queryClient.invalidateQueries({ queryKey: formsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};

// Delete Form Mutation
export const useDeleteForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getDatabaseService();
      return await db.delete('forms', id);
    },
    onSuccess: () => {
      // Invalidate forms list
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};

// Clone Form Mutation
export const useCloneForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, createdBy }: { id: string; createdBy: string }) => {
      const db = getDatabaseService() as any; // Extended methods
      return await db.cloneForm(id, createdBy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};

// Update Form Status Mutation
export const useUpdateFormStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, updatedBy }: { id: string; status: string; updatedBy: string }) => {
      const db = getDatabaseService() as any; // Extended methods
      return await db.updateFormStatus(id, status, updatedBy);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: formsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};

---

// src/App.tsx (آپدیت برای React Query)

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import FormsPage from './pages/forms/Forms';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/sales" element={<ComingSoon />} />
              <Route path="/customers" element={<ComingSoon />} />
              <Route path="/employees" element={<ComingSoon />} />
              <Route path="/investors" element={<ComingSoon />} />
              <Route path="/users" element={<ComingSoon />} />
              <Route path="/tags" element={<ComingSoon />} />
              <Route path="/settings" element={<ComingSoon />} />
              <Route path="/sms" element={<ComingSoon />} />
              <Route path="/documents" element={<ComingSoon />} />
              <Route path="/ai" element={<ComingSoon />} />
              <Route path="/reports" element={<ComingSoon />} />
              <Route path="/workflows" element={<ComingSoon />} />
              <Route path="/databases" element={<ComingSoon />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
      
      {/* React Query DevTools (فقط در development) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;