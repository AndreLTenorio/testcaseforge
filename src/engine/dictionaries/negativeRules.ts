import type { Language } from '../types'

export interface NegativeRule {
  triggers: string[]
  negationPtBr: (field?: string) => string
  negationEn: (field?: string) => string
  expectedResultPtBr: (field?: string) => string
  expectedResultEn: (field?: string) => string
}

export const NEGATIVE_RULES: NegativeRule[] = [
  {
    triggers: ['campo obrigatório', 'obrigatório', 'required', 'required field', 'não pode ser vazio', 'cannot be empty'],
    negationPtBr: (f) => `Deixar o campo ${f ?? '[campo]'} em branco`,
    negationEn: (f) => `Leave the ${f ?? '[field]'} field blank`,
    expectedResultPtBr: (f) => `Sistema exibe mensagem de campo ${f ?? ''} obrigatório`.trim(),
    expectedResultEn: (f) => `System displays required field message for ${f ?? '[field]'}`,
  },
  {
    triggers: ['formato válido', 'valid format', 'formato inválido', 'formato correto', 'formato de e-mail', 'email format', 'valid email'],
    negationPtBr: (f) => `Preencher o campo ${f ?? '[campo]'} com formato inválido`,
    negationEn: (f) => `Fill the ${f ?? '[field]'} field with an invalid format`,
    expectedResultPtBr: () => 'Sistema exibe mensagem de formato inválido',
    expectedResultEn: () => 'System displays invalid format message',
  },
  {
    triggers: ['mínimo', 'minimum', 'min ', 'pelo menos', 'at least', 'caracteres', 'characters'],
    negationPtBr: (f) => `Preencher ${f ?? 'o campo'} com valor abaixo do mínimo permitido`,
    negationEn: (f) => `Fill ${f ?? 'the field'} with a value below the minimum`,
    expectedResultPtBr: () => 'Sistema exibe mensagem de mínimo não atingido',
    expectedResultEn: () => 'System displays minimum not reached message',
  },
  {
    triggers: ['máximo', 'maximum', 'max ', 'no máximo', 'at most'],
    negationPtBr: (f) => `Preencher ${f ?? 'o campo'} com valor acima do máximo permitido`,
    negationEn: (f) => `Fill ${f ?? 'the field'} with a value above the maximum`,
    expectedResultPtBr: () => 'Sistema não permite inserir além do limite máximo',
    expectedResultEn: () => 'System does not allow input beyond the maximum limit',
  },
  {
    triggers: ['logado', 'autenticado', 'logged in', 'authenticated', 'login', 'sessão ativa'],
    negationPtBr: () => 'Acessar o sistema sem estar autenticado',
    negationEn: () => 'Access the system without being authenticated',
    expectedResultPtBr: () => 'Sistema redireciona para a tela de login',
    expectedResultEn: () => 'System redirects to the login page',
  },
  {
    triggers: ['permissão', 'permission', 'role', 'perfil', 'acesso', 'autorização'],
    negationPtBr: () => 'Acessar com usuário sem a permissão necessária',
    negationEn: () => 'Access with a user without the required permission',
    expectedResultPtBr: () => 'Sistema exibe mensagem de acesso negado',
    expectedResultEn: () => 'System displays access denied message',
  },
  {
    triggers: ['selecionar', 'select', 'escolher', 'choose', 'opção'],
    negationPtBr: () => 'Não selecionar nenhuma opção',
    negationEn: () => 'Not select any option',
    expectedResultPtBr: () => 'Sistema exibe mensagem de seleção obrigatória',
    expectedResultEn: () => 'System displays mandatory selection message',
  },
  {
    triggers: ['cpf', 'cnpj', 'e-mail', 'email', 'telefone', 'phone', 'cep', 'zip code'],
    negationPtBr: (f) => `Preencher ${f ?? 'o campo'} com valor inválido`,
    negationEn: (f) => `Fill ${f ?? 'the field'} with an invalid value`,
    expectedResultPtBr: (f) => `Sistema exibe mensagem de ${f ?? 'campo'} inválido`,
    expectedResultEn: (f) => `System displays invalid ${f ?? 'field'} message`,
  },
  {
    triggers: ['data', 'date', 'prazo', 'deadline', 'vencimento'],
    negationPtBr: () => 'Informar data inválida ou fora do intervalo permitido',
    negationEn: () => 'Enter an invalid date or one outside the allowed range',
    expectedResultPtBr: () => 'Sistema exibe mensagem de data inválida',
    expectedResultEn: () => 'System displays invalid date message',
  },
  {
    triggers: ['upload', 'arquivo', 'file', 'anexo', 'attachment', 'documento'],
    negationPtBr: () => 'Enviar arquivo com formato não suportado ou tamanho excedido',
    negationEn: () => 'Upload a file with unsupported format or exceeding size limit',
    expectedResultPtBr: () => 'Sistema rejeita o arquivo e exibe mensagem de erro',
    expectedResultEn: () => 'System rejects the file and displays an error message',
  },
]

export function findMatchingRules(text: string, _lang: Language): NegativeRule[] {
  const lower = text.toLowerCase()
  return NEGATIVE_RULES.filter(rule =>
    rule.triggers.some(t => lower.includes(t.toLowerCase()))
  )
}
