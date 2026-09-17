import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { bootstrapContainer } from "./infrastructure/di/bootstrap";
import { loadRemoteEnvConfig } from "./infrastructure/system/env";

async function bootstrap() {
  await loadRemoteEnvConfig();
  bootstrapContainer();

  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element #root not found in index.html");

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap application:", err);
});
