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
  userRole: 'admin' | 'analyst' | 'farmer';
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onLogout?: () => void;
}

const translations = {
  el: {
    notifications: 'Ειδοποιήσεις',
    profile: 'Προφίλ',
    settings: 'Ρυθμίσεις',
    logout: 'Αποσύνδεση',
    admin: 'Διαχειριστής',
    analyst: 'Αναλυτής',
    farmer: 'Αγρότης'
  },
  en: {
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    admin: 'Administrator',
    analyst: 'Analyst',
    farmer: 'Farmer'
  }
};

export function Header({ language, onLanguageChange, userRole, user, onLogout }: HeaderProps) {
  const t = translations[language];

  return (
    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6" style={{ backgroundColor: '#0e2f41' }}>
      {/* Left Section - Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="/cyprus-ministry-logo.png" 
              alt="Cyprus Ministry Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback to stylized text if image fails to load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            <div className="hidden items-center justify-center w-12 h-12 rounded text-sm font-bold text-white" style={{ backgroundColor: '#004B87' }}>
              <span>ΥΓ</span>
            </div>
          </div>
          <div>
            <h1 className="text-white text-base font-semibold leading-tight">
              {language === 'el' ? 'Υπουργείο Γεωργίας, Αγροτικής Ανάπτυξης και Περιβάλλοντος' : 'Ministry of Agriculture, Rural Development and Environment'}
            </h1>
            <p className="text-xs text-gray-300">
              {language === 'el' ? 'Δίκτυο Δεδομένων Βιωσιμότητας Γεωργικών Εκμεταλλεύσεων' : 'Farm Sustainability Data Network System'}
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
          className="gap-2 rounded-xl border-gray-500 text-white hover:bg-gray-700 hover:text-white"
        >
          <Globe className="h-4 w-4" />
          <span>{language === 'el' ? 'ΕΛ' : 'EN'}</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative rounded-xl border-gray-500 text-white hover:bg-gray-700 hover:text-white">
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
            <Button variant="ghost" className="gap-2 rounded-xl text-white hover:bg-gray-700">
              <Avatar className="h-8 w-8">
                <AvatarFallback style={{ backgroundColor: '#0C9A8F', color: 'white' }}>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm">
                  {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                </span>
                <Badge variant="secondary" className="text-xs h-4 px-1">
                  {userRole === 'admin' ? t.admin : userRole === 'farmer' ? t.farmer : t.analyst}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t.profile}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t.settings}</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={onLogout}
            >
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
