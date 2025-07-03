"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateFormStatus = exports.useCloneForm = exports.useDeleteForm = exports.useUpdateForm = exports.useCreateForm = exports.useForm = exports.useFormsList = exports.formsKeys = exports.DatabaseServiceFactory = exports.PostgreSQLService = exports.apiClient = void 0;
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
-- -
;
const client_1 = require("../../../../services/api/client");
class PostgreSQLService {
    async create(collectionName, data) {
        if (collectionName === 'forms') {
            const response = await exports.apiClient.post('/forms', data);
            return response.data.id;
        }
        if (collectionName === 'form_responses') {
            const response = await exports.apiClient.post(`/forms/${data.formId}/responses`, data);
            return response.data.id;
        }
        throw new Error(`Collection ${collectionName} not supported`);
    }
    async read(collectionName, id) {
        if (collectionName === 'forms') {
            const response = await exports.apiClient.get(`/forms/${id}`);
            return response.data;
        }
        if (collectionName === 'form_responses') {
            const response = await exports.apiClient.get(`/responses/${id}`);
            return response.data;
        }
        return null;
    }
    async update(collectionName, id, data) {
        try {
            if (collectionName === 'forms') {
                await exports.apiClient.put(`/forms/${id}`, data);
                return true;
            }
            if (collectionName === 'form_responses') {
                await exports.apiClient.put(`/responses/${id}`, data);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Update failed:', error);
            return false;
        }
    }
    async delete(collectionName, id) {
        try {
            if (collectionName === 'forms') {
                await exports.apiClient.delete(`/forms/${id}`);
                return true;
            }
            if (collectionName === 'form_responses') {
                await exports.apiClient.delete(`/responses/${id}`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Delete failed:', error);
            return false;
        }
    }
    async list(collectionName, filters) {
        if (collectionName === 'forms') {
            const params = new URLSearchParams();
            if (filters?.search)
                params.append('search', filters.search);
            if (filters?.status)
                params.append('status', filters.status);
            if (filters?.category)
                params.append('category', filters.category);
            if (filters?.page)
                params.append('page', filters.page.toString());
            if (filters?.limit)
                params.append('limit', filters.limit.toString());
            if (filters?.sortBy)
                params.append('sortBy', filters.sortBy);
            if (filters?.sortOrder)
                params.append('sortOrder', filters.sortOrder);
            const response = await exports.apiClient.get(`/forms?${params.toString()}`);
            return response.data || [];
        }
        if (collectionName === 'form_templates') {
            const response = await exports.apiClient.get('/templates');
            return response.data || [];
        }
        return [];
    }
    async count(collectionName, filters) {
        if (collectionName === 'forms') {
            const response = await this.list(collectionName, { ...filters, limit: 1 });
            return response.length;
        }
        return 0;
    }
    async cloneForm(id, createdBy) {
        const response = await exports.apiClient.post(`/forms/${id}/clone`, { createdBy });
        return response.data.id;
    }
    async updateFormStatus(id, status, updatedBy) {
        try {
            await exports.apiClient.patch(`/forms/${id}/status`, { status, updatedBy });
            return true;
        }
        catch (error) {
            console.error('Status update failed:', error);
            return false;
        }
    }
    async getFormResponses(formId) {
        const response = await exports.apiClient.get(`/forms/${formId}/responses`);
        return response.data || [];
    }
    async submitFormResponse(formId, answers, submitterInfo) {
        const response = await exports.apiClient.post(`/forms/${formId}/responses`, {
            answers,
            submitterInfo
        });
        return response.data.id;
    }
}
exports.PostgreSQLService = PostgreSQLService;
-- -
;
const firebase_service_1 = require("./firebase.service");
const postgresql_service_1 = require("./postgresql.service");
const memory_service_1 = require("./memory.service");
const localStorage_service_1 = require("./localStorage.service");
class DatabaseServiceFactory {
    static create(type) {
        if (this.instance && this.currentType === type) {
            return this.instance;
        }
        switch (type) {
            case 'firebase':
                this.instance = new firebase_service_1.FirebaseService();
                break;
            case 'postgresql':
                this.instance = new postgresql_service_1.PostgreSQLService();
                break;
            case 'memory':
                this.instance = new memory_service_1.MemoryDatabaseService();
                break;
            case 'localStorage':
                this.instance = new localStorage_service_1.LocalStorageService();
                break;
            default:
                throw new Error(`Database type ${type} not supported`);
        }
        this.currentType = type;
        console.log(`📊 Database service switched to: ${type.toUpperCase()}`);
        return this.instance;
    }
    static getCurrentType() {
        return this.currentType;
    }
    static reset() {
        this.instance = null;
        this.currentType = null;
    }
}
exports.DatabaseServiceFactory = DatabaseServiceFactory;
DatabaseServiceFactory.instance = null;
DatabaseServiceFactory.currentType = null;
-- -
;
const react_query_1 = require("@tanstack/react-query");
const factory_1 = require("../services/database/factory");
const getDatabaseService = () => {
    const dbType = process.env.REACT_APP_DATABASE_TYPE || 'postgresql';
    return factory_1.DatabaseServiceFactory.create(dbType);
};
exports.formsKeys = {
    all: ['forms'],
    lists: () => [...exports.formsKeys.all, 'list'],
    list: (filters) => [...exports.formsKeys.lists(), filters],
    details: () => [...exports.formsKeys.all, 'detail'],
    detail: (id) => [...exports.formsKeys.details(), id],
};
const useFormsList = (filters = {}) => {
    return (0, react_query_1.useQuery)({
        queryKey: exports.formsKeys.list(filters),
        queryFn: async () => {
            const db = getDatabaseService();
            return await db.list('forms', filters);
        },
        staleTime: 5 * 60 * 1000,
    });
};
exports.useFormsList = useFormsList;
const useForm = (id) => {
    return (0, react_query_1.useQuery)({
        queryKey: exports.formsKeys.detail(id),
        queryFn: async () => {
            const db = getDatabaseService();
            return await db.read('forms', id);
        },
        enabled: !!id,
    });
};
exports.useForm = useForm;
const useCreateForm = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (formData) => {
            const db = getDatabaseService();
            return await db.create('forms', formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: exports.formsKeys.lists() });
        },
    });
};
exports.useCreateForm = useCreateForm;
const useUpdateForm = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ id, data }) => {
            const db = getDatabaseService();
            return await db.update('forms', id, data);
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: exports.formsKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: exports.formsKeys.lists() });
        },
    });
};
exports.useUpdateForm = useUpdateForm;
const useDeleteForm = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (id) => {
            const db = getDatabaseService();
            return await db.delete('forms', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: exports.formsKeys.lists() });
        },
    });
};
exports.useDeleteForm = useDeleteForm;
const useCloneForm = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ id, createdBy }) => {
            const db = getDatabaseService();
            return await db.cloneForm(id, createdBy);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: exports.formsKeys.lists() });
        },
    });
};
exports.useCloneForm = useCloneForm;
const useUpdateFormStatus = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ id, status, updatedBy }) => {
            const db = getDatabaseService();
            return await db.updateFormStatus(id, status, updatedBy);
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: exports.formsKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: exports.formsKeys.lists() });
        },
    });
};
exports.useUpdateFormStatus = useUpdateFormStatus;
-- -
;
const react_query_2 = require("@tanstack/react-query");
const react_router_dom_1 = require("react-router-dom");
const Dashboard_1 = __importDefault(require("./pages/Dashboard"));
const ComingSoon_1 = __importDefault(require("./pages/ComingSoon"));
const Forms_1 = __importDefault(require("./pages/forms/Forms"));
const queryClient = new react_query_2.QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        },
        mutations: {
            retry: 1,
        },
    },
});
function App() {
    return client = { queryClient } >
        path;
    "/";
    element = {} < Dashboard_1.default /  > ;
}
/>
    < react_router_dom_1.Route;
path = "/forms";
element = {} < Forms_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/sales";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/customers";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/employees";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/investors";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/users";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/tags";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/settings";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/sms";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/documents";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/ai";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/reports";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/workflows";
element = {} < ComingSoon_1.default /  > ;
/>
    < react_router_dom_1.Route;
path = "/databases";
element = {} < ComingSoon_1.default /  > ;
/>
    < /Routes>
    < /Layout>
    < /Router>
    < /ThemeProvider>;
{ }
{
    process.env.NODE_ENV === 'development' && initialIsOpen;
    {
        false;
    }
    />;
}
/QueryClientProvider>;
;
exports.default = App;
//# sourceMappingURL=client.js.map