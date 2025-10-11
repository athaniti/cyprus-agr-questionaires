import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Questionnaires } from './components/Questionnaires';
import { QuestionnaireBuilder } from './components/QuestionnaireBuilder';
import { Themes } from './components/Themes';
import { Samples } from './components/Samples';
import { Quotas } from './components/Quotas';
import { Locations } from './components/Locations';
import { Reports } from './components/Reports';

type View = 'dashboard' | 'questionnaires' | 'builder' | 'themes' | 'samples' | 'quotas' | 'locations' | 'reports';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [language, setLanguage] = useState<'el' | 'en'>('el');
  const [userRole] = useState<'admin' | 'analyst'>('admin');

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
  };

  const handleCreateQuestionnaire = () => {
    setCurrentView('builder');
  };

  const handleEditQuestionnaire = (id: string) => {
    console.log('Edit questionnaire:', id);
    setCurrentView('builder');
  };

  const handleBackToQuestionnaires = () => {
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
          />
        );
      case 'builder':
        return (
          <QuestionnaireBuilder
            language={language}
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
