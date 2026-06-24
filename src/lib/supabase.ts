import { createClient } from '@supabase/supabase-js'

// Limpia caracteres invisibles (BOM U+FEFF, espacios, saltos de linea) que
// algunas herramientas anaden al guardar variables de entorno. Si quedan,
// rompen las cabeceras HTTP de Supabase ("non ISO-8859-1 code point").
function limpiarEnv(valor: string | undefined): string | undefined {
  return valor?.replace(/^﻿/, '').trim()
}

// Leemos la configuracion de las variables de entorno (.env).
const supabaseUrl = limpiarEnv(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = limpiarEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)

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
