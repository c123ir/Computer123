import { Form } from '@prisma/client';
import { FormFilters } from '../services/database/interface';
export declare const formsKeys: {
    all: readonly ["forms"];
    lists: () => readonly ["forms", "list"];
    list: (filters: FormFilters) => readonly ["forms", "list", FormFilters];
    details: () => readonly ["forms", "detail"];
    detail: (id: string) => readonly ["forms", "detail", string];
};
export declare const useFormsList: (filters?: FormFilters) => import("@tanstack/react-query").UseQueryResult<any[], Error>;
export declare const useForm: (id: string) => import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare const useCreateForm: () => import("@tanstack/react-query").UseMutationResult<string, Error, Omit<{
    name: string;
    id: string;
    description: string | null;
    fieldsData: import("@prisma/client/runtime/library").JsonValue;
    settings: import("@prisma/client/runtime/library").JsonValue;
    styling: import("@prisma/client/runtime/library").JsonValue;
    metadata: import("@prisma/client/runtime/library").JsonValue;
    status: import(".prisma/client").$Enums.FormStatus;
    version: number;
    category: string | null;
    tags: string[];
    createdBy: string;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}, "id" | "createdAt" | "updatedAt">, unknown>;
export declare const useUpdateForm: () => import("@tanstack/react-query").UseMutationResult<boolean, Error, {
    id: string;
    data: Partial<Form>;
}, unknown>;
export declare const useDeleteForm: () => import("@tanstack/react-query").UseMutationResult<boolean, Error, string, unknown>;
export declare const useCloneForm: () => import("@tanstack/react-query").UseMutationResult<any, Error, {
    id: string;
    createdBy: string;
}, unknown>;
export declare const useUpdateFormStatus: () => import("@tanstack/react-query").UseMutationResult<any, Error, {
    id: string;
    status: string;
    updatedBy: string;
}, unknown>;
//# sourceMappingURL=useFormsAPI.d.ts.map