import { useState } from 'react'
import { useUILanguage } from '../../contexts/UILanguageContext'

export default function HowToUse() {
  const { t } = useUILanguage()
  const [open, setOpen] = useState(false)

  const steps = [
    { icon: '1️⃣', title: t('howToStep1Title'), desc: t('howToStep1Desc'), example: t('howToStep1Example') },
    { icon: '2️⃣', title: t('howToStep2Title'), desc: t('howToStep2Desc'), example: null },
    { icon: '3️⃣', title: t('howToStep3Title'), desc: t('howToStep3Desc'), example: null },
    { icon: '4️⃣', title: t('howToStep4Title'), desc: t('howToStep4Desc'), example: null },
    { icon: '5️⃣', title: t('howToStep5Title'), desc: t('howToStep5Desc'), example: null },
  ]

  const tags = [
    { tag: 'EP',  label: t('howToTagEP'),     color: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
    { tag: 'BVA', label: t('howToTagBVA'),    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    { tag: '+/-', label: t('howToTagPosNeg'), color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    { tag: 'DT',  label: t('howToTagDT'),     color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  ]

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <span>💡</span> {t('howToTitle')}
        </span>
        <span className="text-slate-400 text-sm transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {open && (
        <div className="px-5 py-4 bg-white dark:bg-slate-800/60 space-y-4 animate-in fade-in duration-200">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map(step => (
              <div key={step.icon} className="flex gap-3">
                <span className="text-2xl shrink-0 mt-0.5">{step.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{step.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                  {step.example && (
                    <pre className="mt-2 text-[10px] bg-slate-100 dark:bg-slate-900 rounded p-2 text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {step.example}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">{t('howToIstqbLabel')}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag.tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tag.color}`}>
                  <strong>{tag.tag}</strong> — {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
