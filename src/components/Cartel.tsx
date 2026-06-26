import { useState } from 'react'
import type { Item } from '../types'
import { useItems } from '../hooks/useItems'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PosterHeader, type CartelMeta } from './PosterHeader'
import { AddBar } from './AddBar'
import { LineupItem } from './LineupItem'
import { ConfirmDialog } from './ConfirmDialog'
import { EditItemDialog } from './EditItemDialog'
import { EditCartelDialog } from './EditCartelDialog'
import { SetPasswordDialog } from './SetPasswordDialog'

interface CartelProps {
  userId: string
  email: string
  onSignOut: () => void
}

const META_INICIAL: CartelMeta = {
  tituloArriba: 'LA COMPRA',
  tituloAbajo: 'SEMANAL',
  fecha: 'SÁBADO · DESDE QUE ABRA EL MERCA',
}

// Pantalla principal: el cartel de la compra con todo el line-up.
export function Cartel({ userId, email, onSignOut }: CartelProps) {
  const {
    pendientes,
    comprados,
    loading,
    error,
    add,
    toggleComprado,
    updateItem,
    remove,
    mover,
    hacerHeadliner,
    vaciarComprados,
    vaciarTodo,
  } = useItems(userId)

  const [meta, setMeta] = useLocalStorage<CartelMeta>('cartel-meta-v1', META_INICIAL)

  // Estado de los dialogos.
  const [editandoItem, setEditandoItem] = useState<Item | null>(null)
  const [editandoCartel, setEditandoCartel] = useState(false)
  const [confirmando, setConfirmando] = useState<null | 'comprados' | 'todo'>(null)
  const [pwdOpen, setPwdOpen] = useState(false)

  const hayItems = pendientes.length + comprados.length > 0

  return (
    <div className="mx-auto w-full max-w-xl px-3 py-4 sm:py-8">
      <div className="poster rounded-xl pb-6">
        <PosterHeader meta={meta} onEditar={() => setEditandoCartel(true)} />

        {/* Anadir productos */}
        <div className="mt-5">
          <AddBar onAdd={add} />
        </div>

        {/* Etiqueta de seccion + contador */}
        <div className="mt-7 flex items-center justify-between px-5">
          <span className="label-ember">En el line-up</span>
          <span className="label-ember !tracking-[0.1em] text-masia-ash">
            {pendientes.length} {pendientes.length === 1 ? 'pendiente' : 'pendientes'}
          </span>
        </div>
        <div className="rule-dot mt-2 px-5">
          <span className="text-[0.6rem]">●</span>
        </div>

        {/* Estado de carga */}
        {loading && (
          <p className="px-5 py-10 text-center text-sm uppercase tracking-[0.2em] text-masia-ash animate-flicker">
            Montando el escenario…
          </p>
        )}

        {/* Lista vacia */}
        {!loading && !hayItems && (
          <div className="px-6 py-12 text-center">
            <p className="title-mega text-3xl text-masia-ash">CARTEL VACÍO</p>
            <p className="mt-2 text-sm text-masia-bone">
              Añade tu primer producto y conviértelo en <span className="text-masia-flame">cabeza de cartel</span>.
            </p>
          </div>
        )}

        {/* Pendientes */}
        {!loading && pendientes.length > 0 && (
          <ul className="mt-1">
            {pendientes.map((item, i) => (
              <li key={item.id} className="animate-flash-in border-b border-masia-cream/5 last:border-b-0">
                <LineupItem
                  item={item}
                  esHeadliner={i === 0}
                  puedeSubir={i > 0}
                  puedeBajar={i < pendientes.length - 1}
                  onToggle={toggleComprado}
                  onEditar={setEditandoItem}
                  onBorrar={(it) => remove(it.id)}
                  onMover={mover}
                  onHeadliner={hacerHeadliner}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Comprados (sold out) */}
        {!loading && comprados.length > 0 && (
          <>
            <div className="mt-6 flex items-center justify-between px-5">
              <span className="label-ember text-masia-ash">Ya han pinchado · sold out</span>
              <span className="label-ember !tracking-[0.1em] text-masia-ash">{comprados.length}</span>
            </div>
            <div className="rule-dot mt-2 px-5">
              <span className="text-[0.6rem]">●</span>
            </div>
            <ul className="mt-1 opacity-90">
              {comprados.map((item) => (
                <li key={item.id} className="border-b border-masia-cream/5 last:border-b-0">
                  <LineupItem
                    item={item}
                    esHeadliner={false}
                    puedeSubir={false}
                    puedeBajar={false}
                    onToggle={toggleComprado}
                    onEditar={setEditandoItem}
                    onBorrar={(it) => remove(it.id)}
                    onMover={mover}
                    onHeadliner={hacerHeadliner}
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Acciones de limpieza */}
        {hayItems && (
          <div className="mt-7 flex flex-wrap justify-center gap-3 px-5">
            {comprados.length > 0 && (
              <button className="btn-ghost rounded-md px-4 py-2 text-xs" onClick={() => setConfirmando('comprados')}>
                Vaciar sold out
              </button>
            )}
            <button className="btn-ghost rounded-md px-4 py-2 text-xs" onClick={() => setConfirmando('todo')}>
              Vaciar todo
            </button>
          </div>
        )}

        {/* Pie del cartel: "paciente en observacion" + sesion */}
        <footer className="mt-8 px-5 text-center">
          <div className="rule-dot mb-4">
            <span className="text-xs">✦</span>
          </div>
          <p className="label-ember">Paciente en observación</p>
          <p className="mt-1 truncate text-sm lowercase text-masia-bone" title={email}>
            {email}
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={() => setPwdOpen(true)}
              className="text-[0.65rem] uppercase tracking-[0.25em] text-masia-ash underline-offset-4 hover:text-masia-ember hover:underline"
            >
              🔑 Contraseña
            </button>
            <span className="text-masia-ash/40">·</span>
            <button
              onClick={onSignOut}
              className="text-[0.65rem] uppercase tracking-[0.25em] text-masia-ash underline-offset-4 hover:text-masia-ember hover:underline"
            >
              Salir del recinto
            </button>
          </div>
          <p className="mt-5 text-[0.6rem] uppercase tracking-[0.3em] text-masia-ash">
            www·lista-masiá·com
          </p>
        </footer>
      </div>

      {/* Aviso de error de red/BD */}
      {error && (
        <p className="mt-3 rounded-md border border-masia-blood/40 bg-masia-blood/10 px-4 py-2 text-center text-xs text-masia-blood">
          Problema de conexión: {error}
        </p>
      )}

      {/* Dialogos */}
      <EditItemDialog item={editandoItem} onGuardar={updateItem} onCerrar={() => setEditandoItem(null)} />
      <EditCartelDialog
        abierto={editandoCartel}
        meta={meta}
        onGuardar={setMeta}
        onCerrar={() => setEditandoCartel(false)}
      />
      <SetPasswordDialog abierto={pwdOpen} onCerrar={() => setPwdOpen(false)} />
      <ConfirmDialog
        abierto={confirmando === 'comprados'}
        titulo="Vaciar sold out"
        mensaje="Se borrarán todos los productos ya comprados. ¿Seguro?"
        textoConfirmar="Vaciar"
        peligro
        onConfirmar={() => {
          vaciarComprados()
          setConfirmando(null)
        }}
        onCancelar={() => setConfirmando(null)}
      />
      <ConfirmDialog
        abierto={confirmando === 'todo'}
        titulo="Vaciar todo"
        mensaje="Esto borra el cartel entero (pendientes y comprados). No se puede deshacer."
        textoConfirmar="Borrar todo"
        peligro
        onConfirmar={() => {
          vaciarTodo()
          setConfirmando(null)
        }}
        onCancelar={() => setConfirmando(null)}
      />
    </div>
  )
}
