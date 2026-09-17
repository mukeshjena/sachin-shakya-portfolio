// App.tsx — Minimal placeholder for Step 1.
// Real app shell (providers, router, layout) is assembled in Steps 13–14.
// Logic lives in co-located hooks/.ts files, never in this file.

function App() {
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
      <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Portfolio loading — scaffold ready.</p>
    </main>
  );
}

export default App;
