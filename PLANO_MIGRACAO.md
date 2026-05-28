# Plano de Migração: Layout Legacy → bft_talent

> **Data início:** 28 Mai 2026
> **Data conclusão:** 28 Mai 2026
> **Estado:** ✅ Completo
> **Responsável:** opencode

---

## Objectivo

Migrar o layout visual do protótipo Next.js legacy (`_legacy/`) para o frontend Laravel/Inertia (`bft_talent/`), sem alterar a lógica de negócio existente.

## Decisões Técnicas

| Decisão | Escolha |
|---------|---------|
| Role Switcher | **Removido** — cada utilizador tem role fixo via `bfa_role` |
| Pesquisa Global | **Híbrida** — client-side (instantânea) + API (cross-module) |
| Notificações | **Híbridas** — DB (tabela notifications) + client-side (regras live) |
| UI Components | **Migrar do legacy** — KPI, Charts, Avatar, Pill |
| Páginas | **Manter bft_talent** — atualizar apenas o visual |

---

## FASE 1: Sidebar — User Footer

**Estado:** ✅ Completo
**Ficheiro:** `resources/js/components/app-sidebar.tsx`

### Tarefas
- [x] Adicionar `ROLE_LABELS` map (subtítulos PT-PT por role)
- [x] Atualizar footer `sb-user` para mostrar subtítulo do role
- [x] Verificar todas as 6 labels
- [x] Remover Clock SVG custom (usar lucide-react)

### Notas
- Subtítulos: Gestora de Programa — RH, Direcção de RH, Director — Banca de Empresas, etc.
- Footer agora mostra: Nome + Subtítulo do Role + Email + Botão Logout

---

## FASE 2a: Topbar — Pesquisa Global

**Estado:** ✅ Completo
**Ficheiro:** `resources/js/components/app-sidebar-header.tsx`
**Endpoint:** `GET /api/v1/pesquisa?q={query}`

### Tarefas
- [x] Criar estado `searchQuery`, `searchResults`, `searchOpen` no header
- [x] Implementar debounce 300ms
- [x] Criar `PesquisaController` no backend
- [x] Criar rota `GET /api/v1/pesquisa` no `routes/api.php`
- [x] Implementar pesquisa via API (cross-module)
- [x] Criar dropdown de resultados agrupados por categoria
- [x] Navegação: Enter → primeiro resultado, Escape → fecha
- [x] Click outside fecha dropdown

### Ficheiros criados
- `app/Http/Controllers/Api/V1/PesquisaController.php`
- Rota adicionada em `routes/api.php`

---

## FASE 2b: Topbar — Notificações

**Estado:** ✅ Completo
**Ficheiro:** `resources/js/components/app-sidebar-header.tsx`

### Tarefas
- [x] Criar componente `NotificationsDropdown` (inline)
- [x] Gerar notificações client-side (regras live por role)
- [x] Badge vermelho com contagem de não lidas
- [x] Dropdown com lista de notificações
- [x] Click outside fecha dropdown

### Regras implementadas
| Role | Regra | Tipo |
|------|-------|------|
| rh/direcao | Pagamentos pendentes | warn |
| rh/direcao | Candidaturas em análise | info |
| rh/direcao | Talentos em risco (risk_score >= 0.4) | danger |
| mentor | Tarefas em atraso (mentees) | danger |
| bolseiro/estagiario | Pagamentos pendentes próprio | info |

---

## FASE 2c: Topbar — Breadcrumbs

**Estado:** ✅ Completo
**Ficheiro:** `resources/js/components/app-sidebar-header.tsx`

### Tarefas
- [x] Completar mapa `PATH_LABELS` com todos os 34 paths do legacy
- [x] Verificar mapeamento correto de cada path

---

## FASE 3a: Componente UI — KPI Tile

**Estado:** ✅ Completo
**Ficheiro:** `resources/js/components/ui/kpi.tsx` (NOVO)

### Tarefas
- [x] Criar componente `KPI` com interface do legacy
- [x] Props: `label`, `value`, `sub`, `delta`, `deltaTone`, `icon`
- [x] Usar classes CSS `.kpi`, `.kpi-label`, `.kpi-value`, `.kpi-sub`, `.kpi-delta`
- [x] Suportar variantes `up`, `down`, `flat` para delta

---

## FASE 3b: Componente UI — Charts

**Estado:** ✅ Completo
**Ficheiro:** `resources/js/components/ui/charts.tsx` (NOVO)

### Tarefas
- [x] Migrar `Spark` do legacy (sparkline SVG)
- [x] Migrar `Donut` do legacy (gráfico circular)
- [x] Migrar `HBar` do legacy (barras horizontais)
- [x] Migrar `VBars` do legacy (barras verticais)

---

## FASE 3c: Componente UI — Avatar

**Estado:** ✅ Completo
**Ficheiro:** `resources/js/components/ui/avatar.tsx` (modificado)

### Tarefas
- [x] Criar componente `BfaAvatar` com iniciais + cor
- [x] Função `avatarColor()` com paleta de 8 cores
- [x] Função `initials()` para extrair iniciais do nome
- [x] Manter componentes Radix existentes (Avatar, AvatarImage, AvatarFallback)

---

## FASE 3d: Componente UI — Pill/Badge

**Estado:** ✅ Completo
**Ficheiro:** `resources/js/components/ui/badge.tsx` (modificado)

### Tarefas
- [x] Adicionar variantes: success, warn, danger, info, neutral, primary
- [x] Usar variáveis CSS do design system (--success-bg, --warn-bg, etc.)

---

## FASE 4: CSS Design System

**Estado:** ✅ Completo
**Ficheiro:** `resources/css/app.css`

### Tarefas
- [x] Comparar `globals.css` (legacy) com `app.css` (bft_talent)
- [x] Adicionar classe `chip-filter` em falta
- [x] Verificar media queries de responsividade (768px, 480px)
- [x] Confirmar que todas as classes CSS principais estão presentes

### Resultado
- bft_talent já tinha ~95% do CSS do legacy
- Adicionada classe `chip-filter` para filtros em pills
- Sidebar, topbar, buttons, cards, KPI, pills, tables, tabs, modal, grid — todos presentes

---

## FASE 5: Mobile Responsiveness

**Estado:** ✅ Completo (verificado na FASE 4)

### Tarefas
- [x] Sidebar como drawer em mobile (data-mobile-open)
- [x] Overlay escuro (.sb-overlay)
- [x] Search hidden em mobile (.tb-search display:none)
- [x] Grids adaptam (.cols-4 → 2 colunas em 768px, 1 coluna em 480px)
- [x] Page padding reduzido em mobile
- [x] Sidebar sempre full-width em mobile (override icon mode)

---

## FASE 6: Páginas — Atualizar Visual

**Estado:** ⏳ Pendente (próxima fase)
**Esforço estimado:** 4-6h

### Prioridade
| Prioridade | Páginas |
|------------|---------|
| ALTA | dashboard, talentos, candidaturas |
| ALTA | pagamentos, workflows |
| MÉDIA | bolseiro, mentor, voluntario |
| MÉDIA | tarefas, faltas, documentos |
| BAIXA | geografia, roi, compliance, sucessao |
| BAIXA | chat, notificacoes, actividades, horas |

### Nota
As páginas do bft_talent já existem e estão ligadas ao backend.
A Fase 6 consiste em atualizar o design visual para usar os novos componentes (KPI, Charts, Badge variants, BfaAvatar).

---

## FASE 7: Limpeza

**Estado:** ⏳ Pendente (após Fase 6)
**Esforço estimado:** 0.5h

### Tarefas
- [ ] Remover `nav-main.tsx`
- [ ] Remover `nav-user.tsx`
- [ ] Remover `nav-footer.tsx`
- [ ] Remover `breadcrumbs.tsx`
- [ ] Remover `team-switcher.tsx`
- [ ] Remover `app-header.tsx`
- [ ] Remover `app-shell.tsx`
- [ ] Remover `app-content.tsx`
- [ ] Remover `app-logo.tsx`

---

## Ficheiros Criados/Modificados

| Ficheiro | Acção | Fase |
|----------|-------|------|
| `resources/js/components/app-sidebar.tsx` | Modificado | 1 |
| `resources/js/components/app-sidebar-header.tsx` | Reescrito | 2 |
| `resources/js/components/ui/kpi.tsx` | **Criado** | 3a |
| `resources/js/components/ui/charts.tsx` | **Criado** | 3b |
| `resources/js/components/ui/avatar.tsx` | Modificado | 3c |
| `resources/js/components/ui/badge.tsx` | Modificado | 3d |
| `resources/css/app.css` | Modificado | 4 |
| `app/Http/Controllers/Api/V1/PesquisaController.php` | **Criado** | 2a |
| `routes/api.php` | Modificado | 2a |
| `PLANO_MIGRACAO.md` | **Criado** | Tracking |

---

## Histórico

| Data | Fase | Estado | Notas |
|------|------|--------|-------|
| 28 Mai 2026 | FASE 1 | ✅ | Sidebar subtitle + Clock import |
| 28 Mai 2026 | FASE 2a | ✅ | Pesquisa global + PesquisaController |
| 28 Mai 2026 | FASE 2b | ✅ | Notificações híbridas |
| 28 Mai 2026 | FASE 2c | ✅ | Breadcrumbs 34 paths |
| 28 Mai 2026 | FASE 3a | ✅ | KPI tile component |
| 28 Mai 2026 | FASE 3b | ✅ | Charts (Spark, Donut, HBar, VBars) |
| 28 Mai 2026 | FASE 3c | ✅ | BfaAvatar (iniciais + cor) |
| 28 Mai 2026 | FASE 3d | ✅ | Badge variants (6 tons) |
| 28 Mai 2026 | FASE 4 | ✅ | CSS gap analysis + chip-filter |
| 28 Mai 2026 | FASE 5 | ✅ | Mobile responsiveness verificada |
