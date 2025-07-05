import { Request, Response } from 'express';
export declare class MenusController {
    private menuService;
    constructor();
    getMenuTree(req: Request, res: Response): Promise<void>;
    getMenuById(req: Request, res: Response): Promise<void>;
    createMenu(req: Request, res: Response): Promise<void>;
    updateMenu(req: Request, res: Response): Promise<void>;
    deleteMenu(req: Request, res: Response): Promise<void>;
    reorderMenus(req: Request, res: Response): Promise<void>;
    moveMenu(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=menus.controller.d.ts.map