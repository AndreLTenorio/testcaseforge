import { describe, it, expect } from 'vitest'
import { splitSections, extractUserStoryParts } from '../../src/engine/parser/sectionSplitter'

const LOGIN_STORY = `Como um usuário,
Eu quero fazer login no sistema,
Para que eu possa acessar minha conta.

Critérios de Aceite:
1. O usuário deve informar e-mail e senha válidos
2. O sistema deve exibir mensagem de erro para credenciais inválidas
3. Usuário com 3 tentativas falhas deve ser bloqueado

Regras de Negócio:
- Sessão expira após 30 minutos de inatividade`

describe('splitSections()', () => {
  it('separates acceptance criteria', () => {
    const result = splitSections(LOGIN_STORY, 'pt-br')
    expect(result.acceptanceCriteria).toHaveLength(3)
    expect(result.acceptanceCriteria[0]).toContain('e-mail e senha válidos')
  })

  it('separates business rules', () => {
    const result = splitSections(LOGIN_STORY, 'pt-br')
    expect(result.businessRules).toHaveLength(1)
    expect(result.businessRules[0]).toContain('30 minutos')
  })

  it('extracts user story section', () => {
    const result = splitSections(LOGIN_STORY, 'pt-br')
    expect(result.userStory).toContain('Como um usuário')
  })

  it('handles English AC header', () => {
    const text = 'As a user, I want to login.\n\nAcceptance Criteria:\n- Email must be valid\n- Password is required'
    const result = splitSections(text, 'en')
    expect(result.acceptanceCriteria).toHaveLength(2)
  })

  it('handles AC: shorthand', () => {
    const text = 'Story text\n\nAC:\n- Must work\n- Must be fast'
    const result = splitSections(text, 'pt-br')
    expect(result.acceptanceCriteria).toHaveLength(2)
  })
})

describe('extractUserStoryParts()', () => {
  it('extracts persona', () => {
    const { persona } = extractUserStoryParts(LOGIN_STORY, 'pt-br')
    expect(persona).toBeTruthy()
    expect(persona?.toLowerCase()).toContain('usuário')
  })

  it('extracts action', () => {
    const { action } = extractUserStoryParts(LOGIN_STORY, 'pt-br')
    expect(action).toBeTruthy()
    expect(action?.toLowerCase()).toContain('login')
  })

  it('extracts benefit', () => {
    const { benefit } = extractUserStoryParts(LOGIN_STORY, 'pt-br')
    expect(benefit).toBeTruthy()
    expect(benefit?.toLowerCase()).toContain('conta')
  })

  it('handles English format', () => {
    const text = 'As a developer, I want to deploy the app, so that users can access it.'
    const { persona, action, benefit } = extractUserStoryParts(text, 'en')
    expect(persona?.toLowerCase()).toContain('developer')
    expect(action?.toLowerCase()).toContain('deploy')
    expect(benefit?.toLowerCase()).toContain('users')
  })
})
