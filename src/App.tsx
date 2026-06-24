import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { Login } from './components/Login'
import { Cartel } from './components/Cartel'
import { ConfigMissing } from './components/ConfigMissing'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [cargando, setCargando] = useState(true)

  // Recupera la sesion actual y escucha cambios de autenticacion.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCargando(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCargando(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSession(nuevaSesion)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) return <ConfigMissing />

  // Splash mientras comprobamos la sesion.
  if (cargando) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="title-mega distress text-4xl text-masia-ember animate-flicker">MASIÁ</p>
      </div>
    )
  }

  if (!session) return <Login />

  return (
    <Cartel
      userId={session.user.id}
      email={session.user.email ?? 'paciente anónimo'}
      onSignOut={() => supabase.auth.signOut()}
    />
  )
}
