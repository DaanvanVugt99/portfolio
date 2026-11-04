import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/inter'
import './i18n'
import './styles.css'
import './settings.css'
import './landing.css'
import './workshop.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
