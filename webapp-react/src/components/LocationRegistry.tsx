import React, { useState, useEffect } from 'react';

interface DropdownOption {
  id: string;
  name: string;
  code?: string;
}

interface LocationRegistryProps {
  onLocationSelected?: (location: any) => void;
}

const LocationRegistry: React.FC<LocationRegistryProps> = ({ onLocationSelected }) => {
  // Dropdown data
  const [provinces, setProvinces] = useState<DropdownOption[]>([]);
  const [municipalities, setMunicipalities] = useState<DropdownOption[]>([]);
  const [communities, setCommunities] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Selected values
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');

  // View mode
  const [viewMode, setViewMode] = useState<'provinces' | 'municipalities' | 'communities' | 'locations'>('provinces');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const API_BASE_URL = 'http://localhost:5050/api';

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load data based on view mode and selections
  useEffect(() => {
    switch (viewMode) {
      case 'provinces':
        loadProvinces();
        break;
      case 'municipalities':
        if (selectedProvince) {
          loadMunicipalities(selectedProvince);
        } else {
          loadAllMunicipalities();
        }
        break;
      case 'communities':
        if (selectedMunicipality) {
          loadCommunities(selectedMunicipality);
        } else {
          loadAllCommunities();
        }
        break;
      case 'locations':
        if (selectedCommunity) {
          loadLocations(selectedCommunity);
        }
        break;
    }
  }, [viewMode, selectedProvince, selectedMunicipality, selectedCommunity]);

  const loadProvinces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/provinces`);
      if (response.ok) {
        const data = await response.json();
        setProvinces(data);
      } else {
        setError('Αποτυχία φόρτωσης επαρχιών');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error loading provinces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMunicipalities = async (provinceId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/municipalities/${provinceId}`);
      if (response.ok) {
        const data = await response.json();
        setMunicipalities(data);
      } else {
        setError('Αποτυχία φόρτωσης δήμων');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error loading municipalities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllMunicipalities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/municipalities`);
      if (response.ok) {
        const data = await response.json();
        setMunicipalities(data);
      } else {
        setError('Αποτυχία φόρτωσης δήμων');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error loading all municipalities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommunities = async (municipalityId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/communities/${municipalityId}`);
      if (response.ok) {
        const data = await response.json();
        setCommunities(data);
      } else {
        setError('Αποτυχία φόρτωσης κοινοτήτων');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error loading communities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllCommunities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/communities`);
      if (response.ok) {
        const data = await response.json();
        setCommunities(data);
      } else {
        setError('Αποτυχία φόρτωσης κοινοτήτων');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error loading all communities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocations = async (communityId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/locations/${communityId}`);
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        setError('Αποτυχία φόρτωσης τοποθεσιών');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error loading locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getViewModeLabel = (mode: string) => {
    switch (mode) {
      case 'provinces': return 'Μητρώο Επαρχιών';
      case 'municipalities': return 'Μητρώο Δήμων';
      case 'communities': return 'Μητρώο Κοινοτήτων';
      case 'locations': return 'Μητρώο Τοποθεσιών';
      default: return 'Μητρώο';
    }
  };

  const getCurrentData = () => {
    switch (viewMode) {
      case 'provinces': return provinces;
      case 'municipalities': return municipalities;
      case 'communities': return communities;
      case 'locations': return locations;
      default: return [];
    }
  };

  const handleItemClick = (item: any) => {
    if (onLocationSelected) {
      onLocationSelected(item);
    }

    // Auto-navigate to next level if possible
    switch (viewMode) {
      case 'provinces':
        setSelectedProvince(item.id);
        setViewMode('municipalities');
        break;
      case 'municipalities':
        setSelectedMunicipality(item.id);
        setViewMode('communities');
        break;
      case 'communities':
        setSelectedCommunity(item.id);
        setViewMode('locations');
        break;
    }
  };

  const resetSelection = () => {
    setSelectedProvince('');
    setSelectedMunicipality('');
    setSelectedCommunity('');
    setViewMode('provinces');
  };

  const renderBreadcrumb = () => {
    const selectedProvinceName = provinces.find(p => p.id === selectedProvince)?.name;
    const selectedMunicipalityName = municipalities.find(m => m.id === selectedMunicipality)?.name;
    const selectedCommunityName = communities.find(c => c.id === selectedCommunity)?.name;

    return (
      <nav className="mb-4 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={() => setViewMode('provinces')}
              className="text-blue-600 hover:text-blue-800"
            >
              Επαρχίες
            </button>
          </li>
          {selectedProvinceName && (
            <>
              <li className="text-gray-500">/</li>
              <li>
                <button
                  onClick={() => setViewMode('municipalities')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {selectedProvinceName}
                </button>
              </li>
            </>
          )}
          {selectedMunicipalityName && (
            <>
              <li className="text-gray-500">/</li>
              <li>
                <button
                  onClick={() => setViewMode('communities')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {selectedMunicipalityName}
                </button>
              </li>
            </>
          )}
          {selectedCommunityName && (
            <>
              <li className="text-gray-500">/</li>
              <li>
                <button
                  onClick={() => setViewMode('locations')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {selectedCommunityName}
                </button>
              </li>
            </>
          )}
        </ol>
      </nav>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {getViewModeLabel(viewMode)}
        </h2>
        <button
          onClick={resetSelection}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Επαναφορά
        </button>
      </div>

      {renderBreadcrumb()}

      {/* View Mode Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Προβολή Μητρώου:
        </label>
        <div className="flex space-x-2">
          {['provinces', 'municipalities', 'communities', 'locations'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-4 py-2 rounded-md ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getViewModeLabel(mode)}
            </button>
          ))}
        </div>
      </div>

      {/* Filters for non-province views */}
      {viewMode !== 'provinces' && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Φίλτρο Επαρχίας:
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Όλες οι Επαρχίες</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {(viewMode === 'communities' || viewMode === 'locations') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Φίλτρο Δήμου:
              </label>
              <select
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedProvince && viewMode === 'locations'}
              >
                <option value="">Όλοι οι Δήμοι</option>
                {municipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'locations' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Φίλτρο Κοινότητας:
              </label>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedMunicipality}
              >
                <option value="">Όλες οι Κοινότητες</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && getCurrentData().length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Όνομα
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Κωδικός
                </th>
                {viewMode !== 'provinces' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ανήκει σε
                  </th>
                )}
                {viewMode === 'locations' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Γεωγρ. Πλάτος
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Γεωγρ. Μήκος
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentData().map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.code || '-'}
                  </td>
                  {viewMode !== 'provinces' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.parentName || item.municipality || '-'}
                    </td>
                  )}
                  {viewMode === 'locations' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.latitude || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.longitude || '-'}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleItemClick(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      {viewMode === 'locations' ? 'Επιλογή' : 'Προβολή'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Data Message */}
      {!isLoading && getCurrentData().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Δεν βρέθηκαν δεδομένα για την τρέχουσα επιλογή.
        </div>
      )}
    </div>
  );
};

export default LocationRegistry;