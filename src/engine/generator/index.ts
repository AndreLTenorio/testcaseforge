import type { ParsedUserStory, GeneratedOutput, InputMetadata, TestCase } from '../types'
import { generateProceduralTestCases, resetTcCounter } from './proceduralGenerator'
import { generateGherkinTestCases, resetGherkinCounter } from './gherkinGenerator'

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

  // Add test cases derived from business rules
  for (const rule of businessRules) {
    const ruleAsCriterion = {
      id: `BR-${String(businessRules.indexOf(rule) + 1).padStart(3, '0')}`,
      rawText: rule,
      preconditions: [],
      actions: [],
      expectedResults: [],
      dataElements: [],
      negatable: true,
      stateTransitions: [],
    }
    if (format === 'procedural' || format === 'both') {
      const cases = generateProceduralTestCases(ruleAsCriterion, language, priority, severity, type)
      testCases.push(...cases)
    }
    if (format === 'gherkin') {
      const cases = generateGherkinTestCases(ruleAsCriterion, language, priority, severity, type)
      testCases.push(...cases)
    }
  }

  return {
    feature: parsed.title,
    persona: parsed.persona,
    action: parsed.action,
    benefit: parsed.benefit,
    testCases,
    language,
  }
}
