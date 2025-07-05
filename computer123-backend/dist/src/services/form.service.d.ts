export declare class FormService {
    static createPanel(formId: string, panelData: any): Promise<{
        id: string;
        formId: string;
        label: string;
        type: string;
        required: boolean;
        order: number;
        config: import("@prisma/client/runtime/library").JsonValue;
        validation: import("@prisma/client/runtime/library").JsonValue | null;
        permissions: string[];
        isPanel: boolean;
        parentId: string | null;
        panelConfig: import("@prisma/client/runtime/library").JsonValue | null;
        relatedFormId: string | null;
    }>;
    static updatePanel(panelId: string, panelData: any): Promise<{
        id: string;
        formId: string;
        label: string;
        type: string;
        required: boolean;
        order: number;
        config: import("@prisma/client/runtime/library").JsonValue;
        validation: import("@prisma/client/runtime/library").JsonValue | null;
        permissions: string[];
        isPanel: boolean;
        parentId: string | null;
        panelConfig: import("@prisma/client/runtime/library").JsonValue | null;
        relatedFormId: string | null;
    }>;
    static addFieldToPanel(panelId: string, fieldId: string): Promise<{
        id: string;
        formId: string;
        label: string;
        type: string;
        required: boolean;
        order: number;
        config: import("@prisma/client/runtime/library").JsonValue;
        validation: import("@prisma/client/runtime/library").JsonValue | null;
        permissions: string[];
        isPanel: boolean;
        parentId: string | null;
        panelConfig: import("@prisma/client/runtime/library").JsonValue | null;
        relatedFormId: string | null;
    }>;
    static removeFieldFromPanel(fieldId: string): Promise<{
        id: string;
        formId: string;
        label: string;
        type: string;
        required: boolean;
        order: number;
        config: import("@prisma/client/runtime/library").JsonValue;
        validation: import("@prisma/client/runtime/library").JsonValue | null;
        permissions: string[];
        isPanel: boolean;
        parentId: string | null;
        panelConfig: import("@prisma/client/runtime/library").JsonValue | null;
        relatedFormId: string | null;
    }>;
    static getPanelFields(panelId: string): Promise<{
        id: string;
        formId: string;
        label: string;
        type: string;
        required: boolean;
        order: number;
        config: import("@prisma/client/runtime/library").JsonValue;
        validation: import("@prisma/client/runtime/library").JsonValue | null;
        permissions: string[];
        isPanel: boolean;
        parentId: string | null;
        panelConfig: import("@prisma/client/runtime/library").JsonValue | null;
        relatedFormId: string | null;
    }[]>;
    static reorderPanelFields(panelId: string, fieldIds: string[]): Promise<{
        id: string;
        formId: string;
        label: string;
        type: string;
        required: boolean;
        order: number;
        config: import("@prisma/client/runtime/library").JsonValue;
        validation: import("@prisma/client/runtime/library").JsonValue | null;
        permissions: string[];
        isPanel: boolean;
        parentId: string | null;
        panelConfig: import("@prisma/client/runtime/library").JsonValue | null;
        relatedFormId: string | null;
    }[]>;
}
//# sourceMappingURL=form.service.d.ts.map