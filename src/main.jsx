import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
// import TelegramGate from './telegram/TelegramGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      {/* Temporarily disabled while debugging mobile access.
          Re-enable TelegramGate after confirming the app opens on real phones. */}
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
