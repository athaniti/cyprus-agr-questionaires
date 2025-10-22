import React, { useState, useEffect } from 'react';

interface HybridFormBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const HybridFormBuilder: React.FC<HybridFormBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const [currentForm, setCurrentForm] = useState(form);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [useFormio, setUseFormio] = useState(true);
  const [formioAttempted, setFormioAttempted] = useState(false);

  // Try to load Form.io, but fallback quickly if it fails
  useEffect(() => {
    if (!formioAttempted && useFormio) {
      setFormioAttempted(true);
      
      const timeout = setTimeout(() => {
        console.log('Form.io loading timeout, using fallback');
        setUseFormio(false);
      }, 3000); // Only wait 3 seconds

      import('formiojs').then((FormioModule) => {
        clearTimeout(timeout);
        console.log('Form.io loaded successfully');
        // Keep useFormio as true to try rendering
      }).catch((error) => {
        clearTimeout(timeout);
        console.error('Form.io failed to load:', error);
        setUseFormio(false);
      });

      return () => clearTimeout(timeout);
    }
  }, [formioAttempted, useFormio]);

  const addComponent = (type: string) => {
    const newComponent = {
      id: `${type}_${Date.now()}`,
      type,
      label: getDefaultLabel(type),
      key: `${type}_${Date.now()}`,
      input: true,
      required: false,
      placeholder: getDefaultPlaceholder(type)
    };

    const updatedForm = {
      ...currentForm,
      components: [...(currentForm.components || []), newComponent]
    };

    setCurrentForm(updatedForm);
    if (onFormChange) {
      onFormChange(updatedForm);
    }
  };

  const removeComponent = (componentId: string) => {
    const updatedForm = {
      ...currentForm,
      components: currentForm.components.filter((comp: any) => comp.id !== componentId)
    };

    setCurrentForm(updatedForm);
    if (onFormChange) {
      onFormChange(updatedForm);
    }
  };

  const updateComponent = (componentId: string, updates: any) => {
    const updatedForm = {
      ...currentForm,
      components: currentForm.components.map((comp: any) => 
        comp.id === componentId ? { ...comp, ...updates } : comp
      )
    };

    setCurrentForm(updatedForm);
    if (onFormChange) {
      onFormChange(updatedForm);
    }
  };

  const getDefaultLabel = (type: string) => {
    const labels: { [key: string]: { el: string; en: string } } = {
      textfield: { el: 'Πεδίο Κειμένου', en: 'Text Field' },
      textarea: { el: 'Περιοχή Κειμένου', en: 'Text Area' },
      number: { el: 'Αριθμός', en: 'Number' },
      email: { el: 'Email', en: 'Email' },
      select: { el: 'Επιλογή', en: 'Select' },
      radio: { el: 'Επιλογή Radio', en: 'Radio Choice' },
      checkbox: { el: 'Checkbox', en: 'Checkbox' },
      datetime: { el: 'Ημερομηνία', en: 'Date' }
    };
    return labels[type]?.[language as 'el' | 'en'] || type;
  };

  const getDefaultPlaceholder = (type: string) => {
    const placeholders: { [key: string]: { el: string; en: string } } = {
      textfield: { el: 'Εισάγετε κείμενο...', en: 'Enter text...' },
      textarea: { el: 'Εισάγετε κείμενο...', en: 'Enter text...' },
      number: { el: 'Εισάγετε αριθμό...', en: 'Enter number...' },
      email: { el: 'Εισάγετε email...', en: 'Enter email...' },
      datetime: { el: 'Επιλέξτε ημερομηνία...', en: 'Select date...' }
    };
    return placeholders[type]?.[language as 'el' | 'en'] || '';
  };

  const componentTypes = [
    { type: 'textfield', icon: '📝', label: language === 'el' ? 'Κείμενο' : 'Text' },
    { type: 'textarea', icon: '📄', label: language === 'el' ? 'Περιοχή Κειμένου' : 'Textarea' },
    { type: 'number', icon: '🔢', label: language === 'el' ? 'Αριθμός' : 'Number' },
    { type: 'email', icon: '📧', label: 'Email' },
    { type: 'select', icon: '📋', label: language === 'el' ? 'Επιλογή' : 'Select' },
    { type: 'radio', icon: '🔘', label: 'Radio' },
    { type: 'checkbox', icon: '☑️', label: 'Checkbox' },
    { type: 'datetime', icon: '📅', label: language === 'el' ? 'Ημερομηνία' : 'Date' }
  ];

  // Show loading only briefly
  if (!formioAttempted) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">
            {language === 'el' ? 'Προετοιμασία...' : 'Preparing...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Components Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200" style={{ backgroundColor: '#004B87' }}>
          <h3 className="text-lg font-semibold text-white">
            🛠️ {language === 'el' ? 'Στοιχεία Φόρμας' : 'Form Components'}
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            {useFormio 
              ? (language === 'el' ? 'Professional Builder' : 'Professional Builder')
              : (language === 'el' ? 'Απλό Builder' : 'Simple Builder')
            }
          </p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {componentTypes.map((component) => (
              <button
                key={component.type}
                onClick={() => addComponent(component.type)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center space-x-3"
              >
                <span className="text-2xl">{component.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{component.label}</div>
                  <div className="text-sm text-gray-500">
                    {language === 'el' ? 'Κλικ για προσθήκη' : 'Click to add'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Builder Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'el' ? 'Προεπισκόπηση Φόρμας' : 'Form Preview'}
            </h3>
            <div className="text-sm text-gray-500">
              {currentForm.components?.length || 0} {language === 'el' ? 'στοιχεία' : 'components'}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {currentForm.components && currentForm.components.length > 0 ? (
            <div className="space-y-4">
              {currentForm.components.map((component: any) => (
                <div
                  key={component.id}
                  className="group relative p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  {/* Component Controls */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      onClick={() => setSelectedComponent(component)}
                      className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      title={language === 'el' ? 'Επεξεργασία' : 'Edit'}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeComponent(component.id)}
                      className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      title={language === 'el' ? 'Διαγραφή' : 'Delete'}
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Component Preview */}
                  <div className="pr-16">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {component.label}
                      {component.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {component.type === 'textfield' && (
                      <input
                        type="text"
                        placeholder={component.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}

                    {component.type === 'textarea' && (
                      <textarea
                        placeholder={component.placeholder}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                        disabled
                      />
                    )}

                    {component.type === 'number' && (
                      <input
                        type="number"
                        placeholder={component.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}

                    {component.type === 'email' && (
                      <input
                        type="email"
                        placeholder={component.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}

                    {component.type === 'select' && (
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled>
                        <option>{language === 'el' ? 'Επιλέξτε...' : 'Select...'}</option>
                      </select>
                    )}

                    {component.type === 'radio' && (
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="radio" name={component.key} className="mr-2" disabled />
                          <span>{language === 'el' ? 'Επιλογή 1' : 'Option 1'}</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name={component.key} className="mr-2" disabled />
                          <span>{language === 'el' ? 'Επιλογή 2' : 'Option 2'}</span>
                        </label>
                      </div>
                    )}

                    {component.type === 'checkbox' && (
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" disabled />
                        <span>{component.label}</span>
                      </label>
                    )}

                    {component.type === 'datetime' && (
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg">
                {language === 'el' 
                  ? 'Προσθέστε στοιχεία από την αριστερή πλευρά για να ξεκινήσετε' 
                  : 'Add components from the left sidebar to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Component Editor Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {language === 'el' ? 'Επεξεργασία Στοιχείου' : 'Edit Component'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Ετικέτα' : 'Label'}
                </label>
                <input
                  type="text"
                  value={selectedComponent.label}
                  onChange={(e) => setSelectedComponent({ ...selectedComponent, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Κείμενο υπόδειξης' : 'Placeholder'}
                </label>
                <input
                  type="text"
                  value={selectedComponent.placeholder || ''}
                  onChange={(e) => setSelectedComponent({ ...selectedComponent, placeholder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={selectedComponent.required}
                  onChange={(e) => setSelectedComponent({ ...selectedComponent, required: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="required" className="text-sm font-medium text-gray-700">
                  {language === 'el' ? 'Υποχρεωτικό πεδίο' : 'Required field'}
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedComponent(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {language === 'el' ? 'Ακύρωση' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  updateComponent(selectedComponent.id, selectedComponent);
                  setSelectedComponent(null);
                }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#004B87' }}
              >
                {language === 'el' ? 'Αποθήκευση' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HybridFormBuilder;