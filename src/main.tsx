import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (navigator.storage?.persist) {
  navigator.storage.persist()
}

// Apply saved theme before render to prevent flash
const savedTheme = localStorage.getItem('without_theme')
if (savedTheme === 'dark' || savedTheme === 'light') {
  document.documentElement.classList.add(savedTheme)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
