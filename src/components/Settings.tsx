import { useId } from 'react'
import { Check, ChevronDown, Monitor, Moon, SlidersHorizontal, Sun, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePreferences, type ThemeChoice } from '../state/Preferences'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './ui/popover'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from './ui/radio-group'

export function Settings() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = usePreferences()
  const id = useId()
  const language = i18n.resolvedLanguage === 'nl' ? 'nl' : 'en'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="settings-trigger" aria-label={t('settings.title')}>
          <SlidersHorizontal size={16} strokeWidth={1.6} aria-hidden="true" />
          <span aria-hidden="true">{language.toUpperCase()}</span>
          <ChevronDown className="settings-chevron" size={12} aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="settings-panel"
        align="end"
        collisionPadding={16}
        aria-labelledby={`${id}-title`}
      >
        <div className="settings-heading">
          <h2 id={`${id}-title`}>{t('settings.title')}</h2>
          <PopoverClose className="settings-close" aria-label={t('settings.close')}>
            <X size={15} aria-hidden="true" />
          </PopoverClose>
        </div>
        <section className="settings-section" aria-labelledby={`${id}-appearance`}>
          <h3 id={`${id}-appearance`}>{t('settings.appearance')}</h3>
          <RadioGroup
            className="settings-themes"
            aria-labelledby={`${id}-appearance`}
            value={theme}
            onValueChange={(value) => setTheme(value as ThemeChoice)}
            orientation="horizontal"
          >
            {(
              [
                { value: 'light', Icon: Sun },
                { value: 'system', Icon: Monitor },
                { value: 'dark', Icon: Moon },
              ] as const
            ).map(({ value, Icon }) => (
              <RadioGroupItem className="settings-theme" value={value} key={value}>
                <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
                <span>{t(`settings.${value}`)}</span>
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </section>
        <section
          className="settings-section settings-language-section"
          aria-labelledby={`${id}-language`}
        >
          <h3 id={`${id}-language`}>{t('settings.language')}</h3>
          <RadioGroup
            className="settings-languages"
            aria-labelledby={`${id}-language`}
            value={language}
            onValueChange={(value) => {
              void i18n.changeLanguage(value)
            }}
          >
            {(
              [
                { value: 'en', name: 'English' },
                { value: 'nl', name: 'Nederlands' },
              ] as const
            ).map(({ value, name }) => (
              <RadioGroupItem className="settings-language" value={value} key={value} lang={value}>
                <span className="language-code" aria-hidden="true">
                  {value.toUpperCase()}
                </span>
                <span>{name}</span>
                <RadioGroupIndicator className="language-check">
                  <Check size={15} strokeWidth={1.8} aria-hidden="true" />
                </RadioGroupIndicator>
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </section>
      </PopoverContent>
    </Popover>
  )
}
