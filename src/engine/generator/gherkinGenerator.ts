import type { AcceptanceCriterion, GherkinStep, TestCase, Language, Priority, Severity, TestType } from '../types'
import { t } from '../i18n'

let gherkinTcCounter = 0
export function resetGherkinCounter() { gherkinTcCounter = 0 }

function buildGivenSteps(preconditions: string[], lang: Language): GherkinStep[] {
  if (preconditions.length === 0) return [{ keyword: 'Given', text: t('userAccessesSystem', lang) }]
  return preconditions.map((p, i) => ({ keyword: i === 0 ? 'Given' : 'And' as GherkinStep['keyword'], text: p.toLowerCase() }))
}

function buildWhenSteps(criterion: AcceptanceCriterion, lang: Language): GherkinStep[] {
  if (criterion.actions.length === 0) return [{ keyword: 'When', text: t('userPerformsAction', lang) }]
  return criterion.actions.map((action, i) => ({
    keyword: i === 0 ? 'When' : 'And' as GherkinStep['keyword'],
    text: `${action.verb.toLowerCase()} ${action.target.toLowerCase()}`,
  }))
}

function buildThenSteps(expectedResults: string[], lang: Language): GherkinStep[] {
  if (expectedResults.length === 0) return [{ keyword: 'Then', text: t('systemProcesses', lang) }]
  return expectedResults.map((r, i) => ({ keyword: i === 0 ? 'Then' : 'And' as GherkinStep['keyword'], text: r.toLowerCase() }))
}

function buildScenarioTitle(criterion: AcceptanceCriterion, lang: Language, kind: 'positive' | 'negative'): string {
  const firstAction = criterion.actions[0]
  if (firstAction) {
    const base = `${firstAction.verb} ${firstAction.target}`.toLowerCase()
    if (kind === 'positive') return `${base} ${t('successSuffix', lang)}`
    const tryPrefix = lang === 'pt-br' ? 'tentar' : lang === 'es' ? 'intentar' : 'try to'
    const withInvalid = lang === 'pt-br' ? 'com dados inválidos' : lang === 'es' ? 'con datos inválidos' : 'with invalid data'
    return `${tryPrefix} ${base} ${withInvalid}`
  }
  const text = criterion.rawText.slice(0, 50).replace(/[\n\r]/g, ' ')
  return kind === 'positive' ? `${text} (${t('successSuffix', lang)})` : `${text} (${t('happyPath', lang)})`
}

export function generateGherkinTestCases(
  criterion: AcceptanceCriterion,
  lang: Language,
  priority: Priority,
  severity: Severity,
  type: TestType,
): TestCase[] {
  const cases: TestCase[] = []

  // Positive scenario
  gherkinTcCounter++
  const posId = `TC-${String(gherkinTcCounter).padStart(3, '0')}`
  cases.push({
    id: posId,
    title: `${posId}: ${buildScenarioTitle(criterion, lang, 'positive')}`,
    kind: 'positive',
    preconditions: criterion.preconditions,
    steps: [],
    gherkinSteps: [
      ...buildGivenSteps(criterion.preconditions, lang),
      ...buildWhenSteps(criterion, lang),
      ...buildThenSteps(criterion.expectedResults, lang),
    ],
    priority, severity, type, behavior: 'positive',
    criterionRef: criterion.id,
  })

  // Negative scenario
  if (criterion.negatable) {
    gherkinTcCounter++
    const negId = `TC-${String(gherkinTcCounter).padStart(3, '0')}`
    cases.push({
      id: negId,
      title: `${negId}: ${buildScenarioTitle(criterion, lang, 'negative')}`,
      kind: 'negative',
      preconditions: criterion.preconditions,
      steps: [],
      gherkinSteps: [
        ...buildGivenSteps(criterion.preconditions, lang),
        { keyword: 'When', text: t('userTriesInvalid', lang) },
        { keyword: 'Then', text: t('systemShowsError', lang) },
      ],
      priority, severity, type, behavior: 'negative',
      criterionRef: criterion.id,
    })
  }

  return cases
}
