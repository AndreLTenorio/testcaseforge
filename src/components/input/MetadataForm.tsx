import type { InputMetadata, Priority, Severity, TestType } from '../../engine/types'
import { useUILanguage } from '../../contexts/UILanguageContext'

interface MetadataFormProps {
  metadata: InputMetadata
  onChange: (metadata: InputMetadata) => void
}

const SEVERITIES: Array<{ value: Severity; label: string }> = [
  { value: 'trivial',  label: 'Trivial' },
  { value: 'minor',   label: 'Minor' },
  { value: 'major',   label: 'Major' },
  { value: 'critical', label: 'Critical' },
  { value: 'blocker', label: 'Blocker' },
]

const labelCls = 'text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block'
const inputCls = 'w-full text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#141413] text-slate-900 dark:text-slate-100 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#30302E] dark:focus:ring-slate-500 transition-colors'

export default function MetadataForm({ metadata, onChange }: MetadataFormProps) {
  const { t } = useUILanguage()

  const update = <K extends keyof InputMetadata>(key: K, value: InputMetadata[K]) => {
    onChange({ ...metadata, [key]: value })
  }

  const priorities: Array<{ value: Priority; label: string }> = [
    { value: 'low',      label: t('priorityLow') },
    { value: 'normal',   label: t('priorityNormal') },
    { value: 'high',     label: t('priorityHigh') },
    { value: 'critical', label: t('priorityCritical') },
  ]

  const types: Array<{ value: TestType; label: string }> = [
    { value: 'functional',     label: t('typeFunctional') },
    { value: 'non-functional', label: t('typeNonFunctional') },
    { value: 'regression',     label: t('typeRegression') },
    { value: 'smoke',          label: t('typeSmoke') },
    { value: 'exploratory',    label: t('typeExploratory') },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Project */}
      <div>
        <label htmlFor="project-name" className={labelCls}>{t('metadataProject')}</label>
        <input
          id="project-name"
          type="text"
          value={metadata.projectName}
          onChange={(e) => update('projectName', e.target.value)}
          placeholder={t('metadataProject')}
          className={inputCls}
        />
      </div>

      {/* Suite */}
      <div>
        <label htmlFor="suite-name" className={labelCls}>{t('metadataSuite')}</label>
        <input
          id="suite-name"
          type="text"
          value={metadata.suiteName}
          onChange={(e) => update('suiteName', e.target.value)}
          placeholder={t('metadataSuite')}
          className={inputCls}
        />
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className={labelCls}>{t('metadataPriority')}</label>
        <select
          id="priority"
          value={metadata.priority}
          onChange={(e) => update('priority', e.target.value as Priority)}
          className={inputCls}
        >
          {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {/* Severity */}
      <div>
        <label htmlFor="severity" className={labelCls}>{t('metadataSeverity')}</label>
        <select
          id="severity"
          value={metadata.severity}
          onChange={(e) => update('severity', e.target.value as Severity)}
          className={inputCls}
        >
          {SEVERITIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Type */}
      <div className="col-span-2">
        <label htmlFor="test-type" className={labelCls}>{t('metadataType')}</label>
        <select
          id="test-type"
          value={metadata.type}
          onChange={(e) => update('type', e.target.value as TestType)}
          className={inputCls}
        >
          {types.map(tp => <option key={tp.value} value={tp.value}>{tp.label}</option>)}
        </select>
      </div>
    </div>
  )
}
