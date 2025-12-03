import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Theme, ThemePreview } from './ThemePreview';
import { 
  Palette, Monitor, Smartphone
} from 'lucide-react';


interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeSelect: (theme: Theme) => void;
  allThemes: Theme[];
  questionnaire: any;
  language: 'el' | 'en';
}



const translations = {
  el: {
    title: 'Επιλογή Θέματος',
    subtitle: 'Επιλέξτε ένα θέμα για το ερωτηματολόγιο',
    apply: 'Εφαρμογή',
    cancel: 'Ακύρωση',
    desktopPreview: 'Προεπισκόπηση Υπολογιστή',
    mobilePreview: 'Προεπισκόπηση Κινητού',
  },
  en: {
    title: 'Theme Selection',
    subtitle: 'Choose a theme for the questionnaire',
    cancel: 'Cancel',
    apply: 'Apply',
    desktopPreview: 'Desktop Preview',
    mobilePreview: 'Mobile Preview'
  }
};

export function ThemeSelector({ 
  isOpen, 
  onClose, 
  onThemeSelect, 
  allThemes,
  questionnaire, 
  language 
}: ThemeSelectorProps) {
  const [selectedThemeId, setSelectedThemeId] = useState(questionnaire.themeId);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const t = translations[language];

  const handleApply = () => {
    const selectedTheme = allThemes.find(theme => theme.id === selectedThemeId);
    if (selectedTheme) {
      onThemeSelect(selectedTheme);
    }
    onClose();
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl shadow-lg !max-w-[1400px]" style={{ width: 'min(1400px, 96vw)' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t.title}
          </DialogTitle>
          <p className="text-gray-600">
            {t.subtitle}: "{questionnaire.name}"
          </p>
          <div className="flex gap-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="gap-2"
            >
              <Monitor className="h-4 w-4" />
              {t.desktopPreview}
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="gap-2"
            >
              <Smartphone className="h-4 w-4" />
              {t.mobilePreview}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-6">
          {allThemes.map((theme) => (
            <Card 
              key={theme.id} 
              className={`w-full cursor-pointer transition-all duration-200 ${
                selectedThemeId === theme.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md hover:ring-1 hover:ring-gray-300 bg-white'
              }`}
              onClick={() => setSelectedThemeId(theme.id)}
            >
              <CardContent className="p-4">
                <ThemePreview theme={theme} mode={previewMode} questionnaire={questionnaire}/>
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

  );
}