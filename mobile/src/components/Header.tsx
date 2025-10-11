import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, LogOut } from "lucide-react";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSync?: boolean;
}

export const Header = ({ title, showBack, showSync }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSync = () => {
    // Simulate sync action
    console.log("Syncing...");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-sm sticky top-0 z-10">
      {/* Safe area spacer for iOS */}
      <div className="h-safe bg-primary" />
      <div className="container max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-primary-foreground hover:bg-primary-hover"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {showSync && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSync}
                className="text-primary-foreground hover:bg-primary-hover"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-hover"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
