import { ArrowRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import '../case-study.css'

type Note = { title: string; body: string }
type CaseStudyStage = {
  id: string
  label: string
  Icon: LucideIcon
  technology: string
  title: string
  paragraphs: string[]
  note?: Note
  visual: ReactNode
  caption: string
}

export function TechnicalCaseStudy({
  id,
  eyebrow,
  title,
  introduction,
  context,
  flow,
  explorerLabel,
  stages,
  architecture,
  testing,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  introduction: string
  context: Note[]
  flow: { label: string; steps: string[] }
  explorerLabel: string
  stages: CaseStudyStage[]
  architecture: { title: string; patterns: Note[] }
  testing: { title: string; introduction: string; areas: (Note & { tool: string })[] }
  children?: ReactNode
}) {
  return (
    <section id={id} className="technical-case-study" aria-labelledby={`${id}-title`}>
      <header className="case-study-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{introduction}</p>
      </header>
      <div className="case-study-context">
        {context.map((note) => (
          <div key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
          </div>
        ))}
      </div>
      <ol className="case-study-flow" aria-label={flow.label}>
        {flow.steps.map((step, index) => (
          <li key={step}>
            <span className="case-study-flow-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{step}</span>
            {index < flow.steps.length - 1 && <ArrowRight size={16} aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <Tabs defaultValue={stages[0].id} className="case-study-explorer">
        <TabsList aria-label={explorerLabel} className="case-study-tabs">
          {stages.map(({ id, label, Icon }) => (
            <TabsTrigger value={id} key={id}>
              <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {stages.map((stage) => (
          <TabsContent forceMount value={stage.id} key={stage.id} className="case-study-panel">
            <div className="case-study-copy">
              <span className="case-study-tech">{stage.technology}</span>
              <h3>{stage.title}</h3>
              {stage.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {stage.note && (
                <p className="case-study-tradeoff">
                  <strong>{stage.note.title}</strong>
                  {stage.note.body}
                </p>
              )}
            </div>
            <figure className="case-study-visual">
              {stage.visual}
              <figcaption>{stage.caption}</figcaption>
            </figure>
          </TabsContent>
        ))}
      </Tabs>
      <section className="case-study-architecture" aria-labelledby={`${id}-architecture`}>
        <h3 id={`${id}-architecture`}>{architecture.title}</h3>
        <dl className="case-study-patterns">
          {architecture.patterns.map((pattern) => (
            <div key={pattern.title}>
              <dt>{pattern.title}</dt>
              <dd>{pattern.body}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="case-study-tests" aria-labelledby={`${id}-tests`}>
        <div className="case-study-test-heading">
          <h3 id={`${id}-tests`}>{testing.title}</h3>
          <p>{testing.introduction}</p>
        </div>
        <div className="case-study-test-grid">
          {testing.areas.map((area, index) => (
            <div key={area.title}>
              <span className="case-study-test-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4>{area.title}</h4>
              <p>{area.body}</p>
              <span className="case-study-test-tool">{area.tool}</span>
            </div>
          ))}
        </div>
      </section>
      {children}
    </section>
  )
}
