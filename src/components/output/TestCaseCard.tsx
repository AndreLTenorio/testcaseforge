import { useState } from 'react'
import type { TestCase, OutputFormat, ProceduralStep } from '../../engine/types'
import { PriorityBadge, SeverityBadge, KindBadge } from '../common/Badge'
import ProceduralView from './ProceduralView'
import GherkinView from './GherkinView'
import EditableField from './EditableField'
import QasePreview from './QasePreview'

interface TestCaseCardProps {
  testCase: TestCase
  format: OutputFormat
  index: number
  onCopy: (text: string) => void
  onUpdate: (updated: TestCase) => void
}

const KIND_BORDER: Record<TestCase['kind'], string> = {
  positive: 'border-l-emerald-500',
  negative: 'border-l-red-500',
  bva: 'border-l-amber-500',
  'state-transition': 'border-l-purple-500',
}

const KIND_BG_HEADER: Record<TestCase['kind'], string> = {
  positive: 'bg-emerald-50 dark:bg-emerald-950/30',
  negative: 'bg-red-50 dark:bg-red-950/30',
  bva: 'bg-amber-50 dark:bg-amber-950/30',
  'state-transition': 'bg-purple-50 dark:bg-purple-950/30',
}

function buildCopyText(tc: TestCase, format: OutputFormat): string {
  const lines: string[] = []
  lines.push(tc.title)
  lines.push(`Prioridade: ${tc.priority} | Tipo: ${tc.type} | Comportamento: ${tc.behavior}`)
  lines.push('')
  if (tc.preconditions.length > 0) {
    lines.push('Pré-condições:')
    tc.preconditions.forEach(p => lines.push(`  - ${p}`))
    lines.push('')
  }
  if ((format === 'procedural' || format === 'both') && tc.steps.length > 0) {
    lines.push('# | Step Action | Data | Expected Result')
    tc.steps.forEach(s => lines.push(`${s.number} | ${s.action} | ${s.data} | ${s.expectedResult}`))
    lines.push('')
  }
  if ((format === 'gherkin' || format === 'both') && tc.gherkinSteps.length > 0) {
    tc.gherkinSteps.forEach(s => lines.push(`${s.keyword} ${s.text}`))
  }
  return lines.join('\n')
}

export default function TestCaseCard({ testCase, format, index, onCopy, onUpdate }: TestCaseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [qaseMode, setQaseMode] = useState(false)

  const showGherkin = (format === 'gherkin' || format === 'both') && testCase.gherkinSteps.length > 0
  const showProcedural = (format === 'procedural' || format === 'both') && testCase.steps.length > 0

  const updateTitle = (title: string) => onUpdate({ ...testCase, title })
  const updatePrecondition = (i: number, val: string) => {
    const preconditions = [...testCase.preconditions]
    preconditions[i] = val
    onUpdate({ ...testCase, preconditions })
  }
  const updateStep = (i: number, field: keyof ProceduralStep, val: string) => {
    const steps = testCase.steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
    onUpdate({ ...testCase, steps })
  }
  const updateGherkinStep = (i: number, val: string) => {
    const gherkinSteps = testCase.gherkinSteps.map((s, idx) => idx === i ? { ...s, text: val } : s)
    onUpdate({ ...testCase, gherkinSteps })
  }

  return (
    <div
      className={`rounded-lg border-l-4 ${KIND_BORDER[testCase.kind]} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Card Header */}
      <div className={`px-4 py-3 ${KIND_BG_HEADER[testCase.kind]} transition-colors`}>
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0 group">
            {editMode ? (
              <EditableField
                value={testCase.title}
                onSave={updateTitle}
                placeholder="Título do caso de teste"
                className="font-semibold text-slate-800 dark:text-slate-100"
              />
            ) : (
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug" title={testCase.title}>
                {testCase.title}
              </h3>
            )}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <KindBadge kind={testCase.kind} />
              <PriorityBadge priority={testCase.priority} />
              <SeverityBadge severity={testCase.severity} />
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                {testCase.criterionRef}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onCopy(buildCopyText(testCase, format))}
              className="btn-secondary"
              title="Copiar caso de teste"
            >
              📋 Copiar
            </button>
            <button
              onClick={() => { setQaseMode(q => !q); setExpanded(true); setEditMode(false) }}
              className={`btn-secondary hidden sm:inline-flex ${qaseMode ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-200' : ''}`}
              title="Preview no estilo Qase.io"
            >
              Qase
            </button>
            <button
              onClick={() => { setEditMode(e => !e); setExpanded(true); setQaseMode(false) }}
              className={`btn-secondary ${editMode ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700' : ''}`}
              title={editMode ? 'Sair do modo de edição' : 'Editar caso de teste'}
            >
              {editMode ? '✓ Concluir' : '✏️ Editar'}
            </button>
            <button
              onClick={() => setExpanded(e => !e)}
              className="btn-secondary px-2"
              aria-expanded={expanded}
              title={expanded ? 'Recolher' : 'Expandir'}
            >
              {expanded ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100 dark:border-slate-700 pt-3 animate-in fade-in duration-200">

          {/* Qase preview mode */}
          {qaseMode && (
            <QasePreview testCase={testCase} format={format} />
          )}

          {/* Preconditions edit (only when not in qase mode) */}
          {!qaseMode && editMode && testCase.preconditions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Pré-condições <span className="text-amber-500">(editável)</span>
              </p>
              <div className="space-y-1.5">
                {testCase.preconditions.map((p, i) => (
                  <div key={i} className="group flex items-start gap-1.5">
                    <span className="text-slate-400 mt-1 text-xs">•</span>
                    <EditableField
                      value={p}
                      onSave={(val) => updatePrecondition(i, val)}
                      placeholder="Pré-condição"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Procedural view / edit (only when not in qase mode) */}
          {!qaseMode && showProcedural && (
            <div>
              {format === 'both' && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Procedural (Clássico) {editMode && <span className="text-amber-500">(clique para editar)</span>}
                </p>
              )}
              {editMode ? (
                <ProceduralEditView steps={testCase.steps} preconditions={testCase.preconditions} onUpdateStep={updateStep} onUpdatePrecondition={updatePrecondition} />
              ) : (
                <ProceduralView steps={testCase.steps} preconditions={testCase.preconditions} />
              )}
            </div>
          )}

          {/* Gherkin view / edit (only when not in qase mode) */}
          {!qaseMode && showGherkin && (
            <div>
              {format === 'both' && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Gherkin (BDD) {editMode && <span className="text-amber-500">(clique para editar)</span>}
                </p>
              )}
              {editMode ? (
                <GherkinEditView steps={testCase.gherkinSteps} onUpdateStep={updateGherkinStep} />
              ) : (
                <GherkinView steps={testCase.gherkinSteps} />
              )}
            </div>
          )}

          {!qaseMode && !showProcedural && !showGherkin && (
            <p className="text-sm text-slate-500 italic">Nenhum passo disponível para este formato.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Inline edit sub-components ─────────────────────────────────────────────

interface ProceduralEditViewProps {
  steps: ProceduralStep[]
  preconditions: string[]
  onUpdateStep: (i: number, field: keyof ProceduralStep, val: string) => void
  onUpdatePrecondition: (i: number, val: string) => void
}

function ProceduralEditView({ steps, preconditions, onUpdateStep, onUpdatePrecondition }: ProceduralEditViewProps) {
  return (
    <div className="text-sm space-y-3">
      {preconditions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Pré-condições</p>
          <div className="space-y-1">
            {preconditions.map((p, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-slate-400 mt-1">•</span>
                <EditableField value={p} onSave={val => onUpdatePrecondition(i, val)} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Passos</p>
        <div className="overflow-x-auto rounded-lg border border-amber-200 dark:border-amber-800/50">
          <table className="w-full min-w-[480px] text-xs">
            <thead>
              <tr className="bg-amber-50 dark:bg-amber-900/20 text-slate-600 dark:text-slate-300">
                <th className="px-3 py-2 text-left w-8 font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">Step Action</th>
                <th className="px-3 py-2 text-left w-36 font-semibold">Data</th>
                <th className="px-3 py-2 text-left font-semibold">Expected Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 dark:divide-amber-900/30">
              {steps.map((step, i) => (
                <tr key={step.number} className="bg-white dark:bg-slate-800">
                  <td className="px-3 py-2 text-slate-400 font-mono">{step.number}</td>
                  <td className="px-3 py-2 group"><EditableField value={step.action} onSave={val => onUpdateStep(i, 'action', val)} /></td>
                  <td className="px-3 py-2 group"><EditableField value={step.data} onSave={val => onUpdateStep(i, 'data', val)} /></td>
                  <td className="px-3 py-2 group"><EditableField value={step.expectedResult} onSave={val => onUpdateStep(i, 'expectedResult', val)} multiline /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface GherkinEditViewProps {
  steps: TestCase['gherkinSteps']
  onUpdateStep: (i: number, val: string) => void
}

const KEYWORD_COLORS: Record<string, string> = {
  Given: 'text-purple-400',
  When: 'text-slate-300',
  Then: 'text-emerald-400',
  And: 'text-slate-400',
  But: 'text-amber-400',
}

function GherkinEditView({ steps, onUpdateStep }: GherkinEditViewProps) {
  return (
    <div className="rounded-lg bg-slate-950 dark:bg-slate-900 p-4 font-mono text-sm space-y-1.5">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-2 items-start group">
          <span className={`font-semibold min-w-[44px] text-right shrink-0 ${KEYWORD_COLORS[step.keyword] ?? 'text-slate-400'}`}>
            {step.keyword}
          </span>
          <EditableField
            value={step.text}
            onSave={val => onUpdateStep(i, val)}
            className="text-slate-300 flex-1"
          />
        </div>
      ))}
    </div>
  )
}
