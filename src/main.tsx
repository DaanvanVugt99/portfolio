import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/inter'
import './i18n'
import './styles.css'
import './settings.css'
import './landing.css'
import './workshop.css'
import './vex-project.css'
import App from './App'
import { landing } from './data/landing'
import { loadNameAssets } from './graphics/nameAssets'

if (location.pathname === '/' && !['#work', '#about', '#contact'].includes(location.hash)) {
  void loadNameAssets(landing.font).catch(() => {
    // LandingName handles loading failures with its HTML fallback.
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
