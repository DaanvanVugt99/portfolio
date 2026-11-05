import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DivergenceTitleScreen } from './DivergenceTitleScreen'
import { DivergenceGifPreview } from './DivergenceGifPreview'
import { Button } from './ui/button'

export function DivergenceProjectVisual() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<'title' | 'battle' | 'hub' | 'overworld'>('title')
  const previews = [
    {
      id: 'title',
      kind: 'video',
      label: t('visuals.titleScreen'),
      description: t('visuals.divergenceTitleScreen'),
      thumbnail: '/assets/divergence-title-poster.png',
    },
    {
      id: 'battle',
      kind: 'gif',
      label: t('visuals.battle'),
      description: t('visuals.divergenceBattle'),
      thumbnail: '/assets/divergence-battle-poster.png',
      src: '/assets/divergence-battle.gif',
    },
    {
      id: 'hub',
      kind: 'gif',
      label: t('visuals.hub'),
      description: t('visuals.divergenceHub'),
      thumbnail: '/assets/divergence-hub-poster.png',
      src: '/assets/divergence-hub.gif',
    },
    {
      id: 'overworld',
      kind: 'gif',
      label: t('visuals.overworld'),
      description: t('visuals.divergenceOverworld'),
      thumbnail: '/assets/divergence-overworld-poster.png',
      src: '/assets/divergence-overworld.gif',
    },
  ] as const
  const current = previews.find(({ id }) => id === selected) ?? previews[0]

  return (
    <section className="divergence-gallery" aria-labelledby="divergence-preview-heading">
      <div className="divergence-window">
        <div className="divergence-window-bar" aria-hidden="true">
          <div className="divergence-window-dots">
            <span />
            <span />
            <span />
          </div>
          <span>Divergence</span>
          <span className="divergence-window-handle" />
        </div>
        <div
          className="divergence-window-screen"
          id="divergence-preview-screen"
          role="img"
          aria-label={current.description}
        >
          {current.kind === 'video' ? (
            <DivergenceTitleScreen />
          ) : (
            <DivergenceGifPreview key={current.id} src={current.src} poster={current.thumbnail} />
          )}
        </div>
      </div>
      <div className="divergence-gallery-copy">
        <span className="eyebrow">Game Boy Advance</span>
        <h2 id="divergence-preview-heading">{t('visuals.gamePreviews')}</h2>
        <div
          className="divergence-preview-options"
          role="group"
          aria-labelledby="divergence-preview-heading"
        >
          {previews.map((preview) => (
            <Button
              key={preview.id}
              variant="ghost"
              className="divergence-preview-option"
              aria-pressed={current.id === preview.id}
              aria-controls="divergence-preview-screen"
              onClick={() => setSelected(preview.id)}
            >
              <img src={preview.thumbnail} alt="" width="72" height="48" />
              <span>{preview.label}</span>
              <span className="divergence-preview-indicator" aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
