import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Modal } from './Modal'

interface SetPasswordDialogProps {
  abierto: boolean
  onCerrar: () => void
}

// Permite establecer o cambiar la contraseña del usuario actual.
// Util para cuentas creadas antes con magic link: asi pasan a poder
// entrar con email + contraseña sin perder sus datos.
export function SetPasswordDialog({ abierto, onCerrar }: SetPasswordDialogProps) {
  const [password, setPassword] = useState('')
  const [estado, setEstado] = useState<'idle' | 'guardando' | 'ok' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function guardar() {
    if (password.length < 6) {
      setEstado('error')
      setMensaje('Mínimo 6 caracteres.')
      return
    }
    setEstado('guardando')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setEstado('error')
      setMensaje(error.message)
    } else {
      setEstado('ok')
      setMensaje('Contraseña guardada. Ya puedes entrar con email + contraseña.')
      setPassword('')
    }
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={() => {
        setEstado('idle')
        setMensaje('')
        onCerrar()
      }}
      titulo="Establecer contraseña"
    >
      <div className="space-y-4">
        <p className="text-center text-xs leading-relaxed text-masia-bone">
          Define una contraseña para tu cuenta y entra con email + contraseña en cualquier dispositivo.
        </p>
        <input
          type="password"
          minLength={6}
          autoFocus
          autoComplete="new-password"
          placeholder="nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && guardar()}
          className="input-cartel w-full rounded-md px-4 py-3 text-sm"
          style={{ textTransform: 'none' }}
        />

        {mensaje && (
          <p
            className={`text-center text-xs leading-relaxed ${
              estado === 'ok' ? 'text-masia-flame' : 'text-masia-blood'
            }`}
          >
            {mensaje}
          </p>
        )}

        <div className="flex gap-3">
          <button
            className="btn-ghost flex-1 rounded-md py-2.5 text-sm"
            onClick={() => {
              setEstado('idle')
              setMensaje('')
              onCerrar()
            }}
          >
            {estado === 'ok' ? 'Cerrar' : 'Cancelar'}
          </button>
          <button
            className="btn-ember flex-1 rounded-md py-2.5 text-sm"
            disabled={estado === 'guardando'}
            onClick={guardar}
          >
            {estado === 'guardando' ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
