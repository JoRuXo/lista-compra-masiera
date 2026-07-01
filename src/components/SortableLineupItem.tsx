import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Item } from '../types'
import { LineupItem } from './LineupItem'

interface SortableLineupItemProps {
  item: Item
  esHeadliner: boolean
  onToggle: (item: Item) => void
  onEditar: (item: Item) => void
  onBorrar: (item: Item) => void
}

// Envuelve un LineupItem para poder arrastrarlo (dnd-kit). El "asa" de
// arrastre va separada de los iconos de editar/borrar para no interferir.
export function SortableLineupItem({ item, esHeadliner, onToggle, onEditar, onBorrar }: SortableLineupItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`border-b border-masia-cream/5 last:border-b-0 ${
        isDragging
          ? 'relative rounded-md bg-masia-coal shadow-[0_12px_34px_-8px_rgba(0,0,0,0.9)] ring-1 ring-masia-ember/50'
          : ''
      }`}
    >
      <LineupItem
        item={item}
        esHeadliner={esHeadliner}
        onToggle={onToggle}
        onEditar={onEditar}
        onBorrar={onBorrar}
        dragHandle={
          <button
            {...attributes}
            {...listeners}
            aria-label="Reordenar (arrastrar)"
            title="Arrastra para reordenar"
            className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center text-masia-ash hover:text-masia-ember active:cursor-grabbing"
          >
            <GripIcon />
          </button>
        }
      />
    </li>
  )
}

function GripIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  )
}
