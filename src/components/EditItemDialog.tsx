import { useEffect, useState } from 'react'
import type { Item } from '../types'
import { Modal } from './Modal'

interface EditItemDialogProps {
  item: Item | null
  onGuardar: (id: string, patch: { nombre: string; cantidad: number }) => void
  onCerrar: () => void
}

// Dialogo para editar el nombre y la cantidad de un producto.
export function EditItemDialog({ item, onGuardar, onCerrar }: EditItemDialogProps) {
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState(1)

  // Cargar los valores del item cada vez que se abre.
  useEffect(() => {
    if (item) {
      setNombre(item.nombre)
      setCantidad(item.cantidad)
    }
  }, [item])

  function guardar() {
    const limpio = nombre.trim()
    if (!limpio || !item) return
    onGuardar(item.id, { nombre: limpio, cantidad })
    onCerrar()
  }

  return (
    <Modal abierto={item !== null} onCerrar={onCerrar} titulo="Editar producto">
      <div className="space-y-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && guardar()}
          maxLength={120}
          autoFocus
          className="input-cartel w-full rounded-md px-4 py-3 text-sm"
          placeholder="NOMBRE DEL PRODUCTO"
        />

        <div className="flex items-center justify-between">
          <span className="label-ember">Cantidad</span>
          <div className="flex items-center overflow-hidden rounded-md border border-masia-cream/15 bg-black/40">
            <button
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              className="px-4 py-2 text-lg leading-none text-masia-bone active:text-masia-ember"
            >
              −
            </button>
            <span className="w-8 text-center font-head text-lg font-bold text-masia-ember">{cantidad}</span>
            <button
              onClick={() => setCantidad((c) => Math.min(999, c + 1))}
              className="px-4 py-2 text-lg leading-none text-masia-bone active:text-masia-ember"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button className="btn-ghost flex-1 rounded-md py-2.5 text-sm" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-ember flex-1 rounded-md py-2.5 text-sm" onClick={guardar}>
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  )
}
