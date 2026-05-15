# Modelo de Dados (MER) — BFA TalentFlow

> **Fonte de verdade das entidades:** `apps/web/lib/data.ts` e `apps/web/types/index.ts` (protótipo Next.js).
> **Toda a output é em PT-PT.** Nomes de tabelas em **plural / snake_case**, colunas em **snake_case**, timestamps `created_at`/`updated_at`/`deleted_at` (soft delete onde aplicável).

---

## Visão Sumária

```
auth ────► users · personal_access_tokens · roles · permissions
                                │
        ┌───────────────────────┼─────────────────────────────────┐
        │                       │                                  │
   programs · universities · departments · stages       (catálogos / referência)
        │                       │
        ▼                       ▼
    talents ──── kind ──► bolseiros / estagiarios (subset)
        │
        ├──► applications ──► (entra como talento ao avançar para "oferta")
        │
        ├──► rotations          (estagiários FBFA)
        ├──► presencas          (presenças diárias estagiários)
        ├──► sessoes_bolseiro   (sessões registadas — bolseiros)
        │
        ├──► payments
        ├──► tasks
        ├──► absences
        ├──► workflows ──► workflow_steps
        ├──► evaluations
        ├──► mentor_sessions ──► mentors (users)
        │
        ├──► documents
        ├──► messages
        └──► notifications

   eventos (agenda) ──► evento_inscricoes ──► talents | volunteers

   volunteers ──► volunteer_activities ──► hours_entries
   volunteers ──► evento_inscricoes (eventos com audiencia=voluntario)

   activity_log (spatie/activitylog) ──► auditoria transversal
```

---

## Entidades

Cada entidade lista **colunas**, **chaves**, **índices** e **regras de negócio**. Todos os IDs internos são `bigint UNSIGNED` autoincrement, com **slug público** legível (`talent_code`, `application_ref`, etc.) para apresentação.

---

### 1. `users`

Base do `laravel-api-kit`.

| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| name | varchar(255) | |
| email | varchar(255) UQ | |
| email_verified_at | timestamp | |
| password | varchar | bcrypt |
| role | enum | `rh`,`direcao`,`mentor`,`bolseiro`,`estagiario`,`voluntario` (cache do role principal) |
| talent_id | bigint FK → talents | nullable — preenchido para roles bolseiro/estagiario |
| volunteer_id | bigint FK → volunteers | nullable — para role voluntario |
| created_at, updated_at | timestamps | |

> Roles e permissions reais via `spatie/laravel-permission` (tabelas `roles`, `permissions`, `model_has_roles`, `model_has_permissions`). A coluna `role` é cache para queries rápidas.

---

### 2. `programs`

Catálogo dos programas.

| Coluna | Tipo | Notas |
|---|---|---|
| id | PK | |
| code | varchar(8) UQ | `fbfa`, `bif`, `bnac`, `mest`, `lid`, `vol` |
| name | varchar | "Futuro BFA", … |
| kind | varchar | "Trainee", "Bolsa", "Voluntariado" |
| color | varchar(7) | `#FF7607` |
| active | boolean | |

Seed inicial baseado em `programs[]` de `data.ts`.

---

### 3. `universities`

| Coluna | Tipo |
|---|---|
| id | PK |
| name | varchar UQ |
| city | varchar |
| country | varchar |

---

### 4. `departments`

| Coluna | Tipo |
|---|---|
| id | PK |
| name | varchar UQ |
| active | boolean |

Seed: `departments[]`.

---

### 5. `stages`

Catálogo das fases de candidatura (ordem fixa).

| Coluna | Tipo |
|---|---|
| id | PK |
| code | varchar UQ — `triagem`, `entrevista1`, ... |
| label | varchar — "Triagem CV", … |
| sort | int |

---

### 6. `talents`

| Coluna | Tipo | Notas |
|---|---|---|
| id | PK | |
| talent_code | varchar(8) UQ | `T-1042` |
| name | varchar | |
| gender | enum(`M`,`F`) | |
| program_id | FK → programs | |
| kind | enum(`bolseiro`,`estagiario`) | |
| university_id | FK → universities | |
| course | varchar | |
| year | varchar | "Trainee Y1", "2º ano" |
| gpa | decimal(4,2) | |
| status | enum | `active`,`delayed`,`risk`,`completed`,`hired`,`pending`,`onboarding` |
| department_id | FK → departments | nullable (bolseiros têm `—`) |
| mentor_user_id | FK → users | nullable |
| stipend | decimal(12,2) | em AOA — bolsas internacionais armazenam valor base em moeda original (ver `stipend_currency`) |
| stipend_currency | char(3) | default `AOA` |
| start_date | date | |
| perf | smallint | 0–100 |
| potential | enum(`alto`,`médio`,`baixo`) | |
| risk_score | decimal(3,2) | 0.00–1.00 |
| last_report | date | nullable |
| application_id | FK → applications | nullable — origem |
| timestamps + soft delete | | |

**Índices:** `(program_id)`, `(status)`, `(mentor_user_id)`, `(kind, status)`.

---

### 7. `applications`

| Coluna | Tipo | Notas |
|---|---|---|
| id | PK | |
| application_ref | varchar(8) UQ | `A-2451` |
| name | varchar | |
| email | varchar | |
| phone | varchar | `+244 9XX XXX XXX` |
| program_id | FK → programs | |
| tipo | enum | `bolseiro`,`estagiario`,`voluntariado` |
| stage | enum | conforme `stages.code` |
| score | smallint | 0–100 |
| source | varchar | `LinkedIn`,`Site BFA`,`Universidade`,`Indicação` |
| applied_at | timestamp | |
| course | varchar | |
| university_id | FK → universities | nullable |
| university_text | varchar | quando não está no catálogo (ex.: "Banco BAI") |
| documents_count | smallint | total de documentos submetidos |
| public_token | varchar UQ | usado em `/portal/[ref]` para auth pública |
| converted_talent_id | FK → talents | preenchido após `oferta` aceite |
| timestamps + soft delete | | |

**Transições de estado:** ver `workflow/@index.md`.

---

### 8. `rotations`

Para estagiários FBFA.

| Coluna | Tipo |
|---|---|
| id | PK |
| rotation_code | varchar(8) UQ — `ROT-001` |
| talent_id | FK → talents |
| department_id | FK → departments |
| supervisor | varchar (nome do supervisor BFA) |
| start_date | date |
| end_date | date |
| status | enum(`agendada`,`activa`,`concluida`) |
| notes | text |
| timestamps |

**Índices:** `(talent_id, status)`.
**Regra:** apenas uma `activa` por talento de cada vez.

---

### 9. `payments`

| Coluna | Tipo |
|---|---|
| id | PK |
| payment_ref | varchar(10) UQ — `P-9821`, `PE-001`, `PB-001` |
| talent_id | FK → talents |
| type | varchar — "Subsídio mensal", "Propina", "Alojamento", "Material de trabalho" |
| period | varchar — `2026-04`, `2026-T2`, `2025/26 · 2º Sem` |
| amount | decimal(14,2) |
| currency | char(3) — default `AOA` |
| status | enum(`paid`,`pending`,`failed`,`hold`) |
| paid_at | timestamp nullable |
| method | varchar — "Transferência BFA","SWIFT","Multicaixa" |
| idempotency_key | varchar UQ — para `POST /pagamentos/{id}/processar` |
| workflow_id | FK → workflows nullable |
| timestamps + soft delete |

**Índices:** `(talent_id, period)`, `(status)`, `(period)`.

---

### 10. `tasks`

| Coluna | Tipo |
|---|---|
| id | PK |
| task_code | varchar(10) UQ — `TK-0001` |
| title | varchar |
| description | text |
| talent_id | FK → talents |
| assigned_by_user_id | FK → users |
| assigned_by_role | enum(`rh`,`mentor`) |
| category | varchar — "Relatório","Formação","PDI","Apresentação","Documento","Certificação","Avaliação" |
| priority | enum(`alta`,`média`,`baixa`) |
| status | enum(`pending`,`in_progress`,`done`,`overdue`) |
| due_date | date |
| completed_at | timestamp nullable |
| timestamps + soft delete |

---

### 11. `absences`

| Coluna | Tipo |
|---|---|
| id | PK |
| absence_code | varchar(10) UQ — `FA-001` |
| talent_id | FK → talents |
| program_id | FK → programs (denormalização para queries rápidas) |
| type | enum(`justificada`,`injustificada`) |
| reason | text |
| date | date |
| days | smallint |
| status | enum(`pending`,`approved`,`rejected`) |
| requested_at | timestamp |
| approved_by_user_id | FK → users nullable |
| mentor_note | text nullable |
| rh_note | text nullable |
| timestamps |

---

### 12. `workflows`

| Coluna | Tipo |
|---|---|
| id | PK |
| workflow_code | varchar(10) UQ — `WF-2451` |
| talent_id | FK → talents nullable (nullable para batch-workflows) |
| talent_label | varchar — "Lote · 38 trainees" para casos sem `talent_id` |
| type | varchar — "Propina LSE","Subsídio mensal Abr","Reprocessamento SWIFT" |
| amount | decimal(14,2) |
| currency | char(3) |
| urgency | enum(`high`,`normal`,`low`) |
| submitted_at | timestamp |
| current_step | smallint |
| total_steps | smallint |
| status | enum(`pending`,`approved`,`rejected`) |
| timestamps |

### 12a. `workflow_steps`

| Coluna | Tipo |
|---|---|
| id | PK |
| workflow_id | FK → workflows |
| step_number | smallint |
| approver_role | enum(`rh`,`direcao`,`mentor`) |
| approver_user_id | FK → users nullable |
| decision | enum(`pending`,`approved`,`rejected`) |
| decided_at | timestamp nullable |
| note | text |

**Índice:** `(workflow_id, step_number)` UQ.

---

### 13. `mentor_sessions`

| Coluna | Tipo |
|---|---|
| id | PK |
| session_code | varchar(10) UQ — `MS-0001` |
| mentor_user_id | FK → users |
| talent_id | FK → talents |
| date | date |
| time | time |
| topic | varchar |
| duration_minutes | smallint |
| status | enum(`upcoming`,`done`) |
| local | varchar |
| notes | text |
| timestamps |

---

### 14. `evaluations`

| Coluna | Tipo |
|---|---|
| id | PK |
| talent_id | FK → talents |
| program_id | FK → programs |
| cycle | varchar — "Q1 2026" |
| due_date | date |
| submitted | boolean |
| submitted_at | timestamp nullable |
| score | smallint nullable |
| timestamps |

---

### 15. `eventos`

| Coluna | Tipo |
|---|---|
| id | PK |
| evento_code | varchar(10) UQ — `EV-001` |
| titulo | varchar |
| tipo | enum(`workshop`,`formacao`,`evento`,`mentoria`,`convocatoria`,`avaliacao`) |
| descricao | text |
| data | date |
| hora_inicio | time |
| hora_fim | time |
| local | varchar |
| facilitador | varchar |
| vagas_total | smallint nullable |
| audiencia | json — array de `EventoAudience` |
| obrigatorio | boolean |
| programas | json — array de codes |
| timestamps |

### 15a. `evento_inscricoes`

| Coluna | Tipo |
|---|---|
| id | PK |
| evento_id | FK → eventos |
| talent_id | FK → talents nullable |
| volunteer_id | FK → volunteers nullable |
| inscrito_at | timestamp |
| presente | boolean nullable |

**Constraint:** exactly one of `talent_id` / `volunteer_id` é não-null.
**Índice UQ:** `(evento_id, talent_id)` e `(evento_id, volunteer_id)`.

---

### 16. `presencas`

Presenças diárias dos estagiários (FBFA) no departamento.

| Coluna | Tipo |
|---|---|
| id | PK |
| presence_code | varchar(10) UQ — `PR-001` |
| talent_id | FK → talents |
| date | date |
| department_id | FK → departments |
| entrada | time nullable |
| saida | time nullable |
| horas | decimal(4,2) nullable |
| status | enum(`presente`,`ausente`,`justificado`,`pendente`) |
| supervisor_ok | boolean |
| nota | text |
| timestamps |

**Índice UQ:** `(talent_id, date)`.

---

### 17. `sessoes_bolseiro`

Presenças em sessões (workshops/mentoria/avaliação/formação) — apenas registo informativo (cruzado com `eventos` quando aplicável).

| Coluna | Tipo |
|---|---|
| id | PK |
| sessao_code | varchar(10) UQ — `SB-001` |
| talent_id | FK → talents |
| evento_id | FK → eventos nullable |
| date | date |
| tipo | enum(`mentoria`,`workshop`,`avaliacao`,`formacao`,`evento`) |
| titulo | varchar |
| duracao_horas | decimal(4,2) |
| presente | boolean |
| nota | text |
| timestamps |

---

### 18. `volunteers`

| Coluna | Tipo |
|---|---|
| id | PK |
| volunteer_code | varchar(8) UQ — `V-001` |
| nome | varchar |
| email | varchar UQ |
| tel | varchar |
| profissao | varchar |
| instituicao | varchar |
| provincia | varchar |
| local | varchar |
| data_inscricao | date |
| status | enum(`activo`,`inactivo`,`desistente`) |
| area_actuacao | enum(`saude`,`educacao`,`ambiente`,`social`,`cultura`) |
| total_horas | decimal(8,2) — denormalizado, recomputado de `hours_entries` validadas |
| mentor_user_id | FK → users nullable |
| timestamps + soft delete |

---

### 19. `volunteer_activities`

| Coluna | Tipo |
|---|---|
| id | PK |
| activity_code | varchar(8) UQ — `AC-001` |
| nome | varchar |
| descricao | text |
| tipo | enum (mesmo que `area_actuacao`) |
| data | date |
| hora_inicio | time |
| hora_fim | time |
| local | varchar |
| provincia | varchar |
| coordenador_user_id | FK → users (ou volunteer com mentor flag) |
| vagas_total | smallint |
| inscritos_count | smallint — denormalizado |
| status | enum(`agendada`,`em_curso`,`concluida`,`cancelada`) |
| horas_previstas | decimal(4,2) |
| timestamps + soft delete |

### 19a. `volunteer_activity_inscricoes`

| Coluna | Tipo |
|---|---|
| id | PK |
| activity_id | FK → volunteer_activities |
| volunteer_id | FK → volunteers |
| inscrito_at | timestamp |
| presente | boolean nullable |

**UQ:** `(activity_id, volunteer_id)`.

---

### 20. `hours_entries`

| Coluna | Tipo |
|---|---|
| id | PK |
| hour_code | varchar(8) UQ — `H-001` |
| volunteer_id | FK → volunteers |
| activity_id | FK → volunteer_activities |
| data | date |
| horas | decimal(4,2) |
| validado | boolean |
| validado_por_user_id | FK → users nullable |
| validado_at | timestamp nullable |
| timestamps |

**Índice:** `(volunteer_id, data)`.

---

### 21. `documents`

| Coluna | Tipo |
|---|---|
| id | PK |
| document_code | varchar(10) UQ |
| owner_type | enum(`talent`,`application`,`volunteer`,`payment`,`workflow`) — polymorph |
| owner_id | bigint |
| name | varchar |
| category | varchar — "Boletim", "BI", "Contrato", "Comprovativo", "Relatório" |
| version | smallint |
| storage_path | varchar — S3 key |
| mime | varchar |
| size_bytes | bigint |
| status | enum(`pendente`,`aprovado`,`rejeitado`) |
| uploaded_by_user_id | FK → users |
| reviewed_by_user_id | FK → users nullable |
| timestamps + soft delete |

**Índice:** `(owner_type, owner_id)`.

---

### 22. `messages`

Chat 1-on-1 (mentor ↔ mentee, RH ↔ talent, etc.).

| Coluna | Tipo |
|---|---|
| id | PK |
| from_user_id | FK → users |
| to_user_id | FK → users |
| body | text |
| read_at | timestamp nullable |
| timestamps |

**Índice:** `(from_user_id, to_user_id, created_at)`.

---

### 23. `notifications`

Usar `Illuminate\Notifications\DatabaseNotification` (tabela `notifications` standard Laravel) com:

- `type` = classe Notification PHP (`App\Notifications\PaymentApproved`, etc.)
- `notifiable_type`/`notifiable_id` — habitualmente `User`
- `data` JSON com `{ type, title, text, link }` em PT-PT

---

### 24. `roles` / `permissions` / `model_has_roles` / `model_has_permissions`

Tabelas standard de `spatie/laravel-permission`. Roles seed:

`rh`, `direcao`, `mentor`, `bolseiro`, `estagiario`, `voluntario`.

Permissões granulares por recurso (sufixos: `.viewAny`, `.view`, `.create`, `.update`, `.delete`, `.approve`, `.process`, `.transition`).

---

### 25. `personal_access_tokens`

Standard Sanctum. Token bearer.

---

### 26. `activity_log`

Standard `spatie/laravel-activitylog`. Auditoria automática de:

- Mudanças de estado em `applications`, `payments`, `workflows`, `absences`, `tasks`, `documents`
- Login/logout
- Aprovações de horas e workflows

Usado também para alimentar a página `/compliance` e o feed `ActivityItem` do Overview.

---

## Vistas Derivadas (não-tabelas)

### `nine_box_view`

Calculada de `talents.perf` e `talents.potential`:

```
x = potential_to_axis(potential)   // baixo=1, médio=2, alto=3
y = perf_to_axis(perf)             // <70=1, 70–84=2, ≥85=3
```

Materializada em cache Redis (TTL 1 h) ou view PostgreSQL.

### `geo_points_view`

```sql
SELECT u.country, u.city,
       COUNT(t.id) AS count,
       SUM(p.amount) AS cost
FROM talents t
JOIN universities u ON u.id = t.university_id
LEFT JOIN payments p ON p.talent_id = t.id AND p.status='paid'
GROUP BY u.country, u.city;
```

---

## Convenções de Migração

- Tabelas em **plural snake_case** PT-PT quando o domínio é específico (`presencas`, `eventos`), inglês quando é técnico (`users`, `documents`, `payments`, `workflows`, `tasks`, `volunteers`, `applications`)
- Colunas em **snake_case**
- Soft deletes (`deleted_at`) em todas as entidades de domínio com risco de exclusão indevida
- Foreign keys com `onDelete('restrict')` (default) — preserva integridade
- `enum` em PostgreSQL via `CREATE TYPE` ou colunas string com CHECK constraint (preferido para flexibilidade)
- Toda entidade tem `created_at` e `updated_at`
- Registos com prefixo de código público (`T-`, `A-`, `V-`, etc.) para legibilidade humana

---

## Mapa Type ↔ Tabela ↔ Endpoint

| Type TS (`types/index.ts`) | Tabela | Endpoint principal |
|---|---|---|
| `Program` | `programs` | `GET /programas` |
| `Talent` | `talents` | `GET /talentos` |
| `Application` | `applications` | `GET /candidaturas` |
| `Payment` | `payments` | `GET /pagamentos` |
| `Mentor` (Read view) | view sobre `users` | `GET /mentores` |
| `GeoPoint` | view | `GET /analytics/geografia` |
| `NineBoxItem` | view | `GET /analytics/sucessao` |
| `ActivityItem` | `activity_log` | `GET /actividade` |
| `Notification` | `notifications` | `GET /notificacoes` |
| `BolseiroPayment` | `payments` (subset) | `GET /pagamentos?filter[talent]=me` |
| `Task` | `tasks` | `GET /tarefas` |
| `Absence` | `absences` | `GET /faltas` |
| `Workflow` | `workflows`+`workflow_steps` | `GET /workflows` |
| `MentorSession` | `mentor_sessions` | `GET /mentoria/sessoes` |
| `Evaluation` | `evaluations` | `GET /avaliacoes` |
| `Stage` | `stages` | `GET /candidaturas/stages` |
| `Volunteer` | `volunteers` | `GET /voluntarios` |
| `VolunteerActivity` | `volunteer_activities` | `GET /actividades` |
| `HoursEntry` | `hours_entries` | `GET /horas` |
| `Rotation` | `rotations` | `GET /estagiarios/{id}/rotacoes` |
| `Presenca` | `presencas` | `GET /presencas` |
| `SessaoBolseiro` | `sessoes_bolseiro` | `GET /sessoes-bolseiro` |
| `Evento` | `eventos`+`evento_inscricoes` | `GET /eventos` |

Ver também `er-diagram.md` para diagrama Mermaid.
