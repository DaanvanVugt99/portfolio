import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import './i18n'
import './styles.css'
import './settings.css'
import './landing.css'
import './workshop.css'
import './vex-project.css'
import './experience.css'
import './sticky-header.css'
import './projects.css'
import './about.css'
import './contact.css'
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
