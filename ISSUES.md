# Issues — BFA TalentFlow

> Lista para criação de issues no GitHub Project `hard-life-tech/bfa-talentflow`. Cada bloco abaixo é uma issue.
>
> **Labels:** `M0`,`M1`,`M2`,`M3`,`M4`,`M5`,`M6` · `backend`,`frontend`,`devops`,`docs` · `priority:high|normal|low`
>
> **Importação automática:** usar `gh issue create --title "..." --body-file ..." --label "..." --milestone "..."` ou um script com a CLI `gh`.
>
> **Idioma:** PT-PT em todos os títulos e descrições.

---

## M0 — Fundações

### #M0.1 — Reorganizar repo para mono-repo `apps/api` + `apps/web`

**Labels:** `M0`,`devops`,`priority:high`

**Descrição:**
Mover `bfa-talentflow/` para `apps/web/` e copiar `laravel-api-kit/` para `apps/api/`. Adicionar `.gitignore` raíz adequado. `bft_talent/` fica intocado.

**Critérios de Aceitação:**
- [ ] Estrutura `apps/api`, `apps/web`, `docs`, `.github/workflows` na raíz
- [ ] `pnpm install` em `apps/web` continua a funcionar
- [ ] `composer install` em `apps/api` corre sem erros
- [ ] `.git` e `vendor` não estão em `apps/api`

---

### #M0.2 — Configurar locale PT-PT no backend

**Labels:** `M0`,`backend`,`priority:high`

**Descrição:**
Configurar Laravel para usar `pt_PT` como locale principal. Criar `lang/pt_PT/validation.php`, `auth.php`, `passwords.php` com mensagens completas. Carbon em PT-PT. Timezone `Africa/Luanda`.

**Critérios:**
- [ ] `config/app.php` com `pt_PT`
- [ ] Mensagens de validação completas em PT-PT
- [ ] Teste Pest valida que `required` retorna `"O campo X é obrigatório."`
- [ ] `Carbon::now()->translatedFormat('l, d \\d\\e F')` em PT-PT

---

### #M0.3 — Instalar pacotes adicionais

**Labels:** `M0`,`backend`

**Descrição:**
Instalar e publicar configs de: `spatie/laravel-permission`, `spatie/laravel-activitylog`, `laravel/horizon`, `resend/resend-laravel`, `sentry/sentry-laravel`, `league/flysystem-aws-s3-v3`.

**Critérios:**
- [ ] `composer.lock` actualizado
- [ ] Migrations publicadas e a correr
- [ ] Sentry capta um erro de teste

---

### #M0.4 — Pipeline CI GitHub Actions

**Labels:** `M0`,`devops`,`priority:high`

**Descrição:**
`.github/workflows/ci.yml` com matrix `api` (PHP 8.3) e `web` (Node 20). Path filters por `apps/api/**` e `apps/web/**`.

**API:** `pest`, `phpstan analyse --level=max`, `pint --test`, `rector process --dry-run`.
**Web:** `pnpm lint`, `tsc --noEmit`, `pnpm build`.

**Critérios:**
- [ ] CI corre em cada PR
- [ ] Failing test bloqueia merge
- [ ] Tempo total < 8 min

---

### #M0.5 — Health endpoint `GET /api/v1/health`

**Labels:** `M0`,`backend`

**Descrição:**
Endpoint público que verifica DB + Redis + retorna timestamp.

**Resposta esperada:**
```json
{ "status": "ok", "db": true, "redis": true, "timestamp": "2026-05-09T14:30:00+01:00" }
```

---

### #M0.6 — Documentação Scramble + UI

**Labels:** `M0`,`backend`,`docs`

**Descrição:**
Garantir `/docs/api` (UI) e `/docs/api.json` acessíveis. Configurar Scramble para usar PT-PT nas descrições padrão e info da API: nome, descrição, contacto BFA.

---

## M1 — Auth + RBAC

### #M1.1 — Seeder `RolesPermissionsSeeder`

**Labels:** `M1`,`backend`,`priority:high`

**Descrição:**
Criar 6 roles: `rh`,`direcao`,`mentor`,`bolseiro`,`estagiario`,`voluntario`. Permissões granulares por recurso.

Mapa em `docs/api-contract.md` § Permissões.

**Critérios:**
- [ ] Seeder idempotente
- [ ] Cada role tem o conjunto correcto de permissões
- [ ] Teste Pest cobre todos os 6

---

### #M1.2 — Migration extra colunas em `users`

**Labels:** `M1`,`backend`

**Descrição:**
Adicionar `role`,`talent_id`,`volunteer_id` à tabela `users`. FKs nullable. Índice em `role`.

---

### #M1.3 — `UserResource` + abilities no token Sanctum

**Labels:** `M1`,`backend`

**Descrição:**
`UserResource` devolve `id`,`name`,`email`,`role`,`abilities[]`. Token Sanctum criado com abilities do role.

**GET /me** devolve user actual.

---

### #M1.4 — Seeder `DemoUsersSeeder`

**Labels:** `M1`,`backend`

**Descrição:**
Criar 1 utilizador por role com password `bfa-2026`. Emails listados em `IMPLEMENTATION.md` § T1.3.

---

### #M1.5 — Frontend: substituir login mock por API real

**Labels:** `M1`,`frontend`,`priority:high`

**Descrição:**
`apps/web/app/login/page.tsx` faz `POST /api/v1/login`. Token guardado em cookie HttpOnly via server action. Cookie `role` continua para SSR rápido.

`apps/web/lib/useRole.ts` lê de `/me` se cookie presente.

**Critérios:**
- [ ] Cada role demo autentica
- [ ] Logout invalida token e redirecciona
- [ ] Token expirado → 401 → redireccionar `/login`

---

### #M1.6 — Middleware role-aware no Next

**Labels:** `M1`,`frontend`

**Descrição:**
`middleware.ts` valida cookie `token` em rotas `(dashboard)/*`. Sem token → `/login`. Páginas só mostram menus permitidos.

---

## M2 — Catálogos + Talentos + Candidaturas

### #M2.1 — Migrations + Models para catálogos

**Labels:** `M2`,`backend`

**Descrição:**
`programs`,`universities`,`departments`,`stages` conforme `data-model.md`.

---

### #M2.2 — Script `extract-data.mjs`

**Labels:** `M2`,`devops`

**Descrição:**
Script Node em `scripts/extract-data.mjs` que importa `apps/web/lib/data.ts` e exporta cada array para `apps/api/database/seeders/data/*.json`. Garante que seeders PHP não dependem de TypeScript em runtime.

---

### #M2.3 — Seeders: `programs`, `universities`, `departments`, `stages`

**Labels:** `M2`,`backend`

**Descrição:**
Ler JSONs gerados por #M2.2.

---

### #M2.4 — Migration + Model `Talent`

**Labels:** `M2`,`backend`

**Descrição:**
Conforme `data-model.md` § 6. Soft delete. Relations: `program`, `university`, `department`, `mentor` (User), `application` (origem).

---

### #M2.5 — Endpoints `/talentos` (CRUD + filters)

**Labels:** `M2`,`backend`

**Descrição:**
`spatie/query-builder` com filtros: `status`,`program`,`mentor`,`kind`. Sorts: `name`,`-perf`,`-gpa`,`-risk_score`. Includes: `programa`,`universidade`,`mentor`,`rotacoes`,`pagamentos`.

Policies: `viewAny` (rh,direcao,mentor), `view` (rh,direcao + mentor próprio + own).

---

### #M2.6 — Migration + Model `Application`

**Labels:** `M2`,`backend`

**Descrição:**
Conforme `data-model.md` § 7. `application_ref` gerado automaticamente (`A-` + sequência).

---

### #M2.7 — Endpoints `/candidaturas` (CRUD + transitions)

**Labels:** `M2`,`backend`,`priority:high`

**Descrição:**
CRUD + `POST /{id}/avancar` + `POST /{id}/rejeitar`. Service `AdvanceApplicationService` valida ordem das fases. Activity log.

---

### #M2.8 — Endpoint público `POST /publico/candidaturas`

**Labels:** `M2`,`backend`,`priority:high`

**Descrição:**
Submissão pública. Rate-limited (`throttle:6,1`). Gera `application_ref` + `public_token`. Dispara email Resend de confirmação.

---

### #M2.9 — Endpoint público `GET /publico/candidaturas/{ref}`

**Labels:** `M2`,`backend`

**Descrição:**
Retorna estado da candidatura por `application_ref`. Sem auth (mas opcionalmente token público para dados detalhados).

---

### #M2.10 — Templates Resend PT-PT

**Labels:** `M2`,`backend`

**Descrição:**
4 templates: `CandidaturaRecebida`, `CandidaturaAvancou`, `CandidaturaRejeitada`, `OfertaEnviada`. Tom institucional do BFA, PT-PT.

---

### #M2.11 — Frontend `/talentos` ligado à API

**Labels:** `M2`,`frontend`

**Descrição:**
Substituir `import { talents } from '@/lib/data'` por `await api('/talentos?include=programa,mentor')`. Loading skeleton + empty state.

---

### #M2.12 — Frontend `/talentos/[id]` ligado

**Labels:** `M2`,`frontend`

**Descrição:**
`GET /talentos/{id}?include=rotacoes,sessoes,pagamentos,avaliacoes,mentor`. Abas do perfil mantêm-se.

---

### #M2.13 — Frontend `/candidaturas` ligado

**Labels:** `M2`,`frontend`

**Descrição:**
Pipeline conectada. Drag-and-drop ou botões de transição chamam `/avancar` ou `/rejeitar`.

---

### #M2.14 — Frontend `/candidatura` formulário público

**Labels:** `M2`,`frontend`

**Descrição:**
Submete para `POST /publico/candidaturas`. Validações em PT-PT. Após sucesso, redirecciona para `/portal/[ref]`.

---

### #M2.15 — Frontend `/portal/[ref]`

**Labels:** `M2`,`frontend`

**Descrição:**
Estado de candidatura. Polling a cada 60s ou refresh manual.

---

## M3 — Bolseiros + Estagiários + Rotações

### #M3.1 — Migration + Model `Rotation` + regra "1 activa"

**Labels:** `M3`,`backend`

**Descrição:**
Conforme `data-model.md` § 8. Unique partial index.

---

### #M3.2 — Endpoints `/estagiarios` + rotações

**Labels:** `M3`,`backend`

---

### #M3.3 — Migration + Model `Presenca`

**Labels:** `M3`,`backend`

---

### #M3.4 — Endpoints `/presencas` (checkin / checkout / justificar)

**Labels:** `M3`,`backend`

---

### #M3.5 — Migration + Model `SessaoBolseiro`

**Labels:** `M3`,`backend`

---

### #M3.6 — Endpoint composto `/me/bolseiro`

**Labels:** `M3`,`backend`,`priority:high`

**Descrição:**
Retorna perfil + KPIs + próximas sessões + últimos pagamentos numa única chamada para `/bolseiro`.

---

### #M3.7 — 2FA TOTP para `rh` + `direcao`

**Labels:** `M3`,`backend`,`security`

**Descrição:**
`laravel/fortify` 2FA. Obrigatório nos roles `rh` e `direcao`. Endpoint `POST /2fa/enable` retorna QR + recovery codes.

---

### #M3.8 — Frontend `/estagiarios`

**Labels:** `M3`,`frontend`

---

### #M3.9 — Frontend `/bolseiro`

**Labels:** `M3`,`frontend`

---

## M4 — Pagamentos + Workflows + Tarefas + Faltas

### #M4.1 — Migration + Model `Payment`

**Labels:** `M4`,`backend`

---

### #M4.2 — Endpoints `/pagamentos` + transitions

**Labels:** `M4`,`backend`,`priority:high`

**Descrição:**
CRUD + `processar` (idempotente) + `retry` + `hold`. Activity log.

---

### #M4.3 — Middleware Idempotency (`grazulex/laravel-api-idempotency`)

**Labels:** `M4`,`backend`,`priority:high`

**Descrição:**
Header `Idempotency-Key` em `POST /pagamentos/{id}/processar` e `POST /workflows/{id}/aprovar`.

---

### #M4.4 — Migrations + Models `Workflow` + `WorkflowStep`

**Labels:** `M4`,`backend`

---

### #M4.5 — Endpoints `/workflows` + `aprovar/rejeitar`

**Labels:** `M4`,`backend`

**Descrição:**
Service `AdvanceWorkflowService` que valida next step + permissões do utilizador para esse step.

---

### #M4.6 — Migration + Model `Task` + endpoints

**Labels:** `M4`,`backend`

---

### #M4.7 — Migration + Model `Absence` + endpoints

**Labels:** `M4`,`backend`

---

### #M4.8 — Notificações: Workflow / Payment / Task / Absence

**Labels:** `M4`,`backend`

**Descrição:**
Classes `Notification` com canais `database` + `mail`. Integração com Resend.

---

### #M4.9 — Frontend `/pagamentos`, `/workflows`, `/tarefas`, `/faltas`

**Labels:** `M4`,`frontend`

---

## M5 — Voluntariado + Mentoria + Avaliações + Documentos + Agenda

### #M5.1 — Migrations Voluntariado (`volunteers`,`volunteer_activities`,`volunteer_activity_inscricoes`,`hours_entries`)

**Labels:** `M5`,`backend`

---

### #M5.2 — Endpoints `/voluntarios`, `/actividades`, `/horas`

**Labels:** `M5`,`backend`

---

### #M5.3 — Job `RecalculateVolunteerHoursJob`

**Labels:** `M5`,`backend`

**Descrição:**
Dispara em cada validação de hora. Mantém `volunteers.total_horas` consistente.

---

### #M5.4 — Migration + Model `MentorSession` + endpoints

**Labels:** `M5`,`backend`

---

### #M5.5 — Migration + Model `Evaluation` + endpoints + ciclo 360°

**Labels:** `M5`,`backend`

---

### #M5.6 — Migration + Model `Document` (poly) + S3 + signed URLs

**Labels:** `M5`,`backend`,`priority:high`

**Descrição:**
Upload multipart, versionamento, signed URL TTL 5 min.

---

### #M5.7 — Migrations Eventos + Inscrições

**Labels:** `M5`,`backend`

---

### #M5.8 — Endpoints `/eventos` + `inscrever/desinscrever`

**Labels:** `M5`,`backend`

---

### #M5.9 — Migration + Model `Message` + endpoints chat

**Labels:** `M5`,`backend`

---

### #M5.10 — Endpoints `/notificacoes`

**Labels:** `M5`,`backend`

---

### #M5.11 — Frontend Voluntariado (`/voluntario`,`/voluntarios`,`/actividades`,`/horas`,`/relatorios-voluntariado`)

**Labels:** `M5`,`frontend`

---

### #M5.12 — Frontend Mentoria + Avaliações + Documentos + Agenda + Chat + Notificações

**Labels:** `M5`,`frontend`

---

## M6 — Análise + Compliance + Polimento

### #M6.1 — `GET /analytics/overview`

**Labels:** `M6`,`backend`,`priority:high`

**Descrição:**
KPIs executivos (retenção, custo médio, GPA médio, etc.). Cache Redis 5 min.

---

### #M6.2 — `GET /analytics/geografia`

**Labels:** `M6`,`backend`

---

### #M6.3 — `GET /analytics/roi`

**Labels:** `M6`,`backend`

---

### #M6.4 — `GET /analytics/retencao`

**Labels:** `M6`,`backend`

---

### #M6.5 — `GET /analytics/sucessao` (9-Box)

**Labels:** `M6`,`backend`

---

### #M6.6 — `GET /analytics/voluntariado`

**Labels:** `M6`,`backend`

---

### #M6.7 — `GET /compliance` (query sobre activity_log)

**Labels:** `M6`,`backend`

---

### #M6.8 — Cache invalidation por observers

**Labels:** `M6`,`backend`

**Descrição:**
Observers em `Talent`, `Payment`, `Workflow` invalidam cache de analytics relevante.

---

### #M6.9 — Export CSV/XLSX (`/talentos.csv`, `/pagamentos.csv`, etc.)

**Labels:** `M6`,`backend`

---

### #M6.10 — Frontend `/overview`, `/geografia`, `/roi`, `/retencao`, `/sucessao`, `/compliance`

**Labels:** `M6`,`frontend`

---

### #M6.11 — Documentação final + runbook produção

**Labels:** `M6`,`docs`

---

### #M6.12 — Auditoria de segurança pré-go-live

**Labels:** `M6`,`security`,`priority:high`

**Descrição:**
Checklist OWASP Top 10, SQL injection, XSS, CSRF, rate limits, secrets em vault, TLS 1.3, HSTS, CORS restrito.

---

## Issues Transversais

### #X.1 — Definir branch protection rules (`master`)

**Labels:** `devops`,`priority:high`

**Descrição:**
- Require PR before merge
- Require CI passing
- Require ≥1 review
- Require linear history
- No force push

---

### #X.2 — Adicionar `.editorconfig`, `.gitignore`, `.gitattributes`

**Labels:** `devops`

---

### #X.3 — Adicionar `CODEOWNERS`

**Labels:** `devops`

---

### #X.4 — README raíz com badges + quick start

**Labels:** `docs`

---

## Importação automática (script)

Guardar este ficheiro e correr:

```bash
# Pré-requisito: `gh` autenticado, repo já criado, milestones criadas
gh issue create \
  --repo hard-life-tech/bfa-talentflow \
  --title "M0.1 — Reorganizar repo para mono-repo apps/api + apps/web" \
  --body "$(awk '/^### #M0\.1/,/^---$/' ISSUES.md)" \
  --label "M0,devops,priority:high" \
  --milestone "M0 — Fundações"
# (repetir por cada bloco)
```

Ou usar o script `scripts/import-issues.sh` (a criar — issue #X.5).
