import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  RefreshCw,
  FileText,
  MapPin,
} from "lucide-react";
import { Header } from "@/components/Header";

const Dashboard = () => {
  const stats = {
    total: 45,
    completed: 28,
    pending: 17,
    completionRate: 62,
  };

  const regionData = [
    { name: "Λευκωσία", total: 15, completed: 10, pending: 5 },
    { name: "Λεμεσός", total: 12, completed: 8, pending: 4 },
    { name: "Λάρνακα", total: 10, completed: 6, pending: 4 },
    { name: "Πάφος", total: 8, completed: 4, pending: 4 },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header title="Αρχική" showSync />

      <main className="container max-w-4xl mx-auto p-4 pb-20">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-up">
          <Card className="p-5 bg-primary text-primary-foreground shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Σύνολο</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <ClipboardList className="h-8 w-8 opacity-80" />
            </div>
          </Card>

          <Card className="p-5 bg-success text-success-foreground shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Ολοκληρωμένα</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 opacity-80" />
            </div>
          </Card>

          <Card className="p-5 bg-warning text-warning-foreground shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Εκκρεμή</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </Card>

          <Card className="p-5 bg-card shadow-card border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ποσοστό</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.completionRate}%
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Region Breakdown */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Ανά Περιοχή
          </h2>
          <div className="space-y-3">
            {regionData.map((region, index) => (
              <Card
                key={region.name}
                className="p-4 shadow-sm hover:shadow-card transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{region.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {region.total} σύνολο
                  </Badge>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-success/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Ολοκληρωμένα
                    </p>
                    <p className="text-lg font-bold text-success">
                      {region.completed}
                    </p>
                  </div>
                  <div className="flex-1 bg-warning/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Εκκρεμή</p>
                    <p className="text-lg font-bold text-warning">
                      {region.pending}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Link to="/questionnaires">
            <Button className="w-full h-14 text-base justify-start gap-3 shadow-sm">
              <FileText className="h-5 w-5" />
              Προβολή Όλων των Ερωτηματολογίων
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
