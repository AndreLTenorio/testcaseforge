import type { TestCase, OutputFormat } from '../engine/types'

export interface QaseConfig {
  apiToken: string
  projectCode: string  // e.g. "PROJ"
  suiteId?: number     // optional suite ID to file cases under
}

export interface QaseApiResult {
  success: boolean
  caseId?: number
  error?: string
}

// Qase priority map
const PRIORITY_MAP: Record<string, number> = { low: 1, normal: 2, high: 3, critical: 4 }
const SEVERITY_MAP: Record<string, number> = { trivial: 1, minor: 2, normal: 3, major: 4, critical: 5, blocker: 6 }

function buildQasePayload(tc: TestCase, format: OutputFormat, suiteId?: number) {
  const steps = (format === 'gherkin' && tc.gherkinSteps.length > 0)
    ? tc.gherkinSteps.map(s => ({
        action: `${s.keyword} ${s.text}`,
        expected_result: '',
      }))
    : tc.steps.map(s => ({
        action: s.action,
        data: s.data !== '—' ? s.data : undefined,
        expected_result: s.expectedResult,
      }))

  return {
    title: tc.title.replace(/^TC-\d+:\s*/, ''),
    description: tc.description ?? '',
    preconditions: tc.preconditions.join('\n'),
    steps,
    priority: PRIORITY_MAP[tc.priority] ?? 2,
    severity: SEVERITY_MAP[tc.severity] ?? 3,
    type: 1, // functional
    behavior: tc.behavior === 'positive' ? 1 : tc.behavior === 'negative' ? 2 : 3,
    automation: 1, // manual
    status: 1,     // actual
    ...(suiteId ? { suite_id: suiteId } : {}),
  }
}

export async function sendToQase(
  tc: TestCase,
  config: QaseConfig,
  format: OutputFormat,
): Promise<QaseApiResult> {
  const payload = buildQasePayload(tc, format, config.suiteId)
  try {
    const response = await fetch(
      `https://api.qase.io/v1/case/${config.projectCode.toUpperCase()}`,
      {
        method: 'POST',
        headers: {
          'Token': config.apiToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )
    const data = await response.json()
    if (!response.ok) {
      return { success: false, error: data?.errorMessage ?? `HTTP ${response.status}` }
    }
    return { success: true, caseId: data?.result?.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export async function sendAllToQase(
  testCases: TestCase[],
  config: QaseConfig,
  format: OutputFormat,
  onProgress?: (done: number, total: number) => void,
): Promise<{ succeeded: number; failed: number; errors: string[] }> {
  let succeeded = 0
  let failed = 0
  const errors: string[] = []

  for (let i = 0; i < testCases.length; i++) {
    const result = await sendToQase(testCases[i], config, format)
    if (result.success) succeeded++
    else { failed++; errors.push(`${testCases[i].id}: ${result.error}`) }
    onProgress?.(i + 1, testCases.length)
    // Rate limit: 50ms between requests
    if (i < testCases.length - 1) await new Promise(r => setTimeout(r, 50))
  }

  return { succeeded, failed, errors }
}
