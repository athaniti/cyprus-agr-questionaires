import { Farm, Sample, SampleGroup, SamplesService } from '@/services/samplesService';
import { User, UsersService } from '@/services/usersService';
import { useState, useEffect } from 'react';

interface SampleAssignmentPanelProps {
  sample: Sample;
  onClose: () => void;
  language: 'el' | 'en';
}

export function SampleAssignmentPanel({ sample, onClose, language }: SampleAssignmentPanelProps) {
  const [availableFarms, setAvailableFarms] = useState<Farm[]|undefined>(undefined);
  const [sampleGroups, setSampleGroups] = useState<SampleGroup[]|undefined>(undefined);
  const [availableInterviewers, setAvailableInterviewers] = useState<User[]|undefined>(undefined);
  const [selectedFarms, setSelectedFarms] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SampleGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateGroupModal, setShowCreateEditGroupModal] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  
  
  // Filters for left panel
  const [filters, setFilters] = useState({
    province: '',
    farmType: '',
    sizeCategory: '',
    economicSize: '',
    searchTerm: ''
  });



  
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
  }, [sample]);

  const fetchAvailableInterviewers = async () => {
    var users = await UsersService.getUsers();
    setAvailableInterviewers(users);
  };

    const fetchAvailableFarms = async () => {
      var farmsOfSample = await SamplesService.getSampleParticipants(sample.id);
      setAvailableFarms(farmsOfSample);
  };

  const fetchSampleGroups = async () => {
    var groupsOfSample = await SamplesService.getSampleGroups(sample.id);
    setSampleGroups( groupsOfSample.map(g=>{
      return {...g, criteria:JSON.parse(g.serizedCriteria??'{}'), farmIds:JSON.parse(g.serializedFarmIds??'[]')}
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAvailableInterviewers(),
        fetchAvailableFarms(),
        fetchSampleGroups()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEditGroup = async () => {
    if (!selectedGroup) return;
    // Basic validation
    if (!selectedGroup!.name.trim()) {
      alert(language === 'el' ? 'Παρακαλώ εισάγετε όνομα ομάδας' : 'Please enter group name');
      return;
    }
    if (!selectedGroup.interviewerId) {
      alert(language === 'el' ? 'Παρακαλώ επιλέξτε συνεντευκτή' : 'Please select an interviewer');
      return;
    }

    setIsCreatingGroup(true);
    if (selectedGroup.id) {
      await SamplesService.updateSampleGroup(sample.id, selectedGroup.id, selectedGroup);
    } else {
      await SamplesService.createSampleGroup(sample.id, selectedGroup);
    }
    
    setShowCreateEditGroupModal(false);
    setIsCreatingGroup(false);
    setSelectedGroup(null);
    setSelectedFarms([]);
    await fetchSampleGroups();
  };

  const assignFarmsToGroup = async (farmIds: string[]) => {
    if (!selectedGroup) return;
    selectedGroup.farmIds = farmIds;
    selectedGroup.serializedFarmIds = JSON.stringify(farmIds);
    await SamplesService.updateSampleGroup(sample.id, selectedGroup!.id, selectedGroup!);
    fetchSampleGroups();
  };

  const removeFarmFromGroup = async (farmId: string) => {
    if (!selectedGroup) return;
    selectedGroup.farmIds = (selectedGroup.farmIds ?? []).filter(id => id !== farmId) 
    selectedGroup.serializedFarmIds = JSON.stringify(selectedGroup.farmIds);
    await SamplesService.updateSampleGroup(sample.id, selectedGroup!.id, selectedGroup!);
    fetchSampleGroups();
    setSelectedFarms(selectedGroup.farmIds);
  };



  // Filter available farms based on selected filters
  const filteredFarms = (availableFarms ?? []).filter(farm => {
    if (sampleGroups && selectedGroup && sampleGroups.findIndex(sg => sg.id !== selectedGroup.id && sg.farmIds && sg.farmIds.includes(farm.id)) >= 0) return false;
    if (filters.province && farm.province !== filters.province) return false;
    if (filters.farmType && farm.farmType !== filters.farmType) return false;
    if (filters.economicSize && farm.economicSize !== filters.economicSize) return false;
    if (filters.sizeCategory && farm.sizeCategory !== filters.sizeCategory) return false;
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

    assignFarmsToGroup(selectedFarms);
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
              <p className="text-blue-100 mt-1">{sample.name}</p>
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
          {/* Left Panel - Sample Groups */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'el' ? 'Ομάδες Εκμεταλλεύσεων' : 'Farm Groups'}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({(sampleGroups ?? []).length})
                  </span>
                </h3>
                <button
                  onClick={() => {
                    setShowCreateEditGroupModal(true);
                    setSelectedGroup({interviewerId : "11111111-1111-1111-1111-111111111111"} as SampleGroup);
                  }}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  {language === 'el' ? 'Νέα' : 'New'}
                </button>
                {selectedGroup &&<button
                  onClick={async() =>  {
                    setShowCreateEditGroupModal(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  {language === 'el' ? 'Επεξεργασία' : 'Edit'}
                </button>}
                {selectedGroup &&<button
                  onClick={async() =>  {
                    await SamplesService.deleteSampleGroup(sample.id, selectedGroup!.id);
                    setSelectedGroup(null);
                    setSelectedFarms([]);
                    fetchSampleGroups();
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  {language === 'el' ? 'Διαγραφή' : 'Delete'}
                </button>}
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

            {/* Sample Groups List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {(sampleGroups??[]).map((group) => (
                  <div
                    key={group.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedGroup && selectedGroup.id === group.id
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedGroup(group)
                      setSelectedFarms(group.farmIds??[]);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        {group.description && (
                          <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {group.farmIds?.length || 0} {language === 'el' ? 'εκμεταλλεύσεις' : 'farms'}
                          </span>
                          {selectedGroup && selectedGroup.id === group.id && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              {language === 'el' ? 'Επιλεγμένη' : 'Selected'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interviewer */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {language === 'el' ? 'Συνεντευκτής' : 'Interviewer'}
                      </label>
                      {group.interviewerId ? (availableInterviewers ?? []).find(u => u.id === group.interviewerId)?.lastName + " " + (availableInterviewers ?? []).find(u => u.id === group.interviewerId)?.firstName : '-'}
                    </div>

                    {/* Assigned Farms */}
                    {(group.farmIds && group.farmIds.length > 0) && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">
                          {language === 'el' ? 'Ανατεθειμένες Εκμεταλλεύσεις' : 'Assigned Farms'}
                        </h5>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {group.farmIds!.map((farmId) => (
                            <div
                              key={farmId}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                            >
                              <div>
                                <span className="font-medium">{(availableFarms ?? []).find(f=>f.id === farmId)?.farmCode}</span>
                                <span className="text-gray-600 ml-2">{(availableFarms ?? []).find(f=>f.id === farmId)?.ownerName}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFarmFromGroup(farmId);
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
                {(sampleGroups??[]).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>{language === 'el' ? 'Δεν υπάρχουν ομάδες' : 'No groups exist'}</p>
                    <button
                      onClick={() => {
                        setSelectedGroup({interviewerId:(availableInterviewers??[])[0]?.id} as SampleGroup);
                        setShowCreateEditGroupModal(true)
                      }}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {language === 'el' ? 'Δημιουργία Πρώτης Ομάδας' : 'Create First Group'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Right Panel - Available Farms */}
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
                {(sample.filterCriteria.provinces && sample.filterCriteria.provinces.length > 0) &&
                  <select
                    value={filters.province}
                    onChange={(e) => setFilters(prev => ({ ...prev, province: e.target.value }))}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="">{language === 'el' ? 'Όλες οι επαρχίες' : 'All provinces'}</option>
                    {cyprusData.provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>}

                {(sample.filterCriteria.farmTypes && sample.filterCriteria.farmTypes.length > 0) &&
                  <select
                    value={filters.farmType}
                    onChange={(e) => setFilters(prev => ({ ...prev, farmType: e.target.value }))}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="">{language === 'el' ? 'Όλοι οι τύποι' : 'All types'}</option>
                    {cyprusData.farmTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>}

                {(sample.filterCriteria.sizeCategories && sample.filterCriteria.sizeCategories.length > 0) &&
                  <select
                    value={filters.sizeCategory}
                    onChange={(e) => setFilters(prev => ({ ...prev, sizeCategory: e.target.value }))}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="">{language === 'el' ? 'Όλα τα μεγέθη' : 'All sizes'}</option>
                    {cyprusData.sizeCategories.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>}

                {(sample.filterCriteria.economicSizes && sample.filterCriteria.economicSizes.length > 0) &&
                  <select
                    value={filters.economicSize}
                    onChange={(e) => setFilters(prev => ({ ...prev, economicSize: e.target.value }))}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="">{language === 'el' ? 'Όλα τα οικ. μεγέθη' : 'All sizes'}</option>
                    {cyprusData.economicSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>}
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
                            disabled={!selectedGroup}
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
                            {farm.sizeCategory}
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {language === 'el' 
                ? `${(availableFarms??[]).length} διαθέσιμες, ${(sampleGroups??[]).reduce((sum, g) => sum + (g.farmIds ??[]).length, 0)} ανατεθειμένες`
                : `${(availableFarms??[]).length} available, ${(sampleGroups??[]).reduce((sum, g) => sum + (g.farmIds ??[]).length, 0)} assigned`
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
      {(showCreateGroupModal && selectedGroup) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'el' ? 'Στοιχεία ομάδας' : 'Group details'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'el' ? 'Όνομα Ομάδας' : 'Group Name'}
                </label>
                <input
                  type="text"
                  value={selectedGroup!.name}
                  onChange={(e) => setSelectedGroup(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={language === 'el' ? 'π.χ. Λευκωσία - Ελαιώνες' : 'e.g. Nicosia - Olive Groves'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'el' ? 'Περιγραφή' : 'Description'}
                </label>
                <textarea
                  value={selectedGroup!.description}
                  onChange={(e) => setSelectedGroup(prev => ({ ...prev!, description: e.target.value }))}
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
                  value={selectedGroup.interviewerId}
                  onChange={(e) => setSelectedGroup(prev => ({ ...prev!, interviewerId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {(availableInterviewers??[]).map(interviewer => (
                    <option key={interviewer.id} value={interviewer.id}>
                      {interviewer.firstName} {interviewer.lastName} ({interviewer.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateEditGroupModal(false)}
                disabled={isCreatingGroup}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'el' ? 'Ακύρωση' : 'Cancel'}
              </button>
              <button
                onClick={createEditGroup}
                disabled={isCreatingGroup || !selectedGroup || !selectedGroup.name || !selectedGroup!.interviewerId}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingGroup ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {language === 'el' ? 'Αποθήκεση...' : 'Saving...'}
                  </>
                ) : (
                  language === 'el' ? 'Αποθήκεση' : 'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}