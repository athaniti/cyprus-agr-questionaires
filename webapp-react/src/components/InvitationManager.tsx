import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Plus, Send, Edit, Trash2, Eye, BarChart3, Users, Mail, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  status: string;
}

interface InvitationTemplate {
  id: string;
  name: string;
  questionnaireId: string;
  questionnaire?: Questionnaire;
  subject: string;
  htmlContent: string;
  plainTextContent?: string;
  logoUrl?: string;
  logoPosition: 'left' | 'center' | 'right';
  bodyFontFamily: string;
  bodyFontSize: number;
  headerFontFamily: string;
  headerFontSize: number;
  availableVariables?: string[];
  createdAt: string;
  createdBy: string;
}

interface InvitationBatch {
  id: string;
  name: string;
  templateId: string;
  template?: InvitationTemplate;
  questionnaireId: string;
  questionnaire?: Questionnaire;
  scheduledSendTime?: string;
  immediateSend: boolean;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Failed' | 'Cancelled';
  totalInvitations: number;
  deliveredInvitations: number;
  failedInvitations: number;
  openedInvitations: number;
  clickedInvitations: number;
  startedResponses: number;
  completedResponses: number;
  participationRate: number;
  completionRate: number;
  deliveryRate: number;
  createdAt: string;
  sentAt?: string;
}

interface BatchAnalytics {
  batchId: string;
  totalInvitations: number;
  deliveryStats: {
    delivered: number;
    failed: number;
    pending: number;
    deliveryRate: number;
  };
  engagementStats: {
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  };
  responseStats: {
    started: number;
    completed: number;
    participationRate: number;
    completionRate: number;
  };
  timelineData: Array<{
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    started: number;
    completed: number;
  }>;
}

const InvitationManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [batches, setBatches] = useState<InvitationBatch[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate | null>(null);
  const [selectedBatch, setBSelectedBatch] = useState<InvitationBatch | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [batchAnalytics, setBatchAnalytics] = useState<BatchAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    plainTextContent: '',
    logoUrl: '',
    logoPosition: 'center' as 'left' | 'center' | 'right',
    bodyFontFamily: 'Arial, sans-serif',
    bodyFontSize: 14,
    headerFontFamily: 'Arial, sans-serif',
    headerFontSize: 18,
    availableVariables: ['{{name}}', '{{email}}', '{{questionnaire_title}}', '{{survey_link}}']
  });

  // Batch form state
  const [batchForm, setBatchForm] = useState({
    name: '',
    templateId: '',
    scheduledSendTime: undefined as Date | undefined,
    immediateSend: false,
    recipients: [] as string[],
    recipientText: ''
  });

  useEffect(() => {
    loadQuestionnaires();
    loadTemplates();
    loadBatches();
  }, []);

  useEffect(() => {
    if (selectedQuestionnaire) {
      loadTemplates(selectedQuestionnaire);
      loadBatches(selectedQuestionnaire);
    }
  }, [selectedQuestionnaire]);

  const loadQuestionnaires = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/questionnaires');
      const data = await response.json();
      setQuestionnaires(data.data || data);
    } catch (error) {
      console.error('Error loading questionnaires:', error);
    }
  };

  const loadTemplates = async (questionnaireId?: string) => {
    try {
      // TODO: Temporarily disabled until backend issue is resolved
      console.log('Templates endpoint temporarily disabled');
      setTemplates([]);
      return;
      
      const url = questionnaireId 
        ? `http://localhost:5050/api/invitations/templates?questionnaireId=${questionnaireId}`
        : 'http://localhost:5050/api/invitations/templates';
      const response = await fetch(url);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    }
  };

  const loadBatches = async (questionnaireId?: string) => {
    try {
      // TODO: Temporarily disabled until backend issue is resolved
      console.log('Batches endpoint temporarily disabled');
      setBatches([]);
      return;
      
      const url = questionnaireId 
        ? `http://localhost:5050/api/invitations/batches?questionnaireId=${questionnaireId}`
        : 'http://localhost:5050/api/invitations/batches';
      const response = await fetch(url);
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Error loading batches:', error);
      setBatches([]);
    }
  };

  const loadBatchAnalytics = async (batchId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5050/api/invitations/batches/${batchId}/analytics`);
      const data = await response.json();
      setBatchAnalytics(data);
      setShowAnalyticsDialog(true);
    } catch (error) {
      console.error('Error loading batch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!selectedQuestionnaire) {
      alert('Παρακαλώ επιλέξτε ερωτηματολόγιο');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5050/api/invitations/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...templateForm,
          questionnaireId: selectedQuestionnaire,
          createdBy: '00000000-0000-0000-0000-000000000001' // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        setShowTemplateDialog(false);
        resetTemplateForm();
        loadTemplates(selectedQuestionnaire);
      } else {
        const error = await response.json();
        alert(error.message || 'Σφάλμα κατά τη δημιουργία του προτύπου');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Σφάλμα κατά τη δημιουργία του προτύπου');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    if (!batchForm.templateId || !selectedQuestionnaire) {
      alert('Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία');
      return;
    }

    try {
      setLoading(true);
      const recipients = batchForm.recipientText
        .split('\n')
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));

      const response = await fetch('http://localhost:5050/api/invitations/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...batchForm,
          questionnaireId: selectedQuestionnaire,
          recipients,
          sampleId: '00000000-0000-0000-0000-000000000001', // TODO: Allow sample selection
          createdBy: '00000000-0000-0000-0000-000000000001' // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        setShowBatchDialog(false);
        resetBatchForm();
        loadBatches(selectedQuestionnaire);
      } else {
        const error = await response.json();
        alert(error.message || 'Σφάλμα κατά τη δημιουργία της παρτίδας');
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      alert('Σφάλμα κατά τη δημιουργία της παρτίδας');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBatch = async (batchId: string) => {
    if (!confirm('Είστε βέβαιοι ότι θέλετε να στείλετε αυτήν την παρτίδα προσκλήσεων;')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5050/api/invitations/batches/${batchId}/send`, {
        method: 'POST',
      });

      if (response.ok) {
        loadBatches(selectedQuestionnaire);
        alert('Η παρτίδα προσκλήσεων στάλθηκε επιτυχώς!');
      } else {
        const error = await response.json();
        alert(error.message || 'Σφάλμα κατά την αποστολή της παρτίδας');
      }
    } catch (error) {
      console.error('Error sending batch:', error);
      alert('Σφάλμα κατά την αποστολή της παρτίδας');
    } finally {
      setLoading(false);
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      subject: '',
      htmlContent: '',
      plainTextContent: '',
      logoUrl: '',
      logoPosition: 'center',
      bodyFontFamily: 'Arial, sans-serif',
      bodyFontSize: 14,
      headerFontFamily: 'Arial, sans-serif',
      headerFontSize: 18,
      availableVariables: ['{{name}}', '{{email}}', '{{questionnaire_title}}', '{{survey_link}}']
    });
    setSelectedTemplate(null);
  };

  const resetBatchForm = () => {
    setBatchForm({
      name: '',
      templateId: '',
      scheduledSendTime: undefined,
      immediateSend: false,
      recipients: [],
      recipientText: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Draft': { variant: 'secondary' as const, label: 'Πρόχειρο' },
      'Scheduled': { variant: 'default' as const, label: 'Προγραμματισμένο' },
      'Sending': { variant: 'default' as const, label: 'Στέλνεται' },
      'Sent': { variant: 'default' as const, label: 'Στάλθηκε' },
      'Failed': { variant: 'destructive' as const, label: 'Αποτυχία' },
      'Cancelled': { variant: 'secondary' as const, label: 'Ακυρώθηκε' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Διαχείριση Προσκλήσεων</h1>
          <p className="text-gray-600 mt-2">Δημιουργία και διαχείριση προτύπων και παρτίδων προσκλήσεων</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedQuestionnaire} onValueChange={setSelectedQuestionnaire}>
            <SelectTrigger className="w-64 rounded-xl">
              <SelectValue placeholder="Επιλέξτε ερωτηματολόγιο" />
            </SelectTrigger>
            <SelectContent>
              {questionnaires.map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="templates" className="rounded-xl">Πρότυπα Προσκλήσεων</TabsTrigger>
          <TabsTrigger value="batches" className="rounded-xl">Παρτίδες Προσκλήσεων</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Πρότυπα Προσκλήσεων</h2>
              <p className="text-gray-600 mt-1">Δημιουργήστε και διαχειριστείτε πρότυπα email για προσκλήσεις</p>
            </div>
            <Button 
              onClick={() => setShowTemplateDialog(true)} 
              disabled={!selectedQuestionnaire}
              className="gap-2 rounded-xl text-white shadow-md"
              style={{ backgroundColor: '#004B87' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Νέο Πρότυπο
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="rounded-2xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{template.name}</CardTitle>
                  <CardDescription className="text-gray-600">{template.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Γραμματοσειρά: {template.bodyFontFamily}</div>
                    <div>Λογότυπο: {template.logoPosition === 'center' ? 'Κέντρο' : template.logoPosition === 'left' ? 'Αριστερά' : 'Δεξιά'}</div>
                    <div>Δημιουργήθηκε: {format(new Date(template.createdAt), 'dd/MM/yyyy', { locale: el })}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" variant="outline" className="rounded-lg" onClick={() => {
                      setSelectedTemplate(template);
                      setTemplateForm({
                        name: template.name,
                        subject: template.subject,
                        htmlContent: template.htmlContent,
                        plainTextContent: template.plainTextContent || '',
                        logoUrl: template.logoUrl || '',
                        logoPosition: template.logoPosition,
                        bodyFontFamily: template.bodyFontFamily,
                        bodyFontSize: template.bodyFontSize,
                        headerFontFamily: template.headerFontFamily,
                        headerFontSize: template.headerFontSize,
                        availableVariables: template.availableVariables || []
                      });
                      setShowTemplateDialog(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Παρτίδες Προσκλήσεων</h2>
              <p className="text-gray-600 mt-1">Δημιουργήστε και διαχειριστείτε παρτίδες αποστολής προσκλήσεων</p>
            </div>
            <Button 
              onClick={() => setShowBatchDialog(true)} 
              disabled={!selectedQuestionnaire || templates.length === 0}
              className="gap-2 rounded-xl text-white shadow-md"
              style={{ backgroundColor: '#004B87' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Νέα Παρτίδα
            </Button>
          </div>

          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600">Όνομα</TableHead>
                    <TableHead className="text-gray-600">Κατάσταση</TableHead>
                    <TableHead className="text-gray-600">Σύνολο</TableHead>
                    <TableHead className="text-gray-600">Παραδόθηκαν</TableHead>
                    <TableHead className="text-gray-600">Συμμετοχή</TableHead>
                    <TableHead className="text-gray-600">Ολοκλήρωση</TableHead>
                    <TableHead className="text-gray-600">Ημερομηνία</TableHead>
                    <TableHead className="text-gray-600">Ενέργειες</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.name}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          {batch.totalInvitations}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-green-500" />
                          {batch.deliveredInvitations}
                          {batch.failedInvitations > 0 && (
                            <span className="text-red-500">(-{batch.failedInvitations})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          {batch.startedResponses} ({batch.participationRate.toFixed(1)}%)
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {batch.completedResponses} ({batch.completionRate.toFixed(1)}%)
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {batch.sentAt 
                            ? format(new Date(batch.sentAt), 'dd/MM/yyyy HH:mm', { locale: el })
                            : format(new Date(batch.createdAt), 'dd/MM/yyyy', { locale: el })
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {batch.status === 'Draft' && (
                            <Button 
                              size="sm" 
                              className="rounded-lg"
                              style={{ backgroundColor: '#0C9A8F' }}
                              onClick={() => handleSendBatch(batch.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="rounded-lg" onClick={() => loadBatchAnalytics(batch.id)}>
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'Επεξεργασία Προτύπου' : 'Νέο Πρότυπο Πρόσκλησης'}
            </DialogTitle>
            <DialogDescription>
              Δημιουργήστε ή επεξεργαστείτε ένα πρότυπο πρόσκλησης για το επιλεγμένο ερωτηματολόγιο.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Όνομα Προτύπου</Label>
                <Input
                  id="template-name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="π.χ. Πρόσκληση για Έρευνα Καλλιεργειών"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-subject">Θέμα Email</Label>
                <Input
                  id="template-subject"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                  placeholder="π.χ. Πρόσκληση συμμετοχής στην έρευνα"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-content">Περιεχόμενο HTML</Label>
              <Textarea
                id="template-content"
                value={templateForm.htmlContent}
                onChange={(e) => setTemplateForm({ ...templateForm, htmlContent: e.target.value })}
                placeholder="Περιεχόμενο του email σε HTML..."
                rows={10}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo-url">URL Λογότυπου</Label>
                <Input
                  id="logo-url"
                  value={templateForm.logoUrl}
                  onChange={(e) => setTemplateForm({ ...templateForm, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Θέση Λογότυπου</Label>
                <Select 
                  value={templateForm.logoPosition} 
                  onValueChange={(value: 'left' | 'center' | 'right') => 
                    setTemplateForm({ ...templateForm, logoPosition: value })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Αριστερά</SelectItem>
                    <SelectItem value="center">Κέντρο</SelectItem>
                    <SelectItem value="right">Δεξιά</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Γραμματοσειρά Κειμένου</Label>
                <Select 
                  value={templateForm.bodyFontFamily} 
                  onValueChange={(value: string) => setTemplateForm({ ...templateForm, bodyFontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                    <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Μέγεθος Κειμένου</Label>
                <Input
                  type="number"
                  value={templateForm.bodyFontSize}
                  onChange={(e) => setTemplateForm({ ...templateForm, bodyFontSize: parseInt(e.target.value) || 14 })}
                  min="8"
                  max="24"
                />
              </div>
              <div className="space-y-2">
                <Label>Γραμματοσειρά Τίτλων</Label>
                <Select 
                  value={templateForm.headerFontFamily} 
                  onValueChange={(value: string) => setTemplateForm({ ...templateForm, headerFontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                    <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Μέγεθος Τίτλων</Label>
                <Input
                  type="number"
                  value={templateForm.headerFontSize}
                  onChange={(e) => setTemplateForm({ ...templateForm, headerFontSize: parseInt(e.target.value) || 18 })}
                  min="12"
                  max="32"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Διαθέσιμες Μεταβλητές</Label>
              <div className="flex flex-wrap gap-2">
                {templateForm.availableVariables.map((variable, index) => (
                  <Badge key={index} variant="outline">{variable}</Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Χρησιμοποιήστε αυτές τις μεταβλητές στο περιεχόμενο του email για εξατομίκευση.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setShowTemplateDialog(false)}>
              Ακύρωση
            </Button>
            <Button 
              onClick={handleCreateTemplate} 
              disabled={loading}
              className="rounded-xl text-white"
              style={{ backgroundColor: '#004B87' }}
            >
              {loading ? 'Αποθήκευση...' : (selectedTemplate ? 'Ενημέρωση' : 'Δημιουργία')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Dialog */}
      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Νέα Παρτίδα Προσκλήσεων</DialogTitle>
            <DialogDescription>
              Δημιουργήστε μια νέα παρτίδα προσκλήσεων για αποστολή.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batch-name">Όνομα Παρτίδας</Label>
              <Input
                id="batch-name"
                value={batchForm.name}
                onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                placeholder="π.χ. Παρτίδα Νοεμβρίου 2024"
              />
            </div>

            <div className="space-y-2">
              <Label>Πρότυπο Πρόσκλησης</Label>
              <Select value={batchForm.templateId} onValueChange={(value: string) => setBatchForm({ ...batchForm, templateId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε πρότυπο" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Παραλήπτες (ένα email ανά γραμμή)</Label>
              <Textarea
                id="recipients"
                value={batchForm.recipientText}
                onChange={(e) => setBatchForm({ ...batchForm, recipientText: e.target.value })}
                placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="immediate-send"
                checked={batchForm.immediateSend}
                onChange={(e) => setBatchForm({ ...batchForm, immediateSend: e.target.checked })}
              />
              <Label htmlFor="immediate-send">Άμεση αποστολή</Label>
            </div>

            {!batchForm.immediateSend && (
              <div className="space-y-2">
                <Label>Προγραμματισμένη ημερομηνία/ώρα αποστολής</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {batchForm.scheduledSendTime ? 
                        format(batchForm.scheduledSendTime, 'dd/MM/yyyy HH:mm', { locale: el }) : 
                        'Επιλέξτε ημερομηνία και ώρα'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={batchForm.scheduledSendTime}
                      onSelect={(date: Date | undefined) => setBatchForm({ ...batchForm, scheduledSendTime: date })}
                      disabled={(date: Date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setShowBatchDialog(false)}>
              Ακύρωση
            </Button>
            <Button 
              onClick={handleCreateBatch} 
              disabled={loading}
              className="rounded-xl text-white"
              style={{ backgroundColor: '#004B87' }}
            >
              {loading ? 'Δημιουργία...' : 'Δημιουργία Παρτίδας'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Αναλυτικά Στοιχεία Παρτίδας</DialogTitle>
            <DialogDescription>
              Λεπτομερή στατιστικά και γραφήματα για την παρτίδα προσκλήσεων.
            </DialogDescription>
          </DialogHeader>
          
          {batchAnalytics && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Σύνολο Προσκλήσεων</p>
                        <p className="text-2xl font-bold text-gray-900">{batchAnalytics.totalInvitations}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Παραδόθηκαν</p>
                        <p className="text-2xl font-bold text-gray-900">{batchAnalytics.deliveryStats.delivered}</p>
                        <p className="text-sm text-green-600">{batchAnalytics.deliveryStats.deliveryRate.toFixed(1)}%</p>
                      </div>
                      <Mail className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Άνοιξαν</p>
                        <p className="text-2xl font-bold text-gray-900">{batchAnalytics.engagementStats.opened}</p>
                        <p className="text-sm text-blue-600">{batchAnalytics.engagementStats.openRate.toFixed(1)}%</p>
                      </div>
                      <Eye className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ολοκλήρωσαν</p>
                        <p className="text-2xl font-bold text-gray-900">{batchAnalytics.responseStats.completed}</p>
                        <p className="text-sm text-green-600">{batchAnalytics.responseStats.completionRate.toFixed(1)}%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Statistics Tables */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-2xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Στατιστικά Παράδοσης</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Παραδόθηκαν:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.deliveryStats.delivered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Αποτυχίες:</span>
                        <span className="font-semibold text-red-600">{batchAnalytics.deliveryStats.failed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Εκκρεμείς:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.deliveryStats.pending}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Ποσοστό Παράδοσης:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.deliveryStats.deliveryRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Στατιστικά Αλληλεπίδρασης</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Άνοιξαν:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.engagementStats.opened}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Κλικ:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.engagementStats.clicked}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Ποσοστό Ανοίγματος:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.engagementStats.openRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ποσοστό Κλικ:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.engagementStats.clickRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Στατιστικά Απαντήσεων</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ξεκίνησαν:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.responseStats.started}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ολοκλήρωσαν:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.responseStats.completed}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Ποσοστό Συμμετοχής:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.responseStats.participationRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ποσοστό Ολοκλήρωσης:</span>
                        <span className="font-semibold text-gray-900">{batchAnalytics.responseStats.completionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline Data */}
              {batchAnalytics.timelineData.length > 0 && (
                <Card className="rounded-2xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Χρονολογική Εξέλιξη</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-600">Ημερομηνία</TableHead>
                          <TableHead className="text-gray-600">Στάλθηκαν</TableHead>
                          <TableHead className="text-gray-600">Παραδόθηκαν</TableHead>
                          <TableHead className="text-gray-600">Άνοιξαν</TableHead>
                          <TableHead className="text-gray-600">Κλικ</TableHead>
                          <TableHead className="text-gray-600">Ξεκίνησαν</TableHead>
                          <TableHead className="text-gray-600">Ολοκλήρωσαν</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchAnalytics.timelineData.map((dataPoint, index) => (
                          <TableRow key={index}>
                            <TableCell>{format(new Date(dataPoint.date), 'dd/MM/yyyy', { locale: el })}</TableCell>
                            <TableCell>{dataPoint.sent}</TableCell>
                            <TableCell>{dataPoint.delivered}</TableCell>
                            <TableCell>{dataPoint.opened}</TableCell>
                            <TableCell>{dataPoint.clicked}</TableCell>
                            <TableCell>{dataPoint.started}</TableCell>
                            <TableCell>{dataPoint.completed}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              onClick={() => setShowAnalyticsDialog(false)}
              className="rounded-xl text-white"
              style={{ backgroundColor: '#004B87' }}
            >
              Κλείσιμο
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvitationManager;