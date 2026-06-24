import { useCallback, useEffect, useState } from 'react'

// Hook sencillo para persistir un valor en localStorage.
// Se usa para los datos editables del cartel (titulo, fecha) que son
// personales y no necesitan ir a la base de datos.
export function useLocalStorage<T>(key: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const guardado = localStorage.getItem(key)
      return guardado !== null ? (JSON.parse(guardado) as T) : inicial
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(valor))
    } catch {
      /* ignorar errores de cuota/privado */
    }
  }, [key, valor])

  const reset = useCallback(() => setValor(inicial), [inicial])

  return [valor, setValor, reset] as const
}
