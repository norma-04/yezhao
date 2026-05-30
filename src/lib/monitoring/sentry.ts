// ─── 野造 · Sentry 错误监控 ───
// Error tracking, performance monitoring, and alerting

/**
 * Sentry configuration.
 *
 * Setup:
 * 1. Create a Sentry project at https://sentry.io
 * 2. Set NEXT_PUBLIC_SENTRY_DSN in your .env.production
 * 3. Set SENTRY_AUTH_TOKEN for source maps upload
 *
 * When Sentry is configured, uncomment:
 * - The sentry.client.config.ts and sentry.server.config.ts files
 * - The withSentryConfig wrapper in next.config.ts
 * - The instrumentation.ts file
 */

export const SENTRY_CONFIG = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || '',
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
}

/**
 * Check if Sentry is configured
 */
export function isSentryEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN
}
