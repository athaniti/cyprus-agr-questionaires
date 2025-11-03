import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface FormBuilderComponentProps {
  initialForm?: any;
  onSave: (form: any) => void;
  onCancel: () => void;
  language: 'el' | 'en';
  mode: 'create' | 'edit';
  questionnaireName?: string;
}

interface FormComponent {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  columns?: TableColumn[];
  rows?: number;
}

interface TableColumn {
  label: string;
  type: 'textfield' | 'number' | 'select';
  required: boolean;
  options?: string[];
}

export function FormBuilderComponent({
  initialForm,
  onSave,
  onCancel,
  language,
  mode,
  questionnaireName
}: FormBuilderComponentProps) {
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  const { user } = useAuth();

  // Load schema when editing an existing questionnaire
  useEffect(() => {
    const loadSchema = async () => {
      console.log('LoadSchema called with:', { mode, initialForm: initialForm?.id });
      
      if (mode === 'edit' && initialForm?.id) {
        setIsLoadingSchema(true);
        try {
          console.log('Calling getQuestionnaireSchema for ID:', initialForm.id);
          const schemaData = await apiService.getQuestionnaireSchema(initialForm.id);
          console.log('Loaded schema data:', schemaData);
          console.log('Schema structure:', schemaData.schema);
          
          // Parse the schema and extract components
          if (schemaData.schema && schemaData.schema.components) {
            console.log('Found schema components:', schemaData.schema.components);
            
            // Filter out submit buttons and convert components
            const formComponents = schemaData.schema.components.filter((comp: any) => comp.type !== 'button');
            console.log('Filtered components (no buttons):', formComponents);
            
            const loadedComponents = formComponents.map((comp: any) => {
              console.log('Converting component:', comp);
              return {
                id: comp.key || comp.id || `component_${Date.now()}_${Math.random()}`,
                type: comp.type,
                label: comp.label || 'Untitled',
                required: comp.validate?.required || false,
                options: comp.data?.values ? comp.data.values.map((v: any) => v.label || v.value) : 
                         comp.values ? comp.values.map((v: any) => v.label || v.value) : undefined,
                columns: comp.components ? comp.components.map((col: any) => ({
                  label: col.label,
                  type: col.type,
                  required: col.validate?.required || false,
                  options: col.data?.values ? col.data.values.map((v: any) => v.label || v.value) : undefined
                })) : undefined,
                rows: comp.rows
              };
            });
            console.log('Converted components:', loadedComponents);
            setComponents(loadedComponents);
          } else if (initialForm.components) {
            // Fallback to initialForm components if available
            setComponents(initialForm.components);
          }
        } catch (error) {
          console.error('Failed to load schema:', error);
          // Fallback to initialForm components if API fails
          if (initialForm.components) {
            setComponents(initialForm.components);
          }
        } finally {
          setIsLoadingSchema(false);
        }
      } else if (initialForm?.components) {
        // For create mode or when components are already provided
        setComponents(initialForm.components);
      }
    };

    loadSchema();
  }, [mode, initialForm]);

  const translations = {
    el: {
      title: mode === 'create' ? 'Δημιουργία Ερωτηματολογίου' : 'Επεξεργασία Ερωτηματολογίου',
      subtitle: 'Προσθέστε ερωτήσεις και διαμορφώστε το ερωτηματολόγιό σας',
      save: 'Αποθήκευση',
      cancel: 'Ακύρωση',
      saving: 'Αποθηκεύεται...',
      addQuestion: 'Προσθήκη Ερώτησης',
      questionTypes: 'Τύποι Ερωτήσεων',
      textField: 'Κείμενο',
      textArea: 'Πολλαπλές Γραμμές',
      number: 'Αριθμός',
      select: 'Επιλογή',
      radio: 'Πολλαπλή Επιλογή',
      checkbox: 'Τετραγωνάκι',
      email: 'Email',
      date: 'Ημερομηνία',
      table: 'Πίνακας',
      label: 'Ετικέτα',
      required: 'Υποχρεωτικό',
      options: 'Επιλογές (μία ανά γραμμή)',
      preview: 'Προεπισκόπηση',
      editQuestion: 'Επεξεργασία Ερώτησης',
      deleteQuestion: 'Διαγραφή'
    },
    en: {
      title: mode === 'create' ? 'Create Questionnaire' : 'Edit Questionnaire',
      subtitle: 'Add questions and configure your questionnaire',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving...',
      addQuestion: 'Add Question',
      questionTypes: 'Question Types',
      textField: 'Text Field',
      textArea: 'Text Area',
      number: 'Number',
      select: 'Select',
      radio: 'Radio',
      checkbox: 'Checkbox',
      email: 'Email',
      date: 'Date',
      table: 'Table',
      label: 'Label',
      required: 'Required',
      options: 'Options (one per line)',
      preview: 'Preview',
      editQuestion: 'Edit Question',
      deleteQuestion: 'Delete'
    }
  };

  const t = translations[language];

  const questionTypes = [
    { type: 'textfield', label: t.textField, icon: '📝' },
    { type: 'textarea', label: t.textArea, icon: '📄' },
    { type: 'number', label: t.number, icon: '🔢' },
    { type: 'select', label: t.select, icon: '📋' },
    { type: 'radio', label: t.radio, icon: '⚪' },
    { type: 'checkbox', label: t.checkbox, icon: '☑️' },
    { type: 'email', label: t.email, icon: '📧' },
    { type: 'date', label: t.date, icon: '📅' },
    { type: 'table', label: t.table, icon: '📊' }
  ];

  const addQuestion = (type: string) => {
    const newQuestion: FormComponent = {
      id: `question_${Date.now()}`,
      type,
      label: `${t.label} ${components.length + 1}`,
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
      columns: type === 'table' ? [
        { label: 'Column 1', type: 'textfield', required: false },
        { label: 'Column 2', type: 'textfield', required: false }
      ] : undefined,
      rows: type === 'table' ? 3 : undefined
    };
    setComponents([...components, newQuestion]);
    setSelectedComponent(newQuestion);
  };

  const updateQuestion = (id: string, updates: Partial<FormComponent>) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, ...updates });
    }
  };

  const deleteQuestion = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const handleSave = async () => {
    console.log('HandleSave called with components:', components);
    console.log('Mode:', mode, 'InitialForm:', initialForm);
    
    setIsLoading(true);
    try {
      // Convert components to FormIO schema format
      const formIOComponents = components.map(component => {
        const baseComponent: any = {
          key: component.id,
          type: component.type,
          label: component.label,
          input: component.type !== 'panel',
          tableView: true
        };

        // Add validation if required
        if (component.required) {
          baseComponent.validate = { required: true };
        }

        // Handle different component types
        switch (component.type) {
          case 'select':
          case 'radio':
          case 'checkbox':
            if (component.options && component.options.length > 0) {
              baseComponent.data = {
                values: component.options.map(option => ({
                  label: option,
                  value: option.toLowerCase().replace(/\s+/g, '_')
                }))
              };
            }
            if (component.type === 'select') {
              baseComponent.widget = 'choicesjs';
            }
            if (component.type === 'radio') {
              baseComponent.values = component.options?.map(option => ({
                label: option,
                value: option.toLowerCase().replace(/\s+/g, '_')
              })) || [];
            }
            break;
          case 'table':
            if (component.columns) {
              baseComponent.components = component.columns.map(col => ({
                key: col.label.toLowerCase().replace(/\s+/g, '_'),
                type: col.type,
                label: col.label,
                input: true,
                tableView: true,
                validate: col.required ? { required: true } : {}
              }));
            }
            baseComponent.rows = component.rows || 3;
            break;
          case 'textarea':
            baseComponent.autoExpand = false;
            break;
          case 'number':
            baseComponent.mask = false;
            baseComponent.delimiter = false;
            baseComponent.requireDecimal = false;
            baseComponent.inputFormat = 'plain';
            break;
          case 'email':
            baseComponent.validate = {
              ...baseComponent.validate,
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            };
            break;
        }

        return baseComponent;
      });

      // Add submit button
      formIOComponents.push({
        type: 'button',
        label: language === 'el' ? 'Υποβολή' : 'Submit',
        key: 'submit',
        disableOnInvalid: true,
        input: true,
        tableView: false
      });

      const formIOSchema = {
        display: 'form',
        components: formIOComponents
      };

      console.log('Generated FormIO Schema:', formIOSchema);

      if (mode === 'create') {
        const result = await apiService.createQuestionnaireWithSchema({
          name: questionnaireName || 'Untitled Questionnaire',
          description: `Questionnaire created with ${components.length} questions`,
          category: 'general',
          schema: formIOSchema,
          targetResponses: 100,
          createdBy: user?.id || '00000000-0000-0000-0000-000000000001' // Use actual user ID or fallback
        });
        console.log('Questionnaire created:', result);
        await onSave(result);
      } else {
        // Edit mode - update schema only
        const result = await apiService.updateQuestionnaireSchema(
          initialForm?.id || 'temp',
          formIOSchema
        );
        console.log('Schema updated:', result);
        await onSave({
          ...initialForm,
          schema: formIOSchema,
          components: components,
          updatedAt: result.updatedAt
        });
      }
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την αποθήκευση!' : 'Error saving questionnaire!');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = (component: FormComponent) => {
    switch (component.type) {
      case 'textfield':
        return <input type="text" placeholder={component.label} className="w-full p-2 border rounded" disabled />;
      case 'textarea':
        return <textarea placeholder={component.label} className="w-full p-2 border rounded" rows={3} disabled />;
      case 'number':
        return <input type="number" placeholder={component.label} className="w-full p-2 border rounded" disabled />;
      case 'email':
        return <input type="email" placeholder={component.label} className="w-full p-2 border rounded" disabled />;
      case 'date':
        return <input type="date" className="w-full p-2 border rounded" disabled />;
      case 'select':
        return (
          <select className="w-full p-2 border rounded" disabled>
            <option>{component.label}</option>
            {component.options?.map((opt, i) => <option key={i}>{opt}</option>)}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {component.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input type="radio" name={component.id} disabled />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {component.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input type="checkbox" disabled />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded">
              <thead className="bg-gray-50">
                <tr>
                  {component.columns?.map((col, i) => (
                    <th key={i} className="p-2 text-left border-b border-gray-300 text-sm font-medium">
                      {col.label}
                      {col.required && <span className="text-red-500 ml-1">*</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: component.rows || 3 }, (_, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    {component.columns?.map((col, j) => (
                      <td key={j} className="p-2">
                        {col.type === 'textfield' && (
                          <input type="text" className="w-full p-1 border rounded text-sm" disabled />
                        )}
                        {col.type === 'number' && (
                          <input type="number" className="w-full p-1 border rounded text-sm" disabled />
                        )}
                        {col.type === 'select' && (
                          <select className="w-full p-1 border rounded text-sm" disabled>
                            <option>Select...</option>
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
        return <div className="p-2 border rounded bg-gray-100">{component.label}</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full h-full max-w-7xl max-h-[95vh] m-4 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{t.subtitle}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isLoading || isLoadingSchema}
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || isLoadingSchema}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#004B87' }}
            >
              {isLoading ? t.saving : t.save}
            </button>
          </div>
        </div>

        {/* Loading Schema Indicator */}
        {isLoadingSchema && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'el' ? 'Φόρτωση σχήματος...' : 'Loading schema...'}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoadingSchema && (
          <div className="flex-1 overflow-hidden flex">
            {/* Left Panel - Question Types */}
            <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">{t.questionTypes}</h3>
            <div className="space-y-2">
              {questionTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => addQuestion(type.type)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center Panel - Form Preview */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">{t.preview}</h3>
            <div className="space-y-4 max-w-2xl">
              {components.map((component) => (
                <div
                  key={component.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedComponent?.id === component.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedComponent(component)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium text-gray-900">
                      {component.label}
                      {component.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(component.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      {t.deleteQuestion}
                    </button>
                  </div>
                  {renderPreview(component)}
                </div>
              ))}
              {components.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {language === 'el' 
                    ? 'Προσθέστε ερωτήσεις από την αριστερή στήλη' 
                    : 'Add questions from the left panel'}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Question Editor */}
          {selectedComponent && (
            <div className="w-1/4 border-l border-gray-200 p-4 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-4">{t.editQuestion}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.label}
                  </label>
                  <input
                    type="text"
                    value={selectedComponent.label}
                    onChange={(e) => updateQuestion(selectedComponent.id, { label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedComponent.required}
                      onChange={(e) => updateQuestion(selectedComponent.id, { required: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-gray-700">{t.required}</span>
                  </label>
                </div>

                {selectedComponent.options && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.options}
                    </label>
                    <textarea
                      value={selectedComponent.options.join('\n')}
                      onChange={(e) => updateQuestion(selectedComponent.id, { 
                        options: e.target.value.split('\n').filter(opt => opt.trim()) 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                )}

                {selectedComponent.type === 'table' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'el' ? 'Αριθμός Γραμμών' : 'Number of Rows'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={selectedComponent.rows || 3}
                        onChange={(e) => updateQuestion(selectedComponent.id, { rows: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'el' ? 'Στήλες' : 'Columns'}
                      </label>
                      <div className="space-y-2">
                        {selectedComponent.columns?.map((column, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Column {index + 1}</span>
                              <button
                                onClick={() => {
                                  const newColumns = selectedComponent.columns?.filter((_, i) => i !== index) || [];
                                  updateQuestion(selectedComponent.id, { columns: newColumns });
                                }}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <input
                              type="text"
                              placeholder="Column Label"
                              value={column.label}
                              onChange={(e) => {
                                const newColumns = [...(selectedComponent.columns || [])];
                                newColumns[index] = { ...column, label: e.target.value };
                                updateQuestion(selectedComponent.id, { columns: newColumns });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            
                            <select
                              value={column.type}
                              onChange={(e) => {
                                const newColumns = [...(selectedComponent.columns || [])];
                                newColumns[index] = { ...column, type: e.target.value as any };
                                updateQuestion(selectedComponent.id, { columns: newColumns });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="textfield">Text</option>
                              <option value="number">Number</option>
                              <option value="select">Select</option>
                            </select>
                            
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={column.required}
                                onChange={(e) => {
                                  const newColumns = [...(selectedComponent.columns || [])];
                                  newColumns[index] = { ...column, required: e.target.checked };
                                  updateQuestion(selectedComponent.id, { columns: newColumns });
                                }}
                              />
                              <span className="text-sm">Required</span>
                            </label>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => {
                            const newColumns = [
                              ...(selectedComponent.columns || []),
                              { label: `Column ${(selectedComponent.columns?.length || 0) + 1}`, type: 'textfield' as const, required: false }
                            ];
                            updateQuestion(selectedComponent.id, { columns: newColumns });
                          }}
                          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors"
                        >
                          + Add Column
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}