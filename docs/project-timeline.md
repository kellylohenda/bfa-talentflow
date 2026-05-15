# Roadmap — BFA TalentFlow

> Datas indicativas a partir de **9 de Maio de 2026**. Cada marco entrega valor utilizável e end-to-end (API + Web).

---

## M0 — Fundações (semana 1–2)

**Objectivo:** repo organizado, API base, frontend base, CI verde.

- [ ] Mono-repo `apps/api` + `apps/web` + `docs`
- [ ] `apps/api`: clone do `laravel-api-kit`, `.env`, migrações base, locale PT-PT
- [ ] `apps/web`: o `bfa-talentflow/` actual movido para `apps/web/`
- [ ] CI GitHub Actions (Pest + PHPStan + Pint + ESLint + tsc)
- [ ] OpenAPI servida em `/docs/api` (Scramble)
- [ ] Health endpoint
- [ ] Sentry configurado em ambos os apps
- [ ] Mensagens de validação traduzidas para `pt_PT`

**Critérios de aceitação:** `pnpm dev` + `php artisan serve` correm; `/api/v1/me` responde 401 sem token; `/docs/api` mostra UI.

---

## M1 — Auth + RBAC + Utilizadores (semana 3–4)

- [ ] Sanctum + login/logout/me/forgot/reset (já no kit)
- [ ] spatie/laravel-permission com 6 roles
- [ ] Seeder de utilizadores demo (1 por role)
- [ ] Middleware de role + policy base
- [ ] Frontend: ecrã de login conectado à API real (substituir cookie demo)
- [ ] `useRole.ts` lê de `/me` em vez de cookie
- [ ] Testes Pest cobrindo cada role

**Aceitação:** cada um dos 6 roles consegue autenticar-se e ver apenas as páginas/menus permitidos.

---

## M2 — Catálogos + Talentos + Candidaturas (semana 5–7)

- [ ] Modelos: `Programa`, `Departamento`, `Universidade`, `Talento`, `Candidatura`
- [ ] Endpoints CRUD + filters (query-builder)
- [ ] Transições: `candidaturas/{id}/avancar`, `rejeitar`
- [ ] Endpoint público `POST /publico/candidaturas` + email Resend
- [ ] Endpoint público `GET /publico/candidaturas/{ref}` (estado)
- [ ] Frontend: páginas `talentos`, `talentos/[id]`, `candidaturas`, `programa`, `candidatura`, `portal/[ref]` ligadas à API
- [ ] Mock `lib/data.ts` removido nas páginas conectadas

**Aceitação:** candidato submete formulário público → email recebido → RH vê na pipeline → pode avançar fases.

---

## M3 — Bolseiros + Estagiários + Rotações (semana 8–9)

- [ ] `Bolseiro` e `Estagiario` como subset de `Talento` (kind)
- [ ] Modelo `Rotacao` + endpoints + transição de estado
- [ ] `SessaoBolseiro` e `Presenca`
- [ ] Frontend: `bolseiro` (portal pessoal), `estagiarios`, perfil de talento
- [ ] 2FA para `rh` e `direcao` (laravel-fortify ou paragonie/totp)

**Aceitação:** estagiário FBFA tem rotação activa visível no perfil; bolseiro vê pagamentos e sessões; mentor vê mentees.

---

## M4 — Pagamentos + Workflows + Tarefas + Faltas (semana 10–11)

- [ ] `Pagamento` com idempotency key
- [ ] `Workflow` multi-step + aprovações
- [ ] `Tarefa` (assigned by RH/mentor → bolseiro/estagiário)
- [ ] `Falta` com circuito mentor → RH
- [ ] Frontend: `pagamentos`, `workflows`, `tarefas`, `faltas`
- [ ] Activity log em todas as transições
- [ ] Notificações via email (Resend)

**Aceitação:** pagamento processa-se com idempotência; workflow segue ordem correcta; tarefa concluída notifica RH.

---

## M5 — Voluntariado + Mentoria + Avaliações + Documentos + Agenda (semana 12–13)

- [ ] `Voluntario`, `Actividade`, `HorasEntry` (com validação RH)
- [ ] `MentorSession`
- [ ] `Avaliacao` (ciclos 360°)
- [ ] `Documento` com versionamento + S3
- [ ] `Evento` (workshops, mentoria)
- [ ] Chat (`Mensagem`) + Notificações (`Notificacao`)
- [ ] Frontend: voluntario, voluntarios, actividades, horas, mentoria, mentor, avaliacoes, documentos, agenda, chat, notificacoes, relatorios-voluntariado

**Aceitação:** voluntário inscreve-se em actividade; horas registadas; RH valida; avaliação 360° abre e fecha ciclo.

---

## M6 — Análise Executiva + Compliance + Polimento (semana 14–16)

- [ ] Endpoints `analytics/*` (overview, geografia, ROI, retenção, sucessão)
- [ ] Compliance + auditoria queryable
- [ ] Página `9-Box` com algoritmo
- [ ] Cache de dashboards (Redis) com TTL adequado
- [ ] Importação/exportação CSV/XLSX
- [ ] Logging estruturado + audit trail completo
- [ ] Documentação final, glossário em sync, runbook de produção

**Aceitação:** Direcção vê KPIs em tempo real; relatório de Sucessão exporta para PDF; auditor consegue tracear acção → utilizador → timestamp.

---

## Pós-M6 (Nice-to-have)

- App nativa (NativePHP / Expo) para participantes
- Integração com SAP HR do BFA (sync de quadros)
- BI directo via Metabase (read replica)
- Multi-language (PT-AO oficial → futuras línguas)
- Webhooks para integrações externas
