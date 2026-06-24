import { useEffect, useState } from 'react'
import { Modal } from './Modal'
import type { CartelMeta } from './PosterHeader'

interface EditCartelDialogProps {
  abierto: boolean
  meta: CartelMeta
  onGuardar: (meta: CartelMeta) => void
  onCerrar: () => void
}

// Dialogo para personalizar el titular y la fecha del cartel.
export function EditCartelDialog({ abierto, meta, onGuardar, onCerrar }: EditCartelDialogProps) {
  const [local, setLocal] = useState<CartelMeta>(meta)

  useEffect(() => {
    if (abierto) setLocal(meta)
  }, [abierto, meta])

  function campo(clave: keyof CartelMeta, etiqueta: string, placeholder: string) {
    return (
      <label className="block">
        <span className="label-ember mb-1.5 block">{etiqueta}</span>
        <input
          type="text"
          value={local[clave]}
          onChange={(e) => setLocal((m) => ({ ...m, [clave]: e.target.value }))}
          placeholder={placeholder}
          maxLength={40}
          className="input-cartel w-full rounded-md px-4 py-2.5 text-sm"
        />
      </label>
    )
  }

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="Editar el cartel">
      <div className="space-y-4">
        {campo('tituloArriba', 'Titular', 'LA COMPRA')}
        {campo('tituloAbajo', 'Subtitulo (naranja)', 'SEMANAL')}
        {campo('fecha', 'Fecha / lema', 'SÁBADO · DESDE QUE ABRA EL MERCA')}

        <div className="flex gap-3 pt-1">
          <button className="btn-ghost flex-1 rounded-md py-2.5 text-sm" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            className="btn-ember flex-1 rounded-md py-2.5 text-sm"
            onClick={() => {
              onGuardar(local)
              onCerrar()
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  )
}
