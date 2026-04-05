import { describe, it, expect } from 'vitest'
import { sanitize } from '../../src/engine/parser/sanitizer'

describe('sanitize()', () => {
  it('removes Jira bold markers', () => {
    expect(sanitize('*texto em negrito*')).toBe('texto em negrito')
  })

  it('removes Jira italic markers', () => {
    expect(sanitize('_texto em itálico_')).toBe('texto em itálico')
  })

  it('removes Jira link syntax', () => {
    expect(sanitize('[Google|https://google.com]')).toBe('Google')
  })

  it('removes Jira code blocks', () => {
    const input = '{code:java}\nint x = 1;\n{code}'
    expect(sanitize(input)).not.toContain('{code')
    expect(sanitize(input)).not.toContain('int x = 1')
  })

  it('normalizes Windows line endings', () => {
    expect(sanitize('linha1\r\nlinha2')).toBe('linha1\nlinha2')
  })

  it('collapses excess blank lines', () => {
    const result = sanitize('a\n\n\n\n\nb')
    expect(result).toBe('a\n\nb')
  })

  it('normalizes checkbox items', () => {
    const result = sanitize('- [ ] Critério 1\n- [x] Critério 2')
    expect(result).toBe('- Critério 1\n- Critério 2')
  })

  it('removes HTML tags', () => {
    expect(sanitize('<strong>bold</strong>')).toBe('bold')
  })

  it('trims leading/trailing whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello')
  })
})
