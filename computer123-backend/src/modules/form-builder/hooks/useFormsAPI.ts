// src/modules/form-builder/hooks/useFormsAPI.ts

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