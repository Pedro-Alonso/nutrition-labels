# NutriLabel — nutrition-labels

App mobile (Expo / React Native) que ajuda pacientes diabéticos brasileiros a
avaliar o conteúdo nutricional de alimentos embalados. O usuário escaneia o
código de barras; se o produto não está na base, fotografa o rótulo, que passa
por OCR + análise clínica. O resultado é uma avaliação de risco personalizada,
em linguagem adaptada ao perfil do usuário.

Aplicação desenvolvida como Trabalho de Conclusão de Curso — UNESP FCT, Bacharelado em Ciência da Computação.
Discente: Pedro Alonso Oliveira dos Santos
Orientador: Prof. Dr. Danilo Medeiros Eler

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

