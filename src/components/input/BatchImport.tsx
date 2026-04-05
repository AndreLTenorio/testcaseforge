import { useState, useRef } from 'react'
import { useUILanguage } from '../../contexts/UILanguageContext'

export interface BatchStory {
  id: string
  title: string
  text: string
}

interface BatchImportProps {
  onImport: (stories: BatchStory[]) => void
}

const SEPARATOR_PATTERNS = [
  /^---+$/m,
  /^===+$/m,
  /^#{1,3}\s+/m,
  /\n\n(?=como\s+um|as\s+a|user\s+story)/im,
]

function splitBatch(raw: string): BatchStory[] {
  for (const sep of SEPARATOR_PATTERNS) {
    const parts = raw.split(sep).map(s => s.trim()).filter(s => s.length > 20)
    if (parts.length > 1) {
      return parts.map((text, i) => ({
        id: `batch-${i + 1}`,
        title: extractTitle(text, i),
        text,
      }))
    }
  }
  return [{ id: 'batch-1', title: extractTitle(raw, 0), text: raw.trim() }]
}

function extractTitle(text: string, index: number): string {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const first = lines[0] ?? ''
  const clean = first.replace(/^#{1,3}\s+/, '').slice(0, 60)
  return clean || `User Story ${index + 1}`
}

export default function BatchImport({ onImport }: BatchImportProps) {
  const { t } = useUILanguage()
  const [open, setOpen] = useState(false)
  const [batchText, setBatchText] = useState('')
  const [preview, setPreview] = useState<BatchStory[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleTextChange = (val: string) => {
    setBatchText(val)
    if (val.trim()) setPreview(splitBatch(val))
    else setPreview([])
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setBatchText(text)
      setPreview(splitBatch(text))
    }
    reader.readAsText(file, 'utf-8')
  }

  const handleConfirm = () => {
    if (preview.length === 0) return
    onImport(preview)
    setOpen(false)
    setBatchText('')
    setPreview([])
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#30302E] dark:hover:bg-[#252523] transition-colors text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <span>📦</span> {t('batchTitle')}
          <span className="text-xs font-normal text-slate-400">{t('batchSub')}</span>
        </span>
        <span
          className="text-slate-400 text-sm transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >▼</span>
      </button>

      {open && (
        <div className="px-5 py-4 bg-white dark:bg-[#30302E]/80 space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('batchHint')}
          </p>

          <div className="flex gap-2">
            <textarea
              value={batchText}
              onChange={e => handleTextChange(e.target.value)}
              placeholder={`Como um usuário, eu quero fazer login...\nCritérios de Aceite:\n1. ...\n\n---\n\nComo um admin, eu quero gerenciar usuários...\nCritérios de Aceite:\n1. ...`}
              rows={6}
              className="flex-1 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#141413] text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#30302E] dark:focus:ring-slate-500 font-mono resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-secondary flex items-center gap-2"
            >
              {t('batchLoadFile')}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.text"
              onChange={handleFile}
              className="hidden"
            />
            <span className="text-xs text-slate-400">{t('batchFileTypes')}</span>
          </div>

          {preview.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                {preview.length} {t('batchDetected')}
              </p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {preview.map((s, i) => (
                  <div key={s.id} className="flex items-start gap-2 text-xs bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                    <span className="font-mono text-slate-400 shrink-0 w-6 text-right">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-700 dark:text-slate-300 truncate">{s.title}</p>
                      <p className="text-slate-400 truncate">{s.text.slice(0, 80)}…</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleConfirm}
                className="w-full bg-[#30302E] hover:bg-[#252523] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>⚒️</span> {t('batchGenerate')} {preview.length} User Stories
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
