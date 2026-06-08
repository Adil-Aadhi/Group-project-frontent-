import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./app.css"
import App from './App.jsx'
import "./styles/themes.css"
import "./styles/global.css"
import { AuthProvider } from './context/auth/AuthContext.jsx'

import { ThemeProvider } from './context/ThemeContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
