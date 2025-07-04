import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem, MenuType, CreateMenuDto, UpdateMenuDto, MenuConfig } from '../../types/menu';
import { createMenu, updateMenu, deleteMenu } from '../../services/menu.service';
import { MenuTree } from './MenuTree';
import { Logger } from '../../utils/logger';

interface MenuManagerProps {
  className?: string;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ className }) => {
  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CreateMenuDto>({
    title: '',
    type: MenuType.STATIC,
    config: {
      static: {
        route: '/',
        component: 'DefaultComponent'
      }
    },
    permissions: [],
    roles: []
  });

  // میوتیشن‌ها
  const createMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'tree'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; menu: UpdateMenuDto }) => 
      updateMenu(data.id, data.menu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'tree'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'tree'] });
      setSelectedMenu(null);
    }
  });

  // مدیریت فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && selectedMenu) {
        await updateMutation.mutateAsync({
          id: selectedMenu.id,
          menu: formData as UpdateMenuDto
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      Logger.error('Error in menu form submission:', error);
    }
  };

  const handleMenuSelect = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsEditing(true);
    setFormData({
      title: menu.title,
      icon: menu.icon,
      type: menu.type,
      config: menu.config,
      parentId: menu.parentId || undefined,
      formId: menu.formId || undefined,
      permissions: menu.permissions || [],
      roles: menu.roles || []
    });
  };

  const handleDelete = async () => {
    if (!selectedMenu) return;
    
    try {
      await deleteMutation.mutateAsync(selectedMenu.id);
    } catch (error) {
      Logger.error('Error deleting menu:', error);
    }
  };

  const resetForm = () => {
    setSelectedMenu(null);
    setIsEditing(false);
    setFormData({
      title: '',
      type: MenuType.STATIC,
      config: {
        static: {
          route: '/',
          component: 'DefaultComponent'
        }
      },
      permissions: [],
      roles: []
    });
  };

  return (
    <div className={`menu-manager ${className || ''}`}>
      <div className="menu-tree-container">
        <h2>ساختار منو</h2>
        <MenuTree onMenuSelect={handleMenuSelect} />
      </div>

      <div className="menu-form-container">
        <h2>{isEditing ? 'ویرایش منو' : 'منوی جدید'}</h2>
        <form onSubmit={handleSubmit}>
          {/* عنوان */}
          <div className="form-group">
            <label htmlFor="title">عنوان</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* آیکون */}
          <div className="form-group">
            <label htmlFor="icon">آیکون</label>
            <input
              type="text"
              id="icon"
              value={formData.icon || ''}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
            />
          </div>

          {/* نوع منو */}
          <div className="form-group">
            <label htmlFor="type">نوع منو</label>
            <select
              id="type"
              value={formData.type}
              onChange={e => {
                const newType = e.target.value as MenuType;
                let newConfig: MenuConfig = {};
                
                switch (newType) {
                  case MenuType.STATIC:
                    newConfig = {
                      static: {
                        route: '/',
                        component: 'DefaultComponent'
                      }
                    };
                    break;
                  case MenuType.DYNAMIC:
                    newConfig = {
                      dynamic: {
                        dataSource: '',
                        template: ''
                      }
                    };
                    break;
                  case MenuType.FORM:
                    newConfig = {
                      form: {
                        formId: '',
                        viewType: 'list'
                      }
                    };
                    break;
                }

                setFormData({ 
                  ...formData, 
                  type: newType,
                  config: newConfig
                });
              }}
            >
              <option value={MenuType.STATIC}>استاتیک</option>
              <option value={MenuType.DYNAMIC}>پویا</option>
              <option value={MenuType.FORM}>فرم</option>
            </select>
          </div>

          {/* تنظیمات بر اساس نوع */}
          {formData.type === MenuType.STATIC && formData.config.static && (
            <div className="form-group">
              <label htmlFor="route">مسیر</label>
              <input
                type="text"
                id="route"
                value={formData.config.static.route}
                                  onChange={e => setFormData({
                    ...formData,
                    config: {
                      ...formData.config,
                      static: {
                        ...formData.config.static,
                        route: e.target.value,
                        component: formData.config.static?.component || 'DefaultComponent'
                      }
                    }
                  })}
              />
            </div>
          )}

          {formData.type === MenuType.FORM && (
            <div className="form-group">
              <label htmlFor="formId">شناسه فرم</label>
              <input
                type="text"
                id="formId"
                value={formData.formId || ''}
                onChange={e => setFormData({ ...formData, formId: e.target.value })}
              />
            </div>
          )}

          {/* دکمه‌ها */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {isEditing ? 'به‌روزرسانی' : 'ایجاد'}
            </button>
            
            {isEditing && (
              <>
                <button type="button" className="btn-danger" onClick={handleDelete}>
                  حذف
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  انصراف
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}; 