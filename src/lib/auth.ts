import { supabase } from '../../utils/supabase/client'
import type { Session } from '@supabase/supabase-js'

export interface CurrentUser {
  id: string
  email: string | null
  role: 'admin' | 'viewer' | null
  isAdmin: boolean
}

export async function signIn(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return !error
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data?.session?.user) return null

  const user = data.session.user
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profileError || !profileData ? null : (profileData.role as 'admin' | 'viewer')

  return {
    id: user.id,
    email: user.email ?? null,
    role,
    isAdmin: role === 'admin',
  }
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}
