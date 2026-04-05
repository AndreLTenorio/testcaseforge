import type { ProceduralStep } from '../../engine/types'

interface ProceduralViewProps {
  steps: ProceduralStep[]
  preconditions: string[]
}

export default function ProceduralView({ steps, preconditions }: ProceduralViewProps) {
  return (
    <div className="text-sm space-y-3">
      {preconditions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Pré-condições
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300">
            {preconditions.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
          Passos
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full min-w-[480px] text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                <th className="px-3 py-2 text-left w-8 font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">Step Action</th>
                <th className="px-3 py-2 text-left w-32 font-semibold">Data</th>
                <th className="px-3 py-2 text-left font-semibold">Expected Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {steps.map((step) => (
                <tr key={step.number} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-3 py-2 text-slate-400 font-mono">{step.number}</td>
                  <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{step.action}</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-400 font-mono">{step.data}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{step.expectedResult}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
