import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const quotaData = [
  {
    category: { el: 'Φυτική Παραγωγή - Σιτηρά', en: 'Crop Production - Cereals' },
    required: 150,
    completed: 142,
    remaining: 8,
    district: { el: 'Λευκωσία', en: 'Nicosia' }
  },
  {
    category: { el: 'Φυτική Παραγωγή - Λαχανικά', en: 'Crop Production - Vegetables' },
    required: 120,
    completed: 98,
    remaining: 22,
    district: { el: 'Λεμεσός', en: 'Limassol' }
  },
  {
    category: { el: 'Κτηνοτροφία - Βοοειδή', en: 'Livestock - Cattle' },
    required: 100,
    completed: 76,
    remaining: 24,
    district: { el: 'Λάρνακα', en: 'Larnaca' }
  },
  {
    category: { el: 'Κτηνοτροφία - Πρόβατα/Κατσίκια', en: 'Livestock - Sheep/Goats' },
    required: 90,
    completed: 89,
    remaining: 1,
    district: { el: 'Πάφος', en: 'Paphos' }
  },
  {
    category: { el: 'Πτηνοτροφία', en: 'Poultry' },
    required: 80,
    completed: 54,
    remaining: 26,
    district: { el: 'Λευκωσία', en: 'Nicosia' }
  },
  {
    category: { el: 'Αλιεία - Θαλάσσια', en: 'Fisheries - Marine' },
    required: 60,
    completed: 45,
    remaining: 15,
    district: { el: 'Αμμόχωστος', en: 'Famagusta' }
  },
  {
    category: { el: 'Αλιεία - Υδατοκαλλιέργεια', en: 'Fisheries - Aquaculture' },
    required: 50,
    completed: 38,
    remaining: 12,
    district: { el: 'Λεμεσός', en: 'Limassol' }
  },
  {
    category: { el: 'Οπωροκηπευτικά', en: 'Fruits & Vegetables' },
    required: 140,
    completed: 112,
    remaining: 28,
    district: { el: 'Λάρνακα', en: 'Larnaca' }
  },
];

const categoryChartData = quotaData.map(item => ({
  name: item.category.en.split(' - ')[0],
  nameEl: item.category.el.split(' - ')[0],
  required: item.required,
  completed: item.completed,
  rate: Math.round((item.completed / item.required) * 100)
}));

const statusData = [
  { 
    name: { el: 'Ολοκληρωμένα', en: 'Completed' },
    value: quotaData.reduce((sum, item) => sum + item.completed, 0),
    color: '#0C9A8F'
  },
  { 
    name: { el: 'Υπολειπόμενα', en: 'Remaining' },
    value: quotaData.reduce((sum, item) => sum + item.remaining, 0),
    color: '#F59E0B'
  },
];

export function Quotas() {
  const { t, language } = useLanguage();

  const totalRequired = quotaData.reduce((sum, item) => sum + item.required, 0);
  const totalCompleted = quotaData.reduce((sum, item) => sum + item.completed, 0);
  const totalRemaining = quotaData.reduce((sum, item) => sum + item.remaining, 0);
  const overallProgress = Math.round((totalCompleted / totalRequired) * 100);

  const atRisk = quotaData.filter(item => (item.completed / item.required) < 0.7).length;
  const onTrack = quotaData.filter(item => (item.completed / item.required) >= 0.7 && (item.completed / item.required) < 0.95).length;
  const completed = quotaData.filter(item => (item.completed / item.required) >= 0.95).length;

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900">{t('quotas.title')}</h1>
        <p className="text-gray-600 mt-1">
          {language === 'el' 
            ? 'Παρακολούθηση και διαχείριση ποσοστώσεων ανά κατηγορία και περιοχή' 
            : 'Track and manage quotas by category and region'}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quotas.required')}</p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>{totalRequired}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EBF4FF' }}>
                <Target className="h-6 w-6" style={{ color: '#004B87' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quotas.completed')}</p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>{totalCompleted}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F9F7' }}>
                <CheckCircle2 className="h-6 w-6" style={{ color: '#0C9A8F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quotas.remaining')}</p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>{totalRemaining}</p>
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
                <p className="text-sm text-gray-600">{t('quotas.progress')}</p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>{overallProgress}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F3EDFF' }}>
                <TrendingUp className="h-6 w-6" style={{ color: '#8B5CF6' }} />
              </div>
            </div>
            <Progress value={overallProgress} className="h-2 mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8" style={{ color: '#0C9A8F' }} />
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Ολοκληρωμένες' : 'Completed'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.5rem' }}>{completed}</p>
                <p className="text-xs text-gray-500">
                  {language === 'el' ? 'κατηγορίες ≥95%' : 'categories ≥95%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8" style={{ color: '#F59E0B' }} />
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Σε Πρόοδο' : 'On Track'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.5rem' }}>{onTrack}</p>
                <p className="text-xs text-gray-500">
                  {language === 'el' ? 'κατηγορίες 70-94%' : 'categories 70-94%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8" style={{ color: '#DC2626' }} />
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Σε Κίνδυνο' : 'At Risk'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.5rem' }}>{atRisk}</p>
                <p className="text-xs text-gray-500">
                  {language === 'el' ? 'κατηγορίες <70%' : 'categories <70%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>{t('quotas.byCategory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey={language === 'el' ? 'nameEl' : 'name'}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 11 }}
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
                  fill="#0C9A8F" 
                  name={language === 'el' ? 'Ολοκληρωμένα' : 'Completed'}
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="required" 
                  fill="#E5E7EB" 
                  name={language === 'el' ? 'Απαιτούμενα' : 'Required'}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              {language === 'el' ? 'Κατάσταση Ολοκλήρωσης' : 'Completion Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${language === 'el' ? name.el : name.en}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="text-sm text-gray-900">
                      {language === 'el' ? item.name.el : item.name.en}
                    </p>
                    <p className="text-xs text-gray-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>
            {language === 'el' ? 'Λεπτομέρειες Ποσοστώσεων' : 'Quota Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('quotas.category')}</TableHead>
                <TableHead>{language === 'el' ? 'Επαρχία' : 'District'}</TableHead>
                <TableHead>{t('quotas.required')}</TableHead>
                <TableHead>{t('quotas.completed')}</TableHead>
                <TableHead>{t('quotas.remaining')}</TableHead>
                <TableHead>{t('quotas.progress')}</TableHead>
                <TableHead>{language === 'el' ? 'Κατάσταση' : 'Status'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotaData.map((item, index) => {
                const progressPercent = Math.round((item.completed / item.required) * 100);
                const status = progressPercent >= 95 ? 'completed' : progressPercent >= 70 ? 'on-track' : 'at-risk';
                
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <p className="text-gray-900">
                        {language === 'el' ? item.category.el : item.category.en}
                      </p>
                    </TableCell>
                    <TableCell>
                      {language === 'el' ? item.district.el : item.district.en}
                    </TableCell>
                    <TableCell>{item.required}</TableCell>
                    <TableCell>{item.completed}</TableCell>
                    <TableCell>{item.remaining}</TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex items-center gap-2 mb-1">
                          <Progress value={progressPercent} className="h-2 flex-1" />
                          <span className="text-sm text-gray-900">{progressPercent}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className="rounded-lg"
                        style={
                          status === 'completed' 
                            ? { backgroundColor: '#E6F9F7', color: '#0C9A8F' }
                            : status === 'on-track'
                            ? { backgroundColor: '#FEF3E2', color: '#F59E0B' }
                            : { backgroundColor: '#FEE2E2', color: '#DC2626' }
                        }
                      >
                        {status === 'completed' 
                          ? (language === 'el' ? 'Ολοκληρωμένη' : 'Completed')
                          : status === 'on-track'
                          ? (language === 'el' ? 'Σε Πρόοδο' : 'On Track')
                          : (language === 'el' ? 'Σε Κίνδυνο' : 'At Risk')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
