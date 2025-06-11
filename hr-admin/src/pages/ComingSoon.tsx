// src/pages/ComingSoon.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Construction, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Calendar,
  Users,
  Zap
} from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
  estimatedDate?: string;
  features?: string[];
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  description,
  estimatedDate = "به زودی",
  features = []
}) => {
  const { isDark } = useTheme();

  // ویژگی‌های پیش‌فرض بر اساس عنوان صفحه
  const getDefaultFeatures = (pageTitle: string): string[] => {
    const featureMap: Record<string, string[]> = {
      'مدیریت فروش': [
        'ثبت و پیگیری فاکتورها',
        'مدیریت پیش‌فاکتور',
        'گزارش فروش تفصیلی',
        'مدیریت تخفیفات'
      ],
      'مدیریت مشتریان': [
        'پروفایل کامل مشتریان',
        'تاریخچه خریدها',
        'دسته‌بندی مشتریان',
        'ارتباطات و پیگیری'
      ],
      'مدیریت پرسنل': [
        'اطلاعات کارمندان',
        'مدیریت حقوق و دستمزد',
        'حضور و غیاب',
        'ارزیابی عملکرد'
      ],
      'سرمایه گزاران': [
        'اطلاعات سرمایه‌گذاران',
        'پیگیری سرمایه‌گذاری',
        'گزارش بازده',
        'مدیریت اسناد'
      ],
      'هوش مصنوعی': [
        'تحلیل هوشمند داده‌ها',
        'پیش‌بینی فروش',
        'چت‌بات هوشمند',
        'بهینه‌سازی فرایندها'
      ],
      'گزارشات': [
        'گزارش‌های تفصیلی',
        'نمودارها و چارت‌ها',
        'صدور خودکار',
        'فیلترهای پیشرفته'
      ]
    };

    return featureMap[pageTitle] || [
      'رابط کاربری مدرن',
      'عملکرد بالا',
      'امنیت پیشرفته',
      'پشتیبانی کامل'
    ];
  };

  const pageFeatures = features.length > 0 ? features : getDefaultFeatures(title);

  // محاسبه پیشرفت بر اساس نوع صفحه
  const getProgress = (pageTitle: string): number => {
    const progressMap: Record<string, number> = {
      'داشبورد': 100,
      'مدیریت فروش': 25,
      'مدیریت مشتریان': 30,
      'مدیریت پرسنل': 20,
      'گزارشات': 15,
      'هوش مصنوعی': 10,
      'مدیریت فرایندها': 40,
    };

    return progressMap[pageTitle] || 0;
  };

  const progress = getProgress(title);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* آیکن اصلی */}
        <div className={`
          w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center
          ${isDark 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
            : 'bg-gradient-to-br from-blue-400 to-purple-500'
          }
          shadow-2xl animate-pulse
        `}>
          <Construction className="w-12 h-12 text-white" />
        </div>

        {/* عنوان و توضیحات */}
        <div className={`
          rounded-2xl p-8 backdrop-blur-xl border mb-8
          ${isDark 
            ? 'bg-gray-800/30 border-gray-700/30' 
            : 'bg-white/30 border-white/30'
          }
        `}>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h1>
          
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {description || 'این بخش در حال توسعه است و به زودی در دسترس خواهد بود'}
          </p>

          {/* نوار پیشرفت */}
          {progress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  پیشرفت توسعه
                </span>
                <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {progress}%
                </span>
              </div>
              <div className={`
                w-full h-3 rounded-full
                ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
              `}>
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* زمان تخمینی */}
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg
            ${isDark 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'bg-blue-50 text-blue-600'
            }
          `}>
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              زمان تخمینی: {estimatedDate}
            </span>
          </div>
        </div>

        {/* ویژگی‌های آینده */}
        {pageFeatures.length > 0 && (
          <div className={`
            rounded-xl p-6 backdrop-blur-xl border mb-8
            ${isDark 
              ? 'bg-gray-800/20 border-gray-700/20' 
              : 'bg-white/20 border-white/20'
            }
          `}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ویژگی‌های در نظر گرفته شده
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pageFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                    ${isDark 
                      ? 'hover:bg-gray-700/30' 
                      : 'hover:bg-gray-50/50'
                    }
                  `}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* اطلاعات تماس و پیشنهادات */}
        <div className={`
          rounded-xl p-6 backdrop-blur-xl border
          ${isDark 
            ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20' 
            : 'bg-gradient-to-r from-purple-50/50 to-blue-50/50 border-purple-200/30'
          }
        `}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              پیشنهادات و نظرات
            </h3>
          </div>
          
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            اگر پیشنهاد یا نظری در مورد این بخش دارید، ما را در جریان بگذارید
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
              shadow-lg hover:shadow-xl
            `}>
              <Users className="w-4 h-4" />
              ارسال پیشنهاد
            </button>
            
            <button className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 border
              ${isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}>
              <Calendar className="w-4 h-4" />
              اطلاع از آماده شدن
            </button>
          </div>
        </div>

        {/* بازگشت به داشبورد */}
        <div className="mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${isDark 
                ? 'text-blue-400 hover:bg-blue-500/10' 
                : 'text-blue-600 hover:bg-blue-50'
              }
            `}
          >
            بازگشت به داشبورد
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;