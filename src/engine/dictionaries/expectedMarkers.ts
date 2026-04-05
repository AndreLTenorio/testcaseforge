import type { Language } from '../types'

export const EXPECTED_RESULT_MARKERS: Record<Language, string[]> = {
  'es': [
    'debe', 'debería', 'deberá', 'se espera', 'es esperado',
    'el sistema muestra', 'el sistema presenta', 'el sistema redirige',
    'mensaje de', 'pantalla de', 'se muestra', 'se presenta',
    'el usuario es redirigido', 'el campo queda', 'el botón queda',
    'no debe', 'no puede', 'no permite', 'impide', 'bloquea',
    'será mostrado', 'será presentado', 'será redirigido',
  ],
  'pt-br': [
    'deve', 'deveria', 'deverá', 'espera-se', 'é esperado',
    'sistema exibe', 'sistema apresenta', 'sistema redireciona',
    'mensagem de', 'tela de', 'é exibido', 'é apresentado',
    'o usuário é redirecionado', 'o campo fica', 'o botão fica',
    'não deve', 'não pode', 'não permite', 'impede', 'é bloqueado',
    'será exibido', 'será apresentado', 'será redirecionado',
    'deve ser exibido', 'deve ser apresentado',
  ],
  'en': [
    'should', 'shall', 'must', 'is expected', 'will be',
    'system displays', 'system shows', 'system redirects',
    'message of', 'screen of', 'is displayed', 'is shown',
    'user is redirected', 'field becomes', 'button becomes',
    'should not', 'cannot', 'must not', 'prevents', 'does not allow',
    'will be displayed', 'will be shown', 'will redirect',
    'should be displayed', 'should be shown',
  ],
}

export function containsExpectedMarker(text: string, lang: Language): boolean {
  const lower = text.toLowerCase()
  return EXPECTED_RESULT_MARKERS[lang].some(m => lower.includes(m))
}
