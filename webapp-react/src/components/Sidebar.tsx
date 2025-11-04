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
  Database
} from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  language: 'el' | 'en';
}

const translations = {
  el: {
    dashboard: 'Πίνακας Ελέγχου',
    questionnaires: 'Ερωτηματολόγια',
    themes: 'Θέματα',
    samples: 'Δείγματα & Προσκλήσεις',
    quotas: 'Ποσοστώσεις',
    locations: 'Τοποθεσίες',
    reports: 'Αναφορές',
    formResponses: 'Προβολή Απαντήσεων',
    ministry: 'Υπουργείο Γεωργίας'
  },
  en: {
    dashboard: 'Dashboard',
    questionnaires: 'Questionnaires',
    themes: 'Themes',
    samples: 'Samples & Invitations',
    quotas: 'Quotas',
    locations: 'Locations',
    reports: 'Reports',
    formResponses: 'Form Responses',
    ministry: 'Ministry of Agriculture'
  }
};

export function Sidebar({ currentView, onViewChange, language }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const t = translations[language];

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'questionnaires', icon: FileText, label: t.questionnaires },
    { id: 'form-responses', icon: Database, label: t.formResponses },
    { id: 'themes', icon: Palette, label: t.themes },
    { id: 'samples', icon: Send, label: t.samples },
    { id: 'quotas', icon: Target, label: t.quotas },
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
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#004B87' }}>
              <span className="text-white">🌾</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs" style={{ color: '#004B87' }}>{t.ministry}</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
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
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            v1.0.0 • Cyprus 2025
          </div>
        </div>
      )}
    </div>
  );
}
