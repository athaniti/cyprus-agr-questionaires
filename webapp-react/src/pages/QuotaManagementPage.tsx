import { Questionnaire, QuestionnaireService } from '@/services/questionnaireService';
import React, { useState, useEffect } from 'react';

export interface QuotaVariable {
  id: string;
  name: string;
  values: string[];
}


export interface QuotaCriterion {
  quotaVariableId: string;
  quotaVariableValue: string;
}

export interface Quota {
  id: string;
  name: string;
  description?: string;
  questionnaireId: string;
  questionnaireName: string;
  serializedCriteria?:string;
  criteria: QuotaCriterion[];
  targetCount: number;
  totalCompleted?:number;
  totalResponses?:number;
}


export const quotaVariables : QuotaVariable[]= [
      {id:'farmType', name:"Είδος παραγωγής", values:[
      'Φυτική Παραγωγή',
      'Ζωική Παραγωγή', 
      'Μικτή Εκμετάλλευση',
      'Κηπευτικά',
      'Οπωροφόρα',
      'Αμπελώνες',
      'Ελαιώνες'
    ]}, {id:'sizeCategory', name:"Μέγεθος (έκταση)", values:[
      'Πολύ Μικρή (0-5 στρέμματα)',
      'Μικρή (5-20 στρέμματα)',
      'Μεσαία (20-100 στρέμματα)',
      'Μεγάλη (100-500 στρέμματα)',
      'Πολύ Μεγάλη (>500 στρέμματα)'
    ]}, {id:'economicSize', name:"Οικονομικό μέγεθος", values:[
      'Πολύ Μικρό (0-8.000€)',
      'Μικρό (8.000-25.000€)',
      'Μεσαίο (25.000-100.000€)',
      'Μεγάλο (100.000-500.000€)',
      'Πολύ Μεγάλο (>500.000€)'
    ]}, {id:'legalStatus', name:"Νομική υπόσταση", values:[
      'Φυσικό Πρόσωπο',
      'Εταιρεία',
      'Συνεταιρισμός',
      'Οικογενειακή Επιχείρηση'
    ]}, {id:'system', name:"Παραγωγικό σύστημα", values:[
      'Συμβατική καλλιέργεια',
      'Βιολογική παραγωγή',
      'Ολοκληρωμένη διαχείριση',
      'Προστατευμένη καλλιέργεια (θερμοκήπια)'
    ]}
  ];
const QuotaManagementPage: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedQuota, setSelectedQuota] = useState<Quota|null>(null);




  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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


  const API_BASE_URL = 'http://localhost:5050/api';

  useEffect(() => {
    loadQuotas();
    fetchQuestionnaires();
  }, []);

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
      setLoading(false);
    }
  };

  const handleCreateQuota = async () => {
    try {
      selectedQuota!.serializedCriteria = JSON.stringify(selectedQuota!.criteria!);
      const response = await fetch(`${API_BASE_URL}/Quotas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedQuota),
      });

      if (response.ok) {
        await loadQuotas();
        setSelectedQuota(null);
      } else {
        setError('Αποτυχία δημιουργίας quota');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error creating quota:', error);
    }
  };

  const handleUpdateQuota = async () => {
    try {
      selectedQuota!.serializedCriteria = JSON.stringify(selectedQuota!.criteria!);
      const response = await fetch(`${API_BASE_URL}/Quotas/${selectedQuota!.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedQuota),
      });

      if (response.ok) {
        setSelectedQuota(null)
        await loadQuotas();
      } else {
        setError('Αποτυχία ενημέρωσης quota');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error updating quota:', error);
    }
  };

  const handleDeleteQuota = async (quotaId: string) => {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το quota;')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Quotas/${quotaId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadQuotas();
      } else {
        setError('Αποτυχία διαγραφής quota');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error deleting quota:', error);
    }
  };

  

  const addCriterion = () => {
    setSelectedQuota({
      ...selectedQuota!,
      criteria:[...selectedQuota!.criteria, {quotaVariableId:quotaVariables[0].id, quotaVariableValue:quotaVariables[0].values[0]} as QuotaCriterion]
    });
  };

  const updateCriterion = (index: number, updatedCriterion: QuotaCriterion) => {
    setSelectedQuota({
      ...selectedQuota!,
      criteria:selectedQuota!.criteria.map((c,i)=> {
        if (i!== index) return c;
        return updatedCriterion
      })
    });
    
  };

  const removeCriterion = (index: number) => {
    setSelectedQuota({
      ...selectedQuota!,
      criteria:selectedQuota!.criteria.filter((c,i)=> i !== index)
    });
  };

  const renderCriteriaForm = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Κριτήρια Quota</h4>
        <button
          onClick={addCriterion}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Προσθήκη Κριτηρίου
        </button>
      </div>

      {selectedQuota!.criteria.map((criterion, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="font-medium">Κριτήριο {index + 1}</h5>
            <button
              onClick={() => removeCriterion(index)}
              className="text-red-600 hover:text-red-800"
            >
              Αφαίρεση
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Μεταβλητή
              </label>
              <select
                value={criterion.quotaVariableId}
                onChange={(e) => {
                  updateCriterion(index, {
                    ...criterion, quotaVariableId:e.target.value, quotaVariableValue:quotaVariables.find(qv=>qv.id === e.target.value)!.values[0]
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {quotaVariables.map(variable => (
                  <option key={variable.id} value={variable.id}>
                    {variable.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Τιμή
              </label>
              <select
                value={criterion.quotaVariableValue}
                onChange={(e) => updateCriterion(index, {
                  ...criterion, quotaVariableValue:e.target.value
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {(quotaVariables.find(qv=>qv.id === criterion.quotaVariableId) ?? {values:[]}).values.map(quotaVariableValue => (
                  <option key={quotaVariableValue} value={quotaVariableValue}>
                    {quotaVariableValue}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
            Διαχείριση Ορίων Συμμετεχόντων (Quotas)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Ορισμός και παρακολούθηση στόχων για συγκεκριμένους συνδυασμούς μεταβλητών
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedQuota({criteria:[]} as unknown as Quota)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Νέο Quota
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {selectedQuota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Επεξεργασία Quota</h2>
              <button
                onClick={() => {
                  setSelectedQuota(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ερωτηματολόγιο
                  </label>
                  <select
                      value={selectedQuota.questionnaireId}
                      onChange={(e) => {
                        setSelectedQuota({...selectedQuota, questionnaireId:e.target.value})
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {questionnaires.map(questionnaire => (
                        <option key={questionnaire.id} value={questionnaire.id}>
                          {questionnaire.name}
                        </option>
                      ))}
                    </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Όνομα Quota *
                  </label>
                  <input
                    type="text"
                    value={selectedQuota.name}
                    onChange={(e) => setSelectedQuota({ ...selectedQuota, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="π.χ. Μικρές Εκμεταλλεύσεις Λευκωσίας"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Στόχος (Αριθμός Ερωτηματολογίων) *
                  </label>
                  <input
                    type="number"
                    value={selectedQuota.targetCount}
                    onChange={(e) => setSelectedQuota({ ...selectedQuota, targetCount: parseInt(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Περιγραφή
                </label>
                <textarea
                  value={selectedQuota.description}
                  onChange={(e) => setSelectedQuota({ ...selectedQuota, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Περιγραφή του quota και των κριτηρίων του"
                />
              </div>

              {renderCriteriaForm()}


              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedQuota(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={()=>{ 
                    if (selectedQuota.id) handleUpdateQuota();
                    else handleCreateQuota()}}
                  disabled={!selectedQuota.questionnaireId || !selectedQuota.name || selectedQuota.targetCount <= 0 || !selectedQuota.criteria.length}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Αποθήκευση
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotas Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Κριτηρια
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Στοχος
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ολοκληρωμενα
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Εκκρεμη
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Προοδος
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Κατασταση
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ενςργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotas.map((quota) => (
                <tr key={quota.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900" onClick={()=>{
                        setSelectedQuota(quota);
                      }}>
                        {quota.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quota.questionnaireName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quota.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {quota.criteria.map((criterion, index) => (
                        <div key={index} className="mb-1">
                          <span className="font-medium">{quotaVariables.find(qv=>qv.id === criterion.quotaVariableId)?.name }</span>
                          <span className="text-gray-500"> {criterion.quotaVariableValue} </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quota.targetCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quota.totalCompleted ?? 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quota.targetCount - (quota.totalCompleted ?? 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(100*(quota.totalCompleted ?? 0)/quota.targetCount).toFixed(0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {(100*(quota.totalCompleted ?? 0)/quota.targetCount).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(!quota.totalCompleted ? "not_started": (quota.totalCompleted>=quota.targetCount) ?'completed':'in_progress')}`}>
                      {getStatusLabel(!quota.totalCompleted ? "not_started": (quota.totalCompleted>=quota.targetCount) ?'completed':'in_progress') }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteQuota(quota.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Διαγραφή
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {quotas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Δεν υπάρχουν quotas. Δημιουργήστε το πρώτο σας quota για να ξεκινήσετε.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotaManagementPage;