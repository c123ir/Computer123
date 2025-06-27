import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormBuilder } from '../modules/form-builder/components';

const FormBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSave = (formId: string) => {
    console.log('Form saved:', formId);
    // می‌توانید اینجا notification نمایش دهید
    navigate('/forms');
  };

  const handleCancel = () => {
    navigate('/forms');
  };

  return (
    <FormBuilder
      formId={id}
      onSave={handleSave}
      onCancel={handleCancel}
      readonly={false}
    />
  );
};

export default FormBuilderPage; 