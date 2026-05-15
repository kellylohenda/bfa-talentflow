# Contrato API — BFA TalentFlow

Padronização do contrato REST. **Toda a output (mensagens, validações, erros) é entregue em PT-PT.**

---

## Princípios

- **REST + JSON**, versionado por URI: `/api/v1/...`
- **Stateless**, autenticação via **Sanctum bearer token**
- **HTTP semântico**: 200/201/204 sucesso · 400/401/403/404/409/422 cliente · 500 servidor
- **Conteúdo**: `Accept: application/json` obrigatório (middleware `ForceJsonResponse`)
- **Documentação**: gerada automaticamente em `/docs/api` (Scramble)
- **Idempotência**: `Idempotency-Key` em `POST /payments`, `POST /workflows/*/approve`
- **Datas**: ISO 8601 (`2026-05-09T14:30:00+01:00`) na API, formatação local feita no cliente
- **Locale**: header `Accept-Language: pt-PT` (default e único suportado em V1)
- **Filtros**: spatie/query-builder — `?filter[status]=active&sort=-created_at&include=mentor`

---

## Envelope de Resposta

### Sucesso

```json
{
  "data": { ... } | [ ... ],
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 137
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

### Erro de validação (422)

```json
{
  "message": "Os dados fornecidos são inválidos.",
  "errors": {
    "email": ["O campo email é obrigatório."],
    "telefone": ["O telefone deve ter o formato +244 9XX XXX XXX."]
  }
}
```

### Erro genérico

```json
{
  "message": "Não autorizado.",
  "code": "AUTH_FORBIDDEN",
  "trace_id": "01HXY..."
}
```

---

## Autenticação

### Login

`POST /api/v1/login`

```json
{ "email": "rh@bfa.ao", "password": "..." }
```

→ 200

```json
{
  "data": {
    "user": { "id": 1, "name": "...", "email": "...", "role": "rh" },
    "token": "1|abcdef...",
    "abilities": ["candidaturas.*", "talentos.*", "..."]
  }
}
```

### Logout

`POST /api/v1/logout` (autenticado) → 204

### Me

`GET /api/v1/me` → utilizador actual + role + permissões

---

## Convenções de URL

| Recurso | URL base |
|---|---|
| Candidaturas | `/api/v1/candidaturas` |
| Talentos | `/api/v1/talentos` |
| Bolseiros | `/api/v1/bolseiros` (subset de talentos) |
| Estagiários | `/api/v1/estagiarios` (subset de talentos) |
| Rotações | `/api/v1/estagiarios/{id}/rotacoes` |
| Voluntários | `/api/v1/voluntarios` |
| Actividades | `/api/v1/actividades` |
| Horas | `/api/v1/horas` |
| Pagamentos | `/api/v1/pagamentos` |
| Workflows | `/api/v1/workflows` |
| Tarefas | `/api/v1/tarefas` |
| Faltas | `/api/v1/faltas` |
| Mentoria (sessões) | `/api/v1/mentoria/sessoes` |
| Avaliações | `/api/v1/avaliacoes` |
| Documentos | `/api/v1/documentos` |
| Notificações | `/api/v1/notificacoes` |
| Mensagens (chat) | `/api/v1/mensagens` |
| Eventos / Agenda | `/api/v1/eventos` |
| Programas | `/api/v1/programas` |
| Departamentos | `/api/v1/departamentos` |
| Universidades | `/api/v1/universidades` |
| Análise: Overview | `/api/v1/analytics/overview` |
| Análise: Geografia | `/api/v1/analytics/geografia` |
| Análise: ROI | `/api/v1/analytics/roi` |
| Análise: Retenção | `/api/v1/analytics/retencao` |
| Análise: Sucessão (9-Box) | `/api/v1/analytics/sucessao` |
| Compliance | `/api/v1/compliance` |
| Público — programa | `/api/v1/publico/programa` |
| Público — candidatura | `POST /api/v1/publico/candidaturas` |
| Público — estado | `GET /api/v1/publico/candidaturas/{ref}` |
| Portal de candidato (login por ref) | `POST /api/v1/publico/portal/login` |

---

## Verbos por Recurso

Padrão CRUD para cada recurso:

| Verbo | URL | Acção |
|---|---|---|
| `GET` | `/recurso` | Listar (paginado, filtrável) |
| `GET` | `/recurso/{id}` | Detalhe |
| `POST` | `/recurso` | Criar |
| `PUT/PATCH` | `/recurso/{id}` | Actualizar |
| `DELETE` | `/recurso/{id}` | Eliminar (soft-delete onde aplicável) |

Acções não-CRUD (transições de estado):

```
POST /candidaturas/{id}/avancar           # próxima fase
POST /candidaturas/{id}/rejeitar
POST /workflows/{id}/aprovar
POST /workflows/{id}/rejeitar
POST /faltas/{id}/aprovar
POST /faltas/{id}/rejeitar
POST /pagamentos/{id}/processar
POST /actividades/{id}/inscrever          # voluntário inscreve-se
POST /horas/{id}/validar
POST /tarefas/{id}/concluir
POST /eventos/{id}/inscrever
```

---

## Filtros e Ordenação (query-builder)

Exemplos:

```
GET /api/v1/talentos?filter[status]=active&filter[program]=fbfa&sort=-perf&include=mentor,rotacoes&page=1&per_page=25
GET /api/v1/candidaturas?filter[stage]=entrevista2&sort=-score
GET /api/v1/pagamentos?filter[status]=pending&filter[period]=2026-05
```

Campos `include` permitidos por recurso documentados em Scramble.

---

## Permissões (RBAC)

Mapa simplificado (detalhes em `features/auth-rbac.md`):

| Recurso | rh | direcao | mentor | bolseiro | estagiario | voluntario |
|---|---|---|---|---|---|---|
| Candidaturas | CRUD+transitions | R+approve | — | — | — | — |
| Talentos | CRUD | R | R (mentees) | R (own) | R (own) | — |
| Pagamentos | CRUD+process | R+approve | — | R (own) | R (own) | — |
| Workflows | CRUD | R+approve | R+create | R (own) | R (own) | R (own) |
| Mentoria sessões | R | R | CRUD (own) | R (own) | R (own) | — |
| Tarefas | CRUD | R | CRUD (mentees) | R+complete (own) | R+complete (own) | — |
| Faltas | R+approve | R | R+approve (mentees) | C (own) | C (own) | — |
| Voluntariado | CRUD | R | — | — | — | R (own) + register hours |
| Análise | R | R | — | — | — | — |

`R` = read · `C` = create · CRUD inclui update/delete · transitions = endpoints de mudança de estado.

---

## Rate Limiting

Reutiliza throttlers do `laravel-api-kit`:

- `throttle:auth` — 5/min para login/register
- `throttle:authenticated` — 120/min para utilizadores autenticados
- `throttle:6,1` — 6/min para password reset, resend verification, candidaturas públicas

---

## Erros — Códigos Internos

| `code` | HTTP | Significado |
|---|---|---|
| `AUTH_INVALID_CREDENTIALS` | 401 | Credenciais inválidas |
| `AUTH_FORBIDDEN` | 403 | Sem permissão para a acção |
| `AUTH_EMAIL_NOT_VERIFIED` | 403 | Email por verificar |
| `RESOURCE_NOT_FOUND` | 404 | Recurso não existe |
| `VALIDATION_FAILED` | 422 | Erro de validação |
| `STATE_INVALID_TRANSITION` | 409 | Transição de estado não permitida |
| `IDEMPOTENCY_REPLAY` | 200/conflict | Resposta replicada por idempotency-key |
| `RATE_LIMIT_EXCEEDED` | 429 | Excedeu o rate limit |
| `INTERNAL_ERROR` | 500 | Erro interno (com `trace_id`) |

---

## Versionamento

V1 é **estável** durante todo M0–M6. Breaking changes vão para `/api/v2` com deprecation header em V1:

```
Deprecation: true
Sunset: Wed, 31 Dec 2026 23:59:59 GMT
Link: </api/v2/...>; rel="successor-version"
```

Gerido por `grazulex/laravel-apiroute` (já presente no kit).
