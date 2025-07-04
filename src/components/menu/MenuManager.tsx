import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem, MenuType } from '../../types/menu';
import { createMenu, updateMenu, deleteMenu } from '../../services/menu.service';

interface MenuManagerProps {
  selectedItem?: MenuItem;
  onClose: () => void;
}

interface FormData {
  title: string;
  type: MenuType;
  config: {
    static?: {
      route: string;
      component: string;
      params?: Record<string, any>;
    };
    dynamic?: {
      dataSource: string;
      template: string;
      refreshInterval?: number;
    };
    form?: {
      formId: string;
      viewType: 'list' | 'grid' | 'calendar';
      defaultFilters?: any[];
      actions?: any[];
    };
  };
}

const MenuManager: React.FC<MenuManagerProps> = ({ selectedItem, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>(() => {
    if (selectedItem) {
      return {
        title: selectedItem.title,
        type: selectedItem.type,
        config: selectedItem.config || {},
      };
    }
    return {
      title: '',
      type: 'static',
      config: {},
    };
  });

  const createMutation = useMutation(createMenu, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menuTree']);
      onClose();
    },
  });

  const updateMutation = useMutation(
    (data: FormData) => updateMenu(selectedItem!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menuTree']);
        onClose();
      },
    }
  );

  const deleteMutation = useMutation(
    () => deleteMenu(selectedItem!.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menuTree']);
        onClose();
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (selectedItem && window.confirm('آیا از حذف این منو اطمینان دارید؟')) {
      deleteMutation.mutate();
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as MenuType;
    setFormData(prev => ({
      ...prev,
      type,
      config: {},
    }));
  };

  const handleRouteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        static: {
          ...prev.config.static,
          route: e.target.value,
          component: 'default',
        },
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selectedItem ? 'ویرایش منو' : 'منوی جدید'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">عنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">نوع منو</label>
            <select
              value={formData.type}
              onChange={handleTypeChange}
              className="w-full border rounded p-2"
            >
              <option value="static">استاتیک</option>
              <option value="dynamic">پویا</option>
              <option value="form">فرم</option>
            </select>
          </div>

          {formData.type === 'static' && (
            <div className="mb-4">
              <label className="block mb-2">مسیر</label>
              <input
                type="text"
                value={formData.config.static?.route || ''}
                onChange={handleRouteChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            {selectedItem && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                حذف
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {selectedItem ? 'ذخیره تغییرات' : 'ایجاد منو'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuManager; 