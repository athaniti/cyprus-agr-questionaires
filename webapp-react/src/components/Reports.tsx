import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar, FileText, TrendingUp, Users, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

const completionData = [
  { month: 'Jan', el: 'Ιαν', completed: 45, target: 60 },
  { month: 'Feb', el: 'Φεβ', completed: 67, target: 80 },
  { month: 'Mar', el: 'Μαρ', completed: 89, target: 100 },
  { month: 'Apr', el: 'Απρ', completed: 112, target: 120 },
  { month: 'May', el: 'Μαϊ', completed: 145, target: 150 },
  { month: 'Jun', el: 'Ιουν', completed: 178, target: 180 },
  { month: 'Jul', el: 'Ιουλ', completed: 203, target: 210 },
  { month: 'Aug', el: 'Αυγ', completed: 234, target: 240 },
  { month: 'Sep', el: 'Σεπ', completed: 289, target: 280 },
  { month: 'Oct', el: 'Οκτ', completed: 298, target: 300 },
];

const participationByArea = [
  { area: { el: 'Λευκωσία', en: 'Nicosia' }, participants: 245, rate: 82 },
  { area: { el: 'Λεμεσός', en: 'Limassol' }, participants: 189, rate: 76 },
  { area: { el: 'Λάρνακα', en: 'Larnaca' }, participants: 156, rate: 78 },
  { area: { el: 'Πάφος', en: 'Paphos' }, participants: 134, rate: 74 },
  { area: { el: 'Αμμόχωστος', en: 'Famagusta' }, participants: 98, rate: 65 },
];

const timeAnalysisData = [
  { day: 'Mon', el: 'Δευ', responses: 34, avgTime: 12 },
  { day: 'Tue', el: 'Τρι', responses: 45, avgTime: 11 },
  { day: 'Wed', el: 'Τετ', responses: 52, avgTime: 13 },
  { day: 'Thu', el: 'Πεμ', responses: 48, avgTime: 10 },
  { day: 'Fri', el: 'Παρ', responses: 56, avgTime: 14 },
  { day: 'Sat', el: 'Σαβ', responses: 23, avgTime: 16 },
  { day: 'Sun', el: 'Κυρ', responses: 18, avgTime: 15 },
];

const categoryPerformance = [
  { category: { el: 'Φυτική Παραγωγή', en: 'Crop Production' }, responses: 342, completion: 91 },
  { category: { el: 'Κτηνοτροφία', en: 'Livestock' }, responses: 234, completion: 78 },
  { category: { el: 'Αλιεία', en: 'Fisheries' }, responses: 123, completion: 82 },
  { category: { el: 'Άλλο', en: 'Other' }, responses: 89, completion: 69 },
];

export function Reports() {
  const { t, language } = useLanguage();

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{t('reports.title')}</h1>
          <p className="text-gray-600 mt-1">
            {language === 'el' 
              ? 'Αναλυτικές αναφορές και γραφήματα για την πρόοδο των ερωτηματολογίων' 
              : 'Detailed reports and charts for questionnaire progress'}
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="last30">
            <SelectTrigger className="w-48 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">
                {language === 'el' ? 'Τελευταίες 7 μέρες' : 'Last 7 days'}
              </SelectItem>
              <SelectItem value="last30">
                {language === 'el' ? 'Τελευταίες 30 μέρες' : 'Last 30 days'}
              </SelectItem>
              <SelectItem value="last90">
                {language === 'el' ? 'Τελευταίες 90 μέρες' : 'Last 90 days'}
              </SelectItem>
              <SelectItem value="custom">
                {language === 'el' ? 'Προσαρμοσμένο' : 'Custom'}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button style={{ backgroundColor: '#004B87' }} className="text-white rounded-xl gap-2">
            <Download className="h-4 w-4" />
            {t('reports.export')}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Σύνολο Απαντήσεων' : 'Total Responses'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>822</p>
                <Badge 
                  variant="secondary"
                  className="mt-2 text-xs"
                  style={{ backgroundColor: '#E6F9F7', color: '#0C9A8F' }}
                >
                  +12% {language === 'el' ? 'αυτή την εβδομάδα' : 'this week'}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EBF4FF' }}>
                <FileText className="h-6 w-6" style={{ color: '#004B87' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Μέσος Χρόνος' : 'Avg. Time'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>12.5 
                  <span className="text-sm text-gray-500 ml-1">min</span>
                </p>
                <Badge 
                  variant="secondary"
                  className="mt-2 text-xs"
                  style={{ backgroundColor: '#FEF3E2', color: '#F59E0B' }}
                >
                  -8% {language === 'el' ? 'από τον στόχο' : 'from target'}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3E2' }}>
                <Clock className="h-6 w-6" style={{ color: '#F59E0B' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Συμμετέχοντες' : 'Participants'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>654</p>
                <Badge 
                  variant="secondary"
                  className="mt-2 text-xs"
                  style={{ backgroundColor: '#E6F9F7', color: '#0C9A8F' }}
                >
                  +23% {language === 'el' ? 'αυτό το μήνα' : 'this month'}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F9F7' }}>
                <Users className="h-6 w-6" style={{ color: '#0C9A8F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Ποσοστό Επιτυχίας' : 'Success Rate'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>87%</p>
                <Badge 
                  variant="secondary"
                  className="mt-2 text-xs"
                  style={{ backgroundColor: '#F3EDFF', color: '#8B5CF6' }}
                >
                  +5% {language === 'el' ? 'από τον μέσο όρο' : 'from average'}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F3EDFF' }}>
                <TrendingUp className="h-6 w-6" style={{ color: '#8B5CF6' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rates Over Time */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: '#004B87' }} />
              {t('reports.completionRates')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={completionData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0C9A8F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0C9A8F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey={language === 'el' ? 'el' : 'month'}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#0C9A8F" 
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                  strokeWidth={2}
                  name={language === 'el' ? 'Ολοκληρωμένα' : 'Completed'}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#004B87" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name={language === 'el' ? 'Στόχος' : 'Target'}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Participation by Area */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>{t('reports.participation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participationByArea} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis 
                  type="category" 
                  dataKey={language === 'el' ? 'area.el' : 'area.en'}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="participants" 
                  fill="#004B87" 
                  name={language === 'el' ? 'Συμμετέχοντες' : 'Participants'}
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Analysis */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" style={{ color: '#0C9A8F' }} />
              {t('reports.timeAnalysis')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey={language === 'el' ? 'el' : 'day'}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#0C9A8F" 
                  strokeWidth={2}
                  name={language === 'el' ? 'Απαντήσεις' : 'Responses'}
                  dot={{ fill: '#0C9A8F', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name={language === 'el' ? 'Μέσος Χρόνος (λεπτά)' : 'Avg Time (min)'}
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              {language === 'el' ? 'Απόδοση ανά Κατηγορία' : 'Performance by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryPerformance.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {language === 'el' ? category.category.el : category.category.en}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.responses} {language === 'el' ? 'απαντήσεις' : 'responses'}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary"
                      className="rounded-lg"
                      style={
                        category.completion >= 85
                          ? { backgroundColor: '#E6F9F7', color: '#0C9A8F' }
                          : category.completion >= 70
                          ? { backgroundColor: '#FEF3E2', color: '#F59E0B' }
                          : { backgroundColor: '#FEE2E2', color: '#DC2626' }
                      }
                    >
                      {category.completion}%
                    </Badge>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${category.completion}%`,
                          backgroundColor: category.completion >= 85 ? '#0C9A8F' : category.completion >= 70 ? '#F59E0B' : '#DC2626'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>
            {language === 'el' ? 'Επιλογές Εξαγωγής' : 'Export Options'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="rounded-xl justify-start gap-3 h-auto p-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EBF4FF' }}>
                <FileText className="h-5 w-5" style={{ color: '#004B87' }} />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-900">
                  {language === 'el' ? 'Αναφορά PDF' : 'PDF Report'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'el' ? 'Πλήρης αναφορά με γραφήματα' : 'Full report with charts'}
                </p>
              </div>
            </Button>

            <Button variant="outline" className="rounded-xl justify-start gap-3 h-auto p-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6F9F7' }}>
                <Download className="h-5 w-5" style={{ color: '#0C9A8F' }} />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-900">
                  {language === 'el' ? 'Εξαγωγή Excel' : 'Excel Export'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'el' ? 'Δεδομένα σε μορφή CSV' : 'Data in CSV format'}
                </p>
              </div>
            </Button>

            <Button variant="outline" className="rounded-xl justify-start gap-3 h-auto p-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3E2' }}>
                <Download className="h-5 w-5" style={{ color: '#F59E0B' }} />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-900">
                  {language === 'el' ? 'Πρωτογενή Δεδομένα' : 'Raw Data'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'el' ? 'JSON ή XML μορφή' : 'JSON or XML format'}
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
