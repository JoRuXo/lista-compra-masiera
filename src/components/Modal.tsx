import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  abierto: boolean
  onCerrar: () => void
  children: ReactNode
  titulo?: string
}

// Modal centrado con fondo oscurecido, reutilizado por los dialogos.
export function Modal({ abierto, onCerrar, children, titulo }: ModalProps) {
  // Cerrar con la tecla Escape.
  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onCerrar()
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="poster relative z-10 w-full max-w-sm rounded-lg p-5 animate-flash-in">
        {titulo && <h2 className="label-ember mb-3 text-center">{titulo}</h2>}
        {children}
      </div>
    </div>
  )
}
