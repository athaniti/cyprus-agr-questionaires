import React, { useEffect, useRef, useState } from 'react';

interface FormioBuilderProps {
  form?: any;
  onFormChange?: (formSchema: any) => void;
  language?: 'el' | 'en';
}

const FormioBuilder: React.FC<FormioBuilderProps> = ({ 
  form = { components: [] }, 
  onFormChange,
  language = 'el' 
}) => {
  const builderRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [builder, setBuilder] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const initFormio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🚀 Initializing Form.io Builder...');

        // Dynamic import του formiojs
        const { FormBuilder } = await import('formiojs');
        
        if (!mounted) return;

        console.log('✅ FormBuilder imported successfully');

        if (builderRef.current) {
          // Καθαρίζουμε το container
          builderRef.current.innerHTML = '';

          console.log('🏗️ Creating FormBuilder instance...');

          // Δημιουργούμε τον builder
          const formBuilder = new FormBuilder(
            builderRef.current,
            form,
            {
              builder: {
                basic: {
                  title: language === 'el' ? 'Βασικά Στοιχεία' : 'Basic Components',
                  weight: 0,
                  components: {
                    textfield: {
                      title: language === 'el' ? 'Πεδίο Κειμένου' : 'Text Field'
                    },
                    textarea: {
                      title: language === 'el' ? 'Περιοχή Κειμένου' : 'Text Area'
                    },
                    number: {
                      title: language === 'el' ? 'Αριθμός' : 'Number'
                    },
                    email: {
                      title: language === 'el' ? 'Email' : 'Email'
                    },
                    select: {
                      title: language === 'el' ? 'Επιλογή' : 'Select'
                    },
                    radio: {
                      title: language === 'el' ? 'Radio Buttons' : 'Radio'
                    },
                    checkbox: {
                      title: language === 'el' ? 'Checkboxes' : 'Checkbox'
                    },
                    button: {
                      title: language === 'el' ? 'Κουμπί' : 'Button'
                    },
                    datetime: {
                      title: language === 'el' ? 'Ημερομηνία/Ώρα' : 'Date/Time'
                    }
                  }
                },
                advanced: {
                  title: language === 'el' ? 'Προχωρημένα' : 'Advanced',
                  weight: 10,
                  components: {
                    phoneNumber: {
                      title: language === 'el' ? 'Τηλέφωνο' : 'Phone Number'
                    },
                    url: {
                      title: language === 'el' ? 'URL' : 'URL'
                    },
                    fieldset: {
                      title: language === 'el' ? 'Ομάδα Πεδίων' : 'Fieldset'
                    },
                    container: {
                      title: language === 'el' ? 'Περιέκτης' : 'Container'
                    },
                    htmlelement: {
                      title: language === 'el' ? 'HTML Στοιχείο' : 'HTML Element'
                    },
                    content: {
                      title: language === 'el' ? 'Περιεχόμενο' : 'Content'
                    },
                    well: {
                      title: language === 'el' ? 'Πλαίσιο' : 'Well'
                    },
                    columns: {
                      title: language === 'el' ? 'Στήλες' : 'Columns'
                    },
                    table: {
                      title: language === 'el' ? 'Πίνακας' : 'Table'
                    }
                  }
                },
                data: {
                  title: language === 'el' ? 'Δεδομένα' : 'Data',
                  weight: 20,
                  components: {
                    hidden: {
                      title: language === 'el' ? 'Κρυφό Πεδίο' : 'Hidden'
                    },
                    tags: {
                      title: language === 'el' ? 'Ετικέτες' : 'Tags'
                    }
                  }
                }
              },
              noDefaultSubmitButton: true,
              sidebar: {
                scroll: true,
                width: '300px'
              },
              theme: 'bootstrap4'
            }
          );

          console.log('✅ FormBuilder instance created');

          // Event listener για αλλαγές
          formBuilder.on('change', (changedForm: any) => {
            console.log('📝 Form schema changed:', changedForm);
            if (onFormChange) {
              onFormChange(changedForm);
            }
          });

          // Περιμένουμε να γίνει ready
          if (formBuilder.ready) {
            await formBuilder.ready;
            console.log('🎉 FormBuilder is ready!');
          }

          setBuilder(formBuilder);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('❌ Form.io initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load Form.io');
          setIsLoading(false);
        }
      }
    };

    initFormio();

    return () => {
      mounted = false;
      if (builder) {
        try {
          builder.destroy();
          console.log('🗑️ FormBuilder destroyed');
        } catch (e) {
          console.warn('Error destroying builder:', e);
        }
      }
    };
  }, [form, onFormChange, language]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">
            {language === 'el' ? 'Φόρτωση Form.io Builder...' : 'Loading Form.io Builder...'}
          </p>
          <p className="text-sm text-gray-500">
            {language === 'el' ? 'Χρήση formiojs v4.21.7' : 'Using formiojs v4.21.7'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <h3 className="text-red-800 font-semibold mb-2">
          {language === 'el' ? 'Σφάλμα φόρτωσης Form.io' : 'Form.io Loading Error'}
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {language === 'el' ? 'Ανανέωση Σελίδας' : 'Refresh Page'}
          </button>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {language === 'el' ? 'Δοκιμή Ξανά' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Form.io Builder Container */}
      <div 
        ref={builderRef} 
        className="h-full w-full bg-white"
        style={{ minHeight: '600px' }}
      />
      
      {/* Cyprus Agriculture Styling */}
      <style>{`
        /* Cyprus Agriculture Form.io Theme */
        .formio-builder {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }
        
        .formio-builder .formio-group-header {
          background-color: #004B87 !important;
          color: white !important;
          font-weight: 600 !important;
        }
        
        .formio-builder .formio-group-header:hover {
          background-color: #003a6b !important;
        }
        
        .formio-builder .btn-primary {
          background-color: #004B87 !important;
          border-color: #004B87 !important;
        }
        
        .formio-builder .btn-primary:hover {
          background-color: #003a6b !important;
          border-color: #003a6b !important;
        }
        
        .formio-builder .form-control:focus {
          border-color: #004B87 !important;
          box-shadow: 0 0 0 0.2rem rgba(0,75,135,0.25) !important;
        }
        
        .formio-builder .formio-component-list .formio-component:hover {
          border-color: #004B87 !important;
          background-color: #f0f9ff !important;
        }
        
        .formio-builder .formio-builder-sidebar {
          border-right: 1px solid #e5e7eb !important;
        }
        
        .formio-builder .formio-builder-form {
          background-color: #fafafa !important;
        }
        
        /* Header styling */
        .formio-builder .formio-group-header::before {
          content: "🏛️ ";
          margin-right: 0.5rem;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .formio-builder {
            flex-direction: column !important;
          }
          
          .formio-builder .formio-builder-sidebar {
            width: 100% !important;
            max-height: 300px !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FormioBuilder;