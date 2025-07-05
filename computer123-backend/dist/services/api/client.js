"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiClient {
    constructor() {
        this.instance = axios_1.default.create({
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3995/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.instance.interceptors.request.use((config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            console.error('❌ Request Error:', error);
            return Promise.reject(error);
        });
        this.instance.interceptors.response.use((response) => {
            console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
            return response;
        }, (error) => {
            console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`, error.response?.data);
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    async request(config) {
        try {
            const response = await this.instance.request(config);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new Error(error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    'API request failed');
            }
            throw error;
        }
    }
    async get(url, params) {
        return this.request({ method: 'GET', url, params });
    }
    async post(url, data) {
        return this.request({ method: 'POST', url, data });
    }
    async put(url, data) {
        return this.request({ method: 'PUT', url, data });
    }
    async patch(url, data) {
        return this.request({ method: 'PATCH', url, data });
    }
    async delete(url) {
        return this.request({ method: 'DELETE', url });
    }
}
exports.apiClient = new ApiClient();
//# sourceMappingURL=client.js.map