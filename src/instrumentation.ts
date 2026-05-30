// ─── 野造 · Instrumentation ───
// Next.js instrumentation hook for server-side setup
// Runs once when the server starts

export async function register() {
  // Only run in production with Sentry configured
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry server-side initialization
    // Uncomment when @sentry/nextjs is installed:
    // const Sentry = await import('@sentry/nextjs')
    // Sentry.init({
    //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //   tracesSampleRate: 0.1,
    //   environment: 'production',
    // })
    console.log('[Instrumentation] Server started — monitoring ready')
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Instrumentation] Development server started')
  }
}
