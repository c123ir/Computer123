// src/modules/form-builder/hooks/index.ts

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

// Hook Types
export type UseFormBuilderReturn = ReturnType<typeof import('./useFormBuilder').useFormBuilder>;

// Default export
import { useFormBuilder } from './useFormBuilder';
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

export const useFormValidation = () => {
  // TODO: Implement advanced validation hook
  return {
    validate: () => true,
    errors: {},
    isValid: true
  };
};