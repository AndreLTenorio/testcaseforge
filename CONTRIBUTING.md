# Contributing to TestCaseForge

Thank you for your interest in contributing! This document explains how to get involved.

## Ways to Contribute

- **Bug reports** — open a GitHub Issue with the "bug" label
- **Feature requests** — open a GitHub Issue with the "enhancement" label
- **Dictionary contributions** — add verbs, markers, or patterns for any supported language
- **New language support** — add a new language following the guide below
- **Test coverage** — add Vitest tests under `tests/`
- **Documentation** — improve this file, the README, or inline comments

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
git clone https://github.com/your-org/testcaseforge.git
cd testcaseforge
npm install
npm run dev
```

### Running Tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

### Building

```bash
npm run build     # TypeScript check + Vite bundle
```

---

## Project Structure

```
src/
  engine/
    parser/           # sanitizer, languageDetector, sectionSplitter, criteriaExtractor
    generator/        # proceduralGenerator, gherkinGenerator
    dictionaries/     # actionVerbs, expectedMarkers, dataTypes
    i18n.ts           # centralized multilingual labels (t(key, lang))
    types.ts          # all TypeScript interfaces
  components/         # React UI components
  hooks/              # useHistory, useMetrics, useToast
  export/             # clipboard, exporters, qaseApi
tests/
  parser/             # unit + integration tests
  generator/          # generator unit tests
extension/            # Chrome Extension (Manifest V3)
```

---

## Adding Dictionary Entries

### Action Verbs (`src/engine/dictionaries/actionVerbs.ts`)

Each language entry is a `Record<VerbCategory, string[]>`. Add your verbs to the relevant category:

```typescript
// Example: adding a new PT-BR navigation verb
'pt-br': {
  navigation: ['acessar', 'navegar', ..., 'seu-novo-verbo'],
  ...
}
```

Verbs are matched against criterion text using `startsWith` and `includes`.
**Keep them lowercase.** Sort longer phrases before shorter ones to avoid partial matches.

### Expected Result Markers (`src/engine/dictionaries/expectedMarkers.ts`)

Markers are used to identify which sentence in a criterion is the expected result.

```typescript
'en': [
  'should', 'must', 'system displays', ..., 'your-new-marker',
]
```

### Adding a New Language

1. Add the language code to `Language` type in `src/engine/types.ts`
2. Add keyword arrays in `languageDetector.ts`
3. Add section header patterns in `sectionSplitter.ts` (`SECTION_HEADERS`)
4. Add user story part patterns in `sectionSplitter.ts` (`extractUserStoryParts`)
5. Add feature label in `sectionSplitter.ts` (`FEATURE_LABELS`)
6. Add action verbs in `actionVerbs.ts`
7. Add expected result markers in `expectedMarkers.ts`
8. Add all label keys in `i18n.ts`
9. Add negative rule checks in `proceduralGenerator.ts`
10. Add tests in `tests/parser/languageDetector.test.ts` and `tests/parser/integration.test.ts`

---

## Code Style

- **TypeScript strict mode** — no `any`, no unused vars
- **No AI, no backend** — the engine must remain 100% deterministic and client-side
- **i18n** — all user-facing strings must go through `t(key, lang)` in `i18n.ts`
- **Tests required** — any new engine logic needs corresponding Vitest tests

---

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes with tests
4. Run `npm test` and `npm run build` — both must pass
5. Open a PR against `main` with a clear description of what changed and why

---

## Reporting Bugs

Please include:
- The User Story text you used as input (or a minimal reproduction)
- The language detected (shown in the output header)
- The format selected (Procedural / Gherkin)
- What you expected vs. what you got
- Browser / OS

---

## Code of Conduct

Be respectful and constructive. This project welcomes contributors of all backgrounds and experience levels.
