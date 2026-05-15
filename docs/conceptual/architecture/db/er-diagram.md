# Diagrama Entidade-Relacionamento (ERD) — BFA TalentFlow

> Diagrama Mermaid renderizável em GitHub. Detalhes completos das colunas em `data-model.md`.

---

## ERD Principal — Núcleo de Talento

```mermaid
erDiagram
    USERS ||--o{ TALENTS : "mentor_user_id"
    USERS ||--o{ MENTOR_SESSIONS : "mentor_user_id"
    USERS ||--o{ TASKS : "assigned_by_user_id"
    USERS ||--o{ ABSENCES : "approved_by_user_id"
    USERS ||--o{ DOCUMENTS : "uploaded_by_user_id"
    USERS ||--o{ MESSAGES : "from_user_id"
    USERS ||--o{ MESSAGES : "to_user_id"
    USERS }o--|| TALENTS : "talent_id (portal)"
    USERS }o--|| VOLUNTEERS : "volunteer_id (portal)"

    PROGRAMS ||--o{ TALENTS : "program_id"
    PROGRAMS ||--o{ APPLICATIONS : "program_id"
    PROGRAMS ||--o{ EVALUATIONS : "program_id"
    PROGRAMS ||--o{ ABSENCES : "program_id"

    UNIVERSITIES ||--o{ TALENTS : "university_id"
    UNIVERSITIES ||--o{ APPLICATIONS : "university_id"

    DEPARTMENTS ||--o{ TALENTS : "department_id"
    DEPARTMENTS ||--o{ ROTATIONS : "department_id"
    DEPARTMENTS ||--o{ PRESENCAS : "department_id"

    APPLICATIONS ||--o| TALENTS : "converted_talent_id"
    APPLICATIONS }o--|| STAGES : "stage"

    TALENTS ||--o{ ROTATIONS : "talent_id"
    TALENTS ||--o{ PAYMENTS : "talent_id"
    TALENTS ||--o{ TASKS : "talent_id"
    TALENTS ||--o{ ABSENCES : "talent_id"
    TALENTS ||--o{ WORKFLOWS : "talent_id"
    TALENTS ||--o{ MENTOR_SESSIONS : "talent_id"
    TALENTS ||--o{ EVALUATIONS : "talent_id"
    TALENTS ||--o{ PRESENCAS : "talent_id"
    TALENTS ||--o{ SESSOES_BOLSEIRO : "talent_id"
    TALENTS ||--o{ EVENTO_INSCRICOES : "talent_id"

    WORKFLOWS ||--o{ WORKFLOW_STEPS : "workflow_id"
    WORKFLOWS ||--o| PAYMENTS : "workflow_id"

    EVENTOS ||--o{ EVENTO_INSCRICOES : "evento_id"
    EVENTOS ||--o{ SESSOES_BOLSEIRO : "evento_id"

    USERS {
        bigint id PK
        string email UQ
        string role
        bigint talent_id FK
        bigint volunteer_id FK
    }
    TALENTS {
        bigint id PK
        string talent_code UQ
        string name
        string kind "bolseiro|estagiario"
        bigint program_id FK
        bigint university_id FK
        bigint department_id FK
        bigint mentor_user_id FK
        bigint application_id FK
        string status
        decimal stipend
        smallint perf
        decimal risk_score
    }
    APPLICATIONS {
        bigint id PK
        string application_ref UQ
        string name
        string email
        bigint program_id FK
        string tipo
        string stage
        smallint score
        bigint converted_talent_id FK
    }
    PROGRAMS { bigint id PK; string code UQ; string name }
    UNIVERSITIES { bigint id PK; string name UQ; string city; string country }
    DEPARTMENTS { bigint id PK; string name UQ }
    STAGES { bigint id PK; string code UQ; smallint sort }
```

---

## ERD — Voluntariado

```mermaid
erDiagram
    USERS }o--|| VOLUNTEERS : "volunteer_id"
    USERS ||--o{ VOLUNTEERS : "mentor_user_id"
    USERS ||--o{ HOURS_ENTRIES : "validado_por_user_id"
    USERS ||--o{ VOLUNTEER_ACTIVITIES : "coordenador_user_id"

    VOLUNTEERS ||--o{ VOLUNTEER_ACTIVITY_INSCRICOES : "volunteer_id"
    VOLUNTEER_ACTIVITIES ||--o{ VOLUNTEER_ACTIVITY_INSCRICOES : "activity_id"
    VOLUNTEERS ||--o{ HOURS_ENTRIES : "volunteer_id"
    VOLUNTEER_ACTIVITIES ||--o{ HOURS_ENTRIES : "activity_id"
    VOLUNTEERS ||--o{ EVENTO_INSCRICOES : "volunteer_id"

    VOLUNTEERS {
        bigint id PK
        string volunteer_code UQ
        string nome
        string email UQ
        string status
        string area_actuacao
        decimal total_horas
        bigint mentor_user_id FK
    }
    VOLUNTEER_ACTIVITIES {
        bigint id PK
        string activity_code UQ
        string nome
        string tipo
        date data
        smallint vagas_total
        smallint inscritos_count
        string status
    }
    HOURS_ENTRIES {
        bigint id PK
        string hour_code UQ
        bigint volunteer_id FK
        bigint activity_id FK
        decimal horas
        boolean validado
    }
    VOLUNTEER_ACTIVITY_INSCRICOES {
        bigint id PK
        bigint activity_id FK
        bigint volunteer_id FK
        timestamp inscrito_at
        boolean presente
    }
```

---

## ERD — Pagamentos & Workflows

```mermaid
erDiagram
    TALENTS ||--o{ PAYMENTS : "talent_id"
    WORKFLOWS ||--o{ PAYMENTS : "workflow_id"
    WORKFLOWS ||--o{ WORKFLOW_STEPS : "workflow_id"
    USERS ||--o{ WORKFLOW_STEPS : "approver_user_id"

    PAYMENTS {
        bigint id PK
        string payment_ref UQ
        bigint talent_id FK
        string type
        string period
        decimal amount
        string currency
        string status
        timestamp paid_at
        string method
        string idempotency_key UQ
        bigint workflow_id FK
    }
    WORKFLOWS {
        bigint id PK
        string workflow_code UQ
        bigint talent_id FK
        string type
        decimal amount
        string urgency
        smallint current_step
        smallint total_steps
        string status
    }
    WORKFLOW_STEPS {
        bigint id PK
        bigint workflow_id FK
        smallint step_number
        string approver_role
        bigint approver_user_id FK
        string decision
    }
```

---

## ERD — Documentos & Comunicação

```mermaid
erDiagram
    USERS ||--o{ DOCUMENTS : "uploaded_by_user_id"
    USERS ||--o{ DOCUMENTS : "reviewed_by_user_id"
    USERS ||--o{ MESSAGES : "from_user_id"
    USERS ||--o{ MESSAGES : "to_user_id"
    USERS ||--o{ NOTIFICATIONS : "notifiable"

    DOCUMENTS {
        bigint id PK
        string document_code UQ
        string owner_type "talent|application|volunteer|payment|workflow"
        bigint owner_id
        string name
        string category
        smallint version
        string storage_path
        string status
    }
    MESSAGES {
        bigint id PK
        bigint from_user_id FK
        bigint to_user_id FK
        text body
        timestamp read_at
    }
    NOTIFICATIONS {
        uuid id PK
        string type
        string notifiable_type
        bigint notifiable_id
        json data
        timestamp read_at
    }
```

---

## Cardinalidades-Chave

| De → Para | Cardinalidade | Notas |
|---|---|---|
| Application → Talent | 0..1 → 0..1 | candidatura aprovada gera 1 talento |
| Talent → Rotation | 1 → 0..N | apenas estagiários (kind=`estagiario`) |
| Talent → Payment | 1 → 0..N | histórico mensal/trimestral |
| Talent → Mentor (User) | 0..1 → 1 | um mentor por talento |
| User (mentor) → Talent | 1 → 0..N | mentor pode acompanhar vários |
| Workflow → Step | 1 → 1..N | tipicamente 4 |
| Workflow → Payment | 0..1 → 1 | um workflow valida um pagamento |
| Volunteer → HoursEntry | 1 → 0..N | |
| Activity → HoursEntry | 1 → 0..N | |
| Evento → Inscrição → (Talent ou Volunteer) | 1 → 0..N → 1 | XOR talent/volunteer |
| Document → owner (poly) | N → 1 | dono é talent/application/etc. |

---

## ERD — RBAC & Auditoria

```mermaid
erDiagram
    USERS ||--o{ USER_PERMISSIONS : "user_id"
    USERS ||--o{ ACTIVITY_LOG : "causer_id (causer_type=User)"

    USERS {
        bigint id PK
        string name
        string email UQ
        string bfa_role "rh|direcao|mentor|bolseiro|estagiario|voluntario"
        string phone
        bigint talent_id FK
        bigint volunteer_id FK
    }

    USER_PERMISSIONS {
        bigint id PK
        bigint user_id FK
        string permission "slug ex: pagamentos.aprovar"
        timestamp granted_at
        bigint granted_by FK
    }

    ACTIVITY_LOG {
        bigint id PK
        string log_name "default|auth|pagamentos|workflows"
        string description
        string subject_type "App\\Models\\Talent etc."
        bigint subject_id
        string causer_type "App\\Models\\User"
        bigint causer_id FK
        json properties "old/new values"
        string event "created|updated|deleted"
        timestamps
    }
```

### Roles BFA — Hierarquia de Acesso

| Role | Leitura | Escrita | Aprovação | Administração |
|---|---|---|---|---|
| `rh` | Todos | Candidaturas, Talentos, Pagamentos | Workflows (nível 1) | — |
| `direcao` | Todos | — | Workflows (nível final) | — |
| `mentor` | Seus talentos | Avaliações, Sessões | — | — |
| `bolseiro` | Próprio perfil | — | — | — |
| `estagiario` | Próprio perfil, Rotações | Presenças | — | — |
| `voluntario` | Próprio perfil, Actividades | Horas | — | — |

### Gates Definidas (AppServiceProvider)

| Gate | Roles com Acesso |
|---|---|
| `ver-candidaturas` | rh, direcao |
| `gerir-talentos` | rh |
| `aprovar-workflow` | rh (passo 1), direcao (passo final) |
| `ver-pagamentos` | rh, direcao |
| `ver-analytics` | rh, direcao |
| `gerir-voluntarios` | rh |
| `ver-bolseiro` | bolseiro, rh, mentor |
| `ver-estagiario` | estagiario, rh, mentor |

---

## Regras de Integridade

1. **Talento sem mentor** permitido para bolseiros nos primeiros 30 dias; flag de alerta após.
2. **Apenas 1 rotação `activa`** por talento (CHECK ou trigger).
3. **Pagamento** só pode passar a `paid` se o `workflow` associado estiver `approved` (ou se `workflow_id` for NULL — ex.: ajuste manual com auditoria).
4. **HoursEntry** só conta para `volunteers.total_horas` se `validado = true`.
5. **Application.converted_talent_id** preenche-se atomicamente quando `stage` passa de `oferta` → conversão para talent.
6. **Soft delete** preserva referência histórica em workflows/payments. Hard delete só em catálogos não-utilizados.
