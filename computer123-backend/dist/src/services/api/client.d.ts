import { AxiosInstance } from 'axios';
interface Location {
    href: string;
    pathname: string;
    search: string;
    hash: string;
    host: string;
    hostname: string;
    port: string;
    protocol: string;
    origin: string;
    assign(url: string): void;
    replace(url: string): void;
    reload(forcedReload?: boolean): void;
}
declare global {
    interface Window {
        location: Location;
    }
    interface Storage {
        getItem(key: string): string | null;
        setItem(key: string, value: string): void;
        removeItem(key: string): void;
    }
    var localStorage: Storage;
    var window: Window & typeof globalThis;
}
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