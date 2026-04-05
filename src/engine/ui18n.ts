import type { Language } from './types'

export type UIKey =
  // Header
  | 'tagline'
  // Input section
  | 'inputTitle'
  | 'clearAll'
  | 'storyInputLabel'
  | 'storyPlaceholder'
  | 'storyHint'
  | 'metadataTitle'
  | 'metadataOptional'
  | 'metadataProject'
  | 'metadataSuite'
  | 'metadataPriority'
  | 'metadataSeverity'
  | 'metadataType'
  | 'formatLabel'
  | 'formatProcedural'
  | 'formatProceduralDesc'
  | 'formatGherkin'
  | 'formatGherkinDesc'
  | 'formatBoth'
  | 'formatBothDesc'
  | 'generateBtn'
  | 'generating'
  | 'istqbBadge'
  // Output section
  | 'outputTitle'
  | 'qaseBtn'
  | 'emptyTitle'
  | 'emptyDesc'
  | 'emptyGenerate'
  // Empty state feature grid
  | 'featureJira'
  | 'featureFormats'
  | 'featureCases'
  | 'featureHistory'
  | 'featureBatch'
  | 'featureExport'
  // Toasts
  | 'toastEmptyStory'
  | 'toastError'
  | 'toastNoCases'
  | 'toastGenerated'
  | 'toastRestoredHistory'
  | 'toastBatchNone'
  | 'toastBatchDone'
  | 'toastCopied'
  | 'toastCopyFail'
  | 'toastCopyAll'
  | 'toastJSON'
  | 'toastCSV'
  | 'toastMarkdown'
  | 'toastQase'
  // Collapsible sections
  | 'batchTitle'
  | 'batchSub'
  | 'historyTitle'
  | 'metricsTitle'
  | 'howToTitle'
  // Batch
  | 'batchHint'
  | 'batchLoadFile'
  | 'batchFileTypes'
  | 'batchDetected'
  | 'batchGenerate'
  // History
  | 'historyEmpty'
  | 'historyRestore'
  | 'historyClear'
  // Metrics
  | 'metricsNoData'
  | 'metricsCases'
  | 'metricsStories'
  | 'metricsExports'
  | 'metricsCopies'
  | 'metricsPositive'
  | 'metricsNegative'
  | 'metricsBva'
  | 'metricsByFormat'
  | 'metricsByLang'
  | 'metricsFirst'
  | 'metricsLast'
  | 'metricsReset'
  | 'metricsDistrib'
  | 'metricsCasesUnit'
  // MetadataForm options
  | 'priorityLow' | 'priorityNormal' | 'priorityHigh' | 'priorityCritical'
  | 'typeFunctional' | 'typeNonFunctional' | 'typeRegression' | 'typeSmoke' | 'typeExploratory'
  // HowToUse steps
  | 'howToStep1Title' | 'howToStep1Desc' | 'howToStep1Example'
  | 'howToStep2Title' | 'howToStep2Desc'
  | 'howToStep3Title' | 'howToStep3Desc'
  | 'howToStep4Title' | 'howToStep4Desc'
  | 'howToStep5Title' | 'howToStep5Desc'
  | 'howToIstqbLabel'
  | 'howToTagEP' | 'howToTagBVA' | 'howToTagPosNeg' | 'howToTagDT'

type UILabels = Record<Language, string>

const UI: Record<UIKey, UILabels> = {
  // Header
  tagline: {
    'pt-br': 'Forjando Casos de Teste com Precisão',
    'en':    'Forging Test Cases with Precision',
    'es':    'Forjando Casos de Prueba con Precisión',
  },
  // Input
  inputTitle: { 'pt-br': 'Entrada', 'en': 'Input', 'es': 'Entrada' },
  clearAll:   { 'pt-br': 'Limpar tudo', 'en': 'Clear all', 'es': 'Limpiar todo' },
  storyInputLabel: { 'pt-br': 'User Story', 'en': 'User Story', 'es': 'User Story' },
  storyPlaceholder: {
    'pt-br': `Cole aqui o texto da sua User Story...\n\nExemplo:\nComo um paciente,\nEu quero agendar uma teleconsulta,\nPara que eu possa ser atendido sem sair de casa.\n\nCritérios de Aceite:\n1. O paciente deve estar logado no sistema\n2. O paciente deve selecionar a especialidade médica desejada\n3. O sistema deve exibir os horários disponíveis\n4. O paciente deve confirmar o agendamento\n5. O sistema deve exibir mensagem de sucesso\n\nRegras de Negócio:\n- Não é permitido agendar mais de 3 consultas no mesmo dia\n- O agendamento deve ser feito com no mínimo 2 horas de antecedência`,
    'en': `Paste your User Story text here...\n\nExample:\nAs a patient,\nI want to schedule a teleconsultation,\nSo that I can be attended without leaving home.\n\nAcceptance Criteria:\n1. The patient must be logged in to the system\n2. The patient must select the desired medical specialty\n3. The system must display available time slots\n4. The patient must confirm the appointment\n5. The system must display a success message\n\nBusiness Rules:\n- Scheduling more than 3 appointments on the same day is not allowed\n- The appointment must be scheduled at least 2 hours in advance`,
    'es': `Pegue aquí el texto de su User Story...\n\nEjemplo:\nComo un paciente,\nQuiero agendar una teleconsulta,\nPara que pueda ser atendido sin salir de casa.\n\nCriterios de Aceptación:\n1. El paciente debe haber iniciado sesión en el sistema\n2. El paciente debe seleccionar la especialidad médica deseada\n3. El sistema debe mostrar los horarios disponibles\n4. El paciente debe confirmar la cita\n5. El sistema debe mostrar un mensaje de éxito\n\nReglas de Negocio:\n- No se permite agendar más de 3 citas el mismo día\n- La cita debe agendarse con al menos 2 horas de anticipación`,
  },
  storyHint: {
    'pt-br': 'Suporta texto do Jira (PT-BR, EN e ES), critérios de aceite em bullets ou numerados, e regras de negócio.',
    'en':    'Supports Jira text (PT-BR, EN and ES), acceptance criteria as bullets or numbered lists, and business rules.',
    'es':    'Soporta texto de Jira (PT-BR, EN y ES), criterios de aceptación en bullets o numerados, y reglas de negocio.',
  },
  metadataTitle:    { 'pt-br': 'Metadados', 'en': 'Metadata', 'es': 'Metadatos' },
  metadataOptional: { 'pt-br': '(opcional)', 'en': '(optional)', 'es': '(opcional)' },
  metadataProject:  { 'pt-br': 'Projeto', 'en': 'Project', 'es': 'Proyecto' },
  metadataSuite:    { 'pt-br': 'Suite', 'en': 'Suite', 'es': 'Suite' },
  metadataPriority: { 'pt-br': 'Prioridade', 'en': 'Priority', 'es': 'Prioridad' },
  metadataSeverity: { 'pt-br': 'Gravidade', 'en': 'Severity', 'es': 'Gravedad' },
  metadataType:     { 'pt-br': 'Tipo de Teste', 'en': 'Test Type', 'es': 'Tipo de Prueba' },
  formatLabel:        { 'pt-br': 'Formato de saída', 'en': 'Output format', 'es': 'Formato de salida' },
  formatProcedural:   { 'pt-br': 'Procedural', 'en': 'Procedural', 'es': 'Procedural' },
  formatProceduralDesc: { 'pt-br': 'Step · Data · Expected', 'en': 'Step · Data · Expected', 'es': 'Paso · Datos · Esperado' },
  formatGherkin:      { 'pt-br': 'Gherkin/BDD', 'en': 'Gherkin/BDD', 'es': 'Gherkin/BDD' },
  formatGherkinDesc:  { 'pt-br': 'Given · When · Then', 'en': 'Given · When · Then', 'es': 'Given · When · Then' },
  formatBoth:         { 'pt-br': 'Ambos', 'en': 'Both', 'es': 'Ambos' },
  formatBothDesc:     { 'pt-br': 'Procedural + Gherkin', 'en': 'Procedural + Gherkin', 'es': 'Procedural + Gherkin' },
  generateBtn: { 'pt-br': 'Gerar Casos de Teste', 'en': 'Generate Test Cases', 'es': 'Generar Casos de Prueba' },
  generating:  { 'pt-br': 'Gerando...', 'en': 'Generating...', 'es': 'Generando...' },
  istqbBadge:  {
    'pt-br': 'Baseado em ISTQB/CTFL 4.0 — 100% determinístico',
    'en':    'Based on ISTQB/CTFL 4.0 — 100% deterministic',
    'es':    'Basado en ISTQB/CTFL 4.0 — 100% determinístico',
  },
  // Output
  outputTitle: { 'pt-br': 'Casos de Teste Gerados', 'en': 'Generated Test Cases', 'es': 'Casos de Prueba Generados' },
  qaseBtn:     { 'pt-br': '📤 Qase', 'en': '📤 Qase', 'es': '📤 Qase' },
  emptyTitle:  { 'pt-br': 'Pronto para forjar', 'en': 'Ready to forge', 'es': 'Listo para forjar' },
  emptyDesc: {
    'pt-br': 'Cole sua User Story no painel esquerdo\ne clique em',
    'en':    'Paste your User Story in the left panel\nand click',
    'es':    'Pegue su User Story en el panel izquierdo\ny haga clic en',
  },
  emptyGenerate: { 'pt-br': 'Gerar Casos de Teste', 'en': 'Generate Test Cases', 'es': 'Generar Casos de Prueba' },
  // Feature grid
  featureJira:    { 'pt-br': 'Jira PT-BR, EN e ES', 'en': 'Jira PT-BR, EN & ES', 'es': 'Jira PT-BR, EN y ES' },
  featureFormats: { 'pt-br': 'Gherkin + Procedural', 'en': 'Gherkin + Procedural', 'es': 'Gherkin + Procedural' },
  featureCases:   { 'pt-br': 'Positivos + Negativos + BVA', 'en': 'Positive + Negative + BVA', 'es': 'Positivos + Negativos + BVA' },
  featureHistory: { 'pt-br': 'Histórico local', 'en': 'Local history', 'es': 'Historial local' },
  featureBatch:   { 'pt-br': 'Importação em lote', 'en': 'Batch import', 'es': 'Importación por lotes' },
  featureExport:  { 'pt-br': 'Export JSON/CSV/MD', 'en': 'Export JSON/CSV/MD', 'es': 'Exportar JSON/CSV/MD' },
  // Toasts
  toastEmptyStory:    { 'pt-br': 'Cole o texto da User Story antes de gerar.', 'en': 'Paste the User Story text before generating.', 'es': 'Pegue el texto de la User Story antes de generar.' },
  toastError:         { 'pt-br': 'Erro ao gerar casos de teste.', 'en': 'Error generating test cases.', 'es': 'Error al generar casos de prueba.' },
  toastNoCases:       { 'pt-br': 'Nenhum caso encontrado. Verifique o texto da User Story.', 'en': 'No cases found. Check the User Story text.', 'es': 'No se encontraron casos. Verifique el texto de la User Story.' },
  toastGenerated:     { 'pt-br': 'casos de teste gerados!', 'en': 'test cases generated!', 'es': 'casos de prueba generados!' },
  toastRestoredHistory: { 'pt-br': 'Geração restaurada do histórico.', 'en': 'Generation restored from history.', 'es': 'Generación restaurada del historial.' },
  toastBatchNone:     { 'pt-br': 'Nenhum caso gerado do batch.', 'en': 'No cases generated from batch.', 'es': 'No se generaron casos del batch.' },
  toastBatchDone:     { 'pt-br': 'casos gerados de', 'en': 'cases generated from', 'es': 'casos generados de' },
  toastCopied:        { 'pt-br': 'Copiado!', 'en': 'Copied!', 'es': '¡Copiado!' },
  toastCopyFail:      { 'pt-br': 'Falha ao copiar.', 'en': 'Failed to copy.', 'es': 'Error al copiar.' },
  toastCopyAll:       { 'pt-br': 'Todos os casos copiados!', 'en': 'All cases copied!', 'es': '¡Todos los casos copiados!' },
  toastJSON:          { 'pt-br': 'JSON exportado!', 'en': 'JSON exported!', 'es': '¡JSON exportado!' },
  toastCSV:           { 'pt-br': 'CSV exportado!', 'en': 'CSV exported!', 'es': '¡CSV exportado!' },
  toastMarkdown:      { 'pt-br': 'Markdown exportado!', 'en': 'Markdown exported!', 'es': '¡Markdown exportado!' },
  toastQase:          { 'pt-br': 'caso(s) enviados ao Qase!', 'en': 'case(s) sent to Qase!', 'es': 'caso(s) enviados a Qase!' },
  // Sections
  batchTitle:   { 'pt-br': 'Importação em Lote (Batch)', 'en': 'Batch Import', 'es': 'Importación por Lotes (Batch)' },
  batchSub:     { 'pt-br': 'múltiplas User Stories', 'en': 'multiple User Stories', 'es': 'múltiples User Stories' },
  historyTitle: { 'pt-br': 'Histórico', 'en': 'History', 'es': 'Historial' },
  metricsTitle: { 'pt-br': 'Dashboard de Métricas', 'en': 'Metrics Dashboard', 'es': 'Panel de Métricas' },
  howToTitle:   { 'pt-br': 'Como Usar', 'en': 'How to Use', 'es': 'Cómo Usar' },
  // Batch
  batchHint: {
    'pt-br': 'Cole múltiplas User Stories separadas por --- ou carregue um arquivo .txt / .md.',
    'en':    'Paste multiple User Stories separated by --- or upload a .txt / .md file.',
    'es':    'Pegue múltiples User Stories separadas por --- o cargue un archivo .txt / .md.',
  },
  batchLoadFile: { 'pt-br': '📁 Carregar arquivo', 'en': '📁 Load file', 'es': '📁 Cargar archivo' },
  batchFileTypes: { 'pt-br': '.txt ou .md', 'en': '.txt or .md', 'es': '.txt o .md' },
  batchDetected:  { 'pt-br': 'histórias detectadas', 'en': 'stories detected', 'es': 'historias detectadas' },
  batchGenerate:  { 'pt-br': 'Gerar Casos para', 'en': 'Generate Cases for', 'es': 'Generar Casos para' },
  // History
  historyEmpty:   { 'pt-br': 'Nenhuma geração ainda. Os últimos 20 resultados serão salvos aqui automaticamente.', 'en': 'No generations yet. The last 20 results will be saved here automatically.', 'es': 'Sin generaciones aún. Los últimos 20 resultados se guardarán aquí automáticamente.' },
  historyRestore: { 'pt-br': 'Restaurar', 'en': 'Restore', 'es': 'Restaurar' },
  historyClear:   { 'pt-br': 'Limpar histórico', 'en': 'Clear history', 'es': 'Limpiar historial' },
  // Metrics
  metricsNoData:   { 'pt-br': 'Ainda sem dados. Gere alguns casos de teste para começar a ver métricas!', 'en': 'No data yet. Generate some test cases to start seeing metrics!', 'es': '¡Sin datos aún. Genere algunos casos de prueba para ver métricas!' },
  metricsCases:    { 'pt-br': 'Casos Gerados', 'en': 'Cases Generated', 'es': 'Casos Generados' },
  metricsStories:  { 'pt-br': 'Histórias Processadas', 'en': 'Stories Processed', 'es': 'Historias Procesadas' },
  metricsExports:  { 'pt-br': 'Exportações', 'en': 'Exports', 'es': 'Exportaciones' },
  metricsCopies:   { 'pt-br': 'Cópias', 'en': 'Copies', 'es': 'Copias' },
  metricsPositive: { 'pt-br': 'Positivos', 'en': 'Positive', 'es': 'Positivos' },
  metricsNegative: { 'pt-br': 'Negativos', 'en': 'Negative', 'es': 'Negativos' },
  metricsBva:      { 'pt-br': 'BVA', 'en': 'BVA', 'es': 'BVA' },
  metricsByFormat: { 'pt-br': 'Por Formato', 'en': 'By Format', 'es': 'Por Formato' },
  metricsByLang:   { 'pt-br': 'Por Idioma', 'en': 'By Language', 'es': 'Por Idioma' },
  metricsFirst:    { 'pt-br': 'Primeiro uso', 'en': 'First use', 'es': 'Primer uso' },
  metricsLast:     { 'pt-br': 'Último uso', 'en': 'Last use', 'es': 'Último uso' },
  metricsReset:    { 'pt-br': 'Zerar métricas', 'en': 'Reset metrics', 'es': 'Reiniciar métricas' },
  metricsDistrib:  { 'pt-br': 'Distribuição por Tipo', 'en': 'Distribution by Type', 'es': 'Distribución por Tipo' },
  metricsCasesUnit: { 'pt-br': 'casos', 'en': 'cases', 'es': 'casos' },
  // MetadataForm options
  priorityLow:      { 'pt-br': 'Baixa',   'en': 'Low',      'es': 'Baja' },
  priorityNormal:   { 'pt-br': 'Normal',  'en': 'Normal',   'es': 'Normal' },
  priorityHigh:     { 'pt-br': 'Alta',    'en': 'High',     'es': 'Alta' },
  priorityCritical: { 'pt-br': 'Crítica', 'en': 'Critical', 'es': 'Crítica' },
  typeFunctional:    { 'pt-br': 'Funcional',      'en': 'Functional',      'es': 'Funcional' },
  typeNonFunctional: { 'pt-br': 'Não-Funcional',  'en': 'Non-Functional',  'es': 'No-Funcional' },
  typeRegression:    { 'pt-br': 'Regressão',       'en': 'Regression',      'es': 'Regresión' },
  typeSmoke:         { 'pt-br': 'Smoke',           'en': 'Smoke',           'es': 'Smoke' },
  typeExploratory:   { 'pt-br': 'Exploratório',   'en': 'Exploratory',     'es': 'Exploratorio' },
  // HowToUse steps
  howToStep1Title: { 'pt-br': 'Cole sua User Story', 'en': 'Paste your User Story', 'es': 'Pegue su User Story' },
  howToStep1Desc: {
    'pt-br': 'Copie o texto do seu card no Jira (ou qualquer ferramenta) e cole na área de entrada. Suporta PT-BR, EN e ES automaticamente.',
    'en':    'Copy the text from your Jira card (or any tool) and paste it in the input area. Supports PT-BR, EN and ES automatically.',
    'es':    'Copie el texto de su tarjeta de Jira (o cualquier herramienta) y péguelo en el área de entrada. Soporta PT-BR, EN y ES automáticamente.',
  },
  howToStep1Example: {
    'pt-br': '"Como um usuário, eu quero fazer login, para que eu acesse o sistema.\nCritérios de Aceite:\n1. O usuário deve informar e-mail e senha válidos\n2. O sistema deve exibir mensagem de erro para credenciais inválidas"',
    'en':    '"As a user, I want to log in, so that I can access the system.\nAcceptance Criteria:\n1. The user must provide a valid email and password\n2. The system must display an error message for invalid credentials"',
    'es':    '"Como un usuario, quiero iniciar sesión, para que pueda acceder al sistema.\nCriterios de Aceptación:\n1. El usuario debe proporcionar un correo y contraseña válidos\n2. El sistema debe mostrar un mensaje de error para credenciales inválidas"',
  },
  howToStep2Title: { 'pt-br': 'Configure os metadados (opcional)', 'en': 'Configure metadata (optional)', 'es': 'Configure los metadatos (opcional)' },
  howToStep2Desc: {
    'pt-br': 'Informe projeto, suite, prioridade, gravidade e tipo de teste. Esses dados serão exportados junto com os casos gerados.',
    'en':    'Enter project, suite, priority, severity and test type. This data will be exported along with the generated cases.',
    'es':    'Ingrese el proyecto, suite, prioridad, gravedad y tipo de prueba. Estos datos se exportarán junto con los casos generados.',
  },
  howToStep3Title: { 'pt-br': 'Escolha o formato', 'en': 'Choose the format', 'es': 'Elija el formato' },
  howToStep3Desc: {
    'pt-br': 'Selecione Procedural (Step/Data/Expected), Gherkin/BDD (Given/When/Then) ou ambos.',
    'en':    'Select Procedural (Step/Data/Expected), Gherkin/BDD (Given/When/Then), or both.',
    'es':    'Seleccione Procedural (Paso/Datos/Esperado), Gherkin/BDD (Given/When/Then) o ambos.',
  },
  howToStep4Title: { 'pt-br': 'Clique em "Gerar Casos de Teste"', 'en': 'Click "Generate Test Cases"', 'es': 'Haga clic en "Generar Casos de Prueba"' },
  howToStep4Desc: {
    'pt-br': 'O motor determinístico analisa o texto, extrai critérios, aplica técnicas ISTQB e gera casos positivos, negativos e BVA em menos de 1 segundo.',
    'en':    'The deterministic engine analyzes the text, extracts criteria, applies ISTQB techniques and generates positive, negative and BVA cases in under 1 second.',
    'es':    'El motor determinístico analiza el texto, extrae criterios, aplica técnicas ISTQB y genera casos positivos, negativos y BVA en menos de 1 segundo.',
  },
  howToStep5Title: { 'pt-br': 'Revise, edite e exporte', 'en': 'Review, edit and export', 'es': 'Revise, edite y exporte' },
  howToStep5Desc: {
    'pt-br': 'Clique em "✏️ Editar" em qualquer card para ajustar título, passos ou resultados esperados. Depois copie individualmente ou exporte JSON/CSV/Markdown.',
    'en':    'Click "✏️ Edit" on any card to adjust the title, steps or expected results. Then copy individually or export as JSON/CSV/Markdown.',
    'es':    'Haga clic en "✏️ Editar" en cualquier tarjeta para ajustar el título, los pasos o los resultados esperados. Luego copie individualmente o exporte como JSON/CSV/Markdown.',
  },
  howToIstqbLabel: {
    'pt-br': 'Técnicas ISTQB/CTFL aplicadas automaticamente:',
    'en':    'ISTQB/CTFL techniques applied automatically:',
    'es':    'Técnicas ISTQB/CTFL aplicadas automáticamente:',
  },
  howToTagEP:     { 'pt-br': 'Partição de Equivalência',  'en': 'Equivalence Partitioning', 'es': 'Partición de Equivalencia' },
  howToTagBVA:    { 'pt-br': 'Análise de Valor Limite',   'en': 'Boundary Value Analysis',  'es': 'Análisis de Valor Límite' },
  howToTagPosNeg: { 'pt-br': 'Positivo & Negativo',        'en': 'Positive & Negative',       'es': 'Positivo & Negativo' },
  howToTagDT:     { 'pt-br': 'Tabela de Decisão',          'en': 'Decision Table',            'es': 'Tabla de Decisión' },
}

export function ui(key: UIKey, lang: Language): string {
  return UI[key]?.[lang] ?? UI[key]?.['en'] ?? key
}
