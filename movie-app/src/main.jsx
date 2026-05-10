import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import TelegramGate from './telegram/TelegramGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <TelegramGate>
        <App />
      </TelegramGate>
    </ErrorBoundary>
  </StrictMode>,
)
