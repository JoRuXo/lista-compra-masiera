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

  // Reordena los pendientes segun una lista de ids y persiste el nuevo 'orden'
  // en Supabase (para que el orden se mantenga al recargar / en otros dispositivos).
  const reordenar = useCallback(async (idsEnOrden: string[]) => {
    const snapshot = itemsRef.current
    setItems((prev) => {
      const byId = new Map(prev.map((i) => [i.id, i]))
      const reordenados = idsEnOrden
        .map((id, idx) => {
          const it = byId.get(id)
          return it ? { ...it, orden: idx } : null
        })
        .filter((x): x is Item => x !== null)
      const resto = prev.filter((i) => !idsEnOrden.includes(i.id))
      return ordenarItems([...reordenados, ...resto])
    })

    const results = await Promise.all(
      idsEnOrden.map((id, idx) => supabase.from('items').update({ orden: idx }).eq('id', id)),
    )
    if (results.some((r) => r.error)) {
      setItems(snapshot)
      setError('Error al reordenar')
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
    reordenar,
    vaciarComprados,
    vaciarTodo,
    refetch: fetchItems,
  }
}
