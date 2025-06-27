// src/modules/form-builder/types/field.types.ts

// Re-export everything from form.types for convenience
export * from './form.types';

/**
 * تنظیمات درگ اند دراپ
 */
export interface DragDropConfig {
  /** آیا قابل کشیدن است؟ */
  isDraggable: boolean;
  /** آیا می‌تواند محل کشیدن باشد؟ */
  isDroppable: boolean;
  /** نوع داده برای drag & drop */
  dragType: 'field' | 'form' | 'section';
  /** شناسه منطقه drop */
  dropZoneId?: string;
}

/**
 * Field Palette Item - فیلد در palette
 */
export interface FieldPaletteItem {
  /** نوع فیلد */
  type: FieldType;
  /** نام نمایشی */
  displayName: string;
  /** آیکون */
  icon: string;
  /** توضیح کوتاه */
  description: string;
  /** دسته‌بندی */
  category: 'basic' | 'advanced' | 'layout' | 'special';
  /** آیا PRO feature است؟ */
  isPro?: boolean;
  /** تنظیمات پیش‌فرض */
  defaultConfig: Partial<FormField>;
}

/**
 * تنظیمات validator سفارشی
 */
export interface CustomValidator {
  /** نام validator */
  name: string;
  /** تابع validation */
  validator: (value: any, field: any, formData: Record<string, any>) => boolean | string;
  /** پیام خطا */
  errorMessage: string;
  /** آیا async است؟ */
  async?: boolean;
}

/**
 * Event Handler برای فیلد
 */
export interface FieldEventHandler {
  /** نوع event */
  event: 'onChange' | 'onFocus' | 'onBlur' | 'onClick' | 'onLoad';
  /** action */
  action: 'showField' | 'hideField' | 'setValue' | 'calculate' | 'validate' | 'custom';
  /** پارامترها */
  params?: Record<string, any>;
  /** شرط اجرا */
  condition?: string;
}

/**
 * انیمیشن فیلد
 */
export interface FieldAnimation {
  /** نوع انیمیشن */
  type: 'fadeIn' | 'slideIn' | 'bounce' | 'pulse' | 'shake';
  /** مدت زمان (میلی‌ثانیه) */
  duration: number;
  /** تأخیر (میلی‌ثانیه) */
  delay?: number;
  /** تکرار */
  repeat?: boolean;
}

/**
 * Tooltip فیلد
 */
export interface FieldTooltip {
  /** متن tooltip */
  text: string;
  /** موقعیت */
  position: 'top' | 'bottom' | 'left' | 'right';
  /** trigger */
  trigger: 'hover' | 'click' | 'focus';
  /** تأخیر نمایش */
  delay?: number;
}

/**
 * فیلد پیشرفته با قابلیت‌های اضافی
 */
export interface AdvancedFormField extends FormField {
  /** تنظیمات drag & drop */
  dragDrop?: DragDropConfig;
  /** event handler ها */
  eventHandlers?: FieldEventHandler[];
  /** انیمیشن */
  animation?: FieldAnimation;
  /** tooltip */
  tooltip?: FieldTooltip;
  /** validator های سفارشی */
  customValidators?: CustomValidator[];
  /** dependency به فیلدهای دیگر */
  dependencies?: {
    fieldId: string;
    type: 'value' | 'visibility' | 'validation' | 'options';
    mapping: Record<string, any>;
  }[];
  /** cache تنظیمات */
  cache?: {
    enabled: boolean;
    ttl: number; // time to live in seconds
  };
}

/**
 * Field Group - گروه‌بندی فیلدها
 */
export interface FieldGroup {
  /** شناسه گروه */
  id: string;
  /** نام گروه */
  name: string;
  /** توضیح */
  description?: string;
  /** فیلدهای عضو */
  fieldIds: string[];
  /** نوع layout */
  layout: 'vertical' | 'horizontal' | 'grid' | 'tabs';
  /** تنظیمات grid (اگر layout = grid) */
  gridConfig?: {
    columns: number;
    gap: number;
    responsive: boolean;
  };
  /** قابل collapse */
  collapsible?: boolean;
  /** پیش‌فرض collapsed */
  defaultCollapsed?: boolean;
  /** رنگ‌بندی */
  styling?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: number;
    margin?: number;
  };
}

/**
 * Field Section - بخش‌بندی فرم
 */
export interface FormSection {
  /** شناسه بخش */
  id: string;
  /** عنوان بخش */
  title: string;
  /** توضیح */
  description?: string;
  /** فیلدها و گروه‌ها */
  items: (string | FieldGroup)[];
  /** قابل تا شدن */
  collapsible: boolean;
  /** پیش‌فرض باز/بسته */
  defaultExpanded: boolean;
  /** شرط نمایش */
  visibility?: {
    condition: string;
    dependsOn: string[];
  };
  /** تنظیمات ظاهری */
  styling?: {
    headerStyle?: Record<string, any>;
    contentStyle?: Record<string, any>;
  };
}

/**
 * Field State - وضعیت فیلد در runtime
 */
export interface FieldState {
  /** مقدار فعلی */
  value: any;
  /** آیا فعال است؟ */
  isActive: boolean;
  /** آیا نمایش داده می‌شود؟ */
  isVisible: boolean;
  /** آیا معتبر است؟ */
  isValid: boolean;
  /** خطاهای validation */
  errors: string[];
  /** آیا touched شده؟ */
  isTouched: boolean;
  /** آیا در حال loading است؟ */
  isLoading: boolean;
  /** تاریخ آخرین تغییر */
  lastModified: Date;
  /** metadata اضافی */
  metadata?: Record<string, any>;
}

/**
 * Field Registry - ثبت انواع فیلد
 */
export interface FieldRegistry {
  /** ثبت فیلد جدید */
  register(fieldType: string, config: FieldPaletteItem): void;
  /** دریافت فیلد */
  get(fieldType: string): FieldPaletteItem | undefined;
  /** لیست تمام فیلدها */
  getAll(): FieldPaletteItem[];
  /** لیست بر اساس دسته */
  getByCategory(category: string): FieldPaletteItem[];
  /** حذف فیلد */
  unregister(fieldType: string): void;
}

/**
 * Field Factory - ساخت فیلد
 */
export interface FieldFactory {
  /** ساخت فیلد جدید */
  create(type: FieldType, config?: Partial<FormField>): FormField;
  /** کلون فیلد */
  clone(field: FormField): FormField;
  /** Validate فیلد */
  validate(field: FormField): string[];
  /** تبدیل فیلد به JSON */
  serialize(field: FormField): string;
  /** تبدیل JSON به فیلد */
  deserialize(json: string): FormField;
}

/**
 * انواع خطاهای validation
 */
export type ValidationErrorType = 
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'min'
  | 'max'
  | 'email'
  | 'url'
  | 'fileType'
  | 'fileSize'
  | 'custom';

/**
 * نتیجه validation
 */
export interface ValidationResult {
  /** آیا معتبر است؟ */
  isValid: boolean;
  /** خطاها */
  errors: {
    type: ValidationErrorType;
    message: string;
    field: string;
  }[];
  /** هشدارها */
  warnings?: {
    type: string;
    message: string;
    field: string;
  }[];
}

/**
 * تنظیمات accessibility
 */
export interface AccessibilityConfig {
  /** aria-label */
  ariaLabel?: string;
  /** aria-describedby */
  ariaDescribedBy?: string;
  /** role */
  role?: string;
  /** tabindex */
  tabIndex?: number;
  /** کلیدهای میانبر */
  shortcuts?: {
    key: string;
    action: string;
  }[];
  /** پشتیبانی screen reader */
  screenReader?: {
    announcements: string[];
    liveRegion: boolean;
  };
}