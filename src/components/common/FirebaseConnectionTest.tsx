import React, { useState, useEffect } from 'react';

const FirebaseConnectionTest: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showFullPanel, setShowFullPanel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
        if (response.ok) {
          setIsConnected(true);
          setError(null);
        } else {
          setIsConnected(false);
          setError('خطا در اتصال به سرور');
        }
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      }
    };

    testConnection();
  }, []); // این effect فقط یکبار اجرا می‌شود

  if (!showFullPanel) {
    return (
      <div 
        className={`fixed bottom-4 left-4 p-2 rounded-full cursor-pointer ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
        onClick={() => setShowFullPanel(true)}
      >
        <div className="w-3 h-3 rounded-full bg-white" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">وضعیت اتصال به سرور</h3>
        <button 
          onClick={() => setShowFullPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <div className="flex items-center">
        <div 
          className={`w-3 h-3 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} 
        />
        <span>
          {isConnected ? 'متصل به سرور' : 'قطع اتصال'}
        </span>
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default FirebaseConnectionTest; 