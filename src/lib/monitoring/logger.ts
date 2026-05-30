// ─── 野造 · Logger ───
// Structured logging with levels, user context, and admin alerting

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  userId?: string
  path?: string
  data?: Record<string, unknown>
  error?: string
  stack?: string
}

class Logger {
  private buffer: LogEntry[] = []
  private readonly maxBufferSize = 100

  private createEntry(level: LogLevel, message: string, data?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      ...(typeof window !== 'undefined' ? { path: window.location.pathname } : {}),
    }
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error) {
    const entry = this.createEntry(level, message, {
      ...data,
      ...(error && { error: error.message, stack: error.stack }),
    })

    // Console output
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`
    switch (level) {
      case 'debug': console.debug(prefix, message, data || ''); break
      case 'info': console.info(prefix, message, data || ''); break
      case 'warn': console.warn(prefix, message, data || ''); break
      case 'error': case 'fatal': console.error(prefix, message, data || '', error || ''); break
    }

    // Buffer for batch sending to remote logging
    this.buffer.push(entry)
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush()
    }
  }

  debug(message: string, data?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data)
    }
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('info', message, data)
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log('warn', message, data)
  }

  error(message: string, error?: Error, data?: Record<string, unknown>) {
    this.log('error', message, data, error)

    // Send to Sentry if configured
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Uncomment when @sentry/nextjs is installed:
      // import('@sentry/nextjs').then(Sentry => {
      //   Sentry.captureException(error || new Error(message), { extra: data })
      // })
    }
  }

  fatal(message: string, error?: Error, data?: Record<string, unknown>) {
    this.log('fatal', message, data, error)
  }

  /**
   * Send buffered logs to remote endpoint (Vercel Log Drain or custom)
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return

    const logs = [...this.buffer]
    this.buffer = []

    if (process.env.NODE_ENV !== 'production') return

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      })
    } catch {
      // Silently fail — don't cause cascading errors
    }
  }
}

export const logger = new Logger()

// ─── Admin Alerting ───

export async function sendAdminAlert(event: {
  title: string
  severity: 'info' | 'warning' | 'critical'
  description?: string
  data?: Record<string, unknown>
}) {
  logger.warn(`[Admin Alert] ${event.title}`, { severity: event.severity, ...event.data })

  // In production, also send to email/Slack/Discord
  if (process.env.NODE_ENV === 'production' && event.severity === 'critical') {
    try {
      await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
    } catch {
      // best effort
    }
  }
}
