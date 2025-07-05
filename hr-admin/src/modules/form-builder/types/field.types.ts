// =====================================================
// 🔧 فایل: src/modules/form-builder/types/field.types.ts
// =====================================================

/**
 * انواع فیلد‌های قابل استفاده در فرم‌ساز
 */
export type FieldType = 
  | 'text'          // متن ساده
  | 'textarea'      // متن چندخطی
  | 'number'        // عدد
  | 'email'         // ایمیل
  | 'tel'           // شماره تلفن
  | 'url'           // آدرس وبسایت
  | 'select'        // انتخاب از لیست
  | 'radio'         // انتخاب یکی از چند
  | 'checkbox'      // چک باکس
  | 'date'          // تاریخ
  | 'time'          // زمان
  | 'datetime'      // تاریخ و زمان
  | 'file'          // آپلود فایل
  | 'signature'     // امضا
  | 'rating'        // امتیازدهی
  | 'slider';       // اسلایدر

/**
 * گزینه‌های فیلد (برای select, radio, checkbox)
 */
export interface FieldOption {
  /** شناسه یکتا */
  id: string;
  /** برچسب نمایشی */
  label: string;
  /** مقدار */
  value: string;
  /** آیا پیش‌فرض انتخاب شده باشد؟ */
  selected?: boolean;
  /** غیرفعال */
  disabled?: boolean;
}

/**
 * قوانین اعتبارسنجی فیلد
 */
export interface ValidationRules {
  /** الزامی */
  required?: boolean;
  /** حداقل طول */
  minLength?: number;
  /** حداکثر طول */
  maxLength?: number;
  /** الگوی regex */
  pattern?: string;
  /** پیام خطای سفارشی برای pattern */
  patternMessage?: string;
  /** حداقل مقدار (برای number) */
  min?: number;
  /** حداکثر مقدار (برای number) */
  max?: number;
  /** انواع فایل مجاز */
  fileTypes?: string[];
  /** حداکثر اندازه فایل (بایت) */
  maxFileSize?: number;
  /** اعتبارسنجی سفارشی */
  customValidation?: {
    rule: string;
    message: string;
  };
}

/**
 * تنظیمات ظاهری فیلد
 */
export interface FieldStyling {
  /** عرض فیلد */
  width: string;
  /** کلاس CSS سفارشی */
  className?: string;
  /** رنگ پس‌زمینه */
  backgroundColor?: string;
  /** رنگ متن */
  textColor?: string;
  /** رنگ border */
  borderColor?: string;
  /** نوع border */
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  /** ضخامت border */
  borderWidth?: number;
  /** شعاع گوشه‌ها */
  borderRadius?: number;
  /** فاصله داخلی */
  padding?: number;
  /** فاصله خارجی */
  margin?: number;
}

/**
 * شرط نمایش فیلد
 */
export interface FieldCondition {
  /** وابسته به کدام فیلد */
  dependsOn: string;
  /** نوع عملگر */
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less';
  /** مقدار مقایسه */
  value: any;
  /** عمل در صورت برقراری شرط */
  action: 'show' | 'hide' | 'require' | 'disable';
}

/**
 * تنظیمات خاص نوع فیلد
 */
export interface FieldSettings {
  /** برای file: multiple selection */
  multiple?: boolean;
  /** برای rating: تعداد ستاره */
  maxRating?: number;
  /** برای slider: مقدار min/max/step */
  min?: number;
  max?: number;
  step?: number;
  /** برای textarea: تعداد خط */
  rows?: number;
  /** برای select: قابلیت جستجو */
  searchable?: boolean;
  /** برای date: محدودیت تاریخ */
  minDate?: string;
  maxDate?: string;
  /** تنظیمات اضافی */
  [key: string]: any;
}

/**
 * اعتبارسنجی سفارشی
 */
export interface CustomValidator {
  /** شناسه validator */
  id: string;
  /** نام */
  name: string;
  /** function اعتبارسنجی */
  validator: (value: any, field: FormField, form: any) => boolean | string;
  /** پیام خطا */
  errorMessage: string;
  /** اولویت اجرا */
  priority?: number;
}

/**
 * فیلد فرم - نسخه کامل
 */
export interface FormField {
  /** شناسه یکتا */
  id: string;
  /** نوع فیلد */
  type: FieldType;
  /** برچسب فیلد */
  label: string;
  /** متن راهنما */
  placeholder?: string;
  /** توضیح کمکی */
  helpText?: string;
  /** آیا اجباری است؟ */
  required: boolean;
  /** مقدار پیش‌فرض */
  defaultValue?: any;
  /** آیا غیرفعال است؟ */
  disabled: boolean;
  /** آیا فقط‌خواندنی است؟ */
  readonly: boolean;
  /** قوانین اعتبارسنجی */
  validation: ValidationRules;
  /** تنظیمات ظاهری */
  styling: FieldStyling;
  /** گزینه‌ها (برای select, radio, checkbox) */
  options?: FieldOption[];
  /** تنظیمات خاص نوع فیلد */
  fieldSettings?: FieldSettings;
  /** شرایط نمایش */
  conditions?: FieldCondition[];
}