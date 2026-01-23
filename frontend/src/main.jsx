import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Logo from './components/ui/Logo.jsx'
import Register from './pages/auth/Register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
   </StrictMode>,
)
