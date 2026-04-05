<div align="center">

# ⚒️ TestCaseForge

### *Forjando Casos de Teste com Precisão*

**A ferramenta open-source que todo QA precisava — e André Almeida construiu.**

<br/>

[![MIT License](https://img.shields.io/badge/Licença-MIT-22c55e?style=for-the-badge)](LICENSE)
[![ISTQB CTFL 4.0](https://img.shields.io/badge/ISTQB%2FCTFL-4.0-f59e0b?style=for-the-badge&logo=bookstack&logoColor=white)](https://www.istqb.org)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Vitest](https://img.shields.io/badge/Vitest-53%20testes-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev)

<br/>

[![PT-BR](https://img.shields.io/badge/🇧🇷_PT--BR-supported-009c3b?style=flat-square)]()
[![EN](https://img.shields.io/badge/🇺🇸_EN-supported-3c3b6e?style=flat-square)]()
[![ES](https://img.shields.io/badge/🇪🇸_ES-supported-c60b1e?style=flat-square)]()

<br/>

> **Cole sua User Story. Receba Casos de Teste prontos.**
> **Sem IA. Sem servidor. Sem custo. 100% no seu navegador.**

<br/>

[🚀 Usar Agora](#-demonstração) · [📖 Documentação](#-como-funciona) · [🤝 Contribuir](CONTRIBUTING.md) · [⭐ Dar uma Estrela](https://github.com/AndreLTenorio/testcaseforge)

</div>

---

## 🎯 O Problema que Resolve

Todo QA já viveu isso: Sprint começa, o dev já está codando, e você tem **15 User Stories pra cobrir** e uma planilha em branco na tela.

Ferramentas de IA? Hallucinations, custo por token, dados da empresa saindo pela internet, resultado inconsistente a cada geração.

Templates manuais? Lento demais. Copy-paste que quebra o formato. Critérios esquecidos.

**TestCaseForge resolve isso em segundos, localmente, de graça, com 100% de repetibilidade.**

---

## ✨ Funcionalidades

<table>
<tr>
<td width="50%">

### 🧠 Motor Determinístico
- Parsing inteligente do texto da User Story
- Detecção automática de idioma (PT-BR, EN, ES)
- Extração de Critérios de Aceite e Regras de Negócio
- Zero IA — resultado idêntico para o mesmo input

### 📋 Formatos de Saída
- **Procedural** — Step Action · Input Data · Expected Result
- **Gherkin/BDD** — Given · When · Then
- **Ambos** — os dois formatos juntos

### 🎯 Técnicas ISTQB/CTFL 4.0
- Partição de Equivalência (EP)
- Análise de Valor Limite (BVA)
- Casos Positivos, Negativos e de Borda

</td>
<td width="50%">

### 🌍 Multilíngue de Verdade
- Interface em 🇧🇷 PT-BR, 🇺🇸 EN e 🇪🇸 ES
- Engine processa User Stories nos 3 idiomas
- Casos gerados no idioma da Story

### 🔧 Workflow Completo
- ✅ Edição inline de cada caso gerado
- ✅ Copiar individual ou todos de uma vez
- ✅ Exportar JSON / CSV / Markdown
- ✅ Integração com Qase (API v1)
- ✅ Importação em lote (múltiplas Stories)
- ✅ Histórico local das últimas 20 gerações
- ✅ Dashboard de métricas de uso
- ✅ Tema Dark / Light

### ⚡ Zero Dependências de Runtime
- Roda 100% no navegador
- Sem backend, sem conta, sem API key
- Funciona offline após o primeiro load
- Chrome Extension incluída para uso direto no Jira

</td>
</tr>
</table>

---

## 🎬 Demonstração

```
INPUT — Cole isso no TestCaseForge:

  Como um usuário,
  Eu quero fazer login no sistema,
  Para que eu possa acessar minha conta.

  Critérios de Aceite:
  1. O usuário deve informar e-mail e senha válidos
  2. O sistema deve exibir mensagem de erro para credenciais inválidas
  3. Usuário com 3 tentativas falhas deve ser bloqueado por 30 minutos


OUTPUT — Receba em menos de 1 segundo:

  ┌─────────────────────────────────────────────────────────────────┐
  │ TC-001 · Realizar login com credenciais válidas    ✅ Positivo  │
  │ TC-002 · Tentar login com e-mail inválido          ❌ Negativo  │
  │ TC-003 · Tentar login com senha inválida           ❌ Negativo  │
  │ TC-004 · Usuário bloqueado após 3 tentativas       ❌ Negativo  │
  │ TC-005 · Tentativas — Valor no limite (BVA min)    📐 BVA       │
  │ TC-006 · Tentativas — Valor abaixo do limite       📐 BVA       │
  │ TC-007 · Tentativas — Valor acima do limite        📐 BVA       │
  └─────────────────────────────────────────────────────────────────┘

  Formato Gherkin gerado automaticamente:

  Scenario: Realizar login com credenciais válidas
    Given que o usuário está na tela de login
    When o usuário informa e-mail e senha válidos
    Then o sistema deve permitir o acesso à conta
```

---

## 🏗️ Como Funciona

O engine segue um pipeline determinístico de 5 estágios:

```
User Story (texto bruto)
        │
        ▼
  ┌─────────────┐
  │  Sanitizer  │ → Remove formatação Jira/Markdown/HTML
  └─────────────┘
        │
        ▼
  ┌──────────────────┐
  │LanguageDetector  │ → Detecta PT-BR / EN / ES por vocabulário
  └──────────────────┘
        │
        ▼
  ┌────────────────┐
  │SectionSplitter │ → Separa Story Header, Acceptance Criteria, Business Rules
  └────────────────┘
        │
        ▼
  ┌──────────────────┐
  │CriteriaExtractor │ → Extrai critérios, identifica tipos (campo, limite, auth...)
  └──────────────────┘
        │
        ▼
  ┌──────────────────────────────────────┐
  │ Generator (Procedural | Gherkin)     │ → Aplica templates + BVA + Negativos
  └──────────────────────────────────────┘
        │
        ▼
  TestCase[] → UI → Export
```

---

## 📐 Técnicas ISTQB/CTFL 4.0 Aplicadas

Alinhado ao Syllabus CTFL 4.0, Capítulo 4 — Técnicas de Teste:

| Técnica | Referência ISTQB | Aplicação no TestCaseForge |
|---------|-----------------|---------------------------|
| **Partição de Equivalência** | CT-FL 4.3 | Identifica inputs nos critérios, gera classes válidas e inválidas |
| **Análise de Valor Limite** | CT-FL 4.4 | Detecta limites numéricos e gera testes em min-1, min, min+1, max-1, max, max+1 |
| **Teste de Caso de Uso** | CT-FL 4.8 | Cada critério de aceite mapeia para fluxo principal e alternativos |
| **Teste Positivo** | CT-FL 4.3.1 | Todo critério gera ao menos um Happy Path |
| **Teste Negativo** | CT-FL 4.3.2 | Campos obrigatórios, formatos, permissões, limites geram negativos automáticos |

---

## 🗂️ Estrutura do Projeto

```
testcaseforge/
├── 📁 src/
│   ├── 📁 engine/
│   │   ├── 📁 parser/
│   │   │   ├── sanitizer.ts          # Remove ruído: Jira markup, HTML, etc.
│   │   │   ├── languageDetector.ts   # Vocabulário PT-BR / EN / ES
│   │   │   ├── sectionSplitter.ts    # Story / Critérios / Regras
│   │   │   └── criteriaExtractor.ts  # Extrai e classifica critérios
│   │   ├── 📁 generator/
│   │   │   ├── proceduralGenerator.ts
│   │   │   └── gherkinGenerator.ts
│   │   ├── 📁 dictionaries/          # Verbos, marcadores, padrões por idioma
│   │   ├── i18n.ts                   # Labels gerados (PT-BR / EN / ES)
│   │   ├── ui18n.ts                  # Labels de interface (PT-BR / EN / ES)
│   │   └── types.ts
│   ├── 📁 components/
│   │   ├── 📁 input/                 # StoryInput, MetadataForm, FormatSelector, BatchImport
│   │   ├── 📁 output/                # TestCaseCard, TestCaseList, ExportToolbar, QaseExportModal
│   │   ├── 📁 layout/                # Header, Footer, HistoryPanel, MetricsDashboard, HowToUse
│   │   └── 📁 common/                # Badge, Toast, ThemeToggle
│   ├── 📁 contexts/
│   │   └── UILanguageContext.tsx     # Seletor de idioma da UI (🇧🇷/🇺🇸/🇪🇸)
│   ├── 📁 export/                    # clipboard, JSON, CSV, Markdown
│   └── 📁 hooks/                     # useTheme, useToast, useHistory, useMetrics
├── 📁 extension/                     # Chrome Extension (Manifest V3)
│   ├── manifest.json
│   ├── content.js                    # Injeção no Jira
│   ├── content.css
│   └── background.js                 # Engine completo como service worker
├── 📁 tests/
│   ├── parser/                       # 53 testes cobrindo PT-BR, EN e ES
│   └── generator/
└── 📁 .github/
    └── ISSUE_TEMPLATE/               # Bug report, feature request, contribuição de dicionário
```

---

## 🚀 Rodando Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/AndreLTenorio/testcaseforge.git
cd testcaseforge

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
# → http://localhost:5173

# 4. Rode os testes
npm test
# → 53 testes passando ✅

# 5. Build de produção
npm run build
```

---

## 🧩 Chrome Extension

O TestCaseForge também vem como extensão para Chrome, permitindo usar a ferramenta **diretamente dentro do Jira** sem sair da página:

1. Copie a pasta `extension/` do repositório
2. Abra `chrome://extensions/` e ative o **Modo do Desenvolvedor**
3. Clique em **"Carregar sem compactação"** e selecione a pasta `extension/`
4. Navegue para qualquer card do Jira — o botão ⚒️ aparecerá automaticamente

---

## 🤝 Contribuindo

Quer melhorar o TestCaseForge? Contribuições são super bem-vindas!

As áreas mais impactantes para contribuir:

- **📚 Dicionários** — Adicionar verbos de ação, marcadores de resultado esperado e padrões de tipo de dado em qualquer idioma
- **🌍 Novos idiomas** — O engine já suporta PT-BR, EN e ES. Adicionar FR, DE, IT é uma questão de dicionário
- **🧪 Testes** — Ampliar a suíte Vitest com mais cenários de edge cases
- **✨ Features** — Veja as issues abertas!

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para o guia completo.

---

## 📊 Status do Projeto

| Fase | Descrição | Status |
|------|-----------|--------|
| Fase 1 | Engine parser + geradores (PT-BR / EN) | ✅ Concluída |
| Fase 2 | UI completa (React + Tailwind) | ✅ Concluída |
| Fase 3 | Histórico, Batch, Exportações | ✅ Concluída |
| Fase 4 | Métricas, Qase, Chrome Extension, ES | ✅ Concluída |
| Fase 5 | Deploy, README, Open Source launch | 🚀 Agora |

---

## 👨‍💻 Autor

<div align="center">

<img src="https://github.com/AndreLTenorio.png" width="120" style="border-radius: 50%" alt="André Luiz Tenório"/>

### André Luiz Tenório
**QA Engineer · Analista de Qualidade de Software**

*Apaixonado por qualidade, automação e ferramentas que fazem a diferença no dia a dia do time.*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-André%20Luiz%20Tenório-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andreluiztenorio/)
[![GitHub](https://img.shields.io/badge/GitHub-AndreLTenorio-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AndreLTenorio)

</div>

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para mais informações.

Em resumo: **use, modifique, distribua, comercialize** — só não remove a atribuição. 😄

---

<div align="center">

**Se o TestCaseForge te salvou numa Sprint, deixa uma ⭐ — isso significa muito!**

<br/>

*Feito com ♥ e muito café por **André Luiz Tenório***
*Para a comunidade de QA que merecia uma ferramenta assim há muito tempo.*

<br/>

[![Visite o Projeto](https://img.shields.io/badge/🔗_Visite_o_Projeto-testcaseforge-30302E?style=for-the-badge)](https://github.com/AndreLTenorio/testcaseforge)

</div>
