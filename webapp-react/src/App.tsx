import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { FormPreview } from './components/FormPreview';
import { UserManagement } from './components/UserManagement';
import { QuestionnaireAssignment } from './components/QuestionnaireAssignment';
import { SampleManagement } from './components/SampleManagement';
import { Themes } from './components/Themes';
import { ThemeSelector } from './components/ThemeSelector';
import InvitationManager from './components/InvitationManager';
import LocationManagementHub from './components/LocationManagementHub';
import QuotaManagement from './components/QuotaManagement';
import QuotaMonitoringDashboard from './components/QuotaMonitoringDashboard';
import QuotaAllocationManager from './components/QuotaAllocationManager';
import TestFormResponses from './pages/TestFormResponses';
import { FormBuilder } from "@formio/react";
import { QuestionnaireService } from './services/questionnaireService';
import '@formio/js/dist/formio.full.min.css';

// CSS για FormIO controls visibility
const formioCSS = `
  /* FormIO Builder Sidebar - Βασική εμφάνιση */
  .formio-builder-sidebar,
  .builder-sidebar {
    display: block !important;
    visibility: visible !important;
  }
  
  /* FormIO Components Panel */
  .formio-builder-sidebar .card,
  .builder-sidebar .card {
    display: block !important;
  }
  
  .formio-builder-sidebar .card-body,
  .builder-sidebar .card-body {
    display: block !important;
    visibility: visible !important;
  }
  
  /* Bootstrap Accordion/Collapse */
  .formio-builder-sidebar .collapse.show,
  .builder-sidebar .collapse.show {
    display: block !important;
  }
  
  /* FormIO Component Groups */
  .formio-builder-group,
  .formio-builder-component,
  .formio-drag-component {
    display: block !important;
    visibility: visible !important;
  }
  
  /* FormIO Buttons */
  .formio-builder-sidebar .btn,
  .builder-sidebar .btn {
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  /* FormIO Builder Panel */
  .formio-builder-wrapper {
    display: flex !important;
  }
  
  .formio-builder .formio-builder-sidebar {
    flex: 0 0 250px !important;
    width: 250px !important;
    display: block !important;
  }
  
  .formio-builder .formio-builder-form {
    flex: 1 !important;
    display: block !important;
  }
  
  /* FormIO Component Cards */
  .formio-builder-sidebar .card-header {
    display: block !important;
  }
  
  .formio-builder-sidebar .card-header .btn {
    width: 100% !important;
    text-align: left !important;
  }
  
  /* FormIO Drag Components */
  .formio-builder-sidebar .formio-builder-component {
    padding: 8px !important;
    margin: 2px 0 !important;
    border: 1px solid #ddd !important;
    background: #f8f9fa !important;
    cursor: move !important;
  }

  /* MINIMAL FormIO Modal Fixes - Only what's necessary */
  .formio-dialog,
  .formio-component-edit {
    z-index: 10000 !important;
  }

  /* Ensure modal buttons work */
  .formio-dialog .btn,
  .formio-dialog .close,
  .formio-dialog button {
    pointer-events: auto !important;
    z-index: auto !important;
    cursor: pointer !important;
  }

  /* Basic modal visibility */
  .formio-dialog.show,
  .modal.show {
    display: block !important;
  }

  /* Modal backdrop shouldn't interfere */
  .modal-backdrop {
    z-index: 9999 !important;
  }
`;

// Εφαρμογή CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = formioCSS;
  document.head.appendChild(style);

  const configureFormIO = () => {
    try {
      const windowWithFormio = window as any;
      if (windowWithFormio.Formio) {
        // Disable project URL and set local configuration
        windowWithFormio.Formio.setProjectUrl('');
        windowWithFormio.Formio.setBaseUrl('');
        windowWithFormio.Formio.projectId = 'local-offline-project';
        
        // Disable ACE worker if available
        if (windowWithFormio.ace && windowWithFormio.ace.config) {
          windowWithFormio.ace.config.set('useWorker', false);
          windowWithFormio.ace.config.set('useWorkerFromCDN', false);
        }
      }
    } catch (error) {
      console.warn('FormIO early configuration warning:', error);
    }
  };

  // Run configuration immediately and after DOM loads
  configureFormIO();
  document.addEventListener('DOMContentLoaded', configureFormIO);
  window.addEventListener('load', configureFormIO);

  // Suppress specific FormIO console warnings
  const originalConsoleWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    // Suppress specific FormIO warnings
    if (message.includes('Missing projectId') || 
        message.includes('isUseWorkerDisabled') ||
        message.includes('misspelled option')) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}
function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  // Εάν ο χρήστης δεν είναι συνδεδεμένος, εμφάνισε το Login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Simple FormIO modal fix
  useEffect(() => {
    // Minimal fix for FormIO modals - only fix what's absolutely necessary
    const fixFormIOModals = () => {
      // Only target specific FormIO modals that are showing
      const modals = document.querySelectorAll('.formio-dialog.show, .modal.show[class*="formio"]');
      
      modals.forEach(modal => {
        if (modal instanceof HTMLElement) {
          // Ensure modal is visible and interactive (minimal intervention)
          modal.style.zIndex = '10000';
          modal.style.pointerEvents = 'auto';
          
          // Fix only the save and close buttons
          const buttons = modal.querySelectorAll('.btn, .close, button');
          buttons.forEach(btn => {
            if (btn instanceof HTMLElement) {
              btn.style.pointerEvents = 'auto';
              btn.style.zIndex = 'auto';
            }
          });
        }
      });
    };

    // Run fix when DOM changes (but not aggressively)
    const observer = new MutationObserver(() => {
      setTimeout(fixFormIOModals, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Additional FormIO modal fix - handle click events properly
  useEffect(() => {
    const handleModalClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Handle close button clicks
      if (target.matches('.close, .btn-close, [data-dismiss="modal"], [data-bs-dismiss="modal"]')) {
        e.stopPropagation();
        const modal = target.closest('.modal, .formio-dialog');
        if (modal && modal instanceof HTMLElement) {
          modal.style.display = 'none';
          // Remove modal backdrop
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      }
      
      // Handle save button clicks in FormIO modals
      if (target.matches('.btn-primary, [type="submit"]') && target.closest('.formio-dialog, .modal[class*="formio"]')) {
        // Let FormIO handle the save, but ensure the event propagates
        e.stopPropagation();
      }
    };

    document.addEventListener('click', handleModalClick, true);
    return () => document.removeEventListener('click', handleModalClick, true);
  }, []);

  const [currentView, setCurrentView] = useState('dashboard');
  const [language, setLanguage] = useState<'el' | 'en'>('el');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);
  const [formBuilderMode, setFormBuilderMode] = useState<'create' | 'edit'>('create');
  const [newQuestionnaireName, setNewQuestionnaireName] = useState('');
  const [currentFormSchema, setCurrentFormSchema] = useState<any>({ components: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentQuestionnaire, setAssignmentQuestionnaire] = useState<any>(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [themeSelectorQuestionnaire, setThemeSelectorQuestionnaire] = useState<any>(null);

  // Mock users data (in real app would come from API)
  const mockUsers = [
    {
      id: '1',
      name: 'Γιάννης Παπαδόπουλος',
      email: 'giannis.papadopoulos@agriculture.gov.cy',
      role: 'admin',
      department: 'Γεωργία',
      location: 'Λευκωσία'
    },
    {
      id: '2',
      name: 'Μαρία Νικολάου',
      email: 'maria.nikolaou@agriculture.gov.cy',
      role: 'surveyor',
      department: 'Κτηνοτροφία',
      location: 'Λεμεσός'
    },
    {
      id: '3',
      name: 'Άντρη Γεωργίου',
      email: 'andri.georgiou@agriculture.gov.cy',
      role: 'surveyor',
      department: 'Αλιεία',
      location: 'Πάφος'
    },
    {
      id: '4',
      name: 'Πέτρος Κωνσταντίνου',
      email: 'petros.konstantinou@agriculture.gov.cy',
      role: 'respondent',
      department: 'Γεωργία',
      location: 'Λάρνακα'
    },
    {
      id: '5',
      name: 'Ελένη Μιχαήλ',
      email: 'eleni.michael@agriculture.gov.cy',
      role: 'respondent',
      department: 'Κτηνοτροφία',
      location: 'Αμμόχωστος'
    }
  ];

  // Συνάρτηση για να πάρουμε user details από ID
  const getUserById = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  // Συνάρτηση για να πάρουμε assigned users details
  const getAssignedUsersDetails = (userIds: string[]) => {
    return userIds.map(id => getUserById(id)).filter(Boolean);
  };

  // Συνάρτηση για αποθήκευση ερωτηματολογίου
  const saveQuestionnaire = async () => {
    if (!newQuestionnaireName.trim()) {
      alert(language === 'el' ? 'Παρακαλώ εισάγετε όνομα ερωτηματολογίου' : 'Please enter questionnaire name');
      return;
    }

    if (!currentFormSchema.components || currentFormSchema.components.length === 0) {
      const confirmEmpty = window.confirm(
        language === 'el' 
          ? 'Το ερωτηματολόγιο είναι κενό. Θέλετε να το αποθηκεύσετε έτσι;'
          : 'The questionnaire is empty. Do you want to save it anyway?'
      );
      if (!confirmEmpty) return;
    }

    setIsSaving(true);

    try {
      const questionnaireData = {
        name: newQuestionnaireName,
        description: `Questionnaire created ${formBuilderMode === 'create' ? 'on' : 'updated on'} ${new Date().toLocaleDateString()}`,
        category: 'General', // Default category
        schema: JSON.stringify(currentFormSchema),
        targetResponses: 100,
        createdBy: 'system-user' // In real app, get from JWT token
      };

      if (formBuilderMode === 'create') {
        console.log('Creating questionnaire:', questionnaireData);
        const response = await QuestionnaireService.createQuestionnaire(questionnaireData);
        
        // Προσθήκη στο local state
        const newQuestionnaire = {
          id: response.id,
          name: response.name,
          status: 'draft',
          responses: 0,
          currentResponses: 0,
          targetResponses: 100,
          createdAt: response.createdAt,
          schema: currentFormSchema
        };
        
        setQuestionnaires(prev => [...prev, newQuestionnaire]);
        
        alert(
          language === 'el' 
            ? `Ερωτηματολόγιο "${newQuestionnaireName}" δημιουργήθηκε επιτυχώς!`
            : `Questionnaire "${newQuestionnaireName}" created successfully!`
        );
      } else {
        // Edit mode
        console.log('Updating questionnaire:', selectedQuestionnaire.id, questionnaireData);
        await QuestionnaireService.updateQuestionnaire(selectedQuestionnaire.id, questionnaireData);
        
        // Ενημέρωση local state
        setQuestionnaires(prev => prev.map(q => 
          q.id === selectedQuestionnaire.id 
            ? { ...q, name: newQuestionnaireName, schema: currentFormSchema, updatedAt: new Date().toISOString() }
            : q
        ));
        
        alert(
          language === 'el' 
            ? `Ερωτηματολόγιο "${newQuestionnaireName}" ενημερώθηκε επιτυχώς!`
            : `Questionnaire "${newQuestionnaireName}" updated successfully!`
        );
      }

      // Κλείσιμο modal και reset
      setShowFormBuilder(false);
      setNewQuestionnaireName('');
      setSelectedQuestionnaire(null);
      setCurrentFormSchema({ components: [] });

    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert(
        language === 'el' 
          ? `Σφάλμα κατά την αποθήκευση: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}`
          : `Error saving questionnaire: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Συνάρτηση για ανάθεση ερωτηματολογίου
  const handleEditForm = (questionnaire: any) => {
    console.log('Opening form builder for questionnaire:', questionnaire.id);
    // Open form builder specifically for this questionnaire
    setSelectedQuestionnaire(questionnaire);
    setFormBuilderMode('edit');
    setNewQuestionnaireName(questionnaire.name);
    try {
      const schema = questionnaire.schema || { components: [] };
      setCurrentFormSchema(schema);
      console.log('Loading questionnaire schema for form edit:', schema);
    } catch (error) {
      console.error('Error loading questionnaire schema:', error);
      setCurrentFormSchema({ components: [] });
    }
    setShowFormBuilder(true);
  };

  const handleSelectTheme = (questionnaire: any) => {
    console.log('Opening theme selector for questionnaire:', questionnaire.id);
    setThemeSelectorQuestionnaire(questionnaire);
    setShowThemeSelector(true);
  };

  const handleThemeSelection = (theme: any) => {
    if (themeSelectorQuestionnaire) {
      console.log('Applying theme to questionnaire:', {
        questionnaireId: themeSelectorQuestionnaire.id,
        themeId: theme.id,
        themeName: theme.name
      });

      // Update questionnaire with selected theme
      setQuestionnaires(prev => prev.map(q => 
        q.id === themeSelectorQuestionnaire.id 
          ? { ...q, theme: theme, updatedAt: new Date().toISOString() }
          : q
      ));

      alert(
        language === 'el' 
          ? `Θέμα "${theme.name}" εφαρμόστηκε επιτυχώς στο ερωτηματολόγιο "${themeSelectorQuestionnaire.name}"!`
          : `Theme "${theme.name}" applied successfully to questionnaire "${themeSelectorQuestionnaire.name}"!`
      );

      setShowThemeSelector(false);
      setThemeSelectorQuestionnaire(null);
    }
  };

  const handleAssignQuestionnaire = (questionnaire: any) => {
    setAssignmentQuestionnaire(questionnaire);
    setShowAssignmentModal(true);
  };

  const handleQuestionnaireAssignment = async (userIds: string[], dueDate: string) => {
    try {
      console.log('Assigning questionnaire:', assignmentQuestionnaire.id, 'to users:', userIds, 'due:', dueDate);
      
      // Update questionnaire status to 'assigned'
      setQuestionnaires(prev => prev.map(q => 
        q.id === assignmentQuestionnaire.id 
          ? { 
              ...q, 
              status: 'assigned', 
              assignedUsers: userIds,
              dueDate: dueDate,
              assignedAt: new Date().toISOString()
            }
          : q
      ));

      alert(
        language === 'el' 
          ? `Ερωτηματολόγιο ανατέθηκε επιτυχώς σε ${userIds.length} χρήστες!`
          : `Questionnaire assigned successfully to ${userIds.length} users!`
      );

      setShowAssignmentModal(false);
      setAssignmentQuestionnaire(null);
    } catch (error) {
      console.error('Error assigning questionnaire:', error);
      alert(
        language === 'el' 
          ? 'Σφάλμα κατά την ανάθεση ερωτηματολογίου'
          : 'Error assigning questionnaire'
      );
    }
  };

  // Συνάρτηση για αποσυσχέτιση ερωτηματολογίου
  const handleUnassignQuestionnaire = async (questionnaire: any) => {
    const confirmUnassign = window.confirm(
      language === 'el' 
        ? `Είστε σίγουροι ότι θέλετε να αποσυσχετίσετε το ερωτηματολόγιο "${questionnaire.name}" από όλους τους χρήστες;`
        : `Are you sure you want to unassign questionnaire "${questionnaire.name}" from all users?`
    );

    if (!confirmUnassign) return;

    try {
      // Update questionnaire status back to 'draft'
      setQuestionnaires(prev => prev.map(q => 
        q.id === questionnaire.id 
          ? { 
              ...q, 
              status: 'draft', 
              assignedUsers: undefined,
              dueDate: undefined,
              assignedAt: undefined
            }
          : q
      ));

      alert(
        language === 'el' 
          ? 'Ερωτηματολόγιο αποσυσχετίστηκε επιτυχώς!'
          : 'Questionnaire unassigned successfully!'
      );
    } catch (error) {
      console.error('Error unassigning questionnaire:', error);
      alert(
        language === 'el' 
          ? 'Σφάλμα κατά την αποσυσχέτιση ερωτηματολογίου'
          : 'Error unassigning questionnaire'
      );
    }
  };
  
  // Safe questionnaires state with default data - will be replaced by API data
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);

  // Load questionnaires from API
  useEffect(() => {
    const loadQuestionnaires = async () => {
      try {
        console.log('Loading questionnaires from Cyprus API...');
        const response = await fetch('http://localhost:5050/api/questionnaires');
        
        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result);
          
          // Map the API response to match the App component structure
          const mappedQuestionnaires = result.data.map((q: any) => ({
            id: q.id,
            name: q.name,
            description: q.description,
            category: q.category,
            status: q.status,
            currentResponses: q.currentResponses,
            targetResponses: q.targetResponses,
            completionRate: q.completionRate,
            createdAt: q.createdAt,
            samples: q.samples || [],
            samplesCount: q.samplesCount
          }));
          
          console.log('Mapped questionnaires:', mappedQuestionnaires);
          setQuestionnaires(mappedQuestionnaires);
        } else {
          console.warn('API not available, using fallback Cyprus data');
          // Fallback to Cyprus mock data
          setQuestionnaires([
            {
              id: 'aaaaaaaa-1111-1111-1111-111111111111',
              name: 'Έρευνα Ελαιοπαραγωγής Κύπρου 2025',
              description: 'Ετήσια έρευνα για την κατάσταση της ελαιοπαραγωγής στην Κύπρο',
              category: 'Φυτική Παραγωγή',
              status: 'active',
              currentResponses: 0,
              targetResponses: 100,
              completionRate: 0,
              createdAt: '2025-11-03T21:00:00Z',
              samplesCount: 1
            },
            {
              id: 'bbbbbbbb-2222-2222-2222-222222222222',
              name: 'Έρευνα Κτηνοτροφικών Μονάδων',
              description: 'Έρευνα για τη δομή και τα χαρακτηριστικά των κτηνοτροφικών εκμεταλλεύσεων στην Κύπρο',
              category: 'Κτηνοτροφία',
              status: 'active',
              currentResponses: 0,
              targetResponses: 50,
              completionRate: 0,
              createdAt: '2025-11-03T21:00:00Z',
              samplesCount: 1
            },
            {
              id: 'cccccccc-3333-3333-3333-333333333333',
              name: 'Έρευνα Αρδευτικών Συστημάτων',
              description: 'Μελέτη των μεθόδων άρδευσης και της χρήσης νερού στις αγροτικές εκμεταλλεύσεις',
              category: 'Άρδευση',
              status: 'draft',
              currentResponses: 0,
              targetResponses: 80,
              completionRate: 0,
              createdAt: '2025-11-03T21:00:00Z',
              samplesCount: 0
            },
            {
              id: 'dddddddd-4444-4444-4444-444444444444',
              name: 'Έρευνα Βιολογικής Γεωργίας',
              description: 'Πρόχειρη έρευνα για τις πρακτικές βιολογικής γεωργίας στην Κύπρο',
              category: 'Βιολογική Γεωργία',
              status: 'draft',
              currentResponses: 0,
              targetResponses: 60,
              completionRate: 0,
              createdAt: '2025-11-05T10:00:00Z',
              samplesCount: 0
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading questionnaires:', error);
        // Fallback to Cyprus mock data
        setQuestionnaires([
          {
            id: 'aaaaaaaa-1111-1111-1111-111111111111',
            name: 'Έρευνα Ελαιοπαραγωγής Κύπρου 2025',
            description: 'Ετήσια έρευνα για την κατάσταση της ελαιοπαραγωγής στην Κύπρο',
            category: 'Φυτική Παραγωγή',
            status: 'active',
            currentResponses: 0,
            targetResponses: 100,
            completionRate: 0,
            createdAt: '2025-11-03T21:00:00Z',
            samplesCount: 1
          },
          {
            id: 'dddddddd-4444-4444-4444-444444444444',
            name: 'Έρευνα Βιολογικής Γεωργίας',
            description: 'Πρόχειρη έρευνα για τις πρακτικές βιολογικής γεωργίας στην Κύπρο',
            category: 'Βιολογική Γεωργία',
            status: 'draft',
            currentResponses: 0,
            targetResponses: 60,
            completionRate: 0,
            createdAt: '2025-11-05T10:00:00Z',
            samplesCount: 0
          }
        ]);
      }
    };

    loadQuestionnaires();
  }, []);

  const renderView = () => {
    try {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard />;
        case 'questionnaires':
          return renderQuestionnaires();
        case 'samples':
          return <SampleManagement />;
        case 'invitations':
          return <InvitationManager />;
        case 'locations':
          return <LocationManagementHub />;
        case 'quotas':
          return <QuotaManagement />;
        case 'quota-monitoring':
          return <QuotaMonitoringDashboard />;
        case 'quota-allocation':
          return <QuotaAllocationManager />;
        case 'reports':
          return <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{language === 'el' ? 'Αναφορές' : 'Reports'}</h2>
            <p className="text-gray-600">{language === 'el' ? 'Αναφορές και αναλύσεις' : 'Reports and analytics'}</p>
          </div>;
        case 'form-responses':
          return <TestFormResponses />;
        case 'users':
          return <UserManagement language={language} />;
        case 'themes':
          return <Themes language={language} />;
        case 'settings':
          return <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{language === 'el' ? 'Ρυθμίσεις' : 'Settings'}</h2>
            <p className="text-gray-600">{language === 'el' ? 'Ρυθμίσεις συστήματος' : 'System settings'}</p>
          </div>;
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return <div className="p-6">
        <h2 className="text-xl text-red-600">Error loading content</h2>
        <p className="text-gray-600">Please refresh the page.</p>
      </div>;
    }
  };

  const renderQuestionnaires = () => {
    return (
      <div className="p-6" style={{ backgroundColor: '#F5F6FA' }}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {language === 'el' ? 'Ερωτηματολόγια' : 'Questionnaires'}
              </h2>
              <p className="text-gray-600 mt-2">
                {language === 'el' ? 'Διαχείριση και δημιουργία ερωτηματολογίων' : 'Manage and create questionnaires'}
              </p>
            </div>
            <button 
              className="px-4 py-2 text-white rounded-xl shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#004B87' }}
              onClick={() => setShowCreateModal(true)}
            >
              + {language === 'el' ? 'Δημιουργία Νέου' : 'Create New'}
            </button>
          </div>

          {/* Questionnaires List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionnaires.map((questionnaire) => (
              <div key={questionnaire.id} className="bg-white rounded-2xl p-6 shadow-sm border-0 hover:shadow-md transition-shadow">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    questionnaire.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : questionnaire.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : questionnaire.status === 'assigned'
                      ? 'bg-orange-100 text-orange-800'
                      : questionnaire.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {questionnaire.status === 'active' && (language === 'el' ? 'Ενεργό' : 'Active')}
                    {questionnaire.status === 'draft' && (language === 'el' ? 'Πρόχειρο' : 'Draft')}
                    {questionnaire.status === 'assigned' && (language === 'el' ? 'Ανατεθειμένο' : 'Assigned')}
                    {questionnaire.status === 'completed' && (language === 'el' ? 'Ολοκληρωμένο' : 'Completed')}
                    {questionnaire.status === 'archived' && (language === 'el' ? 'Αρχειοθετημένο' : 'Archived')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedQuestionnaire(questionnaire);
                        setShowViewModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={language === 'el' ? 'Προβολή' : 'View'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {questionnaire.status === 'draft' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedQuestionnaire(questionnaire);
                            setFormBuilderMode('edit');
                            setNewQuestionnaireName(questionnaire.name);
                            // Φόρτωση schema από το questionnaire
                            try {
                              const schema = questionnaire.schema || { components: [] };
                              setCurrentFormSchema(schema);
                              console.log('Loading questionnaire schema for edit:', schema);
                            } catch (error) {
                              console.error('Error loading questionnaire schema:', error);
                              setCurrentFormSchema({ components: [] });
                            }
                            setShowFormBuilder(true);
                          }}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={language === 'el' ? 'Επεξεργασία' : 'Edit'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditForm(questionnaire)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title={language === 'el' ? 'Επεξεργασία Φόρμας' : 'Edit Form'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleSelectTheme(questionnaire)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title={language === 'el' ? 'Επιλογή Θέματος' : 'Select Theme'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                          </svg>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedQuestionnaire(questionnaire);
                        setShowPreview(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={language === 'el' ? 'Προεπισκόπηση' : 'Preview'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{questionnaire.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {questionnaire.description || (language === 'el' ? 'Περιγραφή ερωτηματολογίου' : 'Questionnaire description')}
                </p>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {language === 'el' ? 'Απαντήσεις' : 'Responses'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {questionnaire.currentResponses || questionnaire.responses || 0}/{questionnaire.targetResponses || 100}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${questionnaire.completionRate || 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {new Date(questionnaire.createdAt).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')}
                    </span>
                    <span className="text-gray-600 font-medium">
                      {questionnaire.completionRate || 0}%
                    </span>
                  </div>
                </div>

                {/* Assignment Info */}
                {questionnaire.status === 'assigned' && questionnaire.assignedUsers && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-orange-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      <span className="font-medium">
                        {language === 'el' 
                          ? `Ανατεθειμένο σε ${questionnaire.assignedUsers.length} χρήστες`
                          : `Assigned to ${questionnaire.assignedUsers.length} users`
                        }
                      </span>
                    </div>
                    {questionnaire.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {language === 'el' ? 'Λήξη:' : 'Due:'} {new Date(questionnaire.dueDate).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header - Full Width */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        userRole={user?.role === 'Administrator' ? 'admin' : user?.role === 'analyst' ? 'analyst' : 'farmer'}
        user={user ? {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email
        } : undefined}
        onLogout={logout}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          language={language}
          user={user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          } : undefined}
          onLogout={logout}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'el' ? 'Δημιουργία Νέου Ερωτηματολογίου' : 'Create New Questionnaire'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Όνομα Ερωτηματολογίου' : 'Questionnaire Name'}
                </label>
                <input
                  type="text"
                  value={newQuestionnaireName}
                  onChange={(e) => setNewQuestionnaireName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={language === 'el' ? 'Εισάγετε όνομα...' : 'Enter name...'}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewQuestionnaireName('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {language === 'el' ? 'Ακύρωση' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (newQuestionnaireName.trim()) {
                    setShowCreateModal(false);
                    setFormBuilderMode('create');
                    setCurrentFormSchema({ components: [] }); // Καθαρό schema για νέο
                    setShowFormBuilder(true);
                  }
                }}
                disabled={!newQuestionnaireName.trim()}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {language === 'el' ? 'Δημιουργία' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedQuestionnaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedQuestionnaire.name}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Questionnaire Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {language === 'el' ? 'Κατάσταση' : 'Status'}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedQuestionnaire.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedQuestionnaire.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedQuestionnaire.status === 'assigned'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedQuestionnaire.status === 'active' && (language === 'el' ? 'Ενεργό' : 'Active')}
                    {selectedQuestionnaire.status === 'draft' && (language === 'el' ? 'Πρόχειρο' : 'Draft')}
                    {selectedQuestionnaire.status === 'assigned' && (language === 'el' ? 'Ανατεθειμένο' : 'Assigned')}
                    {selectedQuestionnaire.status === 'completed' && (language === 'el' ? 'Ολοκληρωμένο' : 'Completed')}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {language === 'el' ? 'Απαντήσεις' : 'Responses'}
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedQuestionnaire.currentResponses || selectedQuestionnaire.responses || 0}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {language === 'el' ? 'Πρόοδος' : 'Progress'}
                </h4>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${selectedQuestionnaire.completionRate || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedQuestionnaire.completionRate || 0}% {language === 'el' ? 'ολοκλήρωση' : 'complete'}
                </p>
              </div>

              {/* Assignment Information */}
              {selectedQuestionnaire.status === 'assigned' && selectedQuestionnaire.assignedUsers && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {language === 'el' ? 'Ανατεθειμένο σε' : 'Assigned to'}
                  </h4>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {language === 'el' 
                          ? `Ανατεθειμένο σε ${selectedQuestionnaire.assignedUsers.length} χρήστες:`
                          : `Assigned to ${selectedQuestionnaire.assignedUsers.length} users:`
                        }
                      </span>
                    </div>
                    
                    {/* Users List */}
                    <div className="space-y-2">
                      {getAssignedUsersDetails(selectedQuestionnaire.assignedUsers).map((user: any) => (
                        <div key={user.id} className="bg-white p-3 rounded-lg border border-orange-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'surveyor' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role === 'admin' ? (language === 'el' ? 'Διαχειριστής' : 'Administrator') :
                                 user.role === 'surveyor' ? (language === 'el' ? 'Ερευνητής' : 'Surveyor') :
                                 (language === 'el' ? 'Ερωτώμενος' : 'Respondent')}
                              </span>
                              {user.department && (
                                <p className="text-xs text-gray-500 mt-1">{user.department}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedQuestionnaire.dueDate && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          {language === 'el' ? 'Λήξη:' : 'Due:'} 
                        </span>
                        {' '}
                        {new Date(selectedQuestionnaire.dueDate).toLocaleDateString(
                          language === 'el' ? 'el-GR' : 'en-US',
                          { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                      </p>
                    )}
                    {selectedQuestionnaire.assignedAt && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          {language === 'el' ? 'Ανατέθηκε:' : 'Assigned:'} 
                        </span>
                        {' '}
                        {new Date(selectedQuestionnaire.assignedAt).toLocaleDateString(
                          language === 'el' ? 'el-GR' : 'en-US',
                          { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {language === 'el' ? 'Ημερομηνία Δημιουργίας' : 'Created Date'}
                </h4>
                <p className="text-gray-600">
                  {new Date(selectedQuestionnaire.createdAt).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {language === 'el' ? 'Κλείσιμο' : 'Close'}
              </button>
              {selectedQuestionnaire.status === 'draft' && (
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setFormBuilderMode('edit');
                    setNewQuestionnaireName(selectedQuestionnaire.name);
                    setShowFormBuilder(true);
                  }}
                  className="flex-1 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {language === 'el' ? 'Επεξεργασία' : 'Edit'}
                </button>
              )}
              {selectedQuestionnaire.status === 'assigned' && (
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleUnassignQuestionnaire(selectedQuestionnaire);
                  }}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {language === 'el' ? 'Αποσυσχέτιση' : 'Unassign'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Builder Modal */}
      {showFormBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9000 }}>
          <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden mx-4 flex flex-col" style={{ zIndex: 9001 }}>
            <div className="px-8 py-6 border-b border-gray-200 flex-shrink-0" style={{ backgroundColor: '#004B87' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  🛠️ {formBuilderMode === 'create' 
                    ? (language === 'el' ? 'Δημιουργία Ερωτηματολογίου' : 'Create Questionnaire')
                    : (language === 'el' ? 'Επεξεργασία Ερωτηματολογίου' : 'Edit Questionnaire')
                  }
                  {selectedQuestionnaire?.name && (
                    <span className="ml-2 text-blue-200">- {selectedQuestionnaire.name}</span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setShowFormBuilder(false);
                    setNewQuestionnaireName('');
                    setSelectedQuestionnaire(null);
                  }}
                  className="text-white hover:text-blue-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50 p-4">
              <div className="bg-white rounded-lg shadow-sm" 
                   style={{ 
                     minHeight: '700px', 
                     padding: '20px',
                     position: 'relative',
                     zIndex: 1
                   }}>
                <FormBuilder 
                  initialForm={currentFormSchema.components ? currentFormSchema : { 
                    components: [],
                    display: 'form'
                  }}
                  onChange={(form: any) => {
                    console.log('Form schema updated:', form);
                    setCurrentFormSchema(form);
                  }}
                  onBuilderReady={(builder: any) => {
                    console.log('FormBuilder ready:', builder);
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-8 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4 flex-shrink-0">
              <button
                onClick={() => {
                  setShowFormBuilder(false);
                  setNewQuestionnaireName('');
                  setSelectedQuestionnaire(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                {language === 'el' ? 'Ακύρωση' : 'Cancel'}
              </button>
              <button
                onClick={saveQuestionnaire}
                disabled={isSaving}
                className="bg-[#004B87] text-white px-6 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSaving && (
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSaving 
                  ? (language === 'el' ? 'Αποθηκεύει...' : 'Saving...') 
                  : (language === 'el' ? 'Αποθήκευση' : 'Save')
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Preview Modal */}
      {showPreview && selectedQuestionnaire && (
        <FormPreview
          questionnaire={selectedQuestionnaire}
          onClose={() => setShowPreview(false)}
          language={language}
        />
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && assignmentQuestionnaire && (
        <QuestionnaireAssignment
          questionnaireId={assignmentQuestionnaire.id}
          questionnaireName={assignmentQuestionnaire.name}
          onClose={() => {
            setShowAssignmentModal(false);
            setAssignmentQuestionnaire(null);
          }}
          onAssign={handleQuestionnaireAssignment}
          language={language}
        />
      )}

      {/* Theme Selector Modal */}
      {showThemeSelector && themeSelectorQuestionnaire && (
        <ThemeSelector
          isOpen={showThemeSelector}
          onClose={() => {
            setShowThemeSelector(false);
            setThemeSelectorQuestionnaire(null);
          }}
          onThemeSelect={handleThemeSelection}
          questionnaireName={themeSelectorQuestionnaire.name}
          currentThemeId={themeSelectorQuestionnaire.theme?.id}
          language={language}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;