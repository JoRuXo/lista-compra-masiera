interface WordmarkProps {
  className?: string
}

// Logotipo "MASIÁ" — lettering propio (homenaje, NO el logo oficial).
// Base: fuente gótica libre "Grenze Gotisch" (trazo puntiagudo/dramático)
// + un flourish SVG propio, simétrico y centrado, que evoca la curva
// caligráfica del logo real. SVG escalable, reutilizable y editable.
export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 400 140"
      className={className}
      role="img"
      aria-label="MASIÁ"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="200"
        y="86"
        textAnchor="middle"
        fontFamily="'Grenze Gotisch', 'Times New Roman', serif"
        fontWeight={900}
        fontSize="92"
        letterSpacing="2"
        fill="#F4EDE2"
      >
        MASIÁ
      </text>

      {/* Flourish caligráfico bajo la palabra (curva propia). */}
      <g fill="#E8821E">
        {/* Trazo horizontal fino con remates puntiagudos que suben. */}
        <path d="M64 108 C120 120 165 122 200 122 C235 122 280 120 336 108 C300 120 250 116 200 116 C150 116 100 120 64 108 Z" />
        {/* Curl izquierdo. */}
        <path d="M64 108 C54 106 48 100 46 92 C52 98 60 102 70 104 Z" />
        {/* Curl derecho. */}
        <path d="M336 108 C346 106 352 100 354 92 C348 98 340 102 330 104 Z" />
        {/* Rombo central. */}
        <path d="M200 110 l8 7 l-8 7 l-8 -7 Z" />
      </g>
    </svg>
  )
}
