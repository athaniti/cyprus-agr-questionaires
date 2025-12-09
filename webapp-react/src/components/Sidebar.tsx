import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Palette, 
  Send, 
  Target, 
  MapPin, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Database,
  Monitor,
  Users,
  Settings,
  Mail
} from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  language: 'el' | 'en';
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

const translations = {
  el: {
    dashboard: 'Πίνακας Ελέγχου',
    questionnaires: 'Ερωτηματολόγια',
    themes: 'Θέματα',
    samples: 'Δείγματα',
    invitations: 'Προσκλήσεις',
    quotas: 'Όρια',
    quotaManagement: 'Διαχείριση Ορίων',
    quotaMonitoring: 'Παρακολούθηση',
    locations: 'Τοποθεσίες',
    reports: 'Αναφορές',
    formResponses: 'Προβολή Απαντήσεων',
    ministry: 'Υπουργείο Γεωργίας'
  },
  en: {
    dashboard: 'Dashboard',
    questionnaires: 'Questionnaires',
    themes: 'Themes',
    samples: 'Samples',
    invitations: 'Invitations',
    quotas: 'Quotas',
    quotaManagement: 'Quota Management',
    quotaMonitoring: 'Monitoring',
    locations: 'Locations',
    reports: 'Reports',
    formResponses: 'Form Responses',
    ministry: 'Ministry of Agriculture'
  }
};

export function Sidebar({ currentView, onViewChange, language, user, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['quotas']);
  const t = translations[language];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'questionnaires', icon: FileText, label: t.questionnaires },
    { id: 'form-responses', icon: Database, label: t.formResponses },
    { id: 'themes', icon: Palette, label: t.themes },
    { id: 'samples', icon: Send, label: t.samples },
    { id: 'invitations', icon: Mail, label: t.invitations },
    { 
      id: 'quotas', 
      icon: Target, 
      label: t.quotas,
      hasSubMenu: true,
      subItems: [
        { id: 'quotas', icon: Settings, label: t.quotaManagement },
        { id: 'quota-monitoring', icon: Monitor, label: t.quotaMonitoring }
      ]
    },
    { id: 'locations', icon: MapPin, label: t.locations },
    { id: 'reports', icon: BarChart3, label: t.reports }
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button at top - Better styling */}
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300",
            isCollapsed ? "px-2" : ""
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">{language === 'el' ? 'Σύμπτυξη' : 'Collapse'}</span>
            </>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.subItems && item.subItems.some(sub => currentView === sub.id));
            const isExpanded = expandedMenus.includes(item.id);
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.hasSubMenu && !isCollapsed) {
                      toggleMenu(item.id);
                    } else {
                      onViewChange(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                    isActive 
                      ? "text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-50",
                    isCollapsed && "justify-center"
                  )}
                  style={isActive ? { backgroundColor: '#004B87' } : {}}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm flex-1 text-left">{item.label}</span>
                      {item.hasSubMenu && (
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      )}
                    </>
                  )}
                </button>
                
                {/* Sub-menu items */}
                {item.hasSubMenu && !isCollapsed && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = currentView === subItem.id;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => onViewChange(subItem.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm",
                            isSubActive 
                              ? "text-white shadow-sm" 
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                          style={isSubActive ? { backgroundColor: '#0C9A8F' } : {}}
                        >
                          <SubIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-left">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer - Always visible */}
      <div className="border-t-2 border-blue-200 bg-blue-50 flex-shrink-0 mt-auto">
        <div className="p-3 space-y-2">
          {user && !isCollapsed && (
            <div className="border-b border-blue-200 pb-2 mb-2">
              <div className="text-xs text-blue-800 font-semibold truncate">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.email
                }
              </div>
              <div className="text-xs text-blue-600 truncate">
                {user.email}
              </div>
              <div className="text-xs text-blue-500 capitalize">
                {user.role === 'Administrator' ? (language === 'el' ? 'Διαχειριστής' : 'Administrator') :
                 user.role === 'analyst' ? (language === 'el' ? 'Αναλυτής' : 'Analyst') :
                 (language === 'el' ? 'Αγρότης' : 'Farmer')}
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="mt-1 text-xs text-red-600 hover:text-red-800 hover:underline"
                >
                  {language === 'el' ? 'Αποσύνδεση' : 'Logout'}
                </button>
              )}
            </div>
          )}
          {user && isCollapsed && (
            <div className="border-b border-blue-200 pb-2 mb-2">
              <div className="text-xs text-blue-800 font-semibold text-center">
                {user.firstName ? user.firstName.charAt(0) : user.email.charAt(0)}
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="mt-1 text-xs text-red-600 hover:text-red-800 w-full text-center"
                  title={language === 'el' ? 'Αποσύνδεση' : 'Logout'}
                >
                  ↗
                </button>
              )}
            </div>
          )}
          {!isCollapsed ? (
            <div className="text-xs text-blue-700 text-center font-bold">
              v1.0.0 • Cyprus 2025
            </div>
          ) : (
            <div className="text-xs text-blue-700 text-center font-bold">
              v1.0
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
