import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@formio/js/dist/formio.full.min.css';
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
