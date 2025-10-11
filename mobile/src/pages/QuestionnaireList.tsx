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
import { FileText, ChevronRight, Filter } from "lucide-react";
import { Header } from "@/components/Header";

type QuestionnaireStatus = "pending" | "in_progress" | "completed";

interface Questionnaire {
  id: string;
  title: string;
  farmName: string;
  region: string;
  assignedDate: string;
  status: QuestionnaireStatus;
}

const QuestionnaireList = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRegion, setFilterRegion] = useState<string>("all");

  const questionnaires: Questionnaire[] = [
    {
      id: "Q001",
      title: "Γεωργική Παραγωγή 2025",
      farmName: "Αγρόκτημα Παπαδόπουλου",
      region: "Λευκωσία",
      assignedDate: "2025-01-05",
      status: "pending",
    },
    {
      id: "Q002",
      title: "Κτηνοτροφία & Ζωική Παραγωγή",
      farmName: "Κτήμα Γεωργίου",
      region: "Λεμεσός",
      assignedDate: "2025-01-04",
      status: "in_progress",
    },
    {
      id: "Q003",
      title: "Αρδευτικά Συστήματα",
      farmName: "Αγροτική Μονάδα Χριστοδούλου",
      region: "Λάρνακα",
      assignedDate: "2025-01-03",
      status: "completed",
    },
    {
      id: "Q004",
      title: "Οργανική Καλλιέργεια",
      farmName: "Βιολογική Φάρμα Νικολάου",
      region: "Πάφος",
      assignedDate: "2025-01-02",
      status: "pending",
    },
    {
      id: "Q005",
      title: "Χρήση Λιπασμάτων",
      farmName: "Αγρόκτημα Ανδρέου",
      region: "Λευκωσία",
      assignedDate: "2025-01-01",
      status: "completed",
    },
  ];

  const getStatusColor = (status: QuestionnaireStatus) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "in_progress":
        return "bg-primary/10 text-primary border-primary/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  const getStatusLabel = (status: QuestionnaireStatus) => {
    switch (status) {
      case "completed":
        return "Ολοκληρωμένο";
      case "in_progress":
        return "Σε Εξέλιξη";
      case "pending":
        return "Εκκρεμές";
    }
  };

  const filteredQuestionnaires = questionnaires.filter((q) => {
    if (filterStatus !== "all" && q.status !== filterStatus) return false;
    if (filterRegion !== "all" && q.region !== filterRegion) return false;
    return true;
  });

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
                  <SelectItem value="pending">Εκκρεμές</SelectItem>
                  <SelectItem value="in_progress">Σε Εξέλιξη</SelectItem>
                  <SelectItem value="completed">Ολοκληρωμένο</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Περιοχή
              </label>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες</SelectItem>
                  <SelectItem value="Λευκωσία">Λευκωσία</SelectItem>
                  <SelectItem value="Λεμεσός">Λεμεσός</SelectItem>
                  <SelectItem value="Λάρνακα">Λάρνακα</SelectItem>
                  <SelectItem value="Πάφος">Πάφος</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredQuestionnaires.length} ερωτηματολόγια
          </p>
        </div>

        {/* Questionnaires List */}
        <div className="space-y-3">
          {filteredQuestionnaires.map((q, index) => (
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
                        {q.id}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {q.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{q.farmName}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {q.region}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(q.assignedDate).toLocaleDateString("el-GR")}
                    </span>
                  </div>
                  <Badge className={getStatusColor(q.status)}>
                    {getStatusLabel(q.status)}
                  </Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QuestionnaireList;
