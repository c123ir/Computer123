import React, { useState } from 'react';
import { FormsList, FormBuilder } from '../../modules/form-builder/components';
import { Form } from '../../modules/form-builder/types';

const Forms: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // اگر فرمی برای ویرایش انتخاب شده
  if (isEditing && selectedForm) {
    return (
      <FormBuilder
        formId={selectedForm.id}
        onSave={() => {
          setIsEditing(false);
          setSelectedForm(null);
        }}
        onCancel={() => {
          setIsEditing(false);
          setSelectedForm(null);
        }}
      />
    );
  }

  // نمایش لیست فرم‌ها
  return (
    <FormsList
      onSelectForm={(form) => {
        setSelectedForm(form);
        setIsEditing(true);
      }}
    />
  );
};

export default Forms; 