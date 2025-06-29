// =====================================================
// 🔧 فایل: src/config/firebase.ts
// =====================================================
// Firebase Configuration - DISABLED (Using PostgreSQL Backend)

console.warn('🚫 Firebase service is disabled - Using PostgreSQL backend instead');

// Firebase exports (disabled)
export const app = null;
export const auth = null;
export const db = null;
export const storage = null;

// Helper function (disabled)
export const isDemoMode = () => false;

export default {
  app: null,
  auth: null,
  db: null,
  storage: null,
  isDemoMode: false
};