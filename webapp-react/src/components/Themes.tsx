import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Palette, Type, Image, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function Themes() {
  const { t, language } = useLanguage();
  const [primaryColor, setPrimaryColor] = useState('#004B87');
  const [secondaryColor, setSecondaryColor] = useState('#0C9A8F');
  const [fontFamily, setFontFamily] = useState('Inter');

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{t('themes.title')}</h1>
          <p className="text-gray-600 mt-1">
            {language === 'el' 
              ? 'Προσαρμόστε την εμφάνιση των ερωτηματολογίων σας' 
              : 'Customize the appearance of your questionnaires'}
          </p>
        </div>
        <Button style={{ backgroundColor: '#004B87' }} className="text-white rounded-xl">
          {t('themes.save')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="branding" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="branding" className="rounded-xl">
                <Image className="h-4 w-4 mr-2" />
                {t('themes.branding')}
              </TabsTrigger>
              <TabsTrigger value="colors" className="rounded-xl">
                <Palette className="h-4 w-4 mr-2" />
                {t('themes.colors')}
              </TabsTrigger>
              <TabsTrigger value="typography" className="rounded-xl">
                <Type className="h-4 w-4 mr-2" />
                {t('themes.typography')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="mt-6">
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle>{t('themes.branding')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>{t('themes.logo')}</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <div className="w-24 h-24 mx-auto rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#004B87' }}>
                        <span className="text-white text-4xl">🌾</span>
                      </div>
                      <Button variant="outline" className="rounded-xl">
                        {language === 'el' ? 'Μεταφόρτωση Λογότυπου' : 'Upload Logo'}
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, SVG {language === 'el' ? 'έως' : 'up to'} 2MB
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>
                      {language === 'el' ? 'Όνομα Οργανισμού' : 'Organization Name'}
                    </Label>
                    <Input 
                      defaultValue={language === 'el' ? 'Υπουργείο Γεωργίας Κύπρου' : 'Ministry of Agriculture Cyprus'}
                      className="mt-2 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label>
                      {language === 'el' ? 'Ιστοσελίδα' : 'Website'}
                    </Label>
                    <Input 
                      defaultValue="https://www.moa.gov.cy"
                      className="mt-2 rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="mt-6">
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle>{t('themes.colors')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>{t('themes.primaryColor')}</Label>
                    <div className="mt-2 flex gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Input 
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 rounded-xl"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {language === 'el' 
                        ? 'Χρησιμοποιείται για κουμπιά και κύριες ενέργειες' 
                        : 'Used for buttons and primary actions'}
                    </p>
                  </div>

                  <div>
                    <Label>{t('themes.secondaryColor')}</Label>
                    <div className="mt-2 flex gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      <Input 
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 rounded-xl"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {language === 'el' 
                        ? 'Χρησιμοποιείται για έμφαση και highlights' 
                        : 'Used for accents and highlights'}
                    </p>
                  </div>

                  <div>
                    <Label>
                      {language === 'el' ? 'Προεπιλεγμένες Παλέτες' : 'Preset Palettes'}
                    </Label>
                    <div className="grid grid-cols-4 gap-3 mt-2">
                      {[
                        { name: 'Default', primary: '#004B87', secondary: '#0C9A8F' },
                        { name: 'Forest', primary: '#065F46', secondary: '#10B981' },
                        { name: 'Ocean', primary: '#0369A1', secondary: '#0EA5E9' },
                        { name: 'Sunset', primary: '#DC2626', secondary: '#F59E0B' },
                      ].map((palette) => (
                        <button
                          key={palette.name}
                          onClick={() => {
                            setPrimaryColor(palette.primary);
                            setSecondaryColor(palette.secondary);
                          }}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-colors"
                        >
                          <div className="flex gap-1">
                            <div 
                              className="w-6 h-6 rounded-lg" 
                              style={{ backgroundColor: palette.primary }}
                            />
                            <div 
                              className="w-6 h-6 rounded-lg" 
                              style={{ backgroundColor: palette.secondary }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{palette.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="mt-6">
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle>{t('themes.typography')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>{t('themes.fontFamily')}</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="mt-2 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Noto Sans">Noto Sans</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                    <div style={{ fontFamily }}>
                      <p className="text-sm text-gray-500 mb-1">Heading 1</p>
                      <h1 className="text-gray-900">
                        {language === 'el' ? 'Τίτλος Ερωτηματολογίου' : 'Questionnaire Title'}
                      </h1>
                    </div>
                    <div style={{ fontFamily }}>
                      <p className="text-sm text-gray-500 mb-1">Heading 2</p>
                      <h2 className="text-gray-900">
                        {language === 'el' ? 'Τμήμα Ερωτήσεων' : 'Question Section'}
                      </h2>
                    </div>
                    <div style={{ fontFamily }}>
                      <p className="text-sm text-gray-500 mb-1">Body Text</p>
                      <p className="text-gray-700">
                        {language === 'el' 
                          ? 'Αυτό είναι ένα παράδειγμα κειμένου σώματος που θα χρησιμοποιηθεί σε ερωτήσεις και περιγραφές.' 
                          : 'This is a sample body text that will be used in questions and descriptions.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm rounded-2xl sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t('themes.preview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Preview Header */}
                <div 
                  className="p-4 rounded-xl text-white"
                  style={{ backgroundColor: primaryColor, fontFamily }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <span>🌾</span>
                    </div>
                    <span>
                      {language === 'el' ? 'Υπουργείο Γεωργίας' : 'Ministry of Agriculture'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem' }}>
                    {language === 'el' ? 'Ερωτηματολόγιο' : 'Questionnaire'}
                  </h3>
                </div>

                {/* Preview Question */}
                <div className="space-y-3" style={{ fontFamily }}>
                  <p className="text-gray-900">
                    {language === 'el' 
                      ? '1. Ποιος είναι ο τύπος της καλλιέργειάς σας;' 
                      : '1. What is your crop type?'}
                  </p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i}
                        className="p-3 border-2 rounded-xl cursor-pointer hover:border-gray-400 transition-colors"
                        style={{ borderColor: i === 1 ? secondaryColor : '#E5E7EB' }}
                      >
                        <span className="text-sm text-gray-700">
                          {language === 'el' ? `Επιλογή ${i}` : `Option ${i}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview Button */}
                <Button 
                  className="w-full rounded-xl text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {language === 'el' ? 'Υποβολή' : 'Submit'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  {language === 'el' 
                    ? 'Προεπισκόπηση εμφάνισης ερωτηματολογίου' 
                    : 'Questionnaire appearance preview'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
