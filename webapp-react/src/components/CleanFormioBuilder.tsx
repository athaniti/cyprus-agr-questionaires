import React, { useEffect, useRef, useState } from 'react';

interface CleanFormioBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const CleanFormioBuilder: React.FC<CleanFormioBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
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

        console.log('🚀 Initializing clean Form.io builder without CDN dependencies...');

        // Dynamic import μόνο του formiojs v4
        const formioModule = await import('formiojs');
        
        if (!mounted) return;

        console.log('✅ formiojs v4 loaded:', formioModule);

        // Ελέγχουμε αν υπάρχει το FormBuilder
        if (!formioModule.FormBuilder) {
          throw new Error('FormBuilder not found in formiojs v4 package');
        }

        if (builderRef.current) {
          // Καθαρίζουμε το container
          builderRef.current.innerHTML = '';

          console.log('🏗️ Creating FormBuilder instance...');

          // Δημιουργούμε τον builder με v4 syntax και βελτιωμένες ρυθμίσεις
          const formBuilder = new formioModule.FormBuilder(
            builderRef.current,
            form,
            {
              builder: {
                basic: {
                  title: language === 'el' ? 'Βασικά Στοιχεία' : 'Basic Components',
                  weight: 0,
                  components: {
                    textfield: {
                      title: language === 'el' ? 'Πεδίο Κειμένου' : 'Text Field',
                      icon: 'fa fa-text'
                    },
                    textarea: {
                      title: language === 'el' ? 'Περιοχή Κειμένου' : 'Text Area',
                      icon: 'fa fa-text-area'
                    },
                    number: {
                      title: language === 'el' ? 'Αριθμός' : 'Number',
                      icon: 'fa fa-hash'
                    },
                    email: {
                      title: language === 'el' ? 'Email' : 'Email',
                      icon: 'fa fa-envelope'
                    },
                    select: {
                      title: language === 'el' ? 'Επιλογή' : 'Select',
                      icon: 'fa fa-list'
                    },
                    radio: {
                      title: language === 'el' ? 'Επιλογές Radio' : 'Radio',
                      icon: 'fa fa-dot-circle-o'
                    },
                    checkbox: {
                      title: language === 'el' ? 'Checkboxes' : 'Checkbox',
                      icon: 'fa fa-check-square-o'
                    },
                    button: {
                      title: language === 'el' ? 'Κουμπί' : 'Button',
                      icon: 'fa fa-button'
                    },
                    datetime: {
                      title: language === 'el' ? 'Ημερομηνία/Ώρα' : 'Date/Time',
                      icon: 'fa fa-calendar'
                    }
                  }
                },
                advanced: {
                  title: language === 'el' ? 'Προχωρημένα' : 'Advanced',
                  weight: 10,
                  components: {
                    phoneNumber: {
                      title: language === 'el' ? 'Τηλέφωνο' : 'Phone Number',
                      icon: 'fa fa-phone'
                    },
                    url: {
                      title: language === 'el' ? 'URL' : 'URL',
                      icon: 'fa fa-link'
                    },
                    fieldset: {
                      title: language === 'el' ? 'Ομάδα Πεδίων' : 'Fieldset',
                      icon: 'fa fa-folder-open'
                    },
                    container: {
                      title: language === 'el' ? 'Περιέκτης' : 'Container',
                      icon: 'fa fa-folder'
                    },
                    htmlelement: {
                      title: language === 'el' ? 'HTML Στοιχείο' : 'HTML Element',
                      icon: 'fa fa-code'
                    },
                    content: {
                      title: language === 'el' ? 'Περιεχόμενο' : 'Content',
                      icon: 'fa fa-file-text'
                    },
                    well: {
                      title: language === 'el' ? 'Πλαίσιο' : 'Well',
                      icon: 'fa fa-square'
                    },
                    columns: {
                      title: language === 'el' ? 'Στήλες' : 'Columns',
                      icon: 'fa fa-columns'
                    }
                  }
                },
                data: {
                  title: language === 'el' ? 'Δεδομένα' : 'Data',
                  weight: 20,
                  components: {
                    hidden: {
                      title: language === 'el' ? 'Κρυφό Πεδίο' : 'Hidden',
                      icon: 'fa fa-eye-slash'
                    },
                    tags: {
                      title: language === 'el' ? 'Ετικέτες' : 'Tags',
                      icon: 'fa fa-tags'
                    }
                  }
                }
              },
              noDefaultSubmitButton: true,
              sidebar: {
                scroll: true,
                width: '300px'
              },
              dragAndDrop: true,
              theme: 'bootstrap4'
            }
          );

          console.log('✅ FormBuilder instance created');

          // Event listener για αλλαγές (v4 syntax)
          formBuilder.on('change', (changedForm: any) => {
            console.log('📝 Form schema changed:', changedForm);
            if (onFormChange) {
              onFormChange(changedForm);
            }
          }, true);

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
            {language === 'el' ? 'Δοκιμή ξανά' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <style>{`
        /* Complete Form.io Builder Styling - No CDN Dependencies */
        
        /* Base FormBuilder Container */
        .formio-builder {
          background: white !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          min-height: 600px !important;
          border: 1px solid #e5e7eb !important;
          display: flex !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }
        
        /* Sidebar Styling */
        .formio-builder-sidebar,
        .formio-builder .formio-builder-sidebar {
          background: #f9fafb !important;
          border-right: 1px solid #e5e7eb !important;
          width: 280px !important;
          min-width: 280px !important;
          max-width: 280px !important;
          overflow-y: auto !important;
          display: block !important;
        }
        
        /* Component Groups */
        .formio-group,
        .formio-builder .formio-group {
          margin-bottom: 0.5rem !important;
          display: block !important;
        }
        
        .formio-group-header,
        .formio-builder .formio-group-header {
          background: #004B87 !important;
          color: white !important;
          padding: 0.75rem !important;
          font-weight: 600 !important;
          border: none !important;
          margin: 0 !important;
          cursor: pointer !important;
          width: 100% !important;
          text-align: left !important;
          font-size: 0.9rem !important;
        }
        
        .formio-group-header:hover,
        .formio-builder .formio-group-header:hover {
          background: #003a6b !important;
        }
        
        .formio-group-container,
        .formio-builder .formio-group-container {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-top: none !important;
          display: block !important;
        }
        
        /* Individual Components */
        .formio-component,
        .formio-builder .formio-component {
          border: none !important;
          border-bottom: 1px solid #f3f4f6 !important;
          margin: 0 !important;
          padding: 0.75rem !important;
          background: white !important;
          cursor: grab !important;
          display: block !important;
          transition: all 0.2s ease !important;
          font-size: 0.9rem !important;
        }
        
        .formio-component:last-child,
        .formio-builder .formio-component:last-child {
          border-bottom: none !important;
        }
        
        .formio-component:hover,
        .formio-builder .formio-component:hover {
          background: #f0f9ff !important;
          border-left: 3px solid #004B87 !important;
          padding-left: calc(0.75rem - 3px) !important;
          transform: translateX(2px) !important;
        }
        
        .formio-component:active,
        .formio-builder .formio-component:active {
          cursor: grabbing !important;
        }
        
        /* Component List */
        .formio-component-list,
        .formio-builder .formio-component-list {
          padding: 0 !important;
          display: block !important;
          list-style: none !important;
        }
        
        /* Form Builder Area */
        .formio-builder-form,
        .formio-builder .formio-builder-form {
          flex: 1 !important;
          padding: 1.5rem !important;
          background: white !important;
          min-height: 600px !important;
          display: block !important;
          overflow-y: auto !important;
        }
        
        /* Drop Zone */
        .formio-builder-form .formio-form,
        .formio-builder .formio-builder-form .formio-form {
          border: 2px dashed #d1d5db !important;
          border-radius: 0.5rem !important;
          min-height: 400px !important;
          padding: 2rem !important;
          text-align: center !important;
          background: #fafafa !important;
        }
        
        .formio-builder-form .formio-form:empty::before,
        .formio-builder .formio-builder-form .formio-form:empty::before {
          content: 'Σύρετε στοιχεία εδώ για να δημιουργήσετε τη φόρμα σας' !important;
          color: #6b7280 !important;
          font-style: italic !important;
          font-size: 1.1rem !important;
          display: block !important;
        }
        
        /* Ensure All Elements Are Visible */
        .formio-builder *,
        .formio-builder .formio-builder * {
          visibility: visible !important;
          opacity: 1 !important;
          display: initial !important;
        }
        
        /* Typography and Icons */
        .formio-component-name,
        .formio-builder .formio-component-name {
          font-size: 0.9rem !important;
          font-weight: 500 !important;
          color: #333 !important;
          display: block !important;
        }
        
        .formio-component-icon,
        .formio-builder .formio-component-icon {
          margin-right: 0.5rem !important;
          color: #004B87 !important;
          display: inline-block !important;
          width: 16px !important;
          height: 16px !important;
        }
        
        /* Buttons and Form Elements */
        .formio-builder .btn-primary {
          background-color: #004B87 !important;
          border-color: #004B87 !important;
          color: white !important;
        }
        
        .formio-builder .btn-primary:hover {
          background-color: #003a6b !important;
          border-color: #003a6b !important;
        }
        
        .formio-builder .form-control {
          border: 1px solid #d1d5db !important;
          border-radius: 0.375rem !important;
          padding: 0.5rem 0.75rem !important;
        }
        
        .formio-builder .form-control:focus {
          border-color: #004B87 !important;
          box-shadow: 0 0 0 0.2rem rgba(0,75,135,0.25) !important;
          outline: none !important;
        }
        
        /* Dialog and Modal Styling */
        .formio-dialog,
        .formio-builder .formio-dialog {
          z-index: 1060 !important;
          background: white !important;
          border: 1px solid #d1d5db !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        /* Scrollbars */
        .formio-builder-sidebar::-webkit-scrollbar,
        .formio-builder-form::-webkit-scrollbar {
          width: 6px !important;
        }
        
        .formio-builder-sidebar::-webkit-scrollbar-track,
        .formio-builder-form::-webkit-scrollbar-track {
          background: #f1f1f1 !important;
        }
        
        .formio-builder-sidebar::-webkit-scrollbar-thumb,
        .formio-builder-form::-webkit-scrollbar-thumb {
          background: #c1c1c1 !important;
          border-radius: 3px !important;
        }
        
        .formio-builder-sidebar::-webkit-scrollbar-thumb:hover,
        .formio-builder-form::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8 !important;
        }
        
        /* Component Tooltips */
        .formio-component[title]:hover::after {
          content: attr(title);
          position: absolute;
          background: #1f2937;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          white-space: nowrap;
          z-index: 1000;
          margin-top: 0.25rem;
          left: 50%;
          transform: translateX(-50%);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .formio-builder {
            flex-direction: column !important;
          }
          
          .formio-builder-sidebar {
            width: 100% !important;
            max-width: 100% !important;
            max-height: 200px !important;
          }
        }
      `}</style>
      
      <div 
        ref={builderRef} 
        className="formio-builder-container"
        style={{ minHeight: '600px', width: '100%' }}
      />
      
      {!isLoading && !error && (
        <div className="mt-3 text-center">
          <small className="text-green-600 font-medium">
            ✅ {language === 'el' ? 'Form.io Builder φορτώθηκε επιτυχώς!' : 'Form.io Builder loaded successfully!'}
          </small>
        </div>
      )}
    </div>
  );
};

export default CleanFormioBuilder;