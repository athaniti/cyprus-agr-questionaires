
  import '@formio/js/dist/formio.full.min.css';
  import '@formio/js/dist/formio.builder.min.css';
  // optionally, if you rely on Bootstrap styling for Form.io widgets:
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  