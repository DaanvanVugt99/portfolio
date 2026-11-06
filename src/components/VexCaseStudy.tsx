import { useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Braces,
  CalendarDays,
  Database,
  GitBranch,
  Layers3,
  Link2,
  RefreshCw,
  SlidersHorizontal,
  Smartphone,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  exampleOffers,
  offerArchitecturePatterns,
  offerGroups,
  vexCaseStages,
  type OfferGroup,
} from '../data/vexCaseStudy'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import '../vex-case-study.css'

const stageIcons = { backend: Database, app: Smartphone, compatibility: GitBranch }

function ConfigurationDiagram() {
  const { t } = useTranslation()
  return (
    <div className="offer-config-diagram">
      <div className="offer-feed-source">
        <span className="offer-feed-format" aria-hidden="true">
          XML
        </span>
        <div>
          <strong>{t('vexCaseStudy.visual.feed')}</strong>
          <span>{t('vexCaseStudy.visual.feedData')}</span>
        </div>
      </div>
      <div className="offer-mapping-connector" aria-hidden="true">
        <ArrowDown size={16} />
      </div>
      <div className="offer-diagram-label">
        <SlidersHorizontal size={15} aria-hidden="true" />
        {t('vexCaseStudy.visual.configuration')}
      </div>
      <div className="offer-config-row">
        <code>summer-sale</code>
        <span>
          /summer
          <br />
          /seasonal-offers
        </span>
      </div>
      <div className="offer-config-row">
        <code>last-minutes</code>
        <span>/last-minute</span>
      </div>
      <div className="offer-mapping-connector">
        <span />
        <ArrowDown size={16} aria-hidden="true" />
        <span />
      </div>
      <div className="offer-mapping-node">
        <Braces size={20} aria-hidden="true" />
        <div>
          <strong>{t('vexCaseStudy.visual.mapping')}</strong>
          <span>{t('vexCaseStudy.visual.membership')}</span>
        </div>
      </div>
      <div className="offer-cache-note">
        <RefreshCw size={14} aria-hidden="true" />
        <span>{t('vexCaseStudy.visual.cache')}</span>
      </div>
    </div>
  )
}

function OfferFilterDiagram() {
  const { t } = useTranslation()
  const [group, setGroup] = useState<OfferGroup>('summer-sale')
  const matches = exampleOffers.filter((offer) => group === 'all' || offer.groups.includes(group))
  const exampleLink = `valkexclusief://app-links?type=packages_overview${group === 'all' ? '' : `&group=${group}`}`
  return (
    <div className="offer-filter-diagram">
      <div className="offer-diagram-label">
        <Link2 size={15} aria-hidden="true" />
        {t('vexCaseStudy.visual.filter')}
      </div>
      <RadioGroup
        className="offer-filter-options"
        value={group}
        onValueChange={(value) => setGroup(value as OfferGroup)}
        aria-label={t('vexCaseStudy.visual.filterLabel')}
        orientation="horizontal"
      >
        {offerGroups.map((value) => (
          <RadioGroupItem value={value} key={value}>
            {t(`vexCaseStudy.groups.${value}`)}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      <div className="offer-campaign-link">
        <span>{t('vexCaseStudy.visual.exampleLink')}</span>
        <code>{exampleLink}</code>
      </div>
      <div className="offer-mapping-connector" aria-hidden="true">
        <ArrowDown size={16} />
      </div>
      <div className="offer-diagram-label offer-results-label">
        <Smartphone size={15} aria-hidden="true" />
        {t('vexCaseStudy.visual.dealsOverview')}
      </div>
      <ul className="offer-example-list">
        {matches.map((offer) => (
          <li className="offer-example" key={offer.id}>
            <span className="offer-example-icon">
              <CalendarDays size={19} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <div>
              <strong>{t(`vexCaseStudy.offers.${offer.id}`)}</strong>
              <span>{offer.groups.join(' · ')}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="offer-filter-summary" role="status">
        {t('vexCaseStudy.visual.matchCount', {
          count: matches.length,
          total: exampleOffers.length,
        })}
      </p>
    </div>
  )
}

function CompatibilityDiagram() {
  const { t } = useTranslation()
  return (
    <div className="offer-compat-diagram">
      <div className="offer-diagram-label">
        <Link2 size={15} aria-hidden="true" />
        {t('vexCaseStudy.visual.linkInputs')}
      </div>
      <div className="offer-link-inputs">
        <div>
          <span>{t('vexCaseStudy.visual.existing')}</span>
          <code>highlighted=true</code>
        </div>
        <div>
          <span>{t('vexCaseStudy.visual.groupLink')}</span>
          <code>group=highlighted</code>
        </div>
      </div>
      <div className="offer-merge-lines" aria-hidden="true">
        <span />
        <span />
        <ArrowDown size={16} />
      </div>
      <div className="offer-mapping-node">
        <Layers3 size={20} aria-hidden="true" />
        <div>
          <strong>{t('vexCaseStudy.visual.sameFilter')}</strong>
          <code>group: "highlighted"</code>
        </div>
      </div>
      <div className="offer-legacy-fields">
        <span>{t('vexCaseStudy.visual.apiFlags')}</span>
        <div>
          <code>is_last_minute</code>
          <code>highlighted</code>
        </div>
      </div>
    </div>
  )
}

const diagrams = {
  backend: ConfigurationDiagram,
  app: OfferFilterDiagram,
  compatibility: CompatibilityDiagram,
}

export function VexCaseStudy() {
  const { t } = useTranslation()
  return (
    <section id="offer-groups" className="vex-case-study" aria-labelledby="offer-case-title">
      <header className="offer-case-heading">
        <span className="eyebrow">{t('vexCaseStudy.eyebrow')}</span>
        <h2 id="offer-case-title">{t('vexCaseStudy.title')}</h2>
        <p>{t('vexCaseStudy.introduction')}</p>
      </header>
      <div className="offer-case-context">
        <div>
          <h3>{t('vexCaseStudy.context.title')}</h3>
          <p>{t('vexCaseStudy.context.body')}</p>
        </div>
        <div>
          <h3>{t('vexCaseStudy.scope.title')}</h3>
          <p>{t('vexCaseStudy.scope.body')}</p>
        </div>
      </div>
      <ol className="offer-system-flow" aria-label={t('vexCaseStudy.flow.label')}>
        {(['feed', 'mapping', 'api', 'filtering'] as const).map((stage, index) => (
          <li key={stage}>
            <span className="offer-flow-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{t(`vexCaseStudy.flow.${stage}`)}</span>
            {index < 3 && <ArrowRight size={16} aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <Tabs defaultValue="backend" className="offer-explorer">
        <TabsList aria-label={t('vexCaseStudy.explore')} className="offer-stage-tabs">
          {vexCaseStages.map((stage) => {
            const Icon = stageIcons[stage]
            return (
              <TabsTrigger key={stage} value={stage}>
                <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                {t(`vexCaseStudy.stages.${stage}.label`)}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {vexCaseStages.map((stage) => {
          const Diagram = diagrams[stage]
          return (
            <TabsContent key={stage} value={stage} className="offer-stage-panel">
              <div className="offer-stage-copy">
                <span className="offer-stage-tech">
                  {t(`vexCaseStudy.stages.${stage}.technology`)}
                </span>
                <h3>{t(`vexCaseStudy.stages.${stage}.title`)}</h3>
                <p>{t(`vexCaseStudy.stages.${stage}.body`)}</p>
                <p>{t(`vexCaseStudy.stages.${stage}.detail`)}</p>
                {stage === 'backend' && (
                  <p className="offer-stage-tradeoff">
                    <strong>{t('vexCaseStudy.tradeoff.title')}</strong>
                    {t('vexCaseStudy.tradeoff.body')}
                  </p>
                )}
              </div>
              <figure className="offer-stage-visual">
                <Diagram />
                <figcaption>{t('vexCaseStudy.visual.caption')}</figcaption>
              </figure>
            </TabsContent>
          )
        })}
      </Tabs>
      <section className="offer-case-architecture" aria-labelledby="offer-architecture-title">
        <h3 id="offer-architecture-title">{t('vexCaseStudy.architecture.title')}</h3>
        <dl className="offer-pattern-list">
          {offerArchitecturePatterns.map((pattern) => (
            <div key={pattern}>
              <dt>{t(`vexCaseStudy.architecture.${pattern}.title`)}</dt>
              <dd>{t(`vexCaseStudy.architecture.${pattern}.body`)}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="offer-case-tests" aria-labelledby="offer-tests-title">
        <div className="offer-test-heading">
          <h3 id="offer-tests-title">{t('vexCaseStudy.testing.title')}</h3>
          <p>{t('vexCaseStudy.testing.introduction')}</p>
        </div>
        <div className="offer-test-grid">
          {(['backend', 'app', 'links'] as const).map((area, index) => (
            <div key={area}>
              <span className="offer-test-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4>{t(`vexCaseStudy.testing.${area}.title`)}</h4>
              <p>{t(`vexCaseStudy.testing.${area}.body`)}</p>
              <span className="offer-test-tool">{t(`vexCaseStudy.testing.${area}.tool`)}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
