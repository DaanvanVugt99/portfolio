import { Database, Server, Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MotionRegion } from './MotionRegion'
import { vexShowcasePhones } from '../data/vexScreenshots'
import '../vex-project.css'

function Phone({
  source,
  alternate,
  className = '',
}: {
  source: string
  alternate?: string
  className?: string
}) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <img
          src={`/assets/${source}`}
          alt=""
          width="500"
          height="1024"
          decoding="async"
          draggable="false"
        />
        {alternate && (
          <img
            className="phone-alternate"
            src={`/assets/${alternate}`}
            alt=""
            width="500"
            height="1024"
            decoding="async"
            draggable="false"
          />
        )}
      </div>
    </div>
  )
}

export function VexVisual() {
  const { t } = useTranslation()
  return (
    <MotionRegion className="vex-visual" label={t('visuals.vex')}>
      <div className="visual-grid" />
      <div className="phone-composition">
        <Phone source="vex-home.webp" className="phone-back" />
        <Phone source="vex-room-key.webp" alternate="vex-vouchers.webp" className="phone-front" />
      </div>
      <div className="connection-chip">
        <span className="connection-node">
          <Smartphone size={14} />
        </span>
        <span className="connection-line">
          <i />
        </span>
        <span className="connection-node">
          <Server size={14} />
        </span>
        <span className="connection-line">
          <i />
        </span>
        <span className="connection-node">
          <Database size={14} />
        </span>
      </div>
      <div className="screen-note">
        <span className="status-dot" /> iOS & Android
      </div>
    </MotionRegion>
  )
}

export function VexProjectVisual() {
  const { t } = useTranslation()
  return (
    <MotionRegion className="vex-project-visual" label={t('visuals.vexProject')}>
      <div className="visual-grid" />
      <img
        className="vex-project-logo"
        src="/assets/valk-exclusief-logo.svg"
        alt="Valk Exclusief"
        width="579"
        height="292"
      />
      <span className="vex-project-platforms">
        <Smartphone size={13} aria-hidden="true" /> iOS & Android
      </span>
      <div className="vex-project-phones">
        {vexShowcasePhones.map(({ id, ...phone }) => (
          <Phone key={id} {...phone} />
        ))}
      </div>
    </MotionRegion>
  )
}
