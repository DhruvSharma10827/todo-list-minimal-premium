import { IsoTimestampProvider } from '../utils/timestamp.provider';

describe('IsoTimestampProvider', () => {
  let provider: IsoTimestampProvider;

  beforeEach(() => {
    provider = new IsoTimestampProvider();
  });

  describe('now', () => {
    it('should return an ISO 8601 formatted string', () => {
      const timestamp = provider.now();
      expect(timestamp).toBeDefined();
      expect(typeof timestamp).toBe('string');
      // ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should return a valid Date', () => {
      const timestamp = provider.now();
      const date = new Date(timestamp);
      expect(date instanceof Date).toBe(true);
      expect(Number.isNaN(date.getTime())).toBe(false);
    });

    it('should return increasing timestamps', () => {
      const first = provider.now();
      // Small delay to ensure different timestamps
      const start = Date.now();
      while (Date.now() - start < 2) {
        // Wait for at least 2ms
      }
      const second = provider.now();
      expect(new Date(second).getTime()).toBeGreaterThanOrEqual(
        new Date(first).getTime(),
      );
    });
  });
});
