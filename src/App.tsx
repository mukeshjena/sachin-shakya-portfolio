// App.tsx — Step 3 placeholder: verifies DI chain end-to-end.
// No logic in this file — logic lives in App.hooks.ts (added in Step 13).
// This file will be replaced by the real provider-wrapped router in Step 13.

import { useAppPing } from "./App.hooks";

function App() {
  const pingResult = useAppPing();

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        gap: "1rem",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", color: "#f59e0b", letterSpacing: "0.05em" }}>
        Sachin Shakya
      </h1>
      <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Portfolio — scaffold ready</p>
      <code
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "#1f2937",
          borderRadius: "0.25rem",
          color: "#22c55e",
          fontSize: "0.75rem",
        }}
      >
        {pingResult}
      </code>
    </main>
  );
}

export default App;
