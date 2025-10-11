import { Bell, Globe, User } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

interface HeaderProps {
  language: 'el' | 'en';
  onLanguageChange: (lang: 'el' | 'en') => void;
  userRole: 'admin' | 'analyst';
}

const translations = {
  el: {
    notifications: 'Ειδοποιήσεις',
    profile: 'Προφίλ',
    settings: 'Ρυθμίσεις',
    logout: 'Αποσύνδεση',
    admin: 'Διαχειριστής',
    analyst: 'Αναλυτής'
  },
  en: {
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    admin: 'Administrator',
    analyst: 'Analyst'
  }
};

export function Header({ language, onLanguageChange, userRole }: HeaderProps) {
  const t = translations[language];

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section - Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#004B87' }}>
            <span className="text-white text-lg">🌾</span>
          </div>
          <div>
            <h1 className="text-gray-900">
              {language === 'el' ? 'Υπουργείο Γεωργίας Κύπρου' : 'Ministry of Agriculture Cyprus'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'el' ? 'Σύστημα Διαχείρισης Ερωτηματολογίων' : 'Questionnaire Management System'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLanguageChange(language === 'el' ? 'en' : 'el')}
          className="gap-2 rounded-xl"
        >
          <Globe className="h-4 w-4" />
          <span>{language === 'el' ? 'ΕΛ' : 'EN'}</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative rounded-xl">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs flex items-center justify-center text-white" style={{ backgroundColor: '#0C9A8F' }}>
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>{t.notifications}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2 space-y-2">
              <div className="p-3 rounded-lg bg-gray-50 text-sm">
                <p>{language === 'el' ? 'Νέο ερωτηματολόγιο υποβλήθηκε' : 'New questionnaire submitted'}</p>
                <p className="text-xs text-gray-500 mt-1">2 {language === 'el' ? 'ώρες πριν' : 'hours ago'}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 text-sm">
                <p>{language === 'el' ? 'Ποσοστώσεις ενημερώθηκαν' : 'Quotas updated'}</p>
                <p className="text-xs text-gray-500 mt-1">5 {language === 'el' ? 'ώρες πριν' : 'hours ago'}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 text-sm">
                <p>{language === 'el' ? 'Νέος χρήστης προστέθηκε' : 'New user added'}</p>
                <p className="text-xs text-gray-500 mt-1">1 {language === 'el' ? 'μέρα πριν' : 'day ago'}</p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 rounded-xl">
              <Avatar className="h-8 w-8">
                <AvatarFallback style={{ backgroundColor: '#0C9A8F', color: 'white' }}>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm">Admin User</span>
                <Badge variant="secondary" className="text-xs h-4 px-1">
                  {userRole === 'admin' ? t.admin : t.analyst}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t.profile}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t.settings}</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">{t.logout}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
