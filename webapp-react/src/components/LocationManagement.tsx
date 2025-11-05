import React, { useState, useEffect } from 'react';

interface Location {
  id: string;
  name: string;
  type: string;
  province?: string;
  municipality?: string;
  community?: string;
  parentName?: string;
  code?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
}

interface CreateLocationRequest {
  name: string;
  type: string;
  province?: string;
  municipality?: string;
  community?: string;
  code?: string;
  latitude?: number;
  longitude?: number;
}

interface ImportResult {
  processedCount: number;
  successCount: number;
  rejectedCount: number;
  alreadyExistsCount: number;
  errors: string[];
  summary: string;
}

interface ImportPreviewItem {
  lineNumber: number;
  name: string;
  municipality: string;
  community: string;
  province: string;
  code?: string;
  status: string;
}

interface ImportPreview {
  totalLines: number;
  previewItems: ImportPreviewItem[];
}

interface Props {
  language: 'el' | 'en';
}

const LocationManagement: React.FC<Props> = ({ language }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [municipalities, setMunicipalities] = useState<Location[]>([]);
  const [communities, setCommunities] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [viewMode, setViewMode] = useState<'hierarchy' | 'list'>('hierarchy');
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  // Create form state
  const [newLocation, setNewLocation] = useState<CreateLocationRequest>({
    name: '',
    type: 'location',
    province: '',
    municipality: '',
    community: '',
    code: '',
    latitude: undefined,
    longitude: undefined
  });

  const API_BASE_URL = 'http://localhost:5050/api';

  const texts = {
    el: {
      title: 'Διαχείριση Γεωγραφικών Τοποθεσιών',
      subtitle: 'Προβολή και διαχείριση επαρχιών, κοινοτήτων και γεωγραφικών δεδομένων',
      viewRegistries: 'Προβολή Μητρώων',
      addNew: 'Προσθήκη Νέας Τοποθεσίας',
      importFromFile: 'Εισαγωγή από Αρχείο',
      hierarchy: 'Ιεραρχική Προβολή',
      list: 'Λίστα',
      province: 'Επαρχία',
      community: 'Κοινότητα',
      municipality: 'Δήμος',
      name: 'Όνομα',
      code: 'Κωδικός',
      type: 'Τύπος',
      coordinates: 'Συντεταγμένες',
      created: 'Δημιουργήθηκε',
      actions: 'Ενέργειες',
      close: 'Κλείσιμο',
      cancel: 'Ακύρωση',
      save: 'Αποθήκευση',
      create: 'Δημιουργία',
      selectProvince: 'Επιλέξτε Επαρχία',
      enterName: 'Εισάγετε όνομα',
      enterCode: 'Εισάγετε κωδικό (προαιρετικό)',
      latitude: 'Γεωγραφικό Πλάτος',
      longitude: 'Γεωγραφικό Μήκος',
      selectFile: 'Επιλέξτε Αρχείο CSV',
      previewImport: 'Προεπισκόπηση Εισαγωγής',
      confirmImport: 'Επιβεβαίωση Εισαγωγής',
      importProgress: 'Πρόοδος Εισαγωγής',
      totalLines: 'Συνολικές Γραμμές',
      preview: 'Προεπισκόπηση',
      status: 'Κατάσταση',
      ready: 'Έτοιμο για εισαγωγή',
      error: 'Σφάλμα',
      exists: 'Υπάρχει ήδη',
      csvFormat: 'Μορφή CSV: Όνομα, Δήμος, Κοινότητα, Επαρχία, Κωδικός (προαιρετικό)',
      importSuccess: 'Επιτυχής Εισαγωγή',
      importComplete: 'Η εισαγωγή ολοκληρώθηκε!',
      filterByProvince: 'Φιλτράρισμα ανά Επαρχία',
      allProvinces: 'Όλες οι Επαρχίες',
      noLocations: 'Δεν βρέθηκαν τοποθεσίες',
      loadingError: 'Σφάλμα φόρτωσης δεδομένων'
    },
    en: {
      title: 'Geographic Location Management',
      subtitle: 'View and manage provinces, communities and geographic data',
      viewRegistries: 'View Registries',
      addNew: 'Add New Location',
      importFromFile: 'Import from File',
      hierarchy: 'Hierarchy View',
      list: 'List',
      province: 'Province',
      community: 'Community',
      municipality: 'Municipality',
      name: 'Name',
      code: 'Code',
      type: 'Type',
      coordinates: 'Coordinates',
      created: 'Created',
      actions: 'Actions',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      create: 'Create',
      selectProvince: 'Select Province',
      enterName: 'Enter name',
      enterCode: 'Enter code (optional)',
      latitude: 'Latitude',
      longitude: 'Longitude',
      selectFile: 'Select CSV File',
      previewImport: 'Preview Import',
      confirmImport: 'Confirm Import',
      importProgress: 'Import Progress',
      totalLines: 'Total Lines',
      preview: 'Preview',
      status: 'Status',
      ready: 'Ready for import',
      error: 'Error',
      exists: 'Already exists',
      csvFormat: 'CSV Format: Name, Municipality, Community, Province, Code (optional)',
      importSuccess: 'Import Success',
      importComplete: 'Import completed!',
      filterByProvince: 'Filter by Province',
      allProvinces: 'All Provinces',
      noLocations: 'No locations found',
      loadingError: 'Error loading data'
    }
  };

  const t = texts[language];

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load provinces
      const provincesResponse = await fetch(`${API_BASE_URL}/locations/regions`);
      if (provincesResponse.ok) {
        const provincesData = await provincesResponse.json();
        setProvinces(provincesData);
      }

      // Load hierarchy data
      const hierarchyResponse = await fetch(`${API_BASE_URL}/locations/hierarchy`);
      if (hierarchyResponse.ok) {
        const hierarchyData = await hierarchyResponse.json();
        
        // Flatten hierarchy for list view
        const flatLocations: Location[] = [];
        hierarchyData.forEach((province: any) => {
          flatLocations.push({
            id: province.id,
            name: province.name,
            type: 'region',
            isActive: true,
            createdAt: new Date().toISOString()
          });
          
          province.communities?.forEach((community: any) => {
            flatLocations.push({
              id: community.id,
              name: community.name,
              type: 'community',
              province: province.name,
              parentName: province.name,
              isActive: true,
              createdAt: new Date().toISOString()
            });
          });
        });
        
        setLocations(flatLocations);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = async () => {
    if (!newLocation.name.trim()) {
      alert(language === 'el' ? 'Το όνομα είναι υποχρεωτικό' : 'Name is required');
      return;
    }

    // Validation based on type
    if (newLocation.type === 'municipality' && !newLocation.province) {
      alert(language === 'el' ? 'Η επαρχία είναι υποχρεωτική για δήμο' : 'Province is required for municipality');
      return;
    }

    if (newLocation.type === 'community' && !newLocation.municipality) {
      alert(language === 'el' ? 'Ο δήμος είναι υποχρεωτικός για κοινότητα' : 'Municipality is required for community');
      return;
    }

    if (newLocation.type === 'location' && !newLocation.community) {
      alert(language === 'el' ? 'Η κοινότητα είναι υποχρεωτική για τοποθεσία' : 'Community is required for location');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLocation),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewLocation({
          name: '',
          type: 'location',
          province: '',
          municipality: '',
          community: '',
          code: '',
          latitude: undefined,
          longitude: undefined
        });
        loadData();
        alert(language === 'el' ? 'Η τοποθεσία δημιουργήθηκε επιτυχώς!' : 'Location created successfully!');
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error('Error creating location:', error);
      alert(language === 'el' ? 'Σφάλμα κατά τη δημιουργία' : 'Error creating location');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handlePreviewImport = async () => {
    if (!importFile) return;

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch(`${API_BASE_URL}/locations/import/preview`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const preview = await response.json();
        setImportPreview(preview);
        setShowImportPreview(true);
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error('Error previewing import:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την προεπισκόπηση' : 'Error previewing import');
    }
  };

  const handleConfirmImport = async () => {
    if (!importFile) return;

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch(`${API_BASE_URL}/locations/import`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImportResult(result);
        setShowImportPreview(false);
        setImportFile(null);
        loadData();
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την εισαγωγή' : 'Error importing file');
    }
  };

  const filteredLocations = locations.filter(location => {
    if (!selectedProvince) return true;
    if (location.type === 'region') return location.name === selectedProvince;
    return location.province === selectedProvince;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F5F6FA' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-gray-600 mt-2">{t.subtitle}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-white rounded-xl shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#004B87' }}
            >
              + {t.addNew}
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-colors"
            >
              📁 {t.importFromFile}
            </button>
          </div>
        </div>

        {/* View Toggle and Filter */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('hierarchy')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'hierarchy'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌳 {t.hierarchy}
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📄 {t.list}
              </button>
            </div>

            {/* Province Filter */}
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.allProvinces}</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredLocations.length} τοποθεσίες
          </div>
        </div>

        {/* Content */}
        {viewMode === 'hierarchy' ? (
          <HierarchyView locations={filteredLocations} provinces={provinces} language={language} />
        ) : (
          <ListView locations={filteredLocations} language={language} />
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t.addNew}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.type}
                </label>
                <select
                  value={newLocation.type}
                  onChange={(e) => setNewLocation({...newLocation, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="location">Τοποθεσία</option>
                  <option value="community">{t.community}</option>
                  <option value="municipality">Δήμος</option>
                  <option value="region">{t.province}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.enterName}
                />
              </div>

              {(newLocation.type === 'municipality' || newLocation.type === 'community' || newLocation.type === 'location') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.province}
                  </label>
                  <select
                    value={newLocation.province}
                    onChange={(e) => setNewLocation({...newLocation, province: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t.selectProvince}</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(newLocation.type === 'community' || newLocation.type === 'location') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Δήμος
                  </label>
                  <input
                    type="text"
                    value={newLocation.municipality}
                    onChange={(e) => setNewLocation({...newLocation, municipality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Εισάγετε δήμο"
                  />
                </div>
              )}

              {newLocation.type === 'location' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Κοινότητα
                  </label>
                  <input
                    type="text"
                    value={newLocation.community}
                    onChange={(e) => setNewLocation({...newLocation, community: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Εισάγετε κοινότητα"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.code}
                </label>
                <input
                  type="text"
                  value={newLocation.code}
                  onChange={(e) => setNewLocation({...newLocation, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.enterCode}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.latitude}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newLocation.latitude || ''}
                    onChange={(e) => setNewLocation({...newLocation, latitude: e.target.value ? parseFloat(e.target.value) : undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.longitude}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newLocation.longitude || ''}
                    onChange={(e) => setNewLocation({...newLocation, longitude: e.target.value ? parseFloat(e.target.value) : undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewLocation({
                    name: '',
                    type: 'location',
                    province: '',
                    municipality: '',
                    community: '',
                    code: '',
                    latitude: undefined,
                    longitude: undefined
                  });
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleCreateLocation}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.create}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t.importFromFile}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.selectFile}
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{t.csvFormat}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handlePreviewImport}
                disabled={!importFile}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.previewImport}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Preview Modal */}
      {showImportPreview && importPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t.previewImport}</h3>
            
            <div className="mb-4">
              <p className="text-gray-600">
                {t.totalLines}: {importPreview.totalLines}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.name}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Δήμος
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Κοινότητα
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.province}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.code}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.status}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importPreview.previewItems.map((item) => (
                    <tr key={item.lineNumber}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.lineNumber}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.municipality}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.community}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.province}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status.includes('Σφάλμα') || item.status.includes('Error')
                            ? 'bg-red-100 text-red-800'
                            : item.status.includes('Υπάρχει') || item.status.includes('exists')
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowImportPreview(false);
                  setImportPreview(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex-1 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                {t.confirmImport}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Result Modal */}
      {importResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-green-600 mb-6">
              ✅ {t.importSuccess}
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-600">{t.importComplete}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Επιτυχώς:</span>
                  <span className="font-medium text-green-600">{importResult.successCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Απορρίφθηκαν:</span>
                  <span className="font-medium text-red-600">{importResult.rejectedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Υπάρχουν ήδη:</span>
                  <span className="font-medium text-yellow-600">{importResult.alreadyExistsCount}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">{importResult.summary}</p>

              {importResult.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto">
                  <h4 className="font-medium text-red-600 mb-2">Σφάλματα:</h4>
                  <ul className="text-xs text-red-600 space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setImportResult(null)}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hierarchy View Component
const HierarchyView: React.FC<{
  locations: Location[];
  provinces: Location[];
  language: 'el' | 'en';
}> = ({ locations, provinces, language }) => {
  const provincesWithCommunities = provinces.map(province => {
    const communities = locations.filter(
      loc => loc.type === 'community' && loc.province === province.name
    );
    return { ...province, communities };
  });

  return (
    <div className="space-y-4">
      {provincesWithCommunities.map((province) => (
        <div key={province.id} className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {province.name}
                </h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {language === 'el' ? 'Επαρχία' : 'Province'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {province.communities?.length || 0} κοινότητες
              </span>
            </div>
          </div>
          
          {province.communities && province.communities.length > 0 && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {province.communities.map((community) => (
                  <div
                    key={community.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">
                        {community.name}
                      </span>
                    </div>
                    {community.code && (
                      <p className="text-xs text-gray-500 mt-1">
                        Κωδικός: {community.code}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// List View Component
const ListView: React.FC<{
  locations: Location[];
  language: 'el' | 'en';
}> = ({ locations, language }) => {
  const texts = {
    el: {
      name: 'Όνομα',
      type: 'Τύπος',
      province: 'Επαρχία',
      code: 'Κωδικός',
      created: 'Δημιουργήθηκε'
    },
    en: {
      name: 'Name',
      type: 'Type',
      province: 'Province',
      code: 'Code',
      created: 'Created'
    }
  };

  const t = texts[language];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.name}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.type}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.province}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.code}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.created}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locations.map((location) => (
              <tr key={location.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      location.type === 'region' ? 'bg-blue-600' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">
                      {location.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    location.type === 'region'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {location.type === 'region' 
                      ? (language === 'el' ? 'Επαρχία' : 'Province')
                      : (language === 'el' ? 'Κοινότητα' : 'Community')
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {location.province || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {location.code || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(location.createdAt).toLocaleDateString(
                    language === 'el' ? 'el-GR' : 'en-US'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationManagement;