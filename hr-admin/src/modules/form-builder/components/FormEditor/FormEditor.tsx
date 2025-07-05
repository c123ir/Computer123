import React from 'react';
import { Form } from '../../types';
import { FormValidationExample } from './FormValidationExample';

interface FormEditorProps {
  form: Form;
  onChange: (form: Form) => void;
  onSave: () => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({
  form,
  onChange,
  onSave
}) => {
  const [isValid, setIsValid] = React.useState(false);

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleSave = () => {
    if (isValid) {
      onSave();
    }
  };

  return (
    <div className="form-editor">
      <FormValidationExample
        form={form}
        onValidationChange={handleValidationChange}
      />
      
      <div className="form-editor-content">
        {/* فیلدهای فرم */}
      </div>

      <div className="form-editor-actions">
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`save-button ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ذخیره
        </button>
      </div>
    </div>
  );
}; 