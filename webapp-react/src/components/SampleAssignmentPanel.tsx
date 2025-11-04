import { useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = 'http://localhost:5050';

interface Farm {
  id: string;
  farmCode: string;
  ownerName: string;
  province: string;
  community: string;
  farmType: string;
  totalArea: number;
  economicSize?: string;
  mainCrop?: string;
  livestockType?: string;
  legalStatus?: string;
  status?: string;
  createdAt?: string;
}

interface SampleGroup {
  id: string;
  name: string;
  description?: string;
  criteria?: string;
  createdAt: string;
  interviewer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  farmsCount: number;
  farms: {
    id: string;
    farmId: string;
    status: string;
    priority: string;
    assignedAt: string;
    farm: Farm;
  }[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  region?: string;
  organization?: string;
}

interface SampleAssignmentPanelProps {
  sampleId: string;
  sampleName: string;
  onClose: () => void;
  language: 'el' | 'en';
}

export function SampleAssignmentPanel({ sampleId, sampleName, onClose, language }: SampleAssignmentPanelProps) {
  const [availableFarms, setAvailableFarms] = useState<Farm[]>([]);
  const [sampleGroups, setSampleGroups] = useState<SampleGroup[]>([]);
  const [availableInterviewers, setAvailableInterviewers] = useState<User[]>([]);
  const [selectedFarms, setSelectedFarms] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [showConfirmAssignModal, setShowConfirmAssignModal] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<{groupId: string, farmIds: string[]} | null>(null);
  
  // Filters for left panel
  const [filters, setFilters] = useState({
    province: '',
    farmType: '',
    sizeCategory: '',
    economicSize: '',
    searchTerm: ''
  });

  // New group form
  const [newGroupForm, setNewGroupForm] = useState({
    name: '',
    description: '',
    interviewerId: '',
    criteria: {}
  });

  // Mock interviewers data (in real app would come from API)
  const mockInterviewers: User[] = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      firstName: 'Γιάννης',
      lastName: 'Παπαδόπουλος',
      email: 'giannis.papadopoulos@agriculture.gov.cy',
      role: 'surveyor',
      region: 'Λευκωσία'
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      firstName: 'Μαρία',
      lastName: 'Νικολάου',
      email: 'maria.nikolaou@agriculture.gov.cy',
      role: 'surveyor',
      region: 'Λεμεσός'
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      firstName: 'Άντρη',
      lastName: 'Γεωργίου',
      email: 'andri.georgiou@agriculture.gov.cy',
      role: 'surveyor',
      region: 'Πάφος'
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      firstName: 'Πέτρος',
      lastName: 'Κωνσταντίνου',
      email: 'petros.konstantinou@agriculture.gov.cy',
      role: 'surveyor',
      region: 'Λάρνακα'
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      firstName: 'Ελένη',
      lastName: 'Μιχαήλ',
      email: 'eleni.michael@agriculture.gov.cy',
      role: 'surveyor',
      region: 'Αμμόχωστος'
    }
  ];

  // Cyprus data for filters
  const cyprusData = {
    provinces: ['Λευκωσία', 'Λεμεσός', 'Λάρνακα', 'Πάφος', 'Αμμόχωστος'],
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
    ]
  };

  useEffect(() => {
    fetchData();
    fetchRealInterviewers();  // Use real users instead of mock data
  }, [sampleId]);

  const fetchRealInterviewers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (response.ok) {
        const users = await response.json();
        // Filter only users who can be interviewers (not system users)
        const interviewers = users.filter((user: any) => 
          user.role !== 'Administrator' && user.role !== 'User'
        );
        setAvailableInterviewers(interviewers);
      } else {
        // Fallback to mock data if API fails
        setAvailableInterviewers(mockInterviewers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data
      setAvailableInterviewers(mockInterviewers);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAvailableFarms(),
        fetchSampleGroups()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableFarms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/SampleGroups/available-farms/${sampleId}`);
      if (response.ok) {
        const farms = await response.json();
        setAvailableFarms(farms);
      }
    } catch (error) {
      console.error('Error fetching available farms:', error);
    }
  };

  const fetchSampleGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/SampleGroups/by-sample/${sampleId}`);
      if (response.ok) {
        const groups = await response.json();
        setSampleGroups(groups);
      }
    } catch (error) {
      console.error('Error fetching sample groups:', error);
    }
  };

  const createGroup = async () => {
    // Basic validation
    if (!newGroupForm.name.trim()) {
      alert(language === 'el' ? 'Παρακαλώ εισάγετε όνομα ομάδας' : 'Please enter group name');
      return;
    }

    if (!newGroupForm.interviewerId) {
      alert(language === 'el' ? 'Παρακαλώ επιλέξτε συνεντευκτή' : 'Please select an interviewer');
      return;
    }

    setIsCreatingGroup(true);

    try {
      const payload = {
        SampleId: sampleId,
        Name: newGroupForm.name.trim(),
        Description: newGroupForm.description?.trim() || null,
        InterviewerId: newGroupForm.interviewerId,
        Criteria: newGroupForm.criteria || null,
        CreatedBy: "00000000-0000-0000-0000-000000000001"  // Default system user
      };

      console.log('Creating group with payload:', payload);

      const response = await fetch(`${API_BASE_URL}/api/SampleGroups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newGroup = await response.json();
        console.log('Group created successfully:', newGroup);
        
        setSampleGroups(prev => [...prev, newGroup]);
        setShowCreateGroupModal(false);
        setNewGroupForm({
          name: '',
          description: '',
          interviewerId: '',
          criteria: {}
        });
        
        alert(language === 'el' ? 'Ομάδα δημιουργήθηκε επιτυχώς!' : 'Group created successfully!');
        
        // Refresh the data to ensure consistency
        await fetchSampleGroups();
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        
        // Show more specific error message
        const errorMsg = language === 'el' 
          ? `Σφάλμα κατά τη δημιουργία ομάδας: ${errorText.includes('duplicate') ? 'Υπάρχει ήδη ομάδα με αυτό το όνομα' : 'Παρακαλώ δοκιμάστε ξανά'}`
          : `Error creating group: ${errorText.includes('duplicate') ? 'Group name already exists' : 'Please try again'}`;
        
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert(language === 'el' ? 'Σφάλμα σύνδεσης με τον server' : 'Server connection error');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const assignFarmsToGroup = async (groupId: string, farmIds: string[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/SampleGroups/${groupId}/assign-farms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmIds: farmIds,
          status: 'assigned',
          priority: 'medium'
        }),
      });

      if (response.ok) {
        // Remove assigned farms from available farms
        setAvailableFarms(prev => prev.filter(f => !farmIds.includes(f.id)));
        
        // Refresh groups to show new assignments
        await fetchSampleGroups();
        
        setSelectedFarms([]);
        setSelectedGroup(null);
        
        alert(language === 'el' 
          ? `${farmIds.length} εκμεταλλεύσεις ανατέθηκαν επιτυχώς στην ομάδα!`
          : `${farmIds.length} farms assigned successfully to group!`
        );
      } else {
        alert(language === 'el' ? 'Σφάλμα κατά την ανάθεση εκμεταλλεύσεων' : 'Error assigning farms');
      }
    } catch (error) {
      console.error('Error assigning farms:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την ανάθεση εκμεταλλεύσεων' : 'Error assigning farms');
    }
  };

  const removeFarmFromGroup = async (groupId: string, farmId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/SampleGroups/${groupId}/farms/${farmId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh data
        await fetchData();
        
        alert(language === 'el' 
          ? 'Εκμετάλλευση αφαιρέθηκε από την ομάδα!'
          : 'Farm removed from group!'
        );
      } else {
        alert(language === 'el' ? 'Σφάλμα κατά την αφαίρεση εκμετάλλευσης' : 'Error removing farm');
      }
    } catch (error) {
      console.error('Error removing farm:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την αφαίρεση εκμετάλλευσης' : 'Error removing farm');
    }
  };

  const updateGroupInterviewer = async (groupId: string, interviewerId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/SampleGroups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          InterviewerId: interviewerId || null  // API expects capitalized property name
        }),
      });

      if (response.ok) {
        await fetchSampleGroups();
        alert(language === 'el' 
          ? 'Συνεντευκτής ενημερώθηκε επιτυχώς!'
          : 'Interviewer updated successfully!'
        );
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        alert(language === 'el' ? 'Σφάλμα κατά την ενημέρωση συνεντευκτή' : 'Error updating interviewer');
      }
    } catch (error) {
      console.error('Error updating interviewer:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την ενημέρωση συνεντευκτή' : 'Error updating interviewer');
    }
  };

  // Filter available farms based on selected filters
  const filteredFarms = availableFarms.filter(farm => {
    if (filters.province && farm.province !== filters.province) return false;
    if (filters.farmType && farm.farmType !== filters.farmType) return false;
    if (filters.economicSize && farm.economicSize !== filters.economicSize) return false;
    if (filters.searchTerm && !farm.ownerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !farm.farmCode.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleFarmSelection = (farmId: string, selected: boolean) => {
    if (selected) {
      setSelectedFarms(prev => [...prev, farmId]);
    } else {
      setSelectedFarms(prev => prev.filter(id => id !== farmId));
    }
  };

  const handleSelectAllFarms = () => {
    const allFilteredFarmIds = filteredFarms.map(farm => farm.id);
    setSelectedFarms(allFilteredFarmIds);
  };

  const handleDeselectAllFarms = () => {
    setSelectedFarms([]);
  };

  const handleAssignToGroup = () => {
    if (!selectedGroup || selectedFarms.length === 0) {
      alert(language === 'el' 
        ? 'Παρακαλώ επιλέξτε ομάδα και τουλάχιστον μία εκμετάλλευση'
        : 'Please select a group and at least one farm'
      );
      return;
    }

    assignFarmsToGroup(selectedGroup, selectedFarms);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg">{language === 'el' ? 'Φόρτωση...' : 'Loading...'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden mx-4 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {language === 'el' ? 'Τμηματοποίηση & Ανάθεση Δείγματος' : 'Sample Segmentation & Assignment'}
              </h2>
              <p className="text-blue-100 mt-1">{sampleName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Content - Split UI */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Available Farms */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'el' ? 'Διαθέσιμες Εκμεταλλεύσεις' : 'Available Farms'}
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({filteredFarms.length})
                </span>
              </h3>

              {/* Filters */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <select
                  value={filters.province}
                  onChange={(e) => setFilters(prev => ({ ...prev, province: e.target.value }))}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="">{language === 'el' ? 'Όλες οι επαρχίες' : 'All provinces'}</option>
                  {cyprusData.provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>

                <select
                  value={filters.farmType}
                  onChange={(e) => setFilters(prev => ({ ...prev, farmType: e.target.value }))}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="">{language === 'el' ? 'Όλοι οι τύποι' : 'All types'}</option>
                  {cyprusData.farmTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  value={filters.economicSize}
                  onChange={(e) => setFilters(prev => ({ ...prev, economicSize: e.target.value }))}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="">{language === 'el' ? 'Όλα τα μεγέθη' : 'All sizes'}</option>
                  {cyprusData.economicSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder={language === 'el' ? 'Αναζήτηση...' : 'Search...'}
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
              />

              {/* Bulk Selection Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleSelectAllFarms}
                  disabled={filteredFarms.length === 0 || selectedFarms.length === filteredFarms.length}
                  className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'el' ? 'Επιλογή Όλων' : 'Select All'} ({filteredFarms.length})
                </button>
                <button
                  onClick={handleDeselectAllFarms}
                  disabled={selectedFarms.length === 0}
                  className="text-xs px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'el' ? 'Καθαρισμός Όλων' : 'Clear All'}
                </button>
              </div>

              {/* Selection Actions */}
              {selectedFarms.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedFarms.length} {language === 'el' ? 'επιλεγμένες' : 'selected'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedFarms([])}
                        className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        {language === 'el' ? 'Καθαρισμός' : 'Clear'}
                      </button>
                      <button
                        onClick={handleAssignToGroup}
                        disabled={!selectedGroup}
                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {language === 'el' ? 'Ανάθεση σε Ομάδα' : 'Assign to Group'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Farms List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredFarms.map((farm) => (
                  <div
                    key={farm.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFarms.includes(farm.id)
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleFarmSelection(farm.id, !selectedFarms.includes(farm.id))}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedFarms.includes(farm.id)}
                            onChange={(e) => handleFarmSelection(farm.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="font-medium text-gray-900">{farm.farmCode}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{farm.ownerName}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            {farm.province}
                          </span>
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            {farm.farmType}
                          </span>
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            {farm.totalArea} στρ.
                          </span>
                          {farm.economicSize && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              {farm.economicSize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredFarms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {language === 'el' 
                      ? 'Δεν βρέθηκαν διαθέσιμες εκμεταλλεύσεις'
                      : 'No available farms found'
                    }
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Sample Groups */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'el' ? 'Ομάδες Εκμεταλλεύσεων' : 'Farm Groups'}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({sampleGroups.length})
                  </span>
                </h3>
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  + {language === 'el' ? 'Νέα Ομάδα' : 'New Group'}
                </button>
              </div>

              {selectedGroup && (
                <div className="p-2 bg-orange-50 rounded border border-orange-200">
                  <span className="text-sm text-orange-800">
                    {language === 'el' 
                      ? 'Επιλεγμένη ομάδα για ανάθεση εκμεταλλεύσεων'
                      : 'Selected group for farm assignment'
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Groups List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {sampleGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedGroup === group.id
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        {group.description && (
                          <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {group.farmsCount} {language === 'el' ? 'εκμεταλλεύσεις' : 'farms'}
                          </span>
                          {selectedGroup === group.id && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              {language === 'el' ? 'Επιλεγμένη' : 'Selected'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interviewer Selection */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {language === 'el' ? 'Συνεντευκτής' : 'Interviewer'}
                      </label>
                      <select
                        value={group.interviewer?.id || ''}
                        onChange={(e) => updateGroupInterviewer(group.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">{language === 'el' ? 'Επιλέξτε συνεντευκτή' : 'Select interviewer'}</option>
                        {availableInterviewers.map(interviewer => (
                          <option key={interviewer.id} value={interviewer.id}>
                            {interviewer.firstName} {interviewer.lastName} ({interviewer.region})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Assigned Farms */}
                    {group.farms.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">
                          {language === 'el' ? 'Ανατεθειμένες Εκμεταλλεύσεις' : 'Assigned Farms'}
                        </h5>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {group.farms.map((assignedFarm) => (
                            <div
                              key={assignedFarm.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                            >
                              <div>
                                <span className="font-medium">{assignedFarm.farm.farmCode}</span>
                                <span className="text-gray-600 ml-2">{assignedFarm.farm.ownerName}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFarmFromGroup(group.id, assignedFarm.farmId);
                                }}
                                className="text-red-600 hover:text-red-800 ml-2"
                                title={language === 'el' ? 'Αφαίρεση' : 'Remove'}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {sampleGroups.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>{language === 'el' ? 'Δεν υπάρχουν ομάδες' : 'No groups exist'}</p>
                    <button
                      onClick={() => setShowCreateGroupModal(true)}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {language === 'el' ? 'Δημιουργία Πρώτης Ομάδας' : 'Create First Group'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {language === 'el' 
                ? `${availableFarms.length} διαθέσιμες, ${sampleGroups.reduce((sum, g) => sum + g.farmsCount, 0)} ανατεθειμένες`
                : `${availableFarms.length} available, ${sampleGroups.reduce((sum, g) => sum + g.farmsCount, 0)} assigned`
              }
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              {language === 'el' ? 'Κλείσιμο' : 'Close'}
            </button>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'el' ? 'Δημιουργία Νέας Ομάδας' : 'Create New Group'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'el' ? 'Όνομα Ομάδας' : 'Group Name'}
                </label>
                <input
                  type="text"
                  value={newGroupForm.name}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={language === 'el' ? 'π.χ. Λευκωσία - Ελαιώνες' : 'e.g. Nicosia - Olive Groves'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'el' ? 'Περιγραφή' : 'Description'}
                </label>
                <textarea
                  value={newGroupForm.description}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder={language === 'el' ? 'Προαιρετική περιγραφή...' : 'Optional description...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'el' ? 'Συνεντευκτής' : 'Interviewer'}
                </label>
                <select
                  value={newGroupForm.interviewerId}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, interviewerId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">{language === 'el' ? 'Επιλέξτε αργότερα' : 'Select later'}</option>
                  {availableInterviewers.map(interviewer => (
                    <option key={interviewer.id} value={interviewer.id}>
                      {interviewer.firstName} {interviewer.lastName} ({interviewer.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateGroupModal(false)}
                disabled={isCreatingGroup}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'el' ? 'Ακύρωση' : 'Cancel'}
              </button>
              <button
                onClick={createGroup}
                disabled={isCreatingGroup || !newGroupForm.name.trim() || !newGroupForm.interviewerId}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingGroup ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {language === 'el' ? 'Δημιουργία...' : 'Creating...'}
                  </>
                ) : (
                  language === 'el' ? 'Δημιουργία' : 'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}