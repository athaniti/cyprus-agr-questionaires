import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Upload, Trash2, Search, MapPin } from 'lucide-react';

const locations = [
  {
    id: 1,
    municipality: { el: 'Λευκωσία', en: 'Nicosia' },
    community: { el: 'Αγλαντζιά', en: 'Aglandjia' },
    district: { el: 'Λευκωσία', en: 'Nicosia' },
    population: 25420,
    farmers: 145,
    active: true
  },
  {
    id: 2,
    municipality: { el: 'Λευκωσία', en: 'Nicosia' },
    community: { el: 'Λακατάμια', en: 'Lakatamia' },
    district: { el: 'Λευκωσία', en: 'Nicosia' },
    population: 23430,
    farmers: 132,
    active: true
  },
  {
    id: 3,
    municipality: { el: 'Λευκωσία', en: 'Nicosia' },
    community: { el: 'Στρόβολος', en: 'Strovolos' },
    district: { el: 'Λευκωσία', en: 'Nicosia' },
    population: 67398,
    farmers: 89,
    active: true
  },
  {
    id: 4,
    municipality: { el: 'Λεμεσός', en: 'Limassol' },
    community: { el: 'Λεμεσός', en: 'Limassol' },
    district: { el: 'Λεμεσός', en: 'Limassol' },
    population: 101000,
    farmers: 234,
    active: true
  },
  {
    id: 5,
    municipality: { el: 'Λάρνακα', en: 'Larnaca' },
    community: { el: 'Λάρνακα', en: 'Larnaca' },
    district: { el: 'Λάρνακα', en: 'Larnaca' },
    population: 51468,
    farmers: 178,
    active: true
  },
  {
    id: 6,
    municipality: { el: 'Πάφος', en: 'Paphos' },
    community: { el: 'Πάφος', en: 'Paphos' },
    district: { el: 'Πάφος', en: 'Paphos' },
    population: 35961,
    farmers: 156,
    active: true
  },
  {
    id: 7,
    municipality: { el: 'Αμμόχωστος', en: 'Famagusta' },
    community: { el: 'Παραλίμνι', en: 'Paralimni' },
    district: { el: 'Αμμόχωστος', en: 'Famagusta' },
    population: 14862,
    farmers: 98,
    active: true
  },
  {
    id: 8,
    municipality: { el: 'Λευκωσία', en: 'Nicosia' },
    community: { el: 'Λατσιά', en: 'Latsia' },
    district: { el: 'Λευκωσία', en: 'Nicosia' },
    population: 16774,
    farmers: 76,
    active: false
  },
];

export function Locations() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showImportSection, setShowImportSection] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState<string>('all');

  console.log('Locations render - showImportSection:', showImportSection);

  const filteredLocations = locations.filter(location => {
    const matchesSearch = 
      (language === 'el' ? location.community.el : location.community.en)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (language === 'el' ? location.municipality.el : location.municipality.en)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesDistrict = filterDistrict === 'all' || 
      (language === 'el' ? location.district.el : location.district.en) === filterDistrict;
    
    return matchesSearch && matchesDistrict;
  });

  const totalLocations = locations.length;
  const activeLocations = locations.filter(l => l.active).length;
  const totalFarmers = locations.reduce((sum, l) => sum + l.farmers, 0);
  const totalPopulation = locations.reduce((sum, l) => sum + l.population, 0);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{t('locations.title')}</h1>
          <p className="text-gray-600 mt-1">
            {language === 'el' 
              ? 'Διαχείριση δήμων, κοινοτήτων και γεωγραφικών περιοχών' 
              : 'Manage municipalities, communities and geographical areas'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            className="inline-flex items-center justify-center gap-2 rounded-xl border-4 border-red-500 bg-red-100 px-6 py-3 text-lg font-bold text-red-800 hover:bg-red-200 transition-colors cursor-pointer shadow-lg"
            onClick={() => {
              alert('Import button clicked!');
              console.log('Import button clicked!');
              setShowImportSection(true);
            }}
          >
            <Upload className="h-5 w-5 text-red-800" />
            <span className="text-red-800 font-bold">🔥 ΚΛΙΚ ΕΔΩ ΓΙΑ IMPORT 🔥</span>
          </button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: '#004B87' }} className="text-white rounded-xl gap-2">
                <Plus className="h-4 w-4" />
                {t('locations.addNew')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('locations.addNew')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>{t('locations.district')}</Label>
                  <Select>
                    <SelectTrigger className="mt-2 rounded-xl">
                      <SelectValue placeholder={language === 'el' ? 'Επιλέξτε επαρχία' : 'Select district'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nicosia">{language === 'el' ? 'Λευκωσία' : 'Nicosia'}</SelectItem>
                      <SelectItem value="limassol">{language === 'el' ? 'Λεμεσός' : 'Limassol'}</SelectItem>
                      <SelectItem value="larnaca">{language === 'el' ? 'Λάρνακα' : 'Larnaca'}</SelectItem>
                      <SelectItem value="paphos">{language === 'el' ? 'Πάφος' : 'Paphos'}</SelectItem>
                      <SelectItem value="famagusta">{language === 'el' ? 'Αμμόχωστος' : 'Famagusta'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('locations.municipality')}</Label>
                  <Input 
                    placeholder={language === 'el' ? 'π.χ. Λευκωσία' : 'e.g. Nicosia'}
                    className="mt-2 rounded-xl"
                  />
                </div>

                <div>
                  <Label>{t('locations.community')}</Label>
                  <Input 
                    placeholder={language === 'el' ? 'π.χ. Αγλαντζιά' : 'e.g. Aglandjia'}
                    className="mt-2 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('locations.population')}</Label>
                    <Input 
                      type="number"
                      placeholder="25000"
                      className="mt-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === 'el' ? 'Αριθμός Αγροτών' : 'Number of Farmers'}
                    </Label>
                    <Input 
                      type="number"
                      placeholder="150"
                      className="mt-2 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button 
                    style={{ backgroundColor: '#004B87' }}
                    className="flex-1 text-white rounded-xl"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    {t('save')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Σύνολο Τοποθεσιών' : 'Total Locations'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>{totalLocations}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EBF4FF' }}>
                <MapPin className="h-6 w-6" style={{ color: '#004B87' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Ενεργές Τοποθεσίες' : 'Active Locations'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>{activeLocations}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F9F7' }}>
                <MapPin className="h-6 w-6" style={{ color: '#0C9A8F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'el' ? 'Σύνολο Αγροτών' : 'Total Farmers'}
              </p>
              <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>
                {totalFarmers.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'el' ? 'Σύνολο Πληθυσμού' : 'Total Population'}
              </p>
              <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>
                {(totalPopulation / 1000).toFixed(0)}K
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('questionnaires.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Select value={filterDistrict} onValueChange={setFilterDistrict}>
              <SelectTrigger className="w-full md:w-64 rounded-xl">
                <SelectValue placeholder={language === 'el' ? 'Όλες οι επαρχίες' : 'All districts'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'el' ? 'Όλες οι επαρχίες' : 'All districts'}</SelectItem>
                <SelectItem value={language === 'el' ? 'Λευκωσία' : 'Nicosia'}>
                  {language === 'el' ? 'Λευκωσία' : 'Nicosia'}
                </SelectItem>
                <SelectItem value={language === 'el' ? 'Λεμεσός' : 'Limassol'}>
                  {language === 'el' ? 'Λεμεσός' : 'Limassol'}
                </SelectItem>
                <SelectItem value={language === 'el' ? 'Λάρνακα' : 'Larnaca'}>
                  {language === 'el' ? 'Λάρνακα' : 'Larnaca'}
                </SelectItem>
                <SelectItem value={language === 'el' ? 'Πάφος' : 'Paphos'}>
                  {language === 'el' ? 'Πάφος' : 'Paphos'}
                </SelectItem>
                <SelectItem value={language === 'el' ? 'Αμμόχωστος' : 'Famagusta'}>
                  {language === 'el' ? 'Αμμόχωστος' : 'Famagusta'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Locations Table */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>
            {language === 'el' ? 'Λίστα Τοποθεσιών' : 'Locations List'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('locations.district')}</TableHead>
                <TableHead>{t('locations.municipality')}</TableHead>
                <TableHead>{t('locations.community')}</TableHead>
                <TableHead>{t('locations.population')}</TableHead>
                <TableHead>
                  {language === 'el' ? 'Αγρότες' : 'Farmers'}
                </TableHead>
                <TableHead>
                  {language === 'el' ? 'Κατάσταση' : 'Status'}
                </TableHead>
                <TableHead>{t('questionnaires.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    {language === 'el' ? location.district.el : location.district.en}
                  </TableCell>
                  <TableCell>
                    {language === 'el' ? location.municipality.el : location.municipality.en}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {language === 'el' ? location.community.el : location.community.en}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{location.population.toLocaleString()}</TableCell>
                  <TableCell>{location.farmers}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className="rounded-lg"
                      style={
                        location.active 
                          ? { backgroundColor: '#E6F9F7', color: '#0C9A8F' }
                          : { backgroundColor: '#F5F6FA', color: '#6B7280' }
                      }
                    >
                      {location.active 
                        ? (language === 'el' ? 'Ενεργή' : 'Active')
                        : (language === 'el' ? 'Ανενεργή' : 'Inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Simple Import Section */}
      {showImportSection && (
        <Card className="shadow-sm rounded-2xl border-2 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-700">
              🎉 Η Εισαγωγή Αρχείου Λειτουργεί!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-green-600">
                Επιτυχής σύνδεση! Το import button λειτουργεί σωστά.
              </p>
              <div className="flex gap-3">
                <input 
                  type="file" 
                  accept=".csv"
                  className="flex-1 p-2 border rounded-lg"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      alert(`Επιλέχθηκε αρχείο: ${e.target.files[0].name}`);
                    }
                  }}
                />
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => alert('CSV Upload would happen here!')}
                >
                  Upload CSV
                </button>
                <button 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  onClick={() => setShowImportSection(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
