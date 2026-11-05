import { useTranslation } from 'react-i18next'
import type { ProjectThumbnail as Thumbnail } from '../data/portfolio'

export function ProjectThumbnail({
  thumbnail,
  priority = false,
}: {
  thumbnail: Thumbnail
  priority?: boolean
}) {
  const { t } = useTranslation()
  return (
    <div
      className={`project-cover project-cover-${thumbnail.kind}`}
      role="img"
      aria-label={t(thumbnail.altKey)}
    >
      <div className="cover-composition">
        {thumbnail.sources.map((source) =>
          thumbnail.kind === 'phones' ? (
            <div className="phone" key={source}>
              <div className="phone-screen">
                <img
                  src={source}
                  alt=""
                  width={500}
                  height={1024}
                  decoding="async"
                  loading={priority ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </div>
            </div>
          ) : (
            <img
              key={source}
              src={source}
              alt=""
              decoding="async"
              loading={priority ? 'eager' : 'lazy'}
              draggable={false}
            />
          ),
        )}
      </div>
    </div>
  )
}
