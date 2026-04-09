import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { POOL_ENTRIES_2 } from './data/poolEntries2.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App
      poolEntries={POOL_ENTRIES_2}
      poolTitle="MASTERS POOL"
      defaultEntry="Brian Flaherty"
      storageKey="sunday-pool-entry"
    />
  </StrictMode>,
)
