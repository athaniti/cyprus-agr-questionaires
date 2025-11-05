import React, { useState } from 'react';
import CascadingLocationForm from './CascadingLocationForm';
import LocationRegistry from './LocationRegistry';

type TabType = 'registry' | 'create' | 'import';

const LocationManagementHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('registry');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLocationCreated = () => {
    // Refresh the registry view
    setRefreshKey(prev => prev + 1);
    // Optionally switch to registry view to see the new location
    setActiveTab('registry');
  };

  const handleLocationSelected = (location: any) => {
    setSelectedLocation(location);
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
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Εισαγωγή από Αρχείο CSV
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Εισαγωγή Τοποθεσιών από CSV
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Μορφή αρχείου: Όνομα, Δήμος, Κοινότητα, Επαρχία, Κωδικός
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Σημείωση:</strong> Η λειτουργία εισαγωγής από αρχείο θα υλοποιηθεί στην επόμενη φάση.
                  Αυτή τη στιγμή μπορείτε να χρησιμοποιήσετε τη φόρμα "Νέα Καταχώρηση" για να προσθέσετε τοποθεσίες μεμονωμένα.
                </p>
              </div>
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
              >
                Επιλογή Αρχείου (Σύντομα)
              </button>
            </div>
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