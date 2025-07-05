import React, { useState } from 'react';
import { Settings, ArrowRight } from 'lucide-react';
import { FormField, FieldType } from '../../types';
import FieldsPanel from './FieldsPanel';
import SettingsPanel from './SettingsPanel';

interface SidePanelProps {
  selectedField?: FormField;
  onFieldSelect?: (fieldType: FieldType) => void;
  onFieldUpdate?: (fieldId: string, updates: Partial<FormField>) => void;
  readonly?: boolean;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  selectedField,
  onFieldSelect,
  onFieldUpdate,
  readonly = false
}) => {
  // حالت نمایش: 'fields' برای لیست فیلدها، 'settings' برای تنظیمات
  const [mode, setMode] = useState<'fields' | 'settings'>('fields');

  // تغییر خودکار به حالت تنظیمات وقتی فیلدی انتخاب می‌شود
  React.useEffect(() => {
    if (selectedField) {
      setMode('settings');
    }
  }, [selectedField]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {mode === 'settings' && selectedField ? (
          <>
            <button
              onClick={() => setMode('fields')}
              className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              <span>بازگشت به فیلدها</span>
            </button>
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </>
        ) : (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            فیلدهای فرم
          </h3>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'fields' ? (
          <FieldsPanel
            onFieldSelect={onFieldSelect}
            readonly={readonly}
          />
        ) : (
          <SettingsPanel
            selectedField={selectedField}
            onFieldUpdate={onFieldUpdate}
            readonly={readonly}
          />
        )}
      </div>
    </div>
  );
};

export default SidePanel; 