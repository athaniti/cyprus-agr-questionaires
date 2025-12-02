import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Palette, Check, Eye } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description?: string;
  logoPosition: 'left' | 'center' | 'right';
  bodyFont: string;
  bodyFontSize: number;
  headerFont: string;
  headerFontSize: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  isDefault?: boolean;
}

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeSelect: (theme: Theme) => void;
  questionnaireName: string;
  currentThemeId?: string;
  language: 'el' | 'en';
}

const mockThemes: Theme[] = [
  {
    id: '1',
    name: 'Κλασικό Θέμα Κύπρου',
    description: 'Παραδοσιακό θέμα με τα χρώματα της Κύπρου',
    logoPosition: 'left',
    bodyFont: 'Arial, sans-serif',
    bodyFontSize: 14,
    headerFont: 'Georgia, serif',
    headerFontSize: 24,
    primaryColor: '#004B87',
    secondaryColor: '#0C9A8F',
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    isDefault: true
  },
  {
    id: '2',
    name: 'Μοντέρνο Θέμα',
    description: 'Σύγχρονο θέμα με καθαρές γραμμές',
    logoPosition: 'center',
    bodyFont: 'Roboto, sans-serif',
    bodyFontSize: 16,
    headerFont: 'Montserrat, sans-serif',
    headerFontSize: 28,
    primaryColor: '#2563EB',
    secondaryColor: '#7C3AED',
    backgroundColor: '#F8FAFC',
    textColor: '#1E293B'
  },
  {
    id: '3',
    name: 'Φυσικό Θέμα',
    description: 'Θέμα εμπνευσμένο από τη φύση',
    logoPosition: 'right',
    bodyFont: 'Open Sans, sans-serif',
    bodyFontSize: 15,
    headerFont: 'Lato, sans-serif',
    headerFontSize: 26,
    primaryColor: '#059669',
    secondaryColor: '#D97706',
    backgroundColor: '#F0FDF4',
    textColor: '#064E3B'
  },
  {
    id: '4',
    name: 'Ελεγαντικό Σκούρο',
    description: 'Σκούρο θέμα για μοντέρνα εμφάνιση',
    logoPosition: 'center',
    bodyFont: 'Inter, sans-serif',
    bodyFontSize: 15,
    headerFont: 'Poppins, sans-serif',
    headerFontSize: 30,
    primaryColor: '#1F2937',
    secondaryColor: '#6366F1',
    backgroundColor: '#111827',
    textColor: '#F9FAFB'
  },
  {
    id: '5',
    name: 'Θερμό Πορτοκαλί',
    description: 'Φιλικό θέμα με θερμά χρώματα',
    logoPosition: 'left',
    bodyFont: 'Source Sans Pro, sans-serif',
    bodyFontSize: 16,
    headerFont: 'Playfair Display, serif',
    headerFontSize: 32,
    primaryColor: '#EA580C',
    secondaryColor: '#FBBF24',
    backgroundColor: '#FFFBEB',
    textColor: '#92400E'
  }
];

const translations = {
  el: {
    title: 'Επιλογή Θέματος',
    subtitle: 'Επιλέξτε ένα θέμα για το ερωτηματολόγιο',
    currentTheme: 'Τρέχον Θέμα',
    defaultTheme: 'Προεπιλεγμένο',
    preview: 'Προεπισκόπηση',
    select: 'Επιλογή',
    selected: 'Επιλεγμένο',
    cancel: 'Ακύρωση',
    apply: 'Εφαρμογή',
    logoPosition: 'Θέση Λογότυπου',
    fonts: 'Γραμματοσειρές',
    colors: 'Χρώματα',
    primary: 'Κύριο',
    secondary: 'Δευτερεύον',
    background: 'Φόντο',
    text: 'Κείμενο'
  },
  en: {
    title: 'Theme Selection',
    subtitle: 'Choose a theme for the questionnaire',
    currentTheme: 'Current Theme',
    defaultTheme: 'Default',
    preview: 'Preview',
    select: 'Select',
    selected: 'Selected',
    cancel: 'Cancel',
    apply: 'Apply',
    logoPosition: 'Logo Position',
    fonts: 'Fonts',
    colors: 'Colors',
    primary: 'Primary',
    secondary: 'Secondary',
    background: 'Background',
    text: 'Text'
  }
};

export function ThemeSelector({ 
  isOpen, 
  onClose, 
  onThemeSelect, 
  questionnaireName, 
  currentThemeId = '1',
  language 
}: ThemeSelectorProps) {
  const [selectedThemeId, setSelectedThemeId] = useState(currentThemeId);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  const t = translations[language];

  const handleThemeSelect = (theme: Theme) => {
    setSelectedThemeId(theme.id);
  };

  const handleApply = () => {
    const selectedTheme = mockThemes.find(theme => theme.id === selectedThemeId);
    if (selectedTheme) {
      onThemeSelect(selectedTheme);
    }
    onClose();
  };

  const handlePreview = (theme: Theme) => {
    setPreviewTheme(theme);
    setShowPreview(true);
  };

  const ThemePreview = ({ theme }: { theme: Theme }) => (
    <div 
      className="p-6 rounded-lg border-2 min-h-[300px]"
      style={{ 
        backgroundColor: theme.backgroundColor,
        borderColor: theme.primaryColor,
        color: theme.textColor
      }}
    >
      <div className={`flex items-center gap-4 mb-6 ${
        theme.logoPosition === 'center' ? 'justify-center' :
        theme.logoPosition === 'right' ? 'justify-end' : 'justify-start'
      }`}>
        <div 
          className="w-12 h-12 rounded"
          style={{ backgroundColor: theme.primaryColor }}
        />
        <h1 
          style={{ 
            fontFamily: theme.headerFont,
            fontSize: `${theme.headerFontSize}px`,
            color: theme.primaryColor
          }}
        >
          {questionnaireName}
        </h1>
      </div>
      
      <div className="space-y-4">
        <p style={{ fontFamily: theme.bodyFont, fontSize: `${theme.bodyFontSize}px` }}>
          {language === 'el' 
            ? 'Αυτό είναι ένα παράδειγμα κειμένου που δείχνει πώς θα φαίνεται το ερωτηματολόγιό σας με αυτό το θέμα.'
            : 'This is sample text showing how your questionnaire will look with this theme.'
          }
        </p>
        
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {language === 'el' ? 'Κύριο Κουμπί' : 'Primary Button'}
          </button>
          <button 
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            {language === 'el' ? 'Δευτερεύον Κουμπί' : 'Secondary Button'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl shadow-lg !max-w-[1400px]" style={{ width: 'min(1400px, 96vw)' }}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t.title}
            </DialogTitle>
            <p className="text-gray-600">
              {t.subtitle}: "{questionnaireName}"
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-6">
            {mockThemes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`w-full cursor-pointer transition-all duration-200 ${
                  selectedThemeId === theme.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md hover:ring-1 hover:ring-gray-300 bg-white'
                }`}
                onClick={() => handleThemeSelect(theme)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{theme.name}</h3>
                    <div className="flex gap-1">
                      {theme.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          {t.defaultTheme}
                        </Badge>
                      )}
                      {selectedThemeId === theme.id && (
                        <Badge className="text-xs bg-blue-500">
                          <Check className="h-3 w-3 mr-1" />
                          {t.selected}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {theme.description && (
                    <p className="text-sm text-gray-600 mb-4">{theme.description}</p>
                  )}

                  {/* Theme Preview */}
                  <ThemePreview theme={theme} />

                  {/* Theme Details */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t.logoPosition}:</span>
                      <span className="capitalize">{theme.logoPosition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t.fonts}:</span>
                      <span>{theme.headerFont.split(',')[0]}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-gray-500">{t.colors}:</span>
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: theme.primaryColor }}
                          title={`${t.primary}: ${theme.primaryColor}`}
                        />
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: theme.secondaryColor }}
                          title={`${t.secondary}: ${theme.secondaryColor}`}
                        />
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: theme.backgroundColor }}
                          title={`${t.background}: ${theme.backgroundColor}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handlePreview(theme);
                      }}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {t.preview}
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleThemeSelect(theme);
                      }}
                      variant={selectedThemeId === theme.id ? "default" : "outline"}
                      className="flex-1"
                    >
                      {selectedThemeId === theme.id ? t.selected : t.select}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button onClick={handleApply}>
              {t.apply}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {showPreview && previewTheme && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl shadow-lg !max-w-[1200px]" style={{ width: 'min(1200px, 92vw)' }}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t.preview}: {previewTheme.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-6">
              <ThemePreview theme={previewTheme} />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                {t.cancel}
              </Button>
              <Button 
                onClick={() => {
                  handleThemeSelect(previewTheme);
                  setShowPreview(false);
                }}
              >
                {t.select}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}