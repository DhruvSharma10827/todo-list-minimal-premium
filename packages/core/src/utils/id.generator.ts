import type { IIdGenerator } from '../interfaces';

/**
 * UUID Generator Implementation
 * Generates unique identifiers using crypto API
 * Follows Single Responsibility Principle - only responsible for ID generation
 */
export class UuidGenerator implements IIdGenerator {
  /**
   * Generate a unique identifier
   * Uses crypto.randomUUID if available, otherwise falls back to timestamp-based ID
   */
  generate(): string {
    // Check if crypto.randomUUID is available (React Native environment may not have it)
    // Using globalThis for cross-platform compatibility
    const globalCrypto = (
      globalThis as unknown as { crypto?: { randomUUID?: () => string } }
    ).crypto;
    if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
      return globalCrypto.randomUUID();
    }

    // Fallback: timestamp-based ID with random suffix
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 11);
    return `${timestamp}-${randomPart}`;
  }
}

/**
 * Factory function to create a UUID generator
 * Follows Factory Pattern for flexibility
 */
export function createIdGenerator(): IIdGenerator {
  return new UuidGenerator();
}
