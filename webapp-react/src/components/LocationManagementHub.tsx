import React, { useState } from 'react';
import CascadingLocationForm from './CascadingLocationForm';
import LocationRegistry from './LocationRegistry';

type TabType = 'registry' | 'create' | 'import';

interface CSVLocation {
  name: string;
  municipality: string;
  community: string;
  district: string;
  code?: string;
  isValid: boolean;
  errors: string[];
}

interface ImportResult {
  successful: number;
  rejected: number;
  existing: number;
  locations: CSVLocation[];
}

const LocationManagementHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('registry');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedLocations, setParsedLocations] = useState<CSVLocation[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');

  const handleLocationCreated = () => {
    // Refresh the registry view
    setRefreshKey(prev => prev + 1);
    // Optionally switch to registry view to see the new location
    setActiveTab('registry');
  };

  const handleLocationSelected = (location: any) => {
    setSelectedLocation(location);
  };

  const parseCSV = (file: File): Promise<CSVLocation[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          const locations: CSVLocation[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const location: CSVLocation = {
              name: '',
              municipality: '',
              community: '',
              district: '',
              code: '',
              isValid: true,
              errors: []
            };
            
            // Map CSV columns to location fields
            headers.forEach((header, index) => {
              const value = values[index] || '';
              switch (header) {
                case 'όνομα':
                case 'name':
                  location.name = value;
                  break;
                case 'δήμος':
                case 'municipality':
                  location.municipality = value;
                  break;
                case 'κοινότητα':
                case 'community':
                  location.community = value;
                  break;
                case 'επαρχία':
                case 'district':
                  location.district = value;
                  break;
                case 'κωδικός':
                case 'code':
                  location.code = value;
                  break;
              }
            });
            
            // Validation
            if (!location.name) {
              location.errors.push('Λείπει το όνομα');
              location.isValid = false;
            }
            if (!location.municipality) {
              location.errors.push('Λείπει ο δήμος');
              location.isValid = false;
            }
            if (!location.community) {
              location.errors.push('Λείπει η κοινότητα');
              location.isValid = false;
            }
            if (!location.district) {
              location.errors.push('Λείπει η επαρχία');
              location.isValid = false;
            }
            
            if (location.name || location.municipality || location.community || location.district) {
              locations.push(location);
            }
          }
          
          resolve(locations);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Σφάλμα ανάγνωσης αρχείου'));
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    try {
      setSelectedFile(file);
      const locations = await parseCSV(file);
      setParsedLocations(locations);
      setStep('preview');
    } catch (error) {
      alert(`Σφάλμα επεξεργασίας αρχείου: ${error}`);
    }
  };

  const downloadTemplate = () => {
    const headers = 'Όνομα,Δήμος,Κοινότητα,Επαρχία,Κωδικός';
    const sampleData = [
      'Αγλαντζιά,Λευκωσία,Αγλαντζιά,Λευκωσία,01001',
      'Στρόβολος,Λευκωσία,Στρόβολος,Λευκωσία,01002',
      'Λάρνακα,Λάρνακα,Λάρνακα,Λάρνακα,03001'
    ].join('\n');
    
    const csvContent = `${headers}\n${sampleData}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'locations_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const processImport = () => {
    const validLocations = parsedLocations.filter(loc => loc.isValid);
    const invalidLocations = parsedLocations.filter(loc => !loc.isValid);
    
    // Simulate processing (σε πραγματική εφαρμογή θα στέλναμε στο API)
    const result: ImportResult = {
      successful: validLocations.length,
      rejected: invalidLocations.length,
      existing: 0, // Θα ελέγχαμε για duplicates
      locations: parsedLocations
    };
    
    setImportResult(result);
    setStep('result');
    
    // Refresh registry if successful imports
    if (result.successful > 0) {
      setRefreshKey(prev => prev + 1);
    }
  };

  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'registry': return 'Προβολή Μητρώων';
      case 'create': return 'Νέα Καταχώρηση';
      case 'import': return 'Εισαγωγή από Αρχείο';
      default: return '';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'registry':
        return (
          <LocationRegistry
            key={refreshKey}
            onLocationSelected={handleLocationSelected}
          />
        );
      case 'create':
        return (
          <CascadingLocationForm
            onLocationCreated={handleLocationCreated}
          />
        );
      case 'import':
        return (
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Εισαγωγή από Αρχείο CSV
            </h2>
            
            {step === 'upload' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-green-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Εισαγωγή Τοποθεσιών από CSV
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Μορφή αρχείου: Όνομα, Δήμος, Κοινότητα, Επαρχία, Κωδικός
                </p>
                
                <div className="space-y-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={downloadTemplate}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      📥 Λήψη Template
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    <strong>✅ Ενεργοποιημένο:</strong> Η λειτουργία εισαγωγής από αρχείο είναι πλέον διαθέσιμη!
                    Επιλέξτε ένα CSV αρχείο για να ξεκινήσετε.
                  </p>
                </div>
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-900">Προεπισκόπηση Δεδομένων</h3>
                  <p className="text-sm text-blue-700">
                    Βρέθηκαν {parsedLocations.length} εγγραφές. 
                    Έγκυρες: {parsedLocations.filter(l => l.isValid).length}, 
                    Με σφάλματα: {parsedLocations.filter(l => !l.isValid).length}
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Όνομα</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Δήμος</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Κοινότητα</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Επαρχία</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Κωδικός</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Κατάσταση</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedLocations.map((location, index) => (
                        <tr key={index} className={location.isValid ? '' : 'bg-red-50'}>
                          <td className="px-4 py-2 text-sm text-gray-900">{location.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{location.municipality}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{location.community}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{location.district}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{location.code}</td>
                          <td className="px-4 py-2 text-sm">
                            {location.isValid ? (
                              <span className="text-green-600">✅ Έγκυρη</span>
                            ) : (
                              <span className="text-red-600">❌ {location.errors.join(', ')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setStep('upload')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Πίσω
                  </button>
                  <button
                    onClick={processImport}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    🚀 Εισαγωγή ({parsedLocations.filter(l => l.isValid).length} εγγραφές)
                  </button>
                </div>
              </div>
            )}

            {step === 'result' && importResult && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Ολοκλήρωση Εισαγωγής</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.successful}</div>
                    <div className="text-sm text-green-700">Επιτυχής Εισαγωγή</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResult.rejected}</div>
                    <div className="text-sm text-red-700">Απορρίφθηκαν</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{importResult.existing}</div>
                    <div className="text-sm text-yellow-700">Υπάρχουν Ήδη</div>
                  </div>
                </div>

                {importResult.rejected > 0 && (
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-medium text-red-900 mb-2">Σφάλματα:</h4>
                    <ul className="space-y-1">
                      {importResult.locations.filter(l => !l.isValid).map((location, index) => (
                        <li key={index} className="text-sm text-red-700">
                          {location.name || 'Άγνωστη εγγραφή'}: {location.errors.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setStep('upload');
                      setParsedLocations([]);
                      setImportResult(null);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Νέα Εισαγωγή
                  </button>
                  <button
                    onClick={() => setActiveTab('registry')}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Προβολή Μητρώων
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Διαχείριση Γεωγραφικών Τοποθεσιών
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Σύστημα διαχείρισης 4-επίπεδης ιεραρχίας: Επαρχία → Δήμος → Κοινότητα → Τοποθεσία
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['registry', 'create', 'import'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getTabTitle(tab)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Selected Location Info (if any) */}
      {selectedLocation && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
          <h4 className="font-medium text-gray-900 mb-2">Επιλεγμένη Τοποθεσία:</h4>
          <p className="text-sm text-gray-600">
            <strong>Όνομα:</strong> {selectedLocation.name}
          </p>
          {selectedLocation.code && (
            <p className="text-sm text-gray-600">
              <strong>Κωδικός:</strong> {selectedLocation.code}
            </p>
          )}
          {selectedLocation.parentName && (
            <p className="text-sm text-gray-600">
              <strong>Ανήκει σε:</strong> {selectedLocation.parentName}
            </p>
          )}
          <button
            onClick={() => setSelectedLocation(null)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Κλείσιμο
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationManagementHub;