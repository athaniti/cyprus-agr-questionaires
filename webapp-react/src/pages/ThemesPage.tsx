import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { 
  Plus, Search, MoreVertical, Edit, Trash2, Copy, Eye, 
  Upload, Palette, Type, Monitor, Smartphone, Save, RotateCcw
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Theme, ThemePreview } from '@/components/ThemePreview';



interface ThemesProps {
  language: 'el' | 'en';
}

const translations = {
  el: {
    title: 'Διαχείριση Θεμάτων',
    subHeader: 'Δημιουργία και διαχείριση θεμάτων για τα ερωτηματολόγια',
    createNew: 'Δημιουργία Νέου Θέματος',
    search: 'Αναζήτηση θεμάτων...',
    name: 'Όνομα',
    themeDescription: 'Περιγραφή',
    lastModified: 'Τελευταία Τροποποίηση',
    actions: 'Ενέργειες',
    edit: 'Επεξεργασία',
    duplicate: 'Αντιγραφή',
    delete: 'Διαγραφή',
    themePreview: 'Προεπισκόπηση',
    close: 'Κλείσιμο',
    save: 'Αποθήκευση',
    cancel: 'Ακύρωση',
    // Theme Editor
    themeEditor: 'Επεξεργαστής Θέματος',
    createTheme: 'Δημιουργία Θέματος',
    editTheme: 'Επεξεργασία Θέματος',
    basicInfo: 'Βασικές Πληροφορίες',
    themeName: 'Όνομα Θέματος',
    logoSettings: 'Ρυθμίσεις Λογότυπου',
    uploadLogo: 'Ανέβασμα Λογότυπου',
    logoPosition: 'Θέση Λογότυπου',
    left: 'Αριστερά',
    center: 'Κέντρο',
    right: 'Δεξιά',
    typography: 'Τυπογραφία',
    bodyFont: 'Γραμματοσειρά Σώματος',
    bodyFontSize: 'Μέγεθος Γραμματοσειράς Σώματος',
    headerFont: 'Γραμματοσειρά Επικεφαλίδων',
    headerFontSize: 'Μέγεθος Γραμματοσειράς Επικεφαλίδων',
    colors: 'Χρώματα',
    primaryColor: 'Κύριο Χρώμα',
    secondaryColor: 'Δευτερεύον Χρώμα',
    backgroundColor: 'Χρώμα Φόντου',
    textColor: 'Χρώμα Κειμένου',
    preview: 'Προεπισκόπηση',
    desktopPreview: 'Προεπισκόπηση Υπολογιστή',
    mobilePreview: 'Προεπισκόπηση Κινητού',
    default: 'Προεπιλεγμένο'
  },
  en: {
    title: 'Theme Management',
    subHeader: 'Create and manage themes for questionnaires',
    createNew: 'Create New Theme',
    search: 'Search themes...',
    name: 'Name',
    themeDescription: 'Description',
    lastModified: 'Last Modified',
    actions: 'Actions',
    edit: 'Edit',
    duplicate: 'Duplicate',
    delete: 'Delete',
    themePreview: 'Preview',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    // Theme Editor
    themeEditor: 'Theme Editor',
    createTheme: 'Create Theme',
    editTheme: 'Edit Theme',
    basicInfo: 'Basic Information',
    themeName: 'Theme Name',
    logoSettings: 'Logo Settings',
    uploadLogo: 'Upload Logo',
    logoPosition: 'Logo Position',
    left: 'Left',
    center: 'Center',
    right: 'Right',
    typography: 'Typography',
    bodyFont: 'Body Font',
    bodyFontSize: 'Body Font Size',
    headerFont: 'Header Font',
    headerFontSize: 'Header Font Size',
    colors: 'Colors',
    primaryColor: 'Primary Color',
    secondaryColor: 'Secondary Color',
    backgroundColor: 'Background Color',
    textColor: 'Text Color',
    preview: 'Preview',
    desktopPreview: 'Desktop Preview',
    mobilePreview: 'Mobile Preview',
    default: 'Default'
  }
};

const fontOptions = [
  'Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Helvetica, sans-serif',
  'Verdana, sans-serif',
  'Calibri, sans-serif',
  'Open Sans, sans-serif',
  'Roboto, sans-serif',
  'Lato, sans-serif',
  'Montserrat, sans-serif'
];



export function ThemesPage({ language }: ThemesProps) {
  // Add custom styles for full-width dialogs
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .theme-dialog-content {
        max-width: none !important;
        width: 98vw !important;
        height: 95vh !important;
      }
      .preview-dialog-content {
        max-width: none !important;
        width: 95vw !important;
        height: 90vh !important;
      }
      [data-radix-dialog-content] {
        max-width: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const API_BASE_URL = 'http://localhost:5050/api';

  const t = translations[language];
  const [themes, setThemes] = useState<Theme[]|undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Theme editor form state
  const [formData, setFormData] = useState<Partial<Theme>>({
    name: '',
    description: '',
    logoPosition: 'left',
    bodyFont: 'Arial, sans-serif',
    bodyFontSize: 14,
    headerFont: 'Georgia, serif',
    headerFontSize: 24,
    primaryColor: '#004B87',
    secondaryColor: '#0C9A8F',
    backgroundColor: '#FFFFFF',
    textColor: '#333333'
  });

  const fetchThemes = async () => {
    
    try {      
      const response = await fetch(`${API_BASE_URL}/themes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      // The API returns { responses: [], totalCount: 0, ... }
      // Extract the responses array
      const themes = data || [];
      
      // Set the responses from API or empty array if none found
      setThemes(themes);
    } catch (err) {
      console.error('Error fetching responses:', err);
      
    } finally {
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const filteredThemes = (themes ?? []).filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (theme.description && theme.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNew = () => {
    setEditorMode('create');
    setFormData({
      name: '',
      description: '',
      logoPosition: 'left',
      bodyFont: 'Arial, sans-serif',
      bodyFontSize: 14,
      headerFont: 'Georgia, serif',
      headerFontSize: 24,
      primaryColor: '#004B87',
      secondaryColor: '#0C9A8F',
      backgroundColor: '#FFFFFF',
      textColor: '#333333'
    });
    setShowThemeEditor(true);
  };

  const handleEdit = (theme: Theme) => {
    setEditorMode('edit');
    setSelectedTheme(theme);
    setFormData(theme);
    setShowThemeEditor(true);
  };

  const handlePreview = (theme: Theme) => {
    setSelectedTheme(theme);
    setShowPreview(true);
  };

  const handleSave = async () => {
    if (editorMode === 'create') {
       await fetch(`${API_BASE_URL}/themes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });
    } else if (selectedTheme) {
      await fetch(`${API_BASE_URL}/themes/${selectedTheme.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });
      
    }
    setShowThemeEditor(false);
    setSelectedTheme(null);
    fetchThemes();
  };

  const handleDelete = (theme: Theme) => {
    if (window.confirm(language === 'el' ? 
      'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το θέμα;' : 
      'Are you sure you want to delete this theme?'
    )) {
      fetch(`${API_BASE_URL}/themes/${theme.id}`, {method: 'DELETE',}).then(()=>{
        setThemes((themes??[]).filter(t => t.id !== theme.id));
      });
      
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(language === 'el' ? 
          'Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 2MB' : 
          'File is too large. Maximum size: 2MB'
        );
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(language === 'el' ? 
          'Παρακαλώ επιλέξτε ένα αρχείο εικόνας' : 
          'Please select an image file'
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, logoImageBase64: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logoImageBase64: undefined });
  };

  const handleColorPreset = (primaryColor: string, secondaryColor: string) => {
    setFormData({ 
      ...formData, 
      primaryColor, 
      secondaryColor 
    });
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t.title}</h2>
          <p className="text-gray-600 mt-2">{t.subHeader}</p>
        </div>
        <Button 
          onClick={handleCreateNew}
          className="gap-2 rounded-xl text-white shadow-md"
          style={{ backgroundColor: '#004B87' }}
        >
          <Plus className="h-4 w-4" />
          {t.createNew}
        </Button>
      </div>

      {/* Search */}
      <Card className="rounded-2xl border-none shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-gray-200"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Themes Table */}
      <Card className="rounded-2xl border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600">{t.name}</TableHead>
                <TableHead className="text-gray-600">{t.themeDescription}</TableHead>
                <TableHead className="text-gray-600">{t.colors}</TableHead>
                <TableHead className="text-gray-600">{t.lastModified}</TableHead>
                <TableHead className="text-gray-600 text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredThemes.map((theme) => (
                <TableRow key={theme.id} className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{theme.name}</p>
                        {theme.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            {t.default}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {theme.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.primaryColor }}
                        title="Primary"
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.secondaryColor }}
                        title="Secondary"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(theme.updatedAt || theme.createdAt).toLocaleDateString(
                      language === 'el' ? 'el-GR' : 'en-US'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* More Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEdit(theme)} className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" />
                            {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePreview(theme)} className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" />
                            {t.themePreview}
                          </DropdownMenuItem>
                          {!theme.isDefault && (
                            <>
                              <div className="h-px bg-gray-200 my-1" />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(theme)} 
                                className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                                {t.delete}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Theme Editor Dialog */}
      <Dialog open={showThemeEditor} onOpenChange={setShowThemeEditor}>
        <DialogContent 
          className="theme-dialog-content !max-w-none !w-[98vw] !h-[95vh] overflow-hidden bg-white p-0"
          style={{ 
            maxWidth: '98vw !important', 
            width: '98vw !important', 
            height: '95vh !important',
            margin: '0 auto',
            
          }}
        >
          <div className="p-6 h-full flex flex-col overflow-auto">
            <DialogHeader>
              <DialogTitle>
                {editorMode === 'create' ? t.createTheme : t.editTheme}
              </DialogTitle>
              <DialogDescription>
                {language === 'el' ? 
                  'Δημιουργήστε ή επεξεργαστείτε ένα θέμα για τα ερωτηματολόγια' :
                  'Create or edit a theme for questionnaires'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 min-h-0">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[75vh] pr-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {t.basicInfo}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="themeName">{t.themeName}</Label>
                    <Input
                      id="themeName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === 'el' ? 'π.χ. Κλασικό Θέμα' : 'e.g. Classic Theme'}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isDefault">{t.default}</Label>
                    <Checkbox
                      id="isDefault"
                      checked={formData.isDefault || false}
                      onCheckedChange={(checked:boolean) => setFormData({ ...formData, isDefault: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="themeDescription">{t.themeDescription}</Label>
                    <Input
                      id="themeDescription"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={language === 'el' ? 'Περιγραφή του θέματος' : 'Theme description'}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Logo Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    {t.logoSettings}
                  </h3>
                  
                  {/* Logo Upload Area */}
                  <div className="space-y-4">
                    {formData.logoImageBase64 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={formData.logoImageBase64} 
                              alt="Logo preview" 
                              className="h-12 w-12 object-contain border rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {language === 'el' ? 'Επιλεγμένο λογότυπο' : 'Selected logo'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {language === 'el' ? 'Κλικ για αλλαγή' : 'Click to change'}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveLogo}
                            className="text-red-600 hover:text-red-700"
                          >
                            {language === 'el' ? 'Αφαίρεση' : 'Remove'}
                          </Button>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="mt-2 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logoUpload" className="cursor-pointer">
                            <span className="text-sm font-medium text-gray-900">
                              {language === 'el' ? 'Κλικ για ανέβασμα λογότυπου' : 'Click to upload logo'}
                            </span>
                          </Label>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, SVG {language === 'el' ? 'έως' : 'up to'} 2MB
                          </p>
                          <Input
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{t.logoPosition}</Label>
                    <Select 
                      value={formData.logoPosition} 
                      onValueChange={(value: 'left' | 'center' | 'right') => 
                        setFormData({ ...formData, logoPosition: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">{t.left}</SelectItem>
                        <SelectItem value="center">{t.center}</SelectItem>
                        <SelectItem value="right">{t.right}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    {t.typography}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t.bodyFont}</Label>
                      <Select 
                        value={formData.bodyFont} 
                        onValueChange={(value: string) => setFormData({ ...formData, bodyFont: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(font => (
                            <SelectItem key={font} value={font}>{font.split(',')[0]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t.headerFont}</Label>
                      <Select 
                        value={formData.headerFont} 
                        onValueChange={(value: string) => setFormData({ ...formData, headerFont: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(font => (
                            <SelectItem key={font} value={font}>{font.split(',')[0]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>                    
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t.bodyFontSize}</Label>
                      <Input
                        type="number"
                        value={formData.bodyFontSize}
                        onChange={(e) => setFormData({ ...formData, bodyFontSize: parseInt(e.target.value) })}
                        min="10"
                        max="24"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t.headerFontSize}</Label>
                      <Input
                        type="number"
                        value={formData.headerFontSize}
                        onChange={(e) => setFormData({ ...formData, headerFontSize: parseInt(e.target.value) })}
                        min="10"
                        max="24"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-gray-600">{t.bodyFontSize}</Label>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{formData.bodyFontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="36"
                        value={formData.bodyFontSize}
                        onChange={(e) => setFormData({ ...formData, bodyFontSize: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-gray-600">{t.headerFontSize}</Label>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{formData.headerFontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="48"
                        value={formData.headerFontSize}
                        onChange={(e) => setFormData({ ...formData, headerFontSize: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                  {/* Font Preview */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {language === 'el' ? 'Προεπισκόπηση Γραμματοσειρών' : 'Font Preview'}
                    </h4>
                    <div className="space-y-2">
                      <h3 
                        style={{ 
                          fontFamily: formData.headerFont, 
                          fontSize: `${Math.round((formData.headerFontSize || 24) * 0.7)}px`,
                          color: formData.primaryColor,
                          fontWeight: 'bold'
                        }}
                      >
                        {language === 'el' ? 'Τίτλος Ερωτηματολογίου' : 'Questionnaire Title'}
                      </h3>
                      <p 
                        style={{ 
                          fontFamily: formData.bodyFont, 
                          fontSize: `${Math.round((formData.bodyFontSize || 14) * 0.9)}px`,
                          color: formData.textColor
                        }}
                      >
                        {language === 'el' ? 
                          'Αυτό είναι ένα δείγμα κειμένου που δείχνει πώς θα φαίνεται η γραμματοσειρά στο ερωτηματολόγιο.' :
                          'This is sample text showing how the font will appear in the questionnaire.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {t.colors}
                  </h3>
                  
                  {/* Color Presets */}
                  <div className="space-y-2">
                    <Label>{language === 'el' ? 'Προεπιλεγμένες Παλέτες' : 'Color Presets'}</Label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { name: 'Cyprus Blue', primary: '#004B87', secondary: '#0C9A8F' },
                        { name: 'Forest Green', primary: '#065F46', secondary: '#10B981' },
                        { name: 'Ocean Blue', primary: '#0369A1', secondary: '#0EA5E9' },
                        { name: 'Sunset Orange', primary: '#DC2626', secondary: '#F59E0B' },
                        { name: 'Purple', primary: '#7C3AED', secondary: '#A855F7' },
                        { name: 'Emerald', primary: '#059669', secondary: '#34D399' }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleColorPreset(preset.primary, preset.secondary)}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                            formData.primaryColor === preset.primary 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex gap-1">
                            <div 
                              className="w-6 h-6 rounded-lg border" 
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-6 h-6 rounded-lg border" 
                              style={{ backgroundColor: preset.secondary }}
                            />
                          </div>
                          <span className="text-sm font-medium">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="space-y-4 pt-2 border-t">
                    <h4 className="text-md font-medium">{language === 'el' ? 'Προσαρμοσμένα Χρώματα' : 'Custom Colors'}</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t.primaryColor}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded cursor-pointer flex-shrink-0"
                          />
                          <Input
                            type="text"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="flex-1 font-mono text-sm"
                            placeholder="#004B87"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t.secondaryColor}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={formData.secondaryColor}
                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded cursor-pointer flex-shrink-0"
                          />
                          <Input
                            type="text"
                            value={formData.secondaryColor}
                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                            className="flex-1 font-mono text-sm"
                            placeholder="#0C9A8F"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t.backgroundColor}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={formData.backgroundColor}
                            onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={formData.backgroundColor}
                            onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                            className="flex-1 font-mono text-sm"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t.textColor}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={formData.textColor}
                            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={formData.textColor}
                            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                            className="flex-1 font-mono text-sm"
                            placeholder="#333333"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Live Preview */}
              <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[75vh]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t.preview}</h3>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className="gap-2"
                    >
                      <Monitor className="h-4 w-4" />
                      Desktop
                    </Button>
                    <Button
                      type="button"
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className="gap-2"
                    >
                      <Smartphone className="h-4 w-4" />
                      Mobile
                    </Button>
                  </div>
                </div>

                {/* Enhanced Preview Container */}
                <div className="border rounded-lg overflow-hidden shadow-lg w-full">
                  <div className={`transition-all duration-300 ${
                    previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                  }`}>
                    <div 
                      className="p-6 min-h-[400px]"
                      style={{ 
                        backgroundColor: formData.backgroundColor,
                        color: formData.textColor,
                        fontFamily: formData.bodyFont,
                        fontSize: `${formData.bodyFontSize}px`,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {/* Logo Preview */}
                      {formData.logoImageBase64 && (
                        <div className={`mb-6 transition-all duration-300 ${
                          formData.logoPosition === 'center' ? 'text-center' :
                          formData.logoPosition === 'right' ? 'text-right' : 'text-left'
                        }`}>
                          <img 
                            src={formData.logoImageBase64} 
                            alt="Logo" 
                            className="h-12 inline-block object-contain transition-all duration-300"
                            style={{ maxWidth: '200px' }}
                          />
                        </div>
                      )}

                      {/* Header Preview */}
                      <h1 
                        className="mb-4 transition-all duration-300"
                        style={{
                          fontFamily: formData.headerFont,
                          fontSize: `${formData.headerFontSize || 24}px`,
                          color: formData.primaryColor,
                          fontWeight: 'bold'
                        }}
                      >
                        {formData.name || (language === 'el' ? 'Δείγμα Ερωτηματολογίου' : 'Sample Questionnaire')}
                      </h1>

                      {formData.description && (
                        <p className="mb-6 text-gray-600 transition-all duration-300">
                          {formData.description}
                        </p>
                      )}

                      {/* Sample Form Elements */}
                      <div className="space-y-4">
                        <div>
                          <label 
                            className="block mb-2 font-medium transition-colors duration-300"
                            style={{ color: formData.textColor }}
                          >
                            {language === 'el' ? 'Όνομα Αγρότη:' : 'Farmer Name:'}
                          </label>
                          <input 
                            type="text" 
                            className="w-full p-3 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2"
                            placeholder={language === 'el' ? 'Εισάγετε όνομα' : 'Enter name'}
                            style={{ 
                              borderColor: formData.primaryColor,
                              fontSize: `${formData.bodyFontSize}px`,
                              fontFamily: formData.bodyFont
                            }}
                          />
                        </div>

                        <div>
                          <label 
                            className="block mb-2 font-medium transition-colors duration-300"
                            style={{ color: formData.textColor }}
                          >
                            {language === 'el' ? 'Τύπος Καλλιέργειας:' : 'Crop Type:'}
                          </label>
                          <select 
                            className="w-full p-3 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2"
                            style={{ 
                              borderColor: formData.primaryColor,
                              fontSize: `${formData.bodyFontSize}px`,
                              fontFamily: formData.bodyFont
                            }}
                          >
                            <option>{language === 'el' ? 'Επιλέξτε...' : 'Select...'}</option>
                            <option>{language === 'el' ? 'Σιτηρά' : 'Cereals'}</option>
                            <option>{language === 'el' ? 'Λαχανικά' : 'Vegetables'}</option>
                            <option>{language === 'el' ? 'Φρούτα' : 'Fruits'}</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button 
                            type="button"
                            className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg"
                            style={{ 
                              backgroundColor: formData.primaryColor,
                              fontSize: `${formData.bodyFontSize}px`,
                              fontFamily: formData.bodyFont
                            }}
                          >
                            {language === 'el' ? 'Προηγούμενο' : 'Previous'}
                          </button>
                          <button 
                            type="button"
                            className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg"
                            style={{ 
                              backgroundColor: formData.secondaryColor,
                              fontSize: `${formData.bodyFontSize}px`,
                              fontFamily: formData.bodyFont
                            }}
                          >
                            {language === 'el' ? 'Επόμενο' : 'Next'}
                          </button>
                        </div>
                      </div>

                      {/* Preview Footer */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                          {language === 'el' ? 
                            'Ζωντανή προεπισκόπηση - οι αλλαγές εφαρμόζονται αυτόματα' : 
                            'Live preview - changes apply automatically'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            </div>
                        {/* Actions */}
            <div className="flex justify-between gap-4 mt-6 pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset to defaults
                    setFormData({
                      name: '',
                      description: '',
                      logoImageBase64: '',
                      logoPosition: 'left',
                      primaryColor: '#004B87',
                      secondaryColor: '#0C9A8F',
                      backgroundColor: '#FFFFFF',
                      textColor: '#1F2937',
                      headerFont: 'Georgia, serif',
                      headerFontSize: 24,
                      bodyFont: 'system-ui, sans-serif',
                      bodyFontSize: 14
                    });
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {language === 'el' ? 'Επαναφορά' : 'Reset'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    // Copy current theme as new
                    const newTheme = {
                      ...formData,
                      name: `${formData.name} (${language === 'el' ? 'Αντίγραφο' : 'Copy'})`,
                    };
                    setFormData(newTheme);
                  }}
                  className="gap-2"
                  disabled={!formData.name?.trim()}
                >
                  <Copy className="h-4 w-4" />
                  {language === 'el' ? 'Αντιγραφή' : 'Duplicate'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowThemeEditor(false)}
                >
                  {t.cancel}
                </Button>
                <Button 
                  onClick={handleSave}
                  className="gap-2 min-w-[100px]"
                  style={{ backgroundColor: '#004B87' }}
                  disabled={!formData.name?.trim()}
                >
                  <Save className="h-4 w-4" />
                  {editorMode === 'create' ? t.createTheme : t.save}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent 
          className="preview-dialog-content !max-w-none !w-[95vw] !h-[90vh] overflow-auto bg-white p-0"
          style={{ 
            maxWidth: '95vw !important', 
            width: '95vw !important', 
            height: '90vh !important',
            margin: '0 auto'
          }}
        >
          <div className="p-6 h-full flex flex-col">
            <DialogHeader>
              <DialogTitle>{t.preview} - {selectedTheme?.name}</DialogTitle>
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

          <div className="flex-1 overflow-auto p-4">

            {selectedTheme && <ThemePreview theme={selectedTheme} mode={previewMode} />}

          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowPreview(false)}>
              {t.close}
            </Button>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}