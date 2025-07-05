"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSQLService = void 0;
const client_1 = require("../../../../services/api/client");
class PostgreSQLService {
    async create(collectionName, data) {
        if (collectionName === 'forms') {
            const response = await client_1.apiClient.post('/forms', data);
            return response.data.id;
        }
        if (collectionName === 'form_responses') {
            const response = await client_1.apiClient.post(`/forms/${data.formId}/responses`, data);
            return response.data.id;
        }
        throw new Error(`Collection ${collectionName} not supported`);
    }
    async read(collectionName, id) {
        if (collectionName === 'forms') {
            const response = await client_1.apiClient.get(`/forms/${id}`);
            return response.data;
        }
        if (collectionName === 'form_responses') {
            const response = await client_1.apiClient.get(`/responses/${id}`);
            return response.data;
        }
        return null;
    }
    async update(collectionName, id, data) {
        try {
            if (collectionName === 'forms') {
                await client_1.apiClient.put(`/forms/${id}`, data);
                return true;
            }
            if (collectionName === 'form_responses') {
                await client_1.apiClient.put(`/responses/${id}`, data);
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
                await client_1.apiClient.delete(`/forms/${id}`);
                return true;
            }
            if (collectionName === 'form_responses') {
                await client_1.apiClient.delete(`/responses/${id}`);
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
            const response = await client_1.apiClient.get(`/forms?${params.toString()}`);
            return response.data || [];
        }
        if (collectionName === 'form_templates') {
            const response = await client_1.apiClient.get('/templates');
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
        const response = await client_1.apiClient.post(`/forms/${id}/clone`, { createdBy });
        return response.data.id;
    }
    async updateFormStatus(id, status, updatedBy) {
        try {
            await client_1.apiClient.patch(`/forms/${id}/status`, { status, updatedBy });
            return true;
        }
        catch (error) {
            console.error('Status update failed:', error);
            return false;
        }
    }
    async getFormResponses(formId) {
        const response = await client_1.apiClient.get(`/forms/${formId}/responses`);
        return response.data || [];
    }
    async submitFormResponse(formId, answers, submitterInfo) {
        const response = await client_1.apiClient.post(`/forms/${formId}/responses`, {
            answers,
            submitterInfo
        });
        return response.data.id;
    }
}
exports.PostgreSQLService = PostgreSQLService;
//# sourceMappingURL=postgresql.service.js.map