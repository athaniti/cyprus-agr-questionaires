import React, { useState } from 'react';

interface OfflineFormBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const OfflineFormBuilder: React.FC<OfflineFormBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const [selectedComponents, setSelectedComponents] = useState<any[]>(form.components || []);
  const [showSuccess, setShowSuccess] = useState(false);

  const addComponent = (type: string, label: string) => {
    const newComponent = {
      type,
      key: `${type}_${Date.now()}`,
      label,
      input: true,
      id: `${type}_${Date.now()}`,
      required: false,
      placeholder: `${language === 'el' ? 'Εισάγετε' : 'Enter'} ${label.toLowerCase()}...`,
      validate: { required: false }
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

  const saveForm = () => {
    // Simulate save to localStorage instead of database
    const formData = {
      components: selectedComponents,
      timestamp: new Date().toISOString(),
      id: `form_${Date.now()}`
    };
    
    localStorage.setItem('questionnaire_draft', JSON.stringify(formData));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    console.log('📄 Form saved locally:', formData);
  };

  const components = [
    { type: 'textfield', label: language === 'el' ? 'Κείμενο' : 'Text Field', icon: '📝', description: language === 'el' ? 'Πεδίο εισαγωγής κειμένου' : 'Single line text input' },
    { type: 'textarea', label: language === 'el' ? 'Περιοχή Κειμένου' : 'Textarea', icon: '📄', description: language === 'el' ? 'Πολλαπλές γραμμές κειμένου' : 'Multi-line text input' },
    { type: 'number', label: language === 'el' ? 'Αριθμός' : 'Number', icon: '🔢', description: language === 'el' ? 'Αριθμητικό πεδίο' : 'Numeric input field' },
    { type: 'email', label: 'Email', icon: '📧', description: language === 'el' ? 'Διεύθυνση ηλεκτρονικού ταχυδρομείου' : 'Email address field' },
    { type: 'select', label: language === 'el' ? 'Λίστα Επιλογών' : 'Select List', icon: '📋', description: language === 'el' ? 'Αναπτυσσόμενη λίστα επιλογών' : 'Dropdown selection list' },
    { type: 'radio', label: language === 'el' ? 'Κουμπιά Επιλογής' : 'Radio Buttons', icon: '🔘', description: language === 'el' ? 'Επιλογή μίας από πολλές' : 'Single choice from multiple options' },
    { type: 'checkbox', label: language === 'el' ? 'Κουτάκια Επιλογής' : 'Checkboxes', icon: '☑️', description: language === 'el' ? 'Πολλαπλές επιλογές' : 'Multiple choice options' },
    { type: 'datetime', label: language === 'el' ? 'Ημερομηνία/Ώρα' : 'Date/Time', icon: '📅', description: language === 'el' ? 'Επιλογή ημερομηνίας και ώρας' : 'Date and time picker' },
    { type: 'phone', label: language === 'el' ? 'Τηλέφωνο' : 'Phone', icon: '📞', description: language === 'el' ? 'Αριθμός τηλεφώνου' : 'Phone number field' },
    { type: 'url', label: 'URL', icon: '🔗', description: language === 'el' ? 'Διεύθυνση ιστοσελίδας' : 'Website address field' },
    { type: 'file', label: language === 'el' ? 'Αρχείο' : 'File Upload', icon: '📎', description: language === 'el' ? 'Ανέβασμα αρχείου' : 'File upload field' },
    { type: 'button', label: language === 'el' ? 'Κουμπί' : 'Button', icon: '🔲', description: language === 'el' ? 'Κουμπί ενέργειας' : 'Action button' }
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Status Bar */}
      <div className="absolute top-4 right-4 z-10">
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <span className="mr-2">✅</span>
            {language === 'el' ? 'Φόρμα αποθηκεύτηκε!' : 'Form saved!'}
          </div>
        )}
      </div>

      {/* Components Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {language === 'el' ? 'Στοιχεία Φόρμας' : 'Form Components'}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {components.length} {language === 'el' ? 'τύποι' : 'types'}
            </span>
          </div>
          
          <div className="space-y-3">
            {components.map((component) => (
              <div
                key={component.type}
                onClick={() => addComponent(component.type, component.label)}
                className="group p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-[#004B87] hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                    {component.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 group-hover:text-[#004B87]">
                      {component.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {component.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={saveForm}
              disabled={selectedComponents.length === 0}
              className="w-full bg-[#004B87] text-white py-2 px-4 rounded-lg hover:bg-[#003a6b] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {language === 'el' ? '💾 Αποθήκευση Φόρμας' : '💾 Save Form'}
            </button>
          </div>
        </div>
      </div>

      {/* Form Preview Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === 'el' ? 'Προεπισκόπηση Φόρμας' : 'Form Preview'}
            </h3>
            <p className="text-gray-600">
              {language === 'el' 
                ? 'Κάντε κλικ στα στοιχεία αριστερά για να τα προσθέσετε στη φόρμα'
                : 'Click components on the left to add them to your form'
              }
            </p>
            {selectedComponents.length > 0 && (
              <div className="mt-2 text-sm text-blue-600">
                {selectedComponents.length} {language === 'el' ? 'στοιχεία προστέθηκαν' : 'components added'}
              </div>
            )}
          </div>

          {selectedComponents.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
              <div className="text-6xl mb-4 opacity-50">📝</div>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                {selectedComponents.map((component, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">
                          {components.find(c => c.type === component.type)?.icon}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-800">{component.label}</h4>
                          <p className="text-xs text-gray-500">
                            {language === 'el' ? 'Τύπος' : 'Type'}: {component.type} • ID: {component.key}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeComponent(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                        title={language === 'el' ? 'Διαγραφή στοιχείου' : 'Remove component'}
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Component Preview */}
                    <div className="mt-3">
                      {component.type === 'textfield' && (
                        <input
                          type="text"
                          placeholder={component.placeholder}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                          disabled
                        />
                      )}
                      {component.type === 'textarea' && (
                        <textarea
                          placeholder={component.placeholder}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                          rows={4}
                          disabled
                        />
                      )}
                      {/* Add more component types as needed */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineFormBuilder;