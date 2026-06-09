# NutriLabel — nutrition-labels

App mobile (Expo / React Native) que ajuda pacientes diabéticos brasileiros a
avaliar o conteúdo nutricional de alimentos embalados. O usuário escaneia o
código de barras; se o produto não está na base, fotografa o rótulo, que passa
por OCR + análise clínica. O resultado é uma avaliação de risco personalizada,
em linguagem adaptada ao perfil do usuário.

**Contexto:** TCC — UNESP FCT, Bacharelado em Ciência da Computação.

## Stack

- **Expo** (managed) + **TypeScript** (strict)
- **Expo Router** (navegação file-based)
- **NativeWind v4** (Tailwind no RN)
- **TanStack Query v5** + **axios** (estado de servidor / HTTP)
- **react-hook-form** + **zod** (formulários)
- **expo-camera** (barcode + foto), **expo-secure-store** (JWT), **expo-haptics**

## Pré-requisitos

- Node 20+
- **Yarn** (gerenciador de pacotes — não use npm)
- App **Expo Go** no celular ou um emulador Android/iOS

## Setup

```bash
yarn install
cp .env.example .env     # ajuste EXPO_PUBLIC_API_BASE_URL se necessário
yarn start               # abre o Metro bundler (escaneie o QR no Expo Go)
```

Outros scripts:

```bash
yarn android       # abre no emulador/dispositivo Android
yarn lint          # ESLint (expo lint)
yarn typecheck     # tsc --noEmit (strict)
```

## Backend

Consome a API REST FastAPI (`nutrition-labels-api`). Configure a base URL em
`.env` (`EXPO_PUBLIC_API_BASE_URL`, padrão `http://localhost:8000/api/v1`).

## Estrutura

```
app/            # rotas (Expo Router): (auth)/ e (app)/ + scan/history/profile
components/     # ui/ (primitivos), scan/, result/, auth/
services/       # api/ (client axios + endpoints), storage (secure-store)
hooks/          # wrappers TanStack Query (useAuth, useAnalyze, ...)
stores/         # estado de auth
types/          # tipos de API e domínio
constants/      # cores, risco, rotas
utils/          # formatadores, helpers de cor de risco
```

Detalhes em [fe/ARCHITECTURE.md](./fe/ARCHITECTURE.md). Especificação completa em
[`fe/`](./fe) e protótipo visual em [`claude-design/`](./claude-design).

## Como implementar (ordem)

O projeto é construído **parte a parte**. Cada subparte tem um plano próprio e
auto-contido em [`fe/plans/`](./fe/plans), e deve ser implementada nesta ordem
(cada uma depende das anteriores):

1. `01-design-system` — tokens, constantes e primitivos de UI
2. `02-api-auth-infra` — client axios, storage, services, hooks, auth store
3. `03-auth-screens` — welcome / login / register
4. `04-app-shell-home` — tabs + auth guard + Home
5. `05-barcode-scanner` — leitor de código de barras
6. `06-ocr-capture` — captura de foto do rótulo + `POST /analyze`
7. `07-result-screen` — tela de resultado da análise
8. `08-history` — histórico de scans + detalhe
9. `09-profile` — perfil + edição

Cada plano referencia o protótipo (`claude-design/*.jsx`) como referência visual
e segue o fluxo de git de [.claude/rules/git-workflow.md](./.claude/rules/git-workflow.md).

## Convenções de git

- Branches: `(feat|fix|release)/NN/<nome>` (ex.: `feat/01/design-system`).
- Commits: `tipo: mensagem` (só título). Ver [fe/GIT-CONVENTIONS.md](./fe/GIT-CONVENTIONS.md).
