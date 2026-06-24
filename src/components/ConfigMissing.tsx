// Pantalla de ayuda que aparece si faltan las variables de entorno de Supabase.
export function ConfigMissing() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="label-ember mb-3">Falta configuracion</p>
      <h1 className="title-mega mb-4 text-4xl text-masia-ember">SIN CONEXION AL RECINTO</h1>
      <p className="mb-4 text-sm leading-relaxed text-masia-bone">
        No encuentro las credenciales de Supabase. Crea un archivo{' '}
        <code className="text-masia-flame">.env</code> en la raiz del proyecto a partir de{' '}
        <code className="text-masia-flame">.env.example</code> y rellena:
      </p>
      <pre className="w-full overflow-x-auto rounded-md border border-masia-ember/30 bg-black/50 p-4 text-left text-xs text-masia-cream">
        VITE_SUPABASE_URL=...{'\n'}VITE_SUPABASE_ANON_KEY=...
      </pre>
      <p className="mt-4 text-xs text-masia-ash">Reinicia el servidor de desarrollo despues de crearlo.</p>
    </div>
  )
}
