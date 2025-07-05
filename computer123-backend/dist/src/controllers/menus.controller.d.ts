import { Request, Response } from 'express';
export declare class MenuController {
    private menuService;
    constructor();
    getMenus(req: Request, res: Response): Promise<void>;
    getMenu(req: Request, res: Response): Promise<void>;
    createMenu(req: Request, res: Response): Promise<void>;
    updateMenu(req: Request, res: Response): Promise<void>;
    deleteMenu(req: Request, res: Response): Promise<void>;
    getMenuTree(req: Request, res: Response): Promise<void>;
    getMenuWithChildren(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=menus.controller.d.ts.map