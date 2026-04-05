import { useState, useCallback } from 'react'
import type { InputMetadata, GeneratedOutput, TestCase } from './engine/types'
import { parseUserStory } from './engine/parser'
import { generateTestCases } from './engine/generator'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HowToUse from './components/layout/HowToUse'
import HistoryPanel from './components/layout/HistoryPanel'
import MetricsDashboard from './components/layout/MetricsDashboard'
import StoryInput from './components/input/StoryInput'
import MetadataForm from './components/input/MetadataForm'
import FormatSelector from './components/input/FormatSelector'
import BatchImport, { type BatchStory } from './components/input/BatchImport'
import TestCaseList from './components/output/TestCaseList'
import QaseExportModal from './components/output/QaseExportModal'
import Toast from './components/common/Toast'
import { useToast } from './hooks/useToast'
import { useHistory } from './hooks/useHistory'
import { useMetrics } from './hooks/useMetrics'
import { useUILanguage } from './contexts/UILanguageContext'
import { copyToClipboard } from './export/clipboard'
import { exportJSON, exportCSV, exportMarkdown, buildAllText } from './export/exporters'

const DEFAULT_METADATA: InputMetadata = {
  projectName: '',
  suiteName: '',
  priority: 'normal',
  severity: 'major',
  type: 'functional',
  format: 'procedural',
}

export default function App() {
  const [storyText, setStoryText] = useState('')
  const [metadata, setMetadata] = useState<InputMetadata>(DEFAULT_METADATA)
  const [output, setOutput] = useState<GeneratedOutput | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [batchOutputs, setBatchOutputs] = useState<GeneratedOutput[]>([])
  const [batchIndex, setBatchIndex] = useState(0)
  const [qaseModalOpen, setQaseModalOpen] = useState(false)

  const { toast, showToast, clearToast } = useToast()
  const { history, addEntry, removeEntry, clearHistory } = useHistory()
  const { metrics, recordGeneration, recordExport, recordCopy, resetMetrics } = useMetrics()
  const { t } = useUILanguage()

  const isBatchMode = batchOutputs.length > 1

  // ── Generation ──────────────────────────────────────────────
  const runGenerate = useCallback((text: string, meta: InputMetadata): GeneratedOutput | null => {
    try {
      const parsed = parseUserStory(text)
      return generateTestCases(parsed, meta)
    } catch (err) {
      console.error(err)
      return null
    }
  }, [])

  const handleGenerate = useCallback(() => {
    if (!storyText.trim()) {
      showToast(t('toastEmptyStory'), 'error')
      return
    }
    setIsGenerating(true)
    setTimeout(() => {
      const result = runGenerate(storyText, metadata)
      if (!result) {
        showToast(t('toastError'), 'error')
      } else if (result.testCases.length === 0) {
        showToast(t('toastNoCases'), 'info')
      } else {
        setOutput(result)
        setBatchOutputs([result])
        setBatchIndex(0)
        addEntry(storyText, metadata, result)
        recordGeneration(
          result.testCases.length,
          result.testCases.filter(tc => tc.kind === 'positive').length,
          result.testCases.filter(tc => tc.kind === 'negative').length,
          result.testCases.filter(tc => tc.kind === 'bva').length,
          metadata.format,
          result.language,
        )
        showToast(`${result.testCases.length} ${t('toastGenerated')}`, 'success')
      }
      setIsGenerating(false)
    }, 50)
  }, [storyText, metadata, runGenerate, addEntry, recordGeneration, showToast, t])

  // ── Batch import ─────────────────────────────────────────────
  const handleBatchImport = useCallback((stories: BatchStory[]) => {
    setIsGenerating(true)
    setTimeout(() => {
      const outputs: GeneratedOutput[] = []
      for (const story of stories) {
        const result = runGenerate(story.text, metadata)
        if (result && result.testCases.length > 0) outputs.push(result)
      }
      if (outputs.length === 0) {
        showToast(t('toastBatchNone'), 'error')
      } else {
        setBatchOutputs(outputs)
        setBatchIndex(0)
        setOutput(outputs[0])
        const total = outputs.reduce((s, o) => s + o.testCases.length, 0)
        for (const o of outputs) {
          recordGeneration(
            o.testCases.length,
            o.testCases.filter(tc => tc.kind === 'positive').length,
            o.testCases.filter(tc => tc.kind === 'negative').length,
            o.testCases.filter(tc => tc.kind === 'bva').length,
            metadata.format,
            o.language,
          )
        }
        showToast(`${total} ${t('toastBatchDone')} ${outputs.length} histórias!`, 'success')
      }
      setIsGenerating(false)
    }, 50)
  }, [metadata, runGenerate, recordGeneration, showToast, t])

  // Batch navigation
  const handleBatchNav = (dir: -1 | 1) => {
    const next = batchIndex + dir
    if (next < 0 || next >= batchOutputs.length) return
    setBatchIndex(next)
    setOutput(batchOutputs[next])
  }

  // ── History restore ──────────────────────────────────────────
  const handleRestoreHistory = useCallback((entry: typeof history[0]) => {
    setStoryText(entry.storyPreview)
    setMetadata(entry.metadata)
    setOutput(entry.output)
    setBatchOutputs([entry.output])
    setBatchIndex(0)
    showToast(t('toastRestoredHistory'), 'info')
  }, [showToast, t])

  // ── Test case update ─────────────────────────────────────────
  const handleUpdateTestCase = useCallback((updated: TestCase) => {
    setOutput(prev => {
      if (!prev) return prev
      const next = { ...prev, testCases: prev.testCases.map(tc => tc.id === updated.id ? updated : tc) }
      setBatchOutputs(bs => bs.map((b, i) => i === batchIndex ? next : b))
      return next
    })
  }, [batchIndex])

  // ── Export ────────────────────────────────────────────────────
  const handleCopy = useCallback(async (text: string) => {
    const ok = await copyToClipboard(text)
    if (ok) recordCopy()
    showToast(ok ? t('toastCopied') : t('toastCopyFail'), ok ? 'success' : 'error')
  }, [showToast, recordCopy, t])

  const handleCopyAll = useCallback(async () => {
    if (!output) return
    const ok = await copyToClipboard(buildAllText(output, metadata.format))
    showToast(ok ? t('toastCopyAll') : t('toastCopyFail'), ok ? 'success' : 'error')
  }, [output, metadata.format, showToast, t])

  const handleExportJSON = useCallback(() => {
    if (!output) return; exportJSON(output); recordExport(); showToast(t('toastJSON'), 'success')
  }, [output, showToast, recordExport, t])

  const handleExportCSV = useCallback(() => {
    if (!output) return; exportCSV(output); recordExport(); showToast(t('toastCSV'), 'success')
  }, [output, showToast, recordExport, t])

  const handleExportMarkdown = useCallback(() => {
    if (!output) return; exportMarkdown(output, metadata.format); recordExport(); showToast(t('toastMarkdown'), 'success')
  }, [output, metadata.format, showToast, recordExport, t])

  const handleClearAll = () => {
    setStoryText(''); setOutput(null); setBatchOutputs([]); setBatchIndex(0); setMetadata(DEFAULT_METADATA)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#141413]">
      <Header />

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* LEFT — Input */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-[#30302E] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span>📋</span> {t('inputTitle')}
                </h2>
                {storyText && (
                  <button onClick={handleClearAll} className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    {t('clearAll')}
                  </button>
                )}
              </div>

              <StoryInput value={storyText} onChange={setStoryText} />

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  {t('metadataTitle')} <span className="font-normal text-slate-400">{t('metadataOptional')}</span>
                </p>
                <MetadataForm metadata={metadata} onChange={setMetadata} />
              </div>

              <FormatSelector value={metadata.format} onChange={(f) => setMetadata(m => ({ ...m, format: f }))} />

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !storyText.trim()}
                className={`w-full bg-[#30302E] hover:bg-[#252523] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-md hover:shadow-lg ${!storyText.trim() ? '' : 'forge-idle'}`}
              >
                {isGenerating ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> {t('generating')}</>
                ) : (
                  <><span>⚒️</span> {t('generateBtn')}</>
                )}
              </button>
            </div>

            <div className="bg-slate-100 dark:bg-[#30302E] border border-slate-200 dark:border-slate-600 rounded-xl p-4 text-xs text-slate-700 dark:text-slate-300">
              <p className="font-semibold mb-1.5">{t('istqbBadge')}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-slate-600 dark:text-slate-400">
                <span>• Partição de Equivalência (EP)</span>
                <span>• Análise de Valor Limite (BVA)</span>
                <span>• Testes Positivos e Negativos</span>
                <span>• Sem IA · Sem backend · Offline</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Output */}
          <div className="bg-white dark:bg-[#30302E] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 overflow-y-auto max-h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>📝</span> {t('outputTitle')}
              </h2>
              <div className="flex items-center gap-2">
                {isBatchMode && (
                  <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg px-2 py-1">
                    <button onClick={() => handleBatchNav(-1)} disabled={batchIndex === 0} className="disabled:opacity-30 hover:text-slate-900 dark:hover:text-slate-200 transition-colors px-1">◀</button>
                    <span className="font-mono text-slate-500 dark:text-slate-400 px-1">
                      {batchIndex + 1}/{batchOutputs.length}
                    </span>
                    <button onClick={() => handleBatchNav(1)} disabled={batchIndex === batchOutputs.length - 1} className="disabled:opacity-30 hover:text-slate-900 dark:hover:text-slate-200 transition-colors px-1">▶</button>
                  </div>
                )}
                {output && (
                  <>
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
                      {output.testCases.length} TCs
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ {output.testCases.filter(tc => tc.kind === 'positive').length}</span>
                    <span className="text-xs text-red-500 dark:text-red-400">✗ {output.testCases.filter(tc => tc.kind === 'negative').length}</span>
                    <button
                      onClick={() => setQaseModalOpen(true)}
                      className="text-xs bg-slate-100 dark:bg-[#30302E] text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-[#252523] px-2 py-0.5 rounded-lg font-medium transition-colors"
                      title="Exportar para Qase"
                    >
                      {t('qaseBtn')}
                    </button>
                  </>
                )}
              </div>
            </div>

            {output ? (
              <TestCaseList
                output={output}
                format={metadata.format}
                onCopy={handleCopy}
                onCopyAll={handleCopyAll}
                onExportJSON={handleExportJSON}
                onExportCSV={handleExportCSV}
                onExportMarkdown={handleExportMarkdown}
                onUpdateTestCase={handleUpdateTestCase}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* ── Collapsible sections ─────────────────────────────── */}
        <div className="space-y-3">
          <BatchImport onImport={handleBatchImport} />
          <HistoryPanel history={history} onRestore={handleRestoreHistory} onRemove={removeEntry} onClear={clearHistory} />
          <MetricsDashboard metrics={metrics} onReset={resetMetrics} />
          <HowToUse />
        </div>
      </main>

      <Footer />

      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={clearToast} />}

      {qaseModalOpen && output && (
        <QaseExportModal
          output={output}
          format={metadata.format}
          onClose={() => setQaseModalOpen(false)}
          onSuccess={(count) => {
            recordExport()
            setQaseModalOpen(false)
            showToast(`${count} ${t('toastQase')}`, 'success')
          }}
        />
      )}
    </div>
  )
}

function EmptyState() {
  const { t } = useUILanguage()
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 dark:text-slate-500 gap-4 select-none">
      <span className="text-6xl animate-in fade-in duration-300">⚒️</span>
      <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
        <p className="font-semibold text-slate-600 dark:text-slate-400 text-lg">{t('emptyTitle')}</p>
        <p className="text-sm mt-1 leading-relaxed">
          {t('emptyDesc').split('\n')[0]}<br />
          {t('emptyDesc').split('\n')[1]} <strong className="text-[#30302E] dark:text-slate-200">{t('emptyGenerate')}</strong>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2 text-xs text-center max-w-xs">
        {[
          { icon: '📋', key: 'featureJira' as const },
          { icon: '🔀', key: 'featureFormats' as const },
          { icon: '✓✗', key: 'featureCases' as const },
          { icon: '🕓', key: 'featureHistory' as const },
          { icon: '📦', key: 'featureBatch' as const },
          { icon: '📊', key: 'featureExport' as const },
        ].map(item => (
          <div key={item.key} className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-2.5">
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="text-slate-500 dark:text-slate-400 leading-snug">{t(item.key)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
