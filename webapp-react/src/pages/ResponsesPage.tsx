import ResponsesViewer from '../components/ResponsesViewer';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useEffect, useState } from 'react';
import { QuestionnaireService } from '@/services/questionnaireService';
import { Skeleton } from '@/components/ui/skeleton';

interface ResponsesPageProps {
  language?: 'el' | 'en';
}

export default function ResponsesPage({language='el' }:ResponsesPageProps) {
  const [activeTab, setActiveTab] = useState<'responses' | 'analytics'>('responses');
  const [questionnaires, setQuestionnaires] = useState<any[]|undefined>(undefined);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any|undefined>(undefined);

    useEffect(() => {
      const loadQuestionnaires = async () => {
        try {
          const response = await QuestionnaireService.getQuestionnaires();
        // Map the API response to match the App component structure
          const mappedQuestionnaires = response.data.map((q: any) => ({
            ...q,
            schema: q.serializedSchema ? JSON.parse(q.serializedSchema) : {display: "form", components: [] },
          }));
          
          setQuestionnaires(mappedQuestionnaires);
          if (mappedQuestionnaires.length > 0) {
            setSelectedQuestionnaire(mappedQuestionnaires[0]);
          }
        } catch (error) {
          
        }
      };
  
      loadQuestionnaires();
    }, []);

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
        {!questionnaires && <Skeleton/>}
        {(questionnaires && !questionnaires!.length) && <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            {language === 'el' ? 'Δεν υπάρχουν διαθέσιμα ερωτηματολόγια για προβολή απαντήσεων.' : 'No available questionnaires to view responses.'}
          </h3>
        </div>} 

        {(questionnaires && questionnaires!.length) && <><div className="bg-white rounded-lg shadow-sm mb-6">
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
                {language === 'el' ? 'Προβολή Απαντήσεων' : 'View responses'}
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {language === 'el' ? 'Συγκεντρωτικά στοιχεία' : 'Aggregated data'}
              </button>
            </nav>
          </div>
          
          <div className="p-4 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'el' ? 'Επιλογή ερωτηματολογίου' : 'Questionnaire Selection'}
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

        <div className="space-y-6">
          {activeTab === 'responses' && (
            <ResponsesViewer
              questionnaire={selectedQuestionnaire}
              language={language}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              questionnaireId={selectedQuestionnaire.id}
              questionnaireName={selectedQuestionnaire.name}
              language={language}
            />
          )}
        </div></>}

        
      </div>
    </div>
  );
}