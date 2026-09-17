import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { bootstrapContainer } from "./infrastructure/di/bootstrap";

// Bootstrap DI container before any component renders
bootstrapContainer();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found in index.html");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
