import React, { useState, useEffect, useRef } from 'react';

interface FormioFormBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const FormioFormBuilder: React.FC<FormioFormBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const [formBuilder, setFormBuilder] = useState<any>(null);
  const builderRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('Initializing...');

  useEffect(() => {
    if (builderRef.current && !formBuilder) {
      setIsLoading(true);
      setError(null);
      setLoadingStep('Loading Form.io CSS...');

      // Load Form.io CSS
      const loadCSS = () => {
        // Check if CSS is already loaded
        if (!document.querySelector('link[href*="formio"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/formiojs@latest/dist/formio.full.min.css';
          document.head.appendChild(link);
        }
      };

      setLoadingStep('Loading Form.io Library...');

      // Dynamically import and initialize Form.io builder
      import('formiojs').then((FormioModule) => {
        setLoadingStep('Initializing FormBuilder...');
        loadCSS();
        
        console.log('Form.io loaded:', FormioModule);
        
        // Use the default export or Formio
        const Formio = FormioModule.default || FormioModule;
        
        if (!Formio.FormBuilder) {
          throw new Error('FormBuilder not found in Formio object');
        }

        const builder = new Formio.FormBuilder(builderRef.current, form, {
          builder: {
            basic: {
              title: language === 'el' ? 'Βασικά Στοιχεία' : 'Basic Components',
              weight: 0,
              components: {
                textfield: true,
                textarea: true,
                number: true,
                email: true,
                select: true,
                radio: true,
                checkbox: true,
                datetime: true,
                button: true
              }
            },
            advanced: {
              title: language === 'el' ? 'Προχωρημένα' : 'Advanced',
              weight: 10,
              components: {
                fieldset: true,
                container: true,
                htmlelement: true,
                content: true,
                well: true,
                columns: true,
                table: true
              }
            },
            data: {
              title: language === 'el' ? 'Δεδομένα' : 'Data',
              weight: 20,
              components: {
                hidden: true,
                tags: true
              }
            }
          },
          noDefaultSubmitButton: true
        });

        // Handle form changes
        builder.on('change', (changedForm: any) => {
          console.log('Form changed:', changedForm);
          if (onFormChange) {
            onFormChange(changedForm);
          }
        }, true);

        // Wait for builder to be ready
        if (builder.ready) {
          builder.ready.then(() => {
            console.log('FormBuilder is ready!');
            setFormBuilder(builder);
            setIsLoading(false);
            setLoadingStep('Ready!');
          });
        } else {
          // Fallback if ready doesn't exist
          setTimeout(() => {
            setFormBuilder(builder);
            setIsLoading(false);
            setLoadingStep('Ready!');
          }, 1000);
        }
      }).catch((error) => {
        console.error('Failed to load Form.io:', error);
        setError(`Failed to load Form.io: ${error.message}`);
        setIsLoading(false);
        setLoadingStep('Error occurred');
      });
    }

    return () => {
      if (formBuilder) {
        try {
          formBuilder.destroy();
        } catch (e) {
          console.warn('Error destroying form builder:', e);
        }
      }
    };
  }, [builderRef, form, onFormChange, language, formBuilder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">
            {language === 'el' ? 'Φόρτωση Form Builder...' : 'Loading Form Builder...'}
          </p>
          <p className="text-sm text-gray-500">{loadingStep}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold mb-2">
              {language === 'el' ? 'Σφάλμα φόρτωσης Form.io' : 'Form.io Loading Error'}
            </p>
            <p className="text-sm mb-4">{error}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800 mb-4">
              {language === 'el' 
                ? 'Χρησιμοποιείται εναλλακτικό FormBuilder' 
                : 'Using Alternative FormBuilder'
              }
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { type: 'textfield', label: language === 'el' ? 'Κείμενο' : 'Text', icon: '📝' },
                { type: 'textarea', label: language === 'el' ? 'Περιοχή Κειμένου' : 'Textarea', icon: '📄' },
                { type: 'number', label: language === 'el' ? 'Αριθμός' : 'Number', icon: '🔢' },
                { type: 'email', label: 'Email', icon: '📧' },
                { type: 'select', label: language === 'el' ? 'Επιλογή' : 'Select', icon: '📋' },
                { type: 'radio', label: 'Radio', icon: '🔘' },
                { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
                { type: 'datetime', label: language === 'el' ? 'Ημερομηνία' : 'Date', icon: '📅' }
              ].map((component) => (
                <div 
                  key={component.type}
                  className="bg-white border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    if (onFormChange) {
                      const newComponent = {
                        type: component.type,
                        key: `${component.type}_${Date.now()}`,
                        label: component.label,
                        input: true
                      };
                      onFormChange({
                        components: [...(form.components || []), newComponent]
                      });
                    }
                  }}
                >
                  <div className="text-2xl mb-2">{component.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{component.label}</div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-600 mt-4">
              {language === 'el' 
                ? 'Κλικ στα στοιχεία για προσθήκη' 
                : 'Click components to add them'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="formio-builder-container">
      <style>{`
        .formio-builder-container {
          min-height: 600px;
          width: 100%;
        }
        
        .formio-builder-container .formio-builder {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          min-height: 600px;
        }
        
        .formio-builder-container .formio-builder-sidebar {
          background: #f9fafb !important;
          border-right: 1px solid #e5e7eb !important;
          min-width: 250px !important;
        }
        
        .formio-builder-container .formio-builder-sidebar .formio-group-header {
          background: #004B87 !important;
          color: white !important;
          padding: 8px 12px !important;
          font-weight: 600 !important;
        }
        
        .formio-builder-container .formio-component {
          border: 1px solid #e5e7eb !important;
          border-radius: 4px !important;
          margin: 4px !important;
          padding: 8px !important;
          background: white !important;
          cursor: pointer !important;
        }
        
        .formio-builder-container .formio-component:hover {
          border-color: #004B87 !important;
          background: #f0f9ff !important;
        }
        
        .formio-builder-container .formio-builder-form {
          min-height: 400px;
          background: white;
          border-left: 1px solid #e5e7eb;
          padding: 20px;
        }
      `}</style>
      
      <div 
        ref={builderRef}
        style={{ minHeight: '600px', width: '100%' }}
      />
    </div>
  );
};

export default FormioFormBuilder;