/**
 * Sanitizes raw Jira/text input:
 * - Removes Jira markup (e.g., *bold*, _italic_, {{code}}, [link|url])
 * - Normalizes line breaks
 * - Strips leading/trailing whitespace per line
 */
export function sanitize(raw: string): string {
  let text = raw

  // Normalize checkbox markdown FIRST — before Jira link removal clobbers [ ] / [x]
  text = text.replace(/^\s*[-*•]\s*\[[ xX]?\]\s*/gm, '- ')

  // Remove Jira formatting markers
  text = text.replace(/\{\{.*?\}\}/g, '') // inline code
  text = text.replace(/\{code.*?\}[\s\S]*?\{code\}/gi, '') // code blocks
  text = text.replace(/\{noformat\}[\s\S]*?\{noformat\}/gi, '')
  text = text.replace(/\[([^\]|]+)\|[^\]]+\]/g, '$1') // [text|url] -> text
  text = text.replace(/\[([^\]]+)\]/g, '$1') // [text] -> text

  // Remove Jira text effects: *bold*, _italic_, +underline+, -strikethrough-, ^superscript^, ~subscript~
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/_([^_]+)_/g, '$1')
  text = text.replace(/\+([^+]+)\+/g, '$1')
  text = text.replace(/-([^-\n\r]+)-/g, '$1')
  text = text.replace(/\^([^^]+)\^/g, '$1')
  text = text.replace(/~([^~]+)~/g, '$1')

  // Remove Jira color macros {color:...}...{color}
  text = text.replace(/\{color:[^}]+\}/gi, '')
  text = text.replace(/\{color\}/gi, '')

  // Remove HTML tags if any
  text = text.replace(/<[^>]+>/g, '')

  // Normalize Windows line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Remove trailing spaces per line
  text = text.split('\n').map(l => l.trimEnd()).join('\n')

  // Collapse 3+ consecutive blank lines into 2
  text = text.replace(/\n{3,}/g, '\n\n')

  return text.trim()
}
