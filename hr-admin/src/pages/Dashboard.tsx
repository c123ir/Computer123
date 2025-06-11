// src/pages/Dashboard.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Calendar,
  Bell,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();

  // داده‌های نمونه برای کارت‌های آماری
  const statsCards = [
    {
      id: 1,
      title: 'کل فروش امروز',
      value: '۱۲,۵۰۰,۰۰۰',
      unit: 'تومان',
      change: '+۱۲%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'مشتریان جدید',
      value: '۲۸',
      unit: 'نفر',
      change: '+۵%',
      isPositive: true,
      icon: Users,
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: 'کل پرسنل',
      value: '۱۲۵',
      unit: 'نفر',
      change: '+۳',
      isPositive: true,
      icon: UserCheck,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 4,
      title: 'درآمد ماهانه',
      value: '۸۵۰,۰۰۰,۰۰۰',
      unit: 'تومان',
      change: '-۲%',
      isPositive: false,
      icon: DollarSign,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  // فعالیت‌های اخیر
  const recentActivities = [
    {
      id: 1,
      type: 'sale',
      title: 'فروش جدید ثبت شد',
      description: 'فاکتور شماره ۱۰۲۳ - مبلغ ۲,۵۰۰,۰۰۰ تومان',
      time: '۵ دقیقه پیش',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      id: 2,
      type: 'customer',
      title: 'مشتری جدید افزوده شد',
      description: 'شرکت فناوری پیشرو - تهران',
      time: '۱۵ دقیقه پیش',
      icon: Users,
      color: 'green'
    },
    {
      id: 3,
      type: 'report',
      title: 'گزارش ماهانه آماده شد',
      description: 'گزارش فروش بهمن ماه ۱۴۰۳',
      time: '۳۰ دقیقه پیش',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 4,
      type: 'alert',
      title: 'هشدار موجودی',
      description: 'موجودی ۵ کالا کمتر از حد مجاز',
      time: '۱ ساعت پیش',
      icon: AlertCircle,
      color: 'red'
    }
  ];

  // آمار حضور هفتگی
  const weeklyAttendance = [
    { day: 'شنبه', present: 95, total: 125 },
    { day: 'یکشنبه', present: 98, total: 125 },
    { day: 'دوشنبه', present: 89, total: 125 },
    { day: 'سه‌شنبه', present: 92, total: 125 },
    { day: 'چهارشنبه', present: 87, total: 125 },
    { day: 'پنج‌شنبه', present: 94, total: 125 },
    { day: 'جمعه', present: 45, total: 125 }
  ];

  return (
    <div className="space-y-6">
      {/* عنوان صفحه */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          داشبورد
        </h1>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
          خلاصه وضعیت سیستم مدیریت فرایند مجتمع کامپیوتر یک دو سه
        </p>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className={`
                group relative rounded-xl p-6 backdrop-blur-xl border transition-all duration-300 
                hover:scale-105 hover:shadow-2xl cursor-pointer
                ${isDark 
                  ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50' 
                  : 'bg-white/30 border-white/30 hover:bg-white/50'
                }
              `}
            >
              {/* آیکن */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4
                bg-gradient-to-r ${card.gradient} shadow-lg
              `}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* محتوا */}
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {card.value}
                  </p>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {card.unit}
                  </span>
                </div>
                
                {/* تغییرات */}
                <div className="flex items-center gap-1 mt-3">
                  {card.isPositive ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    نسبت به دیروز
                  </span>
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300
                bg-gradient-to-r ${card.gradient}
              `} />
            </div>
          );
        })}
      </div>

      {/* بخش اصلی - دو ستونه */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* آخرین فعالیت‌ها */}
        <div className="xl:col-span-2">
          <div className={`
            rounded-xl p-6 backdrop-blur-xl border
            ${isDark 
              ? 'bg-gray-800/30 border-gray-700/30' 
              : 'bg-white/30 border-white/30'
            }
          `}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                آخرین فعالیت‌ها
              </h2>
              <button className={`
                text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'text-blue-400 hover:bg-blue-500/10' 
                  : 'text-blue-600 hover:bg-blue-50'
                }
              `}>
                مشاهده همه
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className={`
                      flex items-start gap-4 p-4 rounded-lg transition-colors duration-200
                      ${isDark 
                        ? 'hover:bg-gray-700/30' 
                        : 'hover:bg-gray-50/50'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${activity.color === 'blue' ? 'bg-blue-500/20 text-blue-500' : ''}
                      ${activity.color === 'green' ? 'bg-green-500/20 text-green-500' : ''}
                      ${activity.color === 'purple' ? 'bg-purple-500/20 text-purple-500' : ''}
                      ${activity.color === 'red' ? 'bg-red-500/20 text-red-500' : ''}
                    `}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {activity.title}
                      </h3>
                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {activity.description}
                      </p>
                      <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* آمار حضور هفتگی */}
        <div className="xl:col-span-1">
          <div className={`
            rounded-xl p-6 backdrop-blur-xl border
            ${isDark 
              ? 'bg-gray-800/30 border-gray-700/30' 
              : 'bg-white/30 border-white/30'
            }
          `}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  حضور هفتگی
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  آمار حضور پرسنل
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {weeklyAttendance.map((day, index) => {
                const percentage = Math.round((day.present / day.total) * 100);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {day.day}
                      </span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {day.present}/{day.total}
                      </span>
                    </div>
                    <div className={`
                      w-full h-2 rounded-full
                      ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                    `}>
                      <div
                        className={`
                          h-2 rounded-full transition-all duration-500
                          ${percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                            percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                            'bg-gradient-to-r from-red-500 to-red-600'}
                        `}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* اعلانات مهم */}
      <div className={`
        rounded-xl p-6 backdrop-blur-xl border
        ${isDark 
          ? 'bg-yellow-500/10 border-yellow-500/20' 
          : 'bg-yellow-50/50 border-yellow-200/30'
        }
      `}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
              اعلانات مهم سیستم
            </h3>
            <p className={`mt-2 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
              • به‌روزرسانی سیستم فردا ساعت ۲۲:۰۰ انجام خواهد شد
              <br />
              • گزارش ماهانه تا پایان هفته آماده خواهد بود
              <br />
              • جلسه هیئت مدیره چهارشنبه ساعت ۱۰:۰۰
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;