import { useState } from 'react'
import { useUILanguage } from '../../contexts/UILanguageContext'

type ModalType = 'terms' | 'privacy' | 'cookies' | null

const MODAL_CONTENT = {
  terms: {
    title: { 'pt-br': 'Termos de Serviço', 'en': 'Terms of Service', 'es': 'Términos de Servicio' },
    body: {
      'pt-br': `**TestCaseForge — Termos de Serviço**\nVersão 1.0 · Vigência: abril de 2026\n\n**1. Aceitação**\nAo utilizar o TestCaseForge ("Serviço"), você concorda com estes Termos. Se não concordar, não utilize o Serviço.\n\n**2. Descrição do Serviço**\nO TestCaseForge é uma ferramenta gratuita e client-side para geração de casos de teste a partir de Histórias de Usuário. Todo processamento ocorre localmente no seu navegador — nenhum dado é enviado a servidores externos.\n\n**3. Uso Permitido**\nVocê pode utilizar o Serviço para fins pessoais, acadêmicos e profissionais. É vedado utilizar o Serviço para fins ilegais ou que violem direitos de terceiros.\n\n**4. Propriedade Intelectual**\nO código-fonte está disponível sob licença MIT. Os casos de teste gerados são de propriedade exclusiva do usuário que os gerou.\n\n**5. Isenção de Responsabilidade**\nO Serviço é fornecido "como está", sem garantias de qualquer natureza. O autor não se responsabiliza por eventuais erros nos casos de teste gerados.\n\n**6. Alterações**\nEstes Termos podem ser atualizados a qualquer momento. A versão vigente estará sempre disponível no site.\n\n**7. Contato**\naluiztenorio@gmail.com`,
      'en': `**TestCaseForge — Terms of Service**\nVersion 1.0 · Effective: April 2026\n\n**1. Acceptance**\nBy using TestCaseForge ("Service"), you agree to these Terms. If you do not agree, do not use the Service.\n\n**2. Service Description**\nTestCaseForge is a free, client-side tool for generating test cases from User Stories. All processing happens locally in your browser — no data is sent to external servers.\n\n**3. Permitted Use**\nYou may use the Service for personal, academic, and professional purposes. Using the Service for illegal purposes or in violation of third-party rights is prohibited.\n\n**4. Intellectual Property**\nThe source code is available under the MIT license. Generated test cases are the exclusive property of the user who generated them.\n\n**5. Disclaimer**\nThe Service is provided "as is", without warranties of any kind. The author is not responsible for any errors in generated test cases.\n\n**6. Changes**\nThese Terms may be updated at any time. The current version will always be available on the site.\n\n**7. Contact**\naluiztenorio@gmail.com`,
      'es': `**TestCaseForge — Términos de Servicio**\nVersión 1.0 · Vigencia: abril de 2026\n\n**1. Aceptación**\nAl utilizar TestCaseForge ("Servicio"), usted acepta estos Términos. Si no está de acuerdo, no utilice el Servicio.\n\n**2. Descripción del Servicio**\nTestCaseForge es una herramienta gratuita y del lado del cliente para generar casos de prueba a partir de Historias de Usuario. Todo el procesamiento ocurre localmente en su navegador — ningún dato se envía a servidores externos.\n\n**3. Uso Permitido**\nPuede utilizar el Servicio para fines personales, académicos y profesionales. Está prohibido utilizarlo para fines ilegales o que violen derechos de terceros.\n\n**4. Propiedad Intelectual**\nEl código fuente está disponible bajo licencia MIT. Los casos de prueba generados son propiedad exclusiva del usuario que los generó.\n\n**5. Exención de Responsabilidad**\nEl Servicio se proporciona "tal cual", sin garantías de ningún tipo. El autor no es responsable de errores en los casos de prueba generados.\n\n**6. Cambios**\nEstos Términos pueden actualizarse en cualquier momento. La versión vigente siempre estará disponible en el sitio.\n\n**7. Contacto**\naluiztenorio@gmail.com`,
    },
  },
  privacy: {
    title: { 'pt-br': 'Política de Privacidade', 'en': 'Privacy Policy', 'es': 'Política de Privacidad' },
    body: {
      'pt-br': `**TestCaseForge — Política de Privacidade**\nVersão 1.0 · Vigência: abril de 2026\n\n**1. Compromisso com sua privacidade**\nO TestCaseForge foi projetado com privacidade em primeiro lugar. Não coletamos, armazenamos nem transmitimos nenhum dado pessoal.\n\n**2. Dados processados**\nTodo conteúdo inserido (Histórias de Usuário, metadados) é processado exclusivamente no seu navegador (client-side). Nenhuma informação é enviada a servidores.\n\n**3. Armazenamento local**\nO Serviço utiliza o localStorage do navegador apenas para salvar: histórico de gerações, métricas de uso e preferências de idioma/tema. Esses dados ficam no seu dispositivo e podem ser apagados a qualquer momento.\n\n**4. Cookies**\nNão utilizamos cookies de rastreamento ou de terceiros. Apenas cookies de sessão essenciais para o funcionamento da aplicação.\n\n**5. Terceiros**\nNão compartilhamos dados com terceiros. O Serviço não possui integrações com serviços de analytics.\n\n**6. LGPD**\nEm conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Como não coletamos dados pessoais, não há base legal a ser declarada.\n\n**7. Contato**\nDúvidas: aluiztenorio@gmail.com`,
      'en': `**TestCaseForge — Privacy Policy**\nVersion 1.0 · Effective: April 2026\n\n**1. Privacy Commitment**\nTestCaseForge was designed with privacy first. We do not collect, store, or transmit any personal data.\n\n**2. Processed Data**\nAll content entered (User Stories, metadata) is processed exclusively in your browser (client-side). No information is sent to servers.\n\n**3. Local Storage**\nThe Service uses browser localStorage only to save: generation history, usage metrics, and language/theme preferences. This data stays on your device and can be deleted at any time.\n\n**4. Cookies**\nWe do not use tracking or third-party cookies. Only essential session cookies for application functionality.\n\n**5. Third Parties**\nWe do not share data with third parties. The Service has no analytics integrations.\n\n**6. Contact**\nQuestions: aluiztenorio@gmail.com`,
      'es': `**TestCaseForge — Política de Privacidad**\nVersión 1.0 · Vigencia: abril de 2026\n\n**1. Compromiso con su privacidad**\nTestCaseForge fue diseñado con la privacidad en primer lugar. No recopilamos, almacenamos ni transmitimos ningún dato personal.\n\n**2. Datos procesados**\nTodo el contenido ingresado (Historias de Usuario, metadatos) se procesa exclusivamente en su navegador (client-side). No se envía ninguna información a servidores.\n\n**3. Almacenamiento local**\nEl Servicio utiliza el localStorage del navegador solo para guardar: historial de generaciones, métricas de uso y preferencias de idioma/tema. Estos datos permanecen en su dispositivo y pueden eliminarse en cualquier momento.\n\n**4. Cookies**\nNo utilizamos cookies de seguimiento ni de terceros. Solo cookies de sesión esenciales para el funcionamiento de la aplicación.\n\n**5. Terceros**\nNo compartimos datos con terceros. El Servicio no tiene integraciones de analíticas.\n\n**6. Contacto**\nPreguntas: aluiztenorio@gmail.com`,
    },
  },
  cookies: {
    title: { 'pt-br': 'Configurações de Cookies', 'en': 'Cookie Settings', 'es': 'Configuración de Cookies' },
    body: {
      'pt-br': `**TestCaseForge — Política de Cookies**\nVersão 1.0 · Vigência: abril de 2026\n\n**Não utilizamos cookies de rastreamento.**\n\nO TestCaseForge é uma aplicação 100% client-side. Veja o que é armazenado localmente:\n\n**localStorage (no seu navegador)**\n• Histórico de gerações — últimas 20 execuções\n• Métricas de uso — contadores locais anônimos\n• Preferência de idioma — pt-br, en ou es\n• Preferência de tema — claro ou escuro\n\n**O que NÃO fazemos**\n• Não usamos cookies de terceiros\n• Não rastreamos comportamento\n• Não usamos Google Analytics, Hotjar ou similares\n• Não vendemos dados (porque não temos dados)\n\n**Como limpar seus dados**\nAbra o DevTools do navegador → Application → Local Storage → selecione o domínio → Delete All.\n\nOu acesse as configurações do seu navegador e limpe os dados do site.\n\n**Dúvidas:** aluiztenorio@gmail.com`,
      'en': `**TestCaseForge — Cookie Policy**\nVersion 1.0 · Effective: April 2026\n\n**We do not use tracking cookies.**\n\nTestCaseForge is a 100% client-side application. Here is what is stored locally:\n\n**localStorage (in your browser)**\n• Generation history — last 20 runs\n• Usage metrics — anonymous local counters\n• Language preference — pt-br, en, or es\n• Theme preference — light or dark\n\n**What we do NOT do**\n• No third-party cookies\n• No behavior tracking\n• No Google Analytics, Hotjar, or similar\n• No data selling (because we have no data)\n\n**How to clear your data**\nOpen browser DevTools → Application → Local Storage → select domain → Delete All.\n\nOr go to your browser settings and clear site data.\n\n**Questions:** aluiztenorio@gmail.com`,
      'es': `**TestCaseForge — Política de Cookies**\nVersión 1.0 · Vigencia: abril de 2026\n\n**No utilizamos cookies de seguimiento.**\n\nTestCaseForge es una aplicación 100% del lado del cliente. Esto es lo que se almacena localmente:\n\n**localStorage (en su navegador)**\n• Historial de generaciones — últimas 20 ejecuciones\n• Métricas de uso — contadores locales anónimos\n• Preferencia de idioma — pt-br, en o es\n• Preferencia de tema — claro u oscuro\n\n**Lo que NO hacemos**\n• Sin cookies de terceros\n• Sin seguimiento de comportamiento\n• Sin Google Analytics, Hotjar ni similares\n• Sin venta de datos (porque no tenemos datos)\n\n**Cómo borrar sus datos**\nAbra DevTools del navegador → Application → Local Storage → seleccione el dominio → Delete All.\n\n**Preguntas:** aluiztenorio@gmail.com`,
    },
  },
}

function renderBody(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-semibold text-slate-200 mt-4 first:mt-0">{line.replace(/\*\*/g, '')}</p>
    }
    if (line.startsWith('**') && line.includes('**')) {
      const parts = line.split('**')
      return (
        <p key={i} className="mt-3">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-slate-200">{p}</strong> : p)}
        </p>
      )
    }
    if (line.startsWith('• ')) {
      return <p key={i} className="pl-4 before:content-['•'] before:mr-2 before:text-slate-500">{line.slice(2)}</p>
    }
    if (line === '') return <div key={i} className="h-1" />
    return <p key={i}>{line}</p>
  })
}

export default function Footer() {
  const { uiLang: lang } = useUILanguage()
  const [modal, setModal] = useState<ModalType>(null)

  const openModal = (type: ModalType) => setModal(type)
  const closeModal = () => setModal(null)

  const currentYear = new Date().getFullYear()

  const navLinks = {
    product: [
      { label: { 'pt-br': 'Sobre', 'en': 'About', 'es': 'Acerca de' }, href: 'https://github.com/AndreLTenorio/testcaseforge#readme' },
      { label: { 'pt-br': 'Como funciona', 'en': 'How it works', 'es': 'Cómo funciona' }, href: 'https://github.com/AndreLTenorio/testcaseforge#como-usar' },
      { label: { 'pt-br': 'Roadmap', 'en': 'Roadmap', 'es': 'Roadmap' }, href: 'https://github.com/AndreLTenorio/testcaseforge/issues' },
    ],
    legal: [
      { label: { 'pt-br': 'Termos de Serviço', 'en': 'Terms of Service', 'es': 'Términos de Servicio' }, modal: 'terms' as ModalType },
      { label: { 'pt-br': 'Política de Privacidade', 'en': 'Privacy Policy', 'es': 'Política de Privacidad' }, modal: 'privacy' as ModalType },
      { label: { 'pt-br': 'Cookies', 'en': 'Cookies', 'es': 'Cookies' }, modal: 'cookies' as ModalType },
    ],
    resources: [
      { label: { 'pt-br': 'Documentação', 'en': 'Documentation', 'es': 'Documentación' }, href: 'https://github.com/AndreLTenorio/testcaseforge/blob/main/README.md' },
      { label: { 'pt-br': 'GitHub', 'en': 'GitHub', 'es': 'GitHub' }, href: 'https://github.com/AndreLTenorio/testcaseforge' },
      { label: { 'pt-br': 'Contato', 'en': 'Contact', 'es': 'Contacto' }, href: 'mailto:aluiztenorio@gmail.com' },
    ],
  }

  const colTitle = 'text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3'
  const linkClass = 'text-sm text-slate-400 hover:text-white transition-colors block mb-2'

  return (
    <>
      <footer className="bg-[#1e1e1c] text-slate-300 mt-auto border-t border-slate-700/50">
        {/* Main columns */}
        <div className="max-w-screen-2xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <p className="font-bold text-white text-base mb-1">TestCaseForge</p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {lang === 'pt-br' && 'Geração de casos de teste baseada em ISTQB/CTFL 4.0. 100% client-side, sem IA.'}
              {lang === 'en'    && 'ISTQB/CTFL 4.0-based test case generation. 100% client-side, no AI.'}
              {lang === 'es'    && 'Generación de casos de prueba basada en ISTQB/CTFL 4.0. 100% client-side, sin IA.'}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/andreluiztenorio/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://github.com/AndreLTenorio/testcaseforge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <p className={colTitle}>
              {lang === 'pt-br' ? 'Produto' : lang === 'en' ? 'Product' : 'Producto'}
            </p>
            {navLinks.product.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.label[lang]}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p className={colTitle}>Legal</p>
            {navLinks.legal.map((link) => (
              <button
                key={link.modal}
                onClick={() => openModal(link.modal)}
                className={linkClass + ' text-left cursor-pointer'}
              >
                {link.label[lang]}
              </button>
            ))}
          </div>

          {/* Recursos */}
          <div>
            <p className={colTitle}>
              {lang === 'pt-br' ? 'Recursos' : lang === 'en' ? 'Resources' : 'Recursos'}
            </p>
            {navLinks.resources.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.label[lang]}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-700/50">
          <div className="max-w-screen-2xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              © {currentYear} TestCaseForge · {lang === 'pt-br' ? 'Feito por' : 'Made by'}{' '}
              <a
                href="https://www.linkedin.com/in/andreluiztenorio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                André Almeida
              </a>
              {' · '}MIT License
            </span>
            <span className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <span className="text-slate-600 hidden sm:inline">React · TypeScript · Tailwind CSS</span>
              <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-slate-400">v1.0.0</span>
              <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-semibold">Beta</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-[#1e1e1c] border border-slate-700 rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="font-semibold text-white text-base">
                {MODAL_CONTENT[modal].title[lang]}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-4 text-sm text-slate-400 leading-relaxed space-y-0.5">
              {renderBody(MODAL_CONTENT[modal].body[lang])}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-700">
              <button
                onClick={closeModal}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition-colors text-sm"
              >
                {lang === 'pt-br' ? 'Fechar' : lang === 'en' ? 'Close' : 'Cerrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
