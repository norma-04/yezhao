// ─── WebSocket polyfill for Node.js < 22 ───
// EdgeOne Pages / older Node.js environments lack native WebSocket,
// which @supabase/supabase-js requires for its Realtime subsystem.
// Import this BEFORE any Supabase client creation.
import { WebSocket as WS } from 'ws'

if (typeof globalThis.WebSocket === 'undefined') {
  ;(globalThis as Record<string, unknown>).WebSocket = WS
}
