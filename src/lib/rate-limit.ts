import { NextRequest } from 'next/server';
import { RateLimitError } from './api-response';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  async checkLimit(
    identifier: string,
    config: RateLimitConfig
  ): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests for this identifier
    const existingRequests = this.requests.get(identifier) || [];

    // Filter out requests outside the current window
    const recentRequests = existingRequests.filter((time) => time > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= config.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    return true;
  }

  private cleanup() {
    const now = Date.now();
    const cutoff = now - 3600000; // 1 hour

    for (const [key, requests] of this.requests.entries()) {
      const recentRequests = requests.filter((time) => time > cutoff);
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

const limiter = new RateLimiter();

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  }
): Promise<void> {
  // Get identifier (IP address or user ID)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

  // You can also use user ID from session if authenticated
  const identifier = ip;

  const allowed = await limiter.checkLimit(identifier, config);

  if (!allowed) {
    throw new RateLimitError(
      `Rate limit exceeded. Maximum ${config.maxRequests} requests per ${config.windowMs / 1000} seconds.`
    );
  }
}

// Predefined rate limit configs
export const RateLimits = {
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
  },
  moderate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  relaxed: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
};
