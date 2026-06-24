/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // Breakpoint extra-pequeno para movil (mostrar etiquetas de controles).
        xs: '400px',
      },
      // Paleta sacada del cartel "LOCO FESTIVAL" de la Masia:
      // negro/tierra quemada de fondo, ambar/naranja de neon y crema desgastado.
      colors: {
        masia: {
          black: '#0a0806',
          ink: '#0d0a07',
          coal: '#15110c',
          ember: '#E8821E', // naranja titular ("FESTIVAL")
          flame: '#F4A11D', // ambar mas claro (etiquetas)
          gold: '#f6c453',
          cream: '#F4EDE2', // texto del line-up
          bone: '#cdc3b4', // crema apagado para textos secundarios
          ash: '#8a7d6b',
          blood: '#b3261e',
        },
      },
      fontFamily: {
        display: ['Anton', 'Oswald', 'Impact', 'sans-serif'],
        head: ['Oswald', 'Arial Narrow', 'sans-serif'],
      },
      letterSpacing: {
        cartel: '0.02em',
        mega: '0.12em',
      },
      keyframes: {
        'stamp-in': {
          '0%': { transform: 'scale(2.4) rotate(-18deg)', opacity: '0' },
          '60%': { transform: 'scale(0.9) rotate(-11deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-11deg)', opacity: '1' },
        },
        'flash-in': {
          '0%': { transform: 'translateY(8px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '1' },
          '50%': { opacity: '0.55' },
          '55%': { opacity: '1' },
        },
        scan: {
          '0%': { backgroundPosition: '0 -100%' },
          '100%': { backgroundPosition: '0 200%' },
        },
      },
      animation: {
        'stamp-in': 'stamp-in 0.35s cubic-bezier(.2,1.4,.4,1) both',
        'flash-in': 'flash-in 0.28s ease-out both',
        flicker: 'flicker 4s infinite',
      },
    },
  },
  plugins: [],
}
