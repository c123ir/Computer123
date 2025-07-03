// src/components/common/PostgreSQLConnectionTest.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Database } from 'lucide-react';

interface ConnectionStatus {
  status: 'checking' | 'connected' | 'failed' | 'warning';
  message: string;
  details?: string;
}

/**
 * PostgreSQL Backend Connection Test Component
 * Only visible in development mode
 */
export const PostgreSQLConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'checking',
    message: 'بررسی اتصال PostgreSQL Backend...'
  });
  
  const [backendInfo, setBackendInfo] = useState<any>(null);

  useEffect(() => {
    testConnection();
    setBackendInfo({
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      host: process.env.REACT_APP_BACKEND_HOST || 'localhost',
      port: process.env.REACT_APP_BACKEND_PORT || '3001',
      databaseType: process.env.REACT_APP_DATABASE_TYPE || 'postgresql'
    });
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus({
        status: 'checking',
        message: 'در حال تست اتصال به Backend...'
      });

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      
      // Test health endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`${apiUrl}/health`, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const healthData = await response.json();
          setConnectionStatus({
            status: 'connected',
            message: 'اتصال PostgreSQL Backend موفقیت‌آمیز است',
            details: `Status: ${healthData.status || 'healthy'} - API: ${apiUrl}`
          });
        } else {
          setConnectionStatus({
            status: 'warning',
            message: `Backend در دسترس است ولی خطا دارد (${response.status})`,
            details: `HTTP ${response.status}: ${response.statusText}`
          });
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          setConnectionStatus({
            status: 'failed',
            message: 'خطا: زمان اتصال به Backend تمام شد',
            details: 'Backend در دسترس نیست یا پاسخ نمی‌دهد'
          });
        } else {
          throw fetchError;
        }
      }
    } catch (error: any) {
      console.error('PostgreSQL backend connection test error:', error);
      
      // More specific error messages
      let errorMessage = 'خطا در اتصال PostgreSQL Backend';
      let errorDetails = error.message;
      
      if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'خطا: Backend در دسترس نیست';
        errorDetails = 'لطفاً مطمئن شوید که PostgreSQL backend روی پورت 3995 در حال اجرا است';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'خطا: زمان اتصال به Backend تمام شد';
        errorDetails = 'Backend ممکن است کند باشد یا مشکل شبکه وجود داشته باشد';
      } else if (error.message.includes('network')) {
        errorMessage = 'خطا: مشکل شبکه';
        errorDetails = 'لطفاً اتصال اینترنت یا تنظیمات شبکه را بررسی کنید';
      }
      
      setConnectionStatus({
        status: 'failed',
        message: errorMessage,
        details: errorDetails
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'checking':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'checking':
        return 'border-blue-200 bg-blue-50';
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`border rounded-lg p-4 max-w-sm shadow-lg ${getStatusColor()}`}>
        <div className="flex items-start space-x-3 space-x-reverse">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              وضعیت PostgreSQL Backend
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {connectionStatus.message}
            </p>
            {connectionStatus.details && (
              <p className="text-xs text-gray-500 mt-1">
                {connectionStatus.details}
              </p>
            )}
          </div>
        </div>

        {/* Environment Info */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Environment:</span>
            <span className="font-mono">{process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Database:</span>
            <span className="font-mono text-blue-600">PostgreSQL</span>
          </div>
        </div>

        {/* Configuration Info (Development Only) */}
        {backendInfo && (
          <details className="mt-3 pt-3 border-t border-gray-200">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              مشاهده تنظیمات
            </summary>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-left">
              <div>API URL: {backendInfo.apiUrl}</div>
              <div>Host: {backendInfo.host}:{backendInfo.port}</div>
              <div>Database: {backendInfo.databaseType}</div>
            </div>
          </details>
        )}

        {/* Retry Button */}
        {(connectionStatus.status === 'failed' || connectionStatus.status === 'warning') && (
          <button
            onClick={testConnection}
            className="mt-3 w-full px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            تست مجدد
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * PostgreSQL Backend Status Hook
 * For use in other components
 */
export const usePostgreSQLStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiUrl}/health`);
        const connected = response.ok;
        setIsConnected(connected);
        setError(connected ? null : `HTTP ${response.status}: ${response.statusText}`);
      } catch (err: any) {
        setIsConnected(false);
        setError(err.message);
      }
    };

    testConnection();
  }, []);

  const retry = async () => {
    setIsConnected(null);
    setError(null);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/health`);
      const connected = response.ok;
      setIsConnected(connected);
      setError(connected ? null : `HTTP ${response.status}: ${response.statusText}`);
    } catch (err: any) {
      setIsConnected(false);
      setError(err.message);
    }
  };

  return { isConnected, error, retry };
};

// Backward compatibility exports
export const FirebaseConnectionTest = PostgreSQLConnectionTest;
export const useFirebaseStatus = usePostgreSQLStatus;

export default PostgreSQLConnectionTest;