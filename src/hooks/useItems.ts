import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Item } from '../types'

// Orden de presentacion del line-up:
//  1) los pendientes arriba, los comprados ("sold out") al final
//  2) por el campo 'orden' (permite reordenar)
//  3) por antiguedad como desempate
function ordenarItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    if (a.comprado !== b.comprado) return a.comprado ? 1 : -1
    if (a.orden !== b.orden) return a.orden - b.orden
    return a.created_at.localeCompare(b.created_at)
  })
}

/**
 * Capa de datos de la lista. Encapsula todas las operaciones contra Supabase
 * con "updates optimistas" (la UI cambia al instante y se revierte si falla)
 * y suscripcion a Realtime para sincronizar entre dispositivos.
 */
export function useItems(userId: string | null) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Referencia siempre actualizada para usar dentro de callbacks sin recrearlos.
  const itemsRef = useRef<Item[]>([])
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const fetchItems = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('comprado', { ascending: true })
      .order('orden', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setItems(ordenarItems((data ?? []) as Item[]))
      setError(null)
    }
    setLoading(false)
  }, [userId])

  // Carga inicial + Realtime + refresco al enfocar / recuperar conexion.
  useEffect(() => {
    if (!userId) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    void fetchItems()

    const channel = supabase
      .channel(`items-sync-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items', filter: `user_id=eq.${userId}` },
        () => void fetchItems(),
      )
      .subscribe()

    const refrescar = () => void fetchItems()
    window.addEventListener('focus', refrescar)
    window.addEventListener('online', refrescar)

    return () => {
      void supabase.removeChannel(channel)
      window.removeEventListener('focus', refrescar)
      window.removeEventListener('online', refrescar)
    }
  }, [userId, fetchItems])

  // --- Mutaciones (todas optimistas) ----------------------------------------

  // Anadir producto al final del line-up de pendientes.
  const add = useCallback(
    async (nombre: string, cantidad = 1) => {
      if (!userId) return
      const limpio = nombre.trim()
      if (!limpio) return

      const maxOrden = itemsRef.current.reduce((m, i) => Math.max(m, i.orden), 0)
      const nuevoOrden = maxOrden + 1
      const tempId = `temp-${crypto.randomUUID()}`
      const optimista: Item = {
        id: tempId,
        user_id: userId,
        nombre: limpio,
        cantidad,
        comprado: false,
        orden: nuevoOrden,
        created_at: new Date().toISOString(),
      }
      setItems((prev) => ordenarItems([...prev, optimista]))

      const { data, error } = await supabase
        .from('items')
        .insert({ user_id: userId, nombre: limpio, cantidad, orden: nuevoOrden })
        .select()
        .single()

      if (error) {
        setItems((prev) => prev.filter((i) => i.id !== tempId))
        setError(error.message)
        return
      }
      // Reemplaza el item temporal por el real (con su id de la BD).
      setItems((prev) => ordenarItems(prev.map((i) => (i.id === tempId ? (data as Item) : i))))
    },
    [userId],
  )

  // Marcar / desmarcar como comprado ("sold out").
  const toggleComprado = useCallback(async (item: Item) => {
    const next = !item.comprado
    setItems((prev) => ordenarItems(prev.map((i) => (i.id === item.id ? { ...i, comprado: next } : i))))

    const { error } = await supabase.from('items').update({ comprado: next }).eq('id', item.id)
    if (error) {
      setItems((prev) => ordenarItems(prev.map((i) => (i.id === item.id ? { ...i, comprado: item.comprado } : i))))
      setError(error.message)
    }
  }, [])

  // Editar nombre y/o cantidad.
  const updateItem = useCallback(
    async (id: string, patch: Partial<Pick<Item, 'nombre' | 'cantidad'>>) => {
      const snapshot = itemsRef.current
      setItems((prev) => ordenarItems(prev.map((i) => (i.id === id ? { ...i, ...patch } : i))))

      const { error } = await supabase.from('items').update(patch).eq('id', id)
      if (error) {
        setItems(snapshot)
        setError(error.message)
      }
    },
    [],
  )

  // Borrar un producto.
  const remove = useCallback(async (id: string) => {
    const snapshot = itemsRef.current
    setItems((prev) => prev.filter((i) => i.id !== id))

    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) {
      setItems(snapshot)
      setError(error.message)
    }
  }, [])

  // Mover un pendiente arriba/abajo intercambiando su 'orden' con el vecino.
  const mover = useCallback(async (item: Item, direccion: -1 | 1) => {
    const pendientes = ordenarItems(itemsRef.current).filter((i) => !i.comprado)
    const idx = pendientes.findIndex((i) => i.id === item.id)
    const vecino = pendientes[idx + direccion]
    if (!vecino) return

    const ordenA = item.orden
    const ordenB = vecino.orden
    setItems((prev) =>
      ordenarItems(
        prev.map((i) => {
          if (i.id === item.id) return { ...i, orden: ordenB }
          if (i.id === vecino.id) return { ...i, orden: ordenA }
          return i
        }),
      ),
    )

    const snapshot = itemsRef.current
    const [r1, r2] = await Promise.all([
      supabase.from('items').update({ orden: ordenB }).eq('id', item.id),
      supabase.from('items').update({ orden: ordenA }).eq('id', vecino.id),
    ])
    if (r1.error || r2.error) {
      setItems(snapshot)
      setError(r1.error?.message ?? r2.error?.message ?? 'Error al reordenar')
    }
  }, [])

  // Convertir un producto en cabeza de cartel (lo manda al principio).
  const hacerHeadliner = useCallback(async (item: Item) => {
    const minOrden = itemsRef.current.reduce((m, i) => Math.min(m, i.orden), 0)
    const nuevoOrden = minOrden - 1
    const snapshot = itemsRef.current
    setItems((prev) =>
      ordenarItems(prev.map((i) => (i.id === item.id ? { ...i, orden: nuevoOrden, comprado: false } : i))),
    )
    const { error } = await supabase
      .from('items')
      .update({ orden: nuevoOrden, comprado: false })
      .eq('id', item.id)
    if (error) {
      setItems(snapshot)
      setError(error.message)
    }
  }, [])

  // Vaciar solo los comprados.
  const vaciarComprados = useCallback(async () => {
    const snapshot = itemsRef.current
    setItems((prev) => prev.filter((i) => !i.comprado))
    const { error } = await supabase.from('items').delete().eq('comprado', true)
    if (error) {
      setItems(snapshot)
      setError(error.message)
    }
  }, [])

  // Vaciar la lista entera.
  const vaciarTodo = useCallback(async () => {
    if (!userId) return
    const snapshot = itemsRef.current
    setItems([])
    const { error } = await supabase.from('items').delete().eq('user_id', userId)
    if (error) {
      setItems(snapshot)
      setError(error.message)
    }
  }, [userId])

  const pendientes = items.filter((i) => !i.comprado)
  const comprados = items.filter((i) => i.comprado)

  return {
    items,
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
    refetch: fetchItems,
  }
}
