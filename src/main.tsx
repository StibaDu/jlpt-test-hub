import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Self-hosted fonts (DSGVO: no third-party font CDN requests)
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/noto-sans-jp'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)