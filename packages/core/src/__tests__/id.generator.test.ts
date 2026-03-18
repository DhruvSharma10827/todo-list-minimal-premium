import { UuidGenerator } from '../utils/id.generator';

describe('UuidGenerator', () => {
  let generator: UuidGenerator;

  beforeEach(() => {
    generator = new UuidGenerator();
  });

  describe('generate', () => {
    it('should generate a non-empty string', () => {
      const id = generator.generate();
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generator.generate());
      }
      expect(ids.size).toBe(100);
    });
  });
});
