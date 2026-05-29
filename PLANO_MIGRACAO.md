# Plano de Migração: Layout Legacy → bft_talent

> **Data início:** 28 Mai 2026
> **Data conclusão:** 29 Mai 2026
> **Estado:** ✅ Completo
> **Responsável:** opencode

---

## Objectivo

Migrar o layout visual do protótipo Next.js legacy (`_legacy/`) para o frontend Laravel/Inertia (`bft_talent/`), corrigir bugs críticos, adicionar funcionalidades novas e melhorar todas as páginas de detalhe.

## Decisões Técnicas

| Decisão | Escolha |
|---------|---------|
| Role Switcher | **Removido** — cada utilizador tem role fixo via `bfa_role` |
| Pesquisa Global | **Híbrida** — client-side (instantânea) + API (cross-module) |
| Notificações | **Híbridas** — DB (tabela notifications) + client-side (regras live) |
| UI Components | **Migrados do legacy** — KPI, Charts, Avatar, Pill |
| Páginas | **Mantidas do bft_talent** — visual actualizado |
| Activity Log | **spatie/laravel-activitylog** — ligado a 5 models |
| CSV Export | **RelatoriosController::export()** — 5 tipos de relatório |

---

## Fases Completadas

### FASE 1: Sidebar — User Footer ✅
- `ROLE_LABELS` map com subtítulos PT-PT por role
- Footer mostra nome + subtítulo do role + email
- Clock importado de lucide-react

### FASE 2: Topbar — Pesquisa + Notificações + Breadcrumbs ✅
- Pesquisa global com debounce 300ms + API endpoint
- Notificações por role (DB + client-side)
- Breadcrumbs com 36 paths traduzidos para PT-PT
- `PesquisaController.php` criado

### FASE 3: UI Components ✅
- `ui/kpi.tsx` — KPI tile com label, value, delta, icon
- `ui/charts.tsx` — Spark, Donut, HBar, VBars
- `ui/avatar.tsx` — BfaAvatar com iniciais + cor
- `ui/badge.tsx` — 6 variantes (success, warn, danger, info, neutral, primary)

### FASE 4: CSS Design System ✅
- Gap analysis: bft_talent já tinha ~95% do CSS do legacy
- Classe `chip-filter` adicionada
- Media queries completas (768px, 480px)

### FASE 5: Mobile Responsiveness ✅
- Sidebar drawer em mobile
- Overlay escuro
- Search hidden em mobile
- Grids adaptam

### FASE 6: Todas as Páginas Actualizadas ✅
- 64 páginas modificadas
- Todas usam BFA CSS classes
- Páginas de detalhe (show) reescritas com KPIs + acções

### FASE 7: Segurança ✅
- 7 controllers com auth adicionada
- Notificações scoped ao user actual
- Documentos com owner check

### FASE 8: Bugs Críticos ✅
- debugAuth removido
- program_id/university_id salvos no update
- Column mismatch Absence corrigido
- Buttons mortos activados
- Activity Log ligado (5 models)

### FASE 9: Funcionalidades Novas ✅
- Candidatura pública completada (passos 3-5)
- Activity Log com spatie/activitylog
- CSV Export (5 tipos de relatório)
- Tradução settings para PT
- Drill-down links em todas as show pages

---

## Estado Actual das Show Pages

| Página | KPIs | Detalhes | Acções | Estado |
|--------|------|----------|--------|--------|
| talentos/show | ✅ | ✅ | Editar, Upload doc | ✅ |
| candidaturas/show | ✅ | ✅ | Gerir, Download CV, Notas | ✅ |
| pagamentos/show | ✅ | ✅ | Marcar Pago, Cancelar | ✅ |
| workflows/show | ✅ | ✅ | Aprovar, Rejeitar | ✅ |
| tarefas/show | ✅ | ✅ | Editar, Iniciar, Concluir, Eliminar | ✅ |
| faltas/show | ✅ | ✅ | Aprovar, Rejeitar | ✅ |
| documentos/show | ✅ | ✅ | Descarregar, Aprovar, Rejeitar | ✅ |
| voluntarios/show | ✅ | ✅ | Editar, Inactivar | ✅ |
| eventos/show | ✅ | ✅ | Editar, Inscrever-me | ✅ |
| mensagens/show | ✅ | ✅ | Responder, Eliminar, Marcar Lida | ✅ |

---

## Dados na DB

| Entidade | Quantidade |
|----------|-----------|
| Talentos | 18 (0 com email) |
| Utilizadores | 12 |
| Programas | 5 |
| Universidades | 10 |
| Departamentos | 11 |
| Candidaturas | 14 |
| Pagamentos | 12 |
| Voluntários | 15 |
| Eventos | 10 |
| Workflows | 6 |
| Documentos | 0 |
| Activity Log | 0 |

---

## Ficheiros Criados/Modificados

### Novos
- `app/Http/Controllers/Api/V1/PesquisaController.php`
- `resources/js/components/ui/kpi.tsx`
- `resources/js/components/ui/charts.tsx`
- `config/activitylog.php` (publicado)

### Layout
- `resources/js/components/app-sidebar.tsx`
- `resources/js/components/app-sidebar-header.tsx`
- `resources/js/layouts/settings/layout.tsx`
- `resources/css/app.css`

### Páginas (64 total)
Todas as páginas em `resources/js/pages/` foram modificadas.

### Backend
- 7 controllers com auth corrigida
- 5 models com LogsActivity
- Rota de pesquisa + export CSV

---

## Comandos Úteis

```bash
# Dev server
npm run dev

# Build
npm run build

# TypeScript check
npm run types:check

# Laravel server
php artisan serve --port=8080

# Login
# mariana.quissama@bfa.ao / password
```

---

## Próximos Passos (se necessário)

1. Melhorar candidatura pública (upload de documentos)
2. Signed URLs para download de documentos
3. mais dados na DB (preencher emails dos talentos)
4. Testes automatizados (Pest)
5. Deploy em produção
