import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Questionnaires } from './components/Questionnaires';
import { QuestionnaireBuilder } from './components/QuestionnaireBuilder';
import { QuestionnaireViewer } from './components/QuestionnaireViewer';
import { Themes } from './components/Themes';
import { Samples } from './components/Samples';
import { Quotas } from './components/Quotas';
import { Locations } from './components/Locations';
import { Reports } from './components/Reports';

type View = 'dashboard' | 'questionnaires' | 'builder' | 'viewer' | 'themes' | 'samples' | 'quotas' | 'locations' | 'reports';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [language, setLanguage] = useState<'el' | 'en'>('el');
  const [userRole] = useState<'admin' | 'analyst'>('admin');
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
  };

  const handleCreateQuestionnaire = () => {
    setSelectedQuestionnaireId(null);
    setCurrentView('builder');
  };

  const handleEditQuestionnaire = (id: string) => {
    console.log('Edit questionnaire:', id);
    setSelectedQuestionnaireId(id);
    setCurrentView('builder');
  };

  const handleViewQuestionnaire = (id: string) => {
    console.log('View questionnaire:', id);
    setSelectedQuestionnaireId(id);
    setCurrentView('viewer');
  };

  const handleBackToQuestionnaires = () => {
    setSelectedQuestionnaireId(null);
    setCurrentView('questionnaires');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'questionnaires':
        return (
          <Questionnaires
            language={language}
            onCreateNew={handleCreateQuestionnaire}
            onEditQuestionnaire={handleEditQuestionnaire}
            onViewQuestionnaire={handleViewQuestionnaire}
          />
        );
      case 'builder':
        return (
          <QuestionnaireBuilder
            language={language}
            onBack={handleBackToQuestionnaires}
          />
        );
      case 'viewer':
        return (
          <QuestionnaireViewer
            language={language}
            questionnaireId={selectedQuestionnaireId || ''}
            questionnaireName={language === 'el' ? 'Έρευνα Κτηνοτροφίας 2025' : 'Livestock Survey 2025'}
            questionnaireDescription={language === 'el' 
              ? 'Παρακαλούμε συμπληρώστε τις πληροφορίες για το αγρόκτημά σας' 
              : 'Please fill in the information about your farm'}
            onBack={handleBackToQuestionnaires}
          />
        );
      case 'themes':
        return <Themes />;
      case 'samples':
        return <Samples />;
      case 'quotas':
        return <Quotas />;
      case 'locations':
        return <Locations />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        language={language}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          language={language}
          onLanguageChange={setLanguage}
          userRole={userRole}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
