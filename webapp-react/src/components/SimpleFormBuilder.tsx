import { useState } from 'react';
import { apiService } from '../services/api';

interface FormBuilderComponentProps {
  initialForm?: any;
  onSave: (form: any) => void;
  onCancel: () => void;
  language: 'el' | 'en';
  mode: 'create' | 'edit';
  questionnaireName?: string;
}

interface FormComponent {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export function FormBuilderComponent({
  initialForm,
  onSave,
  onCancel,
  language,
  mode,
  questionnaireName
}: FormBuilderComponentProps) {
  const [components, setComponents] = useState<FormComponent[]>(
    initialForm?.components || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    el: {
      title: mode === 'create' ? 'Δημιουργία Ερωτηματολογίου' : 'Επεξεργασία Ερωτηματολογίου',
      subtitle: 'Προσθέστε ερωτήσεις και διαμορφώστε το ερωτηματολόγιό σας',
      save: 'Αποθήκευση',
      cancel: 'Ακύρωση',
      saving: 'Αποθηκεύεται...',
      addQuestion: 'Προσθήκη Ερώτησης',
      questionTypes: {
        textfield: 'Κείμενο',
        textarea: 'Μεγάλο Κείμενο',
        number: 'Αριθμός',
        select: 'Επιλογή από Λίστα',
        radio: 'Μία Επιλογή',
        checkbox: 'Πολλαπλές Επιλογές',
        email: 'Email',
        date: 'Ημερομηνία'
      },
      questionLabel: 'Ετικέτα Ερώτησης',
      questionType: 'Τύπος Ερώτησης',
      required: 'Υποχρεωτικό',
      options: 'Επιλογές (μία ανά γραμμή)',
      placeholder: 'Placeholder κείμενο',
      preview: 'Προεπισκόπηση',
      delete: 'Διαγραφή',
      edit: 'Επεξεργασία'
    },
    en: {
      title: mode === 'create' ? 'Create Questionnaire' : 'Edit Questionnaire',
      subtitle: 'Add questions and configure your questionnaire',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving...',
      addQuestion: 'Add Question',
      questionTypes: {
        textfield: 'Text',
        textarea: 'Large Text',
        number: 'Number',
        select: 'Select from List',
        radio: 'Single Choice',
        checkbox: 'Multiple Choice',
        email: 'Email',
        date: 'Date'
      },
      questionLabel: 'Question Label',
      questionType: 'Question Type',
      required: 'Required',
      options: 'Options (one per line)',
      placeholder: 'Placeholder text',
      preview: 'Preview',
      delete: 'Delete',
      edit: 'Edit'
    }
  };

  const t = translations[language];

  const questionTypes = [
    { value: 'textfield', label: t.questionTypes.textfield },
    { value: 'textarea', label: t.questionTypes.textarea },
    { value: 'number', label: t.questionTypes.number },
    { value: 'select', label: t.questionTypes.select },
    { value: 'radio', label: t.questionTypes.radio },
    { value: 'checkbox', label: t.questionTypes.checkbox },
    { value: 'email', label: t.questionTypes.email },
    { value: 'date', label: t.questionTypes.date }
  ];

  const addQuestion = () => {
    const newQuestion: FormComponent = {
      id: `question_${Date.now()}`,
      type: 'textfield',
      label: '',
      required: false,
      placeholder: ''
    };
    setComponents(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    );
  };

  const deleteQuestion = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Create Form.io schema
      const formSchema = {
        title: questionnaireName || 'New Questionnaire',
        display: 'form',
        components: components.map(comp => ({
          type: comp.type,
          key: comp.id,
          label: comp.label,
          input: true,
          validate: {
            required: comp.required
          },
          placeholder: comp.placeholder,
          ...(comp.options && comp.options.length > 0 && {
            data: {
              values: comp.options.map((opt) => ({
                label: opt,
                value: opt.toLowerCase().replace(/\s+/g, '_')
              }))
            }
          })
        }))
      };

      // Save to database via API
      const questionnaire = {
        name: questionnaireName || 'New Questionnaire',
        description: 'Created via Form Builder',
        category: 'agriculture',
        schema: JSON.stringify(formSchema),
        targetResponses: 100,
        createdBy: 'admin'
      };

      // Call API to save
      await apiService.createQuestionnaire(questionnaire);
      
      onSave(questionnaire);
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert(language === 'el' ? 'Σφάλμα κατά την αποθήκευση' : 'Error saving questionnaire');
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionPreview = (question: FormComponent) => {
    switch (question.type) {
      case 'textfield':
      case 'email':
        return (
          <input 
            type={question.type === 'email' ? 'email' : 'text'}
            placeholder={question.placeholder || question.label}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled
          />
        );
      case 'textarea':
        return (
          <textarea 
            placeholder={question.placeholder || question.label}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
            disabled
          />
        );
      case 'number':
        return (
          <input 
            type="number"
            placeholder={question.placeholder || question.label}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled
          />
        );
      case 'date':
        return (
          <input 
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled
          />
        );
      case 'select':
        return (
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
            <option>{language === 'el' ? 'Επιλέξτε...' : 'Select...'}</option>
            {question.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="radio" name={question.id} disabled />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="checkbox" disabled />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return <div className="text-gray-500">Preview not available</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-4">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
              {questionnaireName && (
                <p className="text-sm text-blue-600 mt-1">📝 {questionnaireName}</p>
              )}
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
            {/* Form Builder */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  🛠️ {language === 'el' ? 'Κατασκευαστής Φόρμας' : 'Form Builder'}
                </h3>
                <button
                  onClick={addQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  ➕ {t.addQuestion}
                </button>
              </div>

              <div className="space-y-4">
                {components.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'el' ? 'Ερώτηση' : 'Question'} {index + 1}
                      </span>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️ {t.delete}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t.questionLabel}
                        </label>
                        <input
                          type="text"
                          value={question.label}
                          onChange={(e) => updateQuestion(question.id, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={language === 'el' ? 'Εισάγετε την ερώτηση...' : 'Enter question...'}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.questionType}
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {questionTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center gap-2 mt-6">
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">{t.required}</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t.placeholder}
                        </label>
                        <input
                          type="text"
                          value={question.placeholder || ''}
                          onChange={(e) => updateQuestion(question.id, 'placeholder', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={language === 'el' ? 'Προαιρετικό...' : 'Optional...'}
                        />
                      </div>

                      {['select', 'radio', 'checkbox'].includes(question.type) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.options}
                          </label>
                          <textarea
                            value={question.options?.join('\n') || ''}
                            onChange={(e) => updateQuestion(question.id, 'options', e.target.value.split('\n').filter(Boolean))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                            placeholder={language === 'el' ? 'Επιλογή 1\nΕπιλογή 2\nΕπιλογή 3' : 'Option 1\nOption 2\nOption 3'}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {components.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📝</div>
                    <p>{language === 'el' ? 'Προσθέστε ερωτήσεις για να ξεκινήσετε' : 'Add questions to get started'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                👁️ {t.preview}
              </h3>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-6">
                  {questionnaireName || 'New Questionnaire'}
                </h4>

                <div className="space-y-6">
                  {components.map((question, index) => (
                    <div key={question.id}>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {index + 1}. {question.label}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderQuestionPreview(question)}
                    </div>
                  ))}

                  {components.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {language === 'el' ? 'Η προεπισκόπηση θα εμφανιστεί εδώ' : 'Preview will appear here'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            {components.length} {language === 'el' ? 'ερωτήσεις' : 'questions'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || components.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {t.saving}
                </>
              ) : (
                <>
                  💾 {t.save}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}