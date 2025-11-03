
  import './index.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import '@formio/js/dist/formio.full.min.css';
  import '@formio/js/dist/formio.builder.min.css';
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import { AuthProvider } from "./contexts/AuthContext.tsx";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  