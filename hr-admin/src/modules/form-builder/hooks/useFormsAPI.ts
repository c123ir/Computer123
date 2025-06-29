// src/modules/form-builder/hooks/useFormsAPI.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, FormFilters, CreateFormDto } from '../types';

// Mock database service for now
const mockDatabaseService = {
  async list(collectionName: string, filters?: FormFilters): Promise<Form[]> {
    // Return empty array for now
    console.log('Mock database list called:', collectionName, filters);
    return [];
  },
  
  async read(collectionName: string, id: string): Promise<Form | null> {
    console.log('Mock database read called:', collectionName, id);
    return null;
  },
  
  async create(collectionName: string, data: CreateFormDto): Promise<string> {
    console.log('Mock database create called:', collectionName, data);
    return Date.now().toString();
  },
  
  async update(collectionName: string, id: string, data: Partial<Form>): Promise<boolean> {
    console.log('Mock database update called:', collectionName, id, data);
    return true;
  },
  
  async delete(collectionName: string, id: string): Promise<boolean> {
    console.log('Mock database delete called:', collectionName, id);
    return true;
  }
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
      try {
        // Try to fetch from API
        const response = await fetch('http://localhost:3001/api/forms');
        const result = await response.json();
        return result.data || [];
      } catch (error) {
        console.warn('API not available, using mock data:', error);
        return await mockDatabaseService.list('forms', filters);
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
    mutationFn: async (formData: CreateFormDto) => {
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Form> }) => {
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
      console.log('Clone form:', id, 'by:', createdBy);
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
      return await mockDatabaseService.update('forms', id, { 
        status: status as any,
        metadata: {
          updatedBy,
          updatedAt: new Date().toISOString()
        } as any
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: formsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });
};