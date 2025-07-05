import { Form } from '../types';
import { buildApiUrl } from '../../../utils/api';

/**
 * دریافت فرم با شناسه
 */
export async function getForm(id: string): Promise<Form> {
  const response = await fetch(buildApiUrl(`/forms/${id}`));
  if (!response.ok) {
    throw new Error(`خطا در دریافت فرم: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    ...data,
    fields: data.fields || [] // اطمینان از وجود fields
  };
}

/**
 * ایجاد فرم جدید
 */
export async function createForm(form: Partial<Form>): Promise<Form> {
  const response = await fetch(buildApiUrl('/forms/create'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });
  if (!response.ok) {
    throw new Error(`خطا در ایجاد فرم: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    ...data,
    fields: data.fields || []
  };
}

/**
 * بروزرسانی فرم
 */
export async function updateForm(id: string, form: Partial<Form>): Promise<Form> {
  const response = await fetch(buildApiUrl(`/forms/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });
  if (!response.ok) {
    throw new Error(`خطا در بروزرسانی فرم: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    ...data,
    fields: data.fields || []
  };
}

/**
 * حذف فرم
 */
export async function deleteForm(id: string): Promise<void> {
  const response = await fetch(buildApiUrl(`/forms/${id}`), {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(`خطا در حذف فرم: ${response.statusText}`);
  }
}

/**
 * کپی فرم
 */
export async function cloneForm(id: string): Promise<Form> {
  const response = await fetch(buildApiUrl(`/forms/${id}/clone`), {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`خطا در کپی فرم: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    ...data,
    fields: data.fields || []
  };
}

/**
 * تغییر وضعیت فرم
 */
export async function updateFormStatus(id: string, status: Form['status']): Promise<Form> {
  const response = await fetch(buildApiUrl(`/forms/${id}/status`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  if (!response.ok) {
    throw new Error(`خطا در تغییر وضعیت فرم: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    ...data,
    fields: data.fields || []
  };
}

/**
 * دریافت لیست فرم‌ها
 */
export async function getForms(): Promise<Form[]> {
  const response = await fetch(buildApiUrl('/forms'));
  if (!response.ok) {
    throw new Error(`خطا در دریافت لیست فرم‌ها: ${response.statusText}`);
  }
  const data = await response.json();
  return data.map((form: Form) => ({
    ...form,
    fields: form.fields || []
  }));
} 