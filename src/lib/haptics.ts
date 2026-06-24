// Pequena vibracion en moviles que lo soporten (microinteraccion).
export function vibrar(patron: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(patron)
    } catch {
      /* algunos navegadores lo bloquean; no pasa nada */
    }
  }
}
