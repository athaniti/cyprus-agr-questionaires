import { useState } from "react";
import { Link } from "react-router-dom";
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
import { FileText, ChevronRight, Filter, Loader2, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { useMyQuestionnaires as useMyQuestionnaires } from "@/hooks/useMyQuestionnaires";

const QuestionnairesList = () => {
  
  const { data: questionnairesData, isLoading, error } = useMyQuestionnaires({
    pageSize: 50,
  });

  const questionnaires = questionnairesData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ενεργό";
      default:
        return "Ανενεργό";
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header title="Ερωτηματολόγια" showBack />
        <main className="container max-w-4xl mx-auto p-4 pb-20">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Φόρτωση ερωτηματολογίων...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header title="Ερωτηματολόγια" showBack />
        <main className="container max-w-4xl mx-auto p-4 pb-20">
          <Card className="p-6 border-destructive">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Σφάλμα φόρτωσης</h3>
                <p className="text-sm text-muted-foreground">
                  Δεν ήταν δυνατή η φόρτωση των ερωτηματολογίων. Δοκιμάστε ξανά.
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
      <Header title="Ερωτηματολόγια" showBack />

      <main className="container max-w-4xl mx-auto p-4 pb-20">
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {questionnaires.length} ερωτηματολόγια
            {questionnairesData?.totalCount && questionnairesData.totalCount > questionnaires.length && (
              <span> (από σύνολο {questionnairesData.totalCount})</span>
            )}
          </p>
        </div>

        {/* Questionnaires List */}
        <div className="space-y-3">
          {questionnaires.length === 0 ? (
            <Card className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                Δεν βρέθηκαν ερωτηματολόγια που να σας έχουν ανατεθεί
              </h3>
            </Card>
          ) : (
            questionnaires.map((q, index) => (
              <Link key={q.id} to={`/questionnaires/${q.id}/sample-groups`}>
                <Card
                  className="p-4 hover:shadow-card transition-shadow cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {q.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {q.description || "Χωρίς περιγραφή"}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(q.createdAt).toLocaleDateString("el-GR")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Πλήθος απαντήσεων: {q.responsesCount}
                      </span>
                    </div>
                    <Badge className={getStatusColor(q.status)}>
                      {getStatusLabel(q.status)}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionnairesList;
