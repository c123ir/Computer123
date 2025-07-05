import { LayoutDashboard } from 'lucide-react';
import { PanelField } from '../components/Fields/PanelField';
import { PanelSettings } from '../components/Settings/PanelSettings';
import { FieldType } from '../types';

interface FieldRegistryItem {
  type: FieldType;
  icon: any;
  label: string;
  description: string;
  component: React.ComponentType<any>;
  settingsComponent: React.ComponentType<any>;
  defaultSettings: any;
  category: string;
  isContainer?: boolean;
  allowChildren?: boolean;
  maxChildren?: number;
}

type FieldRegistryType = {
  [K in FieldType]: FieldRegistryItem;
};

export const FieldRegistry: Partial<FieldRegistryType> = {
  panel: {
    type: 'panel',
    icon: LayoutDashboard,
    label: 'پنل',
    description: 'پنل با قابلیت تنظیم ستون‌ها',
    component: PanelField,
    settingsComponent: PanelSettings,
    defaultSettings: {
      panelSettings: {
        title: 'پنل جدید',
        columns: 1,
        collapsible: true,
        defaultCollapsed: false,
        padding: 'md',
        margin: 'md',
        shadow: 'md',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        backgroundOpacity: 1
      }
    },
    category: 'layout',
    isContainer: true,
    allowChildren: true,
    maxChildren: 50
  }
} as const; 