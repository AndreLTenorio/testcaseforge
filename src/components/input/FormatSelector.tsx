import type { OutputFormat } from '../../engine/types'
import { useUILanguage } from '../../contexts/UILanguageContext'

interface FormatSelectorProps {
  value: OutputFormat
  onChange: (format: OutputFormat) => void
}

export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const { t } = useUILanguage()

  const formats: Array<{ value: OutputFormat; label: string; desc: string }> = [
    { value: 'procedural', label: t('formatProcedural'), desc: t('formatProceduralDesc') },
    { value: 'gherkin',    label: t('formatGherkin'),    desc: t('formatGherkinDesc') },
    { value: 'both',       label: t('formatBoth'),       desc: t('formatBothDesc') },
  ]

  return (
    <div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-2">
        {t('formatLabel')}
      </span>
      <div className="grid grid-cols-3 gap-2">
        {formats.map(f => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`flex flex-col items-center text-center px-2 py-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
              value === f.value
                ? 'border-[#30302E] bg-[#30302E] text-white dark:border-slate-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
            aria-pressed={value === f.value}
          >
            <span className="font-semibold">{f.label}</span>
            <span className="text-[10px] opacity-70 mt-0.5">{f.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
