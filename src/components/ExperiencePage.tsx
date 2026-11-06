import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '../experience.css'
import { useMemo } from 'react'
import { ArrowLeft, ArrowRight, Baby, BriefcaseBusiness, Check, Code2, Shapes } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { establishedYear, experience, formatExperienceDate } from '../data/experience'
import { Timeline, type TimelineItem } from './ui/timeline'
import { Card } from './ui/card'
import { SkillGroups } from './SkillGroups'

const markers = { work: BriefcaseBusiness, study: Code2, school: Shapes }

export function ExperiencePage() {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'en'
  const items = useMemo<TimelineItem[]>(() => {
    const milestones: TimelineItem[] = experience.map((entry) => {
      const Marker = markers[entry.kind]
      const copy = t(entry.translationKey, { returnObjects: true })
      return {
        id: entry.id,
        featured: entry.featured,
        side: entry.side,
        marker: <Marker size={19} strokeWidth={1.5} />,
        period: (
          <>
            <time dateTime={entry.start}>{formatExperienceDate(entry.start, language)}</time>
            <span className="timeline-date-dash" aria-hidden="true">
              —
            </span>
            <span className="sr-only"> {t('experience.to')} </span>
            <time dateTime={entry.end}>{formatExperienceDate(entry.end, language)}</time>
          </>
        ),
        content: (
          <Card className={`timeline-panel timeline-panel-${entry.kind}`}>
            <div className="timeline-identity">
              <span className="eyebrow">{t(`experience.kinds.${entry.kind}`)}</span>
              <div className={`timeline-brand timeline-brand-${entry.id}`} aria-hidden="true">
                <img
                  src={entry.logo.src}
                  width={entry.logo.width}
                  height={entry.logo.height}
                  alt=""
                />
              </div>
            </div>
            <div className="timeline-panel-heading">
              <div className="timeline-panel-title">
                <h2>{entry.organization}</h2>
                <p className="timeline-qualification">{copy.qualification}</p>
              </div>
            </div>
            {entry.id === 'valk' ? (
              <ul className="timeline-contributions">
                {t('experience.entries.valk.bullets', { returnObjects: true }).map((text) => (
                  <li key={text}>
                    <span aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="timeline-description">
                  {'description' in copy ? copy.description : ''}
                </p>
                <p
                  className={`timeline-status ${entry.kind === 'school' ? 'timeline-completed' : ''}`}
                >
                  {entry.kind === 'school' && <Check size={14} aria-hidden="true" />}
                  {'status' in copy ? copy.status : ''}
                </p>
              </>
            )}
            {entry.projectHref && (
              <Link className="timeline-project-link" to={entry.projectHref}>
                {t('experience.vexLink')}
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            )}
          </Card>
        ),
      }
    })
    return [
      {
        id: 'next',
        side: 'left',
        variant: 'opportunity',
        period: t('experience.opportunity.period'),
        marker: <span className="timeline-question">?</span>,
        content: (
          <Card className="timeline-panel timeline-panel-opportunity">
            <span className="timeline-availability">
              <span aria-hidden="true" />
              {t('experience.opportunity.status')}
            </span>
            <h2>{t('experience.opportunity.title')}</h2>
            <p className="timeline-description">{t('experience.opportunity.description')}</p>
            <Link className="timeline-project-link" to="/contact">
              {t('experience.opportunity.contact')}
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </Card>
        ),
      },
      ...milestones,
      {
        id: 'origin',
        variant: 'root',
        period: null,
        marker: <Baby size={19} strokeWidth={1.5} />,
        content: (
          <div className="timeline-origin">
            <h2>
              <span className="timeline-origin-label">{t('experience.origin.established')}</span>{' '}
              <time dateTime={establishedYear}>{establishedYear}</time>
            </h2>
          </div>
        ),
      },
    ]
  }, [t, language])

  return (
    <main id="main" className="experience-page">
      <Link to="/portfolio#experience" className="back-link">
        <ArrowLeft size={16} />
        {t('experience.back')}
      </Link>
      <header className="experience-page-heading">
        <h1>{t('experience.title')}</h1>
      </header>
      <Timeline items={items} label={t('experience.listLabel')} />
      <section className="experience-skills" aria-labelledby="skills">
        <h2 id="skills">{t('skills.title')}</h2>
        <p>{t('skills.context')}</p>
        <SkillGroups />
        <section className="additional-languages" aria-labelledby="additional-languages">
          <h3 id="additional-languages">{t('skills.additional.title')}</h3>
          <dl>
            <div>
              <dt>Java</dt>
              <dd>{t('skills.additional.java')}</dd>
            </div>
            <div>
              <dt>C#</dt>
              <dd>{t('skills.additional.csharp')}</dd>
            </div>
          </dl>
          <p>{t('skills.additional.interest')}</p>
        </section>
      </section>
    </main>
  )
}
