import { AxiosInstance } from 'axios';
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
declare class ApiClient {
    private instance;
    constructor();
    request<T>(config: Parameters<AxiosInstance['request']>[0]): Promise<T>;
    get<T>(url: string, params?: any): Promise<T>;
    post<T>(url: string, data?: any): Promise<T>;
    put<T>(url: string, data?: any): Promise<T>;
    patch<T>(url: string, data?: any): Promise<T>;
    delete<T>(url: string): Promise<T>;
}
export declare const apiClient: ApiClient;
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
export type DatabaseType = 'firebase' | 'postgresql' | 'memory' | 'localStorage';
export declare class DatabaseServiceFactory {
    private static instance;
    private static currentType;
    static create(type: DatabaseType): DatabaseService;
    static getCurrentType(): DatabaseType | null;
    static reset(): void;
}
export declare const formsKeys: {
    all: readonly ["forms"];
    lists: () => readonly ["forms", "list"];
    list: (filters: FormFilters) => readonly ["forms", "list", FormFilters];
    details: () => readonly ["forms", "detail"];
    detail: (id: string) => readonly ["forms", "detail", string];
};
export declare const useFormsList: (filters?: FormFilters) => any;
export declare const useForm: (id: string) => any;
export declare const useCreateForm: () => any;
export declare const useUpdateForm: () => any;
export declare const useDeleteForm: () => any;
export declare const useCloneForm: () => any;
export declare const useUpdateFormStatus: () => any;
declare function App(): boolean;
export default App;
//# sourceMappingURL=client.d.ts.map