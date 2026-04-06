import type { AcceptanceCriterion, GherkinStep, TestCase, Language, Priority, Severity, TestType } from '../types'
import { t } from '../i18n'

let gherkinTcCounter = 0
const usedGherkinNegTitles = new Set<string>()
export function resetGherkinCounter() { gherkinTcCounter = 0; usedGherkinNegTitles.clear() }

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

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function truncateTitle(title: string, maxLen = 60): string {
  if (title.length <= maxLen) return title
  return title.slice(0, maxLen - 1).replace(/\s+\S*$/, '') + '…'
}

function buildScenarioTitle(criterion: AcceptanceCriterion, lang: Language, kind: 'positive' | 'negative'): string {
  const firstAction = criterion.actions[0]
  if (firstAction) {
    const base = `${firstAction.verb} ${firstAction.target}`
    if (kind === 'positive') return capitalizeFirst(truncateTitle(base))
    const tryPrefix = lang === 'pt-br' ? 'Tentar' : lang === 'es' ? 'Intentar' : 'Try to'
    const withInvalid = lang === 'pt-br' ? 'com dados inválidos' : lang === 'es' ? 'con datos inválidos' : 'with invalid data'
    return truncateTitle(`${tryPrefix} ${base.toLowerCase()} ${withInvalid}`)
  }
  const text = criterion.rawText.replace(/[\n\r]+/g, ' ').trim()
  if (kind === 'positive') return truncateTitle(text)
  return truncateTitle(`${text} — ${t('tryWithInvalidData', lang)}`)
}

function buildScenarioDescription(criterion: AcceptanceCriterion, lang: Language, kind: 'positive' | 'negative'): string {
  if (kind === 'positive') {
    const prefix = t('descVerifyThat', lang)
    if (criterion.expectedResults.length > 0) {
      const results = criterion.expectedResults.map(r => r.charAt(0).toLowerCase() + r.slice(1)).join('. ')
      return `${prefix} ${results}.`
    }
    const text = criterion.rawText.replace(/[\n\r]+/g, ' ').trim()
    return `${prefix} ${text.charAt(0).toLowerCase() + text.slice(1)}.`
  }
  return `${t('descNegativeVerify', lang)} ${t('userTriesInvalid', lang)}. ${t('systemShowsError', lang)}.`
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
    description: buildScenarioDescription(criterion, lang, 'positive'),
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

  // Negative scenario — deduplicated globally across all criteria
  if (criterion.negatable) {
    const negTitle = buildScenarioTitle(criterion, lang, 'negative')
    if (!usedGherkinNegTitles.has(negTitle)) {
      usedGherkinNegTitles.add(negTitle)
      gherkinTcCounter++
      const negId = `TC-${String(gherkinTcCounter).padStart(3, '0')}`
      cases.push({
        id: negId,
        title: `${negId}: ${negTitle}`,
        description: buildScenarioDescription(criterion, lang, 'negative'),
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
  }

  return cases
}
