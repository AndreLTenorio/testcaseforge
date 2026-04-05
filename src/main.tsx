import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'
import { UILanguageProvider } from './contexts/UILanguageContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UILanguageProvider>
      <App />
    </UILanguageProvider>
  </StrictMode>,
)

// Register Service Worker for PWA / offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — app still works online
    })
  })
}
