import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Type,
  ListChecks,
  Calendar,
  Hash,
  FileText,
  Image as ImageIcon,
  Table as TableIcon,
  Save,
  Eye,
  Upload,
  FileJson,
  Mail,
  Phone,
  CheckSquare,
  Circle
} from 'lucide-react';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TableBuilder } from './TableBuilder';
import { apiService } from '../services/api';

interface QuestionnaireBuilderProps {
  language: 'el' | 'en';
  onBack: () => void;
}

interface Question {
  id: string;
  type: string;
  text: string;
  textEn?: string;
  required: boolean;
  options: string[];
  placeholder?: string;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditional?: {
    show: boolean;
    when: string;
    eq: string;
  };
  drillDown?: {
    sourceQuestionId: string;
    optionsMapping: Record<string, string[]>;
  };
  collapsed?: boolean;
  tableConfig?: {
    id: string;
    name: string;
    nameEn?: string;
    description?: string;
    columns: Array<{
      id: string;
      name: string;
      nameEn?: string;
      type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox';
      required: boolean;
      options?: string[];
      validation?: {
        min?: number;
        max?: number;
        pattern?: string;
      };
      code?: string;
      category?: string;
    }>;
    minRows?: number;
    maxRows?: number;
    allowAddRows: boolean;
    allowDeleteRows: boolean;
  };
}

const translations = {
  el: {
    title: 'Δημιουργία Ερωτηματολογίου',
    subtitle: 'Σχεδιάστε το ερωτηματολόγιό σας',
    basicInfo: 'Βασικές Πληροφορίες',
    questionnaireName: 'Όνομα Ερωτηματολογίου',
    description: 'Περιγραφή',
    category: 'Κατηγορία',
    selectCategory: 'Επιλέξτε κατηγορία',
    livestock: 'Κτηνοτροφία',
    crops: 'Καλλιέργειες',
    irrigation: 'Άρδευση',
    equipment: 'Εξοπλισμός',
    general: 'Γενικά',
    questions: 'Ερωτήσεις',
    addQuestion: 'Προσθήκη Ερώτησης',
    questionTypes: 'Τύποι Ερωτήσεων',
    shortText: 'Σύντομο Κείμενο',
    longText: 'Μακρύ Κείμενο',
    number: 'Αριθμός',
    email: 'Email',
    phone: 'Τηλέφωνο',
    date: 'Ημερομηνία',
    multipleChoice: 'Πολλαπλή Επιλογή',
    checkbox: 'Πλαίσια Επιλογής',
    dropdown: 'Λίστα Επιλογής',
    table: 'Πίνακας',
    fileUpload: 'Μεταφόρτωση Αρχείου',
    questionText: 'Κείμενο Ερώτησης',
    questionTextEn: 'Κείμενο Ερώτησης (EN)',
    placeholder: 'Κείμενο Υπόδειξης',
    questionDescription: 'Περιγραφή',
    required: 'Υποχρεωτική',
    option: 'Επιλογή',
    addOption: 'Προσθήκη Επιλογής',
    settings: 'Ρυθμίσεις',
    validation: 'Επικύρωση',
    conditional: 'Υπό Συνθήκη',
    minValue: 'Ελάχιστη Τιμή',
    maxValue: 'Μέγιστη Τιμή',
    tableSettings: 'Ρυθμίσεις Πίνακα',
    configureTable: 'Διαμόρφωση Πίνακα',
    drillDown: 'Εξαρτημένες Επιλογές',
    sourceQuestion: 'Πηγή Ερώτηση',
    dependsOn: 'Εξαρτάται από',
    expandAll: 'Ανάπτυξη Όλων',
    collapseAll: 'Σύμπτυξη Όλων',
    expand: 'Ανάπτυξη',
    collapse: 'Σύμπτυξη',
    saveDraft: 'Αποθήκευση Προχείρου',
    preview: 'Προεπισκόπηση',
    publish: 'Δημοσίευση',
    back: 'Πίσω',
    previewTitle: 'Προεπισκόπηση Ερωτηματολογίου',
    previewDescription: 'Δείτε πώς θα εμφανίζεται το ερωτηματολόγιο',
    close: 'Κλείσιμο',
    exportSchema: 'Εξαγωγή Schema',
    importSchema: 'Εισαγωγή Schema',
    namePlaceholder: 'π.χ. Έρευνα Κτηνοτροφίας 2025',
    descriptionPlaceholder: 'Περιγράψτε τον σκοπό του ερωτηματολογίου...',
    noQuestions: 'Δεν υπάρχουν ερωτήσεις ακόμα',
    addFirstQuestion: 'Προσθέστε την πρώτη σας ερώτηση από τη δεξιά πλευρά',
    question: 'Ερώτηση',
  },
  en: {
    title: 'Create Questionnaire',
    subtitle: 'Design your questionnaire',
    basicInfo: 'Basic Information',
    questionnaireName: 'Questionnaire Name',
    description: 'Description',
    category: 'Category',
    selectCategory: 'Select category',
    livestock: 'Livestock',
    crops: 'Crops',
    irrigation: 'Irrigation',
    equipment: 'Equipment',
    general: 'General',
    questions: 'Questions',
    addQuestion: 'Add Question',
    questionTypes: 'Question Types',
    shortText: 'Short Text',
    longText: 'Long Text',
    number: 'Number',
    email: 'Email',
    phone: 'Phone',
    date: 'Date',
    multipleChoice: 'Multiple Choice',
    checkbox: 'Checkboxes',
    dropdown: 'Dropdown',
    table: 'Table',
    fileUpload: 'File Upload',
    questionText: 'Question Text',
    questionTextEn: 'Question Text (EN)',
    placeholder: 'Placeholder',
    questionDescription: 'Description',
    required: 'Required',
    option: 'Option',
    addOption: 'Add Option',
    settings: 'Settings',
    validation: 'Validation',
    conditional: 'Conditional',
    minValue: 'Minimum Value',
    maxValue: 'Maximum Value',
    tableSettings: 'Table Settings',
    configureTable: 'Configure Table',
    drillDown: 'Dependent Options',
    sourceQuestion: 'Source Question',
    dependsOn: 'Depends on',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    expand: 'Expand',
    collapse: 'Collapse',
    saveDraft: 'Save Draft',
    preview: 'Preview',
    publish: 'Publish',
    back: 'Back',
    previewTitle: 'Questionnaire Preview',
    previewDescription: 'See how the questionnaire will appear',
    close: 'Close',
    exportSchema: 'Export Schema',
    importSchema: 'Import Schema',
    namePlaceholder: 'e.g. Livestock Survey 2025',
    descriptionPlaceholder: 'Describe the purpose of the questionnaire...',
    noQuestions: 'No questions yet',
    addFirstQuestion: 'Add your first question from the right panel',
    question: 'Question',
  }
};

const questionTypeIcons: Record<string, any> = {
  shortText: Type,
  longText: FileText,
  number: Hash,
  email: Mail,
  phone: Phone,
  date: Calendar,
  multipleChoice: Circle,
  checkbox: CheckSquare,
  dropdown: ListChecks,
  table: TableIcon,
  fileUpload: Upload,
};

export function QuestionnaireBuilder({ language, onBack }: QuestionnaireBuilderProps) {
  const t = translations[language];
  const [questionnaireName, setQuestionnaireName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  // Expand/Collapse functionality
  const toggleQuestionCollapse = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, collapsed: !q.collapsed } : q
    ));
  };

  const expandAllQuestions = () => {
    setQuestions(questions.map(q => ({ ...q, collapsed: false })));
  };

  const collapseAllQuestions = () => {
    setQuestions(questions.map(q => ({ ...q, collapsed: true })));
  };

  // Drill down functionality
  const getAvailableSourceQuestions = () => {
    return questions.filter(q => 
      ['multipleChoice', 'dropdown', 'select'].includes(q.type) && 
      q.options.length > 0
    );
  };

  const getDrillDownOptions = (sourceQuestionId: string, sourceValue: string) => {
    const question = questions.find(q => q.id === sourceQuestionId);
    return question?.drillDown?.optionsMapping[sourceValue] || [];
  };

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      text: '',
      required: false,
      options: ['multipleChoice', 'checkbox', 'dropdown'].includes(type) ? ['', ''] : [],
    };
    
    // Initialize table config for table type
    if (type === 'table') {
      newQuestion.tableConfig = {
        id: `table-${Date.now()}`,
        name: '',
        nameEn: '',
        description: '',
        columns: [],
        minRows: 1,
        maxRows: 10,
        allowAddRows: true,
        allowDeleteRows: true,
      };
    }
    
    setQuestions([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      const newQuestion = {
        ...question,
        id: `q-${Date.now()}`,
        text: question.text + ' (Copy)'
      };
      setQuestions([...questions, newQuestion]);
    }
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 1) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleExportSchema = () => {
    const schema = {
      name: questionnaireName,
      description,
      category,
      questions,
      createdAt: new Date().toISOString()
    };
    const dataStr = JSON.stringify(schema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${questionnaireName || 'questionnaire'}_schema.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const schema = JSON.parse(e.target?.result as string);
          setQuestionnaireName(schema.name || '');
          setDescription(schema.description || '');
          setCategory(schema.category || '');
          setQuestions(schema.questions || []);
          alert(language === 'el' ? 'Το schema εισήχθη επιτυχώς!' : 'Schema imported successfully!');
        } catch (error) {
          alert(language === 'el' ? 'Σφάλμα κατά την εισαγωγή του schema' : 'Error importing schema');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const schema = JSON.stringify({
        display: 'form',
        components: questions.map(q => ({
          type: q.type,
          key: q.id,
          label: q.text,
          placeholder: q.placeholder,
          description: q.description,
          validate: { required: q.required },
          options: q.options?.map(opt => ({ label: opt, value: opt })),
          conditional: q.conditional,
          drillDown: q.drillDown,
          tableConfig: q.tableConfig
        }))
      });

      await apiService.createQuestionnaire({
        name: questionnaireName,
        description: description,
        category: category,
        schema: schema,
        targetResponses: 100, // Default target
        createdBy: 'current-user-id' // Should come from auth context
      });

      alert(language === 'el' ? 'Το ερωτηματολόγιο αποθηκεύτηκε ως πρόχειρο!' : 'Questionnaire saved as draft!');
    } catch (error) {
      console.error('Failed to save questionnaire:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την αποθήκευση!' : 'Error saving questionnaire!');
    }
  };

  const handlePublish = async () => {
    if (!questionnaireName || questions.length === 0) {
      alert(language === 'el' 
        ? 'Παρακαλώ συμπληρώστε το όνομα και προσθέστε τουλάχιστον μία ερώτηση' 
        : 'Please fill in the name and add at least one question');
      return;
    }

    try {
      const schema = JSON.stringify({
        display: 'form',
        components: questions.map(q => ({
          type: q.type,
          key: q.id,
          label: q.text,
          placeholder: q.placeholder,
          description: q.description,
          validate: { required: q.required },
          options: q.options?.map(opt => ({ label: opt, value: opt })),
          conditional: q.conditional,
          drillDown: q.drillDown,
          tableConfig: q.tableConfig
        }))
      });

      const newQuestionnaire = await apiService.createQuestionnaire({
        name: questionnaireName,
        description: description,
        category: category,
        schema: schema,
        targetResponses: 100,
        createdBy: 'current-user-id'
      });

      // Publish it immediately
      await apiService.publishQuestionnaire(newQuestionnaire.id);

      alert(language === 'el' ? 'Το ερωτηματολόγιο δημοσιεύτηκε επιτυχώς!' : 'Questionnaire published successfully!');
      onBack(); // Go back to questionnaires list
    } catch (error) {
      console.error('Failed to publish questionnaire:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την δημοσίευση!' : 'Error publishing questionnaire!');
    }
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-gray-900">{t.title}</h2>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl"
            onClick={handleExportSchema}
            disabled={questions.length === 0}
          >
            <FileJson className="h-4 w-4" />
            {t.exportSchema}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl relative"
          >
            <Upload className="h-4 w-4" />
            {t.importSchema}
            <input
              type="file"
              accept=".json"
              onChange={handleImportSchema}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl"
            onClick={() => setShowPreview(true)}
            disabled={questions.length === 0}
          >
            <Eye className="h-4 w-4" />
            {t.preview}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl"
            onClick={handleSaveDraft}
          >
            <Save className="h-4 w-4" />
            {t.saveDraft}
          </Button>
          <Button 
            className="gap-2 rounded-xl text-white" 
            style={{ backgroundColor: '#004B87' }}
            onClick={handlePublish}
          >
            {t.publish}
          </Button>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>{t.basicInfo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t.questionnaireName} *</Label>
              <Input 
                className="rounded-xl mt-1" 
                placeholder={t.namePlaceholder}
                value={questionnaireName}
                onChange={(e) => setQuestionnaireName(e.target.value)}
              />
            </div>
            <div>
              <Label>{t.category}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue placeholder={t.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="livestock">{t.livestock}</SelectItem>
                  <SelectItem value="crops">{t.crops}</SelectItem>
                  <SelectItem value="irrigation">{t.irrigation}</SelectItem>
                  <SelectItem value="equipment">{t.equipment}</SelectItem>
                  <SelectItem value="general">{t.general}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>{t.description}</Label>
            <Textarea 
              className="rounded-xl mt-1" 
              placeholder={t.descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Questions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{t.questions}</CardTitle>
                  <Badge variant="secondary" className="rounded-lg">
                    {questions.length} {language === 'el' ? 'ερωτήσεις' : 'questions'}
                  </Badge>
                </div>
                {questions.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={expandAllQuestions}
                      className="rounded-xl"
                    >
                      {t.expandAll}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={collapseAllQuestions}
                      className="rounded-xl"
                    >
                      {t.collapseAll}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => {
                const Icon = questionTypeIcons[question.type] || Type;
                return (
                  <Card key={question.id} className="rounded-xl border-2 border-gray-200">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="h-5 w-5 text-gray-400 mt-2 cursor-move" />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-lg">
                              {t.question} {index + 1}
                            </Badge>
                            <Badge style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }} className="rounded-lg gap-1">
                              <Icon className="h-3 w-3" />
                              {t[question.type as keyof typeof t] || question.type}
                            </Badge>
                            {question.required && (
                              <Badge style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }} className="rounded-lg">
                                {t.required}
                              </Badge>
                            )}
                          </div>

                          {!question.collapsed && (
                            <Tabs defaultValue="basic" className="w-full">
                            <TabsList className={`grid w-full ${question.type === 'table' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                              <TabsTrigger value="basic">{language === 'el' ? 'Βασικά' : 'Basic'}</TabsTrigger>
                              <TabsTrigger value="options" disabled={!['multipleChoice', 'checkbox', 'dropdown'].includes(question.type)}>
                                {language === 'el' ? 'Επιλογές' : 'Options'}
                              </TabsTrigger>
                              {question.type === 'table' && (
                                <TabsTrigger value="table">{t.tableSettings}</TabsTrigger>
                              )}
                              <TabsTrigger value="settings">{t.settings}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-3 mt-4">
                              <div>
                                <Label className="text-xs">{t.questionText} (EL)</Label>
                                <Input
                                  value={question.text}
                                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                                  placeholder={language === 'el' ? 'π.χ. Ποιο είναι το όνομά σας;' : 'e.g. What is your name?'}
                                  className="rounded-xl mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">{t.questionText} (EN)</Label>
                                <Input
                                  value={question.textEn || ''}
                                  onChange={(e) => updateQuestion(question.id, 'textEn', e.target.value)}
                                  placeholder="e.g. What is your name?"
                                  className="rounded-xl mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">{t.placeholder}</Label>
                                <Input
                                  value={question.placeholder || ''}
                                  onChange={(e) => updateQuestion(question.id, 'placeholder', e.target.value)}
                                  placeholder={language === 'el' ? 'Κείμενο υπόδειξης...' : 'Placeholder text...'}
                                  className="rounded-xl mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">{t.questionDescription}</Label>
                                <Textarea
                                  value={question.description || ''}
                                  onChange={(e) => updateQuestion(question.id, 'description', e.target.value)}
                                  placeholder={language === 'el' ? 'Προαιρετική περιγραφή...' : 'Optional description...'}
                                  className="rounded-xl mt-1"
                                  rows={2}
                                />
                              </div>
                            </TabsContent>

                            <TabsContent value="options" className="space-y-3 mt-4">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <div className={`w-4 h-4 flex-shrink-0 ${
                                    question.type === 'multipleChoice' 
                                      ? 'rounded-full border-2 border-gray-300' 
                                      : 'rounded border-2 border-gray-300'
                                  }`} />
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                    placeholder={`${t.option} ${optIndex + 1}`}
                                    className="rounded-xl flex-1"
                                  />
                                  {question.options.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeOption(question.id, optIndex)}
                                      className="h-8 w-8 rounded-lg text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(question.id)}
                                className="gap-2 rounded-lg w-full"
                              >
                                <Plus className="h-3 w-3" />
                                {t.addOption}
                              </Button>
                            </TabsContent>

                            {question.type === 'table' && (
                              <TabsContent value="table" className="space-y-3 mt-4">
                                <TableBuilder
                                  language={language}
                                  config={question.tableConfig}
                                  onChange={(config) => updateQuestion(question.id, 'tableConfig', config)}
                                />
                              </TabsContent>
                            )}

                            <TabsContent value="settings" className="space-y-3 mt-4">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <Label className="text-sm">{t.required}</Label>
                                <Switch
                                  checked={question.required}
                                  onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                                />
                              </div>
                              {question.type === 'number' && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-xs">{t.minValue}</Label>
                                    <Input
                                      type="number"
                                      value={question.validation?.min || ''}
                                      onChange={(e) => updateQuestion(question.id, 'validation', {
                                        ...question.validation,
                                        min: parseInt(e.target.value) || undefined
                                      })}
                                      className="rounded-xl mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">{t.maxValue}</Label>
                                    <Input
                                      type="number"
                                      value={question.validation?.max || ''}
                                      onChange={(e) => updateQuestion(question.id, 'validation', {
                                        ...question.validation,
                                        max: parseInt(e.target.value) || undefined
                                      })}
                                      className="rounded-xl mt-1"
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {/* Drill Down Configuration */}
                              {['multipleChoice', 'dropdown', 'select'].includes(question.type) && (
                                <div className="space-y-3">
                                  <Label className="text-sm">{t.drillDown}</Label>
                                  <div className="space-y-2">
                                    <Label className="text-xs">{t.sourceQuestion}</Label>
                                    <Select
                                      value={question.drillDown?.sourceQuestionId || ''}
                                      onValueChange={(value) => {
                                        if (value) {
                                          updateQuestion(question.id, 'drillDown', {
                                            sourceQuestionId: value,
                                            optionsMapping: {}
                                          });
                                        } else {
                                          updateQuestion(question.id, 'drillDown', undefined);
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder={t.selectCategory} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">{language === 'el' ? 'Καμία' : 'None'}</SelectItem>
                                        {getAvailableSourceQuestions()
                                          .filter(q => q.id !== question.id)
                                          .map(q => (
                                            <SelectItem key={q.id} value={q.id}>
                                              {q.text || q.textEn || `Question ${questions.indexOf(q) + 1}`}
                                            </SelectItem>
                                          ))
                                        }
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                          )}

                          <div className="flex gap-1 pt-2 border-t">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg"
                              onClick={() => toggleQuestionCollapse(question.id)}
                              title={question.collapsed ? t.expand : t.collapse}
                            >
                              {question.collapsed ? 
                                <Plus className="h-4 w-4" /> : 
                                <GripVertical className="h-4 w-4 rotate-90" />
                              }
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg"
                              onClick={() => duplicateQuestion(question.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeQuestion(question.id)}
                              className="h-8 w-8 rounded-lg text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>{t.noQuestions}</p>
                  <p className="text-sm">{t.addFirstQuestion}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Question Types */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>{t.questionTypes}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(questionTypeIcons).map(([type, Icon]) => (
                <button
                  key={type}
                  onClick={() => addQuestion(type)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0F9FF' }}>
                    <Icon className="h-5 w-5" style={{ color: '#004B87' }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-900">{t[type as keyof typeof t]}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{t.previewTitle}</DialogTitle>
            <DialogDescription>{t.previewDescription}</DialogDescription>
          </DialogHeader>
          <Separator className="my-4" />
          <div className="space-y-6">
            {questionnaireName && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{questionnaireName}</h3>
                {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
              </div>
            )}
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>{index + 1}. {question.text || question.textEn || 'Untitled Question'}</span>
                  {question.required && <span className="text-red-600">*</span>}
                </Label>
                {question.description && (
                  <p className="text-xs text-gray-500">{question.description}</p>
                )}
                {question.type === 'shortText' && (
                  <Input placeholder={question.placeholder} className="rounded-xl" />
                )}
                {question.type === 'longText' && (
                  <Textarea placeholder={question.placeholder} className="rounded-xl" rows={4} />
                )}
                {question.type === 'number' && (
                  <Input type="number" placeholder={question.placeholder} className="rounded-xl" />
                )}
                {question.type === 'email' && (
                  <Input type="email" placeholder={question.placeholder} className="rounded-xl" />
                )}
                {question.type === 'phone' && (
                  <Input type="tel" placeholder={question.placeholder} className="rounded-xl" />
                )}
                {question.type === 'date' && (
                  <Input type="date" className="rounded-xl" />
                )}
                {question.type === 'multipleChoice' && (
                  <div className="space-y-2">
                    {question.options.map((option, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        <span className="text-sm">{option || `Option ${i + 1}`}</span>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === 'checkbox' && (
                  <div className="space-y-2">
                    {question.options.map((option, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-gray-300" />
                        <span className="text-sm">{option || `Option ${i + 1}`}</span>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === 'dropdown' && (
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={question.placeholder || 'Select...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option, i) => (
                        <SelectItem key={i} value={`option-${i}`}>
                          {option || `Option ${i + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {question.type === 'table' && question.tableConfig && (
                  <div className="border rounded-xl p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {t.table}: {question.tableConfig.name || 'Unnamed Table'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {question.tableConfig.columns.length} {language === 'el' ? 'στήλες' : 'columns'} • 
                      {question.tableConfig.minRows}-{question.tableConfig.maxRows} {language === 'el' ? 'γραμμές' : 'rows'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowPreview(false)} className="rounded-xl">
              {t.close}
            </Button>
            <Button className="rounded-xl text-white" style={{ backgroundColor: '#004B87' }}>
              {language === 'el' ? 'Υποβολή' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
