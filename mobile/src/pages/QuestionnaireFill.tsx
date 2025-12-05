import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Save, Send, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { Questionnaire, questionnaireService, Theme } from "@/services/questionnaires";
import { ThemePreview } from "@/components/ThemePreview";



const QuestionnaireFill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionnaire, setQuestionnaire] = useState<Questionnaire|undefined>(undefined);

  const [questionnaireTheme, setQuestionnaireTheme] = useState<Theme|undefined>(undefined);

  useEffect(()=>{
    questionnaireService.getThemes().then((themes)=>{
      questionnaireService.getQuestionnaire(id!).then((data)=>{
        data.schema = data.serializedSchema ? JSON.parse(data.serializedSchema) : {};
        setQuestionnaire(data);
        setQuestionnaireTheme(themes.find(t=>t.id === data.themeId));
      });
    });
    
  },[]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header title={`Ερωτηματολόγιο ${id}`} showBack />

      <main className="container max-w-4xl mx-auto p-4 pb-32">
        {questionnaire && <ThemePreview theme={questionnaireTheme} mode='mobile' questionnaire={questionnaire}/>}


        {/* Navigation Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg">
          <div className="container max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={()=>{}}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Αποθήκευση
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionnaireFill;
