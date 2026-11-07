import React from 'react'
import ReactDOM from 'react-dom/client'
import './fonts.css'
import './i18n'
import { BrowserRouter } from 'react-router-dom'
import './styles.css'
import './settings.css'
import './landing.css'
import './sticky-header.css'
import './mobile-navigation.css'
import App, { initialPages } from './App'
import { landing } from './data/landing'
import { loadNameAssets } from './graphics/nameAssets'

if (location.pathname === '/' && !['#work', '#about', '#contact'].includes(location.hash)) {
  void loadNameAssets(landing.font).catch(() => {
    // LandingName handles loading failures with its HTML fallback.
  })
}

async function start() {
  const root = document.getElementById('root')!
  const prerendered = root.hasAttribute('data-prerendered')
  const pages = prerendered ? await initialPages(location.pathname) : undefined
  const app = (
    <React.StrictMode>
      <BrowserRouter>
        <App pages={pages} />
      </BrowserRouter>
    </React.StrictMode>
  )
  if (prerendered) ReactDOM.hydrateRoot(root, app)
  else ReactDOM.createRoot(root).render(app)
}
void start().catch((error) => {
  // Keep the readable static page and normal links available if its code cannot load.
  console.error('Unable to initialise the portfolio.', error)
})
