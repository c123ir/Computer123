import React from 'react';
import { useFormValidation } from '../../hooks';
import { Form } from '../../types';

interface FormValidationExampleProps {
  form: Form;
  onValidationChange?: (isValid: boolean) => void;
}

export const FormValidationExample: React.FC<FormValidationExampleProps> = ({
  form,
  onValidationChange
}) => {
  const { validate, errors, isValid } = useFormValidation();

  React.useEffect(() => {
    const isFormValid = validate(form);
    onValidationChange?.(isFormValid);
  }, [form, validate, onValidationChange]);

  if (Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div className="validation-errors">
      <h3>خطاهای اعتبارسنجی:</h3>
      <ul>
        {Object.entries(errors).map(([field, message]) => (
          <li key={field} className="text-red-500">
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}; 