import axios from 'axios';
import { MenuItem, CreateMenuDto, UpdateMenuDto, ReorderMenusDto, MoveMenuDto } from '../types/menu';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: `${API_URL}/menus`
});

// دریافت ساختار درختی منو
export const fetchMenuTree = async (): Promise<MenuItem[]> => {
  const response = await api.get('/tree');
  return response.data.data;
};

// دریافت یک منو با زیرمنوهایش
export const fetchMenuById = async (id: string): Promise<MenuItem> => {
  const response = await api.get(`/${id}`);
  return response.data.data;
};

// ایجاد منوی جدید
export const createMenu = async (data: CreateMenuDto): Promise<MenuItem> => {
  const response = await api.post('/', data);
  return response.data.data;
};

// به‌روزرسانی منو
export const updateMenu = async (id: string, data: UpdateMenuDto): Promise<MenuItem> => {
  const response = await api.put(`/${id}`, data);
  return response.data.data;
};

// حذف منو
export const deleteMenu = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};

// تغییر ترتیب منوها
export const reorderMenus = async (data: ReorderMenusDto): Promise<void> => {
  await api.post('/reorder', data);
};

// انتقال منو
export const moveMenuItem = async (data: MoveMenuDto): Promise<void> => {
  await api.post(`/${data.menuId}/move`, { newParentId: data.newParentId });
};

// اینترسپتور برای مدیریت توکن
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 