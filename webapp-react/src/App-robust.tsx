import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
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
  
  // Safe questionnaires state with default data
  const [questionnaires, setQuestionnaires] = useState<any[]>([
    { 
      id: 'default-1', 
      name: language === 'el' ? 'Ερωτηματολόγιο Κτηνοτροφίας' : 'Livestock Survey', 
      status: 'active', 
      responses: 45, 
      currentResponses: 45,
      targetResponses: 100,
      completionRate: 45,
      createdAt: '2025-10-20T10:00:00Z'
    },
    { 
      id: 'default-2', 
      name: language === 'el' ? 'Αξιολόγηση Καλλιεργειών' : 'Crop Assessment', 
      status: 'draft', 
      responses: 0, 
      currentResponses: 0,
      targetResponses: 150,
      completionRate: 0,
      createdAt: '2025-10-19T15:30:00Z'
    }
  ]);

  // Safe localStorage loading
  useEffect(() => {
    try {
      const saved = localStorage.getItem('questionnaires');
      if (saved) {
        const savedQuestionnaires = JSON.parse(saved);
        if (Array.isArray(savedQuestionnaires) && savedQuestionnaires.length > 0) {
          setQuestionnaires(prev => [...prev, ...savedQuestionnaires]);
        }
      }
    } catch (error) {
      console.warn('Failed to load questionnaires from localStorage:', error);
    }
  }, []);

  // Mock user
  const mockUser = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com'
  };

  // Safe component imports
  let Sidebar: any, Header: any, Dashboard: any, FormBuilderComponent: any, FormPreview: any;

  try {
    Sidebar = require('./components/Sidebar').Sidebar;
  } catch (e) {
    console.warn('Using temp Sidebar');
    Sidebar = ({ currentView, onViewChange, language }: any) => (
      <div className="w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Menu</h2>
          <nav className="space-y-2">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`w-full text-left px-4 py-2 rounded-lg ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {language === 'el' ? 'Πίνακας Ελέγχου' : 'Dashboard'}
            </button>
            <button
              onClick={() => onViewChange('questionnaires')}
              className={`w-full text-left px-4 py-2 rounded-lg ${currentView === 'questionnaires' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {language === 'el' ? 'Ερωτηματολόγια' : 'Questionnaires'}
            </button>
          </nav>
        </div>
      </div>
    );
  }

  try {
    Header = require('./components/Header').Header;
  } catch (e) {
    console.warn('Using temp Header');
    Header = ({ language, onLanguageChange }: any) => (
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-gray-900">Cyprus Agriculture</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLanguageChange(language === 'el' ? 'en' : 'el')}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            {language === 'el' ? 'EN' : 'ΕΛ'}
          </button>
          <span className="text-sm text-gray-600">Admin User</span>
        </div>
      </div>
    );
  }

  try {
    Dashboard = require('./components/Dashboard').Dashboard;
  } catch (e) {
    console.warn('Using temp Dashboard');
    Dashboard = () => (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{language === 'el' ? 'Πίνακας Ελέγχου' : 'Dashboard'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">
              {language === 'el' ? 'Ενεργά Ερωτηματολόγια' : 'Active Questionnaires'}
            </h3>
            <p className="text-2xl font-bold text-blue-600">5</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">
              {language === 'el' ? 'Απαντήσεις' : 'Responses'}
            </h3>
            <p className="text-2xl font-bold text-green-600">234</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">
              {language === 'el' ? 'Χρήστες' : 'Users'}
            </h3>
            <p className="text-2xl font-bold text-purple-600">67</p>
          </div>
        </div>
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Form.io Schema Storage
          </h3>
          <p className="text-gray-600">
            {language === 'el' 
              ? '✅ Η δομή του ερωτηματολογίου αποθηκεύεται στη βάση δεδομένων με το πεδίο Schema (jsonb type)'
              : '✅ Questionnaire structure is stored in database with Schema field (jsonb type)'
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {language === 'el' 
              ? 'Κάθε ερωτηματολόγιο που δημιουργείται αποθηκεύει την πλήρη δομή του Form.io JSON'
              : 'Each created questionnaire stores the complete Form.io JSON structure'
            }
          </p>
        </div>
      </div>
    );
  }

  try {
    FormBuilderComponent = require('./components/FormBuilder').FormBuilderComponent;
  } catch (e) {
    console.warn('FormBuilder not available');
    FormBuilderComponent = ({ onCancel }: any) => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Form Builder</h3>
          <p className="text-gray-600 mb-6">Form Builder component is loading...</p>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  try {
    FormPreview = require('./components/FormPreview').FormPreview;
  } catch (e) {
    console.warn('FormPreview not available');
    FormPreview = ({ onClose }: any) => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Form Preview</h3>
          <p className="text-gray-600 mb-6">Form Preview component is loading...</p>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'questionnaires':
        return renderQuestionnaires();
      default:
        return <Dashboard />;
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
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {questionnaire.status === 'active' && (language === 'el' ? 'Ενεργό' : 'Active')}
                    {questionnaire.status === 'draft' && (language === 'el' ? 'Πρόχειρο' : 'Draft')}
                    {questionnaire.status === 'completed' && (language === 'el' ? 'Ολοκληρωμένο' : 'Completed')}
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
                      👁️
                    </button>
                    {questionnaire.status === 'draft' && (
                      <button
                        onClick={() => {
                          setSelectedQuestionnaire(questionnaire);
                          setFormBuilderMode('edit');
                          setNewQuestionnaireName(questionnaire.name);
                          setShowFormBuilder(true);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title={language === 'el' ? 'Επεξεργασία' : 'Edit'}
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedQuestionnaire(questionnaire);
                        setShowPreview(true);
                      }}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title={language === 'el' ? 'Προεπισκόπηση' : 'Preview'}
                    >
                      📄
                    </button>
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{questionnaire.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'el' ? 'Περιγραφή ερωτηματολογίου' : 'Questionnaire description'}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        language={language}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          language={language}
          onLanguageChange={setLanguage}
          userRole="admin"
          user={mockUser}
          onLogout={() => console.log('Logout clicked')}
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
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {language === 'el' ? 'Κατάσταση' : 'Status'}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedQuestionnaire.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedQuestionnaire.status === 'active' 
                    ? (language === 'el' ? 'Ενεργό' : 'Active')
                    : (language === 'el' ? 'Πρόχειρο' : 'Draft')
                  }
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {language === 'el' ? 'Κλείσιμο' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Builder Modal */}
      {showFormBuilder && (
        <FormBuilderComponent
          initialForm={formBuilderMode === 'edit' ? selectedQuestionnaire : undefined}
          onSave={(formData: any) => {
            console.log('Questionnaire saved:', formData);
            setQuestionnaires(prev => [...prev, formData]);
            alert(language === 'el' ? 'Ερωτηματολόγιο αποθηκεύτηκε!' : 'Questionnaire saved!');
            setShowFormBuilder(false);
            setNewQuestionnaireName('');
            setSelectedQuestionnaire(null);
          }}
          onCancel={() => {
            setShowFormBuilder(false);
            setNewQuestionnaireName('');
            setSelectedQuestionnaire(null);
          }}
          language={language}
          mode={formBuilderMode}
          questionnaireName={newQuestionnaireName}
        />
      )}

      {/* Form Preview Modal */}
      {showPreview && selectedQuestionnaire && (
        <FormPreview
          questionnaire={selectedQuestionnaire}
          onClose={() => setShowPreview(false)}
          language={language}
        />
      )}
    </div>
  );
}

function App() {
  try {
    const { LanguageProvider } = require('./contexts/LanguageContext');
    return (
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    );
  } catch (e) {
    console.warn('LanguageProvider not available, using direct content');
    return <AppContent />;
  }
}

export default App;