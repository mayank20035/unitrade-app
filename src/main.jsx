import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx' // <-- 1. IMPORT THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* <-- 2. WRAP APP WITH THIS */}
        <App />
      </AuthProvider> {/* <-- 3. AND THIS */}
    </BrowserRouter>
  </React.StrictMode>,
)