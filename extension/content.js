/**
 * TestCaseForge — Content Script
 * Injected into Jira pages. Adds a "⚒️ Gerar Casos" button to story detail views.
 */

const BUTTON_ID = 'tcf-inject-btn'
const PANEL_ID  = 'tcf-panel'

// ── Jira story text extraction ─────────────────────────────────────────────
function extractJiraStoryText() {
  const selectors = [
    // Jira Next-gen
    '[data-testid="issue.views.issue-details.issue-layout"] [data-testid*="description"]',
    '[data-component-selector="issue-details-panel"]',
    // Jira Classic
    '#description-val',
    '.user-content-block',
    // Fallback
    '[data-testid="issue-description"]',
    '.description',
  ]

  for (const sel of selectors) {
    const el = document.querySelector(sel)
    if (el?.textContent?.trim()) return el.textContent.trim()
  }

  // Try to get the whole visible page text as last resort
  return document.title + '\n\n' + (document.body?.innerText?.slice(0, 3000) ?? '')
}

// ── Floating button injection ──────────────────────────────────────────────
function injectButton() {
  if (document.getElementById(BUTTON_ID)) return

  const btn = document.createElement('button')
  btn.id   = BUTTON_ID
  btn.textContent = '⚒️ Gerar Casos'
  btn.title = 'TestCaseForge — Gerar Casos de Teste'
  btn.addEventListener('click', togglePanel)
  document.body.appendChild(btn)
}

// ── Side panel ─────────────────────────────────────────────────────────────
function togglePanel() {
  let panel = document.getElementById(PANEL_ID)
  if (panel) { panel.remove(); return }

  panel = document.createElement('div')
  panel.id = PANEL_ID

  const storyText = extractJiraStoryText()

  panel.innerHTML = `
    <div id="tcf-header">
      <span>⚒️ TestCaseForge</span>
      <button id="tcf-close">✕</button>
    </div>
    <div id="tcf-body">
      <p class="tcf-label">Texto extraído do Jira:</p>
      <textarea id="tcf-textarea" rows="8" placeholder="Texto da User Story...">${escapeHtml(storyText)}</textarea>
      <div class="tcf-row">
        <select id="tcf-format">
          <option value="procedural">Procedural</option>
          <option value="gherkin">Gherkin/BDD</option>
          <option value="both">Ambos</option>
        </select>
        <button id="tcf-generate">⚒️ Gerar</button>
      </div>
      <div id="tcf-output"></div>
      <a href="https://testcaseforge.vercel.app" target="_blank" id="tcf-link">
        Abrir TestCaseForge completo ↗
      </a>
    </div>
  `

  document.body.appendChild(panel)

  document.getElementById('tcf-close').addEventListener('click', () => panel.remove())
  document.getElementById('tcf-generate').addEventListener('click', handleGenerate)
}

function handleGenerate() {
  const textarea = document.getElementById('tcf-textarea')
  const output   = document.getElementById('tcf-output')
  const format   = document.getElementById('tcf-format').value
  const text     = textarea?.value?.trim()

  if (!text) { output.textContent = 'Cole o texto da User Story antes de gerar.'; return }

  // Send to background for processing (avoids CSP issues with eval)
  chrome.runtime.sendMessage({ type: 'GENERATE', text, format }, (response) => {
    if (!response?.testCases?.length) {
      output.innerHTML = '<p class="tcf-error">Nenhum caso gerado. Verifique o texto.</p>'
      return
    }
    renderCases(output, response.testCases, format)
  })
}

function renderCases(container, testCases, format) {
  const positives = testCases.filter(t => t.kind === 'positive').length
  const negatives = testCases.filter(t => t.kind === 'negative').length

  container.innerHTML = `
    <div class="tcf-stats">
      <strong>${testCases.length} casos</strong>
      <span class="tcf-pos">✓ ${positives}</span>
      <span class="tcf-neg">✗ ${negatives}</span>
    </div>
    ${testCases.map(tc => `
      <div class="tcf-case tcf-case--${tc.kind}">
        <div class="tcf-case-title">${escapeHtml(tc.title)}</div>
        <button class="tcf-copy" data-id="${tc.id}">📋 Copiar</button>
      </div>
    `).join('')}
    <button id="tcf-copy-all">📋 Copiar Todos</button>
  `

  // Attach copy handlers
  container.querySelectorAll('.tcf-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id')
      const tc = testCases.find(t => t.id === id)
      if (!tc) return
      const text = buildCopyText(tc, format)
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copiado!'
        setTimeout(() => { btn.textContent = '📋 Copiar' }, 1500)
      })
    })
  })

  document.getElementById('tcf-copy-all')?.addEventListener('click', () => {
    const allText = testCases.map(tc => buildCopyText(tc, format)).join('\n\n---\n\n')
    navigator.clipboard.writeText(allText).then(() => {
      const btn = document.getElementById('tcf-copy-all')
      if (btn) { btn.textContent = '✓ Todos Copiados!'; setTimeout(() => { btn.textContent = '📋 Copiar Todos' }, 1500) }
    })
  })
}

function buildCopyText(tc, format) {
  const lines = [tc.title, `Prioridade: ${tc.priority} | Comportamento: ${tc.behavior}`, '']
  if (tc.preconditions.length > 0) {
    lines.push('Pré-condições:')
    tc.preconditions.forEach(p => lines.push(`  - ${p}`))
    lines.push('')
  }
  if (format !== 'gherkin' && tc.steps.length > 0) {
    lines.push('# | Step Action | Data | Expected Result')
    tc.steps.forEach(s => lines.push(`${s.number} | ${s.action} | ${s.data} | ${s.expectedResult}`))
  }
  if (format !== 'procedural' && tc.gherkinSteps.length > 0) {
    tc.gherkinSteps.forEach(s => lines.push(`${s.keyword} ${s.text}`))
  }
  return lines.join('\n')
}

function escapeHtml(str) {
  return (str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

// ── Observe DOM changes (Jira is a SPA) ───────────────────────────────────
const observer = new MutationObserver(() => {
  const isIssuePage = /\/browse\/|\/issues\/|jira.*\/board/.test(window.location.href)
  if (isIssuePage) injectButton()
})

observer.observe(document.body, { childList: true, subtree: true })

// Initial check
if (/\/browse\/|\/issues\/|jira.*\/board/.test(window.location.href)) injectButton()
