# Síntese Conceptual — BFA TalentFlow

Este índice navega a documentação conceptual: ADRs, arquitectura e fluxos.

---

## ADRs (Architecture Decision Records)

Registos imutáveis das decisões estruturais. Formato curto: contexto · decisão · consequências.

- [ADR-0001 — Mono-repo `apps/api` + `apps/web`](adr/ADR-0001-monorepo-strategy.md)
- [ADR-0002 — Backend Laravel 13 a partir de `laravel-api-kit`](adr/ADR-0002-backend-laravel-api-kit.md)
- [ADR-0003 — Frontend Next.js 14 + CSS custom](adr/ADR-0003-frontend-nextjs.md)
- [ADR-0004 — Auth com Sanctum (token + SPA cookie)](adr/ADR-0004-auth-sanctum.md)
- [ADR-0005 — RBAC com spatie/laravel-permission](adr/ADR-0005-rbac-spatie.md)
- [ADR-0006 — DTOs com spatie/laravel-data](adr/ADR-0006-dtos-laravel-data.md)
- [ADR-0007 — OpenAPI auto via Scramble](adr/ADR-0007-openapi-scramble.md)
- [ADR-0008 — Auditoria via spatie/activitylog](adr/ADR-0008-audit-activitylog.md)
- [ADR-0009 — Storage de documentos S3-compatível](adr/ADR-0009-storage-s3.md)
- [ADR-0010 — Locale único PT-PT em V1](adr/ADR-0010-locale-pt-pt.md)
- [ADR-0011 — Idempotência em pagamentos / aprovações](adr/ADR-0011-idempotency.md)

---

## Arquitectura

- [Diagrama de contexto](architecture/diagrams/context.md) — sistemas, actores, fronteiras
- [Diagrama de componentes](architecture/diagrams/components.md) — backend + web + integrações
- [Modelo de Dados](architecture/db/data-model.md) — tabelas, relações, índices
- [ER Diagram (Mermaid)](architecture/db/er-diagram.md)
- [Guia de Implementação Backend](architecture/implementation-guides/backend.md)
- [Guia de Implementação Frontend](architecture/implementation-guides/frontend.md)

---

## Workflow

- [Fluxos de Negócio](workflow/@index.md) — candidatura → integração, pagamento, aprovação, voluntariado
