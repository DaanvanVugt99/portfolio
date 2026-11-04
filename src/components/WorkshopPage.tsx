import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import { defaultMotion, fontOptions, motionOptions } from '../data/workshop'
import { landing } from '../data/landing'
import { LandingPage } from './LandingPage'

export function WorkshopPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const font = fontOptions.find((item) => item.id === params.get('font')) ?? fontOptions[0]
  const motionStyle =
    motionOptions.find((item) => item.id === params.get('motion')) ?? defaultMotion
  const idle = params.has('idle') ? params.get('idle') === '1' : landing.idleMotion
  function change(key: string, value: string) {
    setCopied(false)
    setCopyError(false)
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.set(key, value)
        return next
      },
      { replace: true },
    )
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      setCopyError(true)
    }
  }
  const controls = (
    <section className="workshop-controls" aria-label={t('workshop.label')}>
      <div className="workshop-section">
        <h2>{t('workshop.typeface')}</h2>
        <div className="workshop-options" role="group" aria-label={t('workshop.typeface')}>
          {fontOptions.map((item) => (
            <button
              key={item.id}
              aria-pressed={font.id === item.id}
              onClick={() => change('font', item.id)}
            >
              <span>{item.id === 'original' ? t('workshop.fonts.originalName') : item.name}</span>
              <small>{t(`workshop.fonts.${item.id}`)}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="workshop-section">
        <h2>{t('workshop.movement')}</h2>
        <div
          className="workshop-options motion-options"
          role="group"
          aria-label={t('workshop.movement')}
        >
          {motionOptions.map((item) => (
            <button
              key={item.id}
              aria-pressed={motionStyle.id === item.id}
              onClick={() => change('motion', item.id)}
            >
              <span>{t(`workshop.motions.${item.id}.name`)}</span>
              <small>{t(`workshop.motions.${item.id}.description`)}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="workshop-bottom">
        <label>
          <input
            type="checkbox"
            checked={idle}
            onChange={(event) => change('idle', event.target.checked ? '1' : '0')}
          />{' '}
          {t('workshop.idle')}
        </label>
        <button className="copy-comparison" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}{' '}
          {copied ? t('workshop.copied') : t('workshop.copy')}
        </button>
      </div>
      {copyError && (
        <p className="copy-note" role="status">
          {t('workshop.copyError')}
        </p>
      )}
    </section>
  )
  return (
    <LandingPage
      preview={{ fontUrl: font.url, fontFamily: font.family, motionStyle, idle, controls }}
    />
  )
}
