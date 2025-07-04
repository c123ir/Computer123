import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { MenuItem } from '../types/menu';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3995/api';

const api = axios.create({
  baseURL: `${API_URL}/menus`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchMenuTree = async (): Promise<MenuItem[]> => {
  const response: AxiosResponse<ApiResponse<MenuItem[]>> = await api.get('/tree');
  return response.data.data;
};

export const fetchMenuById = async (id: string): Promise<MenuItem> => {
  const response: AxiosResponse<ApiResponse<MenuItem>> = await api.get(`/${id}`);
  return response.data.data;
};

export const createMenu = async (data: Partial<MenuItem>): Promise<MenuItem> => {
  const response: AxiosResponse<ApiResponse<MenuItem>> = await api.post('/', data);
  return response.data.data;
};

export const updateMenu = async (id: string, data: Partial<MenuItem>): Promise<MenuItem> => {
  const response: AxiosResponse<ApiResponse<MenuItem>> = await api.put(`/${id}`, data);
  return response.data.data;
};

export const deleteMenu = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};

export const reorderMenus = async ({
  parentId,
  itemId,
  newIndex,
}: {
  parentId: string;
  itemId: string;
  newIndex: number;
}): Promise<void> => {
  await api.put('/reorder', {
    parentId,
    itemId,
    newIndex,
  });
};

export const moveMenuItem = async ({
  itemId,
  newParentId,
  newIndex,
}: {
  itemId: string;
  newParentId: string;
  newIndex: number;
}): Promise<void> => {
  await api.put('/move', {
    itemId,
    newParentId,
    newIndex,
  });
}; 