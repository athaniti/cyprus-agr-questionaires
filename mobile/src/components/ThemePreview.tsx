import { Form } from "@formio/react";
import '@formio/js/dist/formio.full.min.css';
import { Questionnaire, QuestionnaireResponse, Theme } from "@/services/questionnaires";



export const ThemePreview = ({ 
  theme, 
  mode, 
  questionnaire, 
  questionnaireResponse,
  onQuestionnaireResponseChanged 
}: { 
  theme: Theme, 
  mode: 'mobile'|'desktop', 
  questionnaire? : Questionnaire|undefined, 
  questionnaireResponse?: QuestionnaireResponse|undefined,
  onQuestionnaireResponseChanged?: (newResponse: QuestionnaireResponse) => void
}) => {

  const handleFormChange = (submission: any) => {
    if (!onQuestionnaireResponseChanged) return;
    const data = submission?.data ?? submission?.submission?.data ?? submission;
    const updated: Partial<QuestionnaireResponse> = {
      ...(questionnaireResponse ?? {}),
      responseData: data,
      serializedResponseData: JSON.stringify(data),
    };

    // Cast to QuestionnaireResponse for callback convenience
    onQuestionnaireResponseChanged(updated as QuestionnaireResponse);
  };
  return (
    <>
    <div className={`border rounded-lg overflow-hidden mx-auto mt-4 w-full`}>
                <div 
                  className="p-8"
                  style={{ 
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    fontFamily: theme.bodyFont,
                    fontSize: `${theme.bodyFontSize}px`
                  }}
                >
                  {/* Logo */}
                  {theme.logoImageBase64 && (
                    <div className={`mb-8 ${
                      theme.logoPosition === 'center' ? 'text-center' :
                      theme.logoPosition === 'right' ? 'text-right' : 'text-left'
                    }`}>
                      <img 
                        src={theme.logoImageBase64} 
                        alt="Logo" 
                        className="h-16 inline-block"
                      />
                    </div>
                  )}

                  {/* Header */}
                  <h1 
                    className="mb-6"
                    style={{
                      fontFamily: theme.headerFont,
                      fontSize: `${theme.headerFontSize}px`,
                      color: theme.primaryColor,
                      fontWeight: 'bold'
                    }}
                  >
                    {questionnaire ? questionnaire.name : 'Έρευνα Γεωργικών Εκμεταλλεύσεων Κύπρου 2025'}
                  </h1>

                  {/* Sample Form */}
                  <div className="space-y-6">
                    <div>
                      <div 
                        className="mb-4"
                      >
                        {questionnaire ? (questionnaire.description ?? 'Χωρίς περιγραφή') : 'Δοκιμαστική έρευνα'}
                      </div>

                      {(questionnaire && questionnaire.schema && questionnaire.schema.components && questionnaire.schema.components.length) ? 
                        <Form src="" form={questionnaire.schema} submission={{data:questionnaireResponse?.responseData}} onChange={handleFormChange} /> : 
                        <>
                            <div className="grid gap-4">
                                <div>
                                <label className="block mb-2 font-medium">
                                    Όνομα Αγρότη:
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 border rounded-lg"
                                    placeholder={'Εισάγετε το όνομά σας'}
                                    style={{ borderColor: theme.primaryColor }}
                                />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Μέγεθος Εκμετάλλευσης (στρέμματα):
                                    </label>
                                    <input 
                                        type="number" 
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="0"
                                        style={{ borderColor: theme.primaryColor }}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Κύριος Τύπος Καλλιέργειας
                                    </label>
                                    <select 
                                        className="w-full p-3 border rounded-lg"
                                        style={{ borderColor: theme.primaryColor }}
                                    >
                                        <option>Επιλέξτε τύπο καλλιέργειας...</option>
                                        <option>Σιτηρά</option>
                                        <option>Λαχανικά</option>
                                        <option>Φρούτα</option>
                                        <option>Ελιές</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4" style={{marginTop: 20}}>
                                <button 
                                    className="px-6 py-3 rounded-lg text-white font-medium"
                                    style={{ backgroundColor: theme.primaryColor }}
                                >
                                    Προηγούμενο
                                </button>
                                <button 
                                    className="px-6 py-3 rounded-lg text-white font-medium"
                                    style={{ backgroundColor: theme.secondaryColor }}
                                >
                                    Επόμενο
                                </button>
                            </div>
                        </>}
                    </div>

                    
                  </div>
                </div>
              </div>
    </>
  );
}