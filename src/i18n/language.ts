export type Language = 'en' | 'nl'

export function resolveLanguage(saved: string | null, preferred: readonly string[]): Language {
  if (saved === 'en' || saved === 'nl') return saved
  for (const locale of preferred) {
    const language = locale.toLowerCase().split('-')[0]
    if (language === 'en' || language === 'nl') return language
  }
  return 'en'
}
