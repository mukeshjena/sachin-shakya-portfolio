// domain/value-objects/AccessCode.ts
// AccessCode value object — wraps the 6-digit admin OTP.
// Zero framework imports allowed in this file.

/**
 * Immutable value object representing a 6-digit numeric admin access code.
 *
 * The plain code is held only in memory during the request lifecycle.
 * Persistence always stores a hash (see IAdminAccessRepository).
 *
 * @example
 * new AccessCode('123456') // valid
 * new AccessCode('12345')  // throws — must be exactly 6 digits
 * new AccessCode('12345a') // throws — digits only
 */
export class AccessCode {
  private readonly _value: string;

  constructor(code: string) {
    if (!/^\d{6}$/.test(code)) {
      throw new Error(`Access code must be exactly 6 numeric digits. Received: "${code}"`);
    }
    this._value = code;
  }

  /** Returns the raw 6-digit string — only pass to hashing functions, never to the client */
  toString(): string {
    return this._value;
  }

  /** Value equality */
  equals(other: AccessCode): boolean {
    return this._value === other._value;
  }

  /**
   * Generates a cryptographically random 6-digit code.
   * Uses crypto.getRandomValues for security (works in browser + Node 24).
   */
  static generate(): AccessCode {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    // Map to range [100000, 999999] to guarantee 6 digits
    const code = (100000 + (array[0] % 900000)).toString();
    return new AccessCode(code);
  }
}
