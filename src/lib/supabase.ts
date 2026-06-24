import { createClient } from '@supabase/supabase-js'

// Leemos la configuracion de las variables de entorno (.env).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Flag para saber si la app esta bien configurada. Si falta algo,
// la interfaz muestra una pantalla de ayuda en vez de romperse.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Cliente de Supabase. Si no hay config usamos valores "dummy" para que
// el import no explote; la app ya bloquea su uso con isSupabaseConfigured.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
