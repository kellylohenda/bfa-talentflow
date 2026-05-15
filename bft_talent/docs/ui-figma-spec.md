# UI Spec — BFA TalentFlow

> Referência: o protótipo Next.js 14 em `apps/web/` é a especificação visual oficial. Este documento descreve apenas o **sistema de design** e padrões transversais.

---

## Sistema de Design

- Definido em `apps/web/app/globals.css` (~989 linhas, sem Tailwind, sem UI libraries)
- Tokens próprios: cores por programa, tipografia, espaçamento, border-radius, shadows
- Modo claro / escuro via `data-theme` no `<html>`
- Densidade: `compact` / `balanced` / `comfortable` (gerida no Topbar)

### Cores por Programa

| Programa | Hex |
|---|---|
| Futuro BFA (FBFA) | `#FF7607` |
| Bolsa Internacional (BIF) | `#1D4ED8` |
| Bolsa Nacional (BNAC) | `#0E7C4A` |
| Liderança+ (LID) | `#7C3AED` |
| Mestrado (MEST) | `#B45309` |
| Voluntariado (Fundação) | `#0891B2` |

### Cores Sistema

- Primária BFA: `#FF7607`
- Sucesso: `#0E7C4A`
- Aviso: `#B45309`
- Perigo: `#DC2626`
- Info: `#1D4ED8`
- Neutro: tons de cinza (light/dark theme)

---

## Componentes Base (`components/ui/`)

| Componente | Função |
|---|---|
| `Icon` | Biblioteca SVG inline |
| `Avatar` | Iniciais + cor determinística do nome |
| `KPI` | Tile com label, valor, delta, sparkline |
| `Charts` | Sparkline + Donut (sem libs) |
| `Bar` | Progress bar |
| `Pill` | Badge de estado (tone: success/warn/danger/info/neutral/primary) |
| `Modal` | Diálogo com backdrop + close on ESC |

---

## Layout (`components/layout/`)

| Componente | Função |
|---|---|
| `AppShell` | Wrapper sidebar + topbar + main |
| `Sidebar` | Navegação por role — items diferentes por perfil |
| `Topbar` | Search global + tema + notificações + avatar do user |

---

## Padrões Transversais

- **Língua:** PT-PT em **todos** os textos da UI (incluindo placeholder, ARIA labels, e-mail templates)
- **Datas:** sempre `d/m/Y` ou relativas ("há 2 horas")
- **Moeda:** `Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' })`
- **Empty states:** sempre com ilustração leve + CTA
- **Loading:** skeleton shimmer em listas / KPIs
- **Errors:** toast + inline + reportagem ao Sentry
- **Acessibilidade:** WCAG AA mínimo, contraste >4.5, navegação por teclado

---

## Mapa Sidebar por Role

Definido em `apps/web/components/layout/Sidebar.tsx`. Sumário:

- **rh / direcao** — Overview, Candidaturas, Talentos, Estagiários, Tarefas, Faltas, Agenda, Pagamentos, Workflows, Documentos, Chat, Notificações, Avaliações, Mentoria, Voluntariado (Voluntários, Actividades, Horas, Relatórios), Geografia, ROI, Compliance, Retenção, Sucessão
- **mentor** — Painel, Mentees, Tarefas, Avaliações, Agenda, Chat, Notificações
- **bolseiro / estagiario** — Portal, Tarefas, Faltas, Agenda, Documentos, Chat, Notificações
- **voluntario** — Portal, Actividades, Horas, Agenda, Notificações
