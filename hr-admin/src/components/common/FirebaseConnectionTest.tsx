// src/components/common/FirebaseConnectionTest.tsx
import React, { useEffect, useState } from 'react';
import { 
  getFirebaseServices, 
  checkFirebaseConnection, 
  firebaseEnv,
  getFirebaseConfig 
} from '../../config/firebase';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface ConnectionStatus {
  status: 'checking' | 'connected' | 'failed' | 'warning';
  message: string;
  details?: string;
}

/**
 * Firebase Connection Test Component
 * Only visible in development mode
 */
export const FirebaseConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'checking',
    message: 'بررسی اتصال Firebase...'
  });
  
  const [configInfo, setConfigInfo] = useState<any>(null);

  useEffect(() => {
    testConnection();
    if (firebaseEnv.isDevelopment) {
      setConfigInfo(getFirebaseConfig());
    }
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus({
        status: 'checking',
        message: 'در حال تست اتصال...'
      });

      // Test Firebase services initialization
      const services = getFirebaseServices();
      
      if (!services) {
        throw new Error('Firebase services not initialized');
      }

      // Test actual connection with timeout
      const connectionPromise = checkFirebaseConnection();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      });

      const isConnected = await Promise.race([connectionPromise, timeoutPromise]) as boolean;
      
      if (isConnected) {
        setConnectionStatus({
          status: 'connected',
          message: 'اتصال Firebase موفقیت‌آمیز است',
          details: `Project: ${firebaseEnv.projectId}`
        });
      } else {
        setConnectionStatus({
          status: 'warning',
          message: 'Firebase مقداردهی شده ولی اتصال تست نشد',
          details: 'ممکن است مشکلی در تنظیمات یا شبکه وجود داشته باشد'
        });
      }
    } catch (error: any) {
      console.error('Firebase connection test error:', error);
      
      // More specific error messages
      let errorMessage = 'خطا در اتصال Firebase';
      let errorDetails = error.message;
      
      if (error.message.includes('timeout')) {
        errorMessage = 'خطا: زمان اتصال به Firebase تمام شد';
        errorDetails = 'لطفاً اتصال اینترنت خود را بررسی کنید';
      } else if (error.message.includes('permission')) {
        errorMessage = 'خطا: دسترسی Firebase';
        errorDetails = 'Rules یا Authentication تنظیم نشده است';
      } else if (error.message.includes('network')) {
        errorMessage = 'خطا: مشکل شبکه';
        errorDetails = 'لطفاً VPN یا اتصال اینترنت را بررسی کنید';
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
        return <Clock className="w-5 h-5 text-gray-500" />;
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
  if (!firebaseEnv.isDevelopment) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`border rounded-lg p-4 max-w-sm shadow-lg ${getStatusColor()}`}>
        <div className="flex items-start space-x-3 space-x-reverse">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              وضعیت Firebase
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
            <span className="font-mono">{firebaseEnv.isDevelopment ? 'DEV' : 'PROD'}</span>
          </div>
          {firebaseEnv.useEmulator && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Emulator:</span>
              <span className="font-mono text-orange-600">ON</span>
            </div>
          )}
        </div>

        {/* Configuration Info (Development Only) */}
        {configInfo && (
          <details className="mt-3 pt-3 border-t border-gray-200">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              مشاهده تنظیمات
            </summary>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-left">
              <div>Project: {configInfo.projectId}</div>
              <div>Auth: {configInfo.authDomain}</div>
              <div>Storage: {configInfo.storageBucket}</div>
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
 * Firebase Status Hook
 * For use in other components
 */
export const useFirebaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const connected = await checkFirebaseConnection();
        setIsConnected(connected);
        setError(null);
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
      const connected = await checkFirebaseConnection();
      setIsConnected(connected);
    } catch (err: any) {
      setIsConnected(false);
      setError(err.message);
    }
  };

  return { isConnected, error, retry };
};

export default FirebaseConnectionTest;