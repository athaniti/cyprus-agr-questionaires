import { useState } from 'react';
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
  Eye
} from 'lucide-react';
import { Switch } from './ui/switch';

interface QuestionnaireBuilderProps {
  language: 'el' | 'en';
  onBack: () => void;
}

const translations = {
  el: {
    title: 'Δημιουργία Ερωτηματολογίου',
    basicInfo: 'Βασικές Πληροφορίες',
    questionnaireName: 'Όνομα Ερωτηματολογίου',
    description: 'Περιγραφή',
    category: 'Κατηγορία',
    selectCategory: 'Επιλέξτε κατηγορία',
    livestock: 'Κτηνοτροφία',
    crops: 'Καλλιέργειες',
    irrigation: 'Άρδευση',
    equipment: 'Εξοπλισμός',
    questions: 'Ερωτήσεις',
    addQuestion: 'Προσθήκη Ερώτησης',
    questionTypes: 'Τύποι Ερωτήσεων',
    shortText: 'Σύντομο Κείμενο',
    multipleChoice: 'Πολλαπλή Επιλογή',
    date: 'Ημερομηνία',
    number: 'Αριθμός',
    longText: 'Μακρύ Κείμενο',
    image: 'Εικόνα',
    matrix: 'Πίνακας',
    questionText: 'Κείμενο Ερώτησης',
    required: 'Υποχρεωτική',
    option: 'Επιλογή',
    addOption: 'Προσθήκη Επιλογής',
    saveDraft: 'Αποθήκευση Προχείρου',
    preview: 'Προεπισκόπηση',
    publish: 'Δημοσίευση',
    back: 'Πίσω'
  },
  en: {
    title: 'Create Questionnaire',
    basicInfo: 'Basic Information',
    questionnaireName: 'Questionnaire Name',
    description: 'Description',
    category: 'Category',
    selectCategory: 'Select category',
    livestock: 'Livestock',
    crops: 'Crops',
    irrigation: 'Irrigation',
    equipment: 'Equipment',
    questions: 'Questions',
    addQuestion: 'Add Question',
    questionTypes: 'Question Types',
    shortText: 'Short Text',
    multipleChoice: 'Multiple Choice',
    date: 'Date',
    number: 'Number',
    longText: 'Long Text',
    image: 'Image',
    matrix: 'Matrix',
    questionText: 'Question Text',
    required: 'Required',
    option: 'Option',
    addOption: 'Add Option',
    saveDraft: 'Save Draft',
    preview: 'Preview',
    publish: 'Publish',
    back: 'Back'
  }
};

const questionTypeIcons = {
  shortText: Type,
  multipleChoice: ListChecks,
  date: Calendar,
  number: Hash,
  longText: FileText,
  image: ImageIcon,
  matrix: TableIcon
};

export function QuestionnaireBuilder({ language, onBack }: QuestionnaireBuilderProps) {
  const t = translations[language];
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const addQuestion = (type: string) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type,
      text: '',
      required: false,
      options: type === 'multipleChoice' ? ['', ''] : []
    };
    setQuestions([...questions, newQuestion]);
    setSelectedType(null);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
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
            <p className="text-gray-600">{language === 'el' ? 'Σχεδιάστε το ερωτηματολόγιό σας' : 'Design your questionnaire'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Eye className="h-4 w-4" />
            {t.preview}
          </Button>
          <Button variant="outline" className="gap-2 rounded-xl">
            <Save className="h-4 w-4" />
            {t.saveDraft}
          </Button>
          <Button className="gap-2 rounded-xl text-white" style={{ backgroundColor: '#004B87' }}>
            {t.publish}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>{t.basicInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.questionnaireName}</Label>
                <Input className="rounded-xl mt-1" placeholder={language === 'el' ? 'π.χ. Έρευνα Κτηνοτροφίας 2025' : 'e.g. Livestock Survey 2025'} />
              </div>
              <div>
                <Label>{t.description}</Label>
                <Textarea className="rounded-xl mt-1" placeholder={language === 'el' ? 'Περιγράψτε τον σκοπό του ερωτηματολογίου...' : 'Describe the purpose of the questionnaire...'} />
              </div>
              <div>
                <Label>{t.category}</Label>
                <Select>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue placeholder={t.selectCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="livestock">{t.livestock}</SelectItem>
                    <SelectItem value="crops">{t.crops}</SelectItem>
                    <SelectItem value="irrigation">{t.irrigation}</SelectItem>
                    <SelectItem value="equipment">{t.equipment}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.questions}</CardTitle>
                <Badge variant="secondary" className="rounded-lg">
                  {questions.length} {language === 'el' ? 'ερωτήσεις' : 'questions'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="rounded-xl border-2 border-gray-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-5 w-5 text-gray-400 mt-2 cursor-move" />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-lg">
                            {language === 'el' ? 'Ερώτηση' : 'Question'} {index + 1}
                          </Badge>
                          <Badge style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }} className="rounded-lg">
                            {t[question.type as keyof typeof t]}
                          </Badge>
                        </div>
                        <Input
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                          placeholder={t.questionText}
                          className="rounded-xl"
                        />
                        {question.type === 'multipleChoice' && (
                          <div className="space-y-2">
                            {question.options.map((option: string, optIndex: number) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                  placeholder={`${t.option} ${optIndex + 1}`}
                                  className="rounded-xl flex-1"
                                />
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(question.id)}
                              className="gap-2 rounded-lg"
                            >
                              <Plus className="h-3 w-3" />
                              {t.addOption}
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={question.required}
                              onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                            />
                            <Label className="text-sm">{t.required}</Label>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
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
                    </div>
                  </CardContent>
                </Card>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>{language === 'el' ? 'Δεν υπάρχουν ερωτήσεις ακόμα' : 'No questions yet'}</p>
                  <p className="text-sm">{language === 'el' ? 'Προσθέστε την πρώτη σας ερώτηση από τη δεξιά πλευρά' : 'Add your first question from the right panel'}</p>
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

          {/* Preview Card */}
          <Card className="rounded-2xl border-none shadow-sm" style={{ backgroundColor: '#004B87' }}>
            <CardContent className="p-6 text-white text-center">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-2">{language === 'el' ? 'Προεπισκόπηση' : 'Preview Mode'}</h3>
              <p className="text-sm opacity-80 mb-4">
                {language === 'el' 
                  ? 'Δείτε πώς θα εμφανίζεται το ερωτηματολόγιο στους χρήστες'
                  : 'See how the questionnaire will appear to users'}
              </p>
              <Button variant="secondary" className="w-full rounded-xl">
                {t.preview}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
