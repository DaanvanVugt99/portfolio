import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import nl from './locales/nl.json'
import { resolveLanguage, type Language } from './language'

export type { Language } from './language'

// Keep both languages in step, including nested keys and translated lists.
const dutch: typeof en = nl

function savedLanguage(): Language {
  let saved: string | null = null
  try {
    saved = localStorage.getItem('portfolio-language')
  } catch {
    // Device preferences still work when storage is unavailable.
  }
  return resolveLanguage(
    saved,
    navigator.languages.length ? navigator.languages : [navigator.language],
  )
}

function syncLanguage(language: string) {
  document.documentElement.lang = language === 'nl' ? 'nl' : 'en'
}

export function selectLanguage(language: Language) {
  try {
    localStorage.setItem('portfolio-language', language)
  } catch {
    // Language selection still works when storage is unavailable.
  }
  void i18n.changeLanguage(language)
}

i18n.on('languageChanged', syncLanguage)

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, nl: { translation: dutch } },
  lng: savedLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'nl'],
  initAsync: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof en }
  }
}

export default i18n
