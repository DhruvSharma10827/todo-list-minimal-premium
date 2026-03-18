import { ITimestampProvider } from '../interfaces';

/**
 * ISO Timestamp Provider Implementation
 * Provides ISO 8601 formatted timestamps
 * Follows Single Responsibility Principle - only responsible for timestamp generation
 */
export class IsoTimestampProvider implements ITimestampProvider {
  /**
   * Get current timestamp in ISO 8601 format
   */
  now(): string {
    return new Date().toISOString();
  }
}

/**
 * Factory function to create a timestamp provider
 * Follows Factory Pattern for flexibility
 */
export function createTimestampProvider(): ITimestampProvider {
  return new IsoTimestampProvider();
}
