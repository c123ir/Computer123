// src/modules/form-builder/hooks/index.ts

/**
 * Export تمام Hook های Form Builder
 */

// Main Hooks
export { 
    useFormBuilder, 
    useFormData, 
    useFormTemplates, 
    useFormBuilderShortcuts 
  } from './useFormBuilder';
  
  // Hook Types
  export type { 
    UseFormBuilderOptions, 
    UseFormBuilderReturn 
  } from './useFormBuilder';
  
  // Placeholder for future hooks
  export const useDragDrop = () => {
    // TODO: Implement drag and drop hook
    return {
      dragStart: () => {},
      dragEnd: () => {},
      drop: () => {}
    };
  };
  
  export const useFormValidation = () => {
    // TODO: Implement advanced validation hook
    return {
      validate: () => true,
      errors: {},
      isValid: true
    };
  };