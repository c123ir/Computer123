// src/modules/form-builder/components/FormsList/CreateFormModal.tsx

import React, { useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { 
  X, FileText, Eye, Users, BarChart3, MessageSquare, 
  Calendar, ShoppingCart, User, Building, Star, Clock,
  ArrowRight, Sparkles, Zap, Target, Plus, Search
} from 'lucide-react';

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormCreated?: (formData: CreateFormData) => void;
}

interface CreateFormData {
  name: string;
  description: string;
  category: string;
  template?: string;
  type: 'blank' | 'template';
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  fields: number;
  popularity: number;
  preview?: string;
}

// Templates آماده
const formTemplates: FormTemplate[] = [
  {
    id: 'contact',
    name: 'فرم تماس با ما',
    description: 'فرم ساده برای ارتباط مشتریان با شامل نام، ایمیل، موضوع و پیام',
    category: 'عمومی',
    icon: MessageSquare,
    color: 'blue',
    fields: 5,
    popularity: 95
  },
  {
    id: 'registration',
    name: 'فرم ثبت‌نام',
    description: 'ثبت‌نام در دوره‌ها یا رویدادها با اطلاعات شخصی کامل',
    category: 'آموزش',
    icon: User,
    color: 'green',
    fields: 8,
    popularity: 88
  },
  {
    id: 'feedback',
    name: 'نظرسنجی رضایت',
    description: 'دریافت نظرات و پیشنهادات مشتریان با امتیازدهی',
    category: 'نظرسنجی',
    icon: Star,
    color: 'yellow',
    fields: 6,
    popularity: 92
  },
  {
    id: 'support',
    name: 'درخواست پشتیبانی',
    description: 'ثبت تیکت و درخواست پشتیبانی فنی با اولویت‌بندی',
    category: 'پشتیبانی',
    icon: BarChart3,
    color: 'red',
    fields: 7,
    popularity: 75
  },
  {
    id: 'survey',
    name: 'نظرسنجی جامع',
    description: 'نظرسنجی پیشرفته با سوالات چندگزینه‌ای و متنی',
    category: 'نظرسنجی',
    icon: Target,
    color: 'purple',
    fields: 12,
    popularity: 68
  },
  {
    id: 'booking',
    name: 'فرم رزرو',
    description: 'رزرو خدمات یا قرار ملاقات با انتخاب تاریخ و زمان',
    category: 'خدمات',
    icon: Calendar,
    color: 'indigo',
    fields: 9,
    popularity: 82
  },
  {
    id: 'order',
    name: 'فرم سفارش',
    description: 'ثبت سفارش محصولات با جزئیات قیمت و تحویل',
    category: 'فروش',
    icon: ShoppingCart,
    color: 'emerald',
    fields: 10,
    popularity: 70
  },
  {
    id: 'application',
    name: 'فرم درخواست',
    description: 'درخواست عضویت یا استخدام با آپلود مدارک',
    category: 'منابع انسانی',
    icon: Building,
    color: 'orange',
    fields: 15,
    popularity: 60
  }
];

const CreateFormModal: React.FC<CreateFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onFormCreated 
}) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState<'method' | 'template' | 'details'>('method');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState<CreateFormData>({
    name: '',
    description: '',
    category: '',
    type: 'blank'
  });

  // Reset modal state when closing
  const handleClose = () => {
    setStep('method');
    setSelectedTemplate(null);
    setSearchTerm('');
    setSelectedCategory('all');
    setFormData({
      name: '',
      description: '',
      category: '',
      type: 'blank'
    });
    onClose();
  };

  // فیلتر templates
  const filteredTemplates = formTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // دسته‌های موجود
  const categories = Array.from(new Set(formTemplates.map(t => t.category)));

  // رنگ‌های template
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      red: 'bg-red-500 text-white',
      purple: 'bg-purple-500 text-white',
      indigo: 'bg-indigo-500 text-white',
      emerald: 'bg-emerald-500 text-white',
      orange: 'bg-orange-500 text-white'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  // Step 1: انتخاب روش ایجاد
  const MethodStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          فرم جدید ایجاد کنید
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
          روش ایجاد فرم خود را انتخاب کنید
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* فرم خالی */}
        <button
          onClick={() => {
            setFormData(prev => ({ ...prev, type: 'blank' }));
            setStep('details');
          }}
          className={`
            p-6 rounded-xl border-2 border-dashed transition-all hover:scale-105
            ${isDark 
              ? 'border-gray-600 hover:border-blue-500 bg-gray-800/30' 
              : 'border-gray-300 hover:border-blue-500 bg-white/30'
            }
            group
          `}
        >
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
              ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
              group-hover:bg-blue-500 transition-colors
            `}>
              <Plus className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:text-white`} />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              شروع از صفر
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              فرم خالی ایجاد کنید و فیلدهای دلخواه اضافه کنید
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-500 font-medium">سریع و انعطاف‌پذیر</span>
            </div>
          </div>
        </button>

        {/* استفاده از template */}
        <button
          onClick={() => {
            setFormData(prev => ({ ...prev, type: 'template' }));
            setStep('template');
          }}
          className={`
            p-6 rounded-xl border-2 transition-all hover:scale-105
            ${isDark 
              ? 'border-blue-500/50 bg-blue-500/10 hover:border-blue-500' 
              : 'border-blue-500/50 bg-blue-500/10 hover:border-blue-500'
            }
            group
          `}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              استفاده از قالب
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              از قالب‌های آماده استفاده کنید و زمان صرفه‌جویی کنید
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-500 font-medium">حرفه‌ای و سریع</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  // Step 2: انتخاب template
  const TemplateStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            انتخاب قالب
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            قالب مناسب برای نیاز خود انتخاب کنید
          </p>
        </div>
        <button
          onClick={() => setStep('method')}
          className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          بازگشت
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `} />
          <input
            type="text"
            placeholder="جستجو در قالب‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`
              w-full pr-10 pl-4 py-2 rounded-lg border
              ${isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`
            px-3 py-2 rounded-lg border min-w-[120px]
            ${isDark 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        >
          <option value="all">همه دسته‌ها</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map(template => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`
                p-4 rounded-lg border transition-all text-left
                ${selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : isDark
                    ? 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                    : 'border-gray-300 bg-white/30 hover:border-gray-400'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(template.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-yellow-500">{template.popularity}</span>
                    </div>
                  </div>
                  
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 line-clamp-2`}>
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FileText className="w-3 h-3" />
                      {template.fields} فیلد
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                    `}>
                      {template.category}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <Search className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            قالبی برای جستجوی شما یافت نشد
          </p>
        </div>
      )}

      {/* Continue Button */}
      {selectedTemplate && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setFormData(prev => ({ ...prev, template: selectedTemplate }));
              setStep('details');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ادامه
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  // Step 3: جزئیات فرم
  const DetailsStep = () => {
    const selectedTemplateData = selectedTemplate 
      ? formTemplates.find(t => t.id === selectedTemplate)
      : null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              جزئیات فرم
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              اطلاعات فرم خود را وارد کنید
            </p>
          </div>
          <button
            onClick={() => setStep(formData.type === 'template' ? 'template' : 'method')}
            className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            بازگشت
          </button>
        </div>

        {/* Template Preview */}
        {selectedTemplateData && (
          <div className={`
            p-4 rounded-lg border
            ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}
          `}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(selectedTemplateData.color)}`}>
                <selectedTemplateData.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {selectedTemplateData.name}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedTemplateData.fields} فیلد آماده
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              نام فرم *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={selectedTemplateData ? selectedTemplateData.name : "نام فرم را وارد کنید"}
              className={`
                w-full px-4 py-3 rounded-lg border
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={selectedTemplateData ? selectedTemplateData.description : "توضیح مختصری از فرم"}
              rows={3}
              className={`
                w-full px-4 py-3 rounded-lg border
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              دسته‌بندی *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={`
                w-full px-4 py-3 rounded-lg border
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              <option value="">انتخاب دسته‌بندی</option>
              <option value="عمومی">عمومی</option>
              <option value="آموزش">آموزش</option>
              <option value="نظرسنجی">نظرسنجی</option>
              <option value="پشتیبانی">پشتیبانی</option>
              <option value="خدمات">خدمات</option>
              <option value="فروش">فروش</option>
              <option value="منابع انسانی">منابع انسانی</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const handleCreate = () => {
    if (!formData.name || !formData.category) {
      return; // Validation
    }

    const finalFormData: CreateFormData = {
      ...formData,
      ...(selectedTemplate && { template: selectedTemplate })
    };

    onFormCreated?.(finalFormData);
    handleClose();
  };

  const isValidToCreate = formData.name.trim() && formData.category;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`
        w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden
        ${isDark ? 'bg-gray-800' : 'bg-white'}
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-6 border-b
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ایجاد فرم جدید
            </span>
          </div>
          
          <button
            onClick={handleClose}
            className={`
              p-2 rounded-lg transition-colors
              ${isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className={`px-6 py-3 ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            {['method', 'template', 'details'].map((stepName, index) => {
              const isActive = step === stepName;
              const isCompleted = ['method', 'template'].indexOf(step) > ['method', 'template'].indexOf(stepName);
              
              return (
                <React.Fragment key={stepName}>
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : isDark
                          ? 'bg-gray-600 text-gray-400'
                          : 'bg-gray-300 text-gray-600'
                    }
                  `}>
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 ${isCompleted ? 'bg-green-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 'method' && <MethodStep />}
          {step === 'template' && <TemplateStep />}
          {step === 'details' && <DetailsStep />}
        </div>

        {/* Footer */}
        {step === 'details' && (
          <div className={`
            flex items-center justify-between p-6 border-t
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <button
              onClick={() => setStep(formData.type === 'template' ? 'template' : 'method')}
              className={`
                px-4 py-2 rounded-lg transition-colors
                ${isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              بازگشت
            </button>

            <button
              onClick={handleCreate}
              disabled={!isValidToCreate}
              className={`
                px-6 py-3 rounded-lg font-medium transition-colors
                ${isValidToCreate
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              ایجاد فرم
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFormModal;

// Export types
export type { CreateFormModalProps, CreateFormData, FormTemplate };