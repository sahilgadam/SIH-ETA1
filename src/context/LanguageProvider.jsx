import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultLanguage, languages, translations } from '../i18n/translations'

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

  /** Look up a copy key, filling {placeholders} from `vars`. */
  const t = useCallback(
    (key, vars) => {
      const dictionary = translations[language] ?? translations[defaultLanguage]
      const value = dictionary[key] ?? translations[defaultLanguage][key] ?? key
      if (!vars) return value
      return value.replace(/\{(\w+)\}/g, (match, name) =>
        Object.hasOwn(vars, name) ? String(vars[name]) : match,
      )
    },
    [language],
  )

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
