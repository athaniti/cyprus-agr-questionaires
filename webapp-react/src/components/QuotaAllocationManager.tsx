import React, { useState, useEffect } from 'react';

interface ParticipantAllocation {
  participantId: string;
  participantName: string;
  participantEmail: string;
  quotaId: string;
  quotaName: string;
  allocationDate: string;
  status: string; // 'allocated', 'in_progress', 'completed', 'dropped_out'
  startDate?: string;
  completionDate?: string;
  responseId?: string;
}

interface QuotaSummary {
  id: string;
  name: string;
  targetCount: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  allocationProgress: {
    allocatedCount: number;
    availableCount: number;
    waitingCount: number;
  };
}

interface ParticipantEligibility {
  participantId: string;
  participantName: string;
  participantEmail: string;
  eligibleQuotas: {
    quotaId: string;
    quotaName: string;
    matchScore: number;
    criteriaMatches: string[];
  }[];
  currentAllocation?: {
    quotaId: string;
    quotaName: string;
    status: string;
  };
}

interface QuotaAllocationManagerProps {
  questionnaireId?: string;
}

const QuotaAllocationManager: React.FC<QuotaAllocationManagerProps> = ({ questionnaireId }) => {
  const [allocations, setAllocations] = useState<ParticipantAllocation[]>([]);
  const [quotaSummaries, setQuotaSummaries] = useState<QuotaSummary[]>([]);
  const [eligibleParticipants, setEligibleParticipants] = useState<ParticipantEligibility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedQuotaId, setSelectedQuotaId] = useState<string>('');
  const [showAllocationForm, setShowAllocationForm] = useState(false);

  const API_BASE_URL = 'http://localhost:5050/api';

  useEffect(() => {
    loadData();
  }, [questionnaireId]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAllocations(),
        loadQuotaSummaries(),
        loadEligibleParticipants()
      ]);
    } catch (error) {
      setError('Σφάλμα φόρτωσης δεδομένων');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllocations = async () => {
    try {
      const url = questionnaireId 
        ? `${API_BASE_URL}/Quotas/allocations?questionnaireId=${questionnaireId}`
        : `${API_BASE_URL}/Quotas/allocations`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAllocations(data);
      } else {
        console.error('Failed to load allocations');
      }
    } catch (error) {
      console.error('Error loading allocations:', error);
    }
  };

  const loadQuotaSummaries = async () => {
    try {
      const url = questionnaireId 
        ? `${API_BASE_URL}/Quotas/summary?questionnaireId=${questionnaireId}`
        : `${API_BASE_URL}/Quotas/summary`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setQuotaSummaries(data);
      } else {
        console.error('Failed to load quota summaries');
      }
    } catch (error) {
      console.error('Error loading quota summaries:', error);
    }
  };

  const loadEligibleParticipants = async () => {
    try {
      const url = questionnaireId 
        ? `${API_BASE_URL}/Quotas/eligible-participants?questionnaireId=${questionnaireId}`
        : `${API_BASE_URL}/Quotas/eligible-participants`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEligibleParticipants(data);
      } else {
        console.error('Failed to load eligible participants');
      }
    } catch (error) {
      console.error('Error loading eligible participants:', error);
    }
  };

  const handleManualAllocation = async (participantId: string, quotaId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Quotas/allocate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          quotaId,
          allocationMethod: 'manual',
          allocatedBy: 'current-user' // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        await loadData();
        setShowAllocationForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Αποτυχία κατανομής συμμετέχοντα');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error allocating participant:', error);
    }
  };

  const handleAutomaticAllocation = async (quotaId?: string) => {
    try {
      const url = quotaId 
        ? `${API_BASE_URL}/Quotas/auto-allocate/${quotaId}`
        : `${API_BASE_URL}/Quotas/auto-allocate`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionnaireId,
          allocatedBy: 'current-user' // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        const result = await response.json();
        await loadData();
        alert(`Αυτόματη κατανομή ολοκληρώθηκε: ${result.allocatedCount} νέες κατανομές`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Αποτυχία αυτόματης κατανομής');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error in automatic allocation:', error);
    }
  };

  const handleRemoveAllocation = async (participantId: string, quotaId: string) => {
    if (!confirm('Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτή την κατανομή;')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Quotas/deallocate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          quotaId,
          reason: 'Manual removal by admin'
        }),
      });

      if (response.ok) {
        await loadData();
      } else {
        setError('Αποτυχία αφαίρεσης κατανομής');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error removing allocation:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'allocated': return 'bg-yellow-100 text-yellow-800';
      case 'dropped_out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Ολοκληρώθηκε';
      case 'in_progress': return 'Σε εξέλιξη';
      case 'allocated': return 'Κατανεμημένος';
      case 'dropped_out': return 'Εγκατέλειψε';
      default: return status;
    }
  };

  const filteredAllocations = selectedQuotaId 
    ? allocations.filter(a => a.quotaId === selectedQuotaId)
    : allocations;

  const filteredEligibleParticipants = selectedQuotaId
    ? eligibleParticipants.filter(p => 
        p.eligibleQuotas.some(q => q.quotaId === selectedQuotaId) && 
        !p.currentAllocation
      )
    : eligibleParticipants.filter(p => !p.currentAllocation);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Διαχείριση Κατανομής Συμμετεχόντων
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Κατανομή συμμετεχόντων σε quotas και παρακολούθηση προόδου
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedQuotaId}
            onChange={(e) => setSelectedQuotaId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Όλα τα Quotas</option>
            {quotaSummaries.map(quota => (
              <option key={quota.id} value={quota.id}>
                {quota.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleAutomaticAllocation(selectedQuotaId || undefined)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Αυτόματη Κατανομή
          </button>
          <button
            onClick={() => setShowAllocationForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Χειροκίνητη Κατανομή
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Quota Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {quotaSummaries.map((quota) => (
          <div key={quota.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900 mb-2">{quota.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Στόχος:</span>
                <span className="font-medium">{quota.targetCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ολοκληρωμένα:</span>
                <span className="font-medium text-green-600">{quota.completedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Σε εξέλιξη:</span>
                <span className="font-medium text-blue-600">{quota.inProgressCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Κατανεμημένοι:</span>
                <span className="font-medium">{quota.allocationProgress.allocatedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Διαθέσιμοι:</span>
                <span className="font-medium text-orange-600">{quota.allocationProgress.availableCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Allocations */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Τρέχουσες Κατανομές
              {selectedQuotaId && (
                <span className="ml-2 text-sm text-gray-600">
                  ({filteredAllocations.length} κατανομές)
                </span>
              )}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Συμμετέχων
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quota
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
                {filteredAllocations.map((allocation) => (
                  <tr key={`${allocation.participantId}-${allocation.quotaId}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {allocation.participantName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {allocation.participantEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {allocation.quotaName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(allocation.status)}`}>
                        {getStatusLabel(allocation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(allocation.allocationDate).toLocaleDateString('el-GR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {allocation.status === 'allocated' && (
                        <button
                          onClick={() => handleRemoveAllocation(allocation.participantId, allocation.quotaId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Αφαίρεση
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAllocations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Δεν υπάρχουν κατανομές
              </div>
            )}
          </div>
        </div>

        {/* Eligible Participants */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Επιλέξιμοι Συμμετέχοντες
              {selectedQuotaId && (
                <span className="ml-2 text-sm text-gray-600">
                  ({filteredEligibleParticipants.length} διαθέσιμοι)
                </span>
              )}
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredEligibleParticipants.map((participant) => (
                <div key={participant.participantId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{participant.participantName}</h4>
                      <p className="text-sm text-gray-600">{participant.participantEmail}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Επιλέξιμα Quotas:</h5>
                    <div className="space-y-2">
                      {participant.eligibleQuotas
                        .filter(quota => !selectedQuotaId || quota.quotaId === selectedQuotaId)
                        .map((quota) => (
                        <div key={quota.quotaId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <div>
                            <span className="text-sm font-medium">{quota.quotaName}</span>
                            <span className="ml-2 text-xs text-gray-600">
                              (Score: {quota.matchScore.toFixed(1)})
                            </span>
                          </div>
                          <button
                            onClick={() => handleManualAllocation(participant.participantId, quota.quotaId)}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Κατανομή
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredEligibleParticipants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Δεν υπάρχουν διαθέσιμοι συμμετέχοντες
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Allocation Modal */}
      {showAllocationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Χειροκίνητη Κατανομή</h2>
              <button
                onClick={() => setShowAllocationForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Επιλέξτε έναν συμμετέχοντα και ένα quota για χειροκίνητη κατανομή.
              </p>
              
              {/* This would contain form elements for manual allocation */}
              <div className="text-center py-8 text-gray-500">
                Η φόρμα χειροκίνητης κατανομής θα υλοποιηθεί εδώ...
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowAllocationForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Ακύρωση
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotaAllocationManager;