/**
 * TestCaseForge — Chrome Extension Service Worker (background.js)
 *
 * Self-contained bundle of the TestCaseForge engine.
 * Receives GENERATE messages from content.js, runs the parser + generator
 * pipeline, and returns structured test cases.
 *
 * No external imports — pure vanilla JS compatible with MV3 service workers.
 */

'use strict'

// ── i18n ─────────────────────────────────────────────────────────────────────

const LABELS = {
  accessFeature:        { 'pt-br': 'Acessar a funcionalidade',                                      'en': 'Access the feature',                                       'es': 'Acceder a la funcionalidad' },
  screenDisplayed:      { 'pt-br': 'Tela/funcionalidade é exibida corretamente',                    'en': 'Screen/feature is displayed correctly',                     'es': 'Pantalla/funcionalidad se muestra correctamente' },
  validDataFor:         { 'pt-br': 'Dado válido para',                                              'en': 'Valid data for',                                           'es': 'Dato válido para' },
  actionSuccess:        { 'pt-br': 'Ação executada com sucesso',                                    'en': 'Action executed successfully',                             'es': 'Acción ejecutada con éxito' },
  expectedPerCriterion: { 'pt-br': 'Resultado esperado conforme critério',                          'en': 'Expected result as per criterion',                         'es': 'Resultado esperado según criterio' },
  executeAction:        { 'pt-br': 'Executar a ação descrita no critério',                          'en': 'Execute the action described in the criterion',            'es': 'Ejecutar la acción descrita en el criterio' },
  invalidData:          { 'pt-br': 'Dado inválido ou ausente',                                      'en': 'Invalid or missing data',                                  'es': 'Dato inválido o ausente' },
  noPrecondition:       { 'pt-br': 'Nenhuma pré-condição específica',                               'en': 'No specific precondition',                                 'es': 'Sin precondición específica' },
  successSuffix:        { 'pt-br': 'com sucesso',                                                   'en': 'successfully',                                             'es': 'con éxito' },
  happyPath:            { 'pt-br': '(happy path)',                                                  'en': '(happy path)',                                             'es': '(flujo positivo)' },
  screenIsDisplayed:    { 'pt-br': 'Tela é exibida',                                                'en': 'Screen is displayed',                                      'es': 'Pantalla se muestra' },
  systemAccepts:        { 'pt-br': 'Sistema aceita o valor',                                        'en': 'System accepts the value',                                 'es': 'El sistema acepta el valor' },
  systemRejects:        { 'pt-br': 'Sistema rejeita o valor e exibe mensagem de erro',              'en': 'System rejects value and displays error message',          'es': 'El sistema rechaza el valor y muestra mensaje de error' },
  fillWithBoundary:     { 'pt-br': 'Preencher',                                                     'en': 'Fill',                                                     'es': 'Rellenar' },
  fillAboveMax:         { 'pt-br': 'com valor acima do limite',                                     'en': 'with value above maximum',                                 'es': 'con valor sobre el límite' },
  operationSuccess:     { 'pt-br': 'Operação realizada com sucesso',                                'en': 'Operation completed successfully',                         'es': 'Operación completada con éxito' },
  minBoundaryTitle:     { 'pt-br': 'Valor no limite mínimo',                                        'en': 'Value at minimum boundary',                                'es': 'Valor en el límite mínimo' },
  maxBoundaryTitle:     { 'pt-br': 'Valor acima do limite máximo',                                  'en': 'Value above maximum boundary',                             'es': 'Valor sobre el límite máximo' },
  userAccessesSystem:   { 'pt-br': 'o usuário acessa o sistema',                                    'en': 'the user accesses the system',                             'es': 'el usuario accede al sistema' },
  userPerformsAction:   { 'pt-br': 'o usuário executa a ação',                                      'en': 'the user performs the action',                             'es': 'el usuario ejecuta la acción' },
  systemProcesses:      { 'pt-br': 'o sistema processa a ação com sucesso',                         'en': 'the system processes the action successfully',             'es': 'el sistema procesa la acción con éxito' },
  userTriesInvalid:     { 'pt-br': 'o usuário tenta realizar a ação com dados inválidos ou incompletos', 'en': 'the user tries to perform the action with invalid or incomplete data', 'es': 'el usuario intenta realizar la acción con datos inválidos o incompletos' },
  systemShowsError:     { 'pt-br': 'o sistema exibe mensagem de erro adequada',                     'en': 'the system displays an appropriate error message',         'es': 'el sistema muestra un mensaje de error apropiado' },
  tryWithInvalidData:   { 'pt-br': 'Tentar realizar ação com dados inválidos',                      'en': 'Try to perform action with invalid data',                  'es': 'Intentar realizar acción con datos inválidos' },
  invalidDataNegation:  { 'pt-br': 'Preencher dados com valores inválidos ou incompletos',          'en': 'Fill data with invalid or incomplete values',              'es': 'Rellenar datos con valores inválidos o incompletos' },
  invalidDataExpected:  { 'pt-br': 'Sistema exibe mensagem de erro adequada',                       'en': 'System displays appropriate error message',                'es': 'El sistema muestra un mensaje de error apropiado' },
}

function t(key, lang) {
  return LABELS[key]?.[lang] ?? LABELS[key]?.['en'] ?? key
}

// ── Sanitizer ─────────────────────────────────────────────────────────────────

function sanitize(raw) {
  let text = raw

  // Normalize checkbox markdown FIRST
  text = text.replace(/^\s*[-*•]\s*\[[ xX]?\]\s*/gm, '- ')

  // Remove Jira formatting
  text = text.replace(/\{\{.*?\}\}/g, '')
  text = text.replace(/\{code.*?\}[\s\S]*?\{code\}/gi, '')
  text = text.replace(/\{noformat\}[\s\S]*?\{noformat\}/gi, '')
  text = text.replace(/\[([^\]|]+)\|[^\]]+\]/g, '$1')
  text = text.replace(/\[([^\]]+)\]/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/_([^_]+)_/g, '$1')
  text = text.replace(/\+([^+]+)\+/g, '$1')
  text = text.replace(/-([^-\n\r]+)-/g, '$1')
  text = text.replace(/\^([^^]+)\^/g, '$1')
  text = text.replace(/~([^~]+)~/g, '$1')
  text = text.replace(/\{color:[^}]+\}/gi, '')
  text = text.replace(/\{color\}/gi, '')
  text = text.replace(/<[^>]+>/g, '')

  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  text = text.split('\n').map(l => l.trimEnd()).join('\n')
  text = text.replace(/\n{3,}/g, '\n\n')

  return text.trim()
}

// ── Language Detector ─────────────────────────────────────────────────────────

const PT_BR_KEYWORDS = ['como', 'eu quero', 'para que', 'critérios de aceite', 'critérios', 'aceite', 'regras de negócio', 'dado que', 'quando', 'então', 'deve', 'deveria', 'sistema', 'usuário', 'tela', 'botão', 'campo', 'preencher', 'selecionar', 'enviar', 'confirmar', 'salvar']
const EN_KEYWORDS    = ['as a', 'i want', 'so that', 'acceptance criteria', 'given', 'when', 'then', 'should', 'must', 'system', 'user', 'screen', 'button', 'field', 'fill', 'select', 'submit', 'confirm', 'save']
const ES_KEYWORDS    = ['como un', 'como una', 'quiero', 'para que', 'criterios de aceptación', 'criterios de aceptacion', 'dado que', 'cuando', 'entonces', 'debe', 'debería', 'sistema', 'usuario', 'pantalla', 'botón', 'campo', 'rellenar', 'seleccionar', 'enviar', 'confirmar', 'guardar', 'iniciar sesión']

function detectLanguage(text) {
  const lower = text.toLowerCase()
  let ptScore = 0, enScore = 0, esScore = 0

  for (const kw of PT_BR_KEYWORDS) if (lower.includes(kw)) ptScore++
  for (const kw of EN_KEYWORDS)    if (lower.includes(kw)) enScore++
  for (const kw of ES_KEYWORDS)    if (lower.includes(kw)) esScore++

  if (/[ãõç]/.test(lower)) ptScore += 2

  const max = Math.max(ptScore, enScore, esScore)
  if (max === esScore && esScore > 0) return 'es'
  if (max === enScore && enScore > ptScore) return 'en'
  return 'pt-br'
}

// ── Section Splitter ──────────────────────────────────────────────────────────

const SECTION_HEADERS = {
  'es': {
    ac:    [/criterios?\s+de\s+aceptaci[oó]n\s*:?/i, /\bac\b\s*:/i, /criterios?\s*:/i],
    br:    [/reglas?\s+de\s+negocio\s*:?/i, /\brn\b\s*:/i],
    notes: [/observaciones?\s*:?/i, /notas?\s*:?/i, /importante\s*:?/i, /atenci[oó]n\s*:?/i],
  },
  'pt-br': {
    ac:    [/critérios?\s+de\s+aceite\s*:?/i, /crit[eé]rios?\s+de\s+aceitação\s*:?/i, /acceptance\s+criteria\s*:?/i, /\bac\b\s*:/i, /\bca\b\s*:/i, /critérios?\s*:/i],
    br:    [/regras?\s+de\s+neg[oó]cio\s*:?/i, /business\s+rules?\s*:?/i, /\brn\b\s*:/i, /\bbr\b\s*:/i],
    notes: [/observa[çc][õo]es?\s*:?/i, /notas?\s*:?/i, /notes?\s*:?/i, /aten[çc][ãa]o\s*:?/i, /importante\s*:?/i],
  },
  'en': {
    ac:    [/acceptance\s+criteria\s*:?/i, /\bac\b\s*:/i],
    br:    [/business\s+rules?\s*:?/i, /\bbr\b\s*:/i],
    notes: [/notes?\s*:?/i, /observations?\s*:?/i, /important\s*:?/i, /attention\s*:?/i],
  },
}

function identifySection(line, lang) {
  const headers = SECTION_HEADERS[lang]
  if (headers.ac.some(r => r.test(line)))    return 'ac'
  if (headers.br.some(r => r.test(line)))    return 'br'
  if (headers.notes.some(r => r.test(line))) return 'notes'
  return null
}

function extractListItems(text) {
  return text.split('\n')
    .map(l => l.replace(/^[-*•]\s+|^\d+\.\s+/, '').trim())
    .filter(l => l.length > 0)
}

function splitSections(text, lang) {
  const lines = text.split('\n')
  const sections = { userStory: '', acceptanceCriteria: [], businessRules: [], notes: [] }
  let currentSection = 'userStory'
  const buckets = { userStory: [], ac: [], br: [], notes: [] }

  for (const line of lines) {
    const sectionType = identifySection(line.trim(), lang)
    if (sectionType) { currentSection = sectionType; continue }
    buckets[currentSection].push(line)
  }

  sections.userStory = buckets.userStory.join('\n').trim()
  sections.acceptanceCriteria = extractListItems(buckets.ac.join('\n'))
  sections.businessRules = extractListItems(buckets.br.join('\n'))
  sections.notes = extractListItems(buckets.notes.join('\n'))

  // Fallback: extract bullet lists from userStory as AC
  if (sections.acceptanceCriteria.length === 0 && sections.userStory) {
    const storyLines = sections.userStory.split('\n')
    const bulletItems = storyLines.filter(l => /^[-*•]\s+|\d+\.\s+/.test(l.trim()))
    if (bulletItems.length > 0) {
      sections.acceptanceCriteria = bulletItems.map(l => l.replace(/^[-*•]\s+|\d+\.\s+/, '').trim())
      sections.userStory = storyLines.filter(l => !/^[-*•]\s+|\d+\.\s+/.test(l.trim())).join('\n').trim()
    }
  }

  return sections
}

// ── Dictionaries ──────────────────────────────────────────────────────────────

const ACTION_VERBS = {
  'es': {
    navigation:     ['acceder', 'navegar', 'abrir', 'ir a', 'visitar', 'entrar en', 'entrar al', 'dirigirse a'],
    input:          ['rellenar', 'escribir', 'ingresar', 'introducir', 'digitar', 'proporcionar', 'indicar'],
    selection:      ['seleccionar', 'elegir', 'marcar', 'desmarcar', 'hacer clic en', 'optar por', 'pulsar'],
    submission:     ['enviar', 'guardar', 'confirmar', 'finalizar', 'completar', 'registrar', 'tramitar'],
    validation:     ['validar', 'verificar', 'comprobar', 'revisar', 'asegurarse', 'confirmar'],
    visualization:  ['visualizar', 'mostrar', 'ver', 'listar', 'cargar', 'consultar', 'presentar'],
    deletion:       ['eliminar', 'borrar', 'suprimir', 'cancelar', 'limpiar', 'remover'],
    edition:        ['editar', 'modificar', 'actualizar', 'cambiar', 'corregir', 'alterar'],
    authentication: ['iniciar sesión', 'autenticarse', 'cerrar sesión', 'loguearse', 'desconectarse'],
    search:         ['buscar', 'filtrar', 'consultar', 'encontrar', 'localizar'],
    upload:         ['subir archivo', 'adjuntar', 'cargar archivo', 'importar'],
    state:          ['activar', 'desactivar', 'habilitar', 'deshabilitar', 'bloquear', 'desbloquear', 'aprobar', 'rechazar', 'aceptar', 'denegar', 'suspender'],
  },
  'pt-br': {
    navigation:     ['acessar', 'navegar', 'abrir', 'ir para', 'visitar', 'entrar em', 'entrar na', 'entrar no', 'ir até'],
    input:          ['preencher', 'digitar', 'inserir', 'informar', 'escrever', 'inputar', 'colocar', 'fornecer'],
    selection:      ['selecionar', 'escolher', 'marcar', 'desmarcar', 'clicar em', 'optar por', 'clicar no', 'clicar na'],
    submission:     ['enviar', 'submeter', 'salvar', 'confirmar', 'concluir', 'finalizar', 'cadastrar', 'registrar'],
    validation:     ['validar', 'verificar', 'checar', 'conferir', 'assegurar', 'garantir'],
    visualization:  ['visualizar', 'exibir', 'mostrar', 'apresentar', 'listar', 'carregar', 'ver', 'consultar'],
    deletion:       ['excluir', 'remover', 'deletar', 'apagar', 'cancelar', 'limpar'],
    edition:        ['editar', 'alterar', 'modificar', 'atualizar', 'mudar', 'corrigir'],
    authentication: ['logar', 'autenticar', 'fazer login', 'entrar', 'sair', 'fazer logout', 'deslogar', 'efetuar login'],
    search:         ['buscar', 'pesquisar', 'filtrar', 'procurar', 'consultar', 'localizar'],
    upload:         ['enviar arquivo', 'anexar', 'fazer upload', 'carregar arquivo', 'importar'],
    state:          ['ativar', 'desativar', 'habilitar', 'desabilitar', 'bloquear', 'desbloquear', 'aprovar', 'reprovar', 'rejeitar', 'aceitar', 'negar', 'suspender'],
  },
  'en': {
    navigation:     ['access', 'navigate', 'open', 'go to', 'visit', 'enter', 'browse to'],
    input:          ['fill', 'type', 'enter', 'input', 'write', 'provide', 'supply'],
    selection:      ['select', 'choose', 'check', 'uncheck', 'click on', 'pick', 'toggle', 'click the', 'click'],
    submission:     ['submit', 'save', 'confirm', 'complete', 'finish', 'register', 'send'],
    validation:     ['validate', 'verify', 'check', 'ensure', 'assert', 'confirm'],
    visualization:  ['view', 'display', 'show', 'present', 'list', 'load', 'see'],
    deletion:       ['delete', 'remove', 'erase', 'cancel', 'clear'],
    edition:        ['edit', 'change', 'modify', 'update', 'alter'],
    authentication: ['log in', 'sign in', 'authenticate', 'log out', 'sign out', 'login'],
    search:         ['search', 'find', 'filter', 'look up', 'query', 'locate'],
    upload:         ['upload', 'attach', 'send file', 'import'],
    state:          ['activate', 'deactivate', 'enable', 'disable', 'block', 'unblock', 'approve', 'reject', 'deny', 'accept', 'suspend'],
  },
}

const EXPECTED_RESULT_MARKERS = {
  'es':    ['debe', 'debería', 'deberá', 'se espera', 'es esperado', 'el sistema muestra', 'el sistema presenta', 'el sistema redirige', 'mensaje de', 'pantalla de', 'se muestra', 'se presenta', 'el usuario es redirigido', 'no debe', 'no puede', 'no permite', 'impide', 'bloquea'],
  'pt-br': ['deve', 'deveria', 'deverá', 'espera-se', 'é esperado', 'sistema exibe', 'sistema apresenta', 'sistema redireciona', 'mensagem de', 'tela de', 'é exibido', 'é apresentado', 'o usuário é redirecionado', 'não deve', 'não pode', 'não permite', 'impede', 'é bloqueado'],
  'en':    ['should', 'shall', 'must', 'is expected', 'will be', 'system displays', 'system shows', 'system redirects', 'message of', 'screen of', 'is displayed', 'is shown', 'user is redirected', 'should not', 'cannot', 'must not', 'prevents', 'does not allow'],
}

function containsExpectedMarker(text, lang) {
  const lower = text.toLowerCase()
  return EXPECTED_RESULT_MARKERS[lang].some(m => lower.includes(m))
}

const DATA_TYPE_PATTERNS = {
  number:   [/\d+\s*(caracteres?|digitos?|digits?|characters?)/i, /m[íi]nimo\s+\d+/i, /m[áa]ximo\s+\d+/i, /minimum\s+\d+/i, /maximum\s+\d+/i, /entre\s+\d+\s+e\s+\d+/i, /between\s+\d+\s+and\s+\d+/i, /at\s+least\s+\d+/i, /at\s+most\s+\d+/i],
  email:    [/e-?mail/i, /endere[cç]o\s+eletr[oô]nico/i],
  cpf:      [/\bcpf\b/i],
  cnpj:     [/\bcnpj\b/i],
  phone:    [/telefone/i, /celular/i, /phone/i, /mobile/i],
  date:     [/data/i, /date/i, /prazo/i, /deadline/i, /vencimento/i, /expir/i],
  file:     [/arquivo/i, /file/i, /documento/i, /anexo/i, /attachment/i],
  boolean:  [/ativar|desativar|habilitar|desabilitar|enable|disable|toggle/i],
  select:   [/selecionar|escolher|opção|select|choose|option|dropdown/i],
  password: [/senha|password|passcode/i],
}

function extractBoundaryValues(text) {
  const result = {}
  const minMatch = text.match(/m[íi]nimo\s+(\d+)|minimum\s+(\d+)|at\s+least\s+(\d+)|pelo\s+menos\s+(\d+)/i)
  const maxMatch = text.match(/m[áa]ximo\s+(\d+)|maximum\s+(\d+)|at\s+most\s+(\d+)|no\s+m[áa]ximo\s+(\d+)/i)
  if (minMatch) result.min = parseInt(minMatch.slice(1).find(Boolean) ?? '0')
  if (maxMatch) result.max = parseInt(maxMatch.slice(1).find(Boolean) ?? '0')
  return result
}

// ── Criteria Extractor ────────────────────────────────────────────────────────

function capitalize(s) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function extractActions(text, lang) {
  const actions = []
  const verbMap = ACTION_VERBS[lang]
  const allVerbs = Object.values(verbMap).flat().sort((a, b) => b.length - a.length)

  const sentences = text.split(/[,;]|\s+e\s+|\s+and\s+/i)
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase().trim()
    for (const verb of allVerbs) {
      if (lower.startsWith(verb) || lower.includes(` ${verb} `)) {
        const rest = lower.replace(verb, '').trim()
        const target = rest.replace(/^(o|a|os|as|the|um|uma)\s+/i, '').trim() || sentence.trim()
        actions.push({ verb: capitalize(verb), target: capitalize(target) })
        break
      }
    }
  }

  if (actions.length === 0 && text.trim().length > 3) {
    actions.push({ verb: 'Realizar', target: capitalize(text.trim()) })
  }

  return actions
}

function extractPreconditions(text, lang) {
  const preconditions = []
  const lower = text.toLowerCase()

  const precondPatterns = lang === 'pt-br'
    ? [/dado\s+que\s+(.+?)(?:[,;\n]|$)/gi, /(?:^|\n)\s*(?:pré-condição|pré-condições|precondição)\s*:?\s*(.+)/gi]
    : [/given\s+(?:that\s+)?(.+?)(?:[,;\n]|$)/gi, /(?:^|\n)\s*precondition\s*:?\s*(.+)/gi]

  for (const pattern of precondPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      preconditions.push(capitalize(match[1].trim()))
    }
  }

  if (lang === 'pt-br') {
    if (lower.includes('logado') || lower.includes('autenticado')) {
      if (!preconditions.some(p => p.toLowerCase().includes('logado'))) {
        preconditions.push('Usuário está logado no sistema')
      }
    }
  } else {
    if (lower.includes('logged in') || lower.includes('authenticated')) {
      if (!preconditions.some(p => p.toLowerCase().includes('logged'))) {
        preconditions.push('User is logged in to the system')
      }
    }
  }

  return preconditions
}

function extractDataElements(text) {
  const elements = []
  const lower = text.toLowerCase()

  for (const [type, patterns] of Object.entries(DATA_TYPE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        const boundaries = extractBoundaryValues(text)
        const existing = elements.find(e => e.type === type)
        if (!existing) {
          const el = { name: type, type }
          if (boundaries.min !== undefined || boundaries.max !== undefined) {
            el.constraints = boundaries
            const bva = []
            if (boundaries.min !== undefined) bva.push(`${boundaries.min - 1}`, `${boundaries.min}`, `${boundaries.min + 1}`)
            if (boundaries.max !== undefined) bva.push(`${boundaries.max - 1}`, `${boundaries.max}`, `${boundaries.max + 1}`)
            el.boundaryValues = [...new Set(bva)]
          }
          elements.push(el)
        }
        break
      }
    }
  }

  return elements
}

function extractExpectedResults(text, lang) {
  const results = []
  const sentences = text.split(/[.!]/).map(s => s.trim()).filter(Boolean)

  for (const sentence of sentences) {
    if (containsExpectedMarker(sentence, lang)) {
      results.push(capitalize(sentence))
    }
  }

  if (results.length === 0) {
    const meaningful = sentences.filter(s => s.length > 10)
    if (meaningful.length > 0) {
      results.push(capitalize(meaningful[meaningful.length - 1]))
    }
  }

  return results
}

function isNegatable(text) {
  const patterns = [
    /obrigat[oó]rio/i, /required/i, /formato/i, /format/i,
    /mínimo|máximo|minimum|maximum/i, /logado|authenticated/i,
    /permissão|permission/i, /selecionar|select/i,
    /cpf|cnpj|email|e-mail|telefone/i, /data|date/i,
    /upload|arquivo|file/i, /senha|password/i,
  ]
  return patterns.some(p => p.test(text))
}

function extractCriteria(criteriaTexts, lang) {
  let counter = 0
  return criteriaTexts
    .filter(text => text.trim().length > 0)
    .map((rawText) => {
      counter++
      return {
        id: `AC-${String(counter).padStart(3, '0')}`,
        rawText,
        preconditions: extractPreconditions(rawText, lang),
        actions: extractActions(rawText, lang),
        expectedResults: extractExpectedResults(rawText, lang),
        dataElements: extractDataElements(rawText),
        negatable: isNegatable(rawText),
        stateTransitions: [],
      }
    })
}

// ── Procedural Generator ──────────────────────────────────────────────────────

let tcCounter = 0

function buildPositiveSteps(criterion, lang) {
  const steps = []
  steps.push({ number: 1, action: t('accessFeature', lang), data: '—', expectedResult: t('screenDisplayed', lang) })

  criterion.actions.forEach((action, idx) => {
    const el = criterion.dataElements[idx]
    const dataHint = el ? `${t('validDataFor', lang)} ${el.name}` : '—'
    steps.push({
      number: steps.length + 1,
      action: `${action.verb} ${action.target}`,
      data: dataHint,
      expectedResult: idx === criterion.actions.length - 1
        ? (criterion.expectedResults[0] ?? t('actionSuccess', lang))
        : '—',
    })
  })

  if (criterion.actions.length === 0) {
    steps.push({
      number: steps.length + 1,
      action: t('executeAction', lang),
      data: '—',
      expectedResult: criterion.expectedResults[0] ?? t('expectedPerCriterion', lang),
    })
  }

  return steps
}

function buildNegativeSteps(criterion, lang, negationDesc, expectedErr) {
  const steps = []
  steps.push({ number: 1, action: t('accessFeature', lang), data: '—', expectedResult: t('screenDisplayed', lang) })

  const positiveSteps = buildPositiveSteps(criterion, lang).slice(1, -1)
  for (const s of positiveSteps) steps.push({ ...s, number: steps.length + 1 })

  steps.push({ number: steps.length + 1, action: negationDesc, data: t('invalidData', lang), expectedResult: expectedErr })
  return steps
}

function buildPositiveTitle(criterion, lang) {
  const firstAction = criterion.actions[0]
  if (firstAction) {
    return `${firstAction.verb} ${firstAction.target} ${t('successSuffix', lang)}`
  }
  return `${criterion.rawText.slice(0, 60).replace(/[\n\r]/g, ' ')} ${t('happyPath', lang)}`
}

function deriveNegativeRules(criterion, lang) {
  const lower = criterion.rawText.toLowerCase()

  const ptChecks = [
    { triggers: ['obrigatório', 'obrigatorio', 'required'], title: 'Tentar prosseguir sem preencher campo obrigatório', negation: 'Deixar campo obrigatório em branco', expected: 'Sistema exibe mensagem de campo obrigatório' },
    { triggers: ['e-mail', 'email'], title: 'Preencher e-mail com formato inválido', negation: 'Preencher campo de e-mail com valor sem @ ou domínio', expected: 'Sistema exibe mensagem de e-mail inválido' },
    { triggers: ['senha', 'password'], title: 'Preencher senha com valor inválido', negation: 'Preencher campo de senha com valor que não atende aos requisitos', expected: 'Sistema exibe mensagem de senha inválida' },
    { triggers: ['logado', 'autenticado', 'login'], title: 'Acessar sem estar autenticado', negation: 'Acessar a funcionalidade sem estar logado no sistema', expected: 'Sistema redireciona para a tela de login' },
    { triggers: ['permissão', 'perfil', 'role'], title: 'Acessar com usuário sem permissão', negation: 'Acessar com usuário que não possui permissão', expected: 'Sistema exibe mensagem de acesso negado' },
    { triggers: ['cpf'], title: 'Preencher CPF com valor inválido', negation: 'Preencher campo CPF com número inválido (ex: 000.000.000-00)', expected: 'Sistema exibe mensagem de CPF inválido' },
    { triggers: ['cnpj'], title: 'Preencher CNPJ com valor inválido', negation: 'Preencher campo CNPJ com número inválido', expected: 'Sistema exibe mensagem de CNPJ inválido' },
    { triggers: ['selecionar', 'selecione', 'escolher'], title: 'Tentar prosseguir sem selecionar opção', negation: 'Não selecionar nenhuma opção e tentar prosseguir', expected: 'Sistema exibe mensagem de seleção obrigatória' },
    { triggers: ['data'], title: 'Informar data inválida', negation: 'Informar data em formato inválido ou fora do intervalo', expected: 'Sistema exibe mensagem de data inválida' },
    { triggers: ['arquivo', 'upload', 'anexo'], title: 'Enviar arquivo com formato inválido', negation: 'Tentar enviar arquivo com extensão não suportada ou tamanho excedido', expected: 'Sistema rejeita o arquivo e exibe mensagem de erro' },
  ]

  const enChecks = [
    { triggers: ['required', 'mandatory'], title: 'Try to proceed without filling required field', negation: 'Leave required field blank', expected: 'System displays required field message' },
    { triggers: ['email', 'e-mail'], title: 'Fill email with invalid format', negation: 'Fill email field with value without @ or domain', expected: 'System displays invalid email message' },
    { triggers: ['password'], title: 'Fill password with invalid value', negation: 'Fill password field with value not meeting requirements', expected: 'System displays invalid password message' },
    { triggers: ['logged', 'authenticated', 'login'], title: 'Access without being authenticated', negation: 'Access the feature without being logged in', expected: 'System redirects to login page' },
    { triggers: ['permission', 'role'], title: 'Access with unauthorized user', negation: 'Access with a user without required permission', expected: 'System displays access denied message' },
    { triggers: ['select', 'choose'], title: 'Try to proceed without selecting option', negation: 'Do not select any option and try to proceed', expected: 'System displays mandatory selection message' },
    { triggers: ['date'], title: 'Enter invalid date', negation: 'Enter date in invalid format or outside allowed range', expected: 'System displays invalid date message' },
    { triggers: ['file', 'upload', 'attachment'], title: 'Upload file with invalid format', negation: 'Try to upload file with unsupported extension or exceeding size', expected: 'System rejects file and displays error message' },
  ]

  const esChecks = [
    { triggers: ['obligatorio', 'requerido', 'required'], title: 'Intentar continuar sin rellenar campo obligatorio', negation: 'Dejar el campo obligatorio vacío', expected: 'El sistema muestra mensaje de campo obligatorio' },
    { triggers: ['correo', 'email', 'e-mail'], title: 'Rellenar correo con formato inválido', negation: 'Rellenar el campo de correo sin @ o dominio', expected: 'El sistema muestra mensaje de correo inválido' },
    { triggers: ['contraseña', 'password'], title: 'Rellenar contraseña con valor inválido', negation: 'Rellenar contraseña con valor que no cumple los requisitos', expected: 'El sistema muestra mensaje de contraseña inválida' },
    { triggers: ['sesión', 'autenticado', 'logueado', 'login'], title: 'Acceder sin estar autenticado', negation: 'Acceder a la funcionalidad sin haber iniciado sesión', expected: 'El sistema redirige a la pantalla de inicio de sesión' },
    { triggers: ['permiso', 'rol', 'perfil'], title: 'Acceder con usuario sin permiso', negation: 'Acceder con usuario que no tiene el permiso requerido', expected: 'El sistema muestra mensaje de acceso denegado' },
    { triggers: ['seleccionar', 'elegir', 'opción'], title: 'Intentar continuar sin seleccionar opción', negation: 'No seleccionar ninguna opción e intentar continuar', expected: 'El sistema muestra mensaje de selección obligatoria' },
    { triggers: ['fecha'], title: 'Ingresar fecha inválida', negation: 'Ingresar fecha con formato inválido o fuera del rango permitido', expected: 'El sistema muestra mensaje de fecha inválida' },
    { triggers: ['archivo', 'adjunto'], title: 'Subir archivo con formato inválido', negation: 'Intentar subir archivo con extensión no soportada o tamaño excedido', expected: 'El sistema rechaza el archivo y muestra mensaje de error' },
  ]

  const checks = lang === 'pt-br' ? ptChecks : lang === 'es' ? esChecks : enChecks
  const rules = checks.filter(c => c.triggers.some(trigger => lower.includes(trigger)))
    .map(c => ({ title: c.title, negation: c.negation, expectedResult: c.expected }))

  if (rules.length === 0) {
    rules.push({ title: t('tryWithInvalidData', lang), negation: t('invalidDataNegation', lang), expectedResult: t('invalidDataExpected', lang) })
  }

  return rules
}

function generateBVACases(criterion, lang) {
  const cases = []
  const preconditions = criterion.preconditions.length > 0 ? criterion.preconditions : [t('noPrecondition', lang)]

  for (const element of criterion.dataElements) {
    if (!element.boundaryValues?.length) continue
    const { min, max } = element.constraints ?? {}

    if (min !== undefined) {
      tcCounter++
      const id = `TC-${String(tcCounter).padStart(3, '0')}`
      cases.push({
        id, kind: 'bva',
        title: `${id}: ${element.name} — ${t('minBoundaryTitle', lang)} (${min})`,
        preconditions,
        steps: [
          { number: 1, action: t('accessFeature', lang), data: '—', expectedResult: t('screenIsDisplayed', lang) },
          { number: 2, action: `${t('fillWithBoundary', lang)} ${element.name}`, data: `${min} (min)`, expectedResult: t('systemAccepts', lang) },
          { number: 3, action: lang === 'en' ? 'Confirm' : 'Confirmar', data: '—', expectedResult: t('operationSuccess', lang) },
        ],
        gherkinSteps: [], behavior: 'positive', criterionRef: criterion.id,
      })
    }

    if (max !== undefined) {
      tcCounter++
      const id = `TC-${String(tcCounter).padStart(3, '0')}`
      cases.push({
        id, kind: 'bva',
        title: `${id}: ${element.name} — ${t('maxBoundaryTitle', lang)} (${max + 1})`,
        preconditions,
        steps: [
          { number: 1, action: t('accessFeature', lang), data: '—', expectedResult: t('screenIsDisplayed', lang) },
          { number: 2, action: `${t('fillWithBoundary', lang)} ${element.name} ${t('fillAboveMax', lang)}`, data: `${max + 1} (max: ${max})`, expectedResult: t('systemRejects', lang) },
        ],
        gherkinSteps: [], behavior: 'negative', criterionRef: criterion.id,
      })
    }
  }

  return cases
}

function generateProceduralTestCases(criterion, lang) {
  const cases = []
  const preconditions = criterion.preconditions.length > 0 ? criterion.preconditions : [t('noPrecondition', lang)]

  tcCounter++
  const posId = `TC-${String(tcCounter).padStart(3, '0')}`
  cases.push({
    id: posId,
    title: `${posId}: ${buildPositiveTitle(criterion, lang)}`,
    kind: 'positive',
    preconditions,
    steps: buildPositiveSteps(criterion, lang),
    gherkinSteps: [],
    behavior: 'positive',
    criterionRef: criterion.id,
  })

  if (criterion.negatable) {
    for (const rule of deriveNegativeRules(criterion, lang)) {
      tcCounter++
      const negId = `TC-${String(tcCounter).padStart(3, '0')}`
      cases.push({
        id: negId,
        title: `${negId}: ${rule.title}`,
        kind: 'negative',
        preconditions,
        steps: buildNegativeSteps(criterion, lang, rule.negation, rule.expectedResult),
        gherkinSteps: [],
        behavior: 'negative',
        criterionRef: criterion.id,
      })
    }
  }

  cases.push(...generateBVACases(criterion, lang))
  return cases
}

// ── Gherkin Generator ─────────────────────────────────────────────────────────

let gherkinCounter = 0

function buildGivenSteps(preconditions, lang) {
  if (preconditions.length === 0) return [{ keyword: 'Given', text: t('userAccessesSystem', lang) }]
  return preconditions.map((p, i) => ({ keyword: i === 0 ? 'Given' : 'And', text: p.toLowerCase() }))
}

function buildWhenSteps(criterion, lang) {
  if (criterion.actions.length === 0) return [{ keyword: 'When', text: t('userPerformsAction', lang) }]
  return criterion.actions.map((action, i) => ({
    keyword: i === 0 ? 'When' : 'And',
    text: `${action.verb.toLowerCase()} ${action.target.toLowerCase()}`,
  }))
}

function buildThenSteps(expectedResults, lang) {
  if (expectedResults.length === 0) return [{ keyword: 'Then', text: t('systemProcesses', lang) }]
  return expectedResults.map((r, i) => ({ keyword: i === 0 ? 'Then' : 'And', text: r.toLowerCase() }))
}

function buildScenarioTitle(criterion, lang, kind) {
  const firstAction = criterion.actions[0]
  if (firstAction) {
    const base = `${firstAction.verb} ${firstAction.target}`.toLowerCase()
    if (kind === 'positive') return `${base} ${t('successSuffix', lang)}`
    const tryPrefix = lang === 'pt-br' ? 'tentar' : lang === 'es' ? 'intentar' : 'try to'
    const withInvalid = lang === 'pt-br' ? 'com dados inválidos' : lang === 'es' ? 'con datos inválidos' : 'with invalid data'
    return `${tryPrefix} ${base} ${withInvalid}`
  }
  const text = criterion.rawText.slice(0, 50).replace(/[\n\r]/g, ' ')
  return kind === 'positive' ? `${text} (${t('successSuffix', lang)})` : `${text} (${t('happyPath', lang)})`
}

function generateGherkinTestCases(criterion, lang) {
  const cases = []

  gherkinCounter++
  const posId = `TC-${String(gherkinCounter).padStart(3, '0')}`
  cases.push({
    id: posId,
    title: `${posId}: ${buildScenarioTitle(criterion, lang, 'positive')}`,
    kind: 'positive',
    preconditions: criterion.preconditions,
    steps: [],
    gherkinSteps: [
      ...buildGivenSteps(criterion.preconditions, lang),
      ...buildWhenSteps(criterion, lang),
      ...buildThenSteps(criterion.expectedResults, lang),
    ],
    behavior: 'positive',
    criterionRef: criterion.id,
  })

  if (criterion.negatable) {
    gherkinCounter++
    const negId = `TC-${String(gherkinCounter).padStart(3, '0')}`
    cases.push({
      id: negId,
      title: `${negId}: ${buildScenarioTitle(criterion, lang, 'negative')}`,
      kind: 'negative',
      preconditions: criterion.preconditions,
      steps: [],
      gherkinSteps: [
        ...buildGivenSteps(criterion.preconditions, lang),
        { keyword: 'When', text: t('userTriesInvalid', lang) },
        { keyword: 'Then', text: t('systemShowsError', lang) },
      ],
      behavior: 'negative',
      criterionRef: criterion.id,
    })
  }

  return cases
}

// ── Formatting ────────────────────────────────────────────────────────────────

function formatProceduralAsText(tc) {
  const lines = [`${tc.title}`, '']
  if (tc.preconditions?.length) {
    lines.push('Pré-condições / Preconditions:')
    tc.preconditions.forEach(p => lines.push(`  • ${p}`))
    lines.push('')
  }
  lines.push('Passo | Ação | Dados | Resultado Esperado')
  lines.push('------|------|-------|-------------------')
  tc.steps.forEach(s => lines.push(`${s.number}     | ${s.action} | ${s.data} | ${s.expectedResult}`))
  return lines.join('\n')
}

function formatGherkinAsText(tc) {
  const lines = [`Scenario: ${tc.title}`, '']
  tc.gherkinSteps.forEach(s => lines.push(`  ${s.keyword} ${s.text}`))
  return lines.join('\n')
}

// ── Engine Entry Point ────────────────────────────────────────────────────────

function runEngine(storyText, format) {
  tcCounter = 0
  gherkinCounter = 0

  const clean = sanitize(storyText)
  const lang = detectLanguage(clean)
  const sections = splitSections(clean, lang)

  const allTexts = [
    ...sections.acceptanceCriteria,
    ...sections.businessRules,
  ]

  if (allTexts.length === 0 && sections.userStory) {
    allTexts.push(sections.userStory.slice(0, 200))
  }

  const criteria = extractCriteria(allTexts, lang)

  const testCases = []
  for (const criterion of criteria) {
    if (format === 'gherkin') {
      testCases.push(...generateGherkinTestCases(criterion, lang))
    } else {
      testCases.push(...generateProceduralTestCases(criterion, lang))
    }
  }

  return testCases.map(tc => ({
    ...tc,
    text: format === 'gherkin' ? formatGherkinAsText(tc) : formatProceduralAsText(tc),
  }))
}

// ── Message Handler ───────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'GENERATE') return false

  try {
    const testCases = runEngine(message.storyText, message.format)
    sendResponse({ success: true, testCases })
  } catch (err) {
    sendResponse({ success: false, error: err.message ?? String(err) })
  }

  return true // keep channel open for async response
})
