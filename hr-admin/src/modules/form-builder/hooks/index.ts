// src/modules/form-builder/hooks/index.ts

import { useFormBuilder } from './useFormBuilder';

/**
 * Export تمام Hook های Form Builder
 */

// Main Hooks
export { 
    useFormBuilder, 
  type FormBuilderState,
  type FormBuilderActions,
  type UseFormBuilderOptions
  } from './useFormBuilder';

export { 
  useFormBuilderShortcuts,
  type UseFormBuilderShortcutsOptions
} from './useFormBuilderShortcuts';

export {
  useFormsAPI,
  type FormsAPI
} from './useFormsAPI';
  
// Hook Types
export type UseFormBuilderReturn = ReturnType<typeof import('./useFormBuilder').useFormBuilder>;

// Default export
export default useFormBuilder;
  
// Placeholder for future hooks
export const useDragDrop = () => {
  // TODO: Implement drag and drop hook
  return {
    dragStart: () => {},
    dragEnd: () => {},
    drop: () => {}
  };
};

export { useFormValidation } from './useFormValidation';