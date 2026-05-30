// ─── 野造 · Global Providers ───
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { ProfileRow } from '@/lib/supabase/database.types'

function AuthListener({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const setProfile = useAuthStore((s) => s.setProfile)
  const setLoading = useAuthStore((s) => s.setLoading)
  const signOut = useAuthStore((s) => s.signOut)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        // Fetch profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data as ProfileRow)
          })
      }
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          // Fetch updated profile on SIGNED_IN and TOKEN_REFRESHED
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            if (data) setProfile(data as ProfileRow)
          }
        } else {
          signOut()
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setLoading, signOut])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener>
        {children}
      </AuthListener>
    </QueryClientProvider>
  )
}
