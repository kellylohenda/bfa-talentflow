# Plano de Implementação — BFA TalentFlow

> **Para o developer:** este documento é o guia completo da implementação. Ler `docs/README.md` e `docs/conceptual/architecture/db/data-model.md` antes de começar.
>
> **Idioma de output:** PT-PT em **toda** a stack (validações, mensagens de erro, emails, UI, seeders, comentários voltados ao utilizador).

---

## 0. Contexto

Existem 3 pastas na raíz hoje:

- `bfa-talentflow/` — protótipo Next.js 14 funcional com mock data (`lib/data.ts`). Tem **27 páginas de dashboard** + 4 fluxos públicos. Todos os tipos em `types/index.ts`.
- `laravel-api-kit/` — kit Laravel 13 API-only com Sanctum, Scramble, Pest, PHPStan max, Rector, Pint. Já tem auth completo (login/logout/me/forgot/reset/verify).
- `bft_talent/` — projecto antigo. **NÃO tocar**, vai ser arquivado.

**Objectivo:** unificar tudo num mono-repo com `apps/api` (novo, baseado em `laravel-api-kit`) e `apps/web` (o `bfa-talentflow/` actual), substituindo os mocks por chamadas reais à API.

**Repo final:** `git@github.com:hard-life-tech/bfa-talentflow.git`, branch `master`.

---

## 1. Marcos (Milestones)

| Marco | Conteúdo | Critério de aceitação |
|---|---|---|
| **M0** Fundações | Mono-repo, locale PT-PT, CI verde | `pnpm dev` + `php artisan serve` correm; `/docs/api` abre Scramble |
| **M1** Auth + RBAC | Sanctum, 6 roles, login real, `/me` | Cada role autentica e vê apenas o seu menu |
| **M2** Catálogos + Talentos + Candidaturas | Programas, Universidades, Departamentos, Talentos, Candidaturas + portal público | Candidatura pública → email → pipeline RH funciona |
| **M3** Bolseiros + Estagiários + Rotações | Subset de Talento por `kind`, Rotações, Presenças, Sessões | Estagiário FBFA tem rotação activa visível; bolseiro vê portal |
| **M4** Pagamentos + Workflows + Tarefas + Faltas | Idempotência, multi-step, transitions, activity log | Pagamento processa-se, workflow segue ordem, tarefa concluída notifica |
| **M5** Voluntariado + Mentoria + Avaliações + Documentos + Agenda | Voluntários, Actividades, Horas, Sessões mentor, Avaliações 360°, Documentos S3, Eventos | Voluntário inscreve-se, horas validadas, ciclo 360° abre/fecha |
| **M6** Análise + Compliance + Polimento | `/analytics/*`, 9-Box, ROI, Cache Redis, Export | Direcção vê KPIs em tempo real, audit completo |

Roadmap detalhado: `docs/project-timeline.md`.

---

## 2. Tarefas — M0 Fundações

### T0.1 — Reorganizar para mono-repo

```bash
# Estado inicial
bfa-talentflow/   # Next.js (manter)
laravel-api-kit/  # template Laravel
bft_talent/       # arquivar (não mover, deixar)

# Estado final
apps/
  ├── api/        # cópia do laravel-api-kit
  └── web/        # bfa-talentflow renomeado
docs/             # já existe
.github/workflows/
IMPLEMENTATION.md
ISSUES.md
README.md
```

Comandos:

```bash
mkdir -p apps
git mv bfa-talentflow apps/web
cp -r laravel-api-kit apps/api
cd apps/api && rm -rf .git vendor node_modules
```

> **OBS:** `laravel-api-kit/` original pode ser eliminado depois de validado o `apps/api`. `bft_talent/` fica até decisão da Direcção.

### T0.2 — Configurar locale PT-PT no backend

`apps/api/config/app.php`:

```php
'locale' => 'pt_PT',
'fallback_locale' => 'pt_PT',
'faker_locale' => 'pt_PT',
'timezone' => 'Africa/Luanda',
```

`apps/api/app/Providers/AppServiceProvider.php` `boot()`:

```php
use Carbon\Carbon;
Carbon::setLocale('pt_PT');
\Illuminate\Support\Facades\Date::setLocale('pt_PT');
```

Criar `apps/api/lang/pt_PT/validation.php` com **todas** as mensagens em PT-PT (ver `docs/conceptual/architecture/implementation-guides/backend.md` § Mensagens). Criar também `lang/pt_PT/auth.php` e `lang/pt_PT/passwords.php`.

### T0.3 — Pacotes adicionais

```bash
cd apps/api
composer require spatie/laravel-permission spatie/laravel-activitylog \
                 laravel/horizon resend/resend-laravel sentry/sentry-laravel \
                 league/flysystem-aws-s3-v3
php artisan vendor:publish --tag=permission-migrations
php artisan vendor:publish --tag=activitylog-migrations
php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"
```

### T0.4 — Variáveis de ambiente

Criar `apps/api/.env.example` com bloco de defaults BFA (ver `docs/deployment-guide.md`). Mínimo:

```env
APP_NAME="BFA TalentFlow"
APP_LOCALE=pt_PT
APP_FALLBACK_LOCALE=pt_PT
APP_TIMEZONE=Africa/Luanda
DB_CONNECTION=pgsql
DB_DATABASE=bfa_talentflow
RESEND_API_KEY=
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### T0.5 — CI

Criar `.github/workflows/ci.yml` com matrix:

- **api**: PHP 8.3, `composer install`, `pest`, `phpstan analyse --level=max`, `pint --test`, `rector process --dry-run`
- **web**: Node 20, `pnpm install`, `pnpm build`, `pnpm lint`, `tsc --noEmit`

Path filters para correr só o que mudou.

### T0.6 — Health endpoint

`GET /api/v1/health` retorna 200 com `{ "status": "ok", "db": true, "redis": true, "timestamp": "..." }`.

---

## 3. Tarefas — M1 Auth + RBAC

### T1.1 — Roles e Permissões

Seeder `RolesPermissionsSeeder` cria os 6 roles: `rh`, `direcao`, `mentor`, `bolseiro`, `estagiario`, `voluntario`.

Permissões granulares por recurso (sufixos `.viewAny`, `.view`, `.create`, `.update`, `.delete`, `.approve`, `.process`, `.transition`). Mapa role → permissions em `docs/api-contract.md` § Permissões.

### T1.2 — Migration `users` extra colunas

```
role            varchar(20)        -- cache do role principal
talent_id       bigint nullable    -- FK para talents (portal participantes)
volunteer_id    bigint nullable    -- FK para volunteers (portal voluntário)
```

### T1.3 — Demo Users Seeder

1 utilizador por role, password `bfa-2026`, emails:

- `mariana.quissama@bfa.ao` (rh)
- `manuel.bemba@bfa.ao` (direcao)
- `edmilson.cardoso@bfa.ao` (mentor)
- `lwini.capemba@bfa.ao` (estagiario)
- `joaquim.tchindemba@bfa.ao` (bolseiro)
- `ana.kiala@bfa.ao` (voluntario)

### T1.4 — `UserResource` + ability tokens

`GET /me` devolve user + role + abilities.

### T1.5 — Frontend: substituir login mock

Em `apps/web/app/login/page.tsx`, substituir cookie hard-coded por `POST /api/v1/login` real. Guardar token em cookie HttpOnly (server action).

`apps/web/lib/useRole.ts` passa a buscar de `/me` (com SWR ou cache simples).

---

## 4. Tarefas — M2 Catálogos + Talentos + Candidaturas

### T2.1 — Migrations base

Criar migrations conforme `docs/conceptual/architecture/db/data-model.md`:

- `programs`, `universities`, `departments`, `stages`
- `talents`, `applications`

### T2.2 — Seeders a partir de `data.ts`

Script que importa **literal** os arrays de `apps/web/lib/data.ts`:

- `programs[]` → `programs`
- `universities[]` → `universities`
- `departments[]` → `departments`
- `talents[]` → `talents`
- `applications[]` → `applications`

> Usar `database/seeders/data/talents.json` (extraído de `data.ts` com script Node) para evitar acoplar PHP a TypeScript. O script `scripts/extract-data.mjs` converte data.ts em JSONs.

### T2.3 — Endpoints

```
# Catálogos
GET  /api/v1/programas
GET  /api/v1/universidades
GET  /api/v1/departamentos
GET  /api/v1/candidaturas/stages

# Talentos
GET    /api/v1/talentos
GET    /api/v1/talentos/{id}
POST   /api/v1/talentos
PUT    /api/v1/talentos/{id}
DELETE /api/v1/talentos/{id}

# Candidaturas
GET    /api/v1/candidaturas
GET    /api/v1/candidaturas/{id}
POST   /api/v1/candidaturas/{id}/avancar
POST   /api/v1/candidaturas/{id}/rejeitar

# Público
POST /api/v1/publico/candidaturas
GET  /api/v1/publico/candidaturas/{ref}
POST /api/v1/publico/portal/login
```

### T2.4 — Email Resend

Templates PT-PT:

- `CandidaturaRecebidaMail` — confirmação de submissão
- `CandidaturaAvancouMail` — passou de fase
- `CandidaturaRejeitadaMail` — rejeitada
- `OfertaEnviadaMail` — proposta de aceitação

Filas via Horizon.

### T2.5 — Frontend: ligar páginas

Substituir mocks em:

- `/talentos` e `/talentos/[id]`
- `/candidaturas`
- `/programa` (estática + KPIs do programa)
- `/candidatura` (formulário público)
- `/portal/[ref]` (estado de candidatura)

---

## 5. Tarefas — M3 Bolseiros + Estagiários + Rotações

### T3.1 — Migrations

`rotations`, `presencas`, `sessoes_bolseiro`.

### T3.2 — Endpoints

```
GET  /api/v1/estagiarios
GET  /api/v1/estagiarios/{id}/rotacoes
POST /api/v1/estagiarios/{id}/rotacoes
PUT  /api/v1/estagiarios/{id}/rotacoes/{rotId}

GET  /api/v1/bolseiros
GET  /api/v1/me/bolseiro     # endpoint composto

GET  /api/v1/presencas
POST /api/v1/presencas/checkin
POST /api/v1/presencas/{id}/checkout
POST /api/v1/presencas/{id}/justificar

GET  /api/v1/sessoes-bolseiro
```

### T3.3 — Regra: 1 rotação activa por talento

Validação em `StoreRotationRequest` + DB CHECK:

```sql
CREATE UNIQUE INDEX rotations_one_active_per_talent
  ON rotations (talent_id) WHERE status = 'activa';
```

### T3.4 — 2FA RH/Direcção

`laravel/fortify` 2FA TOTP obrigatório para roles `rh` e `direcao`.

### T3.5 — Frontend

- `/estagiarios` ligado a `GET /estagiarios?include=rotacoes`
- `/bolseiro` ligado a `GET /me/bolseiro`
- Perfil `/talentos/[id]` mostra rotações + presenças + sessões

---

## 6. Tarefas — M4 Pagamentos + Workflows + Tarefas + Faltas

### T4.1 — Migrations

`payments`, `workflows`, `workflow_steps`, `tasks`, `absences`.

### T4.2 — Endpoints

```
GET  /api/v1/pagamentos
POST /api/v1/pagamentos
POST /api/v1/pagamentos/{id}/processar     # idempotency-key
POST /api/v1/pagamentos/{id}/retry
POST /api/v1/pagamentos/{id}/hold

GET  /api/v1/workflows
GET  /api/v1/workflows/{id}?include=steps
POST /api/v1/workflows/{id}/aprovar
POST /api/v1/workflows/{id}/rejeitar

GET  /api/v1/tarefas
POST /api/v1/tarefas
POST /api/v1/tarefas/{id}/concluir

GET  /api/v1/faltas
POST /api/v1/faltas
POST /api/v1/faltas/{id}/aprovar
POST /api/v1/faltas/{id}/rejeitar
```

### T4.3 — Idempotência

Middleware `Idempotency` em `POST /pagamentos/{id}/processar` e `POST /workflows/{id}/aprovar`. Guarda hash do request e devolve resposta cacheada se chegar de novo. Pacote: `grazulex/laravel-api-idempotency` (já recomendado pelo kit).

### T4.4 — Activity Log

Trait `LogsActivity` em `Application`, `Payment`, `Workflow`, `Absence`, `Task`. Atributos a logar: status, amount, decided_by, etc.

### T4.5 — Notificações

`Notification` Laravel + canal `database` + canal `mail`:

- `WorkflowApproverInvited` — notifica próximo aprovador
- `WorkflowApproved` / `WorkflowRejected` — notifica solicitante
- `PaymentProcessed` — notifica talento
- `TaskAssigned` — notifica destinatário
- `AbsenceRequested` — notifica mentor/RH

---

## 7. Tarefas — M5 Voluntariado + Mentoria + Avaliações + Documentos + Agenda

### T5.1 — Migrations

`volunteers`, `volunteer_activities`, `volunteer_activity_inscricoes`, `hours_entries`, `mentor_sessions`, `evaluations`, `documents`, `eventos`, `evento_inscricoes`, `messages`. Notifications usa migration standard Laravel.

### T5.2 — Endpoints

```
GET    /api/v1/voluntarios
GET    /api/v1/voluntarios/{id}
POST   /api/v1/voluntarios
GET    /api/v1/me/voluntario

GET    /api/v1/actividades
POST   /api/v1/actividades
POST   /api/v1/actividades/{id}/inscrever
DELETE /api/v1/actividades/{id}/inscrever

GET    /api/v1/horas
POST   /api/v1/horas
POST   /api/v1/horas/{id}/validar

GET    /api/v1/mentoria/sessoes
POST   /api/v1/mentoria/sessoes
PUT    /api/v1/mentoria/sessoes/{id}

GET    /api/v1/avaliacoes
POST   /api/v1/avaliacoes
POST   /api/v1/avaliacoes/{id}/submeter

GET    /api/v1/documentos
POST   /api/v1/documentos                  # multipart upload → S3
GET    /api/v1/documentos/{id}/url         # signed URL
POST   /api/v1/documentos/{id}/aprovar
POST   /api/v1/documentos/{id}/rejeitar

GET    /api/v1/eventos
POST   /api/v1/eventos
POST   /api/v1/eventos/{id}/inscrever
DELETE /api/v1/eventos/{id}/inscrever

GET    /api/v1/mensagens
POST   /api/v1/mensagens
POST   /api/v1/mensagens/{id}/marcar-lida

GET    /api/v1/notificacoes
POST   /api/v1/notificacoes/marcar-lidas
```

### T5.3 — Storage S3

Disk `documents`. Estrutura:

```
documents/{owner_type}/{owner_id}/{document_id}/v{version}/{slug}.{ext}
```

URL assinada TTL 5 min.

### T5.4 — Recálculo de horas

Job `RecalculateVolunteerHoursJob` corre a cada validação. Mantém `volunteers.total_horas` em sync.

### T5.5 — Frontend

Ligar páginas:

- `/voluntario`, `/voluntarios`, `/actividades`, `/horas`, `/relatorios-voluntariado`
- `/mentor`, `/mentoria`
- `/avaliacoes`
- `/documentos`
- `/agenda`
- `/chat`, `/notificacoes`

---

## 8. Tarefas — M6 Análise + Compliance

### T8.1 — Endpoints analytics

```
GET /api/v1/analytics/overview
GET /api/v1/analytics/geografia
GET /api/v1/analytics/roi
GET /api/v1/analytics/retencao
GET /api/v1/analytics/sucessao            # 9-Box
GET /api/v1/analytics/voluntariado
GET /api/v1/compliance                     # query sobre activity_log
```

### T8.2 — Cache Redis

Cache TTL conforme `docs/admin-dashboard-plan.md` § Caching. Invalidação por evento (`PaymentProcessed`, `TalentHired`, etc.) via observers.

### T8.3 — Algoritmo 9-Box

```
y (perf):   <70 → 1, 70–84 → 2, ≥85 → 3
x (potencial): baixo → 1, médio → 2, alto → 3
```

### T8.4 — Export CSV/XLSX

`GET /api/v1/talentos.csv?...` via `maatwebsite/excel` ou stream PHP nativo (preferir nativo para evitar memória).

### T8.5 — Frontend

Ligar `/overview`, `/geografia`, `/roi`, `/retencao`, `/sucessao`, `/compliance`.

---

## 9. Convenções Globais

### 9.1 — Locale e Output

- **Toda** a output em PT-PT
- Datas API: ISO 8601 (`2026-05-09T14:30:00+01:00`)
- Datas UI: `d/m/Y`
- Moeda: AOA com `pt_AO` formatter; `currency` field nas tabelas para BIF/MEST armazenarem original
- Telefones: `+244 9XX XXX XXX`
- Validação: regex `/^\+244 9\d{2} \d{3} \d{3}$/` (espaços)
- BI Angola: regex `/^\d{9}[A-Z]{2}\d{3}$/`

### 9.2 — Padrão de resposta

Ver `docs/api-contract.md` § Envelope de Resposta. Sempre `data` + `meta` + `links` (em listas).

### 9.3 — Códigos de erro internos

Mapeados em `docs/api-contract.md` § Erros — Códigos Internos.

### 9.4 — Activity Log obrigatório

Todas as transições de estado críticas (candidatura, pagamento, workflow, falta, documento, voluntário status) **devem** registar via `spatie/activitylog` com `causer` (user actor).

### 9.5 — Filtros

`spatie/query-builder` em todos os índices: `?filter[campo]=valor&sort=-campo&include=relacao&page=1&per_page=25`. Allowlist explícita por controller.

### 9.6 — Testes

Pest com matriz role × endpoint. Cada controller tem teste cobrindo:

- 200 com role autorizado
- 403 com role não autorizado
- 422 com payload inválido (validar mensagem PT-PT)
- 401 sem token

---

## 10. Modelo de Dados

**Fonte de verdade:** `docs/conceptual/architecture/db/data-model.md`. Lá estão todas as 26 tabelas com colunas, FKs, índices e regras.

**Diagrama ER:** `docs/conceptual/architecture/db/er-diagram.md` (Mermaid renderiza no GitHub).

**Mapa Type ↔ Tabela ↔ Endpoint:** final do `data-model.md`.

---

## 11. Definition of Done por Tarefa

Cada tarefa fechada deve ter:

- [ ] Migration + rollback testados
- [ ] Model + Factory + Seeder
- [ ] Controller + FormRequest + Resource + DTO
- [ ] Policy registada
- [ ] Routes em `routes/api/v1.php`
- [ ] Pest test (200 + 403 + 422 + 401) — mínimo 4 casos
- [ ] OpenAPI gerado (verificar `/docs/api`)
- [ ] PT-PT em todas as mensagens
- [ ] Frontend conectado (M1+) e mock removido
- [ ] PR aprovado por reviewer

---

## 12. Cronograma Sugerido (16 semanas)

| Sem | Marco | Foco |
|---|---|---|
| 1–2 | M0 | Mono-repo + locale + CI |
| 3–4 | M1 | Auth + RBAC + login real |
| 5–7 | M2 | Catálogos + Talentos + Candidaturas + Portal público |
| 8–9 | M3 | Bolseiros + Estagiários + Rotações + 2FA |
| 10–11 | M4 | Pagamentos + Workflows + Tarefas + Faltas |
| 12–13 | M5 | Voluntariado + Mentoria + Avaliações + Docs + Agenda |
| 14–16 | M6 | Análise + Cache + Compliance + Polimento |

---

## 13. Próximo Passo Imediato

1. Aceitar este plano + ler `docs/`
2. Importar `ISSUES.md` para GitHub Projects
3. Começar T0.1 — reorganizar para mono-repo
4. Abrir PR `m0/setup` quando T0.1–T0.6 fechadas
