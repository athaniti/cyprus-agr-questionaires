import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Questionnaire, QuestionnaireResponse, questionnaireService, Theme } from "@/services/questionnaires";
import { ThemePreview } from "@/components/ThemePreview";



const QuestionnaireFill = () => {
  const { id } = useParams();
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [questionnaireResponse, setQuestionnaireResponse] = useState<QuestionnaireResponse|undefined>(undefined);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire|undefined>(undefined);
  const [questionnaireTheme, setQuestionnaireTheme] = useState<Theme|undefined>(undefined);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(()=>{

    questionnaireService.getThemes().then((themes)=>{
      questionnaireService.getQuestionnaire(id!).then((questionnaire)=>{
        questionnaire.schema = questionnaire.serializedSchema ? JSON.parse(questionnaire.serializedSchema) : {};
        setQuestionnaire(questionnaire);
        setQuestionnaireTheme(themes.find(t=>t.id === questionnaire.themeId));
        questionnaireService.getQuestionnaireParticipantResponse(questionnaire.id, farmId).then((questionnaireResponse=> {
          if (questionnaireResponse.serializedResponseData) questionnaireResponse.responseData = JSON.parse(questionnaireResponse.serializedResponseData);
          setQuestionnaireResponse(questionnaireResponse);
          
        })).catch((error) => {
          // If 404, it means no response started yet
          if (error.status === 404 || error.message?.includes('404')) {
            questionnaireService.createEmptyQuestionnaireParticipantResponse(id, farmId).then(newQuestionnaireResponse => {
              if (newQuestionnaireResponse.serializedResponseData) newQuestionnaireResponse.responseData = JSON.parse(newQuestionnaireResponse.serializedResponseData);
              setQuestionnaireResponse(newQuestionnaireResponse);
            })
            
          }
        })
        
      });
    });
    
  },[]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header title={`Ερωτηματολόγιο ${questionnaireResponse?.farm.farmCode} ${questionnaireResponse?.farm.ownerName}`} showBack />

      <main className="container max-w-4xl mx-auto p-4 pb-32">
        <div style={{marginBottom:90}}>
          {(questionnaire && questionnaireResponse) && <ThemePreview theme={questionnaireTheme} mode='mobile' questionnaire={questionnaire} questionnaireResponse={questionnaireResponse} onQuestionnaireResponseChanged={(newResponse)=> setQuestionnaireResponse({...newResponse})}/>}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg">
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={()=>{
                    setIsSaving(true);
                    questionnaireService.updateQuestionnaireParticipantResponse(id, farmId, questionnaireResponse).then(newResponse=>{
                      setIsSaving(false);
                      if (newResponse.serializedResponseData) newResponse.responseData = JSON.parse(newResponse.serializedResponseData);
                      setQuestionnaireResponse(newResponse);
                    });
                  }}
                  disabled={isSaving || questionnaireResponse?.status === 'completed'}
                  className="gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  Προσ. Αποθήκευση
                </Button>
              </div>

              <div className="ml-auto">
                <Button
                  onClick={()=>{
                    setIsSaving(true);
                    questionnaireResponse.status = "completed";
                    questionnaireService.updateQuestionnaireParticipantResponse(id, farmId, questionnaireResponse).then(changedResponse=>{
                      setIsSaving(false);
                      if (changedResponse.serializedResponseData) changedResponse.responseData = JSON.parse(changedResponse.serializedResponseData);
                      setQuestionnaireResponse(changedResponse);
                      navigate(`/questionnaires/${id}/sample-groups`)
                    });
                  }}
                  disabled={isSaving || questionnaireResponse?.status === 'completed'}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Οριστική υποβολή
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionnaireFill;
