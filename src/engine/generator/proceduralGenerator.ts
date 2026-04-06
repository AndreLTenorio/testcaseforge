import type { AcceptanceCriterion, TestCase, ProceduralStep, Language, Priority, Severity, TestType } from '../types'
import { t } from '../i18n'

let tcCounter = 0
const usedNegativeTitles = new Set<string>()
export function resetTcCounter() { tcCounter = 0; usedNegativeTitles.clear() }

function buildPositiveSteps(criterion: AcceptanceCriterion, lang: Language): ProceduralStep[] {
  const steps: ProceduralStep[] = []

  steps.push({
    number: 1,
    action: t('accessFeature', lang),
    data: '—',
    expectedResult: t('screenDisplayed', lang),
  })

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

function buildNegativeSteps(criterion: AcceptanceCriterion, lang: Language, negationDesc: string, expectedErr: string): ProceduralStep[] {
  const steps: ProceduralStep[] = []
  steps.push({ number: 1, action: t('accessFeature', lang), data: '—', expectedResult: t('screenDisplayed', lang) })

  const positiveSteps = buildPositiveSteps(criterion, lang).slice(1, -1)
  for (const s of positiveSteps) steps.push({ ...s, number: steps.length + 1 })

  steps.push({
    number: steps.length + 1,
    action: negationDesc,
    data: t('invalidData', lang),
    expectedResult: expectedErr,
  })
  return steps
}

export function generateProceduralTestCases(
  criterion: AcceptanceCriterion,
  lang: Language,
  priority: Priority,
  severity: Severity,
  type: TestType,
): TestCase[] {
  const cases: TestCase[] = []
  const preconditions = criterion.preconditions.length > 0
    ? criterion.preconditions
    : [t('noPrecondition', lang)]

  // Positive case
  tcCounter++
  const posId = `TC-${String(tcCounter).padStart(3, '0')}`
  cases.push({
    id: posId,
    title: `${posId}: ${buildPositiveTitle(criterion, lang)}`,
    description: buildPositiveDescription(criterion, lang),
    kind: 'positive',
    preconditions,
    steps: buildPositiveSteps(criterion, lang),
    gherkinSteps: [],
    priority, severity, type,
    behavior: 'positive',
    criterionRef: criterion.id,
  })

  // Negative cases — deduplicated globally across all criteria
  if (criterion.negatable) {
    for (const rule of deriveNegativeRules(criterion, lang)) {
      if (usedNegativeTitles.has(rule.title)) continue
      usedNegativeTitles.add(rule.title)
      tcCounter++
      const negId = `TC-${String(tcCounter).padStart(3, '0')}`
      cases.push({
        id: negId,
        title: `${negId}: ${rule.title}`,
        description: `${t('descNegativeVerify', lang)} ${rule.negation.charAt(0).toLowerCase() + rule.negation.slice(1)}. ${rule.expectedResult}.`,
        kind: 'negative',
        preconditions,
        steps: buildNegativeSteps(criterion, lang, rule.negation, rule.expectedResult),
        gherkinSteps: [],
        priority, severity, type,
        behavior: 'negative',
        criterionRef: criterion.id,
      })
    }
  }

  // BVA cases
  cases.push(...generateBVACases(criterion, lang, priority, severity, type))
  return cases
}

function truncateTitle(title: string, maxLen = 60): string {
  if (title.length <= maxLen) return title
  return title.slice(0, maxLen - 1).replace(/\s+\S*$/, '') + '…'
}

function buildPositiveTitle(criterion: AcceptanceCriterion, _lang: Language): string {
  const firstAction = criterion.actions[0]
  if (firstAction) {
    return truncateTitle(`${firstAction.verb} ${firstAction.target}`)
  }
  const text = (criterion.expectedResults[0] ?? criterion.rawText).replace(/[\n\r]+/g, ' ').trim()
  return truncateTitle(text)
}

function buildPositiveDescription(criterion: AcceptanceCriterion, lang: Language): string {
  const prefix = t('descVerifyThat', lang)
  if (criterion.expectedResults.length > 0) {
    const results = criterion.expectedResults.map(r => r.charAt(0).toLowerCase() + r.slice(1)).join('. ')
    return `${prefix} ${results}.`
  }
  const text = criterion.rawText.replace(/[\n\r]+/g, ' ').trim()
  return `${prefix} ${text.charAt(0).toLowerCase() + text.slice(1)}.`
}

interface DerivedRule { title: string; negation: string; expectedResult: string }

function deriveNegativeRules(criterion: AcceptanceCriterion, lang: Language): DerivedRule[] {
  const rules: DerivedRule[] = []
  const lower = criterion.rawText.toLowerCase()

  type CheckItem = { triggers: string[]; title: string; negation: string; expected: string }

  const ptChecks: CheckItem[] = [
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

  const enChecks: CheckItem[] = [
    { triggers: ['required', 'mandatory'], title: 'Try to proceed without filling required field', negation: 'Leave required field blank', expected: 'System displays required field message' },
    { triggers: ['email', 'e-mail'], title: 'Fill email with invalid format', negation: 'Fill email field with value without @ or domain', expected: 'System displays invalid email message' },
    { triggers: ['password'], title: 'Fill password with invalid value', negation: 'Fill password field with value not meeting requirements', expected: 'System displays invalid password message' },
    { triggers: ['logged', 'authenticated', 'login'], title: 'Access without being authenticated', negation: 'Access the feature without being logged in', expected: 'System redirects to login page' },
    { triggers: ['permission', 'role'], title: 'Access with unauthorized user', negation: 'Access with a user without required permission', expected: 'System displays access denied message' },
    { triggers: ['select', 'choose'], title: 'Try to proceed without selecting option', negation: 'Do not select any option and try to proceed', expected: 'System displays mandatory selection message' },
    { triggers: ['date'], title: 'Enter invalid date', negation: 'Enter date in invalid format or outside allowed range', expected: 'System displays invalid date message' },
    { triggers: ['file', 'upload', 'attachment'], title: 'Upload file with invalid format', negation: 'Try to upload file with unsupported extension or exceeding size', expected: 'System rejects file and displays error message' },
  ]

  const esChecks: CheckItem[] = [
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

  for (const check of checks) {
    if (check.triggers.some(t => lower.includes(t))) {
      rules.push({ title: check.title, negation: check.negation, expectedResult: check.expected })
    }
  }

  if (rules.length === 0) {
    rules.push({ title: t('tryWithInvalidData', lang), negation: t('invalidDataNegation', lang), expectedResult: t('invalidDataExpected', lang) })
  }

  return rules
}

function generateBVACases(criterion: AcceptanceCriterion, lang: Language, priority: Priority, severity: Severity, type: TestType): TestCase[] {
  const cases: TestCase[] = []
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
        description: `${t('descBvaMinVerify', lang)} ${element.name} (${min}).`,
        preconditions,
        steps: [
          { number: 1, action: t('accessFeature', lang), data: '—', expectedResult: t('screenIsDisplayed', lang) },
          { number: 2, action: `${t('fillWithBoundary', lang)} ${element.name}`, data: `${min} (min)`, expectedResult: t('systemAccepts', lang) },
          { number: 3, action: lang === 'pt-br' ? 'Confirmar' : lang === 'es' ? 'Confirmar' : 'Confirm', data: '—', expectedResult: t('operationSuccess', lang) },
        ],
        gherkinSteps: [], priority, severity, type, behavior: 'positive', criterionRef: criterion.id,
      })
    }

    if (max !== undefined) {
      tcCounter++
      const id = `TC-${String(tcCounter).padStart(3, '0')}`
      cases.push({
        id, kind: 'bva',
        title: `${id}: ${element.name} — ${t('maxBoundaryTitle', lang)} (${max + 1})`,
        description: `${t('descBvaMaxVerify', lang)} ${element.name} (max: ${max}).`,
        preconditions,
        steps: [
          { number: 1, action: t('accessFeature', lang), data: '—', expectedResult: t('screenIsDisplayed', lang) },
          { number: 2, action: `${t('fillWithBoundary', lang)} ${element.name} ${t('fillAboveMax', lang)}`, data: `${max + 1} (max: ${max})`, expectedResult: t('systemRejects', lang) },
        ],
        gherkinSteps: [], priority, severity, type, behavior: 'negative', criterionRef: criterion.id,
      })
    }
  }

  return cases
}
