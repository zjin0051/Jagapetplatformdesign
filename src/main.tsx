import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { CompareProvider } from "./app/context/CompareContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <CompareProvider>
    <App />
  </CompareProvider>,
);
