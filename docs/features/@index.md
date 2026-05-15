# Índice de Features

| Feature | Página(s) Web | Endpoints | Documento |
|---|---|---|---|
| Auth + RBAC | `/login`, `/me` | `/login`, `/logout`, `/me`, `/forgot-password`, `/reset-password` | `auth-rbac.md` |
| Candidaturas | `/candidaturas`, `/programa`, `/candidatura`, `/portal/[ref]` | `/candidaturas`, `/publico/candidaturas` | `candidaturas.md` |
| Talentos | `/talentos`, `/talentos/[id]` | `/talentos` | `talentos.md` |
| Estagiários + Rotações | `/estagiarios` | `/estagiarios`, `/estagiarios/{id}/rotacoes` | `estagiarios-rotacoes.md` |
| Bolseiro Portal | `/bolseiro` | `/me/bolseiro` | `bolseiro-portal.md` |
| Voluntariado | `/voluntario`, `/voluntarios`, `/actividades`, `/horas`, `/relatorios-voluntariado` | `/voluntarios`, `/actividades`, `/horas` | `voluntariado.md` |
| Mentoria | `/mentor`, `/mentoria` | `/mentoria/sessoes` | `mentoria.md` |
| Pagamentos | `/pagamentos` | `/pagamentos` + processar | `pagamentos.md` |
| Workflows / Aprovações | `/workflows` | `/workflows` + aprovar/rejeitar | `workflows-aprovacoes.md` |
| Tarefas + Faltas | `/tarefas`, `/faltas` | `/tarefas`, `/faltas` | `tarefas-faltas.md` |
| Avaliações 360° | `/avaliacoes` | `/avaliacoes` | `avaliacoes-360.md` |
| Documentos | `/documentos` | `/documentos` (poly) | `documentos.md` |
| Comunicação + Notificações | `/chat`, `/notificacoes` | `/mensagens`, `/notificacoes` | `comunicacao-notificacoes.md` |
| Agenda + Workshops | `/agenda` | `/eventos` + inscrever | `agenda-workshops.md` |
| Análise Executiva | `/overview`, `/geografia`, `/roi`, `/retencao`, `/sucessao`, `/compliance` | `/analytics/*`, `/compliance` | `analytics-executivo.md` |

> Cada feature doc segue a estrutura: **Resumo · Modelos · Endpoints · Regras de Negócio · Permissões · Validações PT-PT · Casos de Teste**.
