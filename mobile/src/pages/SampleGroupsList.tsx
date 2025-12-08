import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, ChevronRight, Filter, Loader2, AlertCircle, Square } from "lucide-react";
import { Header } from "@/components/Header";
import { useMyQuestionnaires as useMyQuestionnaires } from "@/hooks/useMyQuestionnaires";
import { Farm, questionnaireService, SampleGroup } from "@/services/questionnaires";

const SampleGroupsList = () => {
  const { id } = useParams();
  const [sampleGroups, setSampleGroups] = useState<SampleGroup[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(()=>{
    setIsLoading(true);
    setIsError(false);
    questionnaireService.getSamplrGroups(id, {userId:'11111111-1111-1111-1111-111111111111'}).then(sampleGroups=>{
      if (sampleGroups.length) {
        questionnaireService.getSampleParticipants(sampleGroups[0].sampleId).then(farms=> {
          setIsLoading(false);
          setFarms(farms);
          setSampleGroups(sampleGroups.map(sg => {
            sg.farmIds = JSON.parse(sg.serializedFarmIds);
            sg.criteria = JSON.parse(sg.serizedCriteria??"{}");
            return sg;
          }));
        })
        return;
      }
      
      setIsLoading(false);
      setSampleGroups(sampleGroups);
    }).catch(()=>{
      setIsError(true);
      setIsLoading(false);
    });
  }, []);

  


  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header title="Ερωτηματολόγια" showBack />
        <main className="container max-w-4xl mx-auto p-4 pb-20">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Φόρτωση δειγμάτων...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header title="Εκμεταλλεύσεις" showBack />
        <main className="container max-w-4xl mx-auto p-4 pb-20">
          <Card className="p-6 border-destructive">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Σφάλμα φόρτωσης</h3>
                <p className="text-sm text-muted-foreground">
                  Δεν ήταν δυνατή η φόρτωση των δειγμάτων - εκμεταλλεύσεων. Δοκιμάστε ξανά.
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header title="Εκμεταλλεύσεις" showBack />

      <main className="container max-w-4xl mx-auto p-4 pb-20">

        {/* Sample Groups List */}
        <div className="space-y-3">
          {sampleGroups.length === 0 ? (
            <Card className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                Δεν βρέθηκαν δείγματα ερωτηματολογίου - εκμεταλλεύσεις που να σας έχουν ανατεθεί
              </h3>
            </Card>
          ) : (
            sampleGroups.map((sg, index) => (
              <Card key={index}
                className="p-4 hover:shadow-card transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Ερωτηματολόγιο: {sg.questionnaireName}
                    </h3>
                    <h3 className="font-semibold text-foreground mb-1">
                      Δείγμα: {sg.sampleName} - {sg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {sg.description || "Χωρίς περιγραφή"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 border-t pt-4">
                  {sg.farmIds!.map(farmId=> {
                    const farm = farms.find(f=>f.id === farmId);
                    return (
                      <Link 
                        key={farmId}
                        to={`/questionnaires/${sg.questionnaireId}/farms/${farmId}/responses`}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent/10 hover:border-accent hover:shadow-sm transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                            {farm.farmCode}
                          </p>
                          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {farm.ownerName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-accent transition-colors">
                          <span className="whitespace-nowrap">Προβολή ερωτηματολογίου</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SampleGroupsList;
