import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { profile, projectDefinitions, type Project } from '../data/portfolio'

export function usePortfolio() {
  const { t } = useTranslation()
  return useMemo(
    () => ({
      profile: { ...profile, ...t('profile', { returnObjects: true }) },
      projects: projectDefinitions.map((project): Project => ({
        ...project,
        ...t(`projects.${project.slug}`, { returnObjects: true }),
        technologies:
          project.slug === 'divergence'
            ? ['C', t('projects.divergence.tooling'), 'mGBA', t('projects.divergence.testing')]
            : project.technologies,
        links: project.links.map((link) => ({ ...link, label: t(`links.${link.label}`) })),
      })),
    }),
    [t],
  )
}
