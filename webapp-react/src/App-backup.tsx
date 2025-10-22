import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Questionnaires } from './components/Questionnaires';
import { Themes } from './components/Themes';
import { Locations } from './components/Locations';
import { Reports } from './components/Reports';

type View = 'dashboard' | 'questionnaires' | 'builder' | 'viewer' | 'themes' | 'samples' | 'quotas' | 'locations' | 'reports';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [language, setLanguage] = useState<'el' | 'en'>('el');

  // Mock user for now
  const mockUser = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com'
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'questionnaires':
        return (
          <Questionnaires
            language={language}
            onCreateNew={() => console.log('Create new questionnaire')}
            onEditQuestionnaire={(id) => console.log('Edit questionnaire:', id)}
            onViewQuestionnaire={(id) => console.log('View questionnaire:', id)}
          />
        );
      case 'themes':
        return <Themes />;
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
          userRole="admin"
          user={mockUser}
          onLogout={() => console.log('Logout clicked')}
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
