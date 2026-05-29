# Plano de Implementação — Portais de Participantes

> **Data início:** 29 Mai 2026
> **Estado:** 🔄 Em progresso
> **Responsável:** opencode
> **Objetivo:** Criar portais self-service para Bolseiro, Estagiário e Voluntário seguindo o layout do legacy

---

## Visão Geral

O sistema tem 3 tipos de participantes que precisam de portais próprios:

| Participante | Modelo DB | Controller Actual | Portal Actual |
|-------------|-----------|-------------------|---------------|
| **Bolseiro** | `Talent` (kind=bolseiro) | `BolseiroController` | `/bolseiro` (existe, incompleto) |
| **Estagiário** | `Talent` (kind=estagiario) | `EstagiariosController` (admin) | **NÃO existe** |
| **Voluntário** | `Volunteer` | `VoluntariosController` (admin) | **NÃO existe** |

Cada portal segue o layout do protótipo Next.js legacy (`_legacy/app/(dashboard)/`).

---

## BLOCO 1: Bugs Críticos

**Estado:** ⏳ Pendente
**Esforço estimado:** 30min

| # | Bug | Ficheiro | Fix |
|---|-----|----------|-----|
| 1.1 | `useForm()` chamado depois de `return` condicional | `talentos/show.tsx:54` | Mover hooks antes do return |
| 1.2 | `HoursEntry::getStatusAttribute()` — `false` retorna `'rejeitado'` em vez de `'pendente'` | `app/Models/HoursEntry.php` | Mudar `validado` para nullable: `null`=pendente, `true`=validado, `false`=rejeitado |
| 1.3 | `HorasController` filtro pendente usa `whereNull` mas coluna default é `false` | `app/Http/Controllers/HorasController.php` | Alinhar com lógica nullable |
| 1.4 | `documentos/show.tsx` — `owner_type.split('\\')` crasha se null | `documentos/show.tsx:31` | Adicionar `?.` guard |
| 1.5 | `console.log` em produção | `talentos/edit.tsx:15` | Remover |
| 1.6 | Dashboard 403 para participantes | `DashboardController.php` | Redirecionar para portal próprio |

---

## BLOCO 2: Backend — Voluntário

**Estado:** ⏳ Pendente
**Esforço estimado:** 1h30

| # | Tarefa | Ficheiro | Detalhe |
|---|--------|----------|---------|
| 2.1 | Criar `VoluntarioController` | `app/Http/Controllers/VoluntarioController.php` | NOVO |
| 2.2 | Método `index()` | O mesmo | Busca volunteer via `user_id`, carrega `hoursEntries`, `activityInscricoes.activity`, `mentor` |
| 2.3 | Criar rota `GET /voluntario` | `routes/web.php` | Protegida para `bfa_role=voluntario` |
| 2.4 | Adicionar `percentagem` ao relatório | `RelatoriosVoluntariadoController.php` | Calcular `horas / total * 100` |
| 2.5 | Corrigir `StoreHoursEntryRequest` | `StoreHoursEntryRequest.php` | Restringir `volunteer_id` ao próprio user |
| 2.6 | Adicionar auth API volunteer | `VolunteerController.php` | `abort_unless` em index/show |
| 2.7 | Criar rota `POST /voluntario/horas` | `routes/web.php` | Registo de horas pelo voluntário |
| 2.8 | Método `storeHoras()` | `VoluntarioController.php` | Valida e cria HoursEntry |

---

## BLOCO 3: Backend — Estagiário

**Estado:** ⏳ Pendente
**Esforço estimado:** 30min

| # | Tarefa | Ficheiro | Detalhe |
|---|--------|----------|---------|
| 3.1 | Criar `EstagiarioController` | `app/Http/Controllers/EstagiarioController.php` | NOVO |
| 3.2 | Método `index()` | O mesmo | Busca talento (kind=estagiario) via `user_id`, carrega rotations, payments, tasks, evaluations, mentor |
| 3.3 | Criar rota `GET /estagiario` | `routes/web.php` | Protegida para `bfa_role=estagiario` |

---

## BLOCO 4: Backend — Bolseiro (melhorar)

**Estado:** ⏳ Pendente
**Esforço estimado:** 30min

| # | Tarefa | Ficheiro | Detalhe |
|---|--------|----------|---------|
| 4.1 | Melhorar `BolseiroController::index()` | `BolseiroController.php` | Adicionar absences, documents, mentorSessions ao Inertia render |
| 4.2 | Passar dados completos | O mesmo | tarefas, pagamentos, faltas, documentos, sessões, presenças |

---

## BLOCO 5: Correcções Gerais

**Estado:** ⏳ Pendente
**Esforço estimado:** 15min

| # | Tarefa | Ficheiro | Detalhe |
|---|--------|----------|---------|
| 5.1 | Corrigir voluntarios/show — activityInscricoes | `VoluntariosController.php` (show) | Mudar `eventoInscricoes` para `activityInscricoes.activity` |
| 5.2 | Verificar inscrever — estado da actividade | `VolunteerActivityController.php` | Verificar status != cancelada |

---

## BLOCO 6: Frontend — Portal do Voluntário

**Estado:** ⏳ Pendente
**Esforço estimado:** 2h30
**Ficheiro:** `resources/js/pages/voluntario/index.tsx` (NOVO)
**Layout:** Seguir `_legacy/app/(dashboard)/voluntario/page.tsx`

### Estrutura do Legacy (4 abas)

```
HEADER: "Olá, {nome}" + badge nível + subtítulo
KPI ROW: [Total Horas] [Nível] [Actividades] [Validadas]
TABS: [Início] [As Minhas Horas] [Actividades] [O Meu Perfil]
```

### Detalhe por Aba

**ABA "INÍCIO":**
- 2 colunas:
  - Esquerda: "Progresso de Nível" (4 níveis com checkmarks + barra de progresso)
  - Direita: "Próximas Actividades" + "Horas por Actividade"

**ABA "AS MINHAS HORAS":**
- 4 KPIs: Total, Validadas, Pendentes, Actividades
- Tabela: Data, Actividade, Horas, Estado (pill), Validado por

**ABA "ACTIVIDADES":**
- Grid 2 colunas de cards com:
  - Badge de área (cor por tipo)
  - Pill de estado (agendada/activa/concluída)
  - Nome, data/hora, local
  - Vagas: inscritos/total
  - Botão "Inscrever" ou "✓ Participei"

**ABA "O MEU PERFIL":**
- Avatar com iniciais + cor do nível
- Nome, profissão, instituição
- Grid 2 colunas: Email, Telefone, Área, Província, Local, Data inscrição, Nível, Total horas, Mentor, Estado

### Níveis

| Nível | Horas | Cor | Fundo |
|-------|-------|-----|-------|
| Iniciante | 0-49h | #6B7280 | #F3F4F6 |
| Bronze | 50-99h | #B45309 | #FEF3C7 |
| Prata | 100-199h | #6B7280 | #F3F4F6 |
| Ouro | 200-399h | #D97706 | #FEF9C3 |
| Platina | 400h+ | #2563EB | #EFF6FF |

### Componentes a usar
- `KPI` (`ui/kpi.tsx`)
- `BfaAvatar` (`ui/avatar.tsx`)
- `Badge` (`ui/badge.tsx`) — variantes success/warn/danger/info
- `.bar-track` + `.bar-fill` — barras de progresso
- `.tabs` / `.tab` / `.tab-active`
- `.card` / `.card-head` / `.card-pad`
- `.tbl` — tabelas

---

## BLOCO 7: Frontend — Portal do Estagiário

**Estado:** ⏳ Pendente
**Esforço estimado:** 2h
**Ficheiro:** `resources/js/pages/estagiario/index.tsx` (NOVO)
**Layout:** Seguir `_legacy/app/(dashboard)/bolseiro/page.tsx` (versão estagiário)

### Estrutura do Legacy (6 abas)

```
HEADER: "Olá, {nome}" + badge "Estagiário" + subtítulo
KPI ROW: [Último Subsídio] [Desempenho] [Rotação] [Tarefas]
TABS: [Início] [Presenças] [Rotações] [Pagamentos] [Tarefas] [Perfil]
```

### Detalhe por Aba

**ABA "INÍCIO":**
- Notificações + Próxima sessão + Rotação actual

**ABA "PRESENÇAS":**
- KPIs: Dias trabalhados, Horas totais, Taxa presença, Esta semana
- Tabela de presenças

**ABA "ROTAÇÕES":**
- Timeline vertical de rotações (activo=laranja, concluído=verde, pendente=cinza)
- Auto-avaliação de competências (5 competências com Bar)

**ABA "PAGAMENTOS":**
- KPIs + Tabela de pagamentos

**ABA "TAREFAS":**
- Tabela de tarefas com acções

**ABA "PERFIL":**
- Card com dados completos + Performance (Bar)

---

## BLOCO 8: Frontend — Melhorar Portal do Bolseiro

**Estado:** ⏳ Pendente
**Esforço estimado:** 1h30
**Ficheiro:** `resources/js/pages/bolseiro/index.tsx` (modificar)
**Layout:** Seguir `_legacy/app/(dashboard)/bolseiro/page.tsx` (versão bolseiro)

### Abas a adicionar

| Aba Actual | Aba Nova |
|------------|---------|
| Início | ✅ Manter |
| — | **Presenças & Sessões** (NOVA) |
| Pagamentos | ✅ Manter |
| — | **As Minhas Tarefas** (NOVA) |
| — | **O Meu Perfil** (NOVA) |

---

## BLOCO 9: Sidebar

**Estado:** ⏳ Pendente
**Esforço estimado:** 15min
**Ficheiro:** `resources/js/components/app-sidebar.tsx`

### Mudanças

| Role | Link "Portal" | Rota Actual | Rota Nova |
|------|--------------|-------------|-----------|
| bolseiro | "O Meu Programa" | `/bolseiro` | `/bolseiro` (manter) |
| estagiario | "O Meu Programa" | `/bolseiro` | `/estagiario` (NOVO) |
| voluntario | "O Meu Perfil" | `/bolseiro` (BUG!) | `/voluntario` (NOVO) |

---

## BLOCO 10: Dashboard Participantes

**Estado:** ⏳ Pendente
**Esforço estimado:** 15min
**Ficheiro:** `app/Http/Controllers/DashboardController.php`

### Mudança

```php
// No início de __invoke():
if ($role->isBolseiro() || $role->isEstagiario()) {
    return redirect()->route('bolseiro.index');
}
if ($role->isVoluntario()) {
    return redirect()->route('voluntario.index');
}
```

---

## BLOCO 11: Testes

**Estado:** ⏳ Pendente
**Esforço estimado:** 1h

| # | Tarefa | Ficheiro |
|---|--------|----------|
| 11.1 | Criar `ProgramFactory` | `database/factories/ProgramFactory.php` |
| 11.2 | Corrigir `VolunteerApiTest` | `tests/` |
| 11.3 | Corrigir `MessageApiTest` | `tests/` |
| 11.4 | Criar testes para novos controllers | `tests/` |

---

## BLOCO 12: Build + Limpeza

**Estado:** ⏳ Pendente
**Esforço estimado:** 30min

| # | Tarefa |
|---|--------|
| 12.1 | `npm run lint -- --fix` |
| 12.2 | `npm run types:check` |
| 12.3 | `npm run build` |
| 12.4 | `vendor/bin/pint` |
| 12.5 | Actualizar PLANO_MIGRACAO.md |

---

## Progresso

| Bloco | Estado | Conclusão |
|-------|--------|-----------|
| 1. Bugs críticos | ✅ Completo | 29 Mai 2026 |
| 2. Backend voluntário | ✅ Completo | 29 Mai 2026 |
| 3. Backend estagiário | ✅ Completo | 29 Mai 2026 |
| 4. Backend bolseiro | ✅ Completo | 29 Mai 2026 |
| 5. Correcções gerais | ✅ Completo | 29 Mai 2026 |
| 6. Frontend voluntário | ✅ Completo | 29 Mai 2026 |
| 7. Frontend estagiário | ✅ Completo | 29 Mai 2026 |
| 8. Frontend bolseiro | ✅ Completo | 29 Mai 2026 |
| 9. Sidebar | ✅ Completo | 29 Mai 2026 |
| 10. Dashboard participantes | ✅ Completo | 29 Mai 2026 |
| 11. Testes | ✅ Completo | 29 Mai 2026 |
| 12. Build + limpeza | ✅ Completo | 29 Mai 2026 |

### Estado Final

| Verificação | Resultado |
|-------------|-----------|
| TypeScript | ✅ 0 erros |
| Pint (PHP) | ✅ Pass |
| ESLint | ⚠️ 41 erros (todos pré-existentes, nenhum novo) |
| Build | ✅ Compilou |
| Migrations | ✅ 38/38 correram |

---

## Dados por Role

| O que cada role vê | Bolseiro | Estagiário | Voluntário |
|--------------------|----------|------------|------------|
| **Portal** | KPIs, Mentor, Tarefas, Pagamentos, Presenças, Sessões, Perfil | KPIs, Mentor, Rotações, Presenças, Pagamentos, Tarefas, Perfil | KPIs, Nível, Actividades, Horas, Perfil |
| **Sidebar** | Dashboard, Programa, Agenda, Tarefas, Faltas, Docs, Mensagens | Dashboard, Programa, Agenda, Tarefas, Faltas, Docs, Mensagens | Dashboard, Perfil, Agenda, Actividades, Horas, Mensagens |
| **Accões** | Ver dados, Submeter docs | Ver dados, Submeter docs | Ver dados, Registar horas, Inscrever-se |
