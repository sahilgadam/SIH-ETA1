import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultLanguage, languages, translate, translations } from '../i18n/translations'

const STORAGE_KEY = 'railsense-language'

const LanguageContext = createContext(null)

function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && translations[stored]) return stored
  } catch {
    /* storage unavailable */
  }
  return defaultLanguage
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readStoredLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      /* storage unavailable */
    }
  }, [language])

  /**
   * Look up a copy key in the current interface language, filling
   * {placeholders} from `vars`.
   *
   * The lookup itself lives in `i18n/translations` so that spoken
   * announcements — which resolve against their own chosen language rather
   * than the interface's — go through exactly the same rules.
   */
  const t = useCallback((key, vars) => translate(language, key, vars), [language])

  const value = useMemo(
    () => ({ language, setLanguage, languages, t }),
    [language, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside a LanguageProvider')
  return context
}
