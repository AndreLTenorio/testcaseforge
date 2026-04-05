import type { ParsedUserStory, Language } from '../types'
import { sanitize } from './sanitizer'
import { detectLanguage } from './languageDetector'
import { splitSections, extractUserStoryParts } from './sectionSplitter'
import { extractCriteria } from './criteriaExtractor'

export function parseUserStory(raw: string): ParsedUserStory {
  const sanitized = sanitize(raw)
  const language: Language = detectLanguage(sanitized)
  const sections = splitSections(sanitized, language)
  const { persona, action, benefit, title } = extractUserStoryParts(sections.userStory, language)
  const criteria = extractCriteria(sections.acceptanceCriteria, language)

  return {
    title,
    persona,
    action,
    benefit,
    language,
    criteria,
    businessRules: sections.businessRules,
    notes: sections.notes,
  }
}
