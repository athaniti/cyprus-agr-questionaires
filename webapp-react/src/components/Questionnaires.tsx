import { useState } from 'react';
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
import { Plus, Search, MoreVertical, Edit, Copy, Trash2, Eye, Download } from 'lucide-react';

interface QuestionnairesProps {
  language: 'el' | 'en';
  onCreateNew: () => void;
  onEditQuestionnaire: (id: string) => void;
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
    export: 'Εξαγωγή'
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
    export: 'Export'
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

export function Questionnaires({ language, onCreateNew, onEditQuestionnaire }: QuestionnairesProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestionnaires = mockQuestionnaires.filter(q =>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-gray-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Questionnaires Table */}
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
              {filteredQuestionnaires.map((questionnaire) => (
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
                        {questionnaire.responses} / {questionnaire.target}
                      </span>
                      <div className="w-24 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(questionnaire.responses / questionnaire.target) * 100}%`,
                            backgroundColor: '#0C9A8F'
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(questionnaire.lastModified).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')}
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
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          {t.view}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Copy className="h-4 w-4" />
                          {t.duplicate}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4" />
                          {t.export}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
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
    </div>
  );
}
