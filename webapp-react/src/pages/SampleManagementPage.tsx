import React, { useState, useEffect } from 'react';
import { SampleAssignmentPanel } from '../components/SampleAssignmentPanel';
import { Sample, SampleFilter, SamplesService } from '@/services/samplesService';
import { Questionnaire, QuestionnaireService } from '@/services/questionnaireService';






export function SampleManagementPage() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  



  useEffect(()  => {
    SamplesService.getSamples().then(samplesResponse=> {
      setSamples(samplesResponse);
    });
    QuestionnaireService.getQuestionnaires().then(questionnairesResponse => {
      setQuestionnaires(questionnairesResponse.data);
    });
    
  }, []);



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
    if (!selectedSample) return [];
    const selectedProvinces = selectedSample!.filterCriteria.provinces || [];
    const communities: string[] = [];
    
    selectedProvinces.forEach((province : string) => {
      if (cyprusData.communities[province as keyof typeof cyprusData.communities]) {
        communities.push(...cyprusData.communities[province as keyof typeof cyprusData.communities]);
      }
    });
    
    return [...new Set(communities)]; // Remove duplicates
  };


  const handleViewSample = (sample: Sample) => {
    sample.filterCriteria = JSON.parse(sample.serializedFilterCriteria);
    setSelectedSample(sample);
    setShowDetailsModal(true);
  };

  const handleDeleteSample = async (sample: Sample) => {
    const confirmDelete = window.confirm(
      `Είστε σίγουροι ότι θέλετε να διαγράψετε το δείγμα "${sample.name}";`
    );
    if (!confirmDelete) return;

    try {
      await SamplesService.deleteSample(sample.id);
      SamplesService.getSamples().then(samplesResponse=> {
        setSamples(samplesResponse);
      });
    } catch (error) {
      console.error('Error deleting sample:', error);
      alert('Σφάλμα κατά τη διαγραφή δείγματος');
    }
  };

  const handleSaveSample = async (e: React.FormEvent) => {
    if (!selectedSample) return;
    e.preventDefault();
    
    const requestData = {
      QuestionnaireId: selectedSample.questionnaireId,
      Name: selectedSample.name,
      Description: selectedSample.description,
      TargetSize: selectedSample.targetSize,
      SerializedFilterCriteria : JSON.stringify(selectedSample.filterCriteria),
    } as Partial<Sample>;

    if (selectedSample.id) await SamplesService.updateSample(selectedSample.id, requestData);
    else  await SamplesService.createSample(requestData);
    setShowEditModal(false);
    setSelectedSample(null);
    SamplesService.getSamples().then(samplesResponse=> {
      setSamples(samplesResponse);
    });
  };

  const handleGenerateSampleParticipants = async (sample: Sample) => {
    if (sample.participantsCount) {
      const confirmGenerate = window.confirm(
        `Το δείγμα έχει ήδη ${sample.participantsCount} συμμετέχοντες. Είστε σίγουροι πως θέλετε να ξαναγίνει η κατανομή των συμμετεχόντων;`
      );

      if (!confirmGenerate) return;
    }
    await SamplesService.createSampleParticipants(sample.id);
    SamplesService.getSamples().then(samplesResponse=> {
      setSamples(samplesResponse);
    });
    alert('Η δημιουργία συμμετεχόντων ολοκληρώθηκε επιτυχώς.');
  };

  const handleArrayFieldChange = (
    field: keyof SampleFilter,
    value: string,
    checked: boolean
  ) => {
    if (!selectedSample) return;
    const currentArray = selectedSample!.filterCriteria[field] as string[] || [];
    
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);

    setSelectedSample({
      ...selectedSample!,
      filterCriteria: {
        ...selectedSample!.filterCriteria,
        [field]: newArray
      }
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Διαχείριση Δειγμάτων</h1>
        <p className="text-gray-600">Δημιουργία και διαχείριση δειγμάτων για ερωτηματολόγια</p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => {
            setSelectedSample({
              filterCriteria: { },
            } as Sample);
            setShowEditModal(true);
            
          }}
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
                  Πλήθος συμμετεχόντων
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
                  <td className="px-6 py-4 whitespace-nowrap" style={{cursor:'pointer'}} onClick={()=>{
                    sample.filterCriteria = JSON.parse(sample.serializedFilterCriteria);
                    setSelectedSample(sample); 
                    setShowEditModal(true);
                  }}>
                    <div className="text-sm font-medium text-gray-900">{sample.name}</div>
                    <div className="text-sm text-gray-500">{sample.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.questionnaire.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.targetSize}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.participantsCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sample.createdAt).toLocaleDateString('el-GR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleViewSample(sample)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Προβολή"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Generate Sample Button */}
                      <button
                        onClick={() => handleGenerateSampleParticipants(sample)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Δημιουργία συμμετοχών"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>

                      {/* Sample Assignment Panel Button */}
                      <button
                        onClick={() => {
                          sample.filterCriteria = JSON.parse(sample.serializedFilterCriteria);
                          setSelectedSample(sample);
                          setShowAssignmentPanel(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="Τμηματοποίηση & Ανάθεση"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteSample(sample)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Διαγραφή"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sample Modal */}
      {(showEditModal && selectedSample) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Δημιουργία Νέου Δείγματος</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Κλείσιμο</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveSample} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Βασικές Πληροφορίες</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ερωτηματολόγιο</label>
                      <select
                        disabled={selectedSample!.id != undefined}
                        value={selectedSample!.questionnaireId}
                        onChange={(e) => setSelectedSample({...selectedSample!, questionnaireId: e.target.value})}
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
                        value={selectedSample!.name}
                        onChange={(e) => setSelectedSample({...selectedSample!, name: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Περιγραφή</label>
                      <textarea
                        value={selectedSample!.description}
                        onChange={(e) => setSelectedSample({...selectedSample!, description: e.target.value})}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Μέγεθος Δείγματος (πλήθος απαντήσεων)</label>
                      <input
                        type="number"
                        value={selectedSample!.targetSize}
                        onChange={(e) => setSelectedSample({...selectedSample!, targetSize: parseInt(e.target.value)})}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Filter Criteria */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Κριτήρια Φιλτραρίσματος Εκμεταλλεύσεων</h4>
                    
                    {/* Provinces */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Επαρχίες</label>
                      <div className="grid grid-cols-2 gap-2">
                        {cyprusData.provinces.map((province) => (
                          <label key={province} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedSample!.filterCriteria.provinces?.includes(province) || false}
                              onChange={(e) => handleArrayFieldChange('provinces', province, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{province}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Communities - Show only for selected provinces */}
                    {(selectedSample!.filterCriteria.provinces?.length || 0) > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Κοινότητες/Δήμοι</label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {getAvailableCommunities().map((community) => (
                            <label key={community} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedSample!.filterCriteria.communities?.includes(community) || false}
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
                              checked={selectedSample!.filterCriteria.farmTypes?.includes(type) || false}
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
                              checked={selectedSample!.filterCriteria.sizeCategories?.includes(size) || false}
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
                              checked={selectedSample!.filterCriteria.economicSizes?.includes(size) || false}
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
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ακύρωση
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Αποθήκευση Δείγματος
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sample Details Modal */}
      {showDetailsModal && selectedSample && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Λεπτομέρειες Δείγματος: {selectedSample.name}
                </h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedSample(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Βασικές Πληροφορίες</h4>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Όνομα</label>
                        <p className="text-gray-900">{selectedSample.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Μέγεθος Δείγματος</label>
                        <p className="text-gray-900">{selectedSample.targetSize}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Συνολικές Φάρμες</label>
                        <p className="text-gray-900">{selectedSample.participantsCount}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-500">Περιγραφή</label>
                        <p className="text-gray-900">{selectedSample.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Ημερομηνία Δημιουργίας</label>
                        <p className="text-gray-900">
                          {new Date(selectedSample.createdAt).toLocaleDateString('el-GR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {selectedSample.questionnaire && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Ερωτηματολόγιο</label>
                          <p className="text-gray-900">{selectedSample.questionnaire.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assignment Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Πληροφορίες Ανάθεσης</h4>
                  
                  {/* {selectedSample.assigned_users && selectedSample.assigned_users.length > 0 ? (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Ανατεθειμένο σε</label>
                          <div className="space-y-2 mt-2">
                            {getAssignedUsersDetails(selectedSample.assigned_users).map((user) => (
                              <div key={user.id} className="bg-white p-3 rounded border border-orange-200">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                      user.role === 'surveyor' ? 'bg-blue-100 text-blue-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {user.role === 'admin' ? 'Διαχειριστής' :
                                       user.role === 'surveyor' ? 'Ερευνητής' :
                                       'Ερωτώμενος'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {selectedSample.due_date && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Ημερομηνία Λήξης</label>
                            <p className="text-gray-900">
                              {new Date(selectedSample.due_date).toLocaleDateString('el-GR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                        {selectedSample.assigned_at && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Ημερομηνία Ανάθεσης</label>
                            <p className="text-gray-900">
                              {new Date(selectedSample.assigned_at).toLocaleDateString('el-GR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">Δεν έχει ανατεθεί σε κανέναν χρήστη</p>
                    </div>
                  )} */}
                </div>

                {/* Filter Criteria */}
                {selectedSample.serializedFilterCriteria && (() => {
                  try {
                    const criteria = selectedSample.filterCriteria;
                    return (
                      <div className="col-span-full">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Κριτήρια Φιλτραρίσματος</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {criteria.provinces && criteria.provinces.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500">Επαρχίες</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {criteria.provinces.map((province: string) => (
                                    <span key={province} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                      {province}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {criteria.farmTypes && criteria.farmTypes.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500">Τύποι Εκμετάλλευσης</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {criteria.farmTypes.map((type: string) => (
                                    <span key={type} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {criteria.sizeCategories && criteria.sizeCategories.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500">Κατηγορίες Μεγέθους (Έκτασης)</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {criteria.sizeCategories.map((size: string) => (
                                    <span key={size} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                      {size}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {criteria.economicSizes && criteria.economicSizes.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500">Κατηγορίες Οικονομικού Μεγέθους</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {criteria.economicSizes.map((size: string) => (
                                    <span key={size} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                      {size}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return (
                      <div className="col-span-full">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Κριτήρια Φιλτραρίσματος</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-500">Δεν είναι δυνατή η εμφάνιση των κριτηρίων φιλτραρίσματος</p>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Assignment Panel */}
      {showAssignmentPanel && selectedSample && (
        <SampleAssignmentPanel
          sample={selectedSample}
          onClose={() => {
            setShowAssignmentPanel(false);
            setSelectedSample(null);
          }}
          language="el"
        />
      )}
    </div>
  );
}

export default SampleManagementPage;