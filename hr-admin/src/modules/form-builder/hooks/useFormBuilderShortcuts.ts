import { useEffect, useCallback } from 'react';
import { FormBuilderActions } from './useFormBuilder';

export interface UseFormBuilderShortcutsOptions {
  enabled?: boolean;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSelectAll?: () => void;
  onEscape?: () => void;
}

/**
 * Hook برای مدیریت میانبرهای صفحه کلید در فرم‌ساز
 */
export const useFormBuilderShortcuts = (
  actions: Partial<FormBuilderActions>,
  options: UseFormBuilderShortcutsOptions = {}
) => {
  const {
    enabled = true,
    onSave,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onSelectAll,
    onEscape
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? event.metaKey : event.ctrlKey;

    // Ctrl/Cmd + S - ذخیره
    if (modifierKey && event.key === 's') {
      event.preventDefault();
      if (onSave) onSave();
      else if (actions.saveForm) actions.saveForm();
    }

    // Ctrl/Cmd + Z - Undo
    if (modifierKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      if (onUndo) onUndo();
      else if (actions.undo) actions.undo();
    }

    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
    if ((modifierKey && event.shiftKey && event.key === 'z') || 
        (modifierKey && event.key === 'y')) {
      event.preventDefault();
      if (onRedo) onRedo();
      else if (actions.redo) actions.redo();
    }

    // Delete - حذف فیلد انتخاب شده
    if (event.key === 'Delete' && !modifierKey) {
      event.preventDefault();
      if (onDelete) onDelete();
    }

    // Ctrl/Cmd + D - تکرار فیلد
    if (modifierKey && event.key === 'd') {
      event.preventDefault();
      if (onDuplicate) onDuplicate();
    }

    // Ctrl/Cmd + A - انتخاب همه
    if (modifierKey && event.key === 'a') {
      event.preventDefault();
      if (onSelectAll) onSelectAll();
    }

    // Escape - لغو عملیات
    if (event.key === 'Escape') {
      event.preventDefault();
      if (onEscape) onEscape();
      else if (actions.selectField) actions.selectField(null);
    }
  }, [enabled, actions, onSave, onUndo, onRedo, onDelete, onDuplicate, onSelectAll, onEscape]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  return {
    handleKeyDown
  };
};

export default useFormBuilderShortcuts; 