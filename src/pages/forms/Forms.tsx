import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchForms } from '../../services/form.service';

const FormsPage: React.FC = () => {
  const { data: forms, isLoading, error } = useQuery(['forms'], fetchForms);

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در بارگذاری فرم‌ها</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">مدیریت فرم‌ها</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms?.map((form: any) => (
          <div key={form.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{form.name}</h2>
            <p className="text-gray-600">{form.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormsPage; 