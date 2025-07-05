import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FormField, PanelSettings } from '../../types';

interface PanelFieldProps {
  field: FormField & { fieldSettings: { panelSettings: PanelSettings } };
  children?: React.ReactNode;
  onFieldSelect?: (fieldId: string) => void;
  isSelected?: boolean;
  readonly?: boolean;
}

export const PanelField: React.FC<PanelFieldProps> = ({
  field,
  children,
  onFieldSelect,
  isSelected,
  readonly
}) => {
  const { panelSettings } = field.fieldSettings;
  const [isCollapsed, setIsCollapsed] = useState(panelSettings.defaultCollapsed);

  // تبدیل تعداد ستون به کلاس tailwind
  const getColumnsClass = (columns: number) => {
    const map: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6'
    };
    return map[columns] || 'grid-cols-1';
  };

  // تبدیل سایز padding به کلاس tailwind
  const getPaddingClass = (size?: 'sm' | 'md' | 'lg') => {
    const map: Record<string, string> = {
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6'
    };
    return map[size || 'md'];
  };

  // تبدیل سایز margin به کلاس tailwind
  const getMarginClass = (size?: 'sm' | 'md' | 'lg') => {
    const map: Record<string, string> = {
      sm: 'm-2',
      md: 'm-4',
      lg: 'm-6'
    };
    return map[size || 'md'];
  };

  // تبدیل سایز shadow به کلاس tailwind
  const getShadowClass = (shadow?: 'none' | 'sm' | 'md' | 'lg') => {
    const map: Record<string, string> = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow',
      lg: 'shadow-lg'
    };
    return map[shadow || 'none'];
  };

  const handleClick = () => {
    if (!readonly && onFieldSelect) {
      onFieldSelect(field.id);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (panelSettings.collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div
      className={`
        relative
        ${getMarginClass(panelSettings.margin)}
        ${getShadowClass(panelSettings.shadow)}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        rounded-lg
        transition-all
        duration-200
        cursor-pointer
        hover:shadow-lg
      `}
      style={{
        backgroundColor: panelSettings.backgroundColor || '#ffffff',
        borderColor: panelSettings.borderColor,
        borderRadius: panelSettings.borderRadius ? `${panelSettings.borderRadius}px` : '0.5rem',
        backgroundImage: panelSettings.backgroundImage ? `url(${panelSettings.backgroundImage})` : undefined,
        backgroundPosition: panelSettings.backgroundPosition || 'center',
        backgroundSize: panelSettings.backgroundSize || 'cover',
        opacity: panelSettings.backgroundOpacity || 1
      }}
      onClick={handleClick}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center space-x-2 space-x-reverse">
          {panelSettings.icon && (
            <span className="text-gray-500">{panelSettings.icon}</span>
          )}
          <h3 className="text-lg font-semibold">{panelSettings.title}</h3>
        </div>
        {panelSettings.collapsible && (
          <button
            onClick={handleToggle}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Panel Content */}
      <div
        className={`
          ${getPaddingClass(panelSettings.padding)}
          ${isCollapsed ? 'hidden' : 'block'}
          transition-all
          duration-200
        `}
      >
        <div className={`grid ${getColumnsClass(panelSettings.columns)} gap-4`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PanelField; 