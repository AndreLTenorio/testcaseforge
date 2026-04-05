import { describe, it, expect, beforeEach } from 'vitest'
import { generateProceduralTestCases, resetTcCounter } from '../../src/engine/generator/proceduralGenerator'
import type { AcceptanceCriterion } from '../../src/engine/types'

const BASE_CRITERION: AcceptanceCriterion = {
  id: 'AC-001',
  rawText: 'O usuário deve preencher e-mail e senha obrigatórios para fazer login',
  preconditions: ['Usuário está na tela de login'],
  actions: [
    { verb: 'Preencher', target: 'campo e-mail', data: 'email válido' },
    { verb: 'Preencher', target: 'campo senha', data: 'senha válida' },
    { verb: 'Clicar', target: 'botão Entrar' },
  ],
  expectedResults: ['Sistema exibe a tela principal do usuário'],
  dataElements: [],
  negatable: true,
  stateTransitions: [],
}

describe('generateProceduralTestCases()', () => {
  beforeEach(() => resetTcCounter())

  it('generates at least one positive test case', () => {
    const cases = generateProceduralTestCases(BASE_CRITERION, 'pt-br', 'high', 'major', 'functional')
    const positives = cases.filter(c => c.kind === 'positive')
    expect(positives.length).toBeGreaterThanOrEqual(1)
  })

  it('generates at least one negative test case for negatable criterion', () => {
    const cases = generateProceduralTestCases(BASE_CRITERION, 'pt-br', 'high', 'major', 'functional')
    const negatives = cases.filter(c => c.kind === 'negative')
    expect(negatives.length).toBeGreaterThanOrEqual(1)
  })

  it('positive case has steps', () => {
    const cases = generateProceduralTestCases(BASE_CRITERION, 'pt-br', 'high', 'major', 'functional')
    const positive = cases.find(c => c.kind === 'positive')!
    expect(positive.steps.length).toBeGreaterThan(0)
  })

  it('test case IDs are unique', () => {
    const cases = generateProceduralTestCases(BASE_CRITERION, 'pt-br', 'high', 'major', 'functional')
    const ids = cases.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('assigns correct priority and severity', () => {
    const cases = generateProceduralTestCases(BASE_CRITERION, 'pt-br', 'critical', 'blocker', 'functional')
    cases.forEach(c => {
      expect(c.priority).toBe('critical')
      expect(c.severity).toBe('blocker')
    })
  })

  it('generates BVA cases when data has boundary constraints', () => {
    const criterionWithBVA: AcceptanceCriterion = {
      ...BASE_CRITERION,
      rawText: 'A senha deve ter mínimo 8 caracteres',
      dataElements: [{
        name: 'senha',
        type: 'text',
        constraints: { min: 8 },
        boundaryValues: ['7', '8', '9'],
      }],
    }
    const cases = generateProceduralTestCases(criterionWithBVA, 'pt-br', 'normal', 'major', 'functional')
    const bva = cases.filter(c => c.kind === 'bva')
    expect(bva.length).toBeGreaterThanOrEqual(1)
  })

  it('non-negatable criterion generates no negative cases', () => {
    const nonNegatable: AcceptanceCriterion = { ...BASE_CRITERION, negatable: false, dataElements: [] }
    const cases = generateProceduralTestCases(nonNegatable, 'pt-br', 'normal', 'major', 'functional')
    const negatives = cases.filter(c => c.kind === 'negative')
    expect(negatives).toHaveLength(0)
  })
})
