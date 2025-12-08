import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

// API Configuration
const API_BASE_URL = 'http://localhost:5050/api';

interface SuccessRate {
  province?: string;
  community?: string;
  economicSize?: string;
  farmType?: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  draft: number;
  successRate: number;
}

interface InterviewerPerformance {
  interviewerId: string;
  interviewerName: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  draft: number;
  successRate: number;
  averageDaysToComplete: number;
}

interface ResponseTrend {
  date: string;
  totalResponses: number;
  newResponses: number;
  completedResponses: number;
  updatedResponses: number;
}

interface QuestionnaireSummary {
  totalResponses: number;
  completedResponses: number;
  draftResponses: number;
  lastResponseDate?: string;
}

interface AnalyticsDashboardProps {
  questionnaireId: string;
  questionnaireName: string;
  language?: 'el' | 'en';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsDashboard({ 
  questionnaireId, 
  questionnaireName, 
  language = 'el' 
}: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<QuestionnaireSummary | null>(null);
  const [successRates, setSuccessRates] = useState<SuccessRate[]>([]);
  const [interviewerPerformance, setInterviewerPerformance] = useState<InterviewerPerformance[]>([]);
  const [trends, setTrends] = useState<ResponseTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroupBy, setSelectedGroupBy] = useState<'province' | 'community' | 'economic_size' | 'farm_type'>('province');
  const [selectedTrendDays, setSelectedTrendDays] = useState(30);

  const fetchSummary = async () => {
    try {
      console.log('Fetching analytics summary for questionnaire:', questionnaireId);
      const response = await fetch(`${API_BASE_URL}/Analytics/questionnaire/${questionnaireId}/summary`);
      console.log('Analytics summary response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Analytics summary data:', data);
        setSummary(data.summary);
      } else {
        console.error('Analytics summary failed:', response.status, response.statusText);
        setError(`Failed to fetch summary: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const fetchSuccessRates = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Analytics/questionnaire/${questionnaireId}/success-rates?groupBy=${selectedGroupBy}`
      );
      if (response.ok) {
        const data = await response.json();
        setSuccessRates(data.successRates);
      }
    } catch (error) {
      console.error('Error fetching success rates:', error);
    }
  };

  const fetchInterviewerPerformance = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Analytics/questionnaire/${questionnaireId}/interviewer-performance`
      );
      if (response.ok) {
        const data = await response.json();
        setInterviewerPerformance(data.interviewerPerformance);
      }
    } catch (error) {
      console.error('Error fetching interviewer performance:', error);
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Analytics/questionnaire/${questionnaireId}/response-trends?days=${selectedTrendDays}`
      );
      if (response.ok) {
        const data = await response.json();
        setTrends(data.trends);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchSummary(),
        fetchSuccessRates(),
        fetchInterviewerPerformance(),
        fetchTrends()
      ]);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [questionnaireId, selectedGroupBy, selectedTrendDays]);

  useEffect(() => {
    console.log('AnalyticsDashboard loaded with props:', {
      questionnaireId,
      questionnaireName,
      language
    });
  }, []);

  const getGroupByLabel = (key: string) => {
    if (language === 'el') {
      switch (key) {
        case 'province': return 'Επαρχία';
        case 'community': return 'Κοινότητα';
        case 'economic_size': return 'Οικονομικό Μέγεθος';
        case 'farm_type': return 'Τύπος Εκμετάλλευσης';
        default: return key;
      }
    } else {
      switch (key) {
        case 'province': return 'Province';
        case 'community': return 'Community';
        case 'economic_size': return 'Economic Size';
        case 'farm_type': return 'Farm Type';
        default: return key;
      }
    }
  };

  const getDisplayValue = (item: SuccessRate) => {
    return item.province || item.community || item.economicSize || item.farmType || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          {language === 'el' ? 'Φόρτωση αναλυτικών στοιχείων...' : 'Loading analytics...'}
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
                {language === 'el' ? 'Σφάλμα φόρτωσης αναλυτικών' : 'Analytics Loading Error'}
              </h3>
              <div className="mt-2 text-sm">
                <p>{error}</p>
                <button 
                  onClick={loadData}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                >
                  {language === 'el' ? 'Δοκιμή ξανά' : 'Try Again'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pieChartData = summary ? [
    { name: language === 'el' ? 'Υποβληθέντα' : 'Completed', value: summary.completedResponses, color: '#00C49F' },
    { name: language === 'el' ? 'Σε διενέργεια' : 'In Progress', value: summary.draftResponses, color: '#FF8042' }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'el' ? 'Αναλυτικά Στοιχεία' : 'Analytics Dashboard'}
        </h1>
        <p className="text-gray-600">{questionnaireName}</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'el' ? 'Συνολικές Απαντήσεις' : 'Total Responses'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalResponses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'el' ? 'Ολοκληρωμένες' : 'Completed'}
                </p>
                <p className="text-2xl font-semibold text-green-600">{summary.completedResponses}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'el' ? 'Ποσοστό Ολοκλήρωσης' : 'Completion Rate'}
                </p>
                <p className="text-2xl font-semibold text-blue-600">
                  {summary.totalResponses > 0 
                    ? Math.round((summary.completedResponses / summary.totalResponses) * 100)
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'el' ? 'Μέση Πρόοδος' : 'Average Progress'}
                </p>
                
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'el' ? 'Κατανομή Καταστάσεων' : 'Response Status Distribution'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Response Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'el' ? 'Τάσεις Απαντήσεων' : 'Response Trends'}
            </h3>
            <select
              value={selectedTrendDays}
              onChange={(e) => setSelectedTrendDays(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={7}>7 {language === 'el' ? 'ημέρες' : 'days'}</option>
              <option value={30}>30 {language === 'el' ? 'ημέρες' : 'days'}</option>
              <option value={90}>90 {language === 'el' ? 'ημέρες' : 'days'}</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completedResponses" 
                stroke="#00C49F" 
                name={language === 'el' ? 'Ολοκληρωμένες' : 'Completed'} 
              />
              <Line 
                type="monotone" 
                dataKey="newResponses" 
                stroke="#0088FE" 
                name={language === 'el' ? 'Νέες' : 'New'} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success Rates by Geography/Type */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'el' ? 'Ποσοστά Επιτυχίας ανά' : 'Success Rates by'} {getGroupByLabel(selectedGroupBy)}
          </h3>
          <select
            value={selectedGroupBy}
            onChange={(e) => setSelectedGroupBy(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="province">{getGroupByLabel('province')}</option>
            <option value="community">{getGroupByLabel('community')}</option>
            <option value="economic_size">{getGroupByLabel('economic_size')}</option>
            <option value="farm_type">{getGroupByLabel('farm_type')}</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={successRates}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getDisplayValue} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#00C49F" name={language === 'el' ? 'Ολοκληρωμένες' : 'Completed'} />
            <Bar dataKey="inProgress" stackId="a" fill="#FFBB28" name={language === 'el' ? 'Σε εξέλιξη' : 'In Progress'} />
            <Bar dataKey="draft" stackId="a" fill="#FF8042" name={language === 'el' ? 'Προσχέδια' : 'Drafts'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interviewer Performance */}
      {interviewerPerformance.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'el' ? 'Απόδοση Συνεντευκτών' : 'Interviewer Performance'}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Συνεντευκτής' : 'Interviewer'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Ανατεθείσες' : 'Assigned'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Ολοκληρωμένες' : 'Completed'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Ποσοστό Επιτυχίας' : 'Success Rate'}
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interviewerPerformance.map((performance) => (
                  <tr key={performance.interviewerId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {performance.interviewerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {performance.totalAssigned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {performance.completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${performance.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round(performance.successRate)}%
                        </span>
                      </div>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}