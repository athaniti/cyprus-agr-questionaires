import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState<"el" | "en">("el");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in real app would validate credentials
    navigate("/dashboard");
  };

  const toggleLanguage = () => {
    setLanguage(language === "el" ? "en" : "el");
  };

  // Dynamic logo loading for iOS compatibility
  const getLogoSrc = () => {
    try {
      return new URL("../assets/cyprus-ministry-logo.png", import.meta.url).href;
    } catch {
      return "/src/assets/cyprus-ministry-logo.png";
    }
  };

  const translations = {
    el: {
      title: "Υπουργείο Γεωργίας Κύπρου",
      subtitle: "δίκτυο Δεδομένων Γεωργικών Εκμεταλλεύσεων",
      email: "Email",
      password: "Κωδικός",
      rememberMe: "Να με θυμάσαι",
      signIn: "Σύνδεση",
      welcome: "Καλώς ήρθατε",
    },
    en: {
      title: "Cyprus Ministry of Agriculture",
      subtitle: "Agricultural Holdings Data Network",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      signIn: "Sign in",
      welcome: "Welcome",
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src={getLogoSrc()}
              alt="Ministry Logo"
              className="h-16 mx-auto mb-4 object-contain"
            />
            <h1 className="text-2xl font-bold text-foreground mb-1">{t.title}</h1>
            <p className="text-muted-foreground text-sm">{t.subtitle}</p>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{language.toUpperCase()}</span>
            </Button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@moa.gov.cy"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {t.rememberMe}
              </label>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-medium">
              {t.signIn}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 Ministry of Agriculture, Cyprus
        </p>
      </div>
    </div>
  );
};

export default Login;
