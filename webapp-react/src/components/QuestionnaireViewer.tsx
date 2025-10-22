import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { TableViewer } from './TableViewer';

interface QuestionnaireViewerProps {
  language: 'el' | 'en';
  questionnaireId: string;
  questionnaireName: string;
  questionnaireDescription?: string;
  onBack: () => void;
}

interface Question {
  id: string;
  type: string;
  text: string;
  textEn?: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
  };
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
    title: 'Συμπλήρωση Ερωτηματολογίου',
    subtitle: 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία',
    back: 'Πίσω',
    submit: 'Υποβολή',
    submitted: 'Το ερωτηματολόγιο υποβλήθηκε με επιτυχία!',
    thankYou: 'Ευχαριστούμε για τη συμμετοχή σας',
    viewResponse: 'Προβολή Απάντησης',
    status: 'Κατάσταση',
    completed: 'Ολοκληρωμένο',
    inProgress: 'Σε εξέλιξη',
    required: 'Υποχρεωτικό πεδίο',
    selectOption: 'Επιλέξτε...',
  },
  en: {
    title: 'Complete Questionnaire',
    subtitle: 'Please complete all required fields',
    back: 'Back',
    submit: 'Submit',
    submitted: 'Questionnaire submitted successfully!',
    thankYou: 'Thank you for your participation',
    viewResponse: 'View Response',
    status: 'Status',
    completed: 'Completed',
    inProgress: 'In Progress',
    required: 'Required field',
    selectOption: 'Select...',
  }
};

// Mock questionnaire data
const mockQuestions: Question[] = [
  {
    id: 'q1',
    type: 'shortText',
    text: 'Ονοματεπώνυμο Αγρότη',
    textEn: 'Farmer Full Name',
    required: true,
    placeholder: 'Εισάγετε το όνομά σας'
  },
  {
    id: 'q2',
    type: 'email',
    text: 'Email',
    textEn: 'Email',
    required: true,
    placeholder: 'email@example.com'
  },
  {
    id: 'q3',
    type: 'phone',
    text: 'Τηλέφωνο',
    textEn: 'Phone Number',
    required: false,
    placeholder: '+357 99 123456'
  },
  {
    id: 'q4',
    type: 'number',
    text: 'Μέγεθος Γης (στρέμματα)',
    textEn: 'Land Size (acres)',
    required: true,
    validation: { min: 0 }
  },
  {
    id: 'q5',
    type: 'dropdown',
    text: 'Επαρχία',
    textEn: 'District',
    required: true,
    options: ['Λευκωσία', 'Λεμεσός', 'Λάρνακα', 'Πάφος', 'Αμμόχωστος', 'Κερύνεια']
  },
  {
    id: 'q6',
    type: 'checkbox',
    text: 'Τύποι Καλλιεργειών',
    textEn: 'Crop Types',
    required: true,
    options: ['Σιτηρά', 'Λαχανικά', 'Φρούτα', 'Ελιές', 'Αμπέλια']
  },
  {
    id: 'q7',
    type: 'multipleChoice',
    text: 'Διαθέτετε ζώα;',
    textEn: 'Do you have livestock?',
    required: true,
    options: ['Ναι', 'Όχι']
  },
  {
    id: 'q8',
    type: 'longText',
    text: 'Σχόλια/Παρατηρήσεις',
    textEn: 'Comments/Observations',
    required: false,
    placeholder: 'Προσθέστε οποιεσδήποτε πρόσθετες πληροφορίες...'
  }
];

export function QuestionnaireViewer({ 
  language, 
  questionnaireId,
  questionnaireName,
  questionnaireDescription,
  onBack 
}: QuestionnaireViewerProps) {
  const t = translations[language];
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const currentValues = formData[questionId] || [];
    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((v: string) => v !== option);
    handleInputChange(questionId, newValues);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    mockQuestions.forEach(question => {
      if (question.required) {
        const value = formData[question.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[question.id] = t.required;
        }
      }
      
      if (question.type === 'number' && formData[question.id]) {
        const numValue = Number(formData[question.id]);
        if (question.validation?.min !== undefined && numValue < question.validation.min) {
          newErrors[question.id] = `Minimum value is ${question.validation.min}`;
        }
        if (question.validation?.max !== undefined && numValue > question.validation.max) {
          newErrors[question.id] = `Maximum value is ${question.validation.max}`;
        }
      }
      
      if (question.type === 'email' && formData[question.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[question.id])) {
          newErrors[question.id] = language === 'el' ? 'Μη έγκυρο email' : 'Invalid email';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert(language === 'el' 
        ? 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία σωστά' 
        : 'Please fill in all required fields correctly');
      return;
    }

    console.log('Form submission:', { questionnaireId, data: formData });
    setSubmitted(true);
  };

  const renderQuestion = (question: Question) => {
    const questionText = language === 'el' ? question.text : (question.textEn || question.text);
    const hasError = errors[question.id];

    return (
      <div key={question.id} className="space-y-2">
        <Label className="flex items-center gap-2">
          <span>{questionText}</span>
          {question.required && <span className="text-red-600">*</span>}
        </Label>
        {question.description && (
          <p className="text-xs text-gray-500">{question.description}</p>
        )}
        
        {question.type === 'shortText' && (
          <Input
            placeholder={question.placeholder}
            className={`rounded-xl ${hasError ? 'border-red-500' : ''}`}
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'longText' && (
          <Textarea
            placeholder={question.placeholder}
            className={`rounded-xl ${hasError ? 'border-red-500' : ''}`}
            rows={4}
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'number' && (
          <Input
            type="number"
            placeholder={question.placeholder}
            className={`rounded-xl ${hasError ? 'border-red-500' : ''}`}
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            min={question.validation?.min}
            max={question.validation?.max}
          />
        )}
        
        {question.type === 'email' && (
          <Input
            type="email"
            placeholder={question.placeholder}
            className={`rounded-xl ${hasError ? 'border-red-500' : ''}`}
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'phone' && (
          <Input
            type="tel"
            placeholder={question.placeholder}
            className={`rounded-xl ${hasError ? 'border-red-500' : ''}`}
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'date' && (
          <Input
            type="date"
            className={`rounded-xl ${hasError ? 'border-red-500' : ''}`}
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'dropdown' && (
          <Select value={formData[question.id]} onValueChange={(value) => handleInputChange(question.id, value)}>
            <SelectTrigger className={`rounded-xl ${hasError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder={t.selectOption} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {question.type === 'multipleChoice' && (
          <RadioGroup value={formData[question.id]} onValueChange={(value) => handleInputChange(question.id, value)}>
            <div className="space-y-2">
              {question.options?.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <RadioGroupItem value={option} id={`${question.id}-${i}`} />
                  <Label htmlFor={`${question.id}-${i}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
        
        {question.type === 'checkbox' && (
          <div className="space-y-2">
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox
                  id={`${question.id}-${i}`}
                  checked={(formData[question.id] || []).includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(question.id, option, checked as boolean)}
                />
                <Label htmlFor={`${question.id}-${i}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </div>
        )}
        
        {question.type === 'table' && question.tableConfig && (
          <TableViewer
            language={language}
            config={question.tableConfig}
            value={formData[question.id] || []}
            onChange={(rows) => handleInputChange(question.id, rows)}
            errors={errors}
          />
        )}
        
        {hasError && (
          <p className="text-xs text-red-600">{hasError}</p>
        )}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-gray-900">{questionnaireName}</h2>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        <Card className="rounded-2xl border-none shadow-sm max-w-3xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
              <CheckCircle className="h-12 w-12" style={{ color: '#065F46' }} />
            </div>
            <h3 className="text-2xl mb-2 text-gray-900">{t.submitted}</h3>
            <p className="text-gray-600 mb-8">{t.thankYou}</p>
            <Badge className="rounded-lg mb-6" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
              {t.status}: {t.completed}
            </Badge>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={onBack} 
                className="rounded-xl"
              >
                {t.back}
              </Button>
              <Button 
                onClick={() => {
                  console.log('View response:', formData);
                  alert(JSON.stringify(formData, null, 2));
                }}
                className="rounded-xl gap-2 text-white"
                style={{ backgroundColor: '#004B87' }}
              >
                {t.viewResponse}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-gray-900">{questionnaireName}</h2>
          <p className="text-gray-600">{questionnaireDescription || t.subtitle}</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <Card className="rounded-2xl border-none shadow-sm max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t.title}</span>
              <Badge className="rounded-lg" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                {t.status}: {t.inProgress}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockQuestions.map(renderQuestion)}
            
            <div className="pt-6 border-t flex justify-end gap-3">
              <Button 
                type="button"
                variant="outline" 
                onClick={onBack}
                className="rounded-xl"
              >
                {t.back}
              </Button>
              <Button 
                type="submit"
                className="rounded-xl text-white gap-2"
                style={{ backgroundColor: '#004B87' }}
              >
                <CheckCircle className="h-4 w-4" />
                {t.submit}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
