import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, Users, Send, TrendingUp, CheckCircle2 } from 'lucide-react';

export function Dashboard() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: language === 'el' ? 'Ενεργά Ερωτηματολόγια' : 'Active Questionnaires',
      value: '12',
      icon: FileText,
      change: '+2',
      color: '#004B87',
      bgColor: '#EBF4FF'
    },
    {
      title: language === 'el' ? 'Ολοκληρωμένες Απαντήσεις' : 'Completed Responses',
      value: '822',
      icon: CheckCircle2,
      change: '+156',
      color: '#0C9A8F',
      bgColor: '#E6F9F7'
    },
    {
      title: language === 'el' ? 'Εκκρεμείς Προσκλήσεις' : 'Pending Invitations',
      value: '234',
      icon: Send,
      change: '-18',
      color: '#F59E0B',
      bgColor: '#FEF3E2'
    },
    {
      title: language === 'el' ? 'Σύνολο Χρηστών' : 'Total Users',
      value: '567',
      icon: Users,
      change: '+24',
      color: '#8B5CF6',
      bgColor: '#F3EDFF'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 text-3xl font-bold">
          {language === 'el' ? 'Πίνακας Ελέγχου' : 'Dashboard'}
        </h1>
        <p className="text-gray-600 mt-2">
          {language === 'el' 
            ? 'Επισκόπηση των ερωτηματολογίων και απαντήσεων' 
            : 'Overview of questionnaires and responses'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span 
                        className="text-sm font-medium px-2 py-1 rounded-lg"
                        style={{ 
                          backgroundColor: stat.change.startsWith('+') ? '#E6F9F7' : '#FEE2E2',
                          color: stat.change.startsWith('+') ? '#0C9A8F' : '#DC2626'
                        }}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {language === 'el' ? 'αυτή την εβδομάδα' : 'this week'}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <IconComponent className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Simple Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: '#004B87' }} />
              {language === 'el' ? 'Πρόοδος Συλλογής' : 'Collection Progress'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'el' ? 'Φυτική Παραγωγή' : 'Crop Production'}
                </span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ width: '85%', backgroundColor: '#0C9A8F' }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'el' ? 'Κτηνοτροφία' : 'Livestock'}
                </span>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ width: '72%', backgroundColor: '#004B87' }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              {language === 'el' ? 'Πρόσφατη Δραστηριότητα' : 'Recent Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">
                    {language === 'el' 
                      ? 'Νέο ερωτηματολόγιο δημιουργήθηκε' 
                      : 'New questionnaire created'}
                  </p>
                  <p className="text-xs text-gray-500">2 ώρες πριν</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">
                    {language === 'el' 
                      ? '45 νέες απαντήσεις υποβλήθηκαν' 
                      : '45 new responses submitted'}
                  </p>
                  <p className="text-xs text-gray-500">4 ώρες πριν</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">
                    {language === 'el' 
                      ? 'Ποσοστώσεις ενημερώθηκαν' 
                      : 'Quotas updated'}
                  </p>
                  <p className="text-xs text-gray-500">6 ώρες πριν</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
