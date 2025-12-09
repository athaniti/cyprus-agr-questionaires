import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { UserManagement } from './components/UserManagement';
import { SampleManagementPage } from './pages/SampleManagementPage';
import { ThemesPage } from './pages/ThemesPage';
import InvitationManagementPage from './pages/InvitationManagementPage';
import LocationManagementHub from './components/LocationManagementHub';
import QuotaManagementPage from './pages/QuotaManagementPage';
import QuotaMonitoringDashboardPage from './pages/QuotaMonitoringDashboardPage';
import ResponsesPage from './pages/ResponsesPage';
import QuestionnairesPage from './pages/QuesitionnairesPage';



function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  // Εάν ο χρήστης δεν είναι συνδεδεμένος, εμφάνισε το Login
  if (!isAuthenticated) {
    return <Login />;
  }
 
  const [currentView, setCurrentView] = useState('questionnaires');
  const [language, setLanguage] = useState<'el' | 'en'>('el');
  


  const renderView = () => {
    try {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard />;
        case 'questionnaires':
          return <QuestionnairesPage language={language}/>;
        case 'samples':
          return <SampleManagementPage />;
        case 'invitations':
          return <InvitationManagementPage />;
        case 'locations':
          return <LocationManagementHub />;
        case 'quotas':
          return <QuotaManagementPage />;
        case 'quota-monitoring':
          return <QuotaMonitoringDashboardPage />;
        case 'reports':
          return <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{language === 'el' ? 'Αναφορές' : 'Reports'}</h2>
            <p className="text-gray-600">{language === 'el' ? 'Αναφορές και αναλύσεις' : 'Reports and analytics'}</p>
          </div>;
        case 'form-responses':
          return <ResponsesPage language={language} />;
        case 'users':
          return <UserManagement language={language} />;
        case 'themes':
          return <ThemesPage language={language} />;
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