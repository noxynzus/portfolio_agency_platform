/**
 * Rate Limiting Utility
 * In-memory rate limiter for server actions
 * Uses IP address and action identifier for rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store rate limit data in memory (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Optional message when rate limit is exceeded
   */
  message?: string;
}

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier (usually IP address + action name)
 * @param config - Rate limit configuration
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  message?: string;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // If no entry exists or reset time passed, create new entry
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      message:
        config.message ||
        `Too many requests. Please try again in ${Math.ceil(
          (entry.resetAt - now) / 1000
        )} seconds.`,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Clean up expired rate limit entries (optional - for memory management)
 * Call this periodically in production
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  return cleaned;
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(headers: Headers): string {
  // Try various headers (works with most proxies/CDNs)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfIP = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfIP) {
    return cfIP;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Contact form: 5 submissions per 15 minutes per IP
   */
  CONTACT_FORM: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message:
      'Too many contact form submissions. Please try again in a few minutes.',
  },

  /**
   * Login: 10 attempts per 15 minutes per IP
   */
  LOGIN: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again later.',
  },

  /**
   * API: 60 requests per minute
   */
  API_GENERAL: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    message: 'API rate limit exceeded. Please try again later.',
  },

  /**
   * File upload: 10 uploads per hour
   */
  FILE_UPLOAD: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Upload limit reached. Please try again later.',
  },
} as const;

// Clean up expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = cleanupRateLimitStore();
    if (cleaned > 0) {
      console.log(`[Rate Limit] Cleaned up ${cleaned} expired entries`);
    }
  }, 10 * 60 * 1000);
}
