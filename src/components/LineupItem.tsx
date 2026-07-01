import { useState, type ReactNode } from 'react'
import type { Item } from '../types'
import { vibrar } from '../lib/haptics'

interface LineupItemProps {
  item: Item
  esHeadliner: boolean
  onToggle: (item: Item) => void
  onEditar: (item: Item) => void
  onBorrar: (item: Item) => void
  // Asa de arrastre opcional (inyectada por el contenedor sortable).
  dragHandle?: ReactNode
}

// Una linea del line-up = un producto.
//  · Tocar el nombre -> marcar/desmarcar "SOLD OUT".
//  · Iconos siempre visibles: lápiz (editar) y papelera (borrar, con
//    confirmacion ligera inline).
export function LineupItem({ item, esHeadliner, onToggle, onEditar, onBorrar, dragHandle }: LineupItemProps) {
  const [confirmar, setConfirmar] = useState(false)

  function toggle() {
    vibrar(item.comprado ? 10 : [14, 26, 14])
    onToggle(item)
  }

  // Tamaños compactos, manteniendo la jerarquía (headliner algo mayor).
  const tamano = esHeadliner
    ? 'clamp(1.45rem, 6.2vw, 2rem)'
    : item.comprado
      ? 'clamp(0.95rem, 3.8vw, 1.2rem)'
      : 'clamp(1.1rem, 4.4vw, 1.4rem)'

  return (
    <div className="flex items-center gap-2 px-4 py-1.5">
      {dragHandle}

      {esHeadliner && !item.comprado && (
        <span className="shrink-0 text-sm" aria-hidden>
          🎧
        </span>
      )}

      {/* Nombre (marca / desmarca sold out) */}
      <button onClick={toggle} aria-pressed={item.comprado} className="relative min-w-0 flex-1 text-left">
        <span
          className={`lineup-name inline align-middle ${
            item.comprado ? 'text-masia-ash line-through decoration-masia-ember/70 decoration-2' : ''
          }`}
          style={{ fontSize: tamano, opacity: item.comprado ? 0.55 : 1 }}
        >
          {item.nombre}
        </span>
        {item.cantidad > 1 && (
          <span className="badge-qty ml-2 inline-block translate-y-[-0.1em] px-1.5 py-0.5 align-middle text-[0.65rem]">
            x{item.cantidad}
          </span>
        )}
        {item.comprado && (
          <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -rotate-[8deg] animate-stamp-in" aria-hidden>
            <span className="stamp text-[0.62rem]">Sold out</span>
          </span>
        )}
      </button>

      {/* Acciones siempre visibles */}
      {!confirmar ? (
        <div className="flex shrink-0 items-center gap-0.5">
          <IconBtn label="Editar" onClick={() => onEditar(item)}>
            <PencilIcon />
          </IconBtn>
          <IconBtn label="Borrar" peligro onClick={() => setConfirmar(true)}>
            <TrashIcon />
          </IconBtn>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[0.6rem] uppercase tracking-wider text-masia-ash">¿Borrar?</span>
          <IconBtn
            label="Confirmar borrado"
            peligro
            onClick={() => {
              vibrar(30)
              onBorrar(item)
            }}
          >
            <CheckIcon />
          </IconBtn>
          <IconBtn label="Cancelar" onClick={() => setConfirmar(false)}>
            <XIcon />
          </IconBtn>
        </div>
      )}
    </div>
  )
}

// Botón-icono discreto.
function IconBtn({
  children,
  label,
  onClick,
  peligro,
}: {
  children: ReactNode
  label: string
  onClick: () => void
  peligro?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        peligro
          ? 'text-masia-ash active:text-masia-blood hover:text-masia-blood'
          : 'text-masia-ash active:text-masia-ember hover:text-masia-ember'
      }`}
    >
      {children}
    </button>
  )
}

// --- Iconos (línea, discretos) ---------------------------------------------
const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-[18px] w-[18px]',
}

function PencilIcon() {
  return (
    <svg {...svgProps}>
      <path d="M16.5 4.5l3 3L8 19l-4 1 1-4 11.5-11.5z" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg {...svgProps}>
      <path d="M5 7h14M10 7V5.5A1.5 1.5 0 0111.5 4h1A1.5 1.5 0 0114 5.5V7M6.5 7l.7 12a1.5 1.5 0 001.5 1.4h6.6a1.5 1.5 0 001.5-1.4l.7-12" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg {...svgProps}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg {...svgProps}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
