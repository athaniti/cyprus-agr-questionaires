import React, { useRef, useEffect, useState } from 'react';

interface RealFormioBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const RealFormioBuilder: React.FC<RealFormioBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const builderRef = useRef<HTMLDivElement>(null);
  const [formBuilder, setFormBuilder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load CSS first
    const loadCSS = () => {
      if (!document.querySelector('link[href*="formio"]')) {
        const formioCSS = document.createElement('link');
        formioCSS.rel = 'stylesheet';
        formioCSS.href = 'https://unpkg.com/formiojs@4.21.7/dist/formio.full.min.css';
        document.head.appendChild(formioCSS);

        const bootstrapCSS = document.createElement('link');
        bootstrapCSS.rel = 'stylesheet';
        bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css';
        document.head.appendChild(bootstrapCSS);
      }
    };

    const initFormBuilder = async () => {
      if (!builderRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log('Loading Form.io CSS...');
        loadCSS();

        // Wait for CSS to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Importing Form.io...');
        
        // Import using window object approach for better compatibility
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/formiojs@4.21.7/dist/formio.full.min.js';
        script.onload = () => {
          console.log('Form.io script loaded');
          
          // Use window.Formio
          const Formio = (window as any).Formio;
          
          if (!Formio || !Formio.FormBuilder) {
            throw new Error('Formio.FormBuilder not available');
          }

          console.log('Creating FormBuilder...');

          const options = {
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
          };

          const builder = new Formio.FormBuilder(builderRef.current, form, options);

          builder.on('change', (changedForm: any) => {
            console.log('Form changed:', changedForm);
            if (onFormChange) {
              onFormChange(changedForm);
            }
          });

          builder.ready.then(() => {
            console.log('FormBuilder ready!');
            setFormBuilder(builder);
            setIsLoading(false);
          });
        };

        script.onerror = () => {
          throw new Error('Failed to load Form.io script');
        };

        document.head.appendChild(script);

      } catch (err: any) {
        console.error('Form.io initialization error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initFormBuilder();

    return () => {
      if (formBuilder) {
        try {
          formBuilder.destroy();
        } catch (e) {
          console.warn('Error destroying FormBuilder:', e);
        }
      }
    };
  }, [form, onFormChange, language]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '500px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <h5>{language === 'el' ? 'Φόρτωση Form.io Builder...' : 'Loading Form.io Builder...'}</h5>
          <p className="text-muted">
            {language === 'el' ? 'Παρακαλώ περιμένετε...' : 'Please wait...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <h4 className="alert-heading">
          {language === 'el' ? 'Σφάλμα φόρτωσης Form.io' : 'Form.io Loading Error'}
        </h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">
          {language === 'el' 
            ? 'Παρακαλώ ανανεώστε τη σελίδα ή δοκιμάστε ξανά αργότερα.' 
            : 'Please refresh the page or try again later.'
          }
        </p>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .formio-builder {
          min-height: 600px;
          border: 1px solid #dee2e6;
          border-radius: 0.25rem;
        }
        
        .formio-builder .formio-builder-sidebar {
          background-color: #f8f9fa;
          border-right: 1px solid #dee2e6;
        }
        
        .formio-builder .formio-builder-sidebar .formio-group-header {
          background-color: #004B87 !important;
          color: white !important;
          padding: 0.5rem 0.75rem;
          font-weight: 600;
        }
        
        .formio-builder .formio-component {
          border: 1px solid #dee2e6;
          border-radius: 0.25rem;
          margin: 0.25rem;
          padding: 0.5rem;
          background-color: white;
          cursor: pointer;
        }
        
        .formio-builder .formio-component:hover {
          border-color: #004B87;
          background-color: #e3f2fd;
        }
        
        .formio-builder .formio-builder-form {
          background-color: white;
          padding: 1rem;
        }
      `}</style>
      
      <div 
        ref={builderRef}
        style={{ 
          minHeight: '600px', 
          width: '100%'
        }}
      />
    </div>
  );
};

export default RealFormioBuilder;