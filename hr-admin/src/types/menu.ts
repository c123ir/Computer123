export enum MenuType {
  STATIC = 'STATIC',
  DYNAMIC = 'DYNAMIC',
  FORM = 'FORM'
}

export enum MenuStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  type: MenuType;
  status: MenuStatus;
  order: number;
  config: MenuConfig;
  parentId?: string | null;
  formId?: string | null;
  permissions: string[];
  roles: string[];
  children?: MenuItem[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuConfig {
  // تنظیمات استاتیک
  static?: {
    route: string;
    component: string;
    params?: Record<string, any>;
  };
  
  // تنظیمات پویا
  dynamic?: {
    dataSource: string;
    template: string;
    refreshInterval?: number;
  };
  
  // تنظیمات فرم
  form?: {
    formId: string;
    viewType: 'list' | 'grid' | 'calendar';
    defaultFilters?: FilterDefinition[];
    actions?: MenuAction[];
  };
}

export interface FilterDefinition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

export interface MenuAction {
  type: 'create' | 'edit' | 'delete' | 'custom';
  label: string;
  icon?: string;
  permissions?: string[];
  config?: Record<string, any>;
}

export interface CreateMenuDto {
  title: string;
  icon?: string;
  type: MenuType;
  config: MenuConfig;
  parentId?: string;
  formId?: string;
  permissions: string[];
  roles: string[];
}

export interface UpdateMenuDto extends Partial<CreateMenuDto> {
  status?: MenuStatus;
}

export interface ReorderMenusDto {
  parentId: string | null;
  menuIds: string[];
}

export interface MoveMenuDto {
  menuId: string;
  newParentId: string | null;
} 