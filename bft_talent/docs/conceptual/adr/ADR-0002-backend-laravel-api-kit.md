# ADR-0002 — Backend Laravel 13 a partir de `laravel-api-kit`

**Estado:** aceite · **Data:** 2026-05-09

## Contexto

O backend tem requisitos: API headless, multi-role, OpenAPI auto, testes formais, qualidade estática rigorosa. Já existe um `laravel-api-kit/` interno preparado para essa stack.

## Decisão

Adoptar o `laravel-api-kit` como base de `apps/api/`, com:

- Laravel 13 + PHP 8.3+
- Sanctum (token-based) — já configurado
- `grazulex/laravel-apiroute` — versionamento URI
- `spatie/laravel-query-builder` — filtering / sorting / includes
- `spatie/laravel-data` — DTOs tipadas
- `dedoc/scramble` — OpenAPI 3.1 zero-anotação
- Pest + PHPStan max + Rector + Pint
- Middleware: ForceJsonResponse, LogApiRequests, EnsureEmailVerified

## Consequências

- **+** Boilerplate eliminado; arrancamos com auth/email/password reset/throttling prontos
- **+** Documentação OpenAPI sem custo manual
- **+** Qualidade alta desde dia 1
- **−** Dependência do upstream; necessidade de manter o fork actualizado
