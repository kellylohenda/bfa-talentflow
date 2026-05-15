# ADR-0001 — Mono-repo `apps/api` + `apps/web`

**Estado:** aceite · **Data:** 2026-05-09

## Contexto

Existem dois projectos independentes (`bfa-talentflow/` Next.js e o futuro backend a partir de `laravel-api-kit/`) que partilham contracto API, glossário, tipos e ciclos de release.

## Decisão

Mono-repo único `bfa-talentflow` na organização **hard-life-tech** com estrutura:

```
bfa-talentflow/
├── apps/
│   ├── api/              # Laravel 13 (laravel-api-kit base)
│   └── web/              # Next.js 14
├── docs/                 # documentação partilhada
├── .github/workflows/    # CI/CD partilhado
├── IMPLEMENTATION.md
├── ISSUES.md
└── README.md
```

## Consequências

- **+** Issues, PRs, releases e tags numa só timeline; impossível ter API e Web fora de sync
- **+** Tipos partilhados via OpenAPI codegen para o cliente Next.js
- **+** Documentação central; menos drift entre stacks
- **−** CI maior (precisa de matrix); workflows precisam de path filters
- **−** Onboarding pede ferramentas dos dois ecossistemas (PHP + Node)

## Alternativas rejeitadas

- **Repo separado por app:** PRs cruzados duros de coordenar; risco de versões dessincronizadas
- **Polyrepo + git submodule:** complexidade desproporcional para uma equipa pequena
