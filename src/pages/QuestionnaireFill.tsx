import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Save, Send, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { QuestionCard } from "@/components/QuestionCard";
import { toast } from "sonner";

interface Question {
  id: string;
  type: "multiple_choice" | "text" | "number" | "date" | "matrix" | "file";
  title: string;
  helpText?: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

const QuestionnaireFill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const questions: Question[] = [
    {
      id: "q1",
      type: "multiple_choice",
      title: "Ποιο είναι το κύριο είδος καλλιέργειας;",
      helpText: "Επιλέξτε το κύριο προϊόν που παράγετε",
      required: true,
      options: ["Σιτηρά", "Λαχανικά", "Οπωροφόρα", "Ελιές", "Άλλο"],
    },
    {
      id: "q2",
      type: "number",
      title: "Ποιο είναι το συνολικό εμβαδόν σε στρέμματα;",
      helpText: "Καταχωρίστε το εμβαδόν σε στρέμματα",
      required: true,
      min: 0,
      max: 10000,
    },
    {
      id: "q3",
      type: "multiple_choice",
      title: "Χρησιμοποιείτε σύστημα άρδευσης;",
      required: true,
      options: ["Ναι, σταγονοσυγκόμιση", "Ναι, καταιονισμός", "Όχι", "Άλλο"],
    },
    {
      id: "q4",
      type: "text",
      title: "Περιγράψτε τις κύριες προκλήσεις που αντιμετωπίζετε",
      helpText: "Αναφέρετε τυχόν προβλήματα ή δυσκολίες",
      required: false,
    },
    {
      id: "q5",
      type: "file",
      title: "Φωτογραφία της γεωργικής εκμετάλλευσης",
      helpText: "Προαιρετικά ανεβάστε φωτογραφίες",
      required: false,
    },
  ];

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      toast.error("Παρακαλώ απαντήστε την υποχρεωτική ερώτηση");
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSaveDraft = () => {
    toast.success("Το πρόχειρο αποθηκεύτηκε");
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/questionnaires");
    }, 2500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-success/5 flex items-center justify-center p-4">
        <div className="text-center animate-success-check">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-12 w-12 text-success-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Επιτυχής Υποβολή!
          </h2>
          <p className="text-muted-foreground">
            Το ερωτηματολόγιο υποβλήθηκε με επιτυχία
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header title={`Ερωτηματολόγιο ${id}`} showBack />

      <main className="container max-w-4xl mx-auto p-4 pb-32">
        {/* Progress Bar */}
        <Card className="p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Πρόοδος
            </span>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} από {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Question Card */}
        <div className="animate-fade-in" key={currentQuestion.id}>
          <QuestionCard
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={handleAnswer}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg">
          <div className="container max-w-4xl mx-auto">
            <div className="flex gap-3">
              {currentIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1"
                >
                  Προηγούμενο
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Αποθήκευση
              </Button>
              <Button onClick={handleNext} className="flex-1 gap-2">
                {isLastQuestion ? (
                  <>
                    <Send className="h-4 w-4" />
                    Υποβολή
                  </>
                ) : (
                  "Επόμενο"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionnaireFill;
