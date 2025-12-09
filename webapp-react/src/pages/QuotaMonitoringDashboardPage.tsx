import { Questionnaire, QuestionnaireService } from '@/services/questionnaireService';
import React, { useState, useEffect } from 'react';
import { Quota, quotaVariables } from './QuotaManagementPage';




const QuotaMonitoringDashboardPage: React.FC = ({}) => {
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const [quotas, setQuotas] = useState<Quota[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [selectedQuota, setSelectedQuota] = useState<Quota|null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());


  const API_BASE_URL = 'http://localhost:5050/api';

  useEffect(() => {
    loadQuotas();
    fetchQuestionnaires();
    if (autoRefresh) {
      const interval = setInterval(loadQuotas, 30 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);


  const fetchQuestionnaires = async () => {
        var questionnaires = await QuestionnaireService.getQuestionnaires();
        setQuestionnaires(questionnaires.data);
    };
  
    const loadQuotas = async () => {
      setLoading(true);
      try {
        const url = `${API_BASE_URL}/Quotas`;
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setQuotas(data.map((q:Quota) => {
            q.criteria = JSON.parse(q.serializedCriteria!);
            return q;
          }));
        } else {
          setError('Αποτυχία φόρτωσης quotas');
        }
      } catch (error) {
        setError('Σφάλμα δικτύου');
        console.error('Error loading quotas:', error);
      } finally {
        setLastUpdate(new Date());
        setLoading(false);
      }
    };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'not_started': return '⏸️';
      default: return '🟢';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'not_started': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Ολοκληρώθηκε';
      case 'in_progress': return 'Σε εξέλιξη';
      case 'not_started': return 'Δεν ξεκίνησε';
      default: return status;
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


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Παρακολούθηση Ορίων
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
            <span className="text-sm">Αυτόματη ανανέωση (30s)</span>
          </label>
          <button
            onClick={fetchQuestionnaires}
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
              <p className="text-2xl font-bold text-gray-900">{quotas.length}</p>
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
                {quotas.filter(q => q.targetCount <= (q.totalCompleted??0)).length}
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
                {quotas.filter(q => (q.totalResponses??0) > (q.totalCompleted??0)).length}
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
                {quotas.filter(q => q.targetCount <= (q.totalCompleted??0)+5 && q.targetCount > (q.totalCompleted??0)).length}
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
              {quotas.map((quota) => (
                <div
                  key={quota.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    (selectedQuota && selectedQuota.id === quota.id )
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedQuota(quota)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getStatusIcon(!quota.totalCompleted ? "not_started": (quota.totalCompleted>=quota.targetCount) ?'completed':'in_progress')}</span>
                      <h4 className="font-medium text-gray-900">{quota.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(!quota.totalCompleted ? "not_started": (quota.totalCompleted>=quota.targetCount) ?'completed':'in_progress')}`}></div>
                      <span className="text-sm text-gray-600">{getStatusLabel(!quota.totalCompleted ? "not_started": (quota.totalCompleted>=quota.targetCount) ?'completed':'in_progress')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Πρόοδος:</span>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${getStatusColor(!quota.totalCompleted ? "not_started": (quota.totalCompleted>=quota.targetCount) ?'completed':'in_progress')}`}
                            style={{ width: `${(100*(quota.totalCompleted ?? 0)/quota.targetCount).toFixed(0)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 min-w-0">
                          {(100*(quota.totalCompleted ?? 0)/quota.targetCount).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Ολοκληρωμένα:</span>
                      <div className="font-medium">
                        {quota.totalCompleted??0} / {quota.targetCount}
                      </div>
                    </div>
                  </div>

                  
                </div>
              ))}
            </div>

            {quotas.length === 0 && !loading && (
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
                        <span className="mr-2">{getStatusIcon(!selectedQuota.totalCompleted ? "not_started": (selectedQuota.totalCompleted>=selectedQuota.targetCount) ?'completed':'in_progress')}</span>
                        {getStatusLabel(!selectedQuota.totalCompleted ? "not_started": (selectedQuota.totalCompleted>=selectedQuota.targetCount) ?'completed':'in_progress')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Στόχος:</span>
                      <div className="font-medium">{selectedQuota.targetCount} ερωτηματολόγια</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Εναπομένοντα:</span>
                      <div className="font-medium text-orange-600">{selectedQuota.targetCount - (selectedQuota.totalCompleted??0)}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Λεπτομέρειες Προόδου</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ολοκληρωμένα</span>
                      <span className="font-medium text-green-600">{selectedQuota.totalCompleted??0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Εκκρεμή</span>
                      <span className="font-medium text-yellow-600">{(selectedQuota.totalCompleted??0)-(selectedQuota.totalResponses??0)}</span>
                    </div>
                  </div>
                </div>

                

                {/* Criteria Display */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Κριτήρια Quota</h4>
                  <div className="text-sm space-y-1">
                    {selectedQuota.criteria.map((criterion, index) => (
                      <div key={index} className="mb-1">
                        <span className="font-medium">{quotaVariables.find(qv=>qv.id === criterion.quotaVariableId)?.name }</span>
                        <span className="text-gray-500"> {criterion.quotaVariableValue} </span>
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

export default QuotaMonitoringDashboardPage;