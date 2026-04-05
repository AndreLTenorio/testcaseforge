import type { GherkinStep } from '../../engine/types'

interface GherkinViewProps {
  steps: GherkinStep[]
  feature?: string
  persona?: string | null
  action?: string | null
  benefit?: string | null
  scenarioTitle?: string
}

const KEYWORD_STYLE: Record<GherkinStep['keyword'], string> = {
  Given: 'kw-given',
  When:  'kw-when',
  Then:  'kw-then',
  And:   'kw-and',
  But:   'kw-but',
}

function highlightText(text: string): string {
  // Highlight quoted strings
  return text.replace(/"([^"]+)"/g, '<span class="kw-string">"$1"</span>')
}

export default function GherkinView({ steps, feature, persona, action, benefit, scenarioTitle }: GherkinViewProps) {
  return (
    <div className="gherkin-block">
      {feature && (
        <div className="mb-3">
          <span className="kw-feature">Feature:</span>{' '}
          <span className="gherkin-text">{feature}</span>
          {persona  && <div className="ml-4 gherkin-text"><span className="kw-comment">  # Como</span> {persona}</div>}
          {action   && <div className="ml-4 gherkin-text"><span className="kw-comment">  # Eu quero</span> {action}</div>}
          {benefit  && <div className="ml-4 gherkin-text"><span className="kw-comment">  # Para que</span> {benefit}</div>}
        </div>
      )}

      {scenarioTitle && (
        <div className="mb-2 ml-2">
          <span className="kw-scenario">Scenario:</span>{' '}
          <span className="gherkin-text">{scenarioTitle}</span>
        </div>
      )}

      <div className="space-y-0.5 ml-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-2">
            <span className={`font-semibold min-w-[44px] text-right shrink-0 ${KEYWORD_STYLE[step.keyword]}`}>
              {step.keyword}
            </span>
            <span
              className="gherkin-text"
              dangerouslySetInnerHTML={{ __html: highlightText(step.text) }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
