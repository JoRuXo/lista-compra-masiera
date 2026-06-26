import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { vibrar } from '../lib/haptics'

// Traduce los errores mas comunes de Supabase Auth a mensajes claros.
function traducir(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'Email o contraseña incorrectos.'
  if (m.includes('already registered') || m.includes('already exists'))
    return 'Ya existe una cuenta con ese email. Pulsa "Entrar".'
  if (m.includes('at least')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (m.includes('email') && m.includes('invalid')) return 'Ese email no parece válido.'
  return msg
}

// Pantalla de acceso por email + contraseña (directo, sin confirmacion).
export function Login() {
  const [modo, setModo] = useState<'entrar' | 'crear'>('entrar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const correo = email.trim()
    if (!correo || !password) return
    setEstado('cargando')
    setMensaje('')

    if (modo === 'entrar') {
      const { error } = await supabase.auth.signInWithPassword({ email: correo, password })
      if (error) {
        setEstado('error')
        setMensaje(traducir(error.message))
      } else {
        vibrar(20) // App reacciona via onAuthStateChange
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email: correo, password })
      if (error) {
        setEstado('error')
        setMensaje(traducir(error.message))
        return
      }
      if (!data.session) {
        // Si no llega sesion es que sigue activa la confirmacion de email.
        setEstado('error')
        setMensaje(
          'Cuenta creada, pero falta confirmar el email. Desactiva "Confirm email" en Supabase (Authentication → Sign In / Providers → Email) y vuelve a entrar.',
        )
        return
      }
      vibrar(20)
    }
  }

  const titulo = modo === 'entrar' ? 'PUERTA' : 'ALTA VIP'

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-5 py-10">
      <div className="poster w-full rounded-xl px-6 py-9 text-center">
        <p className="label-ember mb-1">Discoteca de la compra</p>
        <h1
          className="mb-1 font-display tracking-[0.18em] text-masia-cream"
          style={{ fontSize: 'clamp(2rem, 9vw, 2.75rem)' }}
        >
          MASI<span className="text-masia-ember">Á</span>
        </h1>
        <div className="rule-dot mx-auto my-4 max-w-[14rem] text-xs">
          <span className="px-1">·</span>
        </div>

        <h2 className="title-mega distress mb-2 text-5xl">{titulo}</h2>
        <p className="mb-7 text-sm leading-relaxed text-masia-bone">
          {modo === 'entrar' ? (
            <>Entra con tu email y contraseña.</>
          ) : (
            <>Crea tu cuenta. Solo tú verás tu lista, en todos tus dispositivos.</>
          )}
        </p>

        <form onSubmit={onSubmit} className="space-y-3 text-left">
          <label className="block">
            <span className="label-ember mb-1.5 block !tracking-[0.2em]">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-cartel w-full rounded-md px-4 py-3 text-sm lowercase"
              style={{ textTransform: 'none' }}
            />
          </label>

          <label className="block">
            <span className="label-ember mb-1.5 block !tracking-[0.2em]">Contraseña</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
              placeholder="mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-cartel w-full rounded-md px-4 py-3 text-sm"
              style={{ textTransform: 'none' }}
            />
          </label>

          <button
            type="submit"
            disabled={estado === 'cargando'}
            className="btn-ember w-full rounded-md py-3 text-sm"
          >
            {estado === 'cargando' ? 'Entrando…' : modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}
          </button>

          {estado === 'error' && (
            <p className="text-center text-xs leading-relaxed text-masia-blood">{mensaje}</p>
          )}
        </form>

        {/* Cambiar entre entrar / crear cuenta */}
        <button
          onClick={() => {
            setModo((m) => (m === 'entrar' ? 'crear' : 'entrar'))
            setEstado('idle')
            setMensaje('')
          }}
          className="mt-5 text-[0.7rem] uppercase tracking-[0.2em] text-masia-ash underline-offset-4 hover:text-masia-ember hover:underline"
        >
          {modo === 'entrar' ? '¿No tienes cuenta? Crear una' : '¿Ya tienes cuenta? Entrar'}
        </button>
      </div>
      <p className="mt-6 text-[0.65rem] uppercase tracking-[0.3em] text-masia-ash">
        Solo para ti · sesión guardada en este dispositivo
      </p>
    </div>
  )
}
