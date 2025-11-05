import React, { useState, useEffect } from 'react';

interface QuotaMonitoring {
  id: string;
  name: string;
  description?: string;
  questionnaireName: string;
  criteria: any;
  targetCount: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  remainingCount: number;
  completionPercentage: number;
  status: string;
  isActive: boolean;
  lastCompletionTime?: string;
  todayCompletions: number;
  weekCompletions: number;
  averageCompletionTime?: number;
  estimatedCompletion?: string;
  completionRate: number;
  allocationProgress: {
    allocatedCount: number;
    availableCount: number;
    waitingCount: number;
  };
}

interface QuotaMonitoringDashboardProps {
  questionnaireId?: string;
  refreshInterval?: number; // in seconds, default 30
}

const QuotaMonitoringDashboard: React.FC<QuotaMonitoringDashboardProps> = ({ 
  questionnaireId, 
  refreshInterval = 30 
}) => {
  const [quotaData, setQuotaData] = useState<QuotaMonitoring[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedQuotaId, setSelectedQuotaId] = useState<string>('');

  const API_BASE_URL = 'http://localhost:5050/api';

  useEffect(() => {
    loadMonitoringData();
    
    if (autoRefresh) {
      const interval = setInterval(loadMonitoringData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [questionnaireId, autoRefresh, refreshInterval]);

  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      const url = questionnaireId 
        ? `${API_BASE_URL}/Quotas/monitoring?questionnaireId=${questionnaireId}`
        : `${API_BASE_URL}/Quotas/monitoring`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setQuotaData(data);
        setLastUpdate(new Date());
        setError('');
      } else {
        setError('Αποτυχία φόρτωσης δεδομένων παρακολούθησης');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error loading monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return '✅';
      case 'Near Completion': return '⚠️';
      case 'Active': return '🟢';
      case 'Paused': return '⏸️';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'Near Completion': return 'bg-yellow-500';
      case 'Active': return 'bg-blue-500';
      case 'Paused': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Δεν υπάρχει';
    return new Date(isoString).toLocaleString('el-GR');
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes || minutes <= 0) return 'Δεν υπάρχει';
    
    if (minutes < 60) {
      return `${Math.round(minutes)} λεπτά`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours}ω ${remainingMinutes}λ`;
    } else {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      return `${days}η ${hours}ω`;
    }
  };

  const selectedQuota = selectedQuotaId ? quotaData.find(q => q.id === selectedQuotaId) : null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Παρακολούθηση Quotas Πραγματικού Χρόνου
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Τελευταία ενημέρωση: {lastUpdate.toLocaleString('el-GR')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Αυτόματη ανανέωση ({refreshInterval}s)</span>
          </label>
          <button
            onClick={loadMonitoringData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Φόρτωση...' : 'Ανανέωση'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              📊
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Σύνολο Quotas</p>
              <p className="text-2xl font-bold text-gray-900">{quotaData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              ✅
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ολοκληρωμένα</p>
              <p className="text-2xl font-bold text-gray-900">
                {quotaData.filter(q => q.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              🟢
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ενεργά</p>
              <p className="text-2xl font-bold text-gray-900">
                {quotaData.filter(q => q.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              ⚠️
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Κοντά στο Τέλος</p>
              <p className="text-2xl font-bold text-gray-900">
                {quotaData.filter(q => q.status === 'Near Completion').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quotas List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Κατάσταση Quotas</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {quotaData.map((quota) => (
                <div
                  key={quota.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedQuotaId === quota.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedQuotaId(quota.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getStatusIcon(quota.status)}</span>
                      <h4 className="font-medium text-gray-900">{quota.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(quota.status)}`}></div>
                      <span className="text-sm text-gray-600">{quota.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Πρόοδος:</span>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${getStatusColor(quota.status)}`}
                            style={{ width: `${Math.min(quota.completionPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 min-w-0">
                          {quota.completionPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Ολοκληρωμένα:</span>
                      <div className="font-medium">
                        {quota.completedCount} / {quota.targetCount}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-gray-600">
                    <div>
                      <span>Σήμερα: </span>
                      <span className="font-medium text-green-600">{quota.todayCompletions}</span>
                    </div>
                    <div>
                      <span>Εβδομάδα: </span>
                      <span className="font-medium text-blue-600">{quota.weekCompletions}</span>
                    </div>
                    <div>
                      <span>Ρυθμός: </span>
                      <span className="font-medium">{quota.completionRate.toFixed(1)}/ημέρα</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {quotaData.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Δεν υπάρχουν quotas για παρακολούθηση
              </div>
            )}
          </div>
        </div>

        {/* Detailed View */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedQuota ? `Λεπτομέρειες: ${selectedQuota.name}` : 'Επιλέξτε ένα Quota'}
            </h3>
          </div>
          <div className="p-6">
            {selectedQuota ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Βασικά Στοιχεία</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ερωτηματολόγιο:</span>
                      <div className="font-medium">{selectedQuota.questionnaireName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Κατάσταση:</span>
                      <div className="flex items-center">
                        <span className="mr-2">{getStatusIcon(selectedQuota.status)}</span>
                        {selectedQuota.status}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Στόχος:</span>
                      <div className="font-medium">{selectedQuota.targetCount} ερωτηματολόγια</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Εναπομένοντα:</span>
                      <div className="font-medium text-orange-600">{selectedQuota.remainingCount}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Λεπτομέρειες Προόδου</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ολοκληρωμένα</span>
                      <span className="font-medium text-green-600">{selectedQuota.completedCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Σε εξέλιξη</span>
                      <span className="font-medium text-blue-600">{selectedQuota.inProgressCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Εκκρεμή</span>
                      <span className="font-medium text-yellow-600">{selectedQuota.pendingCount}</span>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Στατιστικά</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Σήμερα:</span>
                      <div className="font-medium text-green-600">{selectedQuota.todayCompletions} ολοκληρώσεις</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Αυτή την εβδομάδα:</span>
                      <div className="font-medium text-blue-600">{selectedQuota.weekCompletions} ολοκληρώσεις</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Μέσος χρόνος ολοκλήρωσης:</span>
                      <div className="font-medium">{formatDuration(selectedQuota.averageCompletionTime)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Ρυθμός ολοκλήρωσης:</span>
                      <div className="font-medium">{selectedQuota.completionRate.toFixed(1)} ανά ημέρα</div>
                    </div>
                  </div>
                </div>

                {/* Allocation Progress */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Κατανομή Συμμετεχόντων</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Κατανεμημένοι</span>
                      <span className="font-medium text-blue-600">{selectedQuota.allocationProgress.allocatedCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Διαθέσιμοι</span>
                      <span className="font-medium text-green-600">{selectedQuota.allocationProgress.availableCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Αναμένουν</span>
                      <span className="font-medium text-yellow-600">{selectedQuota.allocationProgress.waitingCount}</span>
                    </div>
                  </div>
                </div>

                {/* Estimated Completion */}
                {selectedQuota.estimatedCompletion && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Πρόβλεψη</h4>
                    <div className="text-sm">
                      <span className="text-gray-600">Εκτιμώμενη ολοκλήρωση:</span>
                      <div className="font-medium text-purple-600">
                        {formatTime(selectedQuota.estimatedCompletion)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Criteria Display */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Κριτήρια Quota</h4>
                  <div className="text-sm space-y-1">
                    {selectedQuota.criteria.criteria?.map((criterion: any, index: number) => (
                      <div key={index} className="flex items-center">
                        <span className="font-medium text-gray-700">{criterion.displayName}</span>
                        <span className="mx-2 text-gray-500">{criterion.operator}</span>
                        <span className="text-gray-600">{criterion.values?.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Επιλέξτε ένα quota από τη λίστα για να δείτε τις λεπτομέρειες
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotaMonitoringDashboard;