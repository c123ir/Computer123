import React from 'react';
import { Form } from '../types';
import FormBuilder from './FormBuilder/FormBuilder';

interface FormEditorProps {
  form: Form;
  onSave: (form: Form) => Promise<void>;
  onCancel: () => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ form, onSave, onCancel }) => {
  return (
    <FormBuilder
      form={form}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default FormEditor; 