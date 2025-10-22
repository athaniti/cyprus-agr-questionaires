import React, { useEffect, useRef, useState } from 'react';

interface FormioBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const FormioBuilder: React.FC<FormioBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const builderRef = useRef<HTMLDivElement>(null);
  const [formBuilder, setFormBuilder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Load Form.io CSS first
    const loadFormioCSS = () => {
      if (!document.querySelector('link[href*="formio"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/formiojs@4.21.7/dist/formio.full.min.css';
        link.onload = () => console.log('Form.io CSS loaded');
        link.onerror = () => console.error('Failed to load Form.io CSS');
        document.head.appendChild(link);
      }
    };

    const initializeFormBuilder = async () => {
      if (!builderRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        
        loadFormioCSS();

        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.warn('Form.io loading timeout, falling back to simple builder');
          setError('Loading timeout - using fallback builder');
          setIsLoading(false);
        }, 10000); // 10 second timeout

        console.log('Starting Form.io import...');

        // Import Form.io
        const FormioModule = await import('formiojs');
        const Formio = FormioModule.default || FormioModule;
        
        console.log('Form.io imported successfully:', Formio);

        // Check if FormBuilder is available
        if (!Formio.FormBuilder) {
          throw new Error('FormBuilder not available in Form.io module');
        }

        // Wait a bit for CSS to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Initializing FormBuilder...');

        // Initialize the builder
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

        console.log('FormBuilder initialized successfully:', builder);

        // Clear the timeout since we succeeded
        clearTimeout(timeoutId);

        // Listen for changes
        builder.on('change', (changedForm: any) => {
          console.log('Form changed:', changedForm);
          if (onFormChange) {
            onFormChange(changedForm);
          }
        }, false);

        setFormBuilder(builder);
        setIsLoading(false);

      } catch (err: any) {
        console.error('Failed to initialize Form.io builder:', err);
        clearTimeout(timeoutId);
        setError(err.message || 'Failed to load Form.io');
        setIsLoading(false);
      }
    };

    initializeFormBuilder();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (formBuilder) {
        try {
          formBuilder.destroy();
        } catch (e) {
          console.warn('Error destroying form builder:', e);
        }
      }
    };
  }, [form, onFormChange, language]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'el' ? 'Φόρτωση Form.io Builder...' : 'Loading Form.io Builder...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {language === 'el' ? 'Παρακαλώ περιμένετε...' : 'Please wait...'}
          </p>
          <button
            onClick={() => {
              console.log('Manual fallback triggered');
              setError('Manual fallback - using simple builder');
              setIsLoading(false);
            }}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {language === 'el' ? 'Χρήση Απλού Builder' : 'Use Simple Builder'}
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-semibold mb-2">
            {language === 'el' ? 'Σφάλμα φόρτωσης Form.io' : 'Form.io Loading Error'}
          </h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>

        {/* Fallback Simple FormBuilder */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-yellow-800 font-semibold mb-4">
            {language === 'el' ? 'Εναλλακτικό FormBuilder' : 'Alternative FormBuilder'}
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                className="bg-white border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
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
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <style>{`
        .formio-builder {
          height: 100%;
          border: none !important;
        }
        
        .formio-builder .formio-builder-sidebar {
          background: #f9fafb !important;
          border-right: 1px solid #e5e7eb !important;
        }
        
        .formio-builder .formio-builder-sidebar .formio-group-header {
          background: #004B87 !important;
          color: white !important;
          padding: 8px 12px !important;
          font-weight: 600 !important;
        }
        
        .formio-builder .formio-component {
          border: 1px solid #e5e7eb !important;
          border-radius: 4px !important;
          margin: 4px !important;
          padding: 8px !important;
          background: white !important;
          cursor: pointer !important;
        }
        
        .formio-builder .formio-component:hover {
          border-color: #004B87 !important;
          background: #f0f9ff !important;
        }
        
        .formio-builder .formio-builder-form {
          background: white;
          padding: 20px;
        }
      `}</style>
      
      <div 
        ref={builderRef}
        className="h-full w-full"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
};

export default FormioBuilder;