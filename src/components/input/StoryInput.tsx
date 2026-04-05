import { useUILanguage } from '../../contexts/UILanguageContext'

interface StoryInputProps {
  value: string
  onChange: (value: string) => void
}

export default function StoryInput({ value, onChange }: StoryInputProps) {
  const { t } = useUILanguage()
  const charCount = value.length
  const isNearLimit = charCount > 8000

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <label htmlFor="story-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t('storyInputLabel')}
        </label>
        <span className={`text-xs ${isNearLimit ? 'text-amber-500' : 'text-slate-400'}`}>
          {charCount.toLocaleString()} / 10.000 chars
        </span>
      </div>

      <textarea
        id="story-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('storyPlaceholder')}
        maxLength={10000}
        className="flex-1 min-h-[280px] w-full resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#141413] text-slate-900 dark:text-slate-100 text-sm px-3 py-2.5 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#30302E] dark:focus:ring-slate-500 transition-colors font-mono leading-relaxed"
        aria-describedby="story-hint"
        spellCheck={false}
      />

      <p id="story-hint" className="text-xs text-slate-500 dark:text-slate-400">
        {t('storyHint')}
      </p>
    </div>
  )
}
