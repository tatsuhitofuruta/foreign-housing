import {
  sanitizeHtml,
  sanitizeInput,
  detectSQLInjection,
  validateFileSize,
  emailSchema,
  urlSchema,
  propertySearchSchema,
} from '../validation';

describe('Validation Utils', () => {
  describe('sanitizeHtml', () => {
    it('should remove HTML tags', () => {
      const dirty = '<script>alert("xss")</script>Hello';
      const clean = sanitizeHtml(dirty);
      expect(clean).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should remove HTML brackets', () => {
      expect(sanitizeInput('hello<world>')).toBe('helloworld');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(20000);
      const result = sanitizeInput(longString);
      expect(result.length).toBeLessThanOrEqual(10000);
    });
  });

  describe('detectSQLInjection', () => {
    it('should detect SQL keywords', () => {
      expect(detectSQLInjection('SELECT * FROM users')).toBe(true);
      expect(detectSQLInjection("' OR '1'='1")).toBe(true);
      expect(detectSQLInjection('DROP TABLE users')).toBe(true);
    });

    it('should allow normal input', () => {
      expect(detectSQLInjection('Hello World')).toBe(false);
      expect(detectSQLInjection('apartment in Tokyo')).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should accept valid file size', () => {
      expect(validateFileSize(1024 * 1024)).toBe(true); // 1MB
    });

    it('should reject too large files', () => {
      expect(validateFileSize(10 * 1024 * 1024)).toBe(false); // 10MB
    });

    it('should reject zero or negative sizes', () => {
      expect(validateFileSize(0)).toBe(false);
      expect(validateFileSize(-1)).toBe(false);
    });
  });

  describe('emailSchema', () => {
    it('should validate correct emails', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true);
      expect(emailSchema.safeParse('user+tag@domain.co.jp').success).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(emailSchema.safeParse('invalid').success).toBe(false);
      expect(emailSchema.safeParse('@example.com').success).toBe(false);
    });
  });

  describe('urlSchema', () => {
    it('should validate correct URLs', () => {
      expect(urlSchema.safeParse('https://example.com').success).toBe(true);
      expect(urlSchema.safeParse('http://localhost:3000').success).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(urlSchema.safeParse('not-a-url').success).toBe(false);
      expect(urlSchema.safeParse('ftp://invalid').success).toBe(false);
    });
  });

  describe('propertySearchSchema', () => {
    it('should parse valid search params', () => {
      const result = propertySearchSchema.safeParse({
        page: '1',
        limit: '12',
        query: 'Tokyo apartment',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(12);
      }
    });

    it('should apply defaults', () => {
      const result = propertySearchSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(12);
        expect(result.data.sortBy).toBe('publishedAt');
      }
    });

    it('should reject invalid values', () => {
      const result = propertySearchSchema.safeParse({
        page: '-1',
        limit: '1000',
      });
      expect(result.success).toBe(false);
    });
  });
});
