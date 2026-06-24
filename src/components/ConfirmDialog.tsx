import { Modal } from './Modal'

interface ConfirmDialogProps {
  abierto: boolean
  titulo: string
  mensaje: string
  textoConfirmar?: string
  peligro?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

// Dialogo de confirmacion para acciones destructivas (vaciar comprados / todo).
export function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  peligro = false,
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  return (
    <Modal abierto={abierto} onCerrar={onCancelar} titulo={titulo}>
      <p className="mb-5 text-center text-sm leading-relaxed text-masia-bone">{mensaje}</p>
      <div className="flex gap-3">
        <button className="btn-ghost flex-1 rounded-md py-2.5 text-sm" onClick={onCancelar}>
          Cancelar
        </button>
        <button
          className={`flex-1 rounded-md py-2.5 text-sm font-semibold uppercase tracking-wider ${
            peligro
              ? 'bg-masia-blood/90 text-white active:brightness-110'
              : 'btn-ember'
          }`}
          onClick={onConfirmar}
        >
          {textoConfirmar}
        </button>
      </div>
    </Modal>
  )
}
