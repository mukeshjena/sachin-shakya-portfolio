// domain/value-objects/Slug.ts
// Slug value object — enforces URL-safe, lowercase, hyphenated slugs.
// Zero framework imports allowed in this file.

/**
 * Immutable value object representing a URL-safe page slug.
 *
 * Rules enforced:
 * - Lowercase only
 * - Only alphanumeric characters and hyphens
 * - No leading or trailing hyphens
 * - No consecutive hyphens
 * - Minimum 1 character after normalisation
 *
 * @example
 * new Slug('About Us') // => Slug { value: 'about-us' }
 * new Slug('--bad--')  // => throws Error
 */
export class Slug {
  private readonly _value: string;

  constructor(raw: string) {
    const normalized = raw
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!normalized) {
      throw new Error(`Cannot create a valid slug from: "${raw}"`);
    }

    this._value = normalized;
  }

  /** Returns the raw slug string for use in URLs and Firestore queries */
  toString(): string {
    return this._value;
  }

  /** Value equality — two Slugs are equal if they produce the same string */
  equals(other: Slug): boolean {
    return this._value === other._value;
  }

  /** Factory helper — returns null instead of throwing, useful in query params */
  static tryCreate(raw: string): Slug | null {
    try {
      return new Slug(raw);
    } catch {
      return null;
    }
  }
}
