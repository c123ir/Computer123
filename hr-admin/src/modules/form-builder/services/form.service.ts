import { Form } from '../types';
import { api } from '../../../utils/api';

/**
 * دریافت فرم با شناسه
 */
export async function getForm(id: string): Promise<Form> {
  const response = await api.get(`/forms/${id}`);
  return response.data;
}

/**
 * ایجاد فرم جدید
 */
export async function createForm(form: Partial<Form>): Promise<Form> {
  const response = await api.post('/forms/create', form);
  return response.data;
}

/**
 * بروزرسانی فرم
 */
export async function updateForm(id: string, form: Partial<Form>): Promise<Form> {
  const response = await api.put(`/forms/${id}`, form);
  return response.data;
}

/**
 * حذف فرم
 */
export async function deleteForm(id: string): Promise<void> {
  await api.delete(`/forms/${id}`);
}

/**
 * کپی فرم
 */
export async function cloneForm(id: string): Promise<Form> {
  const response = await api.post(`/forms/${id}/clone`);
  return response.data;
}

/**
 * تغییر وضعیت فرم
 */
export async function updateFormStatus(id: string, status: Form['status']): Promise<Form> {
  const response = await api.patch(`/forms/${id}/status`, { status });
  return response.data;
}

/**
 * دریافت لیست فرم‌ها
 */
export async function getForms(): Promise<Form[]> {
  const response = await api.get('/forms');
  return response.data;
} 