import React, { useState } from 'react';

// Types για τα form components
interface FormComponent {
  id: string;
  type: string;
  label: string;
  icon: string;
  properties: Record<string, any>;
}

interface FormField extends FormComponent {
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

// Predefined components για Cyprus Agriculture
const FORM_COMPONENTS: FormComponent[] = [
  {
    id: 'textfield',
    type: 'textfield',
    label: 'Πεδίο Κειμένου',
    icon: '📝',
    properties: { placeholder: 'Εισάγετε κείμενο...' }
  },
  {
    id: 'textarea',
    type: 'textarea',
    label: 'Περιοχή Κειμένου',
    icon: '📄',
    properties: { rows: 4, placeholder: 'Εισάγετε μεγάλο κείμενο...' }
  },
  {
    id: 'number',
    type: 'number',
    label: 'Αριθμός',
    icon: '🔢',
    properties: { min: 0, step: 1 }
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    icon: '📧',
    properties: { placeholder: 'example@email.com' }
  },
  {
    id: 'phone',
    type: 'tel',
    label: 'Τηλέφωνο',
    icon: '📞',
    properties: { placeholder: '+357 XX XXX XXX' }
  },
  {
    id: 'date',
    type: 'date',
    label: 'Ημερομηνία',
    icon: '📅',
    properties: {}
  },
  {
    id: 'select',
    type: 'select',
    label: 'Επιλογή',
    icon: '📋',
    properties: { options: ['Επιλογή 1', 'Επιλογή 2', 'Επιλογή 3'] }
  },
  {
    id: 'radio',
    type: 'radio',
    label: 'Radio Buttons',
    icon: '🔘',
    properties: { options: ['Ναι', 'Όχι'] }
  },
  {
    id: 'checkbox',
    type: 'checkbox',
    label: 'Checkboxes',
    icon: '☑️',
    properties: { options: ['Επιλογή 1', 'Επιλογή 2'] }
  },
  {
    id: 'agriculture_area',
    type: 'number',
    label: 'Έκταση (στρέμματα)',
    icon: '🌾',
    properties: { min: 0, step: 0.1, placeholder: 'π.χ. 10.5' }
  },
  {
    id: 'crop_type',
    type: 'select',
    label: 'Είδος Καλλιέργειας',
    icon: '🌱',
    properties: { 
      options: [
        'Δημητριακά',
        'Κηπευτικά',
        'Δενδρώδεις καλλιέργειες',
        'Αμπέλια',
        'Ελαιόδεντρα',
        'Χορτολιβαδικές καλλιέργειες'
      ]
    }
  },
  {
    id: 'livestock_count',
    type: 'number',
    label: 'Αριθμός Ζώων',
    icon: '🐄',
    properties: { min: 0, step: 1 }
  },
  {
    id: 'table',
    type: 'table',
    label: 'Πίνακας Δεδομένων',
    icon: '📊',
    properties: { 
      columns: ['Περιγραφή', 'Ποσότητα', 'Μονάδα'],
      rows: 3,
      editable: true
    }
  },
  {
    id: 'crop_table',
    type: 'table',
    label: 'Πίνακας Καλλιεργειών',
    icon: '🌾',
    properties: { 
      columns: ['Καλλιέργεια', 'Έκταση (στρέμ.)', 'Παραγωγή (κιλά)', 'Ημ. Σποράς'],
      rows: 5,
      editable: true
    }
  },
  {
    id: 'livestock_table',
    type: 'table',
    label: 'Πίνακας Ζώων',
    icon: '🐄',
    properties: { 
      columns: ['Είδος Ζώου', 'Αριθμός', 'Ηλικία', 'Κατάσταση Υγείας'],
      rows: 4,
      editable: true
    }
  }
];

interface CustomFormBuilderProps {
  onFormChange?: (formData: any) => void;
  onFormSave?: (formData: any, title: string) => Promise<void>;
}

const CustomFormBuilder: React.FC<CustomFormBuilderProps> = ({ onFormChange, onFormSave }) => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [formTitle, setFormTitle] = useState('Νέο Ερωτηματολόγιο');
  const [formDescription, setFormDescription] = useState('Ερωτηματολόγιο για την Αγροτική Παραγωγή');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Add field to form
  const addField = (component: FormComponent) => {
    const newField: FormField = {
      ...component,
      id: `${component.id}_${Date.now()}`, // Unique ID
      required: false
    };
    
    const newFields = [...formFields, newField];
    setFormFields(newFields);
    
    if (onFormChange) {
      onFormChange({ fields: newFields });
    }
  };

  // Remove field
  const removeField = (fieldId: string) => {
    const newFields = formFields.filter(f => f.id !== fieldId);
    setFormFields(newFields);
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
    if (onFormChange) {
      onFormChange({ fields: newFields });
    }
  };

  // Move field up/down
  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = formFields.findIndex(f => f.id === fieldId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formFields.length) return;
    
    const newFields = [...formFields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];
    
    setFormFields(newFields);
    if (onFormChange) {
      onFormChange({ fields: newFields });
    }
  };

  // Update field properties
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const newFields = formFields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    );
    setFormFields(newFields);
    
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
    
    if (onFormChange) {
      onFormChange({ fields: newFields });
    }
  };

  // Clear form
  const clearForm = () => {
    setFormFields([]);
    setSelectedField(null);
    if (onFormChange) {
      onFormChange({ fields: [] });
    }
  };

  // Generate JSON
  const generateJSON = () => {
    const formData = {
      title: formTitle,
      description: formDescription,
      fields: formFields,
      created: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questionnaire.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save to database
  const saveToDatabase = async () => {
    if (formFields.length === 0) {
      setSaveStatus('❌ Προσθέστε τουλάχιστον ένα στοιχείο στη φόρμα');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    setIsSaving(true);
    setSaveStatus('💾 Αποθήκευση...');
    
    try {
      const formData = {
        title: formTitle,
        description: formDescription,
        fields: formFields,
        created: new Date().toISOString(),
        status: 'draft'
      };

      if (onFormSave) {
        await onFormSave(formData, formTitle);
      } else {
        // Fallback to API call
        const response = await fetch('http://localhost:5096/api/questionnaires', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formTitle,
            description: formDescription,
            schema: { fields: formFields },
            isActive: false
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      setSaveStatus('✅ Ερωτηματολόγιο αποθηκεύτηκε επιτυχώς!');
      setTimeout(() => setSaveStatus(null), 5000);
      
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('❌ Σφάλμα αποθήκευσης. Ελέγξτε τη σύνδεση με τη βάση.');
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full bg-white">
      <div className="flex h-full">
        {/* Components Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-[#004B87] text-white">
            <h3 className="font-semibold">🏛️ Cyprus Agriculture Form Builder</h3>
            <p className="text-sm text-blue-100 mt-1">Κλικ για προσθήκη στοιχείων</p>
          </div>
          
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <h4 className="font-medium text-gray-700 mb-3">Βασικά Στοιχεία</h4>
            {FORM_COMPONENTS.slice(0, 9).map((component) => (
              <button
                key={component.id}
                onClick={() => addField(component)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-[#004B87] hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{component.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{component.label}</span>
                </div>
              </button>
            ))}
            
            <h4 className="font-medium text-gray-700 mb-3 mt-6">Πίνακες & Δεδομένα</h4>
            {FORM_COMPONENTS.slice(9, 13).map((component) => (
              <button
                key={component.id}
                onClick={() => addField(component)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-[#004B87] hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{component.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{component.label}</span>
                </div>
              </button>
            ))}
            
            <h4 className="font-medium text-gray-700 mb-3 mt-6">Εξειδικευμένα Αγροτικά</h4>
            {FORM_COMPONENTS.slice(13).map((component) => (
              <button
                key={component.id}
                onClick={() => addField(component)}
                className="w-full p-3 bg-green-50 border border-green-200 rounded-lg hover:border-green-500 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{component.icon}</span>
                  <span className="text-sm font-medium text-green-800">{component.label}</span>
                </div>
              </button>
            ))}
            
            {/* Actions */}
            <div className="pt-4 mt-6 border-t border-gray-200 space-y-2">
              <button
                onClick={saveToDatabase}
                disabled={isSaving || formFields.length === 0}
                className="w-full p-2 bg-[#004B87] text-white rounded hover:bg-blue-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? '💾 Αποθήκευση...' : '💾 Αποθήκευση στη Βάση'}
              </button>
              <button
                onClick={clearForm}
                className="w-full p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                disabled={formFields.length === 0}
              >
                🗑️ Καθαρισμός Φόρμας
              </button>
              <button
                onClick={generateJSON}
                className="w-full p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                disabled={formFields.length === 0}
              >
                📥 Λήψη JSON
              </button>
            </div>
          </div>
        </div>

        {/* Form Builder Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">📋 Προεπισκόπηση Φόρμας</h3>
                <p className="text-sm text-gray-600">
                  {formFields.length} στοιχεία στη φόρμα
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Cyprus Agriculture Ministry
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {formFields.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg font-medium mb-2 text-gray-700">Η φόρμα σας είναι κενή</p>
                <p className="text-sm text-gray-500">Κλικ σε στοιχεία από την αριστερή πλευρά για να ξεκινήσετε</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {/* Form Details Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#004B87]">
                      🇨🇾 Στοιχεία Ερωτηματολογίου
                    </h2>
                    {saveStatus && (
                      <div className="text-sm font-medium">
                        {saveStatus}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Τίτλος Ερωτηματολογίου
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="π.χ. Έρευνα Αγροτικής Παραγωγής 2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Περιγραφή
                      </label>
                      <input
                        type="text"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Σύντομη περιγραφή του ερωτηματολογίου"
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Υπουργείο Γεωργίας, Αγροτικής Ανάπτυξης και Περιβάλλοντος
                  </p>
                </div>
                
                <div className="space-y-4">
                  {formFields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`bg-white border rounded-lg p-4 transition-all ${
                        selectedField?.id === field.id 
                          ? 'border-[#004B87] ring-2 ring-blue-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedField(field)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{field.icon}</span>
                          <span className="font-medium text-gray-800">{field.label}</span>
                          {field.required && <span className="text-red-500">*</span>}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(field.id, 'up');
                            }}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ⬆️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(field.id, 'down');
                            }}
                            disabled={index === formFields.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ⬇️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      {/* Field Preview */}
                      <div className="mt-2">
                        {field.type === 'select' && (
                          <select className="w-full p-3 border border-gray-300 rounded-md bg-gray-50" disabled>
                            <option>Επιλέξτε...</option>
                            {field.properties.options?.map((option: string, i: number) => (
                              <option key={i} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                        {field.type === 'textarea' && (
                          <textarea 
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                            rows={field.properties.rows || 4}
                            placeholder={field.properties.placeholder}
                            readOnly
                          />
                        )}
                        {['textfield', 'number', 'email', 'tel', 'date'].includes(field.type) && (
                          <input
                            type={field.type === 'textfield' ? 'text' : field.type}
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                            placeholder={field.properties.placeholder}
                            readOnly
                          />
                        )}
                        {field.type === 'radio' && (
                          <div className="space-y-2">
                            {field.properties.options?.map((option: string, i: number) => (
                              <label key={i} className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name={field.id} disabled className="text-[#004B87]" />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {field.type === 'checkbox' && (
                          <div className="space-y-2">
                            {field.properties.options?.map((option: string, i: number) => (
                              <label key={i} className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" disabled className="text-[#004B87]" />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {field.type === 'table' && (
                          <div className="overflow-x-auto">
                            <table className="w-full border border-gray-300 bg-gray-50">
                              <thead>
                                <tr className="bg-[#004B87] text-white">
                                  {field.properties.columns?.map((column: string, i: number) => (
                                    <th key={i} className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {Array.from({ length: field.properties.rows || 3 }, (_, rowIndex) => (
                                  <tr key={rowIndex} className="hover:bg-gray-100">
                                    {field.properties.columns?.map((column: string, colIndex: number) => (
                                      <td key={colIndex} className="border border-gray-300 px-3 py-2">
                                        <input 
                                          type="text" 
                                          className="w-full bg-transparent border-none outline-none text-sm"
                                          placeholder={`${column} ${rowIndex + 1}`}
                                          readOnly
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="mt-2 text-xs text-gray-500 flex justify-between">
                              <span>📊 {field.properties.rows} γραμμές × {field.properties.columns?.length} στήλες</span>
                              <span>Κλικ για επεξεργασία στηλών</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Save Buttons */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={saveToDatabase}
                      disabled={isSaving || formFields.length === 0}
                      className="flex-1 bg-[#004B87] text-white py-3 px-6 rounded-md font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Αποθήκευση...
                        </>
                      ) : (
                        <>
                          � Αποθήκευση Ερωτηματολογίου
                        </>
                      )}
                    </button>
                    <button
                      onClick={generateJSON}
                      disabled={formFields.length === 0}
                      className="bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      📥 Εξαγωγή JSON
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Η αποθήκευση θα καταχωρήσει το ερωτηματολόγιο στη βάση δεδομένων
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedField && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 pb-4">
              <h3 className="font-semibold text-gray-800 mb-1">⚙️ Ιδιότητες Πεδίου</h3>
              <p className="text-xs text-gray-500">{selectedField.icon} {selectedField.type}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ετικέτα Πεδίου
                </label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedField.required || false}
                  onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                  id="required"
                  className="text-[#004B87]"
                />
                <label htmlFor="required" className="text-sm font-medium text-gray-700">
                  Υποχρεωτικό πεδίο
                </label>
              </div>
              
              {selectedField.properties.placeholder !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={selectedField.properties.placeholder || ''}
                    onChange={(e) => updateField(selectedField.id, { 
                      properties: { ...selectedField.properties, placeholder: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}
              
              {selectedField.properties.options && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Επιλογές (μία ανά γραμμή)
                  </label>
                  <textarea
                    value={selectedField.properties.options.join('\n')}
                    onChange={(e) => updateField(selectedField.id, {
                      properties: { ...selectedField.properties, options: e.target.value.split('\n').filter(o => o.trim()) }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={4}
                  />
                </div>
              )}
              
              {['number'].includes(selectedField.type) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ελάχιστη Τιμή
                    </label>
                    <input
                      type="number"
                      value={selectedField.properties.min || ''}
                      onChange={(e) => updateField(selectedField.id, {
                        properties: { ...selectedField.properties, min: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Βήμα
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedField.properties.step || ''}
                      onChange={(e) => updateField(selectedField.id, {
                        properties: { ...selectedField.properties, step: parseFloat(e.target.value) || 1 }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </>
              )}
              
              {selectedField.type === 'textarea' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Αριθμός Γραμμών
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={selectedField.properties.rows || 4}
                    onChange={(e) => updateField(selectedField.id, {
                      properties: { ...selectedField.properties, rows: parseInt(e.target.value) || 4 }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}
              
              {selectedField.type === 'table' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Στήλες Πίνακα (μία ανά γραμμή)
                    </label>
                    <textarea
                      value={selectedField.properties.columns?.join('\n') || ''}
                      onChange={(e) => updateField(selectedField.id, {
                        properties: { 
                          ...selectedField.properties, 
                          columns: e.target.value.split('\n').filter(c => c.trim()) 
                        }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      rows={4}
                      placeholder="Στήλη 1&#10;Στήλη 2&#10;Στήλη 3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Αριθμός Γραμμών
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={selectedField.properties.rows || 3}
                      onChange={(e) => updateField(selectedField.id, {
                        properties: { ...selectedField.properties, rows: parseInt(e.target.value) || 3 }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedField.properties.editable !== false}
                      onChange={(e) => updateField(selectedField.id, {
                        properties: { ...selectedField.properties, editable: e.target.checked }
                      })}
                      id="editable"
                      className="text-[#004B87]"
                    />
                    <label htmlFor="editable" className="text-sm font-medium text-gray-700">
                      Επεξεργάσιμος πίνακας
                    </label>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedField(null)}
                className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                ❌ Κλείσιμο Επεξεργασίας
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomFormBuilder;