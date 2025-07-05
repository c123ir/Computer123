import { Menu, MenuType } from '@prisma/client';
export declare class MenuService {
    private prisma;
    constructor();
    getMenuTree(): Promise<Menu[]>;
    getMenuWithChildren(menuId: string): Promise<Menu & {
        children: Menu[];
    }>;
    createMenu(data: {
        order: number;
        title: string;
        icon?: string;
        type: MenuType;
        config: any;
        parentId?: string;
        formId?: string;
        permissions: string[];
        roles: string[];
    }): Promise<Menu>;
    updateMenu(id: string, data: {
        order?: number;
        title?: string;
        icon?: string;
        type?: MenuType;
        config?: any;
        parentId?: string;
        formId?: string;
        permissions?: string[];
        roles?: string[];
    }): Promise<Menu>;
    deleteMenu(id: string): Promise<Menu>;
    reorderMenus(parentId: string | null, menuIds: string[]): Promise<boolean>;
    moveMenu(id: string, newParentId: string | null): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.Status;
        createdBy: string;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        formId: string | null;
        type: import(".prisma/client").$Enums.MenuType;
        order: number;
        config: import("@prisma/client/runtime/library").JsonValue;
        permissions: string[];
        title: string;
        icon: string | null;
        parentId: string | null;
        roles: string[];
    }>;
    private isChildMenu;
}
//# sourceMappingURL=menu.service.d.ts.map