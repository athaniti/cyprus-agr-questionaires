import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { MoreHorizontal, Edit, Trash2, Copy, Plus, Search, MoreVertical, Eye, FileJson, Download } from 'lucide-react';
import { apiService, Questionnaire } from '../services/api';

interface QuestionnairesProps {
  language: 'el' | 'en';
  onCreateNew: () => void;
  onEditQuestionnaire: (id: string) => void;
  onViewQuestionnaire?: (id: string) => void;
}

const translations = {
  el: {
    title: 'Ερωτηματολόγια',
    description: 'Διαχείριση και δημιουργία ερωτηματολογίων',
    createNew: 'Δημιουργία Νέου',
    search: 'Αναζήτηση ερωτηματολογίων...',
    name: 'Όνομα',
    status: 'Κατάσταση',
    responses: 'Απαντήσεις',
    lastModified: 'Τελευταία Τροποποίηση',
    actions: 'Ενέργειες',
    active: 'Ενεργό',
    draft: 'Πρόχειρο',
    archived: 'Αρχειοθετημένο',
    completed: 'Ολοκληρωμένο',
    edit: 'Επεξεργασία',
    duplicate: 'Αντιγραφή',
    delete: 'Διαγραφή',
    view: 'Προβολή',
    export: 'Εξαγωγή',
    viewSchema: 'Προβολή Schema',
    close: 'Κλείσιμο',
    schemaTitle: 'Schema Ερωτηματολογίου',
    schemaDescription: 'JSON Schema του Ερωτηματολογίου'
  },
  en: {
    title: 'Questionnaires',
    description: 'Manage and create questionnaires',
    createNew: 'Create New',
    search: 'Search questionnaires...',
    name: 'Name',
    status: 'Status',
    responses: 'Responses',
    lastModified: 'Last Modified',
    actions: 'Actions',
    active: 'Active',
    draft: 'Draft',
    archived: 'Archived',
    completed: 'Completed',
    edit: 'Edit',
    duplicate: 'Duplicate',
    delete: 'Delete',
    view: 'View',
    export: 'Export',
    viewSchema: 'View Schema',
    close: 'Close',
    schemaTitle: 'Questionnaire Schema',
    schemaDescription: 'Form.io JSON Schema'
  }
};

const mockQuestionnaires = [
  { 
    id: '1', 
    name: 'Livestock Survey 2025', 
    status: 'active', 
    responses: 245, 
    target: 300,
    lastModified: '2025-10-08',
    category: 'Livestock'
  },
  { 
    id: '2', 
    name: 'Crop Production Assessment', 
    status: 'active', 
    responses: 312, 
    target: 400,
    lastModified: '2025-10-07',
    category: 'Crops'
  },
  { 
    id: '3', 
    name: 'Irrigation Systems Evaluation', 
    status: 'draft', 
    responses: 0, 
    target: 250,
    lastModified: '2025-10-06',
    category: 'Irrigation'
  },
  { 
    id: '4', 
    name: 'Equipment and Machinery Survey', 
    status: 'active', 
    responses: 167, 
    target: 200,
    lastModified: '2025-10-05',
    category: 'Equipment'
  },
  { 
    id: '5', 
    name: 'Organic Farming Practices', 
    status: 'completed', 
    responses: 450, 
    target: 450,
    lastModified: '2025-09-28',
    category: 'Crops'
  },
  { 
    id: '6', 
    name: 'Land Use Survey 2024', 
    status: 'archived', 
    responses: 890, 
    target: 900,
    lastModified: '2024-12-15',
    category: 'General'
  }
];

export function Questionnaires({ language, onCreateNew, onEditQuestionnaire, onViewQuestionnaire }: QuestionnairesProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [showSchemaDialog, setShowSchemaDialog] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<any>(null);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  React.useEffect(() => {
    const loadQuestionnaires = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to load from API
        const result = await apiService.getQuestionnaires();
        setQuestionnaires(result.data);
      } catch (error) {
        console.warn('API not available, using mock data:', error);
        
        // Fallback to mock data (no error state for better UX)
        const mockData = [
          {
            id: '1',
            name: 'Livestock Management Survey',
            category: 'Livestock',
            status: 'active',
            currentResponses: 25,
            targetResponses: 100,
            completionRate: 25,
            createdAt: '2025-10-20T10:00:00Z'
          },
          {
            id: '2', 
            name: 'Crop Production Assessment',
            category: 'Crops',
            status: 'draft',
            currentResponses: 0,
            targetResponses: 150,
            completionRate: 0,
            createdAt: '2025-10-19T15:30:00Z'
          },
          {
            id: '3',
            name: 'Irrigation Systems Evaluation',
            category: 'Irrigation',
            status: 'active',
            currentResponses: 75,
            targetResponses: 120,
            completionRate: 63,
            createdAt: '2025-10-18T09:15:00Z'
          },
          {
            id: '4',
            name: 'Equipment and Machinery Survey',
            category: 'Equipment',
            status: 'completed',
            currentResponses: 200,
            targetResponses: 200,
            completionRate: 100,
            createdAt: '2025-10-15T14:30:00Z'
          }
        ];
        setQuestionnaires(mockData);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionnaires();
  }, []);

  const filteredQuestionnaires = questionnaires.filter((q: any) =>
    q.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'draft':
        return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'completed':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'archived':
        return { backgroundColor: '#F3F4F6', color: '#374151' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const handleDuplicate = async (questionnaire: Questionnaire) => {
    try {
      const duplicatedQuestionnaire = await apiService.duplicateQuestionnaire(questionnaire.id);
      setQuestionnaires([...questionnaires, duplicatedQuestionnaire]);
      alert(language === 'el' ? 'Το ερωτηματολόγιο αντιγράφηκε!' : 'Questionnaire duplicated!');
    } catch (error) {
      console.error('Failed to duplicate questionnaire:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την αντιγραφή!' : 'Error duplicating questionnaire!');
    }
  };

  const handleDelete = async (questionnaire: Questionnaire) => {
    if (window.confirm(language === 'el' ? 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το ερωτηματολόγιο;' : 'Are you sure you want to delete this questionnaire?')) {
      try {
        await apiService.deleteQuestionnaire(questionnaire.id);
        setQuestionnaires(questionnaires.filter((q: any) => q.id !== questionnaire.id));
        alert(language === 'el' ? 'Το ερωτηματολόγιο διαγράφηκε!' : 'Questionnaire deleted!');
      } catch (error) {
        console.error('Failed to delete questionnaire:', error);
        alert(language === 'el' ? 'Σφάλμα κατά την διαγραφή!' : 'Error deleting questionnaire!');
      }
    }
  };

  const handleViewSchema = (questionnaire: any) => {
    // Mock schema for demonstration - in production, this would come from the questionnaire data
    const mockSchema = {
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'farmerName',
          label: language === 'el' ? 'Όνομα Αγρότη' : 'Farmer Name',
          placeholder: language === 'el' ? 'Εισάγετε όνομα' : 'Enter name',
          validate: { required: true }
        },
        {
          type: 'number',
          key: 'landSize',
          label: language === 'el' ? 'Μέγεθος Γης (στρέμματα)' : 'Land Size (acres)',
          validate: { required: true }
        },
        {
          type: 'select',
          key: 'cropType',
          label: language === 'el' ? 'Τύπος Καλλιέργειας' : 'Crop Type',
          data: {
            values: [
              { label: language === 'el' ? 'Σιτηρά' : 'Cereals', value: 'cereals' },
              { label: language === 'el' ? 'Λαχανικά' : 'Vegetables', value: 'vegetables' },
              { label: language === 'el' ? 'Φρούτα' : 'Fruits', value: 'fruits' }
            ]
          }
        }
      ]
    };
    setSelectedSchema(mockSchema);
    setShowSchemaDialog(true);
  };

  const handleExportSchema = () => {
    if (selectedSchema) {
      const dataStr = JSON.stringify(selectedSchema, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = 'questionnaire_schema.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">{t.title}</h2>
          <p className="text-gray-600">{t.description}</p>
        </div>
        <Button 
          onClick={onCreateNew}
          className="gap-2 rounded-xl text-white shadow-md"
          style={{ backgroundColor: '#004B87' }}
        >
          <Plus className="h-4 w-4" />
          {t.createNew}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="rounded-2xl border-none shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-gray-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="rounded-2xl border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading questionnaires...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="rounded-2xl border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Questionnaires Table */}
      {!loading && !error && (
      <Card className="rounded-2xl border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600">{t.name}</TableHead>
                <TableHead className="text-gray-600">{t.status}</TableHead>
                <TableHead className="text-gray-600">{t.responses}</TableHead>
                <TableHead className="text-gray-600">{t.lastModified}</TableHead>
                <TableHead className="text-gray-600 text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestionnaires.map((questionnaire: any) => (
                <TableRow key={questionnaire.id} className="border-b border-gray-100">
                  <TableCell>
                    <div>
                      <p className="text-gray-900">{questionnaire.name}</p>
                      <p className="text-xs text-gray-500">{questionnaire.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className="rounded-lg"
                      style={getStatusColor(questionnaire.status)}
                    >
                      {t[questionnaire.status as keyof typeof t]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">
                        {questionnaire.currentResponses} / {questionnaire.targetResponses}
                      </span>
                      <div className="w-24 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${questionnaire.completionRate}%`,
                            backgroundColor: '#0C9A8F'
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(questionnaire.createdAt).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditQuestionnaire(questionnaire.id)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          {t.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onViewQuestionnaire && onViewQuestionnaire(questionnaire.id)} 
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          {t.view}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewSchema(questionnaire)} className="gap-2">
                          <FileJson className="h-4 w-4" />
                          {t.viewSchema}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(questionnaire)} className="gap-2">
                          <Copy className="h-4 w-4" />
                          {t.duplicate}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4" />
                          {t.export}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(questionnaire)} className="gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          {t.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}

      {/* Schema Dialog */}
      <Dialog open={showSchemaDialog} onOpenChange={setShowSchemaDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t.schemaTitle}</DialogTitle>
            <DialogDescription>{t.schemaDescription}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSchema}
                className="gap-2 rounded-xl"
              >
                <Download className="h-4 w-4" />
                {t.export}
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl overflow-auto max-h-[500px]">
              <pre className="text-xs text-gray-800">
                {JSON.stringify(selectedSchema, null, 2)}
              </pre>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowSchemaDialog(false)} className="rounded-xl">
              {t.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
