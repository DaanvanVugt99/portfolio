import { useState } from 'react'
import {
  ArrowDown,
  Check,
  ExternalLink,
  GitBranch,
  Layers3,
  LockKeyhole,
  Minus,
  Save,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  ascensionArchitecture,
  ascensionCaseStages,
  ascensionEvidence,
  ascensionExampleLevels,
  resolveAscensionExample,
  type AscensionExampleLevel,
} from '../data/divergenceCaseStudy'
import { TechnicalCaseStudy } from './TechnicalCaseStudy'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import '../divergence-case-study.css'

type Rules = ReturnType<typeof resolveAscensionExample>
const stageIcons = { rules: SlidersHorizontal, generation: GitBranch, persistence: Save }

function RulesDiagram({
  level,
  rules,
  onLevelChange,
}: {
  level: AscensionExampleLevel
  rules: Rules
  onLevelChange: (value: AscensionExampleLevel) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="ascension-rules-diagram">
      <div className="ascension-diagram-heading">
        <SlidersHorizontal size={16} aria-hidden="true" />
        <span>{t('divergenceCaseStudy.visual.level')}</span>
        <strong>A{level}</strong>
      </div>
      <RadioGroup
        className="ascension-level-options"
        value={String(level)}
        onValueChange={(value) => onLevelChange(Number(value) as AscensionExampleLevel)}
        aria-label={t('divergenceCaseStudy.visual.chooseLevel')}
        orientation="horizontal"
      >
        {ascensionExampleLevels.map((value) => (
          <RadioGroupItem key={value} value={String(value)}>
            A{value}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      <div className="ascension-resolver">
        <code>RogueAscension_Resolve</code>
        <ArrowDown size={16} aria-hidden="true" />
      </div>
      <dl className="ascension-rule-values">
        <div>
          <dt>{t('divergenceCaseStudy.visual.natures')}</dt>
          <dd>
            {rules.natures === 'none'
              ? t(
                  level === 0
                    ? 'divergenceCaseStudy.visual.random'
                    : 'divergenceCaseStudy.visual.neutral',
                )
              : t(`divergenceCaseStudy.scopes.${rules.natures}`)}
          </dd>
        </div>
        <div>
          <dt>{t('divergenceCaseStudy.visual.moves')}</dt>
          <dd>{t(`divergenceCaseStudy.scopes.${rules.moves}`)}</dd>
        </div>
        <div>
          <dt>{t('divergenceCaseStudy.visual.items')}</dt>
          <dd>{t(`divergenceCaseStudy.scopes.${rules.items}`)}</dd>
        </div>
        <div>
          <dt>{t('divergenceCaseStudy.visual.party')}</dt>
          <dd>{t(`divergenceCaseStudy.party.${rules.party}`)}</dd>
        </div>
      </dl>
      <p className="ascension-diagram-note" role="status">
        {t('divergenceCaseStudy.visual.effective', { level })}
      </p>
    </div>
  )
}

function GenerationDiagram({ level, rules }: { level: AscensionExampleLevel; rules: Rules }) {
  const { t } = useTranslation()
  return (
    <div className="ascension-generation-diagram">
      <div className="ascension-diagram-heading">
        <GitBranch size={16} aria-hidden="true" />
        <span>{t('divergenceCaseStudy.visual.profile')}</span>
        <strong>A{level}</strong>
      </div>
      <div className="ascension-profile-node">
        <Layers3 size={21} aria-hidden="true" />
        <div>
          <strong>{t('divergenceCaseStudy.visual.selectedProfile')}</strong>
          <span>{t('divergenceCaseStudy.visual.bossAce')}</span>
        </div>
      </div>
      <div className="ascension-connector" aria-hidden="true">
        <ArrowDown size={16} />
      </div>
      <div className="ascension-gates">
        {(['natures', 'moves', 'items'] as const).map((field) => {
          const enabled = rules[field] !== 'none'
          return (
            <div className="ascension-gate" data-enabled={enabled} key={field}>
              {enabled ? (
                <Check size={15} aria-hidden="true" />
              ) : (
                <Minus size={15} aria-hidden="true" />
              )}
              <span>{t(`divergenceCaseStudy.visual.${field}`)}</span>
              <strong>
                {t(
                  enabled
                    ? 'divergenceCaseStudy.visual.apply'
                    : 'divergenceCaseStudy.visual.keepBasic',
                )}
              </strong>
            </div>
          )
        })}
      </div>
      <p className="ascension-diagram-note">{t('divergenceCaseStudy.visual.independent')}</p>
    </div>
  )
}

function SnapshotDiagram({ level }: { level: AscensionExampleLevel }) {
  const { t } = useTranslation()
  const [version, setVersion] = useState('current')
  const compatible = version === 'current'
  return (
    <div className="ascension-snapshot-diagram">
      <div className="ascension-diagram-heading">
        <Save size={16} aria-hidden="true" />
        <span>{t('divergenceCaseStudy.visual.snapshot')}</span>
      </div>
      <dl className="ascension-rule-values ascension-snapshot-values">
        <div>
          <dt>{t('divergenceCaseStudy.visual.hub')}</dt>
          <dd>A0</dd>
        </div>
        <div>
          <dt>{t('divergenceCaseStudy.visual.active')}</dt>
          <dd>
            <LockKeyhole size={12} aria-hidden="true" />A{level}
          </dd>
        </div>
        <div>
          <dt>{t('divergenceCaseStudy.visual.replay')}</dt>
          <dd>{t('divergenceCaseStudy.visual.replayFields', { level })}</dd>
        </div>
      </dl>
      <p className="ascension-diagram-note">{t('divergenceCaseStudy.visual.separate')}</p>
      <RadioGroup
        className="ascension-version-options"
        value={version}
        onValueChange={setVersion}
        aria-label={t('divergenceCaseStudy.visual.versionCheck')}
        orientation="horizontal"
      >
        <RadioGroupItem value="current">{t('divergenceCaseStudy.visual.current')}</RadioGroupItem>
        <RadioGroupItem value="older">{t('divergenceCaseStudy.visual.older')}</RadioGroupItem>
      </RadioGroup>
      <div className="ascension-version-result" data-compatible={compatible} role="status">
        {compatible ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
        {t(compatible ? 'divergenceCaseStudy.visual.restore' : 'divergenceCaseStudy.visual.reject')}
      </div>
    </div>
  )
}

export function DivergenceCaseStudy() {
  const { t, i18n } = useTranslation()
  const [level, setLevel] = useState<AscensionExampleLevel>(4)
  const rules = resolveAscensionExample(level)
  const visuals = {
    rules: <RulesDiagram level={level} rules={rules} onLevelChange={setLevel} />,
    generation: <GenerationDiagram level={level} rules={rules} />,
    persistence: <SnapshotDiagram level={level} />,
  }
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage === 'nl' ? 'nl' : 'en', {
    dateStyle: 'long',
  }).format(new Date(`${ascensionEvidence.date}T12:00:00Z`))
  return (
    <TechnicalCaseStudy
      id="ascension"
      eyebrow={t('divergenceCaseStudy.eyebrow')}
      title={t('divergenceCaseStudy.title')}
      introduction={t('divergenceCaseStudy.introduction')}
      context={(['context', 'scope'] as const).map((key) => ({
        title: t(`divergenceCaseStudy.${key}.title`),
        body: t(`divergenceCaseStudy.${key}.body`),
      }))}
      flow={{
        label: t('divergenceCaseStudy.flow.label'),
        steps: (['setup', 'resolver', 'generation', 'snapshot'] as const).map((key) =>
          t(`divergenceCaseStudy.flow.${key}`),
        ),
      }}
      explorerLabel={t('divergenceCaseStudy.explore')}
      stages={ascensionCaseStages.map((stage) => ({
        id: stage,
        label: t(`divergenceCaseStudy.stages.${stage}.label`),
        Icon: stageIcons[stage],
        technology: t(`divergenceCaseStudy.stages.${stage}.technology`),
        title: t(`divergenceCaseStudy.stages.${stage}.title`),
        paragraphs: [
          t(`divergenceCaseStudy.stages.${stage}.body`),
          t(`divergenceCaseStudy.stages.${stage}.detail`),
        ],
        note:
          stage === 'persistence'
            ? {
                title: t('divergenceCaseStudy.tradeoff.title'),
                body: t('divergenceCaseStudy.tradeoff.body'),
              }
            : undefined,
        visual: visuals[stage],
        caption: t('divergenceCaseStudy.visual.caption'),
      }))}
      architecture={{
        title: t('divergenceCaseStudy.architecture.title'),
        patterns: ascensionArchitecture.map((pattern) => ({
          title: t(`divergenceCaseStudy.architecture.${pattern}.title`),
          body: t(`divergenceCaseStudy.architecture.${pattern}.body`),
        })),
      }}
      testing={{
        title: t('divergenceCaseStudy.testing.title'),
        introduction: t('divergenceCaseStudy.testing.introduction'),
        areas: (['thresholds', 'generation', 'persistence'] as const).map((area) => ({
          title: t(`divergenceCaseStudy.testing.${area}.title`),
          body: t(`divergenceCaseStudy.testing.${area}.body`),
          tool: t(`divergenceCaseStudy.testing.${area}.tool`),
        })),
      }}
    >
      <section className="ascension-results" aria-labelledby="ascension-results-title">
        <h3 id="ascension-results-title">{t('divergenceCaseStudy.results.title')}</h3>
        <div className="ascension-result-columns">
          <div>
            <h4>{t('divergenceCaseStudy.results.implementationTitle')}</h4>
            <p>{t('divergenceCaseStudy.results.implementation')}</p>
          </div>
          <div>
            <h4>{t('divergenceCaseStudy.results.recorded', { date })}</h4>
            <p>
              {t('divergenceCaseStudy.results.validation', {
                count: ascensionEvidence.focusedTests,
              })}
            </p>
          </div>
        </div>
        <p className="ascension-result-limit">{t('divergenceCaseStudy.results.limit')}</p>
        <div className="ascension-source-links">
          {ascensionEvidence.links.map(({ key, href }) => (
            <a href={href} key={key} target="_blank" rel="noreferrer">
              {t(`divergenceCaseStudy.sources.${key}`)}
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </TechnicalCaseStudy>
  )
}
