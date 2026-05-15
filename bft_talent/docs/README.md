# BFA TalentFlow

**Plataforma de Gestão de Talentos do Banco de Fomento Angola (BFA)** — backend API headless + frontends por perfil.

---

## Visão Geral

O **BFA TalentFlow** é o sistema oficial de gestão do programa de Talentos do BFA. Cobre todo o ciclo de vida — desde a candidatura pública até à integração no banco — para os seguintes perfis (*roles*):

- **RH** — gestores de programa e equipa de Recursos Humanos
- **Direcção** — direcção de RH e patrocinadores executivos
- **Mentor** — quadros internos do BFA que mentoram bolseiros e estagiários
- **Bolseiro** — beneficiários de bolsas internacionais e nacionais (BIF, BNAC, MEST, LID)
- **Estagiário** — participantes do programa Futuro BFA (FBFA), com rotações por departamento
- **Voluntário** — voluntários da Fundação BFA, contributo em horas para acções comunitárias

A arquitectura é **API-first**: um backend Laravel 13 (`laravel-api-kit`) expõe toda a regra de negócio via REST versionado; um frontend Next.js consome a API. Todos os textos, mensagens, validações e respostas são entregues em **PT-PT**.

---

## Problema

A gestão actual do programa de Talentos BFA está fragmentada por:

- folhas Excel descentralizadas com candidatos, bolseiros, estagiários e voluntários
- aprovações de pagamentos, faltas e workflows feitas por email
- ausência de auditoria, KPIs em tempo real, gestão de rotações e acompanhamento estruturado de mentoria
- documentos físicos ou em pastas partilhadas, sem ciclo formal de revisão e validação

Resultado: tempo elevado em tarefas administrativas, baixa visibilidade executiva, risco de não-conformidade e dificuldade em medir ROI do programa.

---

## Solução

O **BFA TalentFlow** consolida num único sistema:

- **Portal Público** — site do programa, formulário de candidatura e portal de consulta de estado por referência
- **Pipeline de Candidaturas** — funil multi-fase (triagem → entrevistas → avaliação → aprovação → oferta)
- **Roster de Talentos** — bolseiros e estagiários com perfil completo, KPIs de desempenho e potencial, score de risco
- **Estagiários** — gestão de rotações por departamento (FBFA Y1/Y2)
- **Bolseiros** — portal pessoal: bolsas, sessões, presenças, pagamentos
- **Voluntariado** — actividades, inscrições, registo e validação de horas
- **Mentoria** — sessões agendadas, notas, avaliações
- **Workflows e Aprovações** — pagamentos, ausências, documentos, com circuito multi-passo
- **Avaliações 360°** — ciclos formais de avaliação por talento
- **Documentos** — repositório com versionamento e estado de aprovação
- **Comunicação** — chat directo + centro de notificações
- **Agenda e Workshops** — calendário institucional e catálogo de formações
- **Pagamentos** — histórico, status, método (Multicaixa, transferência, USD para BIF/MEST)
- **Análise Executiva** — Overview, Geografia, ROI, Compliance, Retenção, Sucessão (9-Box)

---

## Proposta de Valor

- **Para o BFA** — visibilidade executiva em tempo real, ROI quantificado, conformidade auditável
- **Para a equipa de RH** — automatização de aprovações e comunicação; redução de trabalho manual
- **Para os participantes (bolseiros / estagiários / voluntários)** — portal pessoal único, transparência sobre estado, comunicação directa com mentores e RH
- **Para mentores** — agenda integrada, notas estruturadas, avaliação clara dos mentorados
- **Para a Fundação BFA** — registo formal de horas e impacto comunitário

---

## Stack Técnico

| Camada | Tecnologia |
|---|---|
| **Backend** | Laravel 13 (PHP 8.3+) — base `laravel-api-kit` |
| **Auth** | Laravel Sanctum (token-based) |
| **API** | REST versionada (`/api/v1`) via grazulex/laravel-apiroute |
| **Validação / DTOs** | spatie/laravel-data |
| **Query Building** | spatie/laravel-query-builder (filtering / sorting / includes) |
| **Documentação API** | dedoc/scramble (OpenAPI 3.1 zero-anotação) |
| **Permissões** | spatie/laravel-permission (roles + permissions) |
| **Auditoria** | spatie/laravel-activitylog |
| **Testes** | Pest PHP + Laravel HTTP testing |
| **Qualidade** | PHPStan (max), Rector, Laravel Pint |
| **Filas** | Laravel Horizon + Redis (emails, notificações) |
| **Email** | Resend (templates transacionais) |
| **Base de dados** | PostgreSQL 16 (produção) / SQLite (testes) |
| **Storage** | S3-compatível (documentos) |
| **Frontend Web** | Next.js 14 App Router + TypeScript + CSS custom |
| **Locale** | PT-PT em toda a stack (validações, mensagens, datas, moeda AOA) |
| **Observabilidade** | Laravel Pulse + Telescope + Sentry |
| **CI/CD** | GitHub Actions |

---

## Estrutura de Documentação

```
docs/
├── README.md                              # Este ficheiro
├── api-contract.md                        # Padronização do contrato REST
├── deployment-guide.md                    # Deploy: dev, staging, produção
├── glossary.md                            # Dicionário do domínio (PT-PT)
├── project-timeline.md                    # Marcos e roadmap
├── admin-dashboard-plan.md                # Plano do dashboard executivo
├── business-model.md                      # Programas, custos, KPIs
├── ui-figma-spec.md                       # Especificação UI/UX (referência ao protótipo Next.js)
├── conceptual/
│   ├── @index.md                          # Síntese conceptual
│   ├── adr/                               # Architecture Decision Records
│   ├── architecture/                      # Diagramas, base de dados, guias
│   └── workflow/                          # Fluxos de trabalho (candidatura → integração)
└── features/
    ├── @index.md                          # Índice de features
    ├── auth-rbac.md                       # Autenticação, perfis, permissões
    ├── candidaturas.md                    # Pipeline de candidaturas
    ├── talentos.md                        # Roster + perfil de talento
    ├── estagiarios-rotacoes.md            # Gestão FBFA + rotações
    ├── bolseiro-portal.md                 # Portal do bolseiro
    ├── voluntariado.md                    # Actividades + horas
    ├── mentoria.md                        # Sessões e notas
    ├── pagamentos.md                      # Histórico e processamento
    ├── workflows-aprovacoes.md            # Aprovações multi-passo
    ├── tarefas-faltas.md                  # Tarefas e gestão de ausências
    ├── avaliacoes-360.md                  # Ciclos de avaliação
    ├── documentos.md                      # Gestão documental
    ├── comunicacao-notificacoes.md        # Chat + centro de notificações
    ├── agenda-workshops.md                # Calendário e formações
    └── analytics-executivo.md             # Overview, Geografia, ROI, Sucessão
```

---

## Modos de Implantação

| Ambiente | Backend | Frontend | DB | Notas |
|---|---|---|---|---|
| **Dev local** | `php artisan serve` | `pnpm dev` | SQLite | Seeders criam dados de demo |
| **Staging** | Docker / docker-compose | Vercel / self-host | PostgreSQL | Testes de integração |
| **Produção** | Docker on-prem (BFA) | Vercel ou on-prem | PostgreSQL gerido | TLS obrigatório, backup diário |

Ver `deployment-guide.md`.

---

## Locale e Convenções

- **Idioma:** PT-PT em **toda** a output (mensagens de validação, errors, emails, UI)
- **Datas:** `d/m/Y` para humano, `Y-m-d` para API
- **Moeda:** AOA (Kwanza) com formatação `pt_AO`. Bolsas internacionais podem armazenar em USD/EUR e converter à taxa BNA do dia
- **Telefones:** `+244 9XX XXX XXX`
- **Documentos:** BI angolano (formato `XXXXXXXXXLAXX`), passaporte (alfanumérico)
- **Programas:** `fbfa`, `bif`, `bnac`, `mest`, `lid`
- **Validação:** todas as mensagens em PT-PT (ver `app/Lang/pt_PT/validation.php`)

---

## Repositórios

| Repo | URL | Branch principal |
|---|---|---|
| Mono-repo TalentFlow | `git@github.com:hard-life-tech/bfa-talentflow.git` | `master` |

Estrutura interna:

```
bfa-talentflow/                    # mono-repo
├── apps/
│   ├── api/                       # Laravel 13 API (a partir de laravel-api-kit)
│   └── web/                       # Next.js 14 (existente: bfa-talentflow/)
├── docs/                          # esta pasta
├── IMPLEMENTATION.md              # plano de implementação para handoff
├── ISSUES.md                      # lista de issues importáveis
└── README.md                      # esta secção em curto
```

> Durante a fase 0, os projectos `bfa-talentflow/`, `bft_talent/` e `laravel-api-kit/` coexistem na raíz. A reorganização para `apps/api` + `apps/web` é a primeira tarefa do dev (ver `IMPLEMENTATION.md`).

---

## Próximos Passos

1. Ler `IMPLEMENTATION.md` na raíz do repo
2. Importar `ISSUES.md` para o board do projecto (GitHub Projects)
3. Cumprir milestones por ordem (M0 → M6)
4. Toda a comunicação técnica e documentação adicional em **PT-PT**
