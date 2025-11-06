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
import { useQuestionnaires } from "@/hooks/useQuestionnaires";

type QuestionnaireStatus = "draft" | "active" | "completed" | "archived";

const QuestionnaireList = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const { data: questionnairesData, isLoading, error } = useQuestionnaires({
    status: filterStatus !== "all" ? filterStatus : undefined,
    category: filterCategory !== "all" ? filterCategory : undefined,
    pageSize: 50,
  });

  const questionnaires = questionnairesData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "archived":
        return "bg-success/10 text-success border-success/20";
      case "active":
        return "bg-primary/10 text-primary border-primary/20";
      case "draft":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Ολοκληρωμένο";
      case "active":
        return "Ενεργό";
      case "draft":
        return "Πρόχειρο";
      case "archived":
        return "Αρχειοθετημένο";
      default:
        return "Άγνωστο";
    }
  };

  // Categories for filtering
  const categories = Array.from(new Set(questionnaires.map(q => q.category).filter(Boolean)));

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
        {/* Filters */}
        <Card className="p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Φίλτρα</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Κατάσταση
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες</SelectItem>
                  <SelectItem value="draft">Πρόχειρο</SelectItem>
                  <SelectItem value="active">Ενεργό</SelectItem>
                  <SelectItem value="completed">Ολοκληρωμένο</SelectItem>
                  <SelectItem value="archived">Αρχειοθετημένο</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Κατηγορία
              </label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

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
                Δεν βρέθηκαν ερωτηματολόγια
              </h3>
              <p className="text-sm text-muted-foreground">
                Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης.
              </p>
            </Card>
          ) : (
            questionnaires.map((q, index) => (
              <Link key={q.id} to={`/questionnaire/${q.id}`}>
                <Card
                  className="p-4 hover:shadow-card transition-shadow cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {q.id.substring(0, 8)}...
                        </span>
                      </div>
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
                      <Badge variant="outline" className="text-xs">
                        {q.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(q.createdAt).toLocaleDateString("el-GR")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {q.currentResponses}/{q.targetResponses}
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

export default QuestionnaireList;
