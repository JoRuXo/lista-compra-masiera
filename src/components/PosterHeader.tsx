export interface CartelMeta {
  tituloArriba: string
  tituloAbajo: string
  fecha: string
}

interface PosterHeaderProps {
  meta: CartelMeta
  onEditar: () => void
}

// Cabecera del cartel: wordmark + titular gigante editable + linea de fecha.
// Replica la composicion del flyer (MASIA / titular / subtitulo / fecha).
export function PosterHeader({ meta, onEditar }: PosterHeaderProps) {
  return (
    <header className="relative px-5 pt-7 text-center">
      {/* Wordmark de la "marca" (identidad propia, no el logo oficial) */}
      <p className="label-ember mb-2">Psiquiatras de la compra presentan</p>
      <p
        className="font-display leading-none tracking-[0.16em] text-masia-cream"
        style={{ fontSize: 'clamp(1.1rem, 5.5vw, 1.6rem)' }}
      >
        MASI<span className="text-masia-ember">Á</span>
      </p>

      {/* Titular gigante editable (estilo "LOCO / FESTIVAL") */}
      <button
        onClick={onEditar}
        className="group mt-3 block w-full select-none"
        aria-label="Editar el titulo del cartel"
      >
        <span
          className="title-mega distress block"
          style={{ fontSize: 'clamp(3.4rem, 17vw, 5.5rem)' }}
        >
          {meta.tituloArriba || 'LA COMPRA'}
        </span>
        <span
          className="title-mega block text-masia-ember"
          style={{ fontSize: 'clamp(1.6rem, 8vw, 2.6rem)', letterSpacing: '0.06em' }}
        >
          {meta.tituloAbajo || 'SEMANAL'}
        </span>
        <span className="mt-1 inline-block text-[0.6rem] uppercase tracking-[0.25em] text-masia-ash opacity-0 transition-opacity group-hover:opacity-100">
          ✎ tocar para editar
        </span>
      </button>

      {/* Linea de fecha / subtitulo */}
      <p className="label-ember mx-auto mt-3 max-w-[20rem] !tracking-[0.22em]">
        {meta.fecha || 'SÁBADO · DESDE QUE ABRA EL MERCA'}
      </p>

      <div className="rule-dot mx-auto mt-5 max-w-[16rem]">
        <span className="text-xs">✦</span>
      </div>
    </header>
  )
}
