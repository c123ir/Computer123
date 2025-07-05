"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateFormStatus = exports.useCloneForm = exports.useDeleteForm = exports.useUpdateForm = exports.useCreateForm = exports.useForm = exports.useFormsList = exports.formsKeys = void 0;
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
//# sourceMappingURL=useFormsAPI.js.map