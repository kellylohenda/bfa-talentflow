# Plano do Dashboard Executivo

Este documento detalha as **27 páginas do dashboard** já protótipadas em `apps/web/app/(dashboard)/`. Cada página é mapeada a endpoints da API e ao conjunto de roles que lhe têm acesso.

---

## Visão por Role

### RH / Direcção

| Página | Rota | Endpoints API |
|---|---|---|
| Visão Geral | `/overview` | `GET /analytics/overview` |
| Candidaturas | `/candidaturas` | `GET /candidaturas`, transitions |
| Talentos | `/talentos` | `GET /talentos`, `?include=mentor` |
| Talento (perfil) | `/talentos/[id]` | `GET /talentos/{id}?include=rotacoes,sessoes,pagamentos,avaliacoes` |
| Estagiários | `/estagiarios` | `GET /estagiarios`, `GET /estagiarios/{id}/rotacoes` |
| Tarefas | `/tarefas` | `GET /tarefas` |
| Faltas | `/faltas` | `GET /faltas` + transitions |
| Agenda | `/agenda` | `GET /eventos` |
| Pagamentos | `/pagamentos` | `GET /pagamentos` + `POST /processar` |
| Workflows | `/workflows` | `GET /workflows` + transitions |
| Documentos | `/documentos` | `GET /documentos` |
| Chat | `/chat` | `GET /mensagens`, `POST /mensagens` |
| Notificações | `/notificacoes` | `GET /notificacoes` + `POST /marcar-lidas` |
| Avaliações | `/avaliacoes` | `GET /avaliacoes` |
| Mentoria (RH) | `/mentoria` | `GET /mentoria/sessoes` (visão admin) |
| Voluntários | `/voluntarios` | `GET /voluntarios` |
| Actividades | `/actividades` | `GET /actividades` |
| Horas (validação) | `/horas` | `GET /horas?validado=false` + `POST /validar` |
| Relatórios Voluntariado | `/relatorios-voluntariado` | `GET /analytics/voluntariado` |
| Geografia | `/geografia` | `GET /analytics/geografia` |
| ROI | `/roi` | `GET /analytics/roi` |
| Compliance | `/compliance` | `GET /compliance` |
| Retenção | `/retencao` | `GET /analytics/retencao` |
| Sucessão (9-Box) | `/sucessao` | `GET /analytics/sucessao` |

### Mentor

| Página | Rota | Endpoints |
|---|---|---|
| Painel Mentor | `/mentor` | `GET /mentoria/sessoes?filter[mentor]=me`, `GET /talentos?filter[mentor]=me` |
| Tarefas (mentees) | `/tarefas` | `GET /tarefas?filter[mentor]=me` |
| Avaliações (mentees) | `/avaliacoes` | `GET /avaliacoes?filter[mentor]=me` |

### Bolseiro / Estagiário

| Página | Rota | Endpoints |
|---|---|---|
| Portal | `/bolseiro` | `GET /me/bolseiro` (composto) |
| Pagamentos | (no portal) | `GET /pagamentos?filter[talent]=me` |
| Tarefas | `/tarefas` | `GET /tarefas?filter[assignee]=me` + `POST /concluir` |
| Faltas | `/faltas` | `POST /faltas` |
| Agenda | `/agenda` | `GET /eventos?filter[audience]=bolseiro` |

### Voluntário

| Página | Rota | Endpoints |
|---|---|---|
| Portal Voluntário | `/voluntario` | `GET /me/voluntario` (composto) |
| Actividades | `/actividades` | `GET /actividades` + `POST /inscrever` |
| Horas | (no portal) | `GET /horas?filter[voluntario]=me` |

---

## Composição de Endpoints

Endpoints "compostos" (`/me/bolseiro`, `/me/voluntario`, `/analytics/overview`) reduzem round-trips iniciais e são feitos para servir uma página inteira numa só chamada.

Cada um devolve um envelope com várias secções:

```json
{
  "data": {
    "perfil": { ... },
    "kpis": { "presenca_pct": 92, "tarefas_pendentes": 2, ... },
    "proximos_eventos": [ ... ],
    "ultimos_pagamentos": [ ... ]
  }
}
```

---

## Caching

| Endpoint | TTL | Invalidação |
|---|---|---|
| `/analytics/overview` | 5 min | manual + cron diário |
| `/analytics/geografia` | 1 h | upload de talento/rotação |
| `/analytics/roi` | 1 h | pagamento/contratação |
| `/programas`, `/departamentos`, `/universidades` | 24 h | edição admin |
| `/me/*` | sem cache | sempre fresh |
