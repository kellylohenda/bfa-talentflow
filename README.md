# BFA TalentFlow

**Plataforma de Gestão de Talentos do Banco de Fomento Angola (BFA).**

Mono-repo:

- `apps/api/` — Backend Laravel 13 (a ser construído a partir de `laravel-api-kit/`)
- `apps/web/` — Frontend Next.js 14 (existente: `bfa-talentflow/`)
- `docs/` — Documentação técnica e funcional (PT-PT)
- `IMPLEMENTATION.md` — Plano completo de implementação
- `ISSUES.md` — Lista de issues importáveis para GitHub Project

> **Estado:** mono-repo em construção. `bfa-talentflow/`, `bft_talent/` e `laravel-api-kit/` coexistem na raíz até T0.1 do plano (ver `IMPLEMENTATION.md`).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Laravel 13 · PHP 8.3+ · Sanctum · Scramble · Pest · PHPStan max |
| Frontend | Next.js 14 App Router · TypeScript · CSS custom |
| DB | PostgreSQL 16 (prod) · SQLite (testes) |
| Cache / Queue | Redis · Horizon |
| Storage | S3-compatível |
| Email | Resend |
| Locale | **PT-PT em toda a stack** |

---

## Quick Start

```bash
# Backend
cd apps/api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8080

# Frontend (outro terminal)
cd apps/web
cp .env.example .env.local
pnpm install
pnpm dev
```

UI: http://localhost:3000 · API docs: http://localhost:8080/docs/api

---

## Documentação

- `docs/README.md` — visão geral
- `docs/glossary.md` — dicionário do domínio
- `docs/api-contract.md` — contrato REST padronizado
- `docs/conceptual/architecture/db/data-model.md` — **MER completo**
- `docs/conceptual/architecture/db/er-diagram.md` — ERD Mermaid
- `docs/conceptual/workflow/@index.md` — fluxos de negócio
- `docs/features/@index.md` — índice de features

---

## Próximos Passos

1. Ler `IMPLEMENTATION.md`
2. Importar `ISSUES.md` para GitHub Projects
3. Iniciar M0 — Fundações

---

## Repositório

`git@github.com:hard-life-tech/bfa-talentflow.git` · branch `master`
