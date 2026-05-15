# ADR-0003 — Frontend Next.js 14 + CSS custom

**Estado:** aceite · **Data:** 2026-05-09

## Contexto

O protótipo já foi construído em Next.js 14 App Router com CSS custom (sem Tailwind, sem libs UI). O sistema de design está consolidado em `globals.css` com tokens próprios e modo claro/escuro.

## Decisão

Manter Next.js 14 + CSS custom. Migrar de mock data para chamadas reais à API V1.

- App Router + Server Components onde possível
- Cliente HTTP: `fetch` com wrapper `lib/api.ts` que injecta token Sanctum
- Tipos gerados a partir do OpenAPI (Scramble) via `openapi-typescript`
- Sem state manager global (apenas React state + hooks + cookies para sessão)
- i18n: PT-PT only em V1 (sem next-intl ainda)

## Consequências

- **+** Curva curta para a equipa; nada de novo a aprender
- **+** Bundle pequeno (sem Tailwind nem libs UI)
- **+** Total controlo sobre design tokens
- **−** Componentes têm de ser construídos in-house (já estão)
- **−** Sem ecossistema pronto (datepicker, multi-select) — usar primitivos da plataforma
