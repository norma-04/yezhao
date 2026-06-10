// ─── 野造 · Instrumentation ───
// Next.js instrumentation hook for server-side setup
import '@/lib/supabase/stub-websocket' // Ensure stub is loaded early

export async function register() {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Instrumentation] Development server started')
  }
}
