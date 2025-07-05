import { Request, Response } from 'express';
import { FormStatus } from '@prisma/client';
import { Form } from '../types/form.types';
export declare class FormsController {
    private convertToApiForm;
    getForms(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getFormById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createForm(req: Request<any, any, Form>, res: Response): Promise<Response<any, Record<string, any>>>;
    updateForm(req: Request<{
        id: string;
    }, any, Partial<Form>>, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteForm(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    cloneForm(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateFormStatus(req: Request<{
        id: string;
    }, any, {
        status: FormStatus;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=forms.controller.d.ts.map