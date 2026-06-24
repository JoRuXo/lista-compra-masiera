import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { vibrar } from '../lib/haptics'

// Pantalla de acceso. Autenticacion por "magic link": el usuario recibe
// un email con un enlace que lo deja dentro. Asi solo el ve su lista y se
// sincroniza en todos sus dispositivos.
export function Login() {
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'enviado' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const correo = email.trim()
    if (!correo) return
    setEstado('enviando')
    setMensaje('')

    const { error } = await supabase.auth.signInWithOtp({
      email: correo,
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      setEstado('error')
      setMensaje(error.message)
    } else {
      setEstado('enviado')
      vibrar(20)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-5 py-10">
      <div className="poster w-full rounded-xl px-6 py-9 text-center">
        {/* Wordmark / identidad propia inspirada en la Masia */}
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

        <h2 className="title-mega distress mb-2 text-5xl">PUERTA</h2>
        <p className="mb-7 text-sm leading-relaxed text-masia-bone">
          Entra con tu email y te mando tu <span className="text-masia-flame">entrada</span> (enlace magico).
          Sin contrasenas.
        </p>

        {estado === 'enviado' ? (
          <div className="rounded-lg border border-masia-ember/40 bg-masia-ember/10 p-5">
            <p className="label-ember mb-2">Entrada enviada</p>
            <p className="text-sm leading-relaxed text-masia-cream">
              Revisa <span className="text-masia-flame">{email}</span> y pulsa el enlace para acceder al recinto.
            </p>
            <button
              className="btn-ghost mt-4 rounded-md px-4 py-2 text-xs"
              onClick={() => setEstado('idle')}
            >
              Usar otro email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-cartel w-full rounded-md px-4 py-3 text-center text-sm tracking-normal lowercase"
              style={{ textTransform: 'none' }}
            />
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="btn-ember w-full rounded-md py-3 text-sm"
            >
              {estado === 'enviando' ? 'Enviando…' : 'Conseguir entrada'}
            </button>
            {estado === 'error' && (
              <p className="text-xs text-masia-blood">{mensaje || 'Algo fallo, intentalo de nuevo.'}</p>
            )}
          </form>
        )}
      </div>
      <p className="mt-6 text-[0.65rem] uppercase tracking-[0.3em] text-masia-ash">
        Solo para ti · sincronizado en tus dispositivos
      </p>
    </div>
  )
}
