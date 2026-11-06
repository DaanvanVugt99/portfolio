import { useState } from 'react'
import {
  ArrowDown,
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
import { TechnicalCaseStudy } from './TechnicalCaseStudy'

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
    <TechnicalCaseStudy
      id="offer-groups"
      eyebrow={t('vexCaseStudy.eyebrow')}
      title={t('vexCaseStudy.title')}
      introduction={t('vexCaseStudy.introduction')}
      context={(['context', 'scope'] as const).map((key) => ({
        title: t(`vexCaseStudy.${key}.title`),
        body: t(`vexCaseStudy.${key}.body`),
      }))}
      flow={{
        label: t('vexCaseStudy.flow.label'),
        steps: (['feed', 'mapping', 'api', 'filtering'] as const).map((key) =>
          t(`vexCaseStudy.flow.${key}`),
        ),
      }}
      explorerLabel={t('vexCaseStudy.explore')}
      stages={vexCaseStages.map((stage) => {
        const Diagram = diagrams[stage]
        return {
          id: stage,
          label: t(`vexCaseStudy.stages.${stage}.label`),
          Icon: stageIcons[stage],
          technology: t(`vexCaseStudy.stages.${stage}.technology`),
          title: t(`vexCaseStudy.stages.${stage}.title`),
          paragraphs: [
            t(`vexCaseStudy.stages.${stage}.body`),
            t(`vexCaseStudy.stages.${stage}.detail`),
          ],
          note:
            stage === 'backend'
              ? { title: t('vexCaseStudy.tradeoff.title'), body: t('vexCaseStudy.tradeoff.body') }
              : undefined,
          visual: <Diagram />,
          caption: t('vexCaseStudy.visual.caption'),
        }
      })}
      architecture={{
        title: t('vexCaseStudy.architecture.title'),
        patterns: offerArchitecturePatterns.map((pattern) => ({
          title: t(`vexCaseStudy.architecture.${pattern}.title`),
          body: t(`vexCaseStudy.architecture.${pattern}.body`),
        })),
      }}
      testing={{
        title: t('vexCaseStudy.testing.title'),
        introduction: t('vexCaseStudy.testing.introduction'),
        areas: (['backend', 'app', 'links'] as const).map((area) => ({
          title: t(`vexCaseStudy.testing.${area}.title`),
          body: t(`vexCaseStudy.testing.${area}.body`),
          tool: t(`vexCaseStudy.testing.${area}.tool`),
        })),
      }}
    />
  )
}
