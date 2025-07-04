import React, { useState } from 'react';
import { Form, FormField, FieldType } from '../types';

interface FormEditorProps {
  form?: Form;
  onSave: (form: Form) => void;
  onCancel: () => void;
}

const defaultForm: Form = {
  id: '',
  name: '',
  description: '',
  fields: [],
  settings: {
    submitButtonText: 'ارسال',
    showProgressBar: true,
    allowSaveDraft: true,
    showFieldNumbers: true,
    formWidth: 'medium',
  },
  styling: {
    theme: 'default',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    primaryColor: '#3b82f6',
    fontFamily: 'Vazirmatn',
    fontSize: 14,
    borderRadius: 8,
    spacing: 'normal',
  },
  metadata: {
    createdBy: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    version: 1,
  },
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const FormEditor: React.FC<FormEditorProps> = ({ form: initialForm, onSave, onCancel }) => {
  const [form, setForm] = useState<Form>(initialForm || defaultForm);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `فیلد ${type}`,
      placeholder: '',
      helpText: '',
      required: false,
      disabled: false,
      readonly: false,
      validation: {},
      styling: {
        width: '100%',
      },
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setSelectedFieldIndex(form.fields.length);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeField = (index: number) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
    setSelectedFieldIndex(null);
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    setForm(prev => {
      const fields = [...prev.fields];
      const [removed] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, removed);
      return { ...prev, fields };
    });
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Field Types */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 border-l border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">افزودن فیلد</h3>
        <div className="space-y-2">
          <button
            onClick={() => addField('text')}
            className="w-full p-2 text-right bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            متن کوتاه
          </button>
          <button
            onClick={() => addField('textarea')}
            className="w-full p-2 text-right bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            متن بلند
          </button>
          <button
            onClick={() => addField('number')}
            className="w-full p-2 text-right bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            عدد
          </button>
          <button
            onClick={() => addField('select')}
            className="w-full p-2 text-right bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            لیست کشویی
          </button>
          {/* Add more field types */}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 p-6">
        {/* Form Settings */}
        <div className="mb-6">
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="عنوان فرم"
            className="text-2xl font-bold w-full mb-2 bg-transparent border-0 focus:outline-none focus:ring-0"
          />
          <textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="توضیحات فرم"
            className="w-full h-20 bg-transparent border-0 focus:outline-none focus:ring-0 resize-none"
          />
        </div>

        {/* Fields List */}
        <div className="space-y-4">
          {form.fields.map((field, index) => (
            <div
              key={field.id}
              className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${
                selectedFieldIndex === index ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedFieldIndex(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={e => updateField(index, { label: e.target.value })}
                  className="font-semibold bg-transparent border-0 focus:outline-none focus:ring-0"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => moveField(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveField(index, Math.min(form.fields.length - 1, index + 1))}
                    disabled={index === form.fields.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeField(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Field Preview */}
              <div className="mt-2">
                {field.type === 'text' && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    disabled
                    className="w-full p-2 border rounded"
                  />
                )}
                {field.type === 'textarea' && (
                  <textarea
                    placeholder={field.placeholder}
                    disabled
                    className="w-full p-2 border rounded"
                  />
                )}
                {field.type === 'number' && (
                  <input
                    type="number"
                    placeholder={field.placeholder}
                    disabled
                    className="w-full p-2 border rounded"
                  />
                )}
                {field.type === 'select' && (
                  <select disabled className="w-full p-2 border rounded">
                    <option>انتخاب کنید...</option>
                  </select>
                )}
              </div>

              {/* Field Settings */}
              {selectedFieldIndex === index && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">متن راهنما</label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={e => updateField(index, { placeholder: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">توضیحات</label>
                      <input
                        type="text"
                        value={field.helpText || ''}
                        onChange={e => updateField(index, { helpText: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={e => updateField(index, { required: e.target.checked })}
                        />
                        <span className="text-sm">اجباری</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.disabled}
                          onChange={e => updateField(index, { disabled: e.target.checked })}
                        />
                        <span className="text-sm">غیرفعال</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.readonly}
                          onChange={e => updateField(index, { readonly: e.target.checked })}
                        />
                        <span className="text-sm">فقط خواندنی</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="fixed bottom-0 right-0 left-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              انصراف
            </button>
            <button
              onClick={() => onSave(form)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ذخیره
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 