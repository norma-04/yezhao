// ─── WebSocket stub for Node.js < 22 ───
// MUST be imported BEFORE any @supabase/* package to prevent
// Realtime subsystem from crashing on EdgeOne / Node 18 runtimes.
// Applied only when native WebSocket is unavailable.

if (typeof globalThis.WebSocket === 'undefined') {
  const Stub = class {
    readyState = 3 // CLOSED
    onopen = null
    onclose = null
    onerror = null
    onmessage = null
    constructor() { /* noop — server-side doesn't need realtime */ }
    send() { /* noop */ }
    close() { /* noop */ }
    addEventListener() { /* noop */ }
    removeEventListener() { /* noop */ }
    dispatchEvent() { return true }
  }
  ;(globalThis as Record<string, unknown>).WebSocket = Stub as unknown as typeof WebSocket
}
