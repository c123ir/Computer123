export type MenuType = 'static' | 'dynamic' | 'form';

export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  type: MenuType;
  children?: MenuItem[];
  config?: MenuConfig;
  permissions?: string[];
}

export interface MenuConfig {
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
    defaultFilters?: FilterDefinition[];
    actions?: MenuAction[];
  };
}

export interface FilterDefinition {
  field: string;
  operator: string;
  value: any;
}

export interface MenuAction {
  type: string;
  label: string;
  icon?: string;
  handler?: () => void;
} 