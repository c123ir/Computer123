# سیستم منوی پویا

## معرفی
سیستم منوی پویا یک بخش کلیدی از پلتفرم است که امکان ایجاد و مدیریت منوها را به صورت پویا و با قابلیت اتصال به فرم‌ها فراهم می‌کند.

## ویژگی‌های کلیدی
1. ساختار درختی منوها
2. پشتیبانی از انواع مختلف منو
3. یکپارچگی با فرم‌ساز
4. مدیریت دسترسی‌ها
5. شخصی‌سازی ظاهر

## معماری سیستم منو

### 1. موتور منو
```typescript
interface MenuEngine {
  // مدیریت منو
  menuManager: MenuManager;
  // مدیریت دسترسی
  accessManager: MenuAccessManager;
  // رندر منو
  renderer: MenuRenderer;
  // مدیریت وضعیت
  stateManager: MenuStateManager;
  // مدیریت رویدادها
  eventManager: MenuEventManager;
}
```

### 2. مدیریت منو
```typescript
interface MenuManager {
  // عملیات پایه
  createMenu(definition: MenuDefinition): Menu;
  updateMenu(id: string, updates: Partial<MenuDefinition>): Menu;
  deleteMenu(id: string): void;
  
  // ساختار درختی
  addChild(parentId: string, menuItem: MenuDefinition): Menu;
  moveMenuItem(id: string, newParentId: string): void;
  reorderMenuItems(parentId: string, itemIds: string[]): void;
  
  // مدیریت نوع منو
  setMenuType(id: string, type: MenuType, config: MenuTypeConfig): void;
  linkToForm(menuId: string, formId: string, config: FormMenuConfig): void;
  
  // جستجو و فیلتر
  searchMenus(criteria: SearchCriteria): Menu[];
  filterMenus(filters: MenuFilters): Menu[];
}
```

### 3. انواع منو
```typescript
type MenuType = 'static' | 'dynamic' | 'form';

interface MenuTypeConfig {
  // تنظیمات استاتیک
  static?: {
    route: string;
    component: string;
    params?: Record<string, any>;
  };
  
  // تنظیمات پویا
  dynamic?: {
    dataSource: string;
    template: string;
    refreshInterval?: number;
  };
  
  // تنظیمات فرم
  form?: {
    formId: string;
    viewType: 'list' | 'grid' | 'calendar';
    defaultFilters?: FilterDefinition[];
    actions?: MenuAction[];
  };
}
```

### 4. مدیریت دسترسی
```typescript
interface MenuAccessManager {
  // دسترسی‌های پایه
  setPermissions(menuId: string, permissions: Permission[]): void;
  checkAccess(userId: string, menuId: string): boolean;
  
  // نقش‌ها
  assignRole(menuId: string, role: string): void;
  removeRole(menuId: string, role: string): void;
  
  // محدودیت‌ها
  setVisibilityRules(menuId: string, rules: VisibilityRule[]): void;
  setAccessRestrictions(menuId: string, restrictions: AccessRestriction[]): void;
}
```

### 5. رندر منو
```typescript
interface MenuRenderer {
  // رندر اصلی
  renderMenu(menuId: string, context: RenderContext): ReactElement;
  renderMenuItem(itemId: string, props: MenuItemProps): ReactElement;
  
  // شخصی‌سازی
  setMenuStyle(menuId: string, style: MenuStyle): void;
  setItemStyle(itemId: string, style: MenuItemStyle): void;
  
  // رندر شرطی
  setConditionalDisplay(menuId: string, conditions: DisplayCondition[]): void;
}
```

## ساختار داده‌ها

### 1. تعریف منو
```typescript
interface MenuDefinition {
  title: string;
  icon?: string;
  type: MenuType;
  order: number;
  config: MenuTypeConfig;
  permissions: Permission[];
  style?: MenuStyle;
  metadata?: Record<string, any>;
}
```

### 2. تنظیمات منوی فرم
```typescript
interface FormMenuConfig {
  formId: string;
  viewSettings: {
    type: 'list' | 'grid' | 'calendar';
    layout: LayoutDefinition;
    filters: FilterDefinition[];
    sorting: SortDefinition[];
  };
  actions: {
    create?: ActionConfig;
    edit?: ActionConfig;
    delete?: ActionConfig;
    custom?: CustomAction[];
  };
  display: {
    columns?: ColumnDefinition[];
    cardTemplate?: string;
    grouping?: GroupingConfig;
  };
}
```

### 3. مدیریت رویدادها
```typescript
interface MenuEventManager {
  // رویدادهای پایه
  onMenuClick(menuId: string, handler: ClickHandler): void;
  onMenuHover(menuId: string, handler: HoverHandler): void;
  
  // رویدادهای خاص
  onBeforeNavigate(handler: NavigationHandler): void;
  onAfterNavigate(handler: NavigationHandler): void;
  
  // رویدادهای سفارشی
  registerCustomEvent(eventType: string, handler: EventHandler): void;
}
```

## نمونه‌های استفاده

### 1. ایجاد منوی ساده
```typescript
const menuEngine = new MenuEngine();

const mainMenu = menuEngine.menuManager.createMenu({
  title: "مدیریت کارمندان",
  type: "static",
  order: 1,
  config: {
    static: {
      route: "/employees",
      component: "EmployeeManagement"
    }
  },
  permissions: ["view_employees"]
});
```

### 2. ایجاد منوی فرم
```typescript
const formMenu = menuEngine.menuManager.createMenu({
  title: "ثبت اطلاعات کارمند",
  type: "form",
  order: 2,
  config: {
    form: {
      formId: "employee-form",
      viewType: "list",
      defaultFilters: [
        { field: "status", operator: "eq", value: "active" }
      ]
    }
  }
});
```

## یکپارچه‌سازی با فرم‌ساز

### 1. اتصال منو به فرم
```typescript
interface FormMenuIntegration {
  // پیوند منو و فرم
  linkMenuToForm(menuId: string, formId: string): void;
  
  // همگام‌سازی داده‌ها
  syncFormData(menuId: string): void;
  
  // مدیریت نمایش
  updateFormView(menuId: string, viewConfig: ViewConfig): void;
}
```

### 2. مدیریت عملیات
```typescript
interface FormMenuOperations {
  // عملیات پایه
  create(): void;
  edit(id: string): void;
  delete(id: string): void;
  
  // عملیات سفارشی
  addCustomAction(action: CustomAction): void;
  executeAction(actionId: string, context: ActionContext): void;
}
```

## چک‌لیست پیاده‌سازی

### فاز 1: ساختار پایه
- [ ] پیاده‌سازی MenuEngine
- [ ] مدیریت ساختار درختی
- [ ] سیستم دسترسی پایه
- [ ] رندر اولیه منو

### فاز 2: یکپارچه‌سازی با فرم
- [ ] اتصال به فرم‌ساز
- [ ] مدیریت نمایش فرم‌ها
- [ ] همگام‌سازی داده‌ها
- [ ] عملیات CRUD

### فاز 3: شخصی‌سازی و پویایی
- [ ] شخصی‌سازی ظاهر
- [ ] منوهای پویا
- [ ] رویدادها و اکشن‌ها
- [ ] انیمیشن‌ها

### فاز 4: قابلیت‌های پیشرفته
- [ ] کش‌گذاری منوها
- [ ] بهینه‌سازی عملکرد
- [ ] مدیریت وضعیت
- [ ] گزارش‌گیری

## نکات پیاده‌سازی

### 1. عملکرد
- کش‌گذاری ساختار منو
- لود تنبل زیرمنوها
- بهینه‌سازی رندر

### 2. امنیت
- بررسی دسترسی‌ها در سرور
- محدودیت عملیات
- لاگ تغییرات

### 3. تجربه کاربری
- انیمیشن‌های روان
- بازخورد مناسب
- راهنمای کاربری 