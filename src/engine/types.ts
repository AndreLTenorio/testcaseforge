// ─── Core Domain Types ─────────────────────────────────────────────────────

export type Language = 'pt-br' | 'en' | 'es'
export type OutputFormat = 'procedural' | 'gherkin' | 'both'
export type Priority = 'low' | 'normal' | 'high' | 'critical'
export type Severity = 'trivial' | 'minor' | 'major' | 'critical' | 'blocker'
export type TestType = 'functional' | 'non-functional' | 'regression' | 'smoke' | 'exploratory'
export type Behavior = 'positive' | 'negative' | 'destructive'
export type TestCaseKind = 'positive' | 'negative' | 'bva' | 'state-transition'

// ─── Parsed Intermediate Structures ────────────────────────────────────────

export interface Action {
  verb: string
  target: string
  data?: string
}

export interface DataElement {
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'file' | 'unknown'
  constraints?: {
    min?: number
    max?: number
    pattern?: string
    required?: boolean
    options?: string[]
  }
  equivalencePartitions?: {
    valid: string[]
    invalid: string[]
  }
  boundaryValues?: string[]
}

export interface StateTransition {
  fromState: string
  toState: string
  trigger: string
}

export interface AcceptanceCriterion {
  id: string
  rawText: string
  preconditions: string[]
  actions: Action[]
  expectedResults: string[]
  dataElements: DataElement[]
  negatable: boolean
  stateTransitions: StateTransition[]
}

export interface ParsedUserStory {
  title: string
  persona: string | null
  action: string | null
  benefit: string | null
  language: Language
  criteria: AcceptanceCriterion[]
  businessRules: string[]
  notes: string[]
}

// ─── Generated Test Cases ───────────────────────────────────────────────────

export interface ProceduralStep {
  number: number
  action: string
  data: string
  expectedResult: string
}

export interface GherkinStep {
  keyword: 'Given' | 'When' | 'Then' | 'And' | 'But'
  text: string
}

export interface TestCase {
  id: string
  title: string
  kind: TestCaseKind
  preconditions: string[]
  steps: ProceduralStep[]
  gherkinSteps: GherkinStep[]
  priority: Priority
  severity: Severity
  type: TestType
  behavior: Behavior
  criterionRef: string
}

export interface GeneratedOutput {
  feature: string
  persona: string | null
  action: string | null
  benefit: string | null
  testCases: TestCase[]
  language: Language
}

// ─── Input Metadata ─────────────────────────────────────────────────────────

export interface InputMetadata {
  projectName: string
  suiteName: string
  priority: Priority
  severity: Severity
  type: TestType
  format: OutputFormat
}
