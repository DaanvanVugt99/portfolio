import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import nl from './locales/nl.json'

export type Language = 'en' | 'nl'

// Keep both languages in step, including nested keys and translated lists.
const dutch: typeof en = nl

function savedLanguage(): Language {
  try {
    return localStorage.getItem('portfolio-language') === 'nl' ? 'nl' : 'en'
  } catch {
    return 'en'
  }
}

function syncLanguage(language: string) {
  document.documentElement.lang = language === 'nl' ? 'nl' : 'en'
  try {
    localStorage.setItem('portfolio-language', document.documentElement.lang)
  } catch {
    // Language selection still works when storage is unavailable.
  }
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
