// =====================================================
// 🔧 فایل: src/modules/form-builder/contexts/FormBuilderContext.tsx
// =====================================================

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Form, FormField } from '../types';

// تعریف تایپ‌های مورد نیاز
interface FormBuilderState {
  form: Form;
  selectedField: FormField | null;
  isDragging: boolean;
}

type FormBuilderAction =
  | { type: 'ADD_FIELD'; field: FormField }
  | { type: 'UPDATE_FIELD'; fieldId: string; updates: Partial<FormField> }
  | { type: 'DELETE_FIELD'; fieldId: string }
  | { type: 'SELECT_FIELD'; field: FormField | null }
  | { type: 'SET_DRAGGING'; isDragging: boolean }
  | { type: 'UPDATE_FORM'; updates: Partial<Form> }
  | { type: 'REORDER_FIELDS'; fieldIds: string[] };

// مقدار اولیه state
const initialState: FormBuilderState = {
  form: {
    id: '',
    name: 'فرم جدید',
    description: '',
    fields: [],
    settings: {
      direction: 'rtl',
      theme: 'light',
      submitButtonText: 'ارسال',
    },
  },
  selectedField: null,
  isDragging: false,
};

// ایجاد context
const FormBuilderContext = createContext<{
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// reducer برای مدیریت state
function formBuilderReducer(state: FormBuilderState, action: FormBuilderAction): FormBuilderState {
  switch (action.type) {
    case 'ADD_FIELD':
      return {
        ...state,
        form: {
          ...state.form,
          fields: [...state.form.fields, action.field],
        },
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        form: {
          ...state.form,
          fields: state.form.fields.map((field) =>
            field.id === action.fieldId ? { ...field, ...action.updates } : field
          ),
        },
      };

    case 'DELETE_FIELD':
      return {
        ...state,
        form: {
          ...state.form,
          fields: state.form.fields.filter((field) => field.id !== action.fieldId),
        },
        selectedField: state.selectedField?.id === action.fieldId ? null : state.selectedField,
      };

    case 'SELECT_FIELD':
      return {
        ...state,
        selectedField: action.field,
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.isDragging,
      };

    case 'UPDATE_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          ...action.updates,
        },
      };

    case 'REORDER_FIELDS':
      return {
        ...state,
        form: {
          ...state.form,
          fields: action.fieldIds
            .map((id) => state.form.fields.find((field) => field.id === id))
            .filter((field): field is FormField => field !== undefined),
        },
      };

    default:
      return state;
  }
}

// Provider component
export function FormBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  return (
    <FormBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </FormBuilderContext.Provider>
  );
}

// Custom hook برای استفاده از context
export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}