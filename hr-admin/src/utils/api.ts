/**
 * API Configuration Utility
 * Centralized API URL management
 */

/**
 * Get the API base URL
 * Priority: environment variable > default
 */
export const getApiUrl = (): string => {
  // Force the correct port for now
  return process.env.REACT_APP_API_URL || 'http://localhost:3995/api';
};

/**
 * Get the backend port
 */
export const getBackendPort = (): string => {
  return process.env.REACT_APP_BACKEND_PORT || '3995';
};

/**
 * Get the backend host
 */
export const getBackendHost = (): string => {
  return process.env.REACT_APP_BACKEND_HOST || 'localhost';
};

/**
 * Get full backend URL
 */
export const getBackendUrl = (): string => {
  return `http://${getBackendHost()}:${getBackendPort()}`;
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  HEALTH: '/health',
  FORMS: '/forms',
  TEMPLATES: '/templates',
  STATS: '/stats',
  RESPONSES: '/responses',
  DASHBOARD: '/dashboard'
} as const;

/**
 * Build API endpoint URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${getApiUrl()}${endpoint}`;
};

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    apiUrl: getApiUrl(),
    backendHost: getBackendHost(),
    backendPort: getBackendPort(),
    backendUrl: getBackendUrl()
  });
} 