import React, { useRef, useEffect, useState } from 'react';

interface LocalFormioBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const LocalFormioBuilder: React.FC<LocalFormioBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const builderRef = useRef<HTMLDivElement>(null);
  const [formBuilder, setFormBuilder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    console.log(`[LocalFormBuilder] ${message}`);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const initFormBuilder = async () => {
      if (!builderRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        
        addDebugLog('Starting local Form.io initialization...');

        // Import Form.io from local package
        addDebugLog('Importing formiojs from node_modules...');
        const Formio = await import('formiojs');
        
        addDebugLog('formiojs imported successfully');
        
        // Add CSS for Form.io (using local styles)
        addDebugLog('Adding Form.io CSS...');
        if (!document.querySelector('#formio-styles')) {
          const style = document.createElement('style');
          style.id = 'formio-styles';
          style.innerHTML = `
            .formio-builder {
              min-height: 600px;
              border: 1px solid #dee2e6;
              border-radius: 0.25rem;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            }
            
            .formio-builder .formio-builder-sidebar {
              background-color: #f8f9fa !important;
              border-right: 1px solid #dee2e6 !important;
              width: 280px !important;
            }
            
            .formio-builder .formio-group-header {
              background-color: #004B87 !important;
              color: white !important;
              padding: 0.75rem !important;
              font-weight: 600 !important;
              font-size: 0.9rem !important;
              border: none !important;
              margin: 0 !important;
            }
            
            .formio-builder .formio-component {
              border: 1px solid #dee2e6 !important;
              border-radius: 0.25rem !important;
              margin: 0.25rem !important;
              padding: 0.5rem !important;
              background-color: white !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
            }
            
            .formio-builder .formio-component:hover {
              border-color: #004B87 !important;
              background-color: #e3f2fd !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 2px 4px rgba(0,75,135,0.1) !important;
            }
            
            .formio-builder .formio-builder-form {
              background-color: white !important;
              padding: 1.5rem !important;
              min-height: 500px !important;
            }
            
            .formio-dialog {
              z-index: 1060 !important;
            }
            
            .formio-builder .formio-component-list {
              max-height: none !important;
            }
            
            .formio-builder .formio-group {
              margin-bottom: 0.5rem !important;
            }
            
            .formio-builder .formio-group-container {
              border: 1px solid #dee2e6 !important;
              border-radius: 0.25rem !important;
              overflow: hidden !important;
            }
            
            /* Custom styling for Ministry theme */
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
          `;
          document.head.appendChild(style);
        }

        // Check if FormBuilder is available
        if (!Formio.FormBuilder) {
          throw new Error('FormBuilder not available in formiojs package');
        }

        addDebugLog('Creating FormBuilder instance...');

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
          noDefaultSubmitButton: true,
          language: language
        };

        const builder = new Formio.FormBuilder(builderRef.current, form, options);
        addDebugLog('FormBuilder instance created successfully');

        builder.on('change', (changedForm: any) => {
          addDebugLog('Form structure changed');
          if (onFormChange) {
            onFormChange(changedForm);
          }
        }, true);

        // Wait for builder to be ready
        if (builder.ready) {
          await builder.ready;
          addDebugLog('FormBuilder is ready and functional!');
        } else {
          // Fallback wait
          await new Promise(resolve => setTimeout(resolve, 1000));
          addDebugLog('FormBuilder ready (fallback method)');
        }

        setFormBuilder(builder);
        setIsLoading(false);
        addDebugLog('FormBuilder initialization completed successfully!');

      } catch (err: any) {
        addDebugLog(`Error: ${err.message}`);
        console.error('FormBuilder error:', err);
        setError(`Failed to initialize Form.io Builder: ${err.message}`);
        setIsLoading(false);
      }
    };

    initFormBuilder();

    return () => {
      if (formBuilder) {
        try {
          formBuilder.destroy();
          addDebugLog('FormBuilder destroyed');
        } catch (e) {
          addDebugLog(`Error destroying FormBuilder: ${e}`);
        }
      }
    };
  }, [form, onFormChange, language]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center align-items-center mb-4" style={{ height: '300px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <h5 className="mb-2">
              {language === 'el' ? 'Φόρτωση Form.io Builder...' : 'Loading Form.io Builder...'}
            </h5>
            <p className="text-muted mb-3">
              {language === 'el' ? 'Χρήση τοπικού πακέτου formiojs...' : 'Using local formiojs package...'}
            </p>
            <div className="progress" style={{ height: '4px', width: '300px' }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated" 
                   role="progressbar" 
                   style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">
              {language === 'el' ? 'Πληροφορίες Φόρτωσης' : 'Loading Information'}
            </h6>
          </div>
          <div className="card-body">
            <div style={{ maxHeight: '200px', overflow: 'auto', fontSize: '0.8rem' }}>
              {debugLog.map((log, index) => (
                <div key={index} className="text-muted">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">
          <h4 className="alert-heading">
            {language === 'el' ? 'Σφάλμα Form.io Builder' : 'Form.io Builder Error'}
          </h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-danger"
              onClick={() => window.location.reload()}
            >
              {language === 'el' ? 'Ανανέωση σελίδας' : 'Refresh Page'}
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => {
                setError(null);
                setIsLoading(true);
                setDebugLog([]);
              }}
            >
              {language === 'el' ? 'Δοκιμή ξανά' : 'Try Again'}
            </button>
          </div>
        </div>
        
        <div className="card mt-3">
          <div className="card-header">
            <h6 className="mb-0">Debug Log</h6>
          </div>
          <div className="card-body">
            <div style={{ maxHeight: '300px', overflow: 'auto', fontSize: '0.8rem' }}>
              {debugLog.map((log, index) => (
                <div key={index} className="text-muted">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div 
        ref={builderRef}
        style={{ 
          minHeight: '600px', 
          width: '100%'
        }}
      />
      
      {/* Success indicator */}
      <div className="mt-2 text-center">
        <small className="text-success">
          ✅ {language === 'el' ? 'Form.io Builder φορτώθηκε επιτυχώς!' : 'Form.io Builder loaded successfully!'}
        </small>
      </div>
    </div>
  );
};

export default LocalFormioBuilder;