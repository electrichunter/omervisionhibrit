type RateLimitDescriptor = {
    count: number
    lastReset: number
}

// Global olarak in-memory IP sayacı
const rateLimitCache = new Map<string, RateLimitDescriptor>()

interface RateLimitConfig {
    interval: number // milliseconds, e.g., 60000 for 1 minute
    maxRequests: number // max requests per interval
}

/**
 * Basic in-memory rate limiter for Next.js App Router API Routes or Server Actions
 * @param ip Client IP address or unique identifier
 * @param config Configuration for the rate limit
 * @returns boolean where true means "Allowed" and false means "Rate Limited (Too Many Requests)"
 */
export function rateLimiter(ip: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const record = rateLimitCache.get(ip)

    if (!record) {
        rateLimitCache.set(ip, { count: 1, lastReset: now })
        return true
    }

    // Reset interval if enough time has passed
    if (now - record.lastReset > config.interval) {
        record.count = 1
        record.lastReset = now
        return true
    }

    // Increment and check
    if (record.count >= config.maxRequests) {
        return false // Rate limited
    }

    record.count += 1
    return true
}
