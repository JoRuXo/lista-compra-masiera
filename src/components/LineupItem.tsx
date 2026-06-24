import { useRef, useState, type PointerEvent } from 'react'
import type { Item } from '../types'
import { vibrar } from '../lib/haptics'

interface LineupItemProps {
  item: Item
  esHeadliner: boolean
  puedeSubir: boolean
  puedeBajar: boolean
  onToggle: (item: Item) => void
  onEditar: (item: Item) => void
  onBorrar: (item: Item) => void
  onMover: (item: Item, dir: -1 | 1) => void
  onHeadliner: (item: Item) => void
}

const UMBRAL_BORRAR = -78 // px que hay que deslizar para borrar

// Una linea del line-up = un producto.
//  · Tocar el nombre -> marcar/desmarcar "SOLD OUT".
//  · Deslizar a la izquierda -> borrar.
//  · Boton "···" -> abre controles (editar, reordenar, cabeza de cartel, borrar).
export function LineupItem({
  item,
  esHeadliner,
  puedeSubir,
  puedeBajar,
  onToggle,
  onEditar,
  onBorrar,
  onMover,
  onHeadliner,
}: LineupItemProps) {
  const [controles, setControles] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [conTransicion, setConTransicion] = useState(true)

  const arrastrando = useRef(false)
  const startX = useRef(0)
  const deslizado = useRef(false)

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    // Si se pulsa un boton de control, no iniciamos el gesto de deslizar.
    if ((e.target as HTMLElement).closest('[data-control]')) return
    if (item.comprado) return // los comprados no se deslizan
    arrastrando.current = true
    startX.current = e.clientX
    deslizado.current = false
    setConTransicion(false)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!arrastrando.current) return
    let dx = e.clientX - startX.current
    dx = Math.min(0, Math.max(-130, dx)) // solo hacia la izquierda
    if (Math.abs(dx) > 8) deslizado.current = true
    setDragX(dx)
  }

  function onPointerUp() {
    if (!arrastrando.current) return
    arrastrando.current = false
    setConTransicion(true)
    if (dragX < UMBRAL_BORRAR) {
      vibrar(30)
      setDragX(-window.innerWidth) // se va volando
      window.setTimeout(() => onBorrar(item), 160)
    } else {
      setDragX(0)
    }
  }

  function onClickNombre() {
    // Si venimos de un deslizamiento, no contamos como "toque".
    if (deslizado.current) {
      deslizado.current = false
      return
    }
    vibrar(item.comprado ? 10 : [14, 30, 14])
    onToggle(item)
  }

  const tamano = esHeadliner
    ? 'clamp(2rem, 9vw, 3rem)'
    : item.comprado
      ? 'clamp(1.1rem, 5vw, 1.5rem)'
      : 'clamp(1.45rem, 6.2vw, 2.05rem)'

  return (
    <div className="relative select-none overflow-hidden">
      {/* Fondo rojo "BORRAR" que se revela solo al deslizar */}
      <div
        className="absolute inset-0 flex items-center justify-end bg-masia-blood/85 pr-5"
        style={{ opacity: Math.min(1, Math.max(0, -dragX / UMBRAL_BORRAR)) }}
      >
        <span className="font-head text-xs font-bold uppercase tracking-[0.2em] text-white">Borrar ✕</span>
      </div>

      {/* Contenido de la fila (se desplaza con el dedo). Fondo opaco para
          que tape el rojo de borrar hasta que se desliza. */}
      <div
        className="relative"
        style={{
          backgroundColor: '#120d09',
          transform: `translateX(${dragX}px)`,
          transition: conTransicion ? 'transform 0.22s cubic-bezier(.2,.8,.2,1)' : 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="flex items-center gap-3 px-5 py-2.5">
          {/* Indicador de cabeza de cartel */}
          {esHeadliner && !item.comprado && (
            <span className="shrink-0 text-base" aria-hidden>
              🎧
            </span>
          )}

          {/* Nombre del producto (boton -> marcar sold out) */}
          <button
            onClick={onClickNombre}
            aria-pressed={item.comprado}
            className="relative min-w-0 flex-1 text-left"
          >
            <span
              className={`lineup-name inline align-middle transition-opacity ${
                item.comprado ? 'text-masia-ash line-through decoration-masia-ember/70 decoration-2' : ''
              }`}
              style={{ fontSize: tamano, opacity: item.comprado ? 0.55 : 1 }}
            >
              {item.nombre}
            </span>
            {item.cantidad > 1 && (
              <span className="badge-qty ml-2 inline-block translate-y-[-0.15em] px-2 py-0.5 align-middle text-xs">
                x{item.cantidad}
              </span>
            )}

            {/* Sello SOLD OUT diagonal sobre el producto comprado */}
            {item.comprado && (
              <span
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -rotate-[8deg] animate-stamp-in"
                aria-hidden
              >
                <span className="stamp text-[0.7rem]">Sold out</span>
              </span>
            )}
          </button>

          {/* Boton de controles */}
          <button
            data-control
            onClick={() => setControles((v) => !v)}
            className="shrink-0 rounded-md px-2 py-1 text-masia-ash active:text-masia-ember"
            aria-label="Mas opciones"
            aria-expanded={controles}
          >
            <span className="text-lg leading-none tracking-tighter">⋯</span>
          </button>
        </div>

        {/* Fila de controles desplegable */}
        {controles && (
          <div className="flex flex-wrap items-center gap-2 px-5 pb-3 pt-1">
            <ControlBtn label="Editar" onClick={() => onEditar(item)}>
              ✎
            </ControlBtn>
            {!item.comprado && (
              <>
                <ControlBtn label="Subir" disabled={!puedeSubir} onClick={() => onMover(item, -1)}>
                  ↑
                </ControlBtn>
                <ControlBtn label="Bajar" disabled={!puedeBajar} onClick={() => onMover(item, 1)}>
                  ↓
                </ControlBtn>
                {!esHeadliner && (
                  <ControlBtn label="Cabeza de cartel" onClick={() => onHeadliner(item)}>
                    ★
                  </ControlBtn>
                )}
              </>
            )}
            <ControlBtn label="Borrar" peligro onClick={() => onBorrar(item)}>
              ✕
            </ControlBtn>
          </div>
        )}
      </div>
    </div>
  )
}

// Boton pequeno de la fila de controles.
function ControlBtn({
  children,
  label,
  onClick,
  disabled,
  peligro,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  peligro?: boolean
}) {
  return (
    <button
      data-control
      disabled={disabled}
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs uppercase tracking-wider transition-colors disabled:opacity-30 ${
        peligro
          ? 'border-masia-blood/40 text-masia-blood active:bg-masia-blood/15'
          : 'border-masia-cream/15 text-masia-bone active:border-masia-ember/50 active:text-masia-ember'
      }`}
    >
      <span className="text-sm leading-none">{children}</span>
      <span className="hidden xs:inline">{label}</span>
    </button>
  )
}
