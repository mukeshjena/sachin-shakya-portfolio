// presentation/providers/errors/ErrorBoundary.types.ts
// Type definitions for ErrorBoundary component and diagnostics fallback.

import type { ErrorInfo, ReactNode } from "react";

export interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
  readonly onReset?: () => void;
}

export interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
  readonly errorInfo: ErrorInfo | null;
}

export interface ErrorBoundaryFallbackProps {
  readonly error: Error | null;
  readonly errorInfo: ErrorInfo | null;
  readonly onReset: () => void;
}
