import { describe, it, expect } from 'vitest'
import { detectLanguage } from '../../src/engine/parser/languageDetector'

describe('detectLanguage()', () => {
  it('detects Portuguese', () => {
    const text = 'Como um usuário, eu quero fazer login, para que eu acesse o sistema.'
    expect(detectLanguage(text)).toBe('pt-br')
  })

  it('detects English', () => {
    const text = 'As a user, I want to log in so that I can access the system.'
    expect(detectLanguage(text)).toBe('en')
  })

  it('detects PT-BR from acceptance criteria keywords', () => {
    const text = 'Critérios de Aceite:\n1. O sistema deve exibir mensagem de erro'
    expect(detectLanguage(text)).toBe('pt-br')
  })

  it('detects EN from acceptance criteria keywords', () => {
    const text = 'Acceptance Criteria:\n1. The system should display an error message'
    expect(detectLanguage(text)).toBe('en')
  })

  it('detects Spanish', () => {
    const text = 'Como un usuario, quiero iniciar sesión, para que pueda acceder al sistema.'
    expect(detectLanguage(text)).toBe('es')
  })

  it('detects Spanish from acceptance criteria keywords', () => {
    const text = 'Criterios de aceptación:\n1. El sistema debe mostrar un mensaje de error'
    expect(detectLanguage(text)).toBe('es')
  })

  it('defaults to pt-br on ambiguous text', () => {
    expect(detectLanguage('abc 123')).toBe('pt-br')
  })
})
