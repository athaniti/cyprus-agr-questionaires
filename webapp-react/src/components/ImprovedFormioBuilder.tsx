import React, { useRef, useEffect, useState } from 'react';

interface ImprovedFormioBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

declare global {
  interface Window {
    Formio: any;
  }
}

const ImprovedFormioBuilder: React.FC<ImprovedFormioBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const builderRef = useRef<HTMLDivElement>(null);
  const [formBuilder, setFormBuilder] = useState<any>(null);
  const [loadingStage, setLoadingStage] = useState<string>('Initializing...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    console.log(`[FormBuilder] ${message}`);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const initFormBuilder = async () => {
      if (!builderRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        
        addDebugLog('Starting Form.io initialization...');
        setLoadingStage('Loading dependencies...');

        // Check if Form.io is already loaded
        if (window.Formio && window.Formio.FormBuilder) {
          addDebugLog('Form.io already loaded, proceeding to create builder');
          createFormBuilder();
          return;
        }

        // Load CSS
        addDebugLog('Loading CSS files...');
        setLoadingStage('Loading stylesheets...');
        
        const cssFiles = [
          'https://unpkg.com/formiojs@4.21.7/dist/formio.full.min.css',
          'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css'
        ];

        const cssPromises = cssFiles.map(href => {
          return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${href}"]`)) {
              resolve(true);
              return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve(true);
            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
            document.head.appendChild(link);
          });
        });

        await Promise.all(cssPromises);
        addDebugLog('CSS files loaded successfully');

        // Load JavaScript
        addDebugLog('Loading Form.io JavaScript...');
        setLoadingStage('Loading Form.io library...');
        
        await new Promise((resolve, reject) => {
          if (document.querySelector('script[src*="formio.full.min.js"]')) {
            addDebugLog('Form.io script already exists');
            resolve(true);
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://unpkg.com/formiojs@4.21.7/dist/formio.full.min.js';
          
          script.onload = () => {
            addDebugLog('Form.io script loaded');
            // Wait a bit for the script to initialize
            setTimeout(() => resolve(true), 500);
          };
          
          script.onerror = () => {
            reject(new Error('Failed to load Form.io script'));
          };
          
          document.head.appendChild(script);
        });

        // Verify Form.io is available
        let attempts = 0;
        while (attempts < 20 && (!window.Formio || !window.Formio.FormBuilder)) {
          addDebugLog(`Waiting for Form.io to be available (attempt ${attempts + 1})`);
          setLoadingStage(`Initializing Form.io (${attempts + 1}/20)...`);
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }

        if (!window.Formio || !window.Formio.FormBuilder) {
          throw new Error('Form.io failed to initialize after multiple attempts');
        }

        addDebugLog('Form.io is now available, creating builder...');
        createFormBuilder();

      } catch (err: any) {
        addDebugLog(`Error: ${err.message}`);
        setError(err.message);
        setIsLoading(false);
      }
    };

    const createFormBuilder = () => {
      try {
        setLoadingStage('Creating Form Builder...');
        addDebugLog('Creating Form.io FormBuilder instance');

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

        const builder = new window.Formio.FormBuilder(builderRef.current, form, options);
        addDebugLog('FormBuilder instance created');

        builder.on('change', (changedForm: any) => {
          addDebugLog('Form changed');
          if (onFormChange) {
            onFormChange(changedForm);
          }
        });

        if (builder.ready) {
          builder.ready.then(() => {
            addDebugLog('FormBuilder is ready!');
            setFormBuilder(builder);
            setIsLoading(false);
          }).catch((err: any) => {
            addDebugLog(`FormBuilder ready error: ${err.message}`);
            setError(`FormBuilder initialization failed: ${err.message}`);
            setIsLoading(false);
          });
        } else {
          // Fallback if ready promise doesn't exist
          setTimeout(() => {
            addDebugLog('FormBuilder ready (fallback)');
            setFormBuilder(builder);
            setIsLoading(false);
          }, 1000);
        }

      } catch (err: any) {
        addDebugLog(`CreateFormBuilder error: ${err.message}`);
        setError(`Failed to create FormBuilder: ${err.message}`);
        setIsLoading(false);
      }
    };

    // Set timeout for the entire process
    timeoutId = setTimeout(() => {
      addDebugLog('Initialization timeout after 30 seconds');
      setError('Form.io Builder loading timed out. Please refresh and try again.');
      setIsLoading(false);
    }, 30000);

    initFormBuilder();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
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
            <h5 className="mb-2">{loadingStage}</h5>
            <p className="text-muted mb-3">
              {language === 'el' ? 'Παρακαλώ περιμένετε...' : 'Please wait...'}
            </p>
            <div className="progress" style={{ height: '4px', width: '300px' }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated" 
                   role="progressbar" 
                   style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Debug Information */}
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Debug Information</h6>
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
            {language === 'el' ? 'Σφάλμα φόρτωσης Form.io' : 'Form.io Loading Error'}
          </h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            {language === 'el' ? 'Ανανέωση σελίδας' : 'Refresh Page'}
          </button>
        </div>
        
        {/* Debug Information */}
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
      <style>{`
        .formio-builder {
          min-height: 600px;
          border: 1px solid #dee2e6;
          border-radius: 0.25rem;
        }
        
        .formio-builder .formio-builder-sidebar {
          background-color: #f8f9fa !important;
          border-right: 1px solid #dee2e6 !important;
        }
        
        .formio-builder .formio-group-header {
          background-color: #004B87 !important;
          color: white !important;
          padding: 0.5rem 0.75rem !important;
          font-weight: 600 !important;
        }
        
        .formio-builder .formio-component {
          border: 1px solid #dee2e6 !important;
          border-radius: 0.25rem !important;
          margin: 0.25rem !important;
          padding: 0.5rem !important;
          background-color: white !important;
          cursor: pointer !important;
        }
        
        .formio-builder .formio-component:hover {
          border-color: #004B87 !important;
          background-color: #e3f2fd !important;
        }
        
        .formio-builder .formio-builder-form {
          background-color: white !important;
          padding: 1rem !important;
        }
        
        .formio-dialog {
          z-index: 1060 !important;
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

export default ImprovedFormioBuilder;