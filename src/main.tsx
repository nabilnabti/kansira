import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App'

// Auto-reload when a new SW version is available — no reinstall needed
registerSW({
  onNeedRefresh() {
    // Silently reload to apply the update
    window.location.reload()
  },
  onOfflineReady() {
    // PWA ready for offline use — no action needed
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
