import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Send, 
  Mail, 
  Clock, 
  CheckCircle, 
  Eye,
  BarChart3,
  Settings,
  Users,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface InvitationBatch {
  id: string;
  name: string;
  questionnaireName: string;
  totalInvitations: number;
  deliveredInvitations: number;
  failedInvitations: number;
  openedInvitations: number;
  clickedInvitations: number;
  startedResponses: number;
  completedResponses: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'completed';
  scheduledSendTime?: string;
  sentAt?: string;
  createdAt: string;
  participationRate: number;
  completionRate: number;
  deliveryRate: number;
}

interface InvitationTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  questionnaireName: string;
  createdAt: string;
}

interface Questionnaire {
  id: string;
  name: string;
  status: string;
}

const InvitationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('batches');
  const [batches, setBatches] = useState<InvitationBatch[]>([]);
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<InvitationBatch | null>(null);
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data για demonstration
  useEffect(() => {
    const mockBatches: InvitationBatch[] = [
      {
        id: '1',
        name: 'Γεωργική Έρευνα Λευκωσίας - Φάση Α',
        questionnaireName: 'Γεωργική Παραγωγή 2025',
        totalInvitations: 150,
        deliveredInvitations: 142,
        failedInvitations: 8,
        openedInvitations: 98,
        clickedInvitations: 76,
        startedResponses: 65,
        completedResponses: 52,
        status: 'completed',
        sentAt: '2025-01-15T10:00:00Z',
        createdAt: '2025-01-14T14:30:00Z',
        participationRate: 43.3,
        completionRate: 80.0,
        deliveryRate: 94.7
      },
      {
        id: '2',
        name: 'Βιολογική Καλλιέργεια - Έρευνα Αγροτών',
        questionnaireName: 'Οργανική Γεωργία',
        totalInvitations: 80,
        deliveredInvitations: 75,
        failedInvitations: 5,
        openedInvitations: 45,
        clickedInvitations: 32,
        startedResponses: 28,
        completedResponses: 15,
        status: 'sent',
        sentAt: '2025-01-18T09:00:00Z',
        createdAt: '2025-01-17T16:00:00Z',
        participationRate: 35.0,
        completionRate: 53.6,
        deliveryRate: 93.8
      },
      {
        id: '3',
        name: 'Καλλιέργεια Εσπεριδοειδών - Πάφος',
        questionnaireName: 'Εσπεριδοειδή & Φρούτα',
        totalInvitations: 120,
        deliveredInvitations: 0,
        failedInvitations: 0,
        openedInvitations: 0,
        clickedInvitations: 0,
        startedResponses: 0,
        completedResponses: 0,
        status: 'scheduled',
        scheduledSendTime: '2025-01-25T08:00:00Z',
        createdAt: '2025-01-20T11:00:00Z',
        participationRate: 0,
        completionRate: 0,
        deliveryRate: 0
      },
      {
        id: '4',
        name: 'Κτηνοτροφία - Εθνική Έρευνα',
        questionnaireName: 'Κτηνοτροφία & Ζωική Παραγωγή',
        totalInvitations: 200,
        deliveredInvitations: 0,
        failedInvitations: 0,
        openedInvitations: 0,
        clickedInvitations: 0,
        startedResponses: 0,
        completedResponses: 0,
        status: 'draft',
        createdAt: '2025-01-22T10:15:00Z',
        participationRate: 0,
        completionRate: 0,
        deliveryRate: 0
      }
    ];

    const mockTemplates: InvitationTemplate[] = [
      {
        id: '1',
        name: 'Πρότυπο Γεωργικής Έρευνας',
        subject: 'Πρόσκληση συμμετοχής σε έρευνα - Υπουργείο Γεωργίας',
        htmlContent: '<h2>Αγαπητέ Αγρότη,</h2><p>Σας προσκαλούμε να συμμετάσχετε στην έρευνά μας...</p>',
        questionnaireName: 'Γεωργική Παραγωγή 2025',
        createdAt: '2025-01-10T12:00:00Z'
      },
      {
        id: '2',
        name: 'Πρότυπο Βιολογικής Γεωργίας',
        subject: 'Έρευνα Βιολογικής Καλλιέργειας - Η γνώμη σας μετράει',
        htmlContent: '<h2>Καλημέρα,</h2><p>Συμμετάσχετε στην έρευνά μας για τη βιολογική γεωργία...</p>',
        questionnaireName: 'Οργανική Γεωργία',
        createdAt: '2025-01-12T15:30:00Z'
      }
    ];

    const mockQuestionnaires: Questionnaire[] = [
      { id: '1', name: 'Γεωργική Παραγωγή 2025', status: 'active' },
      { id: '2', name: 'Οργανική Γεωργία', status: 'active' },
      { id: '3', name: 'Εσπεριδοειδή & Φρούτα', status: 'active' },
      { id: '4', name: 'Κτηνοτροφία & Ζωική Παραγωγή', status: 'draft' }
    ];

    setBatches(mockBatches);
    setTemplates(mockTemplates);
    setQuestionnaires(mockQuestionnaires);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="text-gray-600">Πρόχειρο</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-blue-600">Προγραμματισμένο</Badge>;
      case 'sending':
        return <Badge variant="outline" className="text-yellow-600">Αποστολή</Badge>;
      case 'sent':
        return <Badge variant="outline" className="text-green-600">Στάλθηκε</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-purple-600">Ολοκληρώθηκε</Badge>;
      default:
        return <Badge variant="outline">Άγνωστο</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.questionnaireName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const BatchAnalytics: React.FC<{ batch: InvitationBatch }> = ({ batch }) => {
    const deliveryData = [
      { name: 'Παραδόθηκαν', value: batch.deliveredInvitations, color: '#22c55e' },
      { name: 'Απέτυχαν', value: batch.failedInvitations, color: '#ef4444' },
      { name: 'Εκκρεμείς', value: batch.totalInvitations - batch.deliveredInvitations - batch.failedInvitations, color: '#f59e0b' }
    ];

    const engagementData = [
      { name: 'Άνοιξαν', value: batch.openedInvitations, color: '#3b82f6' },
      { name: 'Κλικ', value: batch.clickedInvitations, color: '#8b5cf6' },
      { name: 'Ξεκίνησαν', value: batch.startedResponses, color: '#06b6d4' },
      { name: 'Ολοκλήρωσαν', value: batch.completedResponses, color: '#10b981' }
    ];

    const timelineData = [
      { name: 'Εβδ. 1', sent: 50, opened: 35, started: 25, completed: 15 },
      { name: 'Εβδ. 2', sent: 0, opened: 20, started: 15, completed: 12 },
      { name: 'Εβδ. 3', sent: 0, opened: 15, started: 12, completed: 10 },
      { name: 'Εβδ. 4', sent: 0, opened: 10, started: 8, completed: 8 }
    ];

    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ποσοστό Παράδοσης</p>
                  <p className="text-2xl font-bold text-green-600">{batch.deliveryRate.toFixed(1)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ποσοστό Συμμετοχής</p>
                  <p className="text-2xl font-bold text-blue-600">{batch.participationRate.toFixed(1)}%</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ποσοστό Ολοκλήρωσης</p>
                  <p className="text-2xl font-bold text-purple-600">{batch.completionRate.toFixed(1)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Σύνολο Προσκλήσεων</p>
                  <p className="text-2xl font-bold text-gray-900">{batch.totalInvitations}</p>
                </div>
                <Mail className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Status Pie Chart */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Κατάσταση Παράδοσης</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deliveryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deliveryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Bar Chart */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Επίπεδα Συμμετοχής</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Χρονολόγιο Αποκρίσεων</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="opened" stroke="#3b82f6" name="Άνοιξαν" />
                <Line type="monotone" dataKey="started" stroke="#06b6d4" name="Ξεκίνησαν" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" name="Ολοκλήρωσαν" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Statistics Table */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Λεπτομερή Στατιστικά</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Μετρική</th>
                    <th className="text-right p-3">Αριθμός</th>
                    <th className="text-right p-3">Ποσοστό</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b">
                    <td className="p-3">Σύνολο Προσκλήσεων</td>
                    <td className="text-right p-3">{batch.totalInvitations}</td>
                    <td className="text-right p-3">100%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Παραδόθηκαν</td>
                    <td className="text-right p-3">{batch.deliveredInvitations}</td>
                    <td className="text-right p-3">{batch.deliveryRate.toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Απέτυχαν</td>
                    <td className="text-right p-3 text-red-600">{batch.failedInvitations}</td>
                    <td className="text-right p-3 text-red-600">{((batch.failedInvitations / batch.totalInvitations) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Άνοιξαν Email</td>
                    <td className="text-right p-3">{batch.openedInvitations}</td>
                    <td className="text-right p-3">{batch.deliveredInvitations > 0 ? ((batch.openedInvitations / batch.deliveredInvitations) * 100).toFixed(1) : 0}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Κλικ στον Σύνδεσμο</td>
                    <td className="text-right p-3">{batch.clickedInvitations}</td>
                    <td className="text-right p-3">{batch.openedInvitations > 0 ? ((batch.clickedInvitations / batch.openedInvitations) * 100).toFixed(1) : 0}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Ξεκίνησαν Ερωτηματολόγιο</td>
                    <td className="text-right p-3">{batch.startedResponses}</td>
                    <td className="text-right p-3">{batch.participationRate.toFixed(1)}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">Ολοκλήρωσαν Ερωτηματολόγιο</td>
                    <td className="text-right p-3 font-semibold text-green-600">{batch.completedResponses}</td>
                    <td className="text-right p-3 font-semibold text-green-600">{batch.completionRate.toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Διαχείριση Προσκλήσεων</h1>
        <p className="text-gray-600">Δημιουργία και παρακολούθηση προσκλήσεων ερωτηματολογίων</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="batches" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Παρτίδες Προσκλήσεων
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Πρότυπα
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Αναζήτηση παρτίδων..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Φίλτρο κατάστασης" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                  <SelectItem value="draft">Πρόχειρο</SelectItem>
                  <SelectItem value="scheduled">Προγραμματισμένο</SelectItem>
                  <SelectItem value="sent">Στάλθηκε</SelectItem>
                  <SelectItem value="completed">Ολοκληρώθηκε</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowCreateBatch(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Νέα Παρτίδα
            </Button>
          </div>

          {/* Batches List */}
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Φόρτωση...</p>
              </div>
            ) : filteredBatches.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Δεν βρέθηκαν παρτίδες προσκλήσεων</p>
                </CardContent>
              </Card>
            ) : (
              filteredBatches.map((batch) => (
                <Card key={batch.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{batch.name}</h3>
                          {getStatusBadge(batch.status)}
                        </div>
                        <p className="text-gray-600 mb-2">{batch.questionnaireName}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Σύνολο:</span>
                            <span className="ml-2 font-medium">{batch.totalInvitations}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Παράδοση:</span>
                            <span className="ml-2 font-medium text-green-600">{batch.deliveryRate.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Συμμετοχή:</span>
                            <span className="ml-2 font-medium text-blue-600">{batch.participationRate.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ολοκλήρωση:</span>
                            <span className="ml-2 font-medium text-purple-600">{batch.completionRate.toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-500">
                          {batch.status === 'scheduled' && batch.scheduledSendTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Προγραμματισμένο: {formatDate(batch.scheduledSendTime)}
                            </div>
                          )}
                          {batch.sentAt && (
                            <div className="flex items-center gap-1">
                              <Send className="h-4 w-4" />
                              Στάλθηκε: {formatDate(batch.sentAt)}
                            </div>
                          )}
                          <div>Δημιουργήθηκε: {formatDate(batch.createdAt)}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row gap-2 lg:ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBatch(batch)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Προεπισκόπηση
                        </Button>
                        {batch.status === 'draft' && (
                          <Button
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Αποστολή
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Controls */}
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Αναζήτηση προτύπων..."
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowCreateTemplate(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Νέο Πρότυπο
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.questionnaireName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Θέμα:</span>
                      <p className="text-sm text-gray-800">{template.subject}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Δημιουργήθηκε:</span>
                      <p className="text-sm text-gray-800">{formatDate(template.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Επεξεργασία
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Προεπισκόπηση
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Batch Preview Dialog */}
      {selectedBatch && (
        <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
          <DialogContent 
            className="max-w-none w-[95vw] max-h-[95vh] h-[95vh] overflow-y-auto bg-white border border-gray-300 p-8"
            style={{
              width: '95vw',
              maxWidth: '95vw',
              height: '95vh',
              maxHeight: '95vh'
            }}
          >
            <DialogHeader className="bg-white border-b border-gray-200 pb-4 mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Προεπισκόπηση Παρτίδας: {selectedBatch.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Λεπτομερή στατιστικά και ανάλυση για την παρτίδα προσκλήσεων
              </DialogDescription>
            </DialogHeader>
            <div className="bg-white flex-1 overflow-y-auto">
              <BatchAnalytics batch={selectedBatch} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Batch Dialog */}
      {showCreateBatch && (
        <Dialog open={showCreateBatch} onOpenChange={setShowCreateBatch}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white">
            <DialogHeader className="bg-white pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900">Δημιουργία Νέας Παρτίδας Προσκλήσεων</DialogTitle>
              <DialogDescription className="text-gray-600">
                Δημιουργήστε μια νέα παρτίδα προσκλήσεων για ερωτηματολόγιο
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="batch-name" className="text-base font-medium text-gray-700">Όνομα Παρτίδας</Label>
                    <Input 
                      id="batch-name" 
                      placeholder="π.χ. Γεωργική Έρευνα Λευκωσίας - Φάση Β" 
                      className="mt-2 bg-white border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="questionnaire" className="text-base font-medium text-gray-700">Ερωτηματολόγιο</Label>
                    <Select>
                      <SelectTrigger className="mt-2 bg-white border-gray-300">
                        <SelectValue placeholder="Επιλέξτε ερωτηματολόγιο" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {questionnaires.map(q => (
                          <SelectItem key={q.id} value={q.id} className="bg-white hover:bg-gray-50">{q.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="template" className="text-base font-medium text-gray-700">Πρότυπο Πρόσκλησης</Label>
                    <Select>
                      <SelectTrigger className="mt-2 bg-white border-gray-300">
                        <SelectValue placeholder="Επιλέξτε πρότυπο" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {templates.map(t => (
                          <SelectItem key={t.id} value={t.id} className="bg-white hover:bg-gray-50">{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient-count" className="text-base font-medium text-gray-700">Αριθμός Παραληπτών</Label>
                    <Input 
                      id="recipient-count" 
                      type="number" 
                      placeholder="π.χ. 150" 
                      className="mt-2 bg-white border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule-date" className="text-base font-medium text-gray-700">Προγραμματισμός Αποστολής</Label>
                    <Input 
                      id="schedule-date" 
                      type="datetime-local" 
                      className="mt-2 bg-white border-gray-300"
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-2">
                    <Switch id="immediate-send" />
                    <Label htmlFor="immediate-send" className="text-base font-medium text-gray-700">Άμεση αποστολή</Label>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <Label className="text-base font-medium text-gray-700">Περιγραφή (προαιρετική)</Label>
                <Textarea 
                  placeholder="Προσθέστε περιγραφή για την παρτίδα προσκλήσεων..."
                  rows={3}
                  className="mt-2 bg-white border-gray-300"
                />
              </div>
              
              <div className="flex gap-3 pt-6 border-t bg-white">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Δημιουργία Παρτίδας</Button>
                <Button variant="outline" onClick={() => setShowCreateBatch(false)} className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">Ακύρωση</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Template Dialog */}
      {showCreateTemplate && (
        <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-white">
            <DialogHeader className="bg-white pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900">Δημιουργία Νέου Προτύπου Πρόσκλησης</DialogTitle>
              <DialogDescription className="text-gray-600">
                Δημιουργήστε ένα νέο πρότυπο πρόσκλησης για χρήση σε παρτίδες αποστολών
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name" className="text-base font-medium text-gray-700">Όνομα Προτύπου</Label>
                    <Input 
                      id="template-name" 
                      placeholder="π.χ. Πρότυπο Γεωργικής Έρευνας" 
                      className="mt-2 bg-white border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-base font-medium text-gray-700">Θέμα Email</Label>
                    <Input 
                      id="subject" 
                      placeholder="π.χ. Πρόσκληση συμμετοχής σε έρευνα - Υπουργείο Γεωργίας" 
                      className="mt-2 bg-white border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="questionnaire-select" className="text-base font-medium text-gray-700">Συσχετισμένο Ερωτηματολόγιο</Label>
                    <Select>
                      <SelectTrigger className="mt-2 bg-white border-gray-300">
                        <SelectValue placeholder="Επιλέξτε ερωτηματολόγιο" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {questionnaires.map(q => (
                          <SelectItem key={q.id} value={q.id} className="bg-white hover:bg-gray-50">{q.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium text-gray-700">Προεπισκόπηση</Label>
                    <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[200px]">
                      <div className="text-sm text-gray-600">
                        <p><strong>Από:</strong> noreply@agriculture.gov.cy</p>
                        <p><strong>Προς:</strong> recipient@example.com</p>
                        <p><strong>Θέμα:</strong> <span className="text-blue-600">Πρόσκληση συμμετοχής σε έρευνα</span></p>
                        <hr className="my-3 border-gray-300" />
                        <div className="bg-white p-3 rounded text-gray-800">
                          <p>Η προεπισκόπηση του email θα εμφανιστεί εδώ...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <Label htmlFor="content" className="text-base font-medium text-gray-700">Περιεχόμενο HTML Email</Label>
                <Textarea
                  id="content"
                  rows={12}
                  placeholder="<h2>Αγαπητέ Αγρότη,</h2>&#10;<p>Σας προσκαλούμε να συμμετάσχετε στην έρευνά μας για τη γεωργική παραγωγή της Κύπρου.</p>&#10;<p>Η συμμετοχή σας είναι εθελοντική και τα στοιχεία σας θα παραμείνουν εμπιστευτικά.</p>&#10;<p>Για να συμμετάσχετε, κάντε κλικ στον παρακάτω σύνδεσμο:</p>&#10;<a href='{{SURVEY_LINK}}' style='background-color: #004B87; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;'>Συμμετοχή στην Έρευνα</a>&#10;<p>Σας ευχαριστούμε για τον χρόνο σας!</p>&#10;<p>Με εκτίμηση,<br>Υπουργείο Γεωργίας, Αγροτικής Ανάπτυξης και Περιβάλλοντος</p>"
                  className="mt-2 bg-white border-gray-300 font-mono text-sm"
                />
                <div className="mt-2 text-sm text-gray-500">
                  <p><strong>Διαθέσιμες μεταβλητές:</strong></p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{RECIPIENT_NAME}}'}</code>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{SURVEY_LINK}}'}</code>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{SURVEY_TITLE}}'}</code>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{EXPIRY_DATE}}'}</code>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6 border-t bg-white">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Δημιουργία Προτύπου</Button>
                <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">Προεπισκόπηση</Button>
                <Button variant="outline" onClick={() => setShowCreateTemplate(false)} className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">Ακύρωση</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InvitationManagement;