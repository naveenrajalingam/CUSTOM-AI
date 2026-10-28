import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/aileron/latin-400.css'
import '@fontsource/aileron/latin-600.css'
import '@fontsource/aileron/latin-700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
