import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from '../../utils/supabase/info'

// Read from environment variables when they are provided (e.g. Vercel/Netlify
// project settings, or local .env.local). Never hardcode real keys in source.
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''

const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Fall back to the committed Supabase project credentials in
// utils/supabase/info.tsx. Those values are shipped inside the built bundle, so
// the app keeps working on hosts (Vercel/Netlify) where the real .env.local is
// never deployed and the VITE_* vars resolve to empty strings — which otherwise
// caused every query to fail (essays/publications shown as "0") and admin login
// to report "Invalid credentials". The anon/public key is safe to expose by
// design. When env vars are set, they take precedence over this fallback.
const resolvedUrl = supabaseUrl || `https://${projectId}.supabase.co`
const resolvedAnonKey = supabaseAnonKey || publicAnonKey

export const supabase: SupabaseClient = createClient(resolvedUrl, resolvedAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

if (!isConfigured) {
  console.warn(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set for this environment. ' +
      'Falling back to the committed Supabase project credentials from utils/supabase/info.tsx. ' +
      'To use different credentials, set these env vars (e.g. in your Vercel project settings) and redeploy.'
  )
}

export default supabase