// App.tsx — Application root container.
// Pure declarative JSX markup (agent rule #3 / Rule 13).
// All logic, state, and DI hooks live in App.hooks.ts.

import { useAppState } from "./App.hooks";
import { ComingSoon } from "./presentation/coming-soon/ComingSoon";
import { PipelineTest } from "./presentation/pages/pipeline-test/PipelineTest";
import { ThemeProvider } from "./presentation/theme/ThemeProvider";

function App() {
  const { showPipelineTest } = useAppState();

  return (
    <ThemeProvider>
      {showPipelineTest ? (
        <main className="min-h-screen bg-[var(--ink-900)] p-6 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <PipelineTest />
          </div>
        </main>
      ) : (
        <ComingSoon />
      )}
    </ThemeProvider>
  );
}

export default App;
