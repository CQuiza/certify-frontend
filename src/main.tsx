import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { config } from './config'
import { initSentry } from './lib/sentry'

initSentry()
document.title = `${config.appName} — Plataforma de certificación`
const metaDescription = document.querySelector('meta[name="description"]')
if (metaDescription) {
  metaDescription.setAttribute(
    'content',
    `${config.appName}: la infraestructura tecnológica para gestionar, vender y certificar tus capacitaciones corporativas.`,
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
