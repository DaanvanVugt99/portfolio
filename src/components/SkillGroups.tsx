import { useTranslation } from 'react-i18next'
import { skillGroups, skills } from '../data/skills'

export function SkillGroups({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  const groups = compact ? skillGroups.filter((group) => group.overviewItems) : skillGroups
  return (
    <dl className={`skill-groups${compact ? ' skill-groups-compact' : ''}`}>
      {groups.map((group) => (
        <div className="skill-group" key={group.id}>
          <dt>{t(`skills.${compact ? 'compact' : 'groups'}.${group.id}`)}</dt>
          <dd>
            <ul className="skill-tags">
              {(compact ? group.overviewItems! : group.items).map((id) => (
                <li className="pill" key={id}>
                  {skills[id] ?? t('skills.integrationTests')}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  )
}
