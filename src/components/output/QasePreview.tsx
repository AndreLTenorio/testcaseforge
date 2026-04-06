import { useState } from 'react'
import type { TestCase, OutputFormat } from '../../engine/types'

interface QasePreviewProps {
  testCase: TestCase
  format: OutputFormat
}

const PRIORITY_COLOR: Record<string, string> = {
  low:      'bg-slate-100 text-slate-500',
  normal:   'bg-slate-200 text-slate-600',
  high:     'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-700',
}

const SEVERITY_COLOR: Record<string, string> = {
  trivial:  'bg-slate-100 text-slate-500',
  minor:    'bg-green-100 text-green-600',
  major:    'bg-yellow-100 text-yellow-700',
  critical: 'bg-orange-100 text-orange-700',
  blocker:  'bg-red-100 text-red-700',
}

export default function QasePreview({ testCase, format }: QasePreviewProps) {
  const [tab, setTab] = useState<'classic' | 'gherkin'>(format === 'gherkin' ? 'gherkin' : 'classic')
  const showClassic = testCase.steps.length > 0
  const showGherkin = testCase.gherkinSteps.length > 0

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-sm font-sans shadow-sm">
      {/* Qase-like header bar */}
      <div className="bg-[#1a1f2e] px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-slate-500 font-mono ml-2">qase.io — Simulação de Preview</span>
      </div>

      {/* Qase content */}
      <div className="bg-white dark:bg-slate-900 p-4 space-y-4">
        {/* Title + description + meta */}
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">{testCase.title}</h3>
          {testCase.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{testCase.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <QasePill label="Status" value="Ativo" color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" />
            <QasePill label="Tipo" value={testCase.type} color="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" />
            <QasePill label="Prioridade" value={testCase.priority} color={`${PRIORITY_COLOR[testCase.priority]} dark:bg-opacity-20`} />
            <QasePill label="Gravidade" value={testCase.severity} color={`${SEVERITY_COLOR[testCase.severity]} dark:bg-opacity-20`} />
            <QasePill label="Automação" value="Manual" color="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" />
          </div>
        </div>

        {/* Preconditions */}
        {testCase.preconditions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Pré-condições</p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 text-sm">
              {testCase.preconditions.map((p, i) => <div key={i}>• {p}</div>)}
            </div>
          </div>
        )}

        {/* Steps tab */}
        {(showClassic || showGherkin) && (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Etapas</p>

            {/* Tab switcher (only if both exist) */}
            {showClassic && showGherkin && (
              <div className="flex border-b border-slate-200 dark:border-slate-700 mb-3">
                {(['classic', 'gherkin'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-1.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                      tab === t
                        ? 'border-[#30302E] text-[#30302E] dark:border-slate-400 dark:text-slate-400'
                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {t === 'classic' ? 'Clássico' : 'Pepino (Gherkin)'}
                  </button>
                ))}
              </div>
            )}

            {/* Classic steps */}
            {(tab === 'classic' || !showGherkin) && showClassic && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-left">
                      <th className="px-3 py-2 w-8 font-semibold">#</th>
                      <th className="px-3 py-2 font-semibold">Ação</th>
                      <th className="px-3 py-2 font-semibold w-28">Dados</th>
                      <th className="px-3 py-2 font-semibold">Resultado Esperado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {testCase.steps.map(s => (
                      <tr key={s.number} className="bg-white dark:bg-slate-900">
                        <td className="px-3 py-2 text-slate-400 font-mono">{s.number}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{s.action}</td>
                        <td className="px-3 py-2 text-slate-500 font-mono">{s.data}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{s.expectedResult}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Gherkin steps */}
            {(tab === 'gherkin' || !showClassic) && showGherkin && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 font-mono text-xs space-y-1">
                {testCase.gherkinSteps.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <span className={`font-bold min-w-[44px] text-right ${
                      s.keyword === 'Given' ? 'text-purple-600 dark:text-purple-400' :
                      s.keyword === 'When'  ? 'text-slate-600 dark:text-slate-400' :
                      s.keyword === 'Then'  ? 'text-emerald-600 dark:text-emerald-400' :
                      'text-slate-400'
                    }`}>{s.keyword}</span>
                    <span className="text-slate-700 dark:text-slate-300">{s.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function QasePill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${color}`}>
      <span className="text-slate-400 dark:text-slate-500 font-normal">{label}:</span>
      {value}
    </span>
  )
}
