import { useState, useCallback, useEffect } from 'react'

export interface UsageMetrics {
  totalCasesGenerated: number
  totalStoriesProcessed: number
  totalExports: number
  totalCopies: number
  positiveCount: number
  negativeCount: number
  bvaCount: number
  sessionsByFormat: Record<string, number>
  sessionsByLanguage: Record<string, number>
  firstUsed: string | null
  lastUsed: string | null
}

const STORAGE_KEY = 'tcf-metrics'

const DEFAULT: UsageMetrics = {
  totalCasesGenerated: 0,
  totalStoriesProcessed: 0,
  totalExports: 0,
  totalCopies: 0,
  positiveCount: 0,
  negativeCount: 0,
  bvaCount: 0,
  sessionsByFormat: {},
  sessionsByLanguage: {},
  firstUsed: null,
  lastUsed: null,
}

function load(): UsageMetrics {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT }
  } catch { return { ...DEFAULT } }
}

function save(m: UsageMetrics) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(m)) } catch { /* quota */ }
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<UsageMetrics>(load)

  useEffect(() => { save(metrics) }, [metrics])

  const recordGeneration = useCallback((
    caseCount: number,
    positive: number,
    negative: number,
    bva: number,
    format: string,
    language: string,
  ) => {
    setMetrics(prev => {
      const now = new Date().toISOString()
      return {
        ...prev,
        totalCasesGenerated: prev.totalCasesGenerated + caseCount,
        totalStoriesProcessed: prev.totalStoriesProcessed + 1,
        positiveCount: prev.positiveCount + positive,
        negativeCount: prev.negativeCount + negative,
        bvaCount: prev.bvaCount + bva,
        sessionsByFormat: { ...prev.sessionsByFormat, [format]: (prev.sessionsByFormat[format] ?? 0) + 1 },
        sessionsByLanguage: { ...prev.sessionsByLanguage, [language]: (prev.sessionsByLanguage[language] ?? 0) + 1 },
        firstUsed: prev.firstUsed ?? now,
        lastUsed: now,
      }
    })
  }, [])

  const recordExport = useCallback(() => setMetrics(p => ({ ...p, totalExports: p.totalExports + 1 })), [])
  const recordCopy   = useCallback(() => setMetrics(p => ({ ...p, totalCopies:  p.totalCopies  + 1 })), [])
  const resetMetrics = useCallback(() => setMetrics({ ...DEFAULT }), [])

  return { metrics, recordGeneration, recordExport, recordCopy, resetMetrics }
}
