import type { Language, AcceptanceCriterion, Action, DataElement } from '../types'
import { ACTION_VERBS } from '../dictionaries/actionVerbs'
import { containsExpectedMarker } from '../dictionaries/expectedMarkers'
import { extractBoundaryValues, DATA_TYPE_PATTERNS } from '../dictionaries/dataTypes'

let criterionCounter = 0
export function resetCounter() { criterionCounter = 0 }

function extractActions(text: string, lang: Language): Action[] {
  const actions: Action[] = []
  const verbMap = ACTION_VERBS[lang]
  const allVerbs = Object.values(verbMap).flat().sort((a, b) => b.length - a.length)

  const sentences = text.split(/[,;]|\s+e\s+|\s+and\s+/i)
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase().trim()
    for (const verb of allVerbs) {
      if (lower.startsWith(verb) || lower.includes(` ${verb} `)) {
        const rest = lower.replace(verb, '').trim()
        // Try to detect target (UI element or entity after the verb)
        const target = rest.replace(/^(o|a|os|as|the|um|uma)\s+/i, '').trim() || sentence.trim()
        actions.push({ verb: capitalize(verb), target: capitalize(target) })
        break
      }
    }
  }

  // If no verb found, treat the whole sentence as a single action
  if (actions.length === 0 && text.trim().length > 3) {
    actions.push({ verb: 'Realizar', target: capitalize(text.trim()) })
  }

  return actions
}

function extractPreconditions(text: string, lang: Language): string[] {
  const preconditions: string[] = []
  const lower = text.toLowerCase()

  const precondPatterns = lang === 'pt-br'
    ? [/dado\s+que\s+(.+?)(?:[,;\n]|$)/gi, /(?:^|\n)\s*(?:pré-condição|pré-condições|precondição)\s*:?\s*(.+)/gi]
    : [/given\s+(?:that\s+)?(.+?)(?:[,;\n]|$)/gi, /(?:^|\n)\s*precondition\s*:?\s*(.+)/gi]

  for (const pattern of precondPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      preconditions.push(capitalize(match[1].trim()))
    }
  }

  // State preconditions
  if (lang === 'pt-br') {
    if (lower.includes('logado') || lower.includes('autenticado')) {
      if (!preconditions.some(p => p.toLowerCase().includes('logado'))) {
        preconditions.push('Usuário está logado no sistema')
      }
    }
  } else {
    if (lower.includes('logged in') || lower.includes('authenticated')) {
      if (!preconditions.some(p => p.toLowerCase().includes('logged'))) {
        preconditions.push('User is logged in to the system')
      }
    }
  }

  return preconditions
}

function extractDataElements(text: string, _lang: Language): DataElement[] {
  const elements: DataElement[] = []
  const lower = text.toLowerCase()

  for (const [type, patterns] of Object.entries(DATA_TYPE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        const boundaries = extractBoundaryValues(text)
        const existing = elements.find(e => e.type === type)
        if (!existing) {
          const el: DataElement = {
            name: type,
            type: type as DataElement['type'],
          }
          if (boundaries.min !== undefined || boundaries.max !== undefined) {
            el.constraints = boundaries
            // Generate BVA values
            const bva: string[] = []
            if (boundaries.min !== undefined) {
              bva.push(`${boundaries.min - 1}`, `${boundaries.min}`, `${boundaries.min + 1}`)
            }
            if (boundaries.max !== undefined) {
              bva.push(`${boundaries.max - 1}`, `${boundaries.max}`, `${boundaries.max + 1}`)
            }
            el.boundaryValues = [...new Set(bva)]
          }
          elements.push(el)
        }
        break
      }
    }
  }

  return elements
}

function extractExpectedResults(text: string, lang: Language): string[] {
  const results: string[] = []
  const sentences = text.split(/[.!]/).map(s => s.trim()).filter(Boolean)

  for (const sentence of sentences) {
    if (containsExpectedMarker(sentence, lang)) {
      results.push(capitalize(sentence))
    }
  }

  if (results.length === 0) {
    // Last meaningful sentence is often the expected result
    const meaningful = sentences.filter(s => s.length > 10)
    if (meaningful.length > 0) {
      results.push(capitalize(meaningful[meaningful.length - 1]))
    }
  }

  return results
}

function capitalize(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function isNegatable(text: string): boolean {
  const patterns = [
    /obrigat[oó]rio/i, /required/i, /formato/i, /format/i,
    /mínimo|máximo|minimum|maximum/i, /logado|authenticated/i,
    /permissão|permission/i, /selecionar|select/i,
    /cpf|cnpj|email|e-mail|telefone/i, /data|date/i,
    /upload|arquivo|file/i, /senha|password/i,
  ]
  return patterns.some(p => p.test(text))
}

export function extractCriteria(criteriaTexts: string[], lang: Language): AcceptanceCriterion[] {
  criterionCounter = 0
  return criteriaTexts
    .filter(t => t.trim().length > 0)
    .map((rawText) => {
      criterionCounter++
      const id = `AC-${String(criterionCounter).padStart(3, '0')}`

      return {
        id,
        rawText,
        preconditions: extractPreconditions(rawText, lang),
        actions: extractActions(rawText, lang),
        expectedResults: extractExpectedResults(rawText, lang),
        dataElements: extractDataElements(rawText, lang),
        negatable: isNegatable(rawText),
        stateTransitions: [],
      }
    })
}
