// ─── 野造 · Instrumentation ───
// Next.js instrumentation hook for server-side setup
// Runs once when the server starts

export async function register() {
  // Polyfill WebSocket for Node.js 18 (EdgeOne Pages, etc.)
  // Supabase Realtime client requires WebSocket, which is only native in Node.js 22+
  if (typeof globalThis.WebSocket === 'undefined') {
    try {
      const { WebSocket } = await import('ws')
      ;(globalThis as unknown as Record<string, unknown>).WebSocket = WebSocket
      console.log('[Instrumentation] WebSocket polyfill applied (Node.js < 22)')
    } catch {
      console.warn('[Instrumentation] WebSocket polyfill unavailable — Realtime features disabled')
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Instrumentation] Development server started')
  }
}
