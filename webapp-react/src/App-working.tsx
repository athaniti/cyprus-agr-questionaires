import { useState } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [language, setLanguage] = useState<'el' | 'en'>('el');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'el' ? 'Ερωτηματολόγια Γεωργίας Κύπρου' : 'Cyprus Agriculture Questionnaires'}
          </h1>
          
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {language === 'el' ? 'EN' : 'ΕΛ'}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-lg ${
                currentView === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {language === 'el' ? 'Πίνακας' : 'Dashboard'}
            </button>
            
            <button
              onClick={() => setCurrentView('questionnaires')}
              className={`px-4 py-2 rounded-lg ${
                currentView === 'questionnaires' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {language === 'el' ? 'Ερωτηματολόγια' : 'Questionnaires'}
            </button>
          </div>

          {currentView === 'dashboard' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {language === 'el' ? 'Πίνακας Ελέγχου' : 'Dashboard'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'el' 
                  ? 'Σύστημα διαχείρισης ερωτηματολογίων για την κυπριακή γεωργία' 
                  : 'Management system for Cyprus agricultural questionnaires'
                }
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">
                    {language === 'el' ? 'Ενεργά Ερωτηματολόγια' : 'Active Questionnaires'}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">
                    {language === 'el' ? 'Απαντήσεις' : 'Responses'}
                  </h3>
                  <p className="text-2xl font-bold text-green-600">234</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">
                    {language === 'el' ? 'Χρήστες' : 'Users'}
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">67</p>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {language === 'el' ? 'Form.io Schema Storage' : 'Form.io Schema Storage'}
                </h3>
                <p className="text-gray-600">
                  {language === 'el' 
                    ? '✅ Η δομή του ερωτηματολογίου αποθηκεύεται στη βάση δεδομένων με το πεδίο Schema (jsonb type)'
                    : '✅ Questionnaire structure is stored in database with Schema field (jsonb type)'
                  }
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {language === 'el' 
                    ? 'Κάθε ερωτηματολόγιο που δημιουργείται αποθηκεύει την πλήρη δομή του Form.io JSON'
                    : 'Each created questionnaire stores the complete Form.io JSON structure'
                  }
                </p>
              </div>
            </div>
          )}

          {currentView === 'questionnaires' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {language === 'el' ? 'Ερωτηματολόγια' : 'Questionnaires'}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === 'el' ? 'Ερωτηματολόγιο Κτηνοτροφίας' : 'Livestock Survey'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'el' ? 'Δεδομένα κτηνοτροφικών εκμεταλλεύσεων' : 'Livestock farm data collection'}
                      </p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-2">
                        {language === 'el' ? 'Ενεργό' : 'Active'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">45/100</p>
                      <p className="text-xs text-gray-400">45% {language === 'el' ? 'ολοκλήρωση' : 'complete'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === 'el' ? 'Αξιολόγηση Καλλιεργειών' : 'Crop Assessment'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'el' ? 'Αξιολόγηση τρέχουσας καλλιεργητικής περιόδου' : 'Current season crop evaluation'}
                      </p>
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mt-2">
                        {language === 'el' ? 'Πρόχειρο' : 'Draft'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">0/150</p>
                      <p className="text-xs text-gray-400">0% {language === 'el' ? 'ολοκλήρωση' : 'complete'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;