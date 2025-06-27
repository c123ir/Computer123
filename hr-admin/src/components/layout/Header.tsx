// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobile: boolean;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobile, isSidebarOpen }) => {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'فاکتور جدید ثبت شد', time: '۵ دقیقه پیش', unread: true },
    { id: 2, text: 'گزارش فروش آماده است', time: '۱ ساعت پیش', unread: true },
    { id: 3, text: 'پیام جدید از مشتری', time: '۲ ساعت پیش', unread: false }
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const searchSuggestions = [
    'مدیریت فروش',
    'گزارشات مالی', 
    'اطلاعات مشتریان',
    'مدیریت پرسنل',
    'تنظیمات سیستم'
  ];

  const filteredSuggestions = searchSuggestions.filter(item =>
    item.includes(searchQuery)
  );

  return (
    <header className={`
      relative z-30 border-b transition-all duration-200
      ${isDark 
        ? 'bg-gray-900/95 border-gray-700/30 backdrop-blur-xl' 
        : 'bg-white/95 border-gray-200/30 backdrop-blur-xl'
      }
    `}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* بخش چپ - منو و جستجو */}
        <div className="flex items-center gap-4 flex-1">
          {/* دکمه منو (موبایل) */}
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
                }
              `}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          {/* لوگو و عنوان */}
          <div className="flex items-center gap-3">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${isDark 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                : 'bg-gradient-to-br from-blue-400 to-purple-500'
              }
              shadow-lg
            `}>
              <span className="text-white font-bold text-sm">۱۲۳</span>
            </div>
            {!isMobile && (
              <div>
                <h1 className={`
                  text-lg font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  مجتمع کامپیوتر یک دو سه
                </h1>
              </div>
            )}
          </div>

          {/* جستجو - دسکتاپ */}
          {!isMobile && (
            <div className="relative flex-1 max-w-md ml-8">
              <div className={`
                relative rounded-xl border transition-all duration-200
                ${isDark 
                  ? 'bg-gray-800/50 border-gray-700/30 focus-within:border-blue-500' 
                  : 'bg-white/50 border-gray-200/30 focus-within:border-blue-500'
                }
                backdrop-blur-sm
              `}>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  id="desktop-search"
                  name="desktop-search"
                  placeholder="جستجو در سیستم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  className={`
                    w-full pl-4 pr-10 py-2 rounded-xl border-0 
                    ${isDark ? 'bg-transparent text-white placeholder-gray-400' : 'bg-transparent text-gray-900 placeholder-gray-500'}
                    focus:outline-none focus:ring-0
                  `}
                  dir="rtl"
                />
              </div>

              {/* پیشنهادات جستجو */}
              {searchQuery && filteredSuggestions.length > 0 && (
                <div className={`
                  absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50
                  ${isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                  }
                  backdrop-blur-xl
                `}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`
                        px-4 py-2 cursor-pointer transition-colors duration-200
                        ${isDark 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                        ${index === 0 ? 'rounded-t-xl' : ''}
                        ${index === filteredSuggestions.length - 1 ? 'rounded-b-xl' : ''}
                      `}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        // اینجا می‌توانید منطق جستجو را اضافه کنید
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* بخش راست - اعلانات، تم، پروفایل */}
        <div className="flex items-center gap-2">
          {/* دکمه جستجو موبایل */}
          {isMobile && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
                }
              `}
            >
              <Search size={20} />
            </button>
          )}

          {/* اعلانات */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`
                relative p-2 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
                }
              `}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* پنل اعلانات */}
            {isNotificationOpen && (
              <div className={`
                absolute top-full left-0 mt-2 w-80 rounded-xl border shadow-xl z-50
                ${isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
                }
                backdrop-blur-xl
              `}>
                <div className={`
                  px-4 py-3 border-b
                  ${isDark ? 'border-gray-700' : 'border-gray-200'}
                `}>
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    اعلانات
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        px-4 py-3 border-b last:border-b-0 transition-colors duration-200
                        ${isDark 
                          ? 'border-gray-700 hover:bg-gray-700/50' 
                          : 'border-gray-100 hover:bg-gray-50'
                        }
                        ${notification.unread ? 'bg-blue-50/10' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        )}
                        <div className="flex-1">
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {notification.text}
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* تغییر تم */}
          <button
            onClick={toggleTheme}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isDark 
                ? 'hover:bg-gray-700 text-yellow-400' 
                : 'hover:bg-gray-100 text-gray-600'
              }
            `}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* پروفایل کاربر */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`
                flex items-center gap-2 p-2 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
              `}>
                <User size={16} />
              </div>
              {!isMobile && (
                <>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    مدیر سیستم
                  </span>
                  <ChevronDown size={16} />
                </>
              )}
            </button>

            {/* منوی پروفایل */}
            {isProfileOpen && (
              <div className={`
                absolute top-full left-0 mt-2 w-48 rounded-xl border shadow-xl z-50
                ${isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
                }
                backdrop-blur-xl
              `}>
                <div className="py-2">
                  <button className={`
                    w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200
                    ${isDark 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}>
                    <Settings size={16} />
                    تنظیمات
                  </button>
                  <button className={`
                    w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200
                    ${isDark 
                      ? 'text-red-400 hover:bg-gray-700' 
                      : 'text-red-600 hover:bg-gray-50'
                    }
                  `}>
                    <LogOut size={16} />
                    خروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* جستجوی موبایل */}
      {isMobile && isSearchOpen && (
        <div className={`
          absolute inset-0 z-40
          ${isDark ? 'bg-gray-900' : 'bg-white'}
        `}>
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => setIsSearchOpen(false)}
              className={`
                p-2 rounded-lg
                ${isDark ? 'text-gray-300' : 'text-gray-600'}
              `}
            >
              <X size={20} />
            </button>
            <div className="flex-1">
              <input
                type="text"
                id="mobile-search"
                name="mobile-search"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                className={`
                  w-full p-3 rounded-lg border
                  ${isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                dir="rtl"
                autoFocus
              />
            </div>
          </div>
          
          {/* پیشنهادات موبایل */}
          {searchQuery && (
            <div className="px-4">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors duration-200
                    ${isDark 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                    border-b last:border-b-0
                    ${isDark ? 'border-gray-700' : 'border-gray-200'}
                  `}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setIsSearchOpen(false);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;