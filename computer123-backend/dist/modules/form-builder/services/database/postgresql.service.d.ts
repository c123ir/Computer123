import { DatabaseService, FormFilters } from './interface';
import { FormResponse } from '../../types';
export declare class PostgreSQLService implements DatabaseService {
    create(collectionName: string, data: any): Promise<string>;
    read(collectionName: string, id: string): Promise<any>;
    update(collectionName: string, id: string, data: any): Promise<boolean>;
    delete(collectionName: string, id: string): Promise<boolean>;
    list(collectionName: string, filters?: FormFilters): Promise<any[]>;
    count(collectionName: string, filters?: FormFilters): Promise<number>;
    cloneForm(id: string, createdBy: string): Promise<string>;
    updateFormStatus(id: string, status: string, updatedBy: string): Promise<boolean>;
    getFormResponses(formId: string): Promise<FormResponse[]>;
    submitFormResponse(formId: string, answers: Record<string, any>, submitterInfo?: any): Promise<string>;
}
//# sourceMappingURL=postgresql.service.d.ts.map