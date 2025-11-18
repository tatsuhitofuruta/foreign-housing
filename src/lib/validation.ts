import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize user input for safe storage
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 10000); // Limit length
}

/**
 * Validate email format
 */
export const emailSchema = z.string().email().max(255);

/**
 * Validate URL format
 */
export const urlSchema = z.string().url().max(2048);

/**
 * Validate property search query
 */
export const propertySearchSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  query: z.string().max(200).optional(),
  propertyType: z.array(z.enum(['APARTMENT', 'HOUSE', 'CONDO', 'STUDIO', 'TOWNHOUSE', 'PENTHOUSE'])).optional(),
  minPrice: z.coerce.number().min(0).max(100000000).optional(),
  maxPrice: z.coerce.number().min(0).max(100000000).optional(),
  bedrooms: z.coerce.number().int().min(0).max(20).optional(),
  prefecture: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  sortBy: z.enum(['publishedAt', 'price', 'createdAt', 'viewCount']).default('publishedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Validate image upload
 */
export const imageUploadSchema = z.object({
  fileName: z.string().min(1).max(255).regex(/^[\w\-. ]+$/),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  folder: z.string().max(100).regex(/^[\w\-/]+$/).optional(),
});

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(size: number, maxSize: number = 5 * 1024 * 1024): boolean {
  return size > 0 && size <= maxSize;
}

/**
 * Check if string contains SQL injection patterns
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)|(-{2})|(\bOR\b.*=.*)|(\bAND\b.*=.*)/i;
  return sqlPattern.test(input);
}

/**
 * Safe parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Escape special characters for regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate random secure token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
}
