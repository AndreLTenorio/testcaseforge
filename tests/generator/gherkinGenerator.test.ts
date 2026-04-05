import { describe, it, expect, beforeEach } from 'vitest'
import { generateGherkinTestCases, resetGherkinCounter } from '../../src/engine/generator/gherkinGenerator'
import type { AcceptanceCriterion } from '../../src/engine/types'

const CRITERION: AcceptanceCriterion = {
  id: 'AC-001',
  rawText: 'O paciente deve selecionar a especialidade médica para agendar consulta',
  preconditions: ['Paciente está logado no sistema'],
  actions: [{ verb: 'Selecionar', target: 'especialidade médica' }],
  expectedResults: ['Sistema exibe os horários disponíveis'],
  dataElements: [],
  negatable: true,
  stateTransitions: [],
}

describe('generateGherkinTestCases()', () => {
  beforeEach(() => resetGherkinCounter())

  it('generates a positive scenario', () => {
    const cases = generateGherkinTestCases(CRITERION, 'pt-br', 'high', 'major', 'functional')
    const positive = cases.find(c => c.kind === 'positive')
    expect(positive).toBeDefined()
  })

  it('generates a negative scenario for negatable criterion', () => {
    const cases = generateGherkinTestCases(CRITERION, 'pt-br', 'high', 'major', 'functional')
    const negative = cases.find(c => c.kind === 'negative')
    expect(negative).toBeDefined()
  })

  it('positive scenario has Given/When/Then steps', () => {
    const cases = generateGherkinTestCases(CRITERION, 'pt-br', 'high', 'major', 'functional')
    const positive = cases.find(c => c.kind === 'positive')!
    const keywords = positive.gherkinSteps.map(s => s.keyword)
    expect(keywords).toContain('Given')
    expect(keywords).toContain('When')
    expect(keywords).toContain('Then')
  })

  it('steps array is empty (gherkin uses gherkinSteps)', () => {
    const cases = generateGherkinTestCases(CRITERION, 'pt-br', 'high', 'major', 'functional')
    cases.forEach(c => expect(c.steps).toHaveLength(0))
  })

  it('works in English', () => {
    const enCriterion: AcceptanceCriterion = {
      ...CRITERION,
      rawText: 'User must select a specialty to book an appointment',
      preconditions: ['User is logged in'],
      actions: [{ verb: 'Select', target: 'medical specialty' }],
      expectedResults: ['System shows available slots'],
    }
    const cases = generateGherkinTestCases(enCriterion, 'en', 'normal', 'major', 'functional')
    expect(cases.length).toBeGreaterThan(0)
  })
})
