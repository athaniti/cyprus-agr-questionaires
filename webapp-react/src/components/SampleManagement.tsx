import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Questionnaire {
  id: string;
  name: string;
  themeId?: string;
}

interface SampleFilter {
  provinces?: string[];
  communities?: string[];
  farmTypes?: string[];
  sizeCategories?: string[];
  economicSizes?: string[];
  legalStatuses?: string[];
  mainCrops?: string[];
  livestockTypes?: string[];
  minimumArea?: number;
  maximumArea?: number;
  minimumValue?: number;
  maximumValue?: number;
  priority?: 'high' | 'medium' | 'low';
}

interface Sample {
  id: string;
  questionnaire?: Questionnaire;
  questionnaire_id: string;
  name: string;
  description: string;
  total_farms: number;
  sample_size: number;
  filter_criteria: SampleFilter;
  created_at: string;
  is_active: boolean;
  created_by_id: string;
}

export function SampleManagement() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  
  // Form states
  const [formData, setFormData] = useState({
    questionnaire_id: '',
    name: '',
    description: '',
    sample_size: 100,
    filter_criteria: {
      provinces: [],
      communities: [],
      farmTypes: [],
      sizeCategories: [],
      economicSizes: [],
      legalStatuses: [],
      mainCrops: [],
      livestockTypes: [],
      minimumArea: 0,
      maximumArea: 1000,
      minimumValue: 0,
      maximumValue: 500000,
      priority: 'medium'
    } as SampleFilter
  });

  // Δεδομένα Κύπρου για ρεαλισμό
  const cyprusData = {
    provinces: [
      'Λευκωσία',
      'Λεμεσός', 
      'Λάρνακα',
      'Πάφος',
      'Αμμόχωστος'
    ],
    
    communities: {
      'Λευκωσία': ['Λευκωσία', 'Στρόβολος', 'Λατσιά', 'Αγλαντζιά', 'Έγκωμη', 'Δάλι', 'Πέρα', 'Κοκκινοτριμιθιά', 'Λαϊκή Γειτονιά', 'Αγία Μαρίνα'],
      'Λεμεσός': ['Λεμεσός', 'Γερμασόγεια', 'Πολεμίδια', 'Άγιος Αθανάσιος', 'Υψώνας', 'Κολόσσι', 'Ερήμη', 'Μέσα Γειτονιά', 'Πύργος', 'Παρεκκλησιά'],
      'Λάρνακα': ['Λάρνακα', 'Αραδίππου', 'Λιβάδια', 'Ορόκλινη', 'Δρομολαξιά', 'Κίτι', 'Πύλα', 'Αθηένου', 'Τέρνα', 'Ζύγι'],
      'Πάφος': ['Πάφος', 'Γερόσκηπου', 'Έμπα', 'Πέγεια', 'Πόλις Χρυσοχούς', 'Κίσσονεργα', 'Χλώρακα', 'Μεσόγη', 'Τρεμιθούσα', 'Αγία Μαρινούδα'],
      'Αμμόχωστος': ['Παραλίμνι', 'Δερύνεια', 'Αυγόρου', 'Σωτήρα', 'Φρέναρος', 'Αχερίτου', 'Λιοπέτρι', 'Ορμήδεια', 'Πρωταράς', 'Κάβο Γκρέκο']
    },
    
    farmTypes: [
      'Φυτική Παραγωγή',
      'Ζωική Παραγωγή', 
      'Μικτή Εκμετάλλευση',
      'Κηπευτικά',
      'Οπωροφόρα',
      'Αμπελώνες',
      'Ελαιώνες'
    ],
    
    sizeCategories: [
      'Πολύ Μικρή (0-5 στρέμματα)',
      'Μικρή (5-20 στρέμματα)',
      'Μεσαία (20-100 στρέμματα)',
      'Μεγάλη (100-500 στρέμματα)',
      'Πολύ Μεγάλη (>500 στρέμματα)'
    ],
    
    economicSizes: [
      'Πολύ Μικρό (0-8.000€)',
      'Μικρό (8.000-25.000€)',
      'Μεσαίο (25.000-100.000€)',
      'Μεγάλο (100.000-500.000€)',
      'Πολύ Μεγάλο (>500.000€)'
    ],
    
    legalStatuses: [
      'Φυσικό Πρόσωπο',
      'Εταιρεία',
      'Συνεταιρισμός',
      'Οικογενειακή Επιχείρηση'
    ],
    
    mainCrops: [
      'Σιτάρι',
      'Κριθάρι',
      'Καλαμπόκι',
      'Πατάτες',
      'Τομάτες',
      'Αγγούρια',
      'Πεπόνια',
      'Καρπούζια',
      'Εσπεριδοειδή',
      'Ελιές',
      'Σταφύλια',
      'Αμύγδαλα',
      'Χαρούπια'
    ],
    
    livestockTypes: [
      'Βοοειδή',
      'Αιγοπρόβατα',
      'Χοιροτροφία',
      'Πουλερικά',
      'Μελίσσια'
    ]
  };

  // Get communities for selected provinces
  const getAvailableCommunities = () => {
    const selectedProvinces = formData.filter_criteria.provinces || [];
    const communities: string[] = [];
    
    selectedProvinces.forEach(province => {
      if (cyprusData.communities[province as keyof typeof cyprusData.communities]) {
        communities.push(...cyprusData.communities[province as keyof typeof cyprusData.communities]);
      }
    });
    
    return [...new Set(communities)]; // Remove duplicates
  };

  useEffect(() => {
    fetchSamples();
    fetchQuestionnaires();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/samples');
      if (response.ok) {
        const data = await response.json();
        setSamples(data);
      }
    } catch (error) {
      console.error('Error fetching samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionnaires = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/questionnaires');
      if (response.ok) {
        const data = await response.json();
        // Handle the paginated response structure
        setQuestionnaires(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
    }
  };

  const handleCreateSample = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5050/api/samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newSample = await response.json();
        setSamples([...samples, newSample]);
        setShowCreateModal(false);
        resetForm();
      } else {
        console.error('Error creating sample');
      }
    } catch (error) {
      console.error('Error creating sample:', error);
    }
  };

  const generateSample = async (sampleId: string) => {
    try {
      const response = await fetch(`http://localhost:5050/api/samples/${sampleId}/generate`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchSamples(); // Refresh the list
      } else {
        console.error('Error generating sample');
      }
    } catch (error) {
      console.error('Error generating sample:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      questionnaire_id: '',
      name: '',
      description: '',
      sample_size: 100,
      filter_criteria: {
        provinces: [],
        communities: [],
        farmTypes: [],
        sizeCategories: [],
        economicSizes: [],
        legalStatuses: [],
        mainCrops: [],
        livestockTypes: [],
        minimumArea: 0,
        maximumArea: 1000,
        minimumValue: 0,
        maximumValue: 500000,
        priority: 'medium'
      }
    });
  };

  const handleArrayFieldChange = (
    field: keyof SampleFilter,
    value: string,
    checked: boolean
  ) => {
    const currentArray = formData.filter_criteria[field] as string[] || [];
    
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);

    setFormData({
      ...formData,
      filter_criteria: {
        ...formData.filter_criteria,
        [field]: newArray
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Φόρτωση...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Διαχείριση Δειγμάτων</h1>
        <p className="text-gray-600">Δημιουργία και διαχείριση δειγμάτων για ερωτηματολόγια</p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Νέο Δείγμα
        </button>
      </div>

      {/* Samples Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Δείγματα</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Όνομα
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ερωτηματολόγιο
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Μέγεθος Δείγματος
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Κατάσταση
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ημερομηνία
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {samples.map((sample) => (
                <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sample.name}</div>
                    <div className="text-sm text-gray-500">{sample.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.questionnaire?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.sample_size} από {sample.total_farms}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                      sample.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {sample.is_active ? 'Ενεργό' : 'Ανενεργό'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sample.created_at).toLocaleDateString('el-GR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => generateSample(sample.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Παραγωγή
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      Προβολή
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Διαγραφή
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sample Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Δημιουργία Νέου Δείγματος</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Κλείσιμο</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateSample} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Βασικές Πληροφορίες</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ερωτηματολόγιο</label>
                      <select
                        value={formData.questionnaire_id}
                        onChange={(e) => setFormData({...formData, questionnaire_id: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Επιλέξτε ερωτηματολόγιο</option>
                        {questionnaires.map((q) => (
                          <option key={q.id} value={q.id}>{q.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Όνομα Δείγματος</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Περιγραφή</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Μέγεθος Δείγματος</label>
                      <input
                        type="number"
                        value={formData.sample_size}
                        onChange={(e) => setFormData({...formData, sample_size: parseInt(e.target.value)})}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Filter Criteria */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Κριτήρια Φιλτραρίσματος</h4>
                    
                    {/* Provinces */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Επαρχίες</label>
                      <div className="grid grid-cols-2 gap-2">
                        {cyprusData.provinces.map((province) => (
                          <label key={province} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.filter_criteria.provinces?.includes(province) || false}
                              onChange={(e) => handleArrayFieldChange('provinces', province, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{province}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Communities - Show only for selected provinces */}
                    {(formData.filter_criteria.provinces?.length || 0) > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Κοινότητες/Δήμοι</label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {getAvailableCommunities().map((community) => (
                            <label key={community} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.filter_criteria.communities?.includes(community) || false}
                                onChange={(e) => handleArrayFieldChange('communities', community, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{community}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Farm Types */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Τύποι Εκμετάλλευσης</label>
                      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                        {cyprusData.farmTypes.map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.filter_criteria.farmTypes?.includes(type) || false}
                              onChange={(e) => handleArrayFieldChange('farmTypes', type, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Size Categories */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Κατηγορίες Μεγέθους (Έκταση)</label>
                      <div className="grid grid-cols-1 gap-2">
                        {cyprusData.sizeCategories.map((size) => (
                          <label key={size} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.filter_criteria.sizeCategories?.includes(size) || false}
                              onChange={(e) => handleArrayFieldChange('sizeCategories', size, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Economic Sizes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Οικονομικό Μέγεθος</label>
                      <div className="grid grid-cols-1 gap-2">
                        {cyprusData.economicSizes.map((size) => (
                          <label key={size} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.filter_criteria.economicSizes?.includes(size) || false}
                              onChange={(e) => handleArrayFieldChange('economicSizes', size, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ακύρωση
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Δημιουργία Δείγματος
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SampleManagement;