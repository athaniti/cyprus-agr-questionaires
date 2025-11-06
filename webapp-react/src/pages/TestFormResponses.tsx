import ResponsesViewer from '../components/ResponsesViewer';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useState } from 'react';

export default function TestFormResponses() {
  const [activeTab, setActiveTab] = useState<'responses' | 'analytics'>('responses');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState({
    id: 'aaaaaaaa-1111-1111-1111-111111111111',
    name: 'Έρευνα Ελαιοπαραγωγής Κύπρου 2025'
  });

  const questionnaires = [
    {
      id: 'aaaaaaaa-1111-1111-1111-111111111111',
      name: 'Έρευνα Ελαιοπαραγωγής Κύπρου 2025'
    },
    {
      id: 'bbbbbbbb-2222-2222-2222-222222222222', 
      name: 'Έρευνα Κτηνοτροφικών Μονάδων'
    },
    {
      id: 'cccccccc-3333-3333-3333-333333333333',
      name: 'Έρευνα Αρδευτικών Συστημάτων'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Προβολή Απαντήσεων
          </h1>
          <p className="text-gray-600">
            
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('responses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'responses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Προβολή Απαντήσεων
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Αναλυτικά Στοιχεία
              </button>
            </nav>
          </div>
          
          {/* Questionnaire Selector */}
          <div className="p-4 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Επιλογή Ερωτηματολογίου:
            </label>
            <select
              value={selectedQuestionnaire.id}
              onChange={(e) => {
                const selected = questionnaires.find(q => q.id === e.target.value);
                if (selected) setSelectedQuestionnaire(selected);
              }}
              className="w-full md:w-1/2 border border-gray-300 rounded-md px-3 py-2"
            >
              {questionnaires.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'responses' && (
            <ResponsesViewer
              questionnaireId={selectedQuestionnaire.id}
              questionnaireName={selectedQuestionnaire.name}
              language="el"
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              questionnaireId={selectedQuestionnaire.id}
              questionnaireName={selectedQuestionnaire.name}
              language="el"
            />
          )}
        </div>

        {/* Test Data Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Πληροφορίες Δοκιμής
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Questionnaire ID:</strong> {selectedQuestionnaire.id}</p>
            <p><strong>Questionnaire Name:</strong> {selectedQuestionnaire.name}</p>
            <p><strong>FormIO Schema:</strong> Δημιουργήθηκε με 6 πεδία (farmName, oliveGroveArea, κ.ά.)</p>
            <p><strong>API Status:</strong> FormIO endpoints λειτουργικά, Analytics endpoints λειτουργικά</p>
            <p><strong>Test Data:</strong> Προς το παρόν κενά δεδομένα, μπορούν να προστεθούν responses μέσω API</p>
          </div>
        </div>
      </div>
    </div>
  );
}