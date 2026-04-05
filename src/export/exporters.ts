import type { GeneratedOutput, TestCase, OutputFormat } from '../engine/types'

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportJSON(output: GeneratedOutput) {
  const json = JSON.stringify(output, null, 2)
  downloadFile(json, 'testcases.json', 'application/json')
}

export function exportCSV(output: GeneratedOutput) {
  const headers = ['ID', 'Título', 'Tipo', 'Comportamento', 'Prioridade', 'Gravidade', 'Pré-condições', 'Passos']
  const rows = output.testCases.map(tc => [
    tc.id,
    tc.title,
    tc.type,
    tc.behavior,
    tc.priority,
    tc.severity,
    tc.preconditions.join(' | '),
    tc.steps.map(s => `${s.number}. ${s.action} [${s.data}] → ${s.expectedResult}`).join(' | '),
  ])
  const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  downloadFile(csv, 'testcases.csv', 'text/csv')
}

export function exportMarkdown(output: GeneratedOutput, format: OutputFormat) {
  const lines: string[] = []
  lines.push(`# ${output.feature}`)
  lines.push('')
  if (output.persona) lines.push(`> **Como** ${output.persona}`)
  if (output.action) lines.push(`> **Eu quero** ${output.action}`)
  if (output.benefit) lines.push(`> **Para que** ${output.benefit}`)
  lines.push('')
  lines.push(`---`)
  lines.push('')

  for (const tc of output.testCases) {
    lines.push(`## ${tc.title}`)
    lines.push('')
    lines.push(`**Prioridade:** ${tc.priority} | **Tipo:** ${tc.type} | **Comportamento:** ${tc.behavior}`)
    lines.push('')

    if (tc.preconditions.length > 0) {
      lines.push('**Pré-condições:**')
      tc.preconditions.forEach(p => lines.push(`- ${p}`))
      lines.push('')
    }

    if ((format === 'procedural' || format === 'both') && tc.steps.length > 0) {
      lines.push('**Passos (Procedural):**')
      lines.push('')
      lines.push('| # | Step Action | Data | Expected Result |')
      lines.push('|---|-------------|------|-----------------|')
      tc.steps.forEach(s => lines.push(`| ${s.number} | ${s.action} | ${s.data} | ${s.expectedResult} |`))
      lines.push('')
    }

    if ((format === 'gherkin' || format === 'both') && tc.gherkinSteps.length > 0) {
      lines.push('**Gherkin (BDD):**')
      lines.push('')
      lines.push('```gherkin')
      lines.push(`Scenario: ${tc.title.replace(/TC-\d+:\s*/, '')}`)
      tc.gherkinSteps.forEach(s => lines.push(`  ${s.keyword} ${s.text}`))
      lines.push('```')
      lines.push('')
    }

    lines.push('---')
    lines.push('')
  }

  downloadFile(lines.join('\n'), 'testcases.md', 'text/markdown')
}

export function buildAllText(output: GeneratedOutput, format: OutputFormat): string {
  const lines: string[] = []
  lines.push(`=== ${output.feature} ===`)
  lines.push('')

  for (const tc of output.testCases) {
    lines.push(`[${tc.id}] ${tc.title}`)
    lines.push(`Prioridade: ${tc.priority} | Tipo: ${tc.type} | Comportamento: ${tc.behavior}`)

    if (tc.preconditions.length > 0) {
      lines.push('Pré-condições:')
      tc.preconditions.forEach(p => lines.push(`  - ${p}`))
    }

    if ((format === 'procedural' || format === 'both') && tc.steps.length > 0) {
      lines.push('Passos:')
      tc.steps.forEach(s => lines.push(`  ${s.number}. ${s.action} | ${s.data} | ${s.expectedResult}`))
    }

    if ((format === 'gherkin' || format === 'both') && tc.gherkinSteps.length > 0) {
      lines.push('Gherkin:')
      tc.gherkinSteps.forEach(s => lines.push(`  ${s.keyword} ${s.text}`))
    }

    lines.push('')
  }

  return lines.join('\n')
}

export function buildIndividualText(tc: TestCase, format: OutputFormat): string {
  const lines: string[] = []
  lines.push(`${tc.title}`)
  lines.push(`Prioridade: ${tc.priority} | Tipo: ${tc.type} | Comportamento: ${tc.behavior}`)
  lines.push('')

  if (tc.preconditions.length > 0) {
    lines.push('Pré-condições:')
    tc.preconditions.forEach(p => lines.push(`- ${p}`))
    lines.push('')
  }

  if ((format === 'procedural' || format === 'both') && tc.steps.length > 0) {
    lines.push('# | Step Action | Data | Expected Result')
    tc.steps.forEach(s => lines.push(`${s.number} | ${s.action} | ${s.data} | ${s.expectedResult}`))
    lines.push('')
  }

  if ((format === 'gherkin' || format === 'both') && tc.gherkinSteps.length > 0) {
    tc.gherkinSteps.forEach(s => lines.push(`${s.keyword} ${s.text}`))
  }

  return lines.join('\n')
}
