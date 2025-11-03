import { FormBuilder } from "@formio/react";
import { useState } from 'react';

interface FormBuilderPageProps {
  initialForm: any;
  onSave: (form: any) => void;
  onCancel: () => void;
  title: string;
}

export function FormBuilderPage({ initialForm, onSave, onCancel, title }: FormBuilderPageProps) {
  const [currentForm, setCurrentForm] = useState(initialForm);

  const handleSave = () => {
    onSave(currentForm);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="space-x-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* FormBuilder */}
      <div className="flex-1 p-4">
        <FormBuilder
          initialForm={initialForm}
          onChange={(form) => setCurrentForm(form)}
          onBuilderReady={(builder) => {
            console.log('FormBuilder ready:', builder);
          }}
        />
      </div>
    </div>
  );
}