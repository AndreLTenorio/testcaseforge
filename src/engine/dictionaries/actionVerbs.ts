import type { Language } from '../types'

type VerbCategory = 'navigation' | 'input' | 'selection' | 'submission' | 'validation' | 'visualization' | 'deletion' | 'edition' | 'authentication' | 'search' | 'upload' | 'state'

export const ACTION_VERBS: Record<Language, Record<VerbCategory, string[]>> = {
  'es': {
    navigation: ['acceder', 'navegar', 'abrir', 'ir a', 'visitar', 'entrar en', 'entrar al', 'dirigirse a'],
    input: ['rellenar', 'escribir', 'ingresar', 'introducir', 'digitar', 'proporcionar', 'indicar'],
    selection: ['seleccionar', 'elegir', 'marcar', 'desmarcar', 'hacer clic en', 'optar por', 'pulsar'],
    submission: ['enviar', 'guardar', 'confirmar', 'finalizar', 'completar', 'registrar', 'tramitar'],
    validation: ['validar', 'verificar', 'comprobar', 'revisar', 'asegurarse', 'confirmar'],
    visualization: ['visualizar', 'mostrar', 'ver', 'listar', 'cargar', 'consultar', 'presentar'],
    deletion: ['eliminar', 'borrar', 'suprimir', 'cancelar', 'limpiar', 'remover'],
    edition: ['editar', 'modificar', 'actualizar', 'cambiar', 'corregir', 'alterar'],
    authentication: ['iniciar sesión', 'autenticarse', 'cerrar sesión', 'loguearse', 'desconectarse'],
    search: ['buscar', 'filtrar', 'consultar', 'encontrar', 'localizar', 'pesquisar'],
    upload: ['subir archivo', 'adjuntar', 'cargar archivo', 'importar'],
    state: ['activar', 'desactivar', 'habilitar', 'deshabilitar', 'bloquear', 'desbloquear',
            'aprobar', 'rechazar', 'aceptar', 'denegar', 'suspender'],
  },
  'pt-br': {
    navigation: ['acessar', 'navegar', 'abrir', 'ir para', 'visitar', 'entrar em', 'entrar na', 'entrar no', 'ir até'],
    input: ['preencher', 'digitar', 'inserir', 'informar', 'escrever', 'inputar', 'colocar', 'fornecer'],
    selection: ['selecionar', 'escolher', 'marcar', 'desmarcar', 'clicar em', 'optar por', 'clicar no', 'clicar na'],
    submission: ['enviar', 'submeter', 'salvar', 'confirmar', 'concluir', 'finalizar', 'cadastrar', 'registrar'],
    validation: ['validar', 'verificar', 'checar', 'conferir', 'assegurar', 'garantir'],
    visualization: ['visualizar', 'exibir', 'mostrar', 'apresentar', 'listar', 'carregar', 'ver', 'consultar'],
    deletion: ['excluir', 'remover', 'deletar', 'apagar', 'cancelar', 'limpar'],
    edition: ['editar', 'alterar', 'modificar', 'atualizar', 'mudar', 'corrigir'],
    authentication: ['logar', 'autenticar', 'fazer login', 'entrar', 'sair', 'fazer logout', 'deslogar', 'efetuar login'],
    search: ['buscar', 'pesquisar', 'filtrar', 'procurar', 'consultar', 'localizar'],
    upload: ['enviar arquivo', 'anexar', 'fazer upload', 'carregar arquivo', 'importar'],
    state: ['ativar', 'desativar', 'habilitar', 'desabilitar', 'bloquear', 'desbloquear', 'aprovar', 'reprovar', 'rejeitar', 'aceitar', 'negar', 'suspender'],
  },
  'en': {
    navigation: ['access', 'navigate', 'open', 'go to', 'visit', 'enter', 'browse to'],
    input: ['fill', 'type', 'enter', 'input', 'write', 'provide', 'supply'],
    selection: ['select', 'choose', 'check', 'uncheck', 'click on', 'pick', 'toggle', 'click the', 'click'],
    submission: ['submit', 'save', 'confirm', 'complete', 'finish', 'register', 'send'],
    validation: ['validate', 'verify', 'check', 'ensure', 'assert', 'confirm'],
    visualization: ['view', 'display', 'show', 'present', 'list', 'load', 'see'],
    deletion: ['delete', 'remove', 'erase', 'cancel', 'clear'],
    edition: ['edit', 'change', 'modify', 'update', 'alter'],
    authentication: ['log in', 'sign in', 'authenticate', 'log out', 'sign out', 'login'],
    search: ['search', 'find', 'filter', 'look up', 'query', 'locate'],
    upload: ['upload', 'attach', 'send file', 'import'],
    state: ['activate', 'deactivate', 'enable', 'disable', 'block', 'unblock', 'approve', 'reject', 'deny', 'accept', 'suspend'],
  },
}

export function getAllVerbsForLanguage(lang: Language): string[] {
  const cats = ACTION_VERBS[lang]
  return Object.values(cats).flat()
}

export function getVerbCategory(verb: string, lang: Language): VerbCategory | null {
  const cats = ACTION_VERBS[lang]
  for (const [cat, verbs] of Object.entries(cats)) {
    if (verbs.some(v => verb.toLowerCase().includes(v))) {
      return cat as VerbCategory
    }
  }
  return null
}
