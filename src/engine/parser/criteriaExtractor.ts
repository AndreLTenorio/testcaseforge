import type { Language, AcceptanceCriterion, Action, DataElement } from '../types'
import { ACTION_VERBS } from '../dictionaries/actionVerbs'
import { containsExpectedMarker } from '../dictionaries/expectedMarkers'
import { extractBoundaryValues, DATA_TYPE_PATTERNS } from '../dictionaries/dataTypes'

let criterionCounter = 0
export function resetCounter() { criterionCounter = 0 }

// Splits a criterion text into Gherkin segments when Given/When/Then keywords
// are present. Returns null if the text is not a Gherkin scenario so callers
// can fall back to whole-text processing.
// Gherkin keywords — require whitespace (or string start/end) boundaries so that
// single-letter connectors ("e", "y") don't match inside words like "e-mail".
const GHERKIN_SPLIT_RE = /(?:^|\s)(given|dado\s+que|dado|dada\s+que|dada|when|quando|cuando|then|ent[ãa]o|entonces|and|e|y)(?=\s|$)/gi

function splitGherkin(text: string): { given: string; when: string; then: string } | null {
  const matches = [...text.matchAll(GHERKIN_SPLIT_RE)]
  if (matches.length === 0) return null
  const segments: { kw: string; start: number; end: number }[] = []
  matches.forEach((m, i) => {
    const start = m.index! + m[0].length
    const end = i + 1 < matches.length ? matches[i + 1].index! : text.length
    segments.push({ kw: m[1].toLowerCase(), start, end })
  })
  let current: 'given' | 'when' | 'then' = 'given'
  const parts = { given: '', when: '', then: '' }
  for (const seg of segments) {
    const body = text.slice(seg.start, seg.end).trim().replace(/[,;.]+$/, '')
    if (/^given|^dado|^dada/.test(seg.kw)) current = 'given'
    else if (/^when|^quando|^cuando/.test(seg.kw)) current = 'when'
    else if (/^then|^ent|^enton/.test(seg.kw)) current = 'then'
    // and/e/y inherit the current section
    if (body) parts[current] = parts[current] ? `${parts[current]}, ${body}` : body
  }
  // Only treat as Gherkin if we found at least a When or Then block
  if (!parts.when && !parts.then) return null
  return parts
}

function extractActions(text: string, lang: Language): Action[] {
  const actions: Action[] = []
  const verbMap = ACTION_VERBS[lang]
  const allVerbs = Object.values(verbMap).flat().sort((a, b) => b.length - a.length)

  // If this criterion is a Gherkin scenario, extract actions from the "When" block
  // when present; otherwise fall back to the "Then" block (observation scenarios).
  const gherkin = splitGherkin(text)
  const sourceText = gherkin ? (gherkin.when || gherkin.then || text) : text
  // For each verb, try to match it as-is OR as a conjugation stem (drop trailing "r"
  // to catch forms like "conclui" for "concluir", "informa" for "informar", etc.).
  // The trailing lookahead excludes matches where the stem is part of a longer word
  // (e.g. "valida" inside "validação" — "ç" would not be in \b but IS a letter).
  const verbMatchers = allVerbs.map(v => {
    const stem = v.endsWith('r') && v.length > 4 ? v.slice(0, -1) : v
    const re = new RegExp(`(^|\\s)(${stem}[aeiouáéíóúã]?m?s?)(?=\\s|$|[.,;:!?"')\\]])`, 'i')
    return { verb: v, stem, re }
  })
  const sentences = sourceText.split(/[,;.]|\s+e\s+|\s+and\s+/i)
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase().trim()
    for (const { verb, re } of verbMatchers) {
      const match = re.exec(lower)
      if (match) {
        const matchedLen = match.index + match[0].length
        const after = lower.slice(matchedLen).trim()
        const target = after.replace(/^(o|a|os|as|the|um|uma)\s+/i, '').trim() || sentence.trim()
        actions.push({ verb: capitalize(verb), target: capitalize(target) })
        break
      }
    }
  }

  // If no verb found, treat the When/Then block (or whole text) as a single action.
  if (actions.length === 0 && sourceText.trim().length > 3) {
    actions.push({ verb: 'Realizar', target: capitalize(sourceText.trim()) })
  }

  return actions
}

function extractPreconditions(text: string, lang: Language): string[] {
  const preconditions: string[] = []
  const lower = text.toLowerCase()

  // If this is a Gherkin scenario, the Given block IS the precondition.
  const gherkin = splitGherkin(text)
  if (gherkin && gherkin.given) {
    preconditions.push(capitalize(gherkin.given))
  } else {
    const precondPatterns = lang === 'pt-br'
      ? [/dado\s+que\s+(.+?)(?:[,;\n]|$)/gi, /(?:^|\n)\s*(?:pré-condição|pré-condições|precondição)\s*:?\s*(.+)/gi]
      : [/given\s+(?:that\s+)?(.+?)(?:[,;\n]|$)/gi, /(?:^|\n)\s*precondition\s*:?\s*(.+)/gi]

    for (const pattern of precondPatterns) {
      let match
      while ((match = pattern.exec(text)) !== null) {
        preconditions.push(capitalize(match[1].trim()))
      }
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
  // If this is a Gherkin scenario, take the "Then" block verbatim as expected result.
  const gherkin = splitGherkin(text)
  if (gherkin && gherkin.then) {
    return [capitalize(gherkin.then)]
  }
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
