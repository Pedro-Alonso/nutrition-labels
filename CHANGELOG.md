# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-06-19

### Added

- Live personalized summary in scan history detail: fetches the summary from
  `GET /products/{barcode}/summary` keyed by the user's diabetes type and
  language level, falling back to the frozen scan text while loading or on error.
  Changing profile preferences automatically invalidates and refetches the summary.
- Add/remove columns in the editable nutrition table (`EditableNutritionTable`).
  Users can now grow or shrink the number of value columns; at least one column
  is always kept.
- Single-column fallback: when the table arrives empty (OCR failure or manual
  mode), the editor starts with one column ("Quantidade por porção") and one
  blank row instead of rendering nothing.
- Optional nutritional table: prominent "Pular tabela" button on the table photo
  screen clearly labels the step as optional. On the table review screen, a
  "Limpar tabela" header action resets the table to empty, and confirming with an
  empty table shows a disclaimer (ingredients are the main input for analysis).
  `normalizeProductPayload` now sends `nutritional_table: null` when all rows and
  columns are empty.

### Fixed

- Auto-crop (`cropToPreviewAspect`) cortava as colunas laterais da foto do
  sensor (~39% da largura), degradando o OCR de tabelas nutricionais. Removido
  o auto-crop; o frame completo do sensor agora é enviado ao OCR, mantendo o
  recorte manual (CropOverlay) como opção.

## [1.2.0] - 2026-06-13

### Added

- Etapa de recorte manual por gestos após a confirmação da foto (tabela e
  ingredientes): permite ajustar a área enviada para o OCR antes do envio,
  com opção de pular e manter o recorte automático.
- Pull-to-refresh na Home, recarregando as análises recentes ao puxar a tela
  para baixo.
- Passo obrigatório de identificação do produto (nome e marca) logo após a
  leitura do código de barras, para produtos novos e já cadastrados — exibido
  junto ao nome na tela de resultado.

### Changed

- Ler um produto já cadastrado agora registra a leitura no histórico
  (subindo a entrada ao topo em releituras) e exibe o resumo em linguagem
  natural gerado/recuperado do cache no momento da leitura.
- Atualizar o perfil (tipo de diabetes/nível de linguagem) invalida o
  histórico de leituras, para que resumos e riscos sejam regerados na
  personalização atual.

### Fixed

- Telas de revisão (tabela e ingredientes) rolam automaticamente até o campo
  em edição, mantendo-o visível acima do teclado.

### Removed

## [1.1.0] - 2026-06-11

### Added

- Tipos e serviços para tabela nutricional e ingredientes estruturados, preview
  de OCR por duas imagens e persistência de produto editado.
- Componentes de tabela nutricional e lista de ingredientes editáveis
  (adicionar/editar/remover), com rótulos por origem (base/OCR/manual).
- Telas de revisão editável da tabela nutricional e da lista de ingredientes
  antes da análise, com persistência apenas quando há edição.
- Captura em duas etapas (tabela e ingredientes) com pré-visualização e
  confirmação, e opção de preenchimento manual em cada etapa.
- Entrada manual do código de barras (digitação) como alternativa à câmera.
- Documentação de referência (JSDoc) em cada método dos serviços de API
  (auth, users, products): verbo + rota, autenticação, request/response e
  códigos de status.

### Changed

- Produtos já cadastrados agora abrem nas telas de revisão (tabela e
  ingredientes) para aprovação/edição antes de exibir a análise.
- Produtos não cadastrados passam pelo OCR de duas imagens e abrem nas telas de
  revisão pré-preenchidas antes da análise.

### Fixed

- Rotas das telas em abas (início, histórico, perfil) não incluíam o grupo
  `(tabs)` exigido pelo roteamento tipado, gerando erros de typecheck. As
  constantes de rota foram corrigidas e as navegações inline passaram a usar
  `ROUTES`.
- Botões de captura/galeria/ajuda na tela de foto do rótulo não respondiam ao
  toque (a barra de abas cobria os controles). O fluxo de scan agora abre em
  tela cheia, fora das abas, com respeito à área segura inferior.

### Removed

- Tela de captura única e código do fluxo de OCR antigo substituídos pelo fluxo
  de duas etapas com revisão editável.
- Comentários narrativos do código-fonte e arquivos `.gitkeep` obsoletos
  (todas as pastas já têm arquivos reais).

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
