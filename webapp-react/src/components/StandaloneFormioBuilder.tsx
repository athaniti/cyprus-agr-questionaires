import React, { useRef, useEffect, useState } from 'react';

interface StandaloneFormioBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const StandaloneFormioBuilder: React.FC<StandaloneFormioBuilderProps> = ({
  form = { components: [] },
  onFormChange,
  language = 'en'
}) => {
  const builderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initBuilder = async () => {
      if (!builderRef.current) return;

      try {
        console.log('🚀 Starting standalone Form.io approach...');
        
        // Load CSS first
        const loadCSS = () => {
          if (!document.querySelector('#formio-css')) {
            const link = document.createElement('link');
            link.id = 'formio-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/formiojs@4.21.7/dist/formio.full.min.css';
            document.head.appendChild(link);
            console.log('📦 Form.io CSS loaded');
          }
        };
        
        loadCSS();
        
        // Import FormBuilder and configure it properly
        const { FormBuilder } = await import('formiojs');
        
        console.log('✅ FormBuilder imported successfully');
        console.log('⚙️ Configuring for standalone mode (no project required)');
        
        // Enhanced configuration with proper standalone setup
        const builderOptions = {
          builder: {
            basic: {
              title: language === 'el' ? 'Βασικά Στοιχεία' : 'Basic Components',
              weight: 0,
              components: {
                textfield: true,
                textarea: true,
                number: true,
                email: true,
                password: true,
                select: true,
                radio: true,
                checkbox: true,
                button: true,
                datetime: true,
                phoneNumber: true,
                url: true
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
                table: true,
                panel: true
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
          noDefaultSubmitButton: false,
          sanitize: false,
          readOnly: false,
          language: language
        };

        const builder = new FormBuilder(builderRef.current, form, builderOptions);

        console.log('✅ FormBuilder instance created');

        // Enhanced change handler
        builder.on('change', (changedForm: any) => {
          console.log('📝 Form changed:', changedForm);
          if (onFormChange) {
            onFormChange(changedForm);
          }
        }, true);

        // Wait for proper initialization
        setTimeout(() => {
          setIsReady(true);
          console.log('🎉 FormBuilder is ready and configured!');
        }, 1500);

      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(`FormBuilder initialization failed: ${err.message}`);
      }
    };

    // Delay initialization to ensure DOM readiness
    setTimeout(initBuilder, 200);
  }, [form, onFormChange, language]);

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <h5>FormBuilder Error</h5>
        <p>{error}</p>
        <div className="mt-3">
          <button 
            className="btn btn-outline-danger me-2" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => {
              setError(null);
              setIsReady(false);
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      {!isReady && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">
            {language === 'el' ? 'Φόρτωση FormBuilder...' : 'Loading FormBuilder...'}
          </p>
          <small className="text-muted">
            {language === 'el' ? 'Διαμόρφωση για αυτόνομη λειτουργία...' : 'Configuring for standalone operation...'}
          </small>
        </div>
      )}
      
      <style>{`
        /* Import Form.io CSS directly */
        @import url('https://unpkg.com/formiojs@4.21.7/dist/formio.full.min.css');
        
        .formio-builder {
          min-height: 600px !important;
          border: 1px solid #ddd;
          border-radius: 4px;
          display: flex !important;
          overflow: hidden;
        }
        
        .formio-builder-sidebar {
          width: 300px !important;
          min-width: 300px !important;
          max-width: 300px !important;
          background-color: #f8f9fa !important;
          border-right: 1px solid #dee2e6 !important;
          display: block !important;
          overflow-y: auto !important;
        }
        
        .formio-group {
          margin-bottom: 0.5rem !important;
          display: block !important;
        }
        
        .formio-group-header {
          background-color: #004B87 !important;
          color: white !important;
          padding: 0.75rem !important;
          font-weight: bold !important;
          display: block !important;
          cursor: pointer !important;
          border: none !important;
          margin: 0 !important;
          text-align: left !important;
        }
        
        .formio-group-header:hover {
          background-color: #003a6b !important;
        }
        
        .formio-group-container {
          border: 1px solid #dee2e6 !important;
          border-radius: 0.25rem !important;
          overflow: hidden !important;
          display: block !important;
          margin-bottom: 0.5rem !important;
        }
        
        .formio-component {
          padding: 0.75rem !important;
          margin: 0 !important;
          border-bottom: 1px solid #eee !important;
          background-color: white !important;
          cursor: grab !important;
          display: block !important;
          transition: all 0.2s ease !important;
          font-size: 0.9rem !important;
        }
        
        .formio-component:last-child {
          border-bottom: none !important;
        }
        
        .formio-component:hover {
          background-color: #e3f2fd !important;
          border-left: 3px solid #004B87 !important;
          padding-left: calc(0.75rem - 3px) !important;
        }
        
        .formio-component:active {
          cursor: grabbing !important;
        }
        
        .formio-builder-form {
          flex: 1 !important;
          padding: 1rem !important;
          background-color: white !important;
          min-height: 600px !important;
          display: block !important;
          overflow-y: auto !important;
        }
        
        .formio-component-list {
          padding: 0 !important;
          display: block !important;
        }
        
        /* Ensure visibility of all Form.io elements */
        .formio-builder * {
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Typography fixes */
        .formio-component-name {
          font-size: 0.9rem !important;
          font-weight: 500 !important;
          color: #333 !important;
          display: block !important;
        }
        
        .formio-component-icon {
          margin-right: 0.5rem !important;
          color: #004B87 !important;
          display: inline-block !important;
        }

        /* Form area styling */
        .formio-builder-form .formio-form {
          border: 2px dashed #dee2e6 !important;
          border-radius: 0.5rem !important;
          min-height: 400px !important;
          padding: 2rem !important;
          text-align: center !important;
          background-color: #fafafa !important;
        }

        .formio-builder-form .formio-form:empty::before {
          content: '${language === 'el' ? 'Σύρετε στοιχεία εδώ για να δημιουργήσετε τη φόρμα σας' : 'Drag components here to build your form'}';
          color: #666 !important;
          font-style: italic !important;
          font-size: 1.1rem !important;
        }

        /* Hide Form.io project loading elements */
        .formio-loader,
        .formio-alerts,
        .formio-project-selector {
          display: none !important;
        }
      `}</style>
      
      <div ref={builderRef} style={{ minHeight: '600px', width: '100%' }} />
      
      {isReady && (
        <div className="alert alert-success mt-3">
          <div className="d-flex align-items-center">
            <span className="me-2">✅</span>
            <div>
              <strong>
                {language === 'el' ? 'FormBuilder έτοιμος!' : 'FormBuilder Ready!'}
              </strong>
              <br />
              <small>
                {language === 'el' 
                  ? 'Σύρετε στοιχεία από την αριστερή μπάρα για να δημιουργήσετε τη φόρμα σας.' 
                  : 'Drag components from the left sidebar to build your form.'
                }
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandaloneFormioBuilder;