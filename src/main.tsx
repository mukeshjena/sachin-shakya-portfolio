import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { bootstrapContainer } from "./infrastructure/di/bootstrap";
import { registerServiceWorker } from "./infrastructure/pwa/ServiceWorkerManager";
import { loadRemoteEnvConfig } from "./infrastructure/system/env";

async function bootstrap() {
  await loadRemoteEnvConfig();
  bootstrapContainer();
  registerServiceWorker();

  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element #root not found in index.html");

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Suppress harmless external browser extension disconnection errors
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const msg = event.reason?.message || String(event.reason || "");
    if (
      msg.includes("Could not establish connection. Receiving end does not exist") ||
      msg.includes("Receiving end does not exist")
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap application:", err);
});
