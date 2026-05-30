// ─── 野造 · Auth Service ───
// Handles all authentication operations: signup, signin, signout, OAuth, password reset

import { getSupabaseClient } from '../client'
import type { ProfileRow } from '../database.types'

// ─── Types ───
export interface SignUpParams {
  email: string
  password: string
  nickname: string
  redirectTo?: string
}

export interface SignInParams {
  email: string
  password: string
}

export interface ResetPasswordParams {
  email: string
  redirectTo?: string
}

export interface UpdatePasswordParams {
  password: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: ProfileRow | null
}

// ─── Email/Password Auth ───

export async function signUp({ email, password, nickname, redirectTo }: SignUpParams): Promise<AuthResult> {
  const supabase = getSupabaseClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
      emailRedirectTo: redirectTo || `${siteUrl}/auth/callback`,
    },
  })

  if (error) return { success: false, error: error.message }

  return { success: true, user: data.user as unknown as ProfileRow | null }
}

export async function signIn({ email, password }: SignInParams): Promise<AuthResult> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { success: false, error: error.message }

  return { success: true, user: data.user as unknown as ProfileRow | null }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── Password Management ───

export async function resetPassword({ email, redirectTo }: ResetPasswordParams): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${siteUrl}/auth/reset-password`,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updatePassword({ password }: UpdatePasswordParams): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── OAuth ───

export async function signInWithGoogle(redirectTo?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${siteUrl}/auth/callback`,
    },
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function signInWithGitHub(redirectTo?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectTo || `${siteUrl}/auth/callback`,
    },
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── Session ───

export async function getClientSession() {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getClientUser() {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function refreshSession() {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.refreshSession()
  return data.session
}

// ─── Auth State Listener ───

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  const supabase = getSupabaseClient()
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return data.subscription
}
