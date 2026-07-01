import { useState, type FormEvent } from 'react'
import { vibrar } from '../lib/haptics'

interface AddBarProps {
  onAdd: (nombre: string, cantidad: number) => void
}

// Barra para anadir productos en un toque ("anadir al cartel").
// Incluye un selector de cantidad opcional y un campo de texto.
export function AddBar({ onAdd }: AddBarProps) {
  const [texto, setTexto] = useState('')
  const [cantidad, setCantidad] = useState(1)

  function submit(e: FormEvent) {
    e.preventDefault()
    const limpio = texto.trim()
    if (!limpio) return
    onAdd(limpio, cantidad)
    vibrar(12)
    setTexto('')
    setCantidad(1)
  }

  return (
    <form onSubmit={submit} className="px-5">
      <div className="flex items-stretch gap-2">
        {/* Selector de cantidad */}
        <div className="flex shrink-0 items-center overflow-hidden rounded-md border border-masia-cream/15 bg-black/40">
          <button
            type="button"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            className="px-3 py-2 text-lg leading-none text-masia-bone active:text-masia-ember"
            aria-label="Bajar cantidad"
          >
            −
          </button>
          <span className="w-6 text-center font-head text-base font-bold text-masia-ember">{cantidad}</span>
          <button
            type="button"
            onClick={() => setCantidad((c) => Math.min(999, c + 1))}
            className="px-3 py-2 text-lg leading-none text-masia-bone active:text-masia-ember"
            aria-label="Subir cantidad"
          >
            +
          </button>
        </div>

        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="AÑADE UN PRODUCTO…"
          aria-label="Nombre del producto"
          enterKeyHint="done"
          className="input-cartel min-w-0 flex-1 rounded-md px-4 py-2.5 text-sm"
          maxLength={120}
        />

        <button
          type="submit"
          disabled={!texto.trim()}
          className="btn-ember shrink-0 rounded-md px-4 text-xs sm:px-5"
          aria-label="Anadir al cartel"
        >
          <span className="hidden sm:inline">Al cartel</span>
          <span className="text-xl leading-none sm:hidden">+</span>
        </button>
      </div>
    </form>
  )
}
