import React, { useState, useEffect } from 'react';

interface QuotaVariable {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  variableType: string;
  dataType: string;
  possibleValues: QuotaVariableValue[];
  isActive: boolean;
  sortOrder: number;
}

interface QuotaVariableValue {
  value: string;
  label: string;
  description?: string;
  isActive: boolean;
}

interface QuotaCriterion {
  variableName: string;
  displayName: string;
  operator: string;
  values: string[];
  variableType: string;
}

interface QuotaCriteria {
  criteria: QuotaCriterion[];
  logic: string;
}

interface Quota {
  id: string;
  name: string;
  description?: string;
  questionnaireId: string;
  questionnaireName: string;
  criteria: QuotaCriteria;
  targetCount: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  remainingCount: number;
  completionPercentage: number;
  status: string;
  isActive: boolean;
  autoStop: boolean;
  priority: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

interface QuotaManagementProps {
  questionnaireId?: string;
}

const QuotaManagement: React.FC<QuotaManagementProps> = ({ questionnaireId }) => {
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [quotaVariables, setQuotaVariables] = useState<QuotaVariable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [monitoringMode, setMonitoringMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    questionnaireId: questionnaireId || '',
    criteria: { criteria: [], logic: 'AND' } as QuotaCriteria,
    targetCount: 100,
    isActive: true,
    autoStop: true,
    priority: 0
  });

  const API_BASE_URL = 'http://localhost:5050/api';

  useEffect(() => {
    loadQuotas();
    loadQuotaVariables();
  }, [questionnaireId]);

  const loadQuotas = async () => {
    setLoading(true);
    try {
      const url = questionnaireId 
        ? `${API_BASE_URL}/Quotas?questionnaireId=${questionnaireId}`
        : `${API_BASE_URL}/Quotas`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setQuotas(data);
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

  const loadQuotaVariables = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Quotas/variables`);
      if (response.ok) {
        const data = await response.json();
        setQuotaVariables(data);
      } else {
        console.error('Failed to load quota variables');
      }
    } catch (error) {
      console.error('Error loading quota variables:', error);
    }
  };

  const handleCreateQuota = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Quotas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdBy: 'current-user' // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        await loadQuotas();
        setShowCreateForm(false);
        resetForm();
      } else {
        setError('Αποτυχία δημιουργίας quota');
      }
    } catch (error) {
      setError('Σφάλμα δικτύου');
      console.error('Error creating quota:', error);
    }
  };

  const handleUpdateQuota = async (quotaId: string, updates: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Quotas/${quotaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updates,
          updatedBy: 'current-user' // TODO: Get from auth context
        }),
      });

      if (response.ok) {
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      questionnaireId: questionnaireId || '',
      criteria: { criteria: [], logic: 'AND' },
      targetCount: 100,
      isActive: true,
      autoStop: true,
      priority: 0
    });
  };

  const addCriterion = () => {
    const newCriterion: QuotaCriterion = {
      variableName: '',
      displayName: '',
      operator: 'equals',
      values: [],
      variableType: ''
    };

    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        criteria: [...prev.criteria.criteria, newCriterion]
      }
    }));
  };

  const updateCriterion = (index: number, updates: Partial<QuotaCriterion>) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        criteria: prev.criteria.criteria.map((criterion, i) => 
          i === index ? { ...criterion, ...updates } : criterion
        )
      }
    }));
  };

  const removeCriterion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        criteria: prev.criteria.criteria.filter((_, i) => i !== index)
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Near Completion': return 'text-yellow-600 bg-yellow-100';
      case 'Active': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

      {formData.criteria.criteria.map((criterion, index) => (
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
                value={criterion.variableName}
                onChange={(e) => {
                  const variable = quotaVariables.find(v => v.name === e.target.value);
                  updateCriterion(index, {
                    variableName: e.target.value,
                    displayName: variable?.displayName || '',
                    variableType: variable?.variableType || ''
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Επιλέξτε μεταβλητή</option>
                {quotaVariables.map(variable => (
                  <option key={variable.id} value={variable.name}>
                    {variable.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Τελεστής
              </label>
              <select
                value={criterion.operator}
                onChange={(e) => updateCriterion(index, { operator: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="equals">Ίσο με</option>
                <option value="in">Περιέχεται σε</option>
                <option value="between">Μεταξύ</option>
                <option value="contains">Περιέχει</option>
              </select>
            </div>
          </div>

          {criterion.variableName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Τιμές
              </label>
              <div className="space-y-2">
                {quotaVariables
                  .find(v => v.name === criterion.variableName)
                  ?.possibleValues.map(value => (
                    <label key={value.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={criterion.values.includes(value.value)}
                        onChange={(e) => {
                          const newValues = e.target.checked
                            ? [...criterion.values, value.value]
                            : criterion.values.filter(v => v !== value.value);
                          updateCriterion(index, { values: newValues });
                        }}
                        className="mr-2"
                      />
                      {value.label}
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {formData.criteria.criteria.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Λογική Σύνδεσης
          </label>
          <select
            value={formData.criteria.logic}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              criteria: { ...prev.criteria, logic: e.target.value }
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="AND">ΚΑΙ (AND) - Όλα τα κριτήρια</option>
            <option value="OR">Ή (OR) - Οποιοδήποτε κριτήριο</option>
          </select>
        </div>
      )}
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
            onClick={() => setMonitoringMode(!monitoringMode)}
            className={`px-4 py-2 rounded-md ${
              monitoringMode
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {monitoringMode ? 'Λειτουργία Παρακολούθησης' : 'Λειτουργία Διαχείρισης'}
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
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
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Δημιουργία Νέου Quota</h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
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
                    Όνομα Quota *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                    value={formData.targetCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 0 }))}
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
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Περιγραφή του quota και των κριτηρίων του"
                />
              </div>

              {renderCriteriaForm()}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Προτεραιότητα
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    Ενεργό
                  </label>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.autoStop}
                      onChange={(e) => setFormData(prev => ({ ...prev, autoStop: e.target.checked }))}
                      className="mr-2"
                    />
                    Αυτόματη Διακοπή
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={handleCreateQuota}
                  disabled={!formData.name || formData.targetCount <= 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Δημιουργία
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
                  Κριτήρια
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Στόχος
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ολοκληρωμένα
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Σε Εξέλιξη
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Εκκρεμή
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Πρόοδος
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Κατάσταση
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotas.map((quota) => (
                <tr key={quota.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {quota.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quota.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {quota.criteria.criteria.map((criterion, index) => (
                        <div key={index} className="mb-1">
                          <span className="font-medium">{criterion.displayName}</span>
                          <span className="text-gray-500"> {criterion.operator} </span>
                          <span>{criterion.values.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quota.targetCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quota.completedCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quota.inProgressCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quota.pendingCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(quota.completionPercentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {quota.completionPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quota.status)}`}>
                      {quota.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateQuota(quota.id, { isActive: !quota.isActive })}
                        className={`px-2 py-1 text-xs rounded ${
                          quota.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {quota.isActive ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
                      </button>
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

export default QuotaManagement;