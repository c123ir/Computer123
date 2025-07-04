import { PrismaClient, Menu, MenuType, Status } from '@prisma/client';
import { Logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateMenuDto {
  title: string;
  icon?: string;
  type: MenuType;
  config: any;
  parentId?: string;
  formId?: string;
  permissions: string[];
  roles: string[];
}

export interface UpdateMenuDto extends Partial<CreateMenuDto> {
  status?: Status;
}

export class MenuService {
  // دریافت همه منوها با ساختار درختی
  async getMenuTree() {
    try {
      // ابتدا منوهای ریشه را دریافت می‌کنیم
      const rootMenus = await prisma.menu.findMany({
        where: { parentId: null },
        orderBy: { order: 'asc' }
      });

      // برای هر منوی ریشه، زیرمنوها را به صورت بازگشتی دریافت می‌کنیم
      const menuTree = await Promise.all(
        rootMenus.map(menu => this.getMenuWithChildren(menu.id))
      );

      return menuTree;
    } catch (error) {
      Logger.error('Error in getMenuTree:', error);
      throw error;
    }
  }

  // دریافت یک منو با تمام زیرمنوهای آن
  async getMenuWithChildren(menuId: string) {
    try {
      const menu = await prisma.menu.findUnique({
        where: { id: menuId },
        include: {
          form: true,
          children: {
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!menu) {
        throw new Error(`Menu with ID ${menuId} not found`);
      }

      // به صورت بازگشتی زیرمنوها را دریافت می‌کنیم
      const children = await Promise.all(
        menu.children.map(child => this.getMenuWithChildren(child.id))
      );

      return {
        ...menu,
        children
      };
    } catch (error) {
      Logger.error(`Error in getMenuWithChildren for ID ${menuId}:`, error);
      throw error;
    }
  }

  // ایجاد منوی جدید
  async createMenu(data: CreateMenuDto) {
    try {
      // اگر parentId وجود دارد، ابتدا چک می‌کنیم که آیا وجود دارد
      if (data.parentId) {
        const parentExists = await prisma.menu.findUnique({
          where: { id: data.parentId }
        });
        if (!parentExists) {
          throw new Error(`Parent menu with ID ${data.parentId} not found`);
        }
      }

      // اگر نوع منو form است، چک می‌کنیم که فرم وجود داشته باشد
      if (data.type === 'FORM' && data.formId) {
        const formExists = await prisma.form.findUnique({
          where: { id: data.formId }
        });
        if (!formExists) {
          throw new Error(`Form with ID ${data.formId} not found`);
        }
      }

      // تعیین order برای منوی جدید
      const lastMenu = await prisma.menu.findFirst({
        where: { parentId: data.parentId || null },
        orderBy: { order: 'desc' }
      });
      const order = lastMenu ? lastMenu.order + 1 : 0;

      const menu = await prisma.menu.create({
        data: {
          ...data,
          order
        }
      });

      return menu;
    } catch (error) {
      Logger.error('Error in createMenu:', error);
      throw error;
    }
  }

  // به‌روزرسانی منو
  async updateMenu(id: string, data: UpdateMenuDto) {
    try {
      const menu = await prisma.menu.update({
        where: { id },
        data
      });

      return menu;
    } catch (error) {
      Logger.error(`Error in updateMenu for ID ${id}:`, error);
      throw error;
    }
  }

  // حذف منو
  async deleteMenu(id: string) {
    try {
      // ابتدا چک می‌کنیم که آیا این منو زیرمنو دارد
      const hasChildren = await prisma.menu.count({
        where: { parentId: id }
      });

      if (hasChildren > 0) {
        throw new Error('Cannot delete menu with children');
      }

      await prisma.menu.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      Logger.error(`Error in deleteMenu for ID ${id}:`, error);
      throw error;
    }
  }

  // تغییر ترتیب منوها
  async reorderMenus(parentId: string | null, menuIds: string[]) {
    try {
      await prisma.$transaction(
        menuIds.map((id, index) =>
          prisma.menu.update({
            where: { id },
            data: { order: index }
          })
        )
      );

      return true;
    } catch (error) {
      Logger.error('Error in reorderMenus:', error);
      throw error;
    }
  }

  // انتقال منو به والد جدید
  async moveMenu(id: string, newParentId: string | null) {
    try {
      // چک می‌کنیم که منو به یکی از زیرمنوهای خودش منتقل نشود
      if (newParentId) {
        const isChild = await this.isChildMenu(newParentId, id);
        if (isChild) {
          throw new Error('Cannot move menu to one of its children');
        }
      }

      const menu = await prisma.menu.update({
        where: { id },
        data: { parentId: newParentId }
      });

      return menu;
    } catch (error) {
      Logger.error(`Error in moveMenu for ID ${id}:`, error);
      throw error;
    }
  }

  // چک می‌کند که آیا یک منو زیرمنوی منوی دیگر است
  private async isChildMenu(parentId: string, childId: string): Promise<boolean> {
    const parent = await prisma.menu.findUnique({
      where: { id: parentId },
      include: { children: true }
    });

    if (!parent) return false;

    for (const child of parent.children) {
      if (child.id === childId) return true;
      const isChild = await this.isChildMenu(child.id, childId);
      if (isChild) return true;
    }

    return false;
  }
} 