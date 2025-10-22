import React, { useRef, useEffect, useState } from 'react';

interface SimplestFormioBuilderProps {
  form?: any;
  onFormChange?: (form: any) => void;
  language?: string;
}

const SimplestFormioBuilder: React.FC<SimplestFormioBuilderProps> = ({
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
        console.log('🚀 Starting simplest Form.io approach...');
        
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
        
        // Try the most direct approach possible
        const { FormBuilder } = await import('formiojs');
        
        console.log('✅ FormBuilder imported successfully');
        
        // Enhanced configuration with more components
        const builder = new FormBuilder(builderRef.current, form, {
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
                button: true,
                datetime: true
              }
            },
            advanced: {
              title: language === 'el' ? 'Προχωρημένα' : 'Advanced',
              weight: 10,
              components: {
                fieldset: true,
                container: true,
                htmlelement: true,
                content: true
              }
            }
          },
          noDefaultSubmitButton: false
        });

        console.log('✅ FormBuilder instance created');

        // Simple change handler
        if (onFormChange) {
          builder.on('change', onFormChange, true);
        }

        // Wait a moment for rendering
        setTimeout(() => {
          setIsReady(true);
          console.log('🎉 FormBuilder is ready and visible!');
        }, 1000);

      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(err.message);
      }
    };

    // Add a small delay to ensure DOM is ready
    setTimeout(initBuilder, 100);
  }, [form, onFormChange, language]);

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <h5>FormBuilder Error</h5>
        <p>{error}</p>
        <button 
          className="btn btn-outline-danger" 
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
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
          <p className="mt-2">Loading FormBuilder...</p>
        </div>
      )}
      
      <style>{`
        /* Import Form.io CSS directly */
        @import url('https://unpkg.com/formiojs@4.21.7/dist/formio.full.min.css');
        
        .formio-builder {
          min-height: 500px;
          border: 1px solid #ddd;
          border-radius: 4px;
          display: flex !important;
        }
        
        .formio-builder-sidebar {
          width: 280px !important;
          min-width: 280px !important;
          background-color: #f8f9fa !important;
          border-right: 1px solid #dee2e6 !important;
          display: block !important;
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
        }
        
        .formio-group-container {
          border: 1px solid #dee2e6 !important;
          border-radius: 0.25rem !important;
          overflow: hidden !important;
          display: block !important;
        }
        
        .formio-component {
          padding: 0.5rem !important;
          margin: 0.25rem !important;
          border: 1px solid #dee2e6 !important;
          border-radius: 0.25rem !important;
          background-color: white !important;
          cursor: grab !important;
          display: block !important;
          transition: all 0.2s ease !important;
        }
        
        .formio-component:hover {
          border-color: #004B87 !important;
          background-color: #e3f2fd !important;
          transform: translateY(-1px) !important;
        }
        
        .formio-component:active {
          cursor: grabbing !important;
        }
        
        .formio-builder-form {
          flex: 1 !important;
          padding: 1rem !important;
          background-color: white !important;
          min-height: 500px !important;
          display: block !important;
        }
        
        .formio-component-list {
          padding: 0.5rem !important;
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
        }
        
        .formio-component-icon {
          margin-right: 0.5rem !important;
          color: #004B87 !important;
        }
      `}</style>
      
      <div ref={builderRef} style={{ minHeight: '500px', width: '100%' }} />
      
      {isReady && (
        <div className="alert alert-success mt-3">
          ✅ FormBuilder loaded successfully! You can now drag components to build your form.
        </div>
      )}
    </div>
  );
};

export default SimplestFormioBuilder;