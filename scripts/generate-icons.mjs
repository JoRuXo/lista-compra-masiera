// Genera los iconos PNG de la PWA a partir de un SVG (el mismo "vinilo" del
// favicon). Ejecutar con: npm run icons
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public')

// Construye el SVG del icono. Si "maskable", deja margen de seguridad
// (el disco mas pequeno) y fondo a sangre para que el recorte del SO no corte.
function svgIcono({ maskable }) {
  const escala = maskable ? 0.66 : 0.86
  const r = Math.round(178 * escala)
  const rEtiqueta = Math.round(52 * escala)
  const rings = [150, 118, 86].map((v) => Math.round(v * escala))
  const radioFondo = maskable ? 0 : 96

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="glow" cx="50%" cy="20%" r="75%">
      <stop offset="0%" stop-color="#E8821E" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#E8821E" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F4EDE2" stop-opacity="0.85"/>
      <stop offset="45%" stop-color="#F4EDE2" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="512" height="512" rx="${radioFondo}" fill="#0a0806"/>
  <rect x="0" y="0" width="512" height="512" rx="${radioFondo}" fill="url(#glow)"/>
  <g transform="translate(256 256)">
    <circle r="${r}" fill="#15110c" stroke="#E8821E" stroke-width="8"/>
    <circle r="${rings[0]}" fill="none" stroke="#E8821E" stroke-opacity="0.30" stroke-width="3"/>
    <circle r="${rings[1]}" fill="none" stroke="#E8821E" stroke-opacity="0.22" stroke-width="3"/>
    <circle r="${rings[2]}" fill="none" stroke="#F4EDE2" stroke-opacity="0.14" stroke-width="3"/>
    <circle r="${rEtiqueta}" fill="#E8821E"/>
    <circle r="${Math.round(rEtiqueta * 0.19)}" fill="#0a0806"/>
  </g>
</svg>`
}

async function render(svg, size, file) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(outDir, file))
  console.log('  ✓', file)
}

async function main() {
  await mkdir(outDir, { recursive: true })
  console.log('Generando iconos en public/ …')
  const normal = svgIcono({ maskable: false })
  const maskable = svgIcono({ maskable: true })
  await render(normal, 192, 'icon-192.png')
  await render(normal, 512, 'icon-512.png')
  await render(normal, 180, 'apple-touch-icon.png')
  await render(maskable, 512, 'maskable-512.png')
  console.log('Listo.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
