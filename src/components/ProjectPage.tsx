import { ArrowLeft, ArrowRight, Check, ExternalLink, LockKeyhole, Server } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { type Project } from '../data/portfolio'
import { usePortfolio } from '../hooks/usePortfolio'
import { Pills } from './Pills'
import { VexProjectVisual } from './VexVisuals'
import { DivergenceProjectVisual } from './DivergenceProjectVisual'
import { ProjectThumbnail } from './ProjectThumbnail'
import '../projects.css'

function ProjectDetailVisual({ project }: { project: Project }) {
  switch (project.slug) {
    case 'vex':
      return <VexProjectVisual />
    case 'divergence':
      return <DivergenceProjectVisual />
    case 'valk-to-go':
    case 'hktd':
      return (
        <div className="project-static-visual">
          <ProjectThumbnail thumbnail={project.thumbnail} priority />
        </div>
      )
  }
}

export function ProjectPage({ project }: { project: Project }) {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  const other = projects.find((p) => p.slug !== project.slug)!
  return (
    <main id="main" className="project-page">
      <Link to={`/projects#${project.slug}`} className="back-link">
        <ArrowLeft size={16} /> {t('navigation.back')}
      </Link>
      <div className="case-heading">
        <span className="eyebrow">{project.eyebrow}</span>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <Pills items={project.technologies} />
      </div>
      <ProjectDetailVisual project={project} />
      {project.backend && (
        <section className="shared-backend">
          <Server size={22} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <h2>{t('caseStudy.backend')}</h2>
            <p>{project.backend}</p>
          </div>
        </section>
      )}
      <div className="case-columns">
        <section>
          <h2>{t('caseStudy.involvement')}</h2>
          <p className="project-role">{project.role}</p>
          <ul className="contribution-list">
            {project.contributions.map((item) => (
              <li key={item}>
                <Check size={16} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>
        {(project.links.length > 0 || project.sourceVisibility === 'private') && (
          <aside>
            <h2 className="eyebrow">{t('caseStudy.links')}</h2>
            {project.links.map((link) => (
              <Button asChild variant="outline" key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </Button>
            ))}
            {project.sourceVisibility === 'private' && (
              <span className="project-source-status">
                <LockKeyhole size={15} aria-hidden="true" />
                {t('caseStudy.privateSource')}
              </span>
            )}
          </aside>
        )}
      </div>
      {project.slug === 'divergence' && <p className="credits">{t('caseStudy.credits')}</p>}
      <Link to={`/projects/${other.slug}`} className="next-project">
        <span>
          <small>{t('caseStudy.other')}</small>
          {other.title}
        </span>
        <ArrowRight size={25} />
      </Link>
    </main>
  )
}
