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
  Filter,
  Delete
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { InvitationBatch, InvitationTemplate, Questionnaire, QuestionnaireService } from '@/services/questionnaireService';
import { Editor } from '@tinymce/tinymce-react';
import { Farm, SampleGroup } from '@/services/samplesService';
import { User, UsersService } from '@/services/usersService';



const InvitationManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('batches');
  const [users, setUsers] = useState<User[]>([]);
  const [batches, setBatches] = useState<InvitationBatch[]>([]);
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  
  const [selectedBatch, setSelectedBatch] = useState<InvitationBatch | null>(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate|null>(null);
  const [batchesSearchTerm, setBatchesSearchTerm] = useState('');
  const [templatesSearchTerm, setTemplatesSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionnaireSampleGroup, setQuestionnaireSampleGroups] = useState<SampleGroup[]>([]);
  const [questionnaireParticipants, setQuestionnaireParticipants] = useState<Farm[]>([]);

  // Mock data για demonstration
  useEffect(() => {
    const fetchData = async ()=> {
      setLoading(true);
      await Promise.all([
        fetchQuestionnaires(),
        fetchBatches(),
        fetchTemplates(),
        fetchUsers()
      ]);
      setLoading(false);
    }

    fetchData();
  }, []);

  const fetchQuestionnaires = async () => {
      var questionnaires = await QuestionnaireService.getQuestionnaires();
      setQuestionnaires(questionnaires.data);
  };

  const fetchBatches = async () => {
    var batches = await QuestionnaireService.getInvitationBatches();
    setBatches(batches.map(b=>{
      b.recipientFarmIds = JSON.parse(b.serializedFarmIds ?? '');
      return b;
    }));
  };

  const fetchTemplates = async ()=> {
    var templates = await QuestionnaireService.getInvitationTemplates();
    setTemplates(templates);
  }

  const fetchUsers = async () => {
    var users = await UsersService.getUsers();
    setUsers(users);
  };

  // Logo upload handlers for templates (same behavior as ThemesPage)
  const handleTemplateLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Παρακαλώ επιλέξτε ένα αρχείο εικόνας');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedTemplate((prev) => {
        if (!prev) return prev;
        return { ...prev, logoImageBase64: e.target?.result as string };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTemplateLogo = () => {
    setSelectedTemplate((prev) => (prev ? ({ ...prev, logoImageBase64: '' }) : prev));
  };

  const handleFarmSelection = (farmId: string, selected: boolean) => {
    const existingRecipientFarmIds = selectedBatch!.recipientFarmIds!;
    if (selected) {
      setSelectedBatch({...selectedBatch!, recipientFarmIds:[...existingRecipientFarmIds, farmId]});
    } else {
      setSelectedBatch({...selectedBatch!, recipientFarmIds:[...existingRecipientFarmIds.filter(id=>id!==farmId)]});
    }
  };


  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(batchesSearchTerm.toLowerCase()) ||
                        batch.templateName.toLowerCase().includes(batchesSearchTerm.toLowerCase()) ||
                         batch.questionnaireName.toLowerCase().includes(batchesSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(templatesSearchTerm.toLowerCase()) ||
                         template.questionnaireName.toLowerCase().includes(templatesSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const BatchAnalytics: React.FC<{ batch: InvitationBatch }> = ({ batch }) => {
    const deliveryData = [
      { name: 'Παραδόθηκαν', value: 0, color: '#22c55e' },
      { name: 'Απέτυχαν', value: 0, color: '#ef4444' },
      { name: 'Εκκρεμείς', value: (batch.recipientFarmIds??[]).length, color: '#f59e0b' }
    ];

    const engagementData = [
      { name: 'Δεν ξεκίνησαν', value: (batch.recipientFarmIds??[]).length, color: '#ef4444' },
      { name: 'Ξεκίνησαν', value: 0, color: '#06b6d4' },
      { name: 'Ολοκλήρωσαν', value: 0, color: '#10b981' }
    ];

    const timelineData = [
      { name: 'Εβδ. 1', sent: (batch.recipientFarmIds??[]).length, started: 0, completed: 0 },
      { name: 'Εβδ. 2', sent: 0, started: 0, completed: 0 },
      { name: 'Εβδ. 3', sent: 0, started: 0, completed: 0 },
      { name: 'Εβδ. 4', sent: 0, started: 0, completed: 0 }
    ];

    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600" title='Το ποσοστό των επιτυχώς απεσταλμένων προσκλήσεων προς το σύνολο των προσκλήσεων'>Ποσοστό Παράδοσης</p>
                  <p className="text-2xl font-bold text-red-600">0%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600" title='Το ποσοστό των εκκινημένων ερωτηματολογίων προς το σύνολο των προσκλήσεων'>Ποσοστό Συμμετοχής</p>
                  <p className="text-2xl font-bold text-red-600">0%</p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600" title='Το ποσοστό των οριστικά υποβληθέντων ερωτηματολογίων προς το σύνολο των προσκλήσεων'>Ποσοστό Ολοκλήρωσης</p>
                  <p className="text-2xl font-bold text-red-600">0%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Σύνολο Προσκλήσεων</p>
                  <p className="text-2xl font-bold text-gray-900">{(batch.recipientFarmIds??[]).length}</p>
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
                <YAxis min={0} max={10} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sent" stroke="#ef4444" name="Δεν ξεκίνησαν" />
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
                    <td className="text-right p-3">{(batch.recipientFarmIds??[]).length}</td>
                    <td className="text-right p-3">100%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Παραδόθηκαν</td>
                    <td className="text-right p-3">0</td>
                    <td className="text-right p-3">0%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Εκκρεμούν</td>
                    <td className="text-right p-3 text-red-600">{(batch.recipientFarmIds??[]).length}</td>
                    <td className="text-right p-3 text-red-600">100%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Απέτυχαν</td>
                    <td className="text-right p-3 text-red-600">0</td>
                    <td className="text-right p-3 text-red-600">0%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Ξεκίνησαν Ερωτηματολόγιο</td>
                    <td className="text-right p-3">0</td>
                    <td className="text-right p-3">0%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">Ολοκλήρωσαν Ερωτηματολόγιο</td>
                    <td className="text-right p-3 font-semibold text-green-600">0</td>
                    <td className="text-right p-3 font-semibold text-green-600">0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const dynamicVariables : Record<string, string> = {
    INTERVIEWEE_COMPANY: "Γεωργικές εκμεταλλεύσεις ΚΥΠΡΟΥ Α.Ε.",
    INTERVIEWEE_CODE: "CY2399",
    QUESTIONNAIRE_NAME: "Αξιολόγηση Γεωργικής πολιτικής 2024",
    SAMPLE_NAME: "Δείγμα Λάρνακας / μικρές εκμεταλλεύσεις",
    INTERVIEWER_NAME: "Γεώργιος Σοφιανός",
    INTERVIEWER_ORGANIZATION: "Υπουργείο Γεωργίας, Διεύθυνση Πληροφορικής"
  }

  // Generate HTML preview with dynamic variable substitution and logo
  const generateHtmlPreview = () => {
    let html = selectedTemplate?.htmlContent || '';
    
    // Replace dynamic variables with their values
    Object.entries(dynamicVariables).forEach(([key, value]) => {
      const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      html = html.replace(pattern, value);
    });

    // Insert logo at the top if present
    if (selectedTemplate?.logoImageBase64) {
      const logoAlignment = selectedTemplate.logoAlignment || 'left';
      const logoHtml = `<div style="text-align: ${logoAlignment}; margin-bottom: 20px;"><div style="display:inline-block;width:fit-content"><img src="${selectedTemplate.logoImageBase64}" alt="Logo" style="max-height: 100px; object-fit: contain;" /></div></div>`;
      html = logoHtml + html;
    }

    return html;
  }

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
                <Input
                  placeholder="Αναζήτηση παρτίδων..."
                  value={batchesSearchTerm}
                  onChange={(e) => setBatchesSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <Button onClick={() => {
              setQuestionnaireParticipants([]);
              setQuestionnaireSampleGroups([]);
              setSelectedBatch({recipientFarmIds:[]} as unknown as InvitationBatch);
              }} className="flex items-center gap-2">
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
                        </div>
                        <p className="text-gray-600 mb-2">{batch.questionnaireName}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Σύνολο εκμεταλλεύσεων στην πρόσκληση:</span>
                            <span className="ml-2 font-medium">{(batch.recipientFarmIds??[]).length}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-500">
                          {batch.scheduledAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Προγραμματισμένο: {batch.scheduledAt}
                            </div>
                          )}
                          {batch.sentAt && (
                            <div className="flex items-center gap-1">
                              <Send className="h-4 w-4" />
                              Στάλθηκε: {batch.sentAt}
                            </div>
                          )}
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
                        {!batch.sentAt && (
                          <Button
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Αποστολή τώρα
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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Αναζήτηση προτύπων..."
                  onChange={(e) => setTemplatesSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <Button onClick={() => setSelectedTemplate({} as InvitationTemplate)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Νέο Πρότυπο
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Φόρτωση...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Δεν βρέθηκαν πρότυπα</p>
                </CardContent>
              </Card>
            ) : filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>Ερωτηματολόγιο: {template.questionnaireName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Θέμα:</span>
                      <p className="text-sm text-gray-800">{template.subject}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={()=>setSelectedTemplate(template)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Επεξεργασία
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={async ()=>{
                      await QuestionnaireService.deleteInvitationTemplate(template.id);
                      fetchTemplates();
                    }}>
                      <Delete className="h-4 w-4 mr-2" />
                      Διαγραφή
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          }
          </div>
          
        </TabsContent>
      </Tabs>

      {/* Batch Preview Dialog */}
      {(selectedBatch && selectedBatch.id) && (
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
      {(selectedBatch && !selectedBatch.id) && (
        <Dialog open={selectedBatch} onOpenChange={()=>setSelectedBatch(null)}>
          <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl shadow-lg !max-w-[1400px]" style={{ width: 'min(1400px, 96vw)' }}>
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
                      value={selectedBatch.name}
                      onChange={(e)=>setSelectedBatch({...selectedBatch, name:e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="template" className="text-base font-medium text-gray-700">Πρότυπο Πρόσκλησης</Label>
                    <Select value={selectedBatch.templateId} onValueChange={async (newTemplateId:string)=>{
                        const newTemplate = templates.find(t=>t.id === newTemplateId);
                        const newQuestionnaireId = newTemplate?.questionnaireId!;
                        const farms = await QuestionnaireService.getQuestionnaireParticipants(newQuestionnaireId);
                        setQuestionnaireParticipants(farms);

                        const sampleGroups = await QuestionnaireService.getQuestionnaireSampleGroups(newQuestionnaireId);
                        setQuestionnaireSampleGroups(sampleGroups.map(sg=>{
                          sg.farmIds = JSON.parse(sg.serializedFarmIds!);
                          return sg;
                        }));
                        setSelectedBatch({...selectedBatch, templateId:newTemplateId});
                      }}>
                      <SelectTrigger className="mt-2 bg-white border-gray-300">
                        <SelectValue placeholder="Επιλέξτε πρότυπο" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {templates.map(t => (
                          <SelectItem key={t.id} value={t.id} className="bg-white hover:bg-gray-50">{t.name} (Ερωτηματολόγιο: {t.questionnaireName})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-date" className="text-base font-medium text-gray-700">Προγραμματισμός Αποστολής</Label>
                    <Input 
                      value={selectedBatch.scheduledAt}
                      onChange={(e)=>setSelectedBatch({...selectedBatch, scheduledAt:e.target.value})}
                      id="schedule-date" 
                      type="datetime-local" 
                      className="mt-2 bg-white border-gray-300"
                    />
                  </div>
                  
                </div>
              </div>

              {/* LIST OF SAMPLE GROUPS AND SUBLIST OF FARMS */}
              <div>
                {questionnaireSampleGroup.map(sg=>{
                  const user = users.find(u => u.id === sg.interviewerId);
                  return <div key={sg.id} style={{marginTop:10}}>
                    <div><strong>{sg.name} (Δείγμα: {sg.sampleName})</strong></div>
                    <div>Συνεντεύκτης: {user?.lastName} {user?.firstName}</div>
                    {sg.farmIds?.map(farmId => {
                      const farm = questionnaireParticipants.find(f=> f.id === farmId)!;
                          return <div
                              key={farm.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedBatch.recipientFarmIds!.includes(farm.id)
                                  ? 'bg-blue-50 border-blue-300'
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => handleFarmSelection(farm.id, !selectedBatch.recipientFarmIds!.includes(farm.id))}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedBatch.recipientFarmIds!.includes(farm.id)}
                                      onChange={(e) => handleFarmSelection(farm.id, e.target.checked)}
                                      className="h-4 w-4 text-blue-600 rounded"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="font-medium text-gray-900">{farm.farmCode}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1">{farm.ownerName}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                      {farm.province}
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                      {farm.farmType}
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                      {farm.sizeCategory}
                                    </span>
                                    {farm.economicSize && (
                                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                                        {farm.economicSize}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>;
                    })}
                    <hr/>
                  </div>;})}
              </div>
              
              <div className="flex gap-3 pt-6 border-t bg-white">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={selectedBatch.sentAt} onClick={async ()=>{
                  selectedBatch.serializedFarmIds = JSON.stringify(selectedBatch.recipientFarmIds);
                  await QuestionnaireService.createInvitationBatch(selectedBatch);
                  setSelectedBatch(null);
                  fetchBatches();
                }}>Αποθήκευση</Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={selectedBatch.sentAt} onClick={async ()=>{
                  selectedBatch.serializedFarmIds = JSON.stringify(selectedBatch.recipientFarmIds);
                  selectedBatch.sentAt = (new Date()).toISOString();
                  await QuestionnaireService.createInvitationBatch(selectedBatch);
                  setSelectedBatch(null);
                  fetchBatches();
                }}>Αποστολή τώρα</Button>
                <Button variant="outline" onClick={() => setSelectedBatch(null)} className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">Ακύρωση</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Template Dialog */}
      {selectedTemplate && (
        <Dialog open={selectedTemplate} onOpenChange={()=>setSelectedTemplate(null)}>
          <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl shadow-lg !max-w-[1400px]" style={{ width: 'min(1400px, 96vw)' }}>
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
                      value={selectedTemplate.name}
                      onChange={(e)=>setSelectedTemplate({...selectedTemplate, name:e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-base font-medium text-gray-700">Θέμα Email</Label>
                    <Input 
                      id="subject" 
                      placeholder="π.χ. Πρόσκληση συμμετοχής σε έρευνα - Υπουργείο Γεωργίας" 
                      className="mt-2 bg-white border-gray-300"
                      value={selectedTemplate.subject}
                      onChange={(e)=>setSelectedTemplate({...selectedTemplate, subject:e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="questionnaire-select" className="text-base font-medium text-gray-700">Συσχετισμένο Ερωτηματολόγιο</Label>
                    <Select value={selectedTemplate.questionnaireId} 
                      onValueChange={async (newQuestionnaireId:string) => {
                        setSelectedTemplate({...selectedTemplate, questionnaireId:newQuestionnaireId});
                      }}>
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

                  {/* Logo Upload (same control as ThemesPage.tsx) */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-gray-700">Λογότυπο</Label>
                    {selectedTemplate.logoImageBase64 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <img src={selectedTemplate.logoImageBase64} alt="logo preview" className="h-24 object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Επιλεγμένο λογότυπο</p>
                            <div className="mt-3 flex gap-2">
                              <Button variant="outline" onClick={handleRemoveTemplateLogo} className="gap-2">Αφαίρεση</Button>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleTemplateLogoUpload}
                                className="mt-0 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                        <p className="text-gray-600">Ανεβάστε λογότυπο (μέγιστο 2MB)</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleTemplateLogoUpload}
                          className="mt-2 cursor-pointer mx-auto"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="logo-alighment-select" className="text-base font-medium text-gray-700">Θέση λογότυπου</Label>
                    <Select value={selectedTemplate.logoAlignment}  name="logo-alighment-select"
                      onValueChange={(newLogoAlighment:string) => setSelectedTemplate({...selectedTemplate, logoAlignment:newLogoAlighment})}>
                      <SelectTrigger className="mt-2 bg-white border-gray-300">
                        <SelectValue placeholder="Επιλέξτε θέση" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem key={'left'} value={'left'} className="bg-white hover:bg-gray-50">Αριστερά</SelectItem>
                        <SelectItem key={'center'} value={'center'} className="bg-white hover:bg-gray-50">Κέντρο</SelectItem>
                        <SelectItem key={'right'} value={'right'} className="bg-white hover:bg-gray-50">Δεξιά</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium text-gray-700">Προεπισκόπηση HTML</Label>
                    <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[200px]">
                      <div className="text-sm text-gray-600">
                        <p><strong>Από:</strong> noreply@agriculture.gov.cy</p>
                        <p><strong>Προς:</strong> recipient@example.com</p>
                        <p><strong>Θέμα:</strong> {selectedTemplate.subject ?? 'Συμπληρώστε θέμα'}</p>
                        <hr className="my-3 border-gray-300" />
                        <div id="htmlPreview" className="bg-white p-3 rounded text-gray-800" dangerouslySetInnerHTML={{ __html: generateHtmlPreview() }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <Label className="text-base font-medium text-gray-700">HTML περιεχόμενο Email</Label>
                <Editor
                  apiKey="lxy6lg6tj8fzust6vr98ca9v3qqb8bubzjtykaf16bmzohhp"
                  
                  init={{
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | link image media | table',
                    height: 400,
                    menu: {
                      favs: { title: 'My Favorites', items: 'bold italic underline delimiters | outdent indent' }
                    },
                    menubar: 'file edit view insert format tools table help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                  value={selectedTemplate.htmlContent}
                  onEditorChange={(content) => setSelectedTemplate({...selectedTemplate, htmlContent: content})}
                />

                <Label htmlFor="plainTextContent" className="text-base font-medium text-gray-700">Plain text περιεχόμενο Email</Label>
                <Textarea
                  name="plainTextContent"
                  id="plainTextContent"
                  value={selectedTemplate.plainTextContent}
                  onChange={(e)=>setSelectedTemplate({...selectedTemplate, plainTextContent:e.target.value})}
                  rows={12}
                  placeholder="Συμπληρώστε απλό κείμενο"
                  className="mt-2 bg-white border-gray-300 font-mono text-sm"
                />
                <div className="mt-2 text-sm text-gray-500">
                  <p><strong>Διαθέσιμες μεταβλητές:</strong></p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                    {Object.keys(dynamicVariables).map(dv=> <code key={dv} className="bg-gray-100 px-2 py-1 rounded text-xs" title={'π.χ.: ' + dynamicVariables[dv]}>{'{{' + dv + '}}'}</code>)}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6 border-t bg-white">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={ async () => {
                  if (selectedTemplate.id) await QuestionnaireService.updateInvitationTemplate(selectedTemplate.id, selectedTemplate);
                  else await QuestionnaireService.createInvitationTemplate(selectedTemplate);
                  setSelectedTemplate(null);
                  fetchTemplates();
                }}>Αποθήκευση</Button>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">Ακύρωση</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InvitationManagementPage;