// src/components/common/PostgreSQLConnectionTest.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Database } from 'lucide-react';
import { getApiUrl, getBackendHost, getBackendPort, buildApiUrl, API_ENDPOINTS } from '../../utils/api';

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
  const [showFullPanel, setShowFullPanel] = useState<boolean>(true);

  useEffect(() => {
    testConnection();
    setBackendInfo({
      apiUrl: getApiUrl(),
      host: getBackendHost(),
      port: getBackendPort(),
      databaseType: process.env.REACT_APP_DATABASE_TYPE || 'postgresql'
    });
  }, []);

  // Auto-hide panel after a few seconds upon status change
  useEffect(() => {
    if (showFullPanel) {
      const timer = setTimeout(() => setShowFullPanel(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [connectionStatus.status]);

  const testConnection = async () => {
    try {
      setConnectionStatus({
        status: 'checking',
        message: 'در حال تست اتصال به Backend...'
      });

      const apiUrl = getApiUrl();
      
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
    const baseIconClasses = "transition-all duration-300 ease-in-out transform";
    switch (connectionStatus.status) {
      case 'checking':
        return <Clock className={`w-5 h-5 text-white ${baseIconClasses} animate-spin`} />;
      case 'connected':
        return <CheckCircle className={`w-5 h-5 text-white ${baseIconClasses} hover:scale-110`} 
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />;
      case 'warning':
        return <AlertTriangle className={`w-5 h-5 text-white ${baseIconClasses} hover:scale-110`}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />;
      case 'failed':
        return <XCircle className={`w-5 h-5 text-white ${baseIconClasses} hover:scale-110`}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />;
      default:
        return <Database className={`w-5 h-5 text-white ${baseIconClasses} hover:scale-110`}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />;
    }
  };

  const getStatusColor = () => {
    const baseClasses = "border-opacity-20 bg-opacity-95";
    switch (connectionStatus.status) {
      case 'checking':
        return `border-blue-200 bg-blue-50 ${baseClasses}`;
      case 'connected':
        return `border-green-200 bg-green-50 ${baseClasses}`;
      case 'warning':
        return `border-yellow-200 bg-yellow-50 ${baseClasses}`;
      case 'failed':
        return `border-red-200 bg-red-50 ${baseClasses}`;
      default:
        return `border-gray-200 bg-gray-50 ${baseClasses}`;
    }
  };

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // If panel closed, show small status icon
  if (!showFullPanel) {
    const iconColor =
      connectionStatus.status === 'connected'
        ? 'bg-green-500'
        : connectionStatus.status === 'warning'
        ? 'bg-yellow-500'
        : 'bg-red-500';
    
    const animationClass = 
      connectionStatus.status === 'checking'
        ? 'animate-status-checking'
        : connectionStatus.status === 'connected'
        ? 'animate-pulse-custom'
        : '';

    return (
      <button
        onClick={() => setShowFullPanel(true)}
        className={`
          fixed bottom-4 right-4 z-50 
          w-10 h-10 rounded-full 
          ${iconColor}
          transform transition-all duration-300 ease-in-out
          hover:scale-110
          shadow-[0_0_15px_rgba(0,0,0,0.2)]
          hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]
          border-2 border-white/20
          backdrop-blur-sm
          flex items-center justify-center
          animate-fade-in
          ${animationClass}
        `}
        style={{
          transform: 'perspective(1000px) rotateX(10deg)',
          transformStyle: 'preserve-3d'
        }}
        title={`وضعیت اتصال به Backend: ${connectionStatus.status === 'connected' ? 'متصل' : connectionStatus.status === 'warning' ? 'هشدار' : 'قطع شده'}`}
      >
        {getStatusIcon()}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div className={`
        relative border-2 rounded-xl p-4 max-w-sm
        shadow-[0_0_20px_rgba(0,0,0,0.15)]
        hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]
        backdrop-blur-xl
        transform transition-all duration-300 ease-in-out
        ${getStatusColor()}
      `}
      style={{
        transform: 'perspective(1000px) rotateX(5deg)',
        transformStyle: 'preserve-3d'
      }}>
        {/* Close button */}
        <button
          onClick={() => setShowFullPanel(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 
                     transition-colors duration-200 hover:scale-110 transform"
          aria-label="Close status panel"
        >
          ×
        </button>
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
        const healthUrl = buildApiUrl(API_ENDPOINTS.HEALTH);
        const response = await fetch(healthUrl);
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
      const healthUrl = buildApiUrl(API_ENDPOINTS.HEALTH);
      const response = await fetch(healthUrl);
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

// Update the styles constant with new animations
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  @keyframes status-checking {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.92);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-slide-in {
    animation: slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-pulse-custom {
    animation: pulse 2s infinite;
  }

  .animate-status-checking {
    animation: status-checking 1.5s infinite;
  }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}