import React from 'react';
import { FormField, PanelSettings as PanelSettingsType } from '../../types';

interface PanelSettingsProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

// مقادیر پیش‌فرض برای تنظیمات پنل
const defaultPanelSettings: PanelSettingsType = {
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
};

export const PanelSettings: React.FC<PanelSettingsProps> = ({ field, onUpdate }) => {
  // ترکیب تنظیمات پیش‌فرض با تنظیمات دریافتی
  const settings = {
    ...defaultPanelSettings,
    ...(field.fieldSettings?.panelSettings || {})
  };

  const handleSettingChange = (key: keyof PanelSettingsType, value: any) => {
    onUpdate({
      fieldSettings: {
        ...field.fieldSettings,
        panelSettings: {
          ...settings,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* عنوان پنل */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          عنوان پنل
        </label>
        <input
          type="text"
          value={settings.title}
          onChange={(e) => handleSettingChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          placeholder="عنوان پنل را وارد کنید"
        />
      </div>

      {/* تعداد ستون‌ها */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          تعداد ستون‌ها
        </label>
        <select
          value={settings.columns}
          onChange={(e) => handleSettingChange('columns', Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num} ستون
            </option>
          ))}
        </select>
      </div>

      {/* آیکون */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          آیکون
        </label>
        <input
          type="text"
          value={settings.icon || ''}
          onChange={(e) => handleSettingChange('icon', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          placeholder="نام آیکون را وارد کنید"
        />
      </div>

      {/* قابلیت جمع شدن */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="collapsible"
          checked={settings.collapsible}
          onChange={(e) => handleSettingChange('collapsible', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="collapsible" className="mr-2 block text-sm text-gray-700 dark:text-gray-300">
          قابلیت جمع شدن
        </label>
      </div>

      {/* وضعیت اولیه */}
      {settings.collapsible && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="defaultCollapsed"
            checked={settings.defaultCollapsed}
            onChange={(e) => handleSettingChange('defaultCollapsed', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="defaultCollapsed" className="mr-2 block text-sm text-gray-700 dark:text-gray-300">
            به صورت پیش‌فرض بسته باشد
          </label>
        </div>
      )}

      {/* رنگ پس‌زمینه */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          رنگ پس‌زمینه
        </label>
        <input
          type="color"
          value={settings.backgroundColor || '#ffffff'}
          onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
          className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
        />
      </div>

      {/* رنگ حاشیه */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          رنگ حاشیه
        </label>
        <input
          type="color"
          value={settings.borderColor || '#e5e7eb'}
          onChange={(e) => handleSettingChange('borderColor', e.target.value)}
          className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
        />
      </div>

      {/* شعاع گوشه‌ها */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          شعاع گوشه‌ها (پیکسل)
        </label>
        <input
          type="number"
          value={settings.borderRadius || 8}
          onChange={(e) => handleSettingChange('borderRadius', Number(e.target.value))}
          min="0"
          max="50"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
        />
      </div>

      {/* سایه */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          سایه
        </label>
        <select
          value={settings.shadow || 'md'}
          onChange={(e) => handleSettingChange('shadow', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
        >
          <option value="none">بدون سایه</option>
          <option value="sm">کم</option>
          <option value="md">متوسط</option>
          <option value="lg">زیاد</option>
        </select>
      </div>

      {/* پدینگ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          فاصله داخلی
        </label>
        <select
          value={settings.padding || 'md'}
          onChange={(e) => handleSettingChange('padding', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
        >
          <option value="sm">کم</option>
          <option value="md">متوسط</option>
          <option value="lg">زیاد</option>
        </select>
      </div>

      {/* حاشیه */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          فاصله بیرونی
        </label>
        <select
          value={settings.margin || 'md'}
          onChange={(e) => handleSettingChange('margin', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
        >
          <option value="sm">کم</option>
          <option value="md">متوسط</option>
          <option value="lg">زیاد</option>
        </select>
      </div>

      {/* تصویر پس‌زمینه */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          تصویر پس‌زمینه (URL)
        </label>
        <input
          type="text"
          value={settings.backgroundImage || ''}
          onChange={(e) => handleSettingChange('backgroundImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          placeholder="آدرس تصویر را وارد کنید"
        />
      </div>

      {/* موقعیت تصویر پس‌زمینه */}
      {settings.backgroundImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            موقعیت تصویر پس‌زمینه
          </label>
          <select
            value={settings.backgroundPosition || 'center'}
            onChange={(e) => handleSettingChange('backgroundPosition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          >
            <option value="center">وسط</option>
            <option value="top">بالا</option>
            <option value="bottom">پایین</option>
            <option value="left">چپ</option>
            <option value="right">راست</option>
          </select>
        </div>
      )}

      {/* نحوه نمایش تصویر پس‌زمینه */}
      {settings.backgroundImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            نحوه نمایش تصویر پس‌زمینه
          </label>
          <select
            value={settings.backgroundSize || 'cover'}
            onChange={(e) => handleSettingChange('backgroundSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          >
            <option value="cover">پوشش کامل</option>
            <option value="contain">متناسب با ابعاد</option>
            <option value="auto">خودکار</option>
          </select>
        </div>
      )}

      {/* شفافیت پس‌زمینه */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          شفافیت پس‌زمینه
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={(settings.backgroundOpacity || 1) * 100}
          onChange={(e) => handleSettingChange('backgroundOpacity', Number(e.target.value) / 100)}
          className="w-full"
        />
        <div className="text-xs text-gray-500 mt-1">
          {Math.round((settings.backgroundOpacity || 1) * 100)}%
        </div>
      </div>
    </div>
  );
};

export default PanelSettings; 