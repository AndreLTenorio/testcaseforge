import { useState, useEffect } from 'react'
import type { GeneratedOutput, OutputFormat } from '../../engine/types'
import type { QaseConfig } from '../../export/qaseApi'
import { sendAllToQase } from '../../export/qaseApi'

interface QaseExportModalProps {
  output: GeneratedOutput
  format: OutputFormat
  onClose: () => void
  onSuccess: (count: number) => void
}

const STORAGE_KEY = 'tcf-qase-config'

function loadConfig(): Partial<QaseConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveConfig(config: QaseConfig) {
  try {
    // Never store the API token permanently for security
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projectCode: config.projectCode, suiteId: config.suiteId }))
  } catch { /* quota */ }
}

export default function QaseExportModal({ output, format, onClose, onSuccess }: QaseExportModalProps) {
  const saved = loadConfig()
  const [apiToken,     setApiToken]     = useState('')
  const [projectCode,  setProjectCode]  = useState(saved.projectCode ?? '')
  const [suiteId,      setSuiteId]      = useState<string>(saved.suiteId?.toString() ?? '')
  const [progress,     setProgress]     = useState<{ done: number; total: number } | null>(null)
  const [result,       setResult]       = useState<{ succeeded: number; failed: number; errors: string[] } | null>(null)
  const [sending,      setSending]      = useState(false)

  useEffect(() => {
    // ESC to close
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSend = async () => {
    if (!apiToken.trim() || !projectCode.trim()) return
    const config: QaseConfig = {
      apiToken: apiToken.trim(),
      projectCode: projectCode.trim(),
      suiteId: suiteId ? parseInt(suiteId) : undefined,
    }
    saveConfig(config)
    setSending(true)
    setProgress({ done: 0, total: output.testCases.length })
    const r = await sendAllToQase(output.testCases, config, format, (done, total) => setProgress({ done, total }))
    setResult(r)
    setSending(false)
    if (r.succeeded > 0) onSuccess(r.succeeded)
  }

  const inputCls = 'w-full text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#141413] text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#30302E] dark:focus:ring-slate-500 transition-colors'
  const labelCls = 'block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#30302E] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Enviar para Qase.io</h2>
            <p className="text-slate-300 text-xs mt-0.5">{output.testCases.length} casos de teste prontos para envio</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {!result ? (
            <>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                ⚠️ O API Token <strong>não é salvo</strong> localmente por segurança. Somente o código do projeto é lembrado.
              </div>

              <div>
                <label className={labelCls}>API Token <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  value={apiToken}
                  onChange={e => setApiToken(e.target.value)}
                  placeholder="sua-api-key-do-qase"
                  className={inputCls}
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-1">Gere em Qase → Settings → API Tokens</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Código do Projeto <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={projectCode}
                    onChange={e => setProjectCode(e.target.value.toUpperCase())}
                    placeholder="PROJ"
                    className={`${inputCls} uppercase`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Suite ID <span className="text-slate-400 font-normal">(opcional)</span></label>
                  <input
                    type="number"
                    value={suiteId}
                    onChange={e => setSuiteId(e.target.value)}
                    placeholder="123"
                    className={inputCls}
                  />
                </div>
              </div>

              {sending && progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Enviando casos...</span>
                    <span>{progress.done}/{progress.total}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#30302E] dark:bg-slate-400 rounded-full transition-all duration-300"
                      style={{ width: `${(progress.done / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
                <button
                  onClick={handleSend}
                  disabled={sending || !apiToken.trim() || !projectCode.trim()}
                  className="flex-1 bg-[#30302E] hover:bg-[#252523] disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Enviando...</>
                  ) : (
                    <>Enviar {output.testCases.length} casos</>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Result screen */
            <div className="text-center space-y-4 py-2">
              <span className="text-5xl">{result.failed === 0 ? '✅' : result.succeeded > 0 ? '⚠️' : '❌'}</span>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
                  {result.failed === 0 ? 'Enviado com sucesso!' : `${result.succeeded} enviados, ${result.failed} falharam`}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {result.succeeded > 0 && `${result.succeeded} caso${result.succeeded > 1 ? 's' : ''} criado${result.succeeded > 1 ? 's' : ''} no Qase.io`}
                </p>
              </div>
              {result.errors.length > 0 && (
                <div className="text-left bg-red-50 dark:bg-red-900/20 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => <p key={i} className="text-xs text-red-700 dark:text-red-300">{e}</p>)}
                </div>
              )}
              <button onClick={onClose} className="btn-primary w-full">Fechar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
