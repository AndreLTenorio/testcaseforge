import type { GeneratedOutput, OutputFormat, TestCase } from '../../engine/types'
import TestCaseCard from './TestCaseCard'
import ExportToolbar from './ExportToolbar'
import { useUILanguage } from '../../contexts/UILanguageContext'

interface TestCaseListProps {
  output: GeneratedOutput
  format: OutputFormat
  onCopy: (text: string) => void
  onCopyAll: () => void
  onExportJSON: () => void
  onExportCSV: () => void
  onExportMarkdown: () => void
  onUpdateTestCase: (updated: TestCase) => void
}

export default function TestCaseList({
  output,
  format,
  onCopy,
  onCopyAll,
  onExportJSON,
  onExportCSV,
  onExportMarkdown,
  onUpdateTestCase,
}: TestCaseListProps) {
  const { t } = useUILanguage()

  if (output.testCases.length === 0) {
    const [line1, line2] = t('listEmpty').split('\n')
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-400 dark:text-slate-500 gap-3">
        <span className="text-5xl">📋</span>
        <p className="text-sm text-center">
          {line1}<br />
          {line2}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Gherkin Feature header */}
      {(format === 'gherkin' || format === 'both') && output.persona && (
        <div className="rounded-lg bg-slate-950 p-3 font-mono text-xs text-slate-300 dark:bg-slate-900 leading-relaxed">
          <span className="text-amber-400 font-semibold">Feature:</span> {output.feature}<br />
          {output.persona && <><span className="text-slate-500">  Como</span> {output.persona}<br /></>}
          {output.action && <><span className="text-slate-500">  Eu quero</span> {output.action}<br /></>}
          {output.benefit && <><span className="text-slate-500">  Para que</span> {output.benefit}</>}
        </div>
      )}

      <ExportToolbar
        output={output}
        format={format}
        onCopyAll={onCopyAll}
        onExportJSON={onExportJSON}
        onExportCSV={onExportCSV}
        onExportMarkdown={onExportMarkdown}
      />

      <div className="space-y-3">
        {output.testCases.map((tc, i) => (
          <TestCaseCard
            key={tc.id}
            testCase={tc}
            format={format}
            index={i}
            onCopy={onCopy}
            onUpdate={onUpdateTestCase}
          />
        ))}
      </div>
    </div>
  )
}
