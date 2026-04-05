import type { GeneratedOutput, OutputFormat } from '../../engine/types'

interface ExportToolbarProps {
  output: GeneratedOutput
  format: OutputFormat
  onCopyAll: () => void
  onExportJSON: () => void
  onExportCSV: () => void
  onExportMarkdown: () => void
}

export default function ExportToolbar({
  output,
  onCopyAll,
  onExportJSON,
  onExportCSV,
  onExportMarkdown,
}: ExportToolbarProps) {
  const total = output.testCases.length
  const positive = output.testCases.filter(tc => tc.kind === 'positive').length
  const negative = output.testCases.filter(tc => tc.kind === 'negative').length
  const bva = output.testCases.filter(tc => tc.kind === 'bva').length

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50 dark:bg-slate-800/60 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700">
      {/* Stats */}
      <div className="text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
        <span className="font-semibold text-slate-800 dark:text-slate-200">{total} casos gerados</span>
        <span className="text-emerald-600 dark:text-emerald-400">✓ {positive} positivos</span>
        <span className="text-red-500 dark:text-red-400">✗ {negative} negativos</span>
        {bva > 0 && <span className="text-amber-500 dark:text-amber-400">↔ {bva} BVA</span>}
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={onCopyAll} className="btn-secondary flex items-center gap-1.5">
          <span>📋</span> Copiar Todos
        </button>
        <button onClick={onExportJSON} className="btn-secondary flex items-center gap-1.5">
          <span>🗂️</span> JSON
        </button>
        <button onClick={onExportCSV} className="btn-secondary flex items-center gap-1.5">
          <span>📊</span> CSV
        </button>
        <button onClick={onExportMarkdown} className="btn-secondary flex items-center gap-1.5">
          <span>📝</span> Markdown
        </button>
      </div>
    </div>
  )
}
