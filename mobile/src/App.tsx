import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuestionnairesList from "./pages/QuestionnairesList";
import QuestionnaireFill from "./pages/QuestionnaireFill";
import NotFound from "./pages/NotFound";
import SampleGroupsList from "./pages/SampleGroupsList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen pb-safe-bottom">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questionnaires" element={<QuestionnairesList />} />
            <Route path="/questionnaires/:id/sample-groups" element={<SampleGroupsList />} />
            <Route path="/questionnaires/:id/farms/:farmId/responses" element={<QuestionnaireFill />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
