import { describe, it, expect } from 'vitest'
import { parseUserStory } from '../../src/engine/parser'
import { generateTestCases } from '../../src/engine/generator'
import type { InputMetadata } from '../../src/engine/types'

const META: InputMetadata = {
  projectName: 'TestProject',
  suiteName: 'Login Suite',
  priority: 'high',
  severity: 'major',
  type: 'functional',
  format: 'procedural',
}

const AGENDAMENTO_STORY = `Como um paciente,
Eu quero agendar uma teleconsulta,
Para que eu possa ser atendido sem sair de casa.

Critérios de Aceite:
1. O paciente deve estar logado no sistema
2. O paciente deve selecionar a especialidade médica desejada
3. O sistema deve exibir os horários disponíveis para a especialidade selecionada
4. O paciente deve selecionar uma data e horário disponível
5. O paciente deve confirmar o agendamento
6. Após a confirmação, o sistema deve exibir mensagem de sucesso com os dados da consulta

Regras de Negócio:
- Não é permitido agendar mais de 3 consultas no mesmo dia
- O agendamento deve ser feito com no mínimo 2 horas de antecedência`

describe('Full pipeline integration (PT-BR)', () => {
  it('parses story correctly', () => {
    const parsed = parseUserStory(AGENDAMENTO_STORY)
    expect(parsed.language).toBe('pt-br')
    expect(parsed.persona).toBeTruthy()
    expect(parsed.criteria.length).toBeGreaterThanOrEqual(4)
  })

  it('generates test cases from full story', () => {
    const parsed = parseUserStory(AGENDAMENTO_STORY)
    const output = generateTestCases(parsed, META)
    expect(output.testCases.length).toBeGreaterThan(0)
  })

  it('generates both positive and negative cases', () => {
    const parsed = parseUserStory(AGENDAMENTO_STORY)
    const output = generateTestCases(parsed, META)
    const positives = output.testCases.filter(t => t.kind === 'positive')
    const negatives = output.testCases.filter(t => t.kind === 'negative')
    expect(positives.length).toBeGreaterThan(0)
    expect(negatives.length).toBeGreaterThan(0)
  })

  it('all test cases have unique IDs', () => {
    const parsed = parseUserStory(AGENDAMENTO_STORY)
    const output = generateTestCases(parsed, META)
    const ids = output.testCases.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all positive cases have at least one step', () => {
    const parsed = parseUserStory(AGENDAMENTO_STORY)
    const output = generateTestCases(parsed, META)
    output.testCases
      .filter(t => t.kind === 'positive')
      .forEach(t => expect(t.steps.length).toBeGreaterThan(0))
  })
})

describe('Full pipeline integration (EN)', () => {
  const EN_STORY = `As a user,
I want to reset my password,
So that I can regain access to my account.

Acceptance Criteria:
- User must enter their registered email address
- System must send a password reset email
- Reset link must expire after 1 hour
- New password must have minimum 8 characters`

  it('detects English', () => {
    const parsed = parseUserStory(EN_STORY)
    expect(parsed.language).toBe('en')
  })

  it('generates test cases in English', () => {
    const parsed = parseUserStory(EN_STORY)
    const output = generateTestCases(parsed, { ...META, format: 'gherkin' })
    expect(output.testCases.length).toBeGreaterThan(0)
    // Gherkin cases should have gherkinSteps
    output.testCases.forEach(tc => expect(tc.gherkinSteps.length).toBeGreaterThan(0))
  })

  it('generates BVA for minimum 8 characters', () => {
    const parsed = parseUserStory(EN_STORY)
    const output = generateTestCases(parsed, META)
    const bva = output.testCases.filter(t => t.kind === 'bva')
    expect(bva.length).toBeGreaterThan(0)
  })
})

describe('Full pipeline integration (ES)', () => {
  const ES_STORY = `Como un usuario registrado,
Quiero iniciar sesión en el sistema,
Para que pueda acceder a mis datos personales.

Criterios de aceptación:
- El campo de correo electrónico es obligatorio
- La contraseña debe tener mínimo 8 caracteres
- El sistema debe mostrar mensaje de error cuando las credenciales son inválidas
- El usuario debe ser redirigido al panel principal tras iniciar sesión con éxito`

  it('detects Spanish', () => {
    const parsed = parseUserStory(ES_STORY)
    expect(parsed.language).toBe('es')
  })

  it('generates test cases in Spanish', () => {
    const parsed = parseUserStory(ES_STORY)
    const output = generateTestCases(parsed, META)
    expect(output.testCases.length).toBeGreaterThan(0)
  })

  it('generates positive and negative cases for Spanish story', () => {
    const parsed = parseUserStory(ES_STORY)
    const output = generateTestCases(parsed, META)
    const positives = output.testCases.filter(t => t.kind === 'positive')
    const negatives = output.testCases.filter(t => t.kind === 'negative')
    expect(positives.length).toBeGreaterThan(0)
    expect(negatives.length).toBeGreaterThan(0)
  })

  it('generates BVA for minimum 8 characters in Spanish', () => {
    const parsed = parseUserStory(ES_STORY)
    const output = generateTestCases(parsed, META)
    const bva = output.testCases.filter(t => t.kind === 'bva')
    expect(bva.length).toBeGreaterThan(0)
  })

  it('generates Gherkin cases in Spanish', () => {
    const parsed = parseUserStory(ES_STORY)
    const output = generateTestCases(parsed, { ...META, format: 'gherkin' })
    expect(output.testCases.length).toBeGreaterThan(0)
    output.testCases.forEach(tc => expect(tc.gherkinSteps.length).toBeGreaterThan(0))
  })
})

describe('Edge cases', () => {
  it('handles empty string gracefully', () => {
    const parsed = parseUserStory('')
    const output = generateTestCases(parsed, META)
    expect(output.testCases).toHaveLength(0)
  })

  it('handles plain freeform text (no standard format)', () => {
    const plain = 'O sistema deve permitir que usuários façam upload de arquivos PDF com tamanho máximo de 10MB'
    const parsed = parseUserStory(plain)
    const output = generateTestCases(parsed, META)
    // Should still attempt generation
    expect(output).toBeDefined()
  })

  it('handles Jira-formatted text', () => {
    const jira = `*Como um usuário*,\neu quero _fazer login_,\npara que eu [acesse o sistema|https://example.com].\n\n*Critérios de Aceite:*\n- [ ] E-mail deve ser obrigatório\n- [x] Senha mínima 6 caracteres`
    const parsed = parseUserStory(jira)
    expect(parsed.criteria.length).toBeGreaterThan(0)
  })
})
