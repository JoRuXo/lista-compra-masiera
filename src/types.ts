// Modelo de datos de la app. Un "item" es un producto de la lista,
// que en la metafora del cartel es un "DJ" del line-up.
export interface Item {
  id: string
  user_id: string
  nombre: string
  cantidad: number
  comprado: boolean
  orden: number
  created_at: string
}

// Datos minimos para crear un item nuevo.
export interface NewItem {
  nombre: string
  cantidad: number
}
