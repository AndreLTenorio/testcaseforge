import type { Language } from './types'

type LabelKey =
  | 'accessFeature'
  | 'screenDisplayed'
  | 'validDataFor'
  | 'actionSuccess'
  | 'expectedPerCriterion'
  | 'executeAction'
  | 'invalidData'
  | 'noPrecondition'
  | 'successSuffix'
  | 'happyPath'
  | 'screenIsDisplayed'
  | 'systemAccepts'
  | 'systemRejects'
  | 'fillWithBoundary'
  | 'fillAboveMax'
  | 'operationSuccess'
  | 'minBoundaryTitle'
  | 'maxBoundaryTitle'
  // Gherkin
  | 'userAccessesSystem'
  | 'userPerformsAction'
  | 'systemProcesses'
  | 'userTriesInvalid'
  | 'systemShowsError'
  // Negative titles
  | 'tryWithInvalidData'
  | 'invalidDataNegation'
  | 'invalidDataExpected'
  // Descriptions
  | 'descVerifyThat'
  | 'descNegativeVerify'
  | 'descBvaMinVerify'
  | 'descBvaMaxVerify'

type Labels = Record<Language, string>

const LABELS: Record<LabelKey, Labels> = {
  accessFeature:       { 'pt-br': 'Acessar a funcionalidade',              'en': 'Access the feature',                   'es': 'Acceder a la funcionalidad' },
  screenDisplayed:     { 'pt-br': 'Tela/funcionalidade é exibida corretamente', 'en': 'Screen/feature is displayed correctly', 'es': 'Pantalla/funcionalidad se muestra correctamente' },
  validDataFor:        { 'pt-br': 'Dado válido para',                      'en': 'Valid data for',                       'es': 'Dato válido para' },
  actionSuccess:       { 'pt-br': 'Ação executada com sucesso',             'en': 'Action executed successfully',         'es': 'Acción ejecutada con éxito' },
  expectedPerCriterion:{ 'pt-br': 'Resultado esperado conforme critério',   'en': 'Expected result as per criterion',     'es': 'Resultado esperado según criterio' },
  executeAction:       { 'pt-br': 'Executar a ação descrita no critério',   'en': 'Execute the action described in the criterion', 'es': 'Ejecutar la acción descrita en el criterio' },
  invalidData:         { 'pt-br': 'Dado inválido ou ausente',               'en': 'Invalid or missing data',              'es': 'Dato inválido o ausente' },
  noPrecondition:      { 'pt-br': 'Nenhuma pré-condição específica',        'en': 'No specific precondition',             'es': 'Sin precondición específica' },
  successSuffix:       { 'pt-br': 'com sucesso',                           'en': 'successfully',                         'es': 'con éxito' },
  happyPath:           { 'pt-br': '(happy path)',                          'en': '(happy path)',                         'es': '(flujo positivo)' },
  screenIsDisplayed:   { 'pt-br': 'Tela é exibida',                        'en': 'Screen is displayed',                  'es': 'Pantalla se muestra' },
  systemAccepts:       { 'pt-br': 'Sistema aceita o valor',                 'en': 'System accepts the value',             'es': 'El sistema acepta el valor' },
  systemRejects:       { 'pt-br': 'Sistema rejeita o valor e exibe mensagem de erro', 'en': 'System rejects value and displays error message', 'es': 'El sistema rechaza el valor y muestra mensaje de error' },
  fillWithBoundary:    { 'pt-br': 'Preencher',                             'en': 'Fill',                                 'es': 'Rellenar' },
  fillAboveMax:        { 'pt-br': 'com valor acima do limite',              'en': 'with value above maximum',             'es': 'con valor sobre el límite' },
  operationSuccess:    { 'pt-br': 'Operação realizada com sucesso',         'en': 'Operation completed successfully',     'es': 'Operación completada con éxito' },
  minBoundaryTitle:    { 'pt-br': 'Valor no limite mínimo',                 'en': 'Value at minimum boundary',            'es': 'Valor en el límite mínimo' },
  maxBoundaryTitle:    { 'pt-br': 'Valor acima do limite máximo',           'en': 'Value above maximum boundary',         'es': 'Valor sobre el límite máximo' },
  // Gherkin
  userAccessesSystem:  { 'pt-br': 'o usuário acessa o sistema',             'en': 'the user accesses the system',         'es': 'el usuario accede al sistema' },
  userPerformsAction:  { 'pt-br': 'o usuário executa a ação',               'en': 'the user performs the action',         'es': 'el usuario ejecuta la acción' },
  systemProcesses:     { 'pt-br': 'o sistema processa a ação com sucesso',  'en': 'the system processes the action successfully', 'es': 'el sistema procesa la acción con éxito' },
  userTriesInvalid:    { 'pt-br': 'o usuário tenta realizar a ação com dados inválidos ou incompletos', 'en': 'the user tries to perform the action with invalid or incomplete data', 'es': 'el usuario intenta realizar la acción con datos inválidos o incompletos' },
  systemShowsError:    { 'pt-br': 'o sistema exibe mensagem de erro adequada', 'en': 'the system displays an appropriate error message', 'es': 'el sistema muestra un mensaje de error apropiado' },
  // Negative
  tryWithInvalidData:  { 'pt-br': 'Tentar realizar ação com dados inválidos', 'en': 'Try to perform action with invalid data', 'es': 'Intentar realizar acción con datos inválidos' },
  invalidDataNegation: { 'pt-br': 'Preencher dados com valores inválidos ou incompletos', 'en': 'Fill data with invalid or incomplete values', 'es': 'Rellenar datos con valores inválidos o incompletos' },
  invalidDataExpected: { 'pt-br': 'Sistema exibe mensagem de erro adequada', 'en': 'System displays appropriate error message', 'es': 'El sistema muestra un mensaje de error apropiado' },
  // Descriptions
  descVerifyThat:      { 'pt-br': 'Verificar que',                           'en': 'Verify that',                         'es': 'Verificar que' },
  descNegativeVerify:  { 'pt-br': 'Verificar que o sistema rejeita a ação quando', 'en': 'Verify that the system rejects the action when', 'es': 'Verificar que el sistema rechaza la acción cuando' },
  descBvaMinVerify:    { 'pt-br': 'Verificar que o sistema aceita o valor no limite mínimo para', 'en': 'Verify that the system accepts the value at minimum boundary for', 'es': 'Verificar que el sistema acepta el valor en el límite mínimo para' },
  descBvaMaxVerify:    { 'pt-br': 'Verificar que o sistema rejeita o valor acima do limite máximo para', 'en': 'Verify that the system rejects the value above maximum boundary for', 'es': 'Verificar que el sistema rechaza el valor sobre el límite máximo para' },
}

export function t(key: LabelKey, lang: Language): string {
  return LABELS[key][lang]
}
