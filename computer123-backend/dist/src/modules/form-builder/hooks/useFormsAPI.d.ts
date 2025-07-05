import { FormFilters } from '../types';
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
//# sourceMappingURL=useFormsAPI.d.ts.map