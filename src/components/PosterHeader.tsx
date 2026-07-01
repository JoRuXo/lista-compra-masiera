import type { CSSProperties } from 'react'
import { Wordmark } from './Wordmark'

export interface CartelMeta {
  tituloArriba: string
  tituloAbajo: string
  fecha: string
}

interface PosterHeaderProps {
  meta: CartelMeta
  onEditar: () => void
}

// Cabecera del cartel: wordmark "MASIÁ" + titular gigante editable + fecha.
// Replica la composicion del flyer (marca / titular / subtitulo / fecha).
export function PosterHeader({ meta, onEditar }: PosterHeaderProps) {
  const tituloArriba = meta.tituloArriba || 'LA COMPRA'
  const tituloAbajo = meta.tituloAbajo || 'SEMANAL'

  return (
    <header className="relative px-5 pt-7 text-center">
      <p className="label-ember mb-3">Psiquiatras de la compra presentan</p>

      {/* Logotipo propio (SVG) */}
      <Wordmark className="mx-auto h-11 w-auto sm:h-14" />

      {/* Titular gigante editable, maquetado como unidad de cartel:
          el titular manda y el subtitulo se reparte a su mismo ancho
          (como "FESTIVAL" bajo "LOCO" en el flyer real). */}
      <button
        onClick={onEditar}
        className="group mt-4 flex w-full select-none flex-col items-center"
        aria-label="Editar el titulo del cartel"
      >
        <span className="relative inline-block">
          <span
            className="title-mega distress block leading-[0.8]"
            style={{ fontSize: 'clamp(3rem, 15.5vw, 5.25rem)' }}
          >
            {tituloArriba}
          </span>
          <SpreadWord
            text={tituloAbajo}
            className="title-mega mt-1 leading-none text-masia-ember"
            style={{ fontSize: 'clamp(1.3rem, 6.6vw, 2.05rem)' }}
          />
        </span>
        <span className="mt-2 inline-block text-[0.6rem] uppercase tracking-[0.25em] text-masia-ash opacity-0 transition-opacity group-hover:opacity-100">
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

// Reparte las letras de una palabra a lo ancho del contenedor (ancho del
// titular), para el efecto "subtitulo justificado" de cartel.
function SpreadWord({
  text,
  className = '',
  style,
}: {
  text: string
  className?: string
  style?: CSSProperties
}) {
  const chars = [...text]
  if (chars.length < 2) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    )
  }
  return (
    <span className={`flex w-full justify-between ${className}`} style={style} aria-label={text}>
      {chars.map((c, i) => (
        <span key={i} aria-hidden>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  )
}
