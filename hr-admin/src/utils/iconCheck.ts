// src/utils/iconCheck.ts
// فایل بررسی آیکن‌های موجود در lucide-react

// آیکن‌های صحیح که در lucide-react موجود هستند:
export {
  // Navigation & Layout
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,

  // Business & Commerce
  ShoppingCart,
  Users,
  UserCheck,
  User,
  DollarSign,
  TrendingUp,
  Activity,

  // System & Admin
  Shield,
  Settings,
  Database,
  Workflow,
  
  // Content & Files
  Tag,
  FileEdit,      // بجای FileForm
  FileText,
  Calendar,
  
  // Communication
  MessageSquare,
  Bell,
  
  // Technology
  Brain,
  
  // Analytics
  BarChart3,
  
  // UI Elements
  Search,
  Sun,
  Moon,
  Clock,
  CheckCircle,
  AlertCircle,
  Construction,
  Zap,
  
  // Misc
  LogOut,

} from 'lucide-react';

// نقشه آیکن‌های جایگزین برای آیکن‌های ناموجود:
export const iconReplacements = {
  'FileForm': 'FileEdit',        // جایگزین FileForm
  'Forms': 'FileEdit',           // برای فرم‌ها
  'FormInput': 'FileEdit',       // برای ورودی فرم
  'Document': 'FileText',        // برای اسناد
  'Docs': 'FileText',           // برای مستندات
  'AI': 'Brain',                // برای هوش مصنوعی
  'Analytics': 'BarChart3',     // برای آنالیتیک
  'Report': 'BarChart3',        // برای گزارش
  'SMS': 'MessageSquare',       // برای پیامک
  'Message': 'MessageSquare',   // برای پیام
};