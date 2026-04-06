import type { ParsedUserStory, GeneratedOutput, InputMetadata, TestCase } from '../types'
import { generateProceduralTestCases, resetTcCounter } from './proceduralGenerator'
import { generateGherkinTestCases, resetGherkinCounter } from './gherkinGenerator'
import { extractCriteria } from '../parser/criteriaExtractor'

// Noise patterns: sub-bullets that are just variable placeholders or overly short
// fragments not worth generating a dedicated test case for.
const RULE_NOISE = /^\s*\[[^\]]+\]\s*(\(.*\))?\s*$/

function isMeaningfulRule(rule: string): boolean {
  const trimmed = rule.trim()
  if (trimmed.length < 15) return false
  if (RULE_NOISE.test(trimmed)) return false
  return true
}

export function generateTestCases(parsed: ParsedUserStory, metadata: InputMetadata): GeneratedOutput {
  const { language, criteria, businessRules } = parsed
  const { priority, severity, type, format } = metadata

  resetTcCounter()
  resetGherkinCounter()

  const testCases: TestCase[] = []

  for (const criterion of criteria) {
    if (format === 'procedural' || format === 'both') {
      const proceduralCases = generateProceduralTestCases(criterion, language, priority, severity, type)
      testCases.push(...proceduralCases)
    }
    if (format === 'gherkin') {
      const gherkinCases = generateGherkinTestCases(criterion, language, priority, severity, type)
      testCases.push(...gherkinCases)
    }
    if (format === 'both') {
      // Add gherkin steps to already-added procedural cases
      const gherkinOnly = generateGherkinTestCases(criterion, language, priority, severity, type)
      const matching = testCases.filter(tc => tc.criterionRef === criterion.id)
      gherkinOnly.forEach((gc, idx) => {
        if (matching[idx]) {
          matching[idx].gherkinSteps = gc.gherkinSteps
        }
      })
    }
  }

  // Add test cases derived from business rules (filter out noise, run through
  // the same criterion extractor to get structured actions/results).
  const meaningfulRules = businessRules.filter(isMeaningfulRule)
  const ruleCriteria = extractCriteria(meaningfulRules, language).map((c, i) => ({
    ...c,
    id: `BR-${String(i + 1).padStart(3, '0')}`,
  }))
  for (const criterion of ruleCriteria) {
    if (format === 'procedural' || format === 'both') {
      const cases = generateProceduralTestCases(criterion, language, priority, severity, type)
      testCases.push(...cases)
    }
    if (format === 'gherkin') {
      const cases = generateGherkinTestCases(criterion, language, priority, severity, type)
      testCases.push(...cases)
    }
  }

  // Deduplicate positive cases with identical titles (e.g. "display X" criteria that collapse to same action)
  const seenTitles = new Set<string>()
  const deduped = testCases.filter(tc => {
    const baseTitle = tc.title.replace(/^TC-\d+:\s*/, '')
    if (tc.kind === 'positive' && seenTitles.has(baseTitle)) return false
    if (tc.kind === 'positive') seenTitles.add(baseTitle)
    return true
  })

  return {
    feature: parsed.title,
    persona: parsed.persona,
    action: parsed.action,
    benefit: parsed.benefit,
    testCases: deduped,
    language,
  }
}
