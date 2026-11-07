import '../projects.css'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePortfolio } from '../hooks/usePortfolio'
import { Card } from './ui/card'
import { ProjectThumbnail } from './ProjectThumbnail'

export function ProjectsPage() {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  return (
    <main id="main" tabIndex={-1} className="projects-page">
      <header className="projects-heading">
        <h1>{t('work.title')}</h1>
        <Link to="/portfolio" className="back-link">
          <ArrowLeft size={15} aria-hidden="true" /> {t('work.back')}
        </Link>
      </header>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <Card className="work-card" id={project.slug} key={project.slug}>
            <Link
              to={`/projects/${project.slug}`}
              className="work-card-link"
              aria-labelledby={`${project.slug}-title`}
              aria-describedby={`${project.slug}-summary ${project.slug}-contribution`}
            >
              <ProjectThumbnail thumbnail={project.thumbnail} priority={index < 2} />
              <div className="work-card-copy">
                <div className="work-card-category">
                  <span>{t(`work.categories.${project.category}`)}</span>
                  <ArrowRight
                    className="work-card-arrow"
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <h2 id={`${project.slug}-title`}>{project.title}</h2>
                <p className="work-card-summary" id={`${project.slug}-summary`}>
                  {project.overview.summary}
                </p>
                <p className="work-card-contribution" id={`${project.slug}-contribution`}>
                  {project.overview.contribution}
                </p>
                <ul className="work-card-technologies" aria-label={t('work.technologies')}>
                  {project.overviewTechnologies.slice(0, 4).map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  )
}
