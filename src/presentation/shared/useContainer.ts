// presentation/shared/useContainer.ts
// The ONLY way presentation-layer hooks should access registered dependencies.
// Components import this hook; they NEVER import from infrastructure/ directly.

import { container } from "../../infrastructure/di/container";
import type { DiToken } from "../../infrastructure/di/tokens";

/**
 * Hook that exposes the DI container's resolve() method to presentation-layer hooks.
 *
 * Usage in a hook:
 * ```ts
 * import { useContainer } from '../shared/useContainer';
 * import { DI_TOKENS } from '../../infrastructure/di/tokens';
 * import type { IPageRepository } from '../../domain/repositories/content/IPageRepository';
 *
 * export function usePage(slug: string) {
 *   const repo = useContainer<IPageRepository>(DI_TOKENS.PageRepository);
 *   // ...
 * }
 * ```
 *
 * @throws {Error} if the requested token has not been registered in container.ts bootstrap.
 */
export function useContainer<T>(token: DiToken): T {
  // container.resolve() throws a descriptive error if the token is unregistered,
  // which will surface as a React error boundary hit — desirable during development.
  return container.resolve<T>(token);
}
