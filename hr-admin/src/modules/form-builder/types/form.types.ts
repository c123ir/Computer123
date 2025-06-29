// src/modules/form-builder/types/form.types.ts

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
  width: '25%' | '50%' | '75%' | '100%';
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
 * فیلد فرم
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
  disabled?: boolean;
  /** آیا فقط‌خواندنی است؟ */
  readonly?: boolean;
  /** قوانین اعتبارسنجی */
  validation: ValidationRules;
  /** تنظیمات ظاهری */
  styling: FieldStyling;
  /** گزینه‌ها (برای select, radio, checkbox) */
  options?: FieldOption[];
  /** تنظیمات خاص نوع فیلد */
  fieldSettings?: {
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
    /** برای date: format */
    dateFormat?: string;
  };
  /** شرط نمایش (Conditional Logic) */
  conditions?: {
    /** فیلد مرجع */
    dependsOn: string;
    /** مقدار مورد انتظار */
    value: any;
    /** نوع شرط */
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  }[];
}

/**
 * تنظیمات فرم
 */
export interface FormSettings {
  /** متن دکمه ارسال */
  submitButtonText: string;
  /** نمایش نوار پیشرفت */
  showProgressBar: boolean;
  /** امکان ذخیره پیش‌نویس */
  allowSaveDraft: boolean;
  /** هدایت پس از ارسال */
  redirectAfterSubmit?: string;
  /** نمایش شماره فیلد */
  showFieldNumbers: boolean;
  /** عرض فرم */
  formWidth: 'small' | 'medium' | 'large' | 'full';
  /** محدودیت زمانی */
  timeLimit?: {
    enabled: boolean;
    minutes: number;
    showTimer: boolean;
  };
  /** محدودیت تعداد ارسال */
  submissionLimit?: {
    enabled: boolean;
    maxSubmissions: number;
    perUser: boolean;
  };
  /** تنظیمات ایمیل */
  emailSettings?: {
    sendConfirmation: boolean;
    confirmationTemplate?: string;
    notifyAdmin: boolean;
    adminEmail?: string;
  };
}

/**
 * تنظیمات ظاهری فرم
 */
export interface FormStyling {
  /** تم اصلی */
  theme: 'default' | 'modern' | 'dark' | 'minimal' | 'colorful';
  /** رنگ پس‌زمینه */
  backgroundColor: string;
  /** رنگ متن */
  textColor: string;
  /** رنگ اصلی */
  primaryColor: string;
  /** رنگ ثانویه */
  secondaryColor?: string;
  /** فونت */
  fontFamily: string;
  /** اندازه فونت */
  fontSize: number;
  /** شعاع گوشه‌ها */
  borderRadius: number;
  /** فاصله‌گذاری */
  spacing: 'compact' | 'normal' | 'relaxed';
  /** تصویر پس‌زمینه */
  backgroundImage?: string;
  /** لوگو */
  logo?: {
    url: string;
    position: 'top' | 'center' | 'bottom';
    size: 'small' | 'medium' | 'large';
  };
  /** CSS سفارشی */
  customCSS?: string;
}

/**
 * اطلاعات meta فرم
 */
export interface FormMetadata {
  /** شناسه ایجادکننده */
  createdBy: string;
  /** تاریخ ایجاد */
  createdAt: string;
  /** آخرین ویرایش */
  updatedAt: string;
  /** آخرین ویرایش‌کننده */
  updatedBy?: string;
  /** وضعیت فرم */
  status: 'draft' | 'published' | 'archived' | 'paused';
  /** نسخه فرم */
  version: number;
  /** تگ‌ها */
  tags?: string[];
  /** دسته‌بندی */
  category?: string;
  /** آمار */
  stats?: {
    totalViews: number;
    totalSubmissions: number;
    completionRate: number;
    averageTime: number;
  };
}

/**
 * تنظیمات فرم چندمرحله‌ای
 */
export interface MultiStepConfig {
  /** فعال/غیرفعال */
  enabled: boolean;
  /** مراحل */
  steps: {
    /** شناسه مرحله */
    id: string;
    /** نام مرحله */
    title: string;
    /** توضیح مرحله */
    description?: string;
    /** فیلدهای این مرحله */
    fieldIds: string[];
  }[];
  /** نمایش نوار پیشرفت */
  showProgress: boolean;
  /** امکان برگشت به مرحله قبل */
  allowPreviousStep: boolean;
  /** اعتبارسنجی در هر مرحله */
  validateOnStep: boolean;
}

/**
 * فرم کامل
 */
export interface Form {
  /** شناسه یکتا */
  id: string;
  /** نام فرم */
  name: string;
  /** توضیح فرم */
  description?: string;
  /** فیلدهای فرم */
  fields: FormField[];
  /** تنظیمات فرم */
  settings: FormSettings;
  /** تنظیمات ظاهری */
  styling: FormStyling;
  /** اطلاعات meta */
  metadata: FormMetadata;
  /** تنظیمات چندمرحله‌ای */
  multiStep?: MultiStepConfig;
}

/**
 * DTO برای ایجاد فرم جدید
 */
export type CreateFormDto = Omit<Form, 'id' | 'metadata'> & {
  metadata?: Partial<FormMetadata>;
};

/**
 * DTO برای ویرایش فرم
 */
export type UpdateFormDto = Partial<Omit<Form, 'id' | 'metadata'>> & {
  metadata?: Partial<FormMetadata>;
};

/**
 * پاسخ کاربر به فرم
 */
export interface FormResponse {
  /** شناسه یکتا */
  id: string;
  /** شناسه فرم */
  formId: string;
  /** پاسخ‌ها */
  answers: Record<string, any>;
  /** اطلاعات ارسال‌کننده */
  submitter?: {
    name?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
  };
  /** اطلاعات meta */
  metadata: {
    /** تاریخ ارسال */
    submittedAt: string;
    /** مدت زمان پر کردن (ثانیه) */
    duration?: number;
    /** وضعیت */
    status: 'completed' | 'draft' | 'partial';
    /** نسخه فرم */
    formVersion: number;
  };
}

/**
 * Template فرم آماده
 */
export interface FormTemplate {
  /** شناسه یکتا */
  id: string;
  /** نام template */
  name: string;
  /** توضیح */
  description: string;
  /** دسته‌بندی */
  category: string;
  /** تصویر پیش‌نمایش */
  preview: string;
  /** فرم template */
  form: Omit<Form, 'id' | 'metadata'>;
  /** محبوبیت */
  popularity: number;
  /** تگ‌ها */
  tags: string[];
}