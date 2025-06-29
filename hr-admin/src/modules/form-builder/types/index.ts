// src/modules/form-builder/types/index.ts
export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation: any;
  styling: any;
  options?: any[];
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: any;
  styling: any;
  metadata: any;
  status: 'draft' | 'published' | 'archived' | 'paused';
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalViews: number;
    totalSubmissions: number;
    completionRate: number;
  };
}

export interface FormFilters {
  search?: string;
  status?: string;
  category?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'responses';
  sortOrder?: 'asc' | 'desc';
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submitterInfo?: any;
  metadata: any;
  status: 'draft' | 'completed' | 'partial';
  submittedAt: string;
  duration?: number;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  formData: any;
  preview?: string;
  tags: string[];
  popularity: number;
  isActive: boolean;
}

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

---

// src/modules/form-builder/hooks/useFormsAPI.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock database service for now
const mockDatabaseService = {
  async list(collectionName: string, filters?: any): Promise<any[]> {
    // Return empty array for now
    return [];
  },
  
  async read(collectionName: string, id: string): Promise<any> {
    return null;
  },
  
  async create(collectionName: string, data: any): Promise<string> {
    return Date.now().toString();
  },
  
  async update(collectionName: string, id: string, data: any): Promise<boolean> {
    return true;
  },
  
  async delete(collectionName: string, id: string): Promise<boolean> {
    return true;
  }
};

// Forms Query Keys
export const formsKeys = {
  all: ['forms'] as const,
  lists: () => [...formsKeys.all, 'list'] as const,
  list: (filters: any) => [...formsKeys.lists(), filters] as const,
  details: () => [...formsKeys.all, 'detail'] as const,
  detail: (id: string) => [...formsKeys.details(), id] as const,
};

// Get Forms List
export const useFormsList = (filters: any = {}) => {
  return useQuery({
    queryKey: formsKeys.list(filters),
    queryFn: async () => {
      try {
        // Try to fetch from API
        const response = await fetch('http://localhost:3001/api/forms');
        const result = await response.json();
        return result.data || [];
      } catch (error) {
        console.warn('API not available, using mock data:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Single Form
export const useForm = (id: string) => {
  return useQuery({
    queryKey: formsKeys.detail(id),
    queryFn: async () => {
      return await mockDatabaseService.read('forms', id);
    },
    enabled: !!id,
  });
};

// Create Form Mutation
export const useCreateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      return await mockDatabaseService.create('forms', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};

// Update Form Mutation
export const useUpdateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await mockDatabaseService.update('forms', id, data);
    },
    onSuccess: (_, { id }) => {
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
      return await mockDatabaseService.delete('forms', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};

// Clone Form Mutation
export const useCloneForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, createdBy }: { id: string; createdBy: string }) => {
      // Mock clone logic
      return Date.now().toString();
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
      return await mockDatabaseService.update('forms', id, { status });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: formsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};

---

// src/modules/form-builder/hooks/index.ts
export * from './useFormsAPI';

---

// src/services/api/client.ts (ساده شده برای حل خطا)
class ApiClient {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();