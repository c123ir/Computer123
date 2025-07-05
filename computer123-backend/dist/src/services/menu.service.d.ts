import { MenuType, Status } from '@prisma/client';
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
export declare class MenuService {
    getMenuTree(): Promise<any[]>;
    getMenuWithChildren(menuId: string): any;
    createMenu(data: CreateMenuDto): Promise<{
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
    updateMenu(id: string, data: UpdateMenuDto): Promise<{
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
    deleteMenu(id: string): Promise<boolean>;
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