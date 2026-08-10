import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Read from environment variables — never hardcode real keys in source files
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''

const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// A syntactically valid fallback so the client can always be constructed.
// Otherwise createClient('', '') throws `supabaseUrl is required` at module
// load, which happens on hosts (Vercel/Netlify) where the real .env.local is
// not present and the build resolves the vars to empty strings — producing a
// blank white page before React ever mounts. With a real config this code
// path is never used.
export const supabase: SupabaseClient = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'public-anonymous-key',
  {
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
  }
)

if (!isConfigured) {
  console.warn(
    'Supabase credentials missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set for this environment). ' +
      'The site will render but live data will be unavailable. Add these to your Vercel/Netlify project ' +
      'environment variables and redeploy. Locally: copy .env.example to .env.local and fill them in.'
  )
}

export default supabase