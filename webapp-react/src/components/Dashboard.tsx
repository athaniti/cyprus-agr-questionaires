import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Users, Send, TrendingUp, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const districtData = [
  { name: 'Λευκωσία / Nicosia', el: 'Λευκωσία', en: 'Nicosia', completed: 245, target: 300 },
  { name: 'Λεμεσός / Limassol', el: 'Λεμεσός', en: 'Limassol', completed: 189, target: 250 },
  { name: 'Λάρνακα / Larnaca', el: 'Λάρνακα', en: 'Larnaca', completed: 156, target: 200 },
  { name: 'Πάφος / Paphos', el: 'Πάφος', en: 'Paphos', completed: 134, target: 180 },
  { name: 'Αμμόχωστος / Famagusta', el: 'Αμμόχωστος', en: 'Famagusta', completed: 98, target: 150 },
];

const trendData = [
  { date: '01/10', responses: 45 },
  { date: '02/10', responses: 67 },
  { date: '03/10', responses: 89 },
  { date: '04/10', responses: 112 },
  { date: '05/10', responses: 145 },
  { date: '06/10', responses: 178 },
  { date: '07/10', responses: 203 },
  { date: '08/10', responses: 234 },
  { date: '09/10', responses: 267 },
  { date: '10/10', responses: 298 },
];

const categoryData = [
  { name: 'Φυτική Παραγωγή / Crop Production', value: 342, color: '#004B87' },
  { name: 'Κτηνοτροφία / Livestock', value: 234, color: '#0C9A8F' },
  { name: 'Αλιεία / Fisheries', value: 123, color: '#F59E0B' },
  { name: 'Άλλο / Other', value: 89, color: '#8B5CF6' },
];

const recentActivity = [
  { 
    action: { el: 'Νέο ερωτηματολόγιο "Καλλιέργειες 2025" δημιουργήθηκε', en: 'New questionnaire "Crops 2025" created' },
    time: '2h ago',
    user: 'Μαρία Γεωργίου / Maria Georgiou',
    type: 'create'
  },
  {
    action: { el: '45 νέες προσκλήσεις απεστάλησαν', en: '45 new invitations sent' },
    time: '4h ago',
    user: 'Ανδρέας Παπαδόπουλος / Andreas Papadopoulos',
    type: 'send'
  },
  {
    action: { el: 'Ποσοστώσεις ενημερώθηκαν για Λεμεσό', en: 'Quotas updated for Limassol' },
    time: '6h ago',
    user: 'Ελένη Χριστοδούλου / Eleni Christodoulou',
    type: 'update'
  },
  {
    action: { el: '12 ερωτηματολόγια ολοκληρώθηκαν', en: '12 questionnaires completed' },
    time: '8h ago',
    user: 'System',
    type: 'complete'
  },
];

const topCommunities = [
  { name: 'Αγλαντζιά / Aglandjia', completed: 89, target: 100, rate: 89 },
  { name: 'Λακατάμια / Lakatamia', completed: 76, target: 90, rate: 84 },
  { name: 'Στρόβολος / Strovolos', completed: 72, target: 95, rate: 76 },
  { name: 'Λατσιά / Latsia', completed: 65, target: 80, rate: 81 },
  { name: 'Έγκωμη / Engomi', completed: 58, target: 75, rate: 77 },
];

export function Dashboard() {
  const { t, language } = useLanguage();

  const stats = [
    {
      title: t('dashboard.activeQuestionnaires'),
      value: '12',
      icon: FileText,
      change: '+2',
      color: '#004B87',
      bgColor: '#EBF4FF'
    },
    {
      title: t('dashboard.completedResponses'),
      value: '822',
      icon: CheckCircle2,
      change: '+156',
      color: '#0C9A8F',
      bgColor: '#E6F9F7'
    },
    {
      title: t('dashboard.pendingInvitations'),
      value: '234',
      icon: Send,
      change: '-18',
      color: '#F59E0B',
      bgColor: '#FEF3E2'
    },
    {
      title: t('dashboard.completionRate'),
      value: '73%',
      icon: TrendingUp,
      change: '+5%',
      color: '#8B5CF6',
      bgColor: '#F3EDFF'
    },
  ];

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600 mt-1">
          {language === 'el' 
            ? 'Επισκόπηση της δραστηριότητας και της προόδου των ερωτηματολογίων' 
            : 'Overview of activity and questionnaire progress'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-gray-900" style={{ fontSize: '2rem', lineHeight: '1' }}>{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: stat.bgColor,
                          color: stat.color
                        }}
                      >
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {language === 'el' ? 'τις τελευταίες 7 μέρες' : 'last 7 days'}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress by District */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" style={{ color: '#004B87' }} />
              {t('dashboard.progressByDistrict')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey={language === 'el' ? 'el' : 'en'} 
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
                <Bar 
                  dataKey="completed" 
                  fill="#004B87" 
                  name={language === 'el' ? 'Ολοκληρωμένα' : 'Completed'}
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="target" 
                  fill="#E5E7EB" 
                  name={language === 'el' ? 'Στόχος' : 'Target'}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion Trends */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: '#0C9A8F' }} />
              {t('dashboard.completionTrends')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#0C9A8F" 
                  strokeWidth={3}
                  name={language === 'el' ? 'Απαντήσεις' : 'Responses'}
                  dot={{ fill: '#0C9A8F', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              {language === 'el' ? 'Κατανομή ανά Κατηγορία' : 'Distribution by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700">
                      {language === 'el' ? item.name.split(' / ')[0] : item.name.split(' / ')[1]}
                    </span>
                  </div>
                  <span className="text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: '#0C9A8F' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {language === 'el' ? activity.action.el : activity.action.en}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Communities */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>{t('dashboard.topPerforming')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCommunities.map((community, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-900">
                      {language === 'el' ? community.name.split(' / ')[0] : community.name.split(' / ')[1]}
                    </span>
                    <span className="text-gray-600">
                      {community.completed}/{community.target}
                    </span>
                  </div>
                  <Progress value={community.rate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
