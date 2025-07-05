import { LayoutDashboard } from 'lucide-react';
import { PanelField } from '../components/Fields/PanelField';
import { PanelSettings } from '../components/Settings/PanelSettings';
import { FieldType } from '../types';

// ... existing imports ...

export const FieldRegistry = {
  // ... existing fields ...

  panel: {
    type: 'panel',
    icon: LayoutDashboard,
    label: 'پنل',
    description: 'یک پنل با قابلیت تنظیم ستون‌ها و استایل',
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