import React, { useState, useEffect } from 'react';

interface DropdownOption {
  id: string;
  name: string;
  code?: string;
}

interface CascadingLocationFormProps {
  onLocationCreated?: (location: any) => void;
}

interface CreateLocationRequest {
  name: string;
  type: string;
  provinceId?: string;
  municipalityId?: string;
  communityId?: string;
  code?: string;
  latitude?: number;
  longitude?: number;
}

const CascadingLocationForm: React.FC<CascadingLocationFormProps> = ({ onLocationCreated }) => {
  // Dropdown data
  const [provinces, setProvinces] = useState<DropdownOption[]>([]);
  const [municipalities, setMunicipalities] = useState<DropdownOption[]>([]);
  const [communities, setCommunities] = useState<DropdownOption[]>([]);

  // Selected values
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');

  // Form data
  const [locationType, setLocationType] = useState<string>('location');
  const [locationName, setLocationName] = useState<string>('');
  const [locationCode, setLocationCode] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const API_BASE_URL = 'http://localhost:5050/api';

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load municipalities when province changes
  useEffect(() => {
    if (selectedProvince) {
      loadMunicipalities(selectedProvince);
      setSelectedMunicipality('');
      setSelectedCommunity('');
      setCommunities([]);
    } else {
      setMunicipalities([]);
      setCommunities([]);
      setSelectedMunicipality('');
      setSelectedCommunity('');
    }
  }, [selectedProvince]);

  // Load communities when municipality changes
  useEffect(() => {
    if (selectedMunicipality) {
      loadCommunities(selectedMunicipality);
      setSelectedCommunity('');
    } else {
      setCommunities([]);
      setSelectedCommunity('');
    }
  }, [selectedMunicipality]);

  const loadProvinces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/provinces`);
      if (response.ok) {
        const data = await response.json();
        setProvinces(data);
      } else {
        console.error('Failed to load provinces');
      }
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  const loadMunicipalities = async (provinceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/municipalities/${provinceId}`);
      if (response.ok) {
        const data = await response.json();
        setMunicipalities(data);
      } else {
        console.error('Failed to load municipalities');
      }
    } catch (error) {
      console.error('Error loading municipalities:', error);
    }
  };

  const loadCommunities = async (municipalityId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/communities/${municipalityId}`);
      if (response.ok) {
        const data = await response.json();
        setCommunities(data);
      } else {
        console.error('Failed to load communities');
      }
    } catch (error) {
      console.error('Error loading communities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const requestData: CreateLocationRequest = {
        name: locationName,
        type: locationType,
        code: locationCode || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      };

      // Set parent based on location type
      if (locationType === 'municipality' && selectedProvince) {
        requestData.provinceId = selectedProvince;
      } else if (locationType === 'community' && selectedMunicipality) {
        requestData.municipalityId = selectedMunicipality;
      } else if (locationType === 'location' && selectedCommunity) {
        requestData.communityId = selectedCommunity;
      }

      const response = await fetch(`${API_BASE_URL}/Locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newLocation = await response.json();
        setSuccess(`${getLocationTypeLabel(locationType)} "${locationName}" δημιουργήθηκε επιτυχώς!`);
        
        // Reset form
        setLocationName('');
        setLocationCode('');
        setLatitude('');
        setLongitude('');
        if (locationType === 'province') {
          setSelectedProvince('');
        } else if (locationType === 'municipality') {
          setSelectedMunicipality('');
        } else if (locationType === 'community') {
          setSelectedCommunity('');
        }

        // Reload dependent dropdowns
        if (locationType === 'province') {
          await loadProvinces();
        } else if (locationType === 'municipality' && selectedProvince) {
          await loadMunicipalities(selectedProvince);
        } else if (locationType === 'community' && selectedMunicipality) {
          await loadCommunities(selectedMunicipality);
        }

        if (onLocationCreated) {
          onLocationCreated(newLocation);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Σφάλμα κατά τη δημιουργία');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου. Παρακαλώ δοκιμάστε ξανά.');
      console.error('Error creating location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'province': return 'Επαρχία';
      case 'municipality': return 'Δήμος';
      case 'community': return 'Κοινότητα';
      case 'location': return 'Τοποθεσία';
      default: return 'Καταχώρηση';
    }
  };

  const isFormValid = () => {
    if (!locationName.trim()) return false;
    
    switch (locationType) {
      case 'province':
        return true;
      case 'municipality':
        return selectedProvince !== '';
      case 'community':
        return selectedMunicipality !== '';
      case 'location':
        return selectedCommunity !== '';
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Νέα Καταχώρηση Τοποθεσίας
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Τύπος Καταχώρησης *
          </label>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="province">Επαρχία</option>
            <option value="municipality">Δήμος</option>
            <option value="community">Κοινότητα</option>
            <option value="location">Τοποθεσία</option>
          </select>
        </div>

        {/* Province Selection (for municipality, community, location) */}
        {(locationType === 'municipality' || locationType === 'community' || locationType === 'location') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Επαρχία *
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Επιλέξτε Επαρχία</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Municipality Selection (for community, location) */}
        {(locationType === 'community' || locationType === 'location') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Δήμος *
            </label>
            <select
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!selectedProvince}
            >
              <option value="">Επιλέξτε Δήμο</option>
              {municipalities.map((municipality) => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Community Selection (for location) */}
        {locationType === 'location' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Κοινότητα *
            </label>
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!selectedMunicipality}
            >
              <option value="">Επιλέξτε Κοινότητα</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Location Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Όνομα {getLocationTypeLabel(locationType)} *
          </label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Εισάγετε το όνομα της ${getLocationTypeLabel(locationType).toLowerCase()}`}
            required
          />
        </div>

        {/* Location Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Κωδικός
          </label>
          <input
            type="text"
            value={locationCode}
            onChange={(e) => setLocationCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Προαιρετικός κωδικός"
          />
        </div>

        {/* Coordinates (only for locations) */}
        {locationType === 'location' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Γεωγραφικό Πλάτος
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="π.χ. 35.1753"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Γεωγραφικό Μήκος
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="π.χ. 33.3642"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Δημιουργία...
            </span>
          ) : (
            `Δημιουργία ${getLocationTypeLabel(locationType)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default CascadingLocationForm;