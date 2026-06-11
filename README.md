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
cp .env.example .env     # ajuste EXPO_PUBLIC_API_BASE_URL (ver "Backend" abaixo)
yarn start               # abre o Metro bundler (escaneie o QR no Expo Go)
```

Outros scripts:

```bash
yarn start:debug   # como yarn start, porém com logs de request/response da API no console
yarn android       # abre no emulador/dispositivo Android (requer toolchain nativo)
yarn lint          # ESLint
yarn typecheck     # tsc --noEmit (strict)
yarn release       # gera o APK de release (sem debug/logs) via gradle local
yarn release:eas   # alternativa: build local via EAS (testar no WSL); requer eas-cli
```

`yarn release` gera `android/app/build/outputs/apk/release/app-release.apk` e
exige Android SDK + JDK instalados. Os logs de `start:debug` só aparecem em dev —
o build de release nunca loga.

## Backend

Consome a API REST FastAPI (`nutrition-labels-api`). Configure a base URL em
`.env` via `EXPO_PUBLIC_API_BASE_URL`. O valor correto depende de onde o app roda:

| Onde o app roda | `EXPO_PUBLIC_API_BASE_URL` |
|---|---|
| **Celular físico** (Expo Go, mesmo Wi-Fi) | `http://<IP-LAN-da-maquina>:8000/api/v1` (o IP do adaptador Wi-Fi, ex. `192.168.5.10` — **não** use `localhost` nem o IP do VirtualBox `192.168.56.x`) |
| Emulador Android | `http://10.0.2.2:8000/api/v1` |
| Simulador iOS / web | `http://localhost:8000/api/v1` |

Descubra o IP de LAN com `ipconfig` (Windows) — é o mesmo IP que o Metro mostra
no QR code. **Após alterar o `.env`, reinicie o Metro** (`yarn start`), pois as
variáveis `EXPO_PUBLIC_*` são inlined no bundle.

## Estrutura

```
app/            # rotas (Expo Router): (auth)/ e (app)/ + scan/history/profile
components/     # ui/ (primitivos), scan/, result/, auth/
services/       # api/ (client axios + endpoints), storage (secure-store)
hooks/          # wrappers TanStack Query (useAuth, useProduct, useOcrPreview, ...)
stores/         # estado de auth
types/          # tipos de API e domínio
constants/      # cores, risco, rotas
utils/          # formatadores, helpers de cor de risco
```

