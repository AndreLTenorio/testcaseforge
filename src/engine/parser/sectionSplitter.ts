import type { Language } from '../types'

export interface Sections {
  userStory: string
  acceptanceCriteria: string[]
  businessRules: string[]
  notes: string[]
}

const SECTION_HEADERS: Record<Language, { ac: RegExp[]; br: RegExp[]; notes: RegExp[] }> = {
  'es': {
    ac: [
      /criterios?\s+de\s+aceptaci[oó]n\s*:?/i,
      /criterios?\s+de\s+aceptaci[oó]n\s*:?/i,
      /\bac\b\s*:/i,
      /criterios?\s*:/i,
    ],
    br: [
      /reglas?\s+de\s+negocio\s*:?/i,
      /reglas?\s+de\s+negocio\s*:?/i,
      /\brn\b\s*:/i,
    ],
    notes: [
      /observaciones?\s*:?/i,
      /notas?\s*:?/i,
      /importante\s*:?/i,
      /atenci[oó]n\s*:?/i,
    ],
  },
  'pt-br': {
    ac: [
      /critérios?\s+de\s+aceite\s*:?/i,
      /crit[eé]rios?\s+de\s+aceitação\s*:?/i,
      /acceptance\s+criteria\s*:?/i,
      /\bac\b\s*:/i,
      /\bca\b\s*:/i,
      /critérios?\s*:/i,
    ],
    br: [
      /regras?\s+de\s+neg[oó]cio\s*:?/i,
      /business\s+rules?\s*:?/i,
      /\brn\b\s*:/i,
      /\bbr\b\s*:/i,
    ],
    notes: [
      /observa[çc][õo]es?\s*:?/i,
      /notas?\s*:?/i,
      /notes?\s*:?/i,
      /aten[çc][ãa]o\s*:?/i,
      /importante\s*:?/i,
    ],
  },
  'en': {
    ac: [
      /acceptance\s+criteria\s*:?/i,
      /\bac\b\s*:/i,
    ],
    br: [
      /business\s+rules?\s*:?/i,
      /\bbr\b\s*:/i,
    ],
    notes: [
      /notes?\s*:?/i,
      /observations?\s*:?/i,
      /important\s*:?/i,
      /attention\s*:?/i,
    ],
  },
}

type SectionType = 'userStory' | 'ac' | 'br' | 'notes'

function identifySection(line: string, lang: Language): SectionType | null {
  const headers = SECTION_HEADERS[lang]
  if (headers.ac.some(r => r.test(line))) return 'ac'
  if (headers.br.some(r => r.test(line))) return 'br'
  if (headers.notes.some(r => r.test(line))) return 'notes'
  return null
}

function extractListItems(text: string): string[] {
  return text
    .split('\n')
    .map(l => l.replace(/^[-*•]\s+|^\d+\.\s+/, '').trim())
    .filter(l => l.length > 0)
}

export function splitSections(text: string, lang: Language): Sections {
  const lines = text.split('\n')
  const sections: Sections = { userStory: '', acceptanceCriteria: [], businessRules: [], notes: [] }

  let currentSection: SectionType = 'userStory'
  const buckets: Record<SectionType, string[]> = { userStory: [], ac: [], br: [], notes: [] }

  for (const line of lines) {
    const sectionType = identifySection(line.trim(), lang)
    if (sectionType) {
      currentSection = sectionType
      continue
    }
    buckets[currentSection].push(line)
  }

  sections.userStory = buckets.userStory.join('\n').trim()
  sections.acceptanceCriteria = extractListItems(buckets.ac.join('\n'))
  sections.businessRules = extractListItems(buckets.br.join('\n'))
  sections.notes = extractListItems(buckets.notes.join('\n'))

  // If no explicit AC section found, try to extract from freeform text
  if (sections.acceptanceCriteria.length === 0 && sections.userStory) {
    const lines2 = sections.userStory.split('\n')
    const freeItems = lines2.filter(l => /^[-*•]\s+|\d+\.\s+/.test(l.trim()))
    if (freeItems.length > 0) {
      sections.acceptanceCriteria = freeItems.map(l => l.replace(/^[-*•]\s+|\d+\.\s+/, '').trim())
      // Remove those lines from userStory
      sections.userStory = lines2.filter(l => !/^[-*•]\s+|\d+\.\s+/.test(l.trim())).join('\n').trim()
    }
  }

  return sections
}

export function extractUserStoryParts(userStoryText: string, lang: Language): { persona: string | null; action: string | null; benefit: string | null; title: string } {
  let persona: string | null = null
  let action: string | null = null
  let benefit: string | null = null

  if (lang === 'pt-br') {
    const comoMatch = userStoryText.match(/como\s+(?:um?a?\s+)?(.+?)[\n,]/i)
    const queroMatch = userStoryText.match(/eu\s+quero\s+(.+?)[\n,]/i)
    const paraMatch = userStoryText.match(/para\s+que\s+(.+?)[\n,.]?$/im)
    if (comoMatch) persona = comoMatch[1].trim()
    if (queroMatch) action = queroMatch[1].trim()
    if (paraMatch) benefit = paraMatch[1].trim()
  } else if (lang === 'es') {
    const comoMatch = userStoryText.match(/como\s+(?:un?a?\s+)?(.+?)[\n,]/i)
    const quieroMatch = userStoryText.match(/(?:yo\s+)?quiero\s+(.+?)[\n,]/i)
    const paraMatch = userStoryText.match(/para\s+(?:que\s+)?(?:yo\s+)?(.+?)[\n,.]?$/im)
    if (comoMatch) persona = comoMatch[1].trim()
    if (quieroMatch) action = quieroMatch[1].trim()
    if (paraMatch) benefit = paraMatch[1].trim()
  } else {
    const asMatch = userStoryText.match(/as\s+(?:a|an)\s+(.+?)[\n,]/i)
    const wantMatch = userStoryText.match(/i\s+want\s+(?:to\s+)?(.+?)[\n,]/i)
    const soThatMatch = userStoryText.match(/so\s+that\s+(.+?)[\n,.]?$/im)
    if (asMatch) persona = asMatch[1].trim()
    if (wantMatch) action = wantMatch[1].trim()
    if (soThatMatch) benefit = soThatMatch[1].trim()
  }

  const FEATURE_LABELS: Record<Language, [string, string]> = {
    'pt-br': ['Funcionalidade:', 'Funcionalidade não especificada'],
    'en':    ['Feature:', 'Unspecified Feature'],
    'es':    ['Funcionalidad:', 'Funcionalidad no especificada'],
  }
  const [prefix, fallback] = FEATURE_LABELS[lang]
  const title = action ? `${prefix} ${action}` : fallback

  return { persona, action, benefit, title }
}
