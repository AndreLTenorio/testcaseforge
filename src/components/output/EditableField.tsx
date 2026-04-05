import { useState, useRef, useEffect } from 'react'

interface EditableFieldProps {
  value: string
  onSave: (newValue: string) => void
  multiline?: boolean
  className?: string
  placeholder?: string
}

export default function EditableField({ value, onSave, multiline = false, className = '', placeholder = 'Digite aqui...' }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  useEffect(() => {
    if (editing && ref.current) ref.current.focus()
  }, [editing])

  const handleSave = () => {
    onSave(draft.trim() || value)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') { setDraft(value); setEditing(false) }
  }

  if (!editing) {
    return (
      <span
        className={`cursor-text hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded px-0.5 transition-colors group-hover:outline-dashed group-hover:outline-1 group-hover:outline-amber-300 ${className}`}
        onClick={() => { setDraft(value); setEditing(true) }}
        title="Clique para editar"
      >
        {value || <span className="text-slate-400 italic text-xs">{placeholder}</span>}
      </span>
    )
  }

  const sharedCls = 'text-sm border border-amber-400 rounded px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400 w-full'

  return (
    <span className="inline-flex flex-col gap-1 w-full">
      {multiline ? (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className={`${sharedCls} resize-none`}
        />
      ) : (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={sharedCls}
        />
      )}
      <span className="flex gap-1.5 text-xs">
        <button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-0.5 rounded font-medium transition-colors">Salvar</button>
        <button onClick={() => { setDraft(value); setEditing(false) }} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded transition-colors">Cancelar</button>
      </span>
    </span>
  )
}
