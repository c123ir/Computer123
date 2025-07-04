// src/config/index.ts

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3995/api';

export const APP_CONFIG = {
  // تنظیمات عمومی
  app: {
    name: 'سیستم مدیریت فرم‌ها',
    version: '1.0.0',
    defaultLanguage: 'fa',
    supportedLanguages: ['fa', 'en']
  },

  // تنظیمات احراز هویت
  auth: {
    tokenKey: 'authToken',
    refreshTokenKey: 'refreshToken',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 ساعت
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000 // 7 روز
  },

  // تنظیمات API
  api: {
    timeout: 30000, // 30 ثانیه
    retryAttempts: 3,
    retryDelay: 1000
  },

  // تنظیمات فرم‌ساز
  formBuilder: {
    maxFields: 50,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/*', 'application/pdf'],
    defaultValidations: {
      text: {
        minLength: 2,
        maxLength: 255
      },
      number: {
        min: 0,
        max: 999999
      }
    }
  },

  // تنظیمات منو
  menu: {
    maxDepth: 5, // حداکثر عمق منو
    maxChildren: 10, // حداکثر تعداد زیرمنو
    defaultIcon: 'folder'
  }
}; 