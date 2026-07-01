import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Fuentes auto-alojadas (funcionan offline en la PWA).
import '@fontsource/anton/400.css'
import '@fontsource/oswald/300.css'
import '@fontsource/oswald/400.css'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/600.css'
import '@fontsource/oswald/700.css'
import '@fontsource/grenze-gotisch/700.css'
import '@fontsource/grenze-gotisch/900.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
