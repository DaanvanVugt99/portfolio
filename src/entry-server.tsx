import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import './i18n'
import { OverviewPage } from './components/OverviewPage'
import { ProjectPage } from './components/ProjectPage'
import { ProjectsPage } from './components/ProjectsPage'
import { ExperiencePage } from './components/ExperiencePage'
import { AboutPage } from './components/AboutPage'
import { ContactPage } from './components/ContactPage'

const pages = { OverviewPage, ProjectPage, ProjectsPage, ExperiencePage, AboutPage, ContactPage }

// All page modules are loaded at build time; the browser keeps lazy route splitting.
export function render(path: string) {
  return renderToString(
    <StaticRouter location={path}>
      <App pages={pages} />
    </StaticRouter>,
  )
}
