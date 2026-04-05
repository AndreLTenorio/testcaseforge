// Patterns that suggest specific data types in the text

export const DATA_TYPE_PATTERNS = {
  number: [
    /\d+\s*(caracteres?|digitos?|digits?|characters?)/i,
    /m[íi]nimo\s+\d+/i,
    /m[áa]ximo\s+\d+/i,
    /minimum\s+\d+/i,
    /maximum\s+\d+/i,
    /entre\s+\d+\s+e\s+\d+/i,
    /between\s+\d+\s+and\s+\d+/i,
    /at\s+least\s+\d+/i,
    /at\s+most\s+\d+/i,
    /horas?\s+de\s+anteced[eê]ncia/i,
    /\d+h/i,
  ],
  email: [/e-?mail/i, /endere[cç]o\s+eletr[oô]nico/i],
  cpf: [/\bcpf\b/i],
  cnpj: [/\bcnpj\b/i],
  phone: [/telefone/i, /celular/i, /phone/i, /mobile/i],
  date: [/data/i, /date/i, /prazo/i, /deadline/i, /vencimento/i, /expir/i],
  file: [/arquivo/i, /file/i, /documento/i, /anexo/i, /attachment/i],
  boolean: [/ativar|desativar|habilitar|desabilitar|enable|disable|toggle/i],
  select: [/selecionar|escolher|opção|select|choose|option|dropdown/i],
  password: [/senha|password|passcode/i],
}

export const UI_ELEMENTS: Record<string, string[]> = {
  'pt-br': ['botão', 'campo', 'formulário', 'tela', 'página', 'modal', 'dropdown', 'checkbox', 'rádio', 'link', 'menu', 'tabela', 'lista', 'card', 'input', 'textarea', 'select', 'aba', 'tab'],
  'en': ['button', 'field', 'form', 'screen', 'page', 'modal', 'dropdown', 'checkbox', 'radio', 'link', 'menu', 'table', 'list', 'card', 'input', 'textarea', 'select', 'tab'],
}

export const BOUNDARY_KEYWORDS = {
  'pt-br': [/m[íi]nimo\s+(\d+)/i, /m[áa]ximo\s+(\d+)/i, /(\d+)\s+caracteres/i, /(\d+)\s+horas/i, /(\d+)\s+dias/i, /(\d+)\s+registros/i],
  'en': [/minimum\s+(\d+)/i, /maximum\s+(\d+)/i, /(\d+)\s+characters/i, /(\d+)\s+hours/i, /(\d+)\s+days/i, /(\d+)\s+records/i],
}

export function extractBoundaryValues(text: string): { min?: number; max?: number } {
  const result: { min?: number; max?: number } = {}
  const minMatch = text.match(/m[íi]nimo\s+(\d+)|minimum\s+(\d+)|at\s+least\s+(\d+)|pelo\s+menos\s+(\d+)/i)
  const maxMatch = text.match(/m[áa]ximo\s+(\d+)|maximum\s+(\d+)|at\s+most\s+(\d+)|no\s+m[áa]ximo\s+(\d+)/i)
  if (minMatch) result.min = parseInt(minMatch.slice(1).find(Boolean) ?? '0')
  if (maxMatch) result.max = parseInt(maxMatch.slice(1).find(Boolean) ?? '0')
  return result
}
