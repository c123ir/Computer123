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
export {};
//# sourceMappingURL=client.d.ts.map