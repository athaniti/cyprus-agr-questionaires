import React, { useState } from 'react';

interface WorkingFormBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const WorkingFormBuilder: React.FC<WorkingFormBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const [selectedComponents, setSelectedComponents] = useState<any[]>(form.components || []);

  const addComponent = (type: string, label: string) => {
    const newComponent = {
      type,
      key: `${type}_${Date.now()}`,
      label,
      input: true,
      id: `${type}_${Date.now()}`,
      required: false,
      placeholder: `Enter ${label.toLowerCase()}...`,
      validate: {
        required: false
      }
    };
    
    const updatedComponents = [...selectedComponents, newComponent];
    setSelectedComponents(updatedComponents);
    
    if (onFormChange) {
      onFormChange({ components: updatedComponents });
    }
  };

  const removeComponent = (index: number) => {
    const updatedComponents = selectedComponents.filter((_, i) => i !== index);
    setSelectedComponents(updatedComponents);
    
    if (onFormChange) {
      onFormChange({ components: updatedComponents });
    }
  };

  const components = [
    { type: 'textfield', label: language === 'el' ? 'Κείμενο' : 'Text Field', icon: '📝' },
    { type: 'textarea', label: language === 'el' ? 'Περιοχή Κειμένου' : 'Textarea', icon: '📄' },
    { type: 'number', label: language === 'el' ? 'Αριθμός' : 'Number', icon: '🔢' },
    { type: 'email', label: 'Email', icon: '📧' },
    { type: 'select', label: language === 'el' ? 'Λίστα Επιλογών' : 'Select List', icon: '📋' },
    { type: 'radio', label: language === 'el' ? 'Κουμπιά Επιλογής' : 'Radio Buttons', icon: '🔘' },
    { type: 'checkbox', label: language === 'el' ? 'Κουτάκια Επιλογής' : 'Checkboxes', icon: '☑️' },
    { type: 'datetime', label: language === 'el' ? 'Ημερομηνία/Ώρα' : 'Date/Time', icon: '📅' },
    { type: 'button', label: language === 'el' ? 'Κουμπί' : 'Button', icon: '🔲' }
  ];

  return (
    <div className="flex h-full bg-white">
      {/* Components Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {language === 'el' ? 'Στοιχεία Φόρμας' : 'Form Components'}
          </h3>
          
          <div className="space-y-2">
            {components.map((component) => (
              <div
                key={component.type}
                onClick={() => addComponent(component.type, component.label)}
                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                  {component.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  {component.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Preview Area */}
      <div className="flex-1 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {language === 'el' ? 'Προεπισκόπηση Φόρμας' : 'Form Preview'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'el' 
              ? 'Κάντε κλικ στα στοιχεία αριστερά για να τα προσθέσετε'
              : 'Click components on the left to add them'
            }
          </p>
        </div>

        {selectedComponents.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              {language === 'el' ? 'Κενή Φόρμα' : 'Empty Form'}
            </h4>
            <p className="text-gray-500">
              {language === 'el' 
                ? 'Αρχίστε προσθέτοντας στοιχεία από την αριστερή μπάρα'
                : 'Start by adding components from the left sidebar'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedComponents.map((component, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {components.find(c => c.type === component.type)?.icon}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-800">{component.label}</h4>
                      <p className="text-xs text-gray-500">Type: {component.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeComponent(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Preview of the actual component */}
                <div className="mt-3">
                  {component.type === 'textfield' && (
                    <input
                      type="text"
                      placeholder={component.label}
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled
                    />
                  )}
                  {component.type === 'textarea' && (
                    <textarea
                      placeholder={component.label}
                      className="w-full p-2 border border-gray-300 rounded"
                      rows={3}
                      disabled
                    />
                  )}
                  {component.type === 'number' && (
                    <input
                      type="number"
                      placeholder={component.label}
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled
                    />
                  )}
                  {component.type === 'email' && (
                    <input
                      type="email"
                      placeholder={component.label}
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled
                    />
                  )}
                  {component.type === 'select' && (
                    <select className="w-full p-2 border border-gray-300 rounded" disabled>
                      <option>{language === 'el' ? 'Επιλέξτε...' : 'Select...'}</option>
                    </select>
                  )}
                  {component.type === 'radio' && (
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name={component.key} disabled className="mr-2" />
                        {language === 'el' ? 'Επιλογή 1' : 'Option 1'}
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name={component.key} disabled className="mr-2" />
                        {language === 'el' ? 'Επιλογή 2' : 'Option 2'}
                      </label>
                    </div>
                  )}
                  {component.type === 'checkbox' && (
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" disabled className="mr-2" />
                        {language === 'el' ? 'Επιλογή 1' : 'Option 1'}
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" disabled className="mr-2" />
                        {language === 'el' ? 'Επιλογή 2' : 'Option 2'}
                      </label>
                    </div>
                  )}
                  {component.type === 'datetime' && (
                    <input
                      type="datetime-local"
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled
                    />
                  )}
                  {component.type === 'button' && (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50" disabled>
                      {component.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkingFormBuilder;