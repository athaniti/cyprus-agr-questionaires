import { useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = 'http://localhost:5050/api';

interface Farm {
  farmCode: string;
  ownerName: string;
  province: string;
  community: string;
  farmType: string;
}

interface Interviewer {
  id: string;
  firstName: string;
  lastName: string;
}

interface QuestionnaireResponse {
  id: string;
  farmId: string;
  farm: Farm;
  status: string;
  completionPercentage: number;
  user?: Interviewer;
  submittedAt?: string;
  updatedAt?: string;
  createdAt: string;
  responseData?: string; // JSON string containing the actual form data
}

interface ResponsesViewerProps {
  questionnaireId: string;
  questionnaireName: string;
  language?: 'el' | 'en';
}

export default function ResponsesViewer({ 
  questionnaireId, 
  questionnaireName, 
  language = 'el' 
}: ResponsesViewerProps) {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<QuestionnaireResponse | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    province: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0
  });

  const fetchResponses = async () => {
    setLoading(true);
    setError(null);
    
    try {      
      const response = await fetch(`${API_BASE_URL}/questionnaires/${questionnaireId}/responses`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      // The API returns { responses: [], totalCount: 0, ... }
      // Extract the responses array
      const responsesArray = data.responses || [];
      
      // Set the responses from API or empty array if none found
      setResponses(responsesArray);
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const viewResponseDetails = async (questionnaireResponse: QuestionnaireResponse) => {
    setSelectedResponse(questionnaireResponse);
    setShowDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'el') {
      switch (status) {
        case 'submitted': return 'Υποβληθείσα';
        case 'in_progress': return 'Σε εξέλιξη';
        case 'draft': return 'Προσχέδιο';
        default: return status;
      }
    } else {
      switch (status) {
        case 'submitted': return 'Submitted';
        case 'in_progress': return 'In Progress';
        case 'draft': return 'Draft';
        default: return status;
      }
    }
  };

  const filteredResponses = (responses || []).filter(response => {
    const matchesSearch = !filters.search || 
      response.farm?.farmCode?.toLowerCase().includes(filters.search.toLowerCase()) ||
      response.farm?.ownerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      response.farmId?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || response.status === filters.status;
    const matchesProvince = !filters.province || response.farm?.province === filters.province;
    
    return matchesSearch && matchesStatus && matchesProvince;
  });

  useEffect(() => {
    fetchResponses();
  }, [questionnaireId]);

  useEffect(() => {
    console.log('ResponsesViewer loaded with props:', {
      questionnaireId,
      questionnaireName,
      language
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          {language === 'el' ? 'Φόρτωση απαντήσεων...' : 'Loading responses...'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-800">
              <h3 className="text-sm font-medium">
                {language === 'el' ? 'Σφάλμα φόρτωσης' : 'Loading Error'}
              </h3>
              <div className="mt-2 text-sm">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {language === 'el' ? 'Απαντήσεις Ερωτηματολογίου' : 'Questionnaire Responses'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">{questionnaireName}</p>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'el' ? 'Κατάσταση' : 'Status'}
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">{language === 'el' ? 'Όλες' : 'All'}</option>
              <option value="submitted">{language === 'el' ? 'Υποβληθείσες' : 'Submitted'}</option>
              <option value="in_progress">{language === 'el' ? 'Σε εξέλιξη' : 'In Progress'}</option>
              <option value="draft">{language === 'el' ? 'Προσχέδια' : 'Drafts'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'el' ? 'Επαρχία' : 'Province'}
            </label>
            <select
              value={filters.province}
              onChange={(e) => setFilters(prev => ({ ...prev, province: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">{language === 'el' ? 'Όλες' : 'All'}</option>
              <option value="Λευκωσία">Λευκωσία</option>
              <option value="Λεμεσός">Λεμεσός</option>
              <option value="Λάρνακα">Λάρνακα</option>
              <option value="Πάφος">Πάφος</option>
              <option value="Αμμόχωστος">Αμμόχωστος</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'el' ? 'Αναζήτηση' : 'Search'}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder={language === 'el' ? 'Κωδικός ή όνομα...' : 'Code or name...'}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', province: '', search: '' })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {language === 'el' ? 'Καθαρισμός' : 'Clear'}
            </button>
          </div>
        </div>
      </div>

      {/* Responses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'el' ? 'Εκμετάλλευση' : 'Farm'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'el' ? 'Επαρχία' : 'Province'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'el' ? 'Κατάσταση' : 'Status'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'el' ? 'Πρόοδος' : 'Progress'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'el' ? 'Συνεντευκτής' : 'Interviewer'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'el' ? 'Ενέργειες' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResponses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {language === 'el' ? 'Δεν βρέθηκαν απαντήσεις' : 'No responses found'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {language === 'el' 
                        ? 'Δεν υπάρχουν ακόμα απαντήσεις για αυτό το ερωτηματολόγιο.' 
                        : 'No responses have been submitted for this questionnaire yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredResponses.map((response) => (
              <tr key={response.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {response.farm?.farmCode || response.farmId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {response.farm?.ownerName || 'Μη διαθέσιμο'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{response.farm?.province || 'Μη διαθέσιμο'}</div>
                  <div className="text-sm text-gray-500">{response.farm?.community || 'Μη διαθέσιμο'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(response.status)}`}>
                    {getStatusText(response.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${response.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {Math.round(response.completionPercentage)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {response.user 
                    ? `${response.user.firstName} ${response.user.lastName}`
                    : (language === 'el' ? 'Μη ανατεθειμένο' : 'Unassigned')
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => viewResponseDetails(response)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    {language === 'el' ? 'Προβολή' : 'View'}
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            {language === 'el' 
              ? `Σελίδα ${pagination.page} από ${pagination.totalPages} (${pagination.totalCount} συνολικά)`
              : `Page ${pagination.page} of ${pagination.totalPages} (${pagination.totalCount} total)`
            }
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              {language === 'el' ? 'Προηγούμενη' : 'Previous'}
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              {language === 'el' ? 'Επόμενη' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Response Details Modal */}
      {showDetails && selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'el' ? 'Λεπτομέρειες Απάντησης' : 'Response Details'}
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Response data would be displayed here */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'el' ? 'Κωδικός Εκμετάλλευσης' : 'Farm Code'}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedResponse.farm?.farmCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'el' ? 'Ιδιοκτήτης' : 'Owner'}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedResponse.farm?.ownerName}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Δεδομένα Απάντησης' : 'Response Data'}
                </label>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(selectedResponse.responseData || '{}'), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}