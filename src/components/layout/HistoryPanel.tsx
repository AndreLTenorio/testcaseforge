import { useState } from 'react'
import type { HistoryEntry } from '../../hooks/useHistory'
import { useUILanguage } from '../../contexts/UILanguageContext'
import type { Language } from '../../engine/types'

interface HistoryPanelProps {
  history: HistoryEntry[]
  onRestore: (entry: HistoryEntry) => void
  onRemove: (id: string) => void
  onClear: () => void
}

function formatRelative(iso: string, uiLang: Language): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const locale = uiLang === 'pt-br' ? 'pt-BR' : uiLang === 'es' ? 'es' : 'en'
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (mins < 1) return rtf.format(0, 'minute')
  if (mins < 60) return rtf.format(-mins, 'minute')
  if (hours < 24) return rtf.format(-hours, 'hour')
  return rtf.format(-days, 'day')
}

export default function HistoryPanel({ history, onRestore, onRemove, onClear }: HistoryPanelProps) {
  const { t, uiLang } = useUILanguage()
  const [open, setOpen] = useState(false)

  const formatLabel = (fmt: string) =>
    fmt === 'procedural' ? t('formatProcedural')
    : fmt === 'gherkin' ? t('formatGherkin')
    : t('formatBoth')

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#30302E] dark:hover:bg-[#252523] transition-colors text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <span>🕓</span>
          {t('historyTitle')}
          {history.length > 0 && (
            <span className="text-xs bg-[#30302E] text-white px-1.5 py-0.5 rounded-full font-mono leading-none">
              {history.length}
            </span>
          )}
        </span>
        <span
          className="text-slate-400 text-sm transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >▼</span>
      </button>

      {open && (
        <div className="bg-white dark:bg-[#30302E]/80 animate-in fade-in duration-200">
          {history.length === 0 ? (
            <div className="px-5 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              {t('historyEmpty')}
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-72 overflow-y-auto">
                {history.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 truncate" title={entry.storyPreview}>
                        {entry.storyPreview || '(sem texto)'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                        <span>{formatRelative(entry.createdAt, uiLang)}</span>
                        <span>·</span>
                        <span className="font-mono">{entry.output.testCases.length} TCs</span>
                        <span>·</span>
                        <span>{formatLabel(entry.metadata.format)}</span>
                        {entry.metadata.projectName && (
                          <>
                            <span>·</span>
                            <span className="text-slate-700 dark:text-slate-300">{entry.metadata.projectName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onRestore(entry)}
                        className="text-xs bg-[#30302E] hover:bg-[#252523] text-white px-2.5 py-1 rounded font-medium transition-colors"
                        title={t('historyRestore')}
                      >
                        {t('historyRestore')}
                      </button>
                      <button
                        onClick={() => onRemove(entry.id)}
                        className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-1.5 py-1 rounded transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  onClick={onClear}
                  className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  {t('historyClear')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
