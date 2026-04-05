import type { Language } from '../types'

const PT_BR_KEYWORDS = [
  'como', 'eu quero', 'para que', 'critérios de aceite', 'critérios',
  'aceite', 'regras de negócio', 'dado que', 'quando', 'então',
  'deve', 'deveria', 'sistema', 'usuário', 'tela', 'botão', 'campo',
  'preencher', 'selecionar', 'enviar', 'confirmar', 'salvar',
]

const EN_KEYWORDS = [
  'as a', 'i want', 'so that', 'acceptance criteria', 'given',
  'when', 'then', 'should', 'must', 'system', 'user', 'screen',
  'button', 'field', 'fill', 'select', 'submit', 'confirm', 'save',
]

const ES_KEYWORDS = [
  'como un', 'como una', 'quiero', 'para que', 'criterios de aceptación',
  'criterios de aceptacion', 'dado que', 'cuando', 'entonces',
  'debe', 'debería', 'sistema', 'usuario', 'pantalla', 'botón', 'campo',
  'rellenar', 'seleccionar', 'enviar', 'confirmar', 'guardar', 'iniciar sesión',
]

export function detectLanguage(text: string): Language {
  const lower = text.toLowerCase()
  let ptScore = 0
  let enScore = 0
  let esScore = 0

  for (const kw of PT_BR_KEYWORDS) if (lower.includes(kw)) ptScore++
  for (const kw of EN_KEYWORDS)    if (lower.includes(kw)) enScore++
  for (const kw of ES_KEYWORDS)    if (lower.includes(kw)) esScore++

  // Tiebreaker: PT-BR specific chars
  if (/[ãõç]/.test(lower)) ptScore += 2

  const max = Math.max(ptScore, enScore, esScore)
  if (max === esScore && esScore > 0) return 'es'
  if (max === enScore && enScore > ptScore) return 'en'
  return 'pt-br'
}
