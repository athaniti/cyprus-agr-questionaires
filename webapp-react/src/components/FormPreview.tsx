import { useState } from 'react';

interface FormPreviewProps {
  questionnaire: any;
  onClose: () => void;
  language: 'el' | 'en';
}

export function FormPreview({ questionnaire, onClose, language }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const translations = {
    el: {
      preview: 'Προεπισκόπηση Ερωτηματολογίου',
      close: 'Κλείσιμο',
      submit: 'Υποβολή',
      required: 'Υποχρεωτικό πεδίο',
      fillForm: 'Συμπληρώστε τη φόρμα για να δείτε πώς λειτουργεί'
    },
    en: {
      preview: 'Questionnaire Preview',
      close: 'Close',
      submit: 'Submit',
      required: 'Required field',
      fillForm: 'Fill out the form to see how it works'
    }
  };

  const t = translations[language];

  const handleInputChange = (componentId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [componentId]: value
    }));
  };

  const renderFormComponent = (component: any) => {
    const value = formData[component.id] || '';

    switch (component.type) {
      case 'textfield':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={component.label}
            required={component.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={component.label}
            rows={4}
            required={component.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={component.label}
            required={component.required}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={component.label}
            required={component.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={component.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={component.required}
          >
            <option value="">{language === 'el' ? 'Επιλέξτε...' : 'Select...'}</option>
            {component.options?.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {component.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={component.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(component.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                  required={component.required}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {component.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleInputChange(component.id, [...currentValues, option]);
                    } else {
                      handleInputChange(component.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {component.columns?.map((column: any, index: number) => (
                    <th key={index} className="p-3 text-left border-b border-gray-300 font-medium">
                      {column.label}
                      {column.required && <span className="text-red-500 ml-1">*</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: component.rows || 3 }, (_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-200">
                    {component.columns?.map((column: any, colIndex: number) => (
                      <td key={colIndex} className="p-3">
                        {column.type === 'textfield' && (
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder={column.label}
                            value={formData[`${component.id}_${rowIndex}_${colIndex}`] || ''}
                            onChange={(e) => handleInputChange(`${component.id}_${rowIndex}_${colIndex}`, e.target.value)}
                          />
                        )}
                        {column.type === 'number' && (
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder={column.label}
                            value={formData[`${component.id}_${rowIndex}_${colIndex}`] || ''}
                            onChange={(e) => handleInputChange(`${component.id}_${rowIndex}_${colIndex}`, e.target.value)}
                          />
                        )}
                        {column.type === 'select' && (
                          <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={formData[`${component.id}_${rowIndex}_${colIndex}`] || ''}
                            onChange={(e) => handleInputChange(`${component.id}_${rowIndex}_${colIndex}`, e.target.value)}
                          >
                            <option value="">Select...</option>
                            {column.options?.map((option: string, optIndex: number) => (
                              <option key={optIndex} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div className="p-3 bg-gray-100 rounded-lg">Unknown component type: {component.type}</div>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    alert(language === 'el' ? 'Φόρμα υποβλήθηκε επιτυχώς!' : 'Form submitted successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full h-full max-w-4xl max-h-[95vh] m-4 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.preview}</h2>
            <p className="text-gray-600 text-sm mt-1">{questionnaire.name}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t.close}
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{questionnaire.name}</h1>
              <p className="text-gray-600">{t.fillForm}</p>
            </div>

            {questionnaire.components?.map((component: any, index: number) => (
              <div key={component.id || index} className="space-y-2">
                <label className="block font-medium text-gray-900">
                  {component.label}
                  {component.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFormComponent(component)}
              </div>
            ))}

            {questionnaire.components?.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                {language === 'el' 
                  ? 'Δεν υπάρχουν ερωτήσεις σε αυτό το ερωτηματολόγιο' 
                  : 'No questions in this questionnaire'}
              </div>
            )}

            {questionnaire.components?.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#004B87' }}
                >
                  {t.submit}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}