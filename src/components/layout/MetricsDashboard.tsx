import { useState } from 'react'
import type { UsageMetrics } from '../../hooks/useMetrics'
import { useUILanguage } from '../../contexts/UILanguageContext'
import type { Language } from '../../engine/types'

interface MetricsDashboardProps {
  metrics: UsageMetrics
  onReset: () => void
}

function formatDate(iso: string | null, uiLang: Language): string {
  if (!iso) return '—'
  const locale = uiLang === 'pt-br' ? 'pt-BR' : uiLang === 'es' ? 'es' : 'en'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso))
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className={`rounded-xl p-4 border ${color ?? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

const LANG_LABELS: Record<string, string> = { 'pt-br': '🇧🇷 PT-BR', 'en': '🇺🇸 EN', 'es': '🇪🇸 ES' }

export default function MetricsDashboard({ metrics, onReset }: MetricsDashboardProps) {
  const { t, uiLang } = useUILanguage()
  const [open, setOpen] = useState(false)
  const hasData = metrics.totalCasesGenerated > 0

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
          <span>📊</span> {t('metricsTitle')}
          {hasData && (
            <span className="text-xs font-mono bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
              {metrics.totalCasesGenerated} {t('metricsCasesUnit')}
            </span>
          )}
        </span>
        <span className="text-slate-400 text-sm transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>

      {open && (
        <div className="bg-white dark:bg-[#30302E]/80 px-5 py-4 animate-in fade-in duration-200 space-y-5">
          {!hasData ? (
            <p className="text-sm text-center text-slate-400 py-4">
              {t('metricsNoData')}
            </p>
          ) : (
            <>
              {/* Main stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label={t('metricsCases')} value={metrics.totalCasesGenerated} />
                <StatCard label={t('metricsStories')} value={metrics.totalStoriesProcessed} color="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" />
                <StatCard label={t('metricsExports')} value={metrics.totalExports} color="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" />
                <StatCard label={t('metricsCopies')} value={metrics.totalCopies} color="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
              </div>

              {/* Case type breakdown */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{t('metricsDistrib')}</p>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label={t('metricsPositive')} value={metrics.positiveCount} color="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" />
                  <StatCard label={t('metricsNegative')} value={metrics.negativeCount} color="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" />
                  <StatCard label={t('metricsBva')} value={metrics.bvaCount} color="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" />
                </div>
              </div>

              {/* Usage breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* By format */}
                {Object.keys(metrics.sessionsByFormat).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{t('metricsByFormat')}</p>
                    <div className="space-y-1.5">
                      {Object.entries(metrics.sessionsByFormat)
                        .sort(([, a], [, b]) => b - a)
                        .map(([fmt, count]) => {
                          const total = Object.values(metrics.sessionsByFormat).reduce((s, v) => s + v, 0)
                          const pct = Math.round((count / total) * 100)
                          return (
                            <div key={fmt} className="flex items-center gap-2">
                              <span className="text-xs text-slate-600 dark:text-slate-300 w-24 shrink-0">{formatLabel(fmt)}</span>
                              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-[#30302E] dark:bg-slate-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs font-mono text-slate-400 w-10 text-right">{count}x</span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}

                {/* By language */}
                {Object.keys(metrics.sessionsByLanguage).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{t('metricsByLang')}</p>
                    <div className="space-y-1.5">
                      {Object.entries(metrics.sessionsByLanguage)
                        .sort(([, a], [, b]) => b - a)
                        .map(([lang, count]) => {
                          const total = Object.values(metrics.sessionsByLanguage).reduce((s, v) => s + v, 0)
                          const pct = Math.round((count / total) * 100)
                          return (
                            <div key={lang} className="flex items-center gap-2">
                              <span className="text-xs text-slate-600 dark:text-slate-300 w-20 shrink-0">{LANG_LABELS[lang] ?? lang}</span>
                              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs font-mono text-slate-400 w-10 text-right">{count}x</span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamps + reset */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-700 pt-3 text-xs text-slate-400">
                <span>{t('metricsFirst')}: {formatDate(metrics.firstUsed, uiLang)} · {t('metricsLast')}: {formatDate(metrics.lastUsed, uiLang)}</span>
                <button onClick={onReset} className="hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  {t('metricsReset')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
