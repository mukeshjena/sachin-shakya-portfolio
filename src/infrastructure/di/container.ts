// infrastructure/di/container.ts
// Hand-rolled DI container — intentionally lightweight to stay under the
// Cloudflare Workers 1 MB script size limit (agent rule #11).
// No reflection, no decorators, no heavy frameworks.

import type { DiToken } from "./tokens";

/** A factory function that produces a service instance on demand */
type Factory<T> = () => T;

/**
 * Minimal typed dependency injection container.
 *
 * Registration:  container.register(DI_TOKENS.PageRepository, () => new FirestorePageRepository())
 * Resolution:    container.resolve<IPageRepository>(DI_TOKENS.PageRepository)
 *
 * This is a "factory" container (not singleton by default).
 * To make a singleton, wrap the factory with a lazy singleton helper (see `singleton` below).
 */
class Container {
  private readonly registry = new Map<symbol, Factory<unknown>>();

  /**
   * Registers a factory for a given token.
   * Calling register() a second time with the same token overwrites the previous binding
   * (useful for test overrides).
   */
  register<T>(token: DiToken, factory: Factory<T>): void {
    this.registry.set(token, factory as Factory<unknown>);
  }

  /**
   * Resolves a dependency by token.
   * @throws {Error} if no binding has been registered for the token.
   */
  resolve<T>(token: DiToken): T {
    const factory = this.registry.get(token);
    if (!factory) {
      throw new Error(
        `[DI] No binding found for token: ${token.toString()}. ` +
          "Did you call container.register() for this token in your bootstrap?"
      );
    }
    return factory() as T;
  }

  /** Returns true if a binding exists for the given token */
  has(token: DiToken): boolean {
    return this.registry.has(token);
  }

  /** Removes all registrations — used in tests to reset state between suites */
  clear(): void {
    this.registry.clear();
  }
}

/**
 * Singleton wrapper — memoises the first call to the factory.
 * Usage: container.register(DI_TOKENS.PageRepository, singleton(() => new FirestorePageRepository()))
 */
export function singleton<T>(factory: Factory<T>): Factory<T> {
  let instance: T | undefined;
  return () => {
    if (instance === undefined) {
      instance = factory();
    }
    return instance;
  };
}

/** The global application container — import this everywhere you need DI */
export const container = new Container();
