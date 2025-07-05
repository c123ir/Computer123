import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormsList } from '../../modules/form-builder/components';
import type { Form } from '../../modules/form-builder/types';

const Forms: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectForm = (form: Form) => {
    navigate(`/forms/${form.id}/edit`);
  };

  return (
    <FormsList
      onSelectForm={handleSelectForm}
    />
  );
};

export default Forms; 