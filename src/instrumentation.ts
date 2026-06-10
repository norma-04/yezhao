// ─── 野造 · Instrumentation ───
// Next.js instrumentation hook for server-side setup

export async function register() {
  // Provide a no-op WebSocket stub for EdgeOne / Node 18 environments.
  // Supabase's Realtime subsystem checks for WebSocket on init but we never
  // use Realtime on the server — just need to prevent a crash.
  if (typeof globalThis.WebSocket === 'undefined') {
    ;(globalThis as Record<string, unknown>).WebSocket = class WebSocketStub {
      static CONNECTING = 0
      static OPEN = 1
      static CLOSING = 2
      static CLOSED = 3
      readyState = WebSocketStub.CLOSED
      constructor() { /* noop */ }
      send() { /* noop */ }
      close() { /* noop */ }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      addEventListener(_type: string, _listener: unknown) { /* noop */ }
      removeEventListener() { /* noop */ }
      dispatchEvent() { return true }
    } as unknown as typeof WebSocket
    console.log('[Instrumentation] WebSocket stub applied (no realtime on server)')
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Instrumentation] Development server started')
  }
}
