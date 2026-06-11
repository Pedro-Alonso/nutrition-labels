# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Tipos e serviços para tabela nutricional e ingredientes estruturados, preview
  de OCR por duas imagens e persistência de produto editado.
- Componentes de tabela nutricional e lista de ingredientes editáveis
  (adicionar/editar/remover), com rótulos por origem (base/OCR/manual).
- Telas de revisão editável da tabela nutricional e da lista de ingredientes
  antes da análise, com persistência apenas quando há edição.

### Changed

### Fixed

- Rotas das telas em abas (início, histórico, perfil) não incluíam o grupo
  `(tabs)` exigido pelo roteamento tipado, gerando erros de typecheck. As
  constantes de rota foram corrigidas e as navegações inline passaram a usar
  `ROUTES`.
- Botões de captura/galeria/ajuda na tela de foto do rótulo não respondiam ao
  toque (a barra de abas cobria os controles). O fluxo de scan agora abre em
  tela cheia, fora das abas, com respeito à área segura inferior.

### Removed

## [1.0.0] - 2026-06-11

### Added

- Design system (tokens, primitivos UI, NativeWind v4).
- Infra de autenticação (axios, refresh com fila, secure-store, TanStack Query).
- Telas de auth (welcome/login/register).
- App shell com tabs (Home, Histórico, Perfil) e tela inicial.
- Leitor de código de barras (expo-camera).
- Captura de rótulo com OCR.
- Tela de resultado com análise de risco clínico.
- Histórico de scans (lista + detalhe).
- Tela de perfil e edição.
- Personalização clínica obrigatória (tipo de diabetes + nível de linguagem).
- Logs de request/response do axios (dev) e scripts de build APK.
