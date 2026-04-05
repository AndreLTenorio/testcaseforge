import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Language } from '../engine/types'
import { ui, type UIKey } from '../engine/ui18n'

const STORAGE_KEY = 'tcf-ui-lang'

function loadLang(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null
    if (saved && ['pt-br', 'en', 'es'].includes(saved)) return saved
  } catch { /* ignore */ }
  // Auto-detect from browser
  const nav = navigator.language.toLowerCase()
  if (nav.startsWith('es')) return 'es'
  if (nav.startsWith('pt')) return 'pt-br'
  return 'en'
}

interface UILanguageContextType {
  uiLang: Language
  setUiLang: (lang: Language) => void
  t: (key: UIKey) => string
}

const UILanguageContext = createContext<UILanguageContextType>({
  uiLang: 'pt-br',
  setUiLang: () => {},
  t: (key) => key,
})

export function UILanguageProvider({ children }: { children: ReactNode }) {
  const [uiLang, setUiLangState] = useState<Language>(loadLang)

  const setUiLang = useCallback((lang: Language) => {
    setUiLangState(lang)
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* ignore */ }
  }, [])

  const t = useCallback((key: UIKey) => ui(key, uiLang), [uiLang])

  return (
    <UILanguageContext.Provider value={{ uiLang, setUiLang, t }}>
      {children}
    </UILanguageContext.Provider>
  )
}

export function useUILanguage() {
  return useContext(UILanguageContext)
}
