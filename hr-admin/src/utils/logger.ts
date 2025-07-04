// src/utils/logger.ts

interface LogData {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp?: string;
}

export class Logger {
  static log({ level, message, data }: Omit<LogData, 'timestamp'>) {
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data })
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify(logEntry, null, 2));
    } else {
      // در محیط تولید می‌توانیم لاگ‌ها را به سرویس مانیتورینگ ارسال کنیم
      console.log(JSON.stringify(logEntry));
    }
  }

  static info(message: string, data?: any) {
    this.log({ level: 'info', message, data });
  }

  static warn(message: string, data?: any) {
    this.log({ level: 'warn', message, data });
  }

  static error(message: string, data?: any) {
    this.log({ level: 'error', message, data });
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log({ level: 'debug', message, data });
    }
  }
} 