# BFA TalentFlow — Relatório Geral do Projecto

> **Data do relatório:** 9 de Maio de 2026  
> **Repositório:** `bfa-talentflow` · branch `main`  
> **Stack:** Next.js 14 · React 18 · TypeScript · CSS custom  
> **Estado:** Protótipo funcional completo · 22 commits · Produção

---

## Índice

1. [Origem e Contexto](#1-origem-e-contexto)
2. [Arquitectura Geral](#2-arquitectura-geral)
3. [Estrutura de Ficheiros](#3-estrutura-de-ficheiros)
4. [Sistema de Roles e Autenticação](#4-sistema-de-roles-e-autenticação)
5. [Páginas Públicas](#5-páginas-públicas)
6. [Login e Navegação](#6-login-e-navegação)
7. [Módulos do Dashboard](#7-módulos-do-dashboard)
8. [Componentes UI](#8-componentes-ui)
9. [Sistema de Design e Estilos](#9-sistema-de-design-e-estilos)
10. [Camada de Dados](#10-camada-de-dados)
11. [Tipos TypeScript](#11-tipos-typescript)
12. [APIs e Integrações](#12-apis-e-integrações)
13. [Funcionalidades Transversais](#13-funcionalidades-transversais)
14. [Métricas do Projecto](#14-métricas-do-projecto)
15. [Histórico de Commits](#15-histórico-de-commits)
16. [Estado Actual e Próximos Passos](#16-estado-actual-e-próximos-passos)

---

## 1. Origem e Contexto

O **BFA TalentFlow** nasceu como protótipo gerado no **Claude Designer** — uma versão estática de interface para gestão de talento do Banco de Fomento Angola (BFA). O projecto foi então migrado para uma aplicação **Next.js 14 completamente funcional**, com:

- Navegação real entre páginas
- Sistema de roles com cookies
- Dados mock realistas
- Tema claro/escuro
- Responsividade mobile
- Modais e formulários interactivos
- Lógica de aprovação/rejeição de documentos, faltas, tarefas

O sistema serve o programa de **Gestão de Talentos do BFA**, cobrindo bolseiros internacionais e nacionais, estagiários (Futuro BFA), voluntários da Fundação BFA, mentores internos e equipas de RH/Direcção.

---

## 2. Arquitectura Geral

```
bfa-next/
├── Next.js 14 App Router
├── TypeScript (strict)
├── CSS custom (sem Tailwind, sem UI libraries)
├── Resend (emails transacionais)
└── Cookies (autenticação de role)
```

### Decisões arquitecturais

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Framework | Next.js 14 App Router | SSR + Client Components + API Routes |
| Estilos | CSS custom (`globals.css`) | Controlo total sobre design tokens |
| Estado | React hooks + cookies | Sem Redux, sem Zustand — simplicidade |
| UI library | Nenhuma | Componentes próprios reutilizáveis |
| Auth | Cookies (24h) | Protótipo — sem JWT/OAuth |
| Dados | Mock estáticos (`lib/data.ts`) | Sem base de dados — demo instantâneo |
| Email | Resend SDK | Envio de emails de candidatura/portal |
| Deploy | Vercel (implícito) | Next.js nativo |

### Fluxo de role

```
/login → define cookie "role" → redirect para página default do role
         ↓
    RH/Direcção → /overview
    Mentor       → /mentor
    Bolseiro     → /bolseiro
    Estagiário   → /bolseiro
    Voluntário   → /voluntario
```

---

## 3. Estrutura de Ficheiros

```
bfa-next/
│
├── app/
│   ├── layout.tsx                          # Root layout (HTML, CSS, font)
│   ├── page.tsx                            # Redirect root → role page
│   ├── globals.css                         # Sistema de design completo (989 linhas)
│   │
│   ├── login/
│   │   └── page.tsx                        # Login com 6 perfis de role
│   │
│   ├── programa/
│   │   └── page.tsx                        # Landing pública do programa BFA
│   │
│   ├── candidatura/
│   │   └── page.tsx                        # Formulário público de candidatura
│   │
│   ├── portal/
│   │   ├── page.tsx                        # Selecção de tipo de portal
│   │   └── [ref]/page.tsx                  # Estado de candidatura por referência
│   │
│   ├── api/
│   │   ├── candidaturas/
│   │   │   ├── route.ts                    # POST nova candidatura + email
│   │   │   └── [ref]/status/route.ts       # GET estado candidatura
│   │   └── portal/
│   │       ├── route.ts                    # POST portal login
│   │       └── logout/route.ts             # POST logout
│   │
│   └── (dashboard)/
│       ├── layout.tsx                      # AppShell com Sidebar + Topbar
│       │
│       ├── overview/page.tsx               # Dashboard executivo (RH/Direcção)
│       ├── candidaturas/page.tsx           # Pipeline de candidaturas
│       ├── talentos/page.tsx               # Roster de talentos
│       ├── talentos/[id]/page.tsx          # Perfil individual de talento
│       ├── talentos/[id]/TalentProfile.tsx # Componente de perfil detalhado
│       ├── estagiarios/page.tsx            # Gestão de estagiários + rotações
│       ├── bolseiro/page.tsx               # Portal pessoal (bolseiro + estagiário)
│       ├── tarefas/page.tsx                # Gestão de tarefas por role
│       ├── faltas/page.tsx                 # Gestão de faltas/ausências
│       ├── agenda/page.tsx                 # Calendário + catálogo de workshops
│       ├── pagamentos/page.tsx             # Histórico de pagamentos
│       ├── workflows/page.tsx              # Aprovações e workflows
│       ├── documentos/page.tsx             # Gestão de documentos
│       ├── chat/page.tsx                   # Mensagens directas
│       ├── notificacoes/page.tsx           # Centro de notificações
│       ├── avaliacoes/page.tsx             # Avaliações 360°
│       ├── mentoria/page.tsx               # Gestão de mentoria (RH)
│       ├── mentor/page.tsx                 # Portal do mentor
│       ├── voluntario/page.tsx             # Portal pessoal do voluntário
│       ├── voluntarios/page.tsx            # Roster de voluntários (RH)
│       ├── actividades/page.tsx            # Actividades de voluntariado
│       ├── horas/page.tsx                  # Horas de voluntariado
│       ├── relatorios-voluntariado/page.tsx # Relatórios de voluntariado
│       ├── geografia/page.tsx              # Mapa geográfico de talentos
│       ├── roi/page.tsx                    # ROI e análise de custos
│       ├── compliance/page.tsx             # Governance e compliance
│       ├── retencao/page.tsx               # Métricas de retenção
│       └── sucessao/page.tsx               # 9-Box succession planning
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx                    # Wrapper principal (sidebar + topbar)
│   │   ├── Sidebar.tsx                     # Navegação lateral por role
│   │   └── Topbar.tsx                      # Barra superior (search, notifs, tema)
│   └── ui/
│       ├── Icon.tsx                        # Biblioteca de ícones SVG
│       ├── Avatar.tsx                      # Avatar com iniciais coloridas
│       ├── KPI.tsx                         # Tile de KPI
│       ├── Charts.tsx                      # Gráficos (sparkline, donut)
│       ├── Bar.tsx                         # Barra de progresso
│       ├── Pill.tsx                        # Badge de estado
│       └── Modal.tsx                       # Diálogo modal
│
├── lib/
│   ├── data.ts                             # Todos os dados mock (531 linhas fonte)
│   ├── useRole.ts                          # Hook de role via cookie
│   ├── utils.ts                            # Helpers (initials, avatarColor)
│   ├── store.ts                            # Store de estado local
│   └── emails.ts                           # Templates de email
│
└── types/
    └── index.ts                            # Todos os tipos TypeScript (476 linhas)
```

---

## 4. Sistema de Roles e Autenticação

### Os 6 Roles

| Role | Identidade Demo | Acesso Padrão | Cor |
|------|----------------|---------------|-----|
| `rh` | Mariana Quissama · Gestora de Programa | `/overview` | Laranja (#FF7607) |
| `direcao` | Dr. Manuel Bemba · Direcção de RH | `/overview` | Azul |
| `mentor` | Edmilson Cardoso · Director Banca | `/mentor` | Roxo |
| `estagiario` | Lwini Capemba · Estagiária Y1 | `/bolseiro` | Laranja (#FF7607) |
| `bolseiro` | Joaquim Tchindemba · Bolseiro BIF | `/bolseiro` | Verde (#0E7C4A) |
| `voluntario` | Ana Paula Kiala · Voluntária Educação | `/voluntario` | Azul Petróleo (#0891B2) |

### Mecanismo

```typescript
// lib/useRole.ts
export function useRole(): Role {
  const [role, setRole] = useState<Role>('rh')
  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)role=([^;]+)/)
    const r = m?.[1]
    if (r && VALID_ROLES.includes(r)) setRole(r as Role)
  }, [])
  return role
}
```

- Cookie `role` definido no login com `max-age=86400` (24h)
- Leitura client-side via `useEffect` para evitar hidratação SSR
- Fallback para `rh` se cookie ausente ou inválido
- Role switcher na sidebar permite trocar de perfil sem logout

### Guards de Acesso por Módulo

```typescript
const isParticipant = role === 'bolseiro' || role === 'estagiario'
const isMentor = role === 'mentor'
const isRH = role === 'rh' || role === 'direcao'

// Filtros de dados:
const visibleData = isParticipant ? data.filter(d => d.talentId === myTalentId)
                  : isMentor      ? data.filter(d => MENTOR_MENTEE_IDS.has(d.talentId))
                  : data  // RH vê tudo
```

---

## 5. Páginas Públicas

### `/programa` — Landing Page do Programa

Página de marketing pública (sem autenticação). Apresenta:
- Três tipos de programa: Estágio (Futuro BFA), Bolsa Internacional/Nacional, Voluntariado
- KPIs do programa (65 talentos activos, 5 países, 8 parceiros)
- Processo de candidatura em 4 passos
- CTA para candidatura e acesso ao portal

### `/candidatura` — Formulário de Candidatura

Formulário público multi-campo:
- Tipo de candidatura: Estágio / Bolsa / Voluntariado
- Dados pessoais (nome, email, telefone, data de nascimento)
- Dados académicos (universidade, curso, ano, GPA)
- Motivação (campo livre)
- Upload de documentos (simulado)
- Envio via API Route → email de confirmação via Resend

### `/portal` — Acesso ao Portal do Candidato

Selector de tipo de portal (bolseiro/estagiário/voluntário) com input de referência de candidatura.

### `/portal/[ref]` — Estado da Candidatura

Página de tracking de candidatura por referência única. Mostra:
- Estado actual na pipeline (triagem → entrevista → aprovação → oferta)
- Próximo passo esperado
- Documentos requeridos
- Contacto do gestor RH

---

## 6. Login e Navegação

### Página de Login (`/login`)

Interface dividida em dois painéis:

**Painel esquerdo (60%):**
- Fundo escuro com gradiente
- Logótipo BFA TalentFlow
- Estatísticas do programa (65 talentos, 5 países, 12 mentores, 94% satisfação)
- Oculto em mobile

**Painel direito (40%):**
- Título "Aceder ao sistema"
- 6 cards de role agrupados:
  - **Equipa BFA:** Gestora de RH, Direcção, Mentor
  - **Participantes:** Estagiário (Lwini), Bolseiro (Joaquim), Voluntário (Ana Paula)
- Click num card → define cookie → redirect
- Design responsivo (ocupa 100% em mobile)

### Sidebar (`components/layout/Sidebar.tsx`)

**Estrutura fixa por role:**

```
RH (Mariana Quissama):
  Operação → Dashboard, Candidaturas(12), Talentos, Estagiários, Tarefas,
             Faltas, Agenda, Pagamentos(3), Aprovações(6), Documentos,
             Mensagens, Notificações
  Desenvolvimento → Avaliações, Mentoria, Sucessão, Retenção
  Análise → Geografia, ROI, Compliance
  Voluntariado → Voluntários, Actividades, Horas, Relatórios

Direcção (Dr. Manuel Bemba):
  Estratégico → Dashboard, ROI, Sucessão, Geografia
  Talento → Talentos, Agenda, Avaliações, Retenção
  Governance → Aprovações, Compliance
  Voluntariado → Voluntários, Relatórios

Mentor (Edmilson Cardoso):
  Mentoria → Portal, Agenda, Tarefas, Faltas, Avaliações, Mensagens, Notificações

Estagiário (Lwini Capemba):
  O Meu Estágio → Portal, Agenda, As Minhas Tarefas, Faltas, Documentos, Mensagens

Bolseiro (Joaquim Tchindemba):
  O Meu Programa → Portal, Agenda, As Minhas Tarefas, Faltas, Documentos, Mensagens

Voluntário (Ana Paula Kiala):
  Voluntariado → Portal, Agenda, Actividades, As Minhas Horas, Mensagens
```

**Funcionalidades da sidebar:**
- Role switcher com 6 pills (troca de perfil em tempo real)
- Badges numéricos em itens com itens pendentes
- Link activo destacado com borda laranja
- Colapso para ícones em desktop (toggle no topbar)
- Drawer deslizante em mobile
- Footer com avatar + nome + botão logout

### Topbar (`components/layout/Topbar.tsx`)

- **Breadcrumb** — "BFA TalentFlow / [Nome da Página Actual]"
- **Pesquisa global** — input com dropdown de resultados live
  - Pesquisa em: talentos, candidaturas, pagamentos, tarefas, páginas
  - Resultados agrupados por categoria com ícones
  - Enter → navega para primeiro resultado
  - Escape → fecha dropdown
- **Badge "Demo · 2026"**
- **Sino de notificações** — dropdown com alertas por role
- **Toggle de tema** — luz ↔ escuro (ícone sol/lua)

---

## 7. Módulos do Dashboard

### 7.1 Overview — Dashboard Executivo

**Rota:** `/overview` | **Audiência:** RH, Direcção

**KPIs (4 tiles):**
- Total de talentos activos
- Bolsas activas
- Taxa de conclusão média
- Talentos em risco

**Componentes visuais:**
- Distribuição por tipo de programa (Donut chart)
- Tabela de talentos em destaque com scores de risco
- Feed de actividade recente (candidaturas, pagamentos, documentos)
- Mapa de distribuição geográfica resumido

---

### 7.2 Candidaturas

**Rota:** `/candidaturas` | **Audiência:** RH

**Funcionalidades:**
- Pipeline Kanban por etapa: Triagem → Entrevista 1 → Entrevista 2 → Avaliação → Aprovação → Oferta
- KPIs: total, em triagem, aprovadas, rejeitadas
- Tabela com filtro por etapa, pesquisa por nome/universidade
- Modal de detalhe de candidato com todos os dados
- Botões de avanço/rejeição de etapa
- Score de candidato calculado (GPA + completude + programa)
- 14 candidaturas mock em vários estágios

---

### 7.3 Talentos

**Rota:** `/talentos` | **Audiência:** RH, Direcção, Mentor

**Funcionalidades:**
- Roster completo com 20 talentos
- Filtros: programa, status, departamento, potencial
- Pesquisa por nome
- KPIs: activos, em risco, taxa de conclusão, satisfação
- Tabela com: avatar, nome, programa, universidade, departamento, GPA, mentor, status, risco, performance
- Clique → perfil detalhado

**Perfil de Talento (`/talentos/[id]`):**
- Header com avatar, nome, programa, universidade, status
- 4 abas: Visão Geral, Rotações, Documentos, Sessões de Mentoria
- Métricas: GPA, performance, risco, tempo no programa
- Gráfico de evolução de performance (sparkline)
- Lista de rotações por departamento
- Histórico de sessões com mentor
- Acções: editar, solicitar avaliação, ver documentos

---

### 7.4 Estagiários

**Rota:** `/estagiarios` | **Audiência:** RH

**Funcionalidades:**
- Roster exclusivo de estagiários (Futuro BFA + Liderança+)
- KPIs: total estagiários, rotações activas, concluídas, próximas avaliações
- Tabela com filtro por departamento e status
- Gestão de rotações: início, duração, departamento, supervisor
- Modal de nova rotação
- Indicadores de desempenho por rotação

---

### 7.5 Portal do Bolseiro / Estagiário

**Rota:** `/bolseiro` | **Audiência:** Bolseiro, Estagiário

Dois perfis com dados distintos:

**Estagiário — Lwini Capemba (T-1042):**
- Programa: Futuro BFA · Banca de Empresas
- Mentor: Edmilson Cardoso
- Estipêndio: 380.000 Kz/mês
- Pagamentos: Subsídio de estágio + Material de trabalho

**Bolseiro — Joaquim Tchindemba (T-1043):**
- Programa: Bolsa Internacional · Nova SBE
- Mentor: Sofia Mendes
- Estipêndio: 1.850.000 Kz/mês
- Pagamentos: Propinas + Subsídio de subsistência

**5 Abas (ambos os perfis):**

**Início:**
- Boas-vindas com nome + programa
- KPI tiles: GPA, performance, próximo prazo, nível
- Card de mentor (foto, nome, contacto, próxima sessão)
- Lista de tarefas pendentes
- Próximos eventos da agenda
- KPI "Último Subsídio/Pagamento"

**As Minhas Tarefas:**
- Lista de tarefas pessoais (filtradas por talentId)
- Status: pendente, em progresso, concluída, em atraso
- Prioridade: alta, média, baixa

**Presenças:**
- Heatmap de 4 semanas de actividade (dias × semanas)
- Métricas: total horas, taxa de presença, sessões concluídas
- Lista de sessões de mentoria com notas

**Rotinas (estagiário) / Sessões (bolseiro):**
- Rotações por departamento
- Calendário de actividades semanais
- Próximas sessões agendadas

**Pagamentos:**
- 4 KPIs: total recebido, última transferência, pendentes, próximo pagamento
- Tabela completa com: data, descrição, tipo, montante, método, status
- 8 registos históricos por persona
- Filtro por status (pago/pendente/em processamento)

**O Meu Perfil:**
- Dados pessoais e académicos
- Progresso no programa
- Documentos submetidos

---

### 7.6 Tarefas

**Rota:** `/tarefas` | **Audiência:** RH, Mentor, Bolseiro, Estagiário

**Filtros por role:**
- **RH:** vê todas as tarefas de todos os talentos
- **Mentor:** vê tarefas dos seus 3 mentorandos (T-1042, T-1048, T-1058)
- **Bolseiro/Estagiário:** vê apenas as suas próprias tarefas

**Funcionalidades:**
- KPIs: total, pendentes, em progresso, concluídas, em atraso
- Filtro por status, prioridade, talento
- Pesquisa por título
- Modal de criação de tarefa (título, descrição, prazo, prioridade, talento)
- Acções: marcar concluída, editar, eliminar
- Banner informativo para participantes ("A ver apenas as suas tarefas")

---

### 7.7 Faltas

**Rota:** `/faltas` | **Audiência:** RH, Mentor, Bolseiro, Estagiário

**Filtros por role:** (mesma lógica que tarefas)

**Funcionalidades:**
- KPIs: total pedidos, aprovados, pendentes, rejeitados
- Tabela com: talento, tipo de ausência, datas, motivo, status, aprovado por
- Botões Aprovar/Rejeitar para pendentes (RH e Mentor)
- Modal de nova falta (tipo, data início/fim, motivo)
- Tipos de ausência: férias, doença, académica, familiar, outra
- Aprovador diferenciado: mentor ou RH dependendo do role

---

### 7.8 Agenda & Workshops

**Rota:** `/agenda` | **Audiência:** Todos os roles

**Filtros por role:**
- Bolseiro/Estagiário: eventos da sua audiência
- Mentor: todos (para gestão)
- RH/Direcção: todos + contagem de inscritos

**2 abas:**

**Calendário:**
- Grelha mensal (7 colunas, lun-dom)
- Células com eventos coloridos por tipo
- Click no dia → painel lateral com detalhe dos eventos
- Painel "Próximos eventos" quando nenhum dia seleccionado
- Legenda de cores por tipo
- Dia actual destacado com borda laranja

**Workshops & Eventos:**
- Filtros por tipo (chips): Workshop, Formação, Evento, Mentoria, Convocatória, Avaliação
- Cards de evento com: tipo, título, data, horário, facilitador, local, vagas
- Expansão "Mais info" com descrição completa
- Inscrição com toggle "Inscrito" / "+ Inscrever"
- **Convocatórias:** botões **Aceitar / Recusar** (sem inscrição normal)
- Eventos obrigatórios marcados com badge vermelho "Obrigatório"
- "✓ Presença confirmada" automática para obrigatórios

**KPIs:** Inscrições activas, Obrigatórios, Este mês, Total disponíveis

**10 eventos mock:**
- EV-001 a EV-010 — Maio/Junho 2026
- Tipos: workshop (2), formacao (2), mentoria (2), evento (1), convocatoria (2), avaliacao (1)

---

### 7.9 Pagamentos

**Rota:** `/pagamentos` | **Audiência:** RH, Bolseiro, Estagiário

**Vista RH:**
- Todas as transacções (12 registos)
- KPIs: total processado, pendentes, falhados, próxima data
- Aprovação/rejeição de pagamentos pendentes
- Filtro por status e tipo

**Vista Participante:**
- Apenas pagamentos do próprio talento
- Ver detalhes de cada transferência

---

### 7.10 Workflows / Aprovações

**Rota:** `/workflows` | **Audiência:** RH, Direcção

**Funcionalidades:**
- Lista de pedidos de aprovação pendentes
- Tipos: renovação de bolsa, contratação, extensão de estágio, rescisão
- Urgência: alta, média, baixa
- Aprovação em cadeia com comentários
- Histórico de decisões
- Integração com dados de talentos

---

### 7.11 Documentos

**Rota:** `/documentos` | **Audiência:** Todos os roles

**Filtros por role:**
- **RH:** todos os documentos (12 registos)
- **Mentor:** documentos dos seus mentorandos (T-1042, T-1048, T-1058)
- **Bolseiro/Estagiário:** apenas os seus próprios documentos

**Tipos de documento:** Boletim, Relatório, Contrato, Identificação, Comprovativo

**Status:** Submetido, Pendente, Rejeitado, Aprovado

**Funcionalidades:**
- KPIs: pendentes, a rever, aprovados, rejeitados
- Tabela com filtro por status e pesquisa
- Aprovar/Rejeitar documentos submetidos (RH + Mentor)
- Download de documentos aprovados
- **Modal "Solicitar Documento"** (RH): cria pedido pendente para um talento
- **Modal "Submeter Documento"** (Participante): upload com tipo, período e ficheiro
- 12 documentos mock (D-001 a D-012)

---

### 7.12 Chat / Mensagens

**Rota:** `/chat` | **Audiência:** Todos os roles

**Conversas por role:**

| Role | Conversas disponíveis |
|------|----------------------|
| RH | Lwini Capemba, Joaquim Tchindemba, Edmilson Cardoso, Kiala Domingos |
| Mentor | Lwini Capemba, Kiala Domingos, Mariana (RH) |
| Bolseiro | Sofia Mendes (mentor), Mariana Quissama (RH) |
| Estagiário | Edmilson Cardoso (mentor), Mariana Quissama (RH) |
| Voluntário | Mariana Quissama (RH) |

**Funcionalidades:**
- Lista de conversas com avatar, última mensagem e timestamp
- Badge de não lidas (vermelho)
- Thread de mensagens com bolhas diferenciadas (próprias vs recebidas)
- Input de nova mensagem + botão Enviar
- Enter para enviar, Shift+Enter para nova linha
- Auto-scroll para última mensagem ao trocar conversa
- Mensagens pré-populadas com contexto realista (dúvidas sobre prazos, pagamentos, avaliações)
- Timestamp por mensagem

---

### 7.13 Notificações

**Rota:** `/notificacoes` | **Audiência:** RH, Mentor

**Funcionalidades:**

**Vista de Histórico:**
- KPIs: enviadas, leituras, taxa de leitura (%), destinatários únicos
- Lista de notificações enviadas com:
  - Tipo (badge colorido): Informação, Alerta, Prazo, Convocatória, Aprovação
  - Título e mensagem completa
  - Destinatário (grupo ou individual)
  - Data/hora de envio e remetente
  - Barra de progresso de leitura (reads/total com %)

**Modal "Nova Notificação":**
- Título (obrigatório)
- Tipo: Informação / Alerta / Prazo / Convocatória / Aprovação
- Destinatário:
  - RH: Todos, Bolseiros, Estagiários, Mentores, Individual
  - Mentor: apenas os seus mentorandos
- Selector de participante (quando "Individual")
- Mensagem (textarea, obrigatória)
- Preview do âmbito no footer

**5 notificações seed** com taxas de leitura variadas

---

### 7.14 Avaliações 360°

**Rota:** `/avaliacoes` | **Audiência:** RH, Mentor

**Filtros por role:**
- **RH:** todos os 20 talentos
- **Mentor:** apenas os seus 3 mentorandos (com banner informativo)

**Ciclo demo:** Q2 2026 · Prazo: 2026-05-31

**Funcionalidades:**
- KPIs: total, submetidas (%), pendentes, ciclo actual
- Tabela de estado por talento (programa, ciclo, prazo, estado)
- Modal de avaliação:
  - 5 competências: Atitude, Desempenho Técnico, Iniciativa, Comunicação, Trabalho em Equipa
  - Escala 1-5 com botões coloridos (vermelho → verde)
  - Label semântico: Insuficiente / Abaixo do esperado / Satisfatório / Bom / Excelente
  - Campo de notas e observações
  - Recomendação: Continuar / Promover / Acompanhar / Rever / Contratar
- Validação: todas as competências obrigatórias antes de submeter

---

### 7.15 Mentoria

**Rota:** `/mentoria` | **Audiência:** RH

**Funcionalidades:**
- Gestão do programa de mentoria global
- Lista de pares mentor-talento
- Métricas de sessões por mentor
- Criação de novos pares
- Avaliação de qualidade de mentoria
- 6 mentores com ratings (4.4–4.9)

---

### 7.16 Portal do Mentor

**Rota:** `/mentor` | **Audiência:** Mentor

**4 abas:**

**Os Meus Mentorandos:**
- Cards de cada mentorando com foto, programa, GPA, status
- Score de risco por mentorando
- Acesso rápido a tarefas, avaliações e documentos de cada um

**Sessões:**
- Histórico e agendamento de sessões de mentoria
- Notas de cada sessão
- Próximas sessões agendadas

**Tarefas:**
- Tarefas criadas para os mentorandos
- Status e prazos

**Avaliações:**
- Estado das avaliações 360° do ciclo actual
- Acesso directo ao modal de avaliação

---

### 7.17 Portal do Voluntário

**Rota:** `/voluntario` | **Audiência:** Voluntário

**Persona demo:** Ana Paula Kiala (V-001) · Voluntária · Área: Educação

**Sistema de níveis:**
| Nível | Horas mínimas | Badge |
|-------|--------------|-------|
| Bronze | 0–49h | 🥉 |
| Prata | 50–99h | 🥈 |
| Ouro | 100–199h | 🥇 |
| Platina | 200h+ | 💎 |

**4 abas:**

**Início:**
- Banner de boas-vindas com nível e progresso para próximo nível
- Barra de progresso para nível seguinte
- KPIs: horas totais, actividades concluídas, próxima actividade, nível
- Próximas actividades (2–3 cards)
- Resumo de horas por mês

**As Minhas Horas:**
- Histórico completo de entradas de horas
- Por actividade, data, duração, status de validação
- Total acumulado

**Actividades:**
- Catálogo de actividades disponíveis
- Cards com: nome, área, local, data, duração, vagas
- Botão Inscrever-se / Inscrita
- Badge de actividades passadas

**O Meu Perfil:**
- Dados pessoais do voluntário
- Área de actuação
- Total de horas validadas
- Histórico de reconhecimentos

---

### 7.18 Voluntários (Gestão RH)

**Rota:** `/voluntarios` | **Audiência:** RH, Direcção

**Funcionalidades:**
- Roster de todos os voluntários
- KPIs: total, activos, horas totais, taxa de retenção
- Filtro por área, status, nível
- Tabela com dados completos

---

### 7.19 Actividades de Voluntariado

**Rota:** `/actividades` | **Audiência:** RH, Voluntário

**Funcionalidades:**
- Calendário de actividades agendadas
- Gestão de vagas e inscrições
- Tipos: tutoria, ambiente, saúde, educação, idosos
- Criação de nova actividade (RH)

---

### 7.20 Horas de Voluntariado

**Rota:** `/horas` | **Audiência:** RH, Voluntário

**Funcionalidades:**
- Validação de horas submetidas por voluntários
- KPIs: horas a validar, validadas, rejeitadas, total
- Aprovação/rejeição com comentário
- Resumo por voluntário e por actividade

---

### 7.21 Relatórios de Voluntariado

**Rota:** `/relatorios-voluntariado` | **Audiência:** RH, Direcção

**Funcionalidades:**
- Relatório de impacto do programa
- Horas por área de actuação
- Evolução temporal
- Exportação de dados

---

### 7.22 Geografia

**Rota:** `/geografia` | **Audiência:** RH, Direcção

**Funcionalidades:**
- Distribuição geográfica dos talentos por país/cidade
- 7 localizações: Luanda, Lisboa, Porto, Paris, Londres, São Paulo, Berlim
- Mapa com pontos e contagem por localização
- Custo médio por localização
- Distribuição de tipos de programa por país

---

### 7.23 ROI & Custos

**Rota:** `/roi` | **Audiência:** RH, Direcção

**Funcionalidades:**
- Análise de retorno sobre investimento do programa
- Custo total por tipo de programa
- Taxa de retenção pós-programa
- Comparação custo vs. valor gerado
- Breakdown por ano e programa
- Métricas: custo por talento, taxa de contratação, ROI estimado

---

### 7.24 Compliance

**Rota:** `/compliance` | **Audiência:** RH, Direcção

**Funcionalidades:**
- Dashboard de conformidade regulatória
- Verificação de documentação (BI, NIF, contratos)
- Alertas de expiração de documentos
- Taxa de compliance por programa
- Registo de auditorias

---

### 7.25 Retenção

**Rota:** `/retencao` | **Audiência:** RH, Direcção

**Funcionalidades:**
- Métricas de retenção pós-programa
- Talentos contratados vs. saída
- Score de risco de saída por talento
- Factores de risco identificados
- Gráfico de evolução de retenção

---

### 7.26 Sucessão — 9-Box

**Rota:** `/sucessao` | **Audiência:** RH, Direcção

**Funcionalidades:**
- Matriz 9-Box (Performance × Potencial)
- 18 talentos posicionados na grelha
- 3 eixos de performance: Baixo / Médio / Alto
- 3 eixos de potencial: Baixo / Médio / Alto
- Células coloridas por categoria
- Clique no talento → detalhe
- Filtro por programa

---

## 8. Componentes UI

### `Icon.tsx` — Biblioteca SVG

Sistema de ícones inline com 25+ ícones SVG parametrizáveis:

```typescript
<Icon name="bell" size={18} stroke={1.6} />
```

**Ícones disponíveis:**
`dashboard`, `users`, `briefcase`, `funnel`, `grid`, `globe`, `cash`, `chart`, `star`, `cog`, `shield`, `bell`, `search`, `download`, `plus`, `check`, `x`, `alert`, `doc`, `calendar`, `pin`, `graduation`, `clock`, `award`, `arrowRight`, `trending`, `mail`, `flag`, `building`, `layers`, `more`, `menu`, `user`, `sun`, `moon`, `upload`, `logout`, `chat`

---

### `Avatar.tsx` — Avatar com Iniciais

```typescript
<Avatar name="Lwini Capemba" size={36} />
```

- Iniciais automáticas (função `initials()`)
- Cor de fundo determinística por nome (`avatarColor()`)
- Suporte a tamanhos arbitrários

---

### `KPI.tsx` — Tile de Indicador

```typescript
<KPI label="Talentos" value={20} sub="Total activos" delta="+3" deltaTone="up" icon="users" />
```

**Props:**
- `label`: título
- `value`: valor principal (string | number)
- `sub`: subtítulo
- `delta`: variação (ex: "+12%")
- `deltaTone`: `'up'` (verde) | `'down'` (vermelho) | `'flat'` (cinzento)
- `icon`: nome de ícone

---

### `Charts.tsx` — Gráficos

**Sparkline:** Linha de evolução temporal
```typescript
<Spark data={[70, 75, 80, 85, 88, 92]} width={80} height={32} />
```

**Donut:** Gráfico circular
```typescript
<Donut segments={[{ value: 40, color: '#FF7607' }, { value: 60, color: '#1D4ED8' }]} size={80} />
```

---

### `Bar.tsx` — Barra de Progresso

```typescript
<Bar value={75} tone="success" />
```

**Tones:** `success`, `warn`, `danger`, `info`, `neutral`

---

### `Pill.tsx` — Badge de Estado

```typescript
<Pill tone="success">Aprovado</Pill>
<Pill tone="warn" dot={false}>Pendente</Pill>
```

**Tones:** `success` (verde), `warn` (âmbar), `danger` (vermelho), `info` (azul), `neutral` (cinzento), `primary` (laranja)

---

### `Modal.tsx` — Diálogo

```typescript
<Modal title="Solicitar Documento" onClose={() => setOpen(false)} width={560} footer={<div>...</div>}>
  {/* conteúdo */}
</Modal>
```

- Backdrop escuro com blur
- Close no X ou click fora
- Slot de footer para acções
- Largura customizável

---

## 9. Sistema de Design e Estilos

### Paleta de Cores

```css
/* Marca */
--primary:       #FF7607   /* Laranja BFA */
--primary-deep:  #9C4500
--primary-soft:  #FFF0E5
--primary-glow:  rgba(255, 118, 7, 0.16)

/* Semânticas */
--success: #0E7C4A   /* Verde */
--warn:    #B45309   /* Âmbar */
--danger:  #B91C1C   /* Vermelho */
--info:    #1D4ED8   /* Azul */

/* Superfícies (Light) */
--bg:        #F7F7F6
--surface:   #FFFFFF
--surface-2: #FAFAF9
--surface-3: #F2F2F0
--border:    #E7E5E1

/* Superfícies (Dark) */
--bg:      #0F0F0E
--surface: #1A1A19
--text:    #F0EFEC

/* Sidebar */
--sidebar-bg:          #1F1F1E
--sidebar-text:        #C9C7C2
--sidebar-active:      #2A2A29
--sidebar-active-text: #FFFFFF
--sidebar-active-icon: #FF7607
```

### Espaçamento e Densidade

Três modos de densidade configuráveis via CSS variables:

| Variável | Balanced | Compact | Comfortable |
|----------|----------|---------|-------------|
| `--d-row-h` | 38px | 32px | 44px |
| `--d-pad-x` | 14px | 10px | 18px |
| `--d-card-pad` | 18px | 12px | 24px |
| `--d-fs-body` | 13px | 12px | 14px |

### Radius e Sombras

```css
--r-xs:   3px
--r-sm:   4px
--r-md:   6px
--r-lg:   8px
--r-xl:   12px
--r-pill: 999px

--shadow-1: 0 1px 2px rgba(20,20,20,0.04)
--shadow-2: 0 2px 6px rgba(20,20,20,0.06)
--shadow-3: 0 8px 24px rgba(20,20,20,0.10)
```

### Classes Utilitárias (CSS)

```css
/* Layout */
.section      /* Padding da página */
.page-head    /* Cabeçalho de página (título + acção) */
.page-title   /* H1 da página */
.page-subtitle /* Subtítulo descritivo */
.grid.cols-4  /* Grid responsivo 4→2→1 colunas */

/* Cards */
.card         /* Container com surface + border + radius */
.card-head    /* Cabeçalho do card (título + acções) */
.card-title   /* Título do card */

/* Tabelas */
.tbl          /* Tabela estilizada */
.cell-person  /* Célula com avatar + texto */

/* Formulários */
.input        /* Input/textarea/select */
.select       /* Select customizado */
.form-group   /* Grupo de campo + label */
.form-label   /* Label de campo */

/* Botões */
.btn          /* Botão base */
.btn-primary  /* Botão primário (laranja) */
.btn-sm       /* Botão pequeno */
.btn-ghost    /* Botão transparente */

/* Tabs */
.tabs         /* Container de abas */
.tab          /* Aba individual */
.tab-active   /* Aba activa */

/* Sidebar */
.sidebar, .sb-brand, .sb-nav, .sb-link, .sb-badge, .sb-user
.sb-role, .sb-role-pills, .sb-role-pill

/* Topbar */
.topbar, .tb-crumb, .tb-search, .tb-spacer, .tb-env, .tb-divider
```

### Responsividade

```css
@media (max-width: 768px) {
  /* Sidebar transforma em drawer deslizante */
  /* Grid colapsa para 1 coluna */
  /* Topbar simplificada */
}

@media (max-width: 480px) {
  /* Layout ultra-compacto */
  /* Botões empilhados */
}
```

---

## 10. Camada de Dados

### `lib/data.ts` — Mock Data

Arquivo único com todos os dados demo do sistema:

**Exportações principais:**

```typescript
export const programs: Program[]           // 5 programas
export const universities: {...}[]          // 10 universidades
export const departments: string[]         // 11 departamentos
export const statuses: Record<...>         // Mapeamento de status
export const talents: Talent[]             // 20 talentos
export const applications: Application[]   // 14 candidaturas
export const payments: Payment[]           // 12 pagamentos (RH)
export const bolseiroPayments: BolseiroPayment[]  // 8 pagamentos Lwini
export const pagamentosJoaquim: BolseiroPayment[] // 8 pagamentos Joaquim
export const mentors: Mentor[]             // 6 mentores
export const geoPoints: GeoPoint[]         // 7 localizações
export const nineBoxData: NineBoxItem[]    // 18 posições 9-box
export const activities: ActivityItem[]    // Feed de actividade
export const notifications: Notification[] // Alertas
export const bolseiroNotifs: {...}[]        // Notificações bolseiro
export const tasks: Task[]                 // ~20 tarefas
export const absences: Absence[]           // ~10 faltas
export const workflows: Workflow[]         // ~8 aprovações
export const volunteers: Volunteer[]       // ~15 voluntários
export const volunteerActivities: VolunteerActivity[] // ~10 actividades
export const hoursEntries: HoursEntry[]    // ~20 registos de horas
export const rotations: Rotation[]         // 14 rotações
export const presencas: Presenca[]         // Presenças de estagiários
export const sessoesBolseiro: SessaoBolseiro[] // Sessões de mentoria
export const eventos: Evento[]             // 10 eventos (agenda)
```

### Talentos Demo (20)

| ID | Nome | Programa | Universidade | Status | Mentor |
|----|------|---------|--------------|--------|--------|
| T-1042 | Lwini Capemba | Futuro BFA | UAN (Luanda) | Activo | Edmilson Cardoso |
| T-1043 | Joaquim Tchindemba | Bolsa Internacional | Nova SBE (Lisboa) | Activo | Sofia Mendes |
| T-1044 | Esperança Quimbamba | Bolsa Nacional | UCAN (Luanda) | Atraso | Domingos Vieira |
| T-1045 | Yuran Bumba | Futuro BFA | UAN (Luanda) | Activo | Patrícia Lopes |
| T-1046 | Domingas Kassinda | Mestrado Patrocinado | U. Porto | Activo | José Almeida |
| T-1047 | Adélio Sebastião | Bolsa Nacional | Lusíada (Luanda) | Em risco | Lina Cazimba |
| T-1048 | Kiala Domingos | Liderança+ | UAN (Luanda) | Activo | Edmilson Cardoso |
| T-1049 | Nzinga Matondo | Bolsa Internacional | ISCTE-IUL (Lisboa) | Activo | Sofia Mendes |
| T-1050 | Fernando Ngoma | Futuro BFA | UCAN (Luanda) | Onboarding | Patrícia Lopes |
| T-1051 | Carla Bunga | Bolsa Internacional | HEC Paris | Activo | José Almeida |
| T-1052 | Hélder Mateus | Bolsa Internacional | LSE (Londres) | Activo | Sofia Mendes |
| T-1053 | Rosa Ferreira | Futuro BFA | Coimbra | Concluído | Domingos Vieira |
| T-1054 | Heitor Quitumba | Bolsa Internacional | LSE (Londres) | Activo | José Almeida |
| T-1055 | Anabela Zau | Liderança+ | UAN (Luanda) | Em risco | Edmilson Cardoso |
| T-1056 | Gabriel Lopes | Bolsa Nacional | U. Porto | Activo | Lina Cazimba |
| T-1057 | Conceição Banca | Mestrado Patrocinado | HEC Paris | Activo | Patrícia Lopes |
| T-1058 | David Matias | Liderança+ | USP (São Paulo) | Activo | Edmilson Cardoso |
| T-1059 | Vera Kilembe | Bolsa Nacional | UCAN (Luanda) | Atraso | Domingos Vieira |
| T-1060 | Óscar Ntombwa | Futuro BFA | UAN (Luanda) | Contratado | Patrícia Lopes |
| T-1061 | Filipa Canga | Mestrado Patrocinado | LSE (Londres) | Activo | Lina Cazimba |

---

## 11. Tipos TypeScript

### `types/index.ts` — 476 linhas

```typescript
// Roles
export type Role = 'rh' | 'direcao' | 'mentor' | 'bolseiro' | 'estagiario' | 'voluntario'
export type ParticipantKind = 'bolseiro' | 'estagiario'

// Enumerações de status
export type TalentStatus = 'active' | 'delayed' | 'risk' | 'completed' | 'hired' | 'pending' | 'onboarding'
export type ApplicationStage = 'triagem' | 'entrevista1' | 'entrevista2' | 'avaliacao' | 'aprovacao' | 'oferta' | 'rejeitado'
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'hold'
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'overdue'
export type AbsenceStatus = 'pending' | 'approved' | 'rejected'
export type VolunteerStatus = 'activo' | 'inactivo' | 'desistente'
export type EventoTipo = 'workshop' | 'formacao' | 'evento' | 'mentoria' | 'convocatoria' | 'avaliacao'
export type EventoAudience = 'todos' | 'bolseiro' | 'estagiario' | 'voluntario' | 'mentor' | 'rh'

// Interfaces principais
interface Talent {
  id: string; name: string; gender: 'M' | 'F'
  program: string; kind: 'bolseiro' | 'estagiario'
  university: string; city: string; country: string
  course: string; year: string; gpa: number
  status: TalentStatus; dept: string; mentor: string
  stipend: number; startDate: string
  perf: number; potential: 'alto' | 'médio' | 'baixo'
  riskScore: number; lastReport: string
}

interface Application {
  id: string; ref: string; name: string; email: string
  uni: string; course: string; type: string
  stage: ApplicationStage; score: number; date: string
}

interface Payment {
  id: string; talentName: string; talentId: string
  type: string; period: string; amount: number
  status: PaymentStatus; method: string; date: string
}

interface Evento {
  id: string; titulo: string; tipo: EventoTipo; descricao: string
  data: string; horaInicio: string; horaFim: string
  local: string; facilitador: string
  vagasTotal: number | null; inscritos: string[]
  audiencia: EventoAudience[]; obrigatorio: boolean; programas: string[]
}

// + Task, Absence, Workflow, Mentor, Volunteer,
//   VolunteerActivity, HoursEntry, Rotation, Presenca,
//   SessaoBolseiro, BolseiroPayment, GeoPoint, NineBoxItem,
//   ActivityItem, Notification, Program, Stage
```

---

## 12. APIs e Integrações

### API Routes (`app/api/`)

**`POST /api/candidaturas`**
- Recebe dados de candidatura do formulário público
- Valida campos obrigatórios
- Gera referência única
- Envia email de confirmação via Resend
- Devolve `{ success, ref }`

**`GET /api/candidaturas/[ref]/status`**
- Pesquisa candidatura por referência
- Devolve estado actual na pipeline
- Usado pela página `/portal/[ref]`

**`POST /api/portal`**
- Autenticação de acesso ao portal do candidato
- Valida referência e tipo
- Redirect para `/portal/[ref]`

**`POST /api/portal/logout`**
- Limpa cookies de sessão do candidato
- Redirect para `/portal`

### Integração de Email (Resend)

```typescript
// lib/emails.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// Email de confirmação de candidatura
await resend.emails.send({
  from: 'BFA TalentFlow <noreply@bfa-talentflow.ao>',
  to: candidato.email,
  subject: 'Candidatura recebida — BFA TalentFlow',
  html: emailTemplate(candidato)
})
```

---

## 13. Funcionalidades Transversais

### Tema Claro / Escuro

- Toggle no topbar (ícone sol/lua)
- Implementado via `data-theme="dark"` no `<html>`
- Todas as cores via CSS variables (mudam com o tema)
- Persistência em `localStorage`
- Sidebar sempre escura (independente do tema)

### Pesquisa Global

Activa em todas as páginas via Topbar:
- Pesquisa em tempo real (sem debounce) enquanto se digita
- Fontes: talentos, candidaturas, pagamentos, tarefas, páginas
- Resultados agrupados por categoria com ícone
- Teclado: Enter → navega, Escape → fecha
- Clique fora fecha o dropdown

### Notificações por Role (Sino)

Dropdown no Topbar com alertas contextuais:

| Role | Fontes de alertas |
|------|------------------|
| RH | Talentos em risco, pagamentos falhos/pendentes, novas candidaturas, aprovações urgentes |
| Direcção | Talentos em risco, pagamentos falhos, aprovações urgentes |
| Mentor | Mentorandos em risco, tarefas em atraso, tarefas pendentes |
| Bolseiro/Estagiário | Pagamentos, documentos, sessões de mentoria |
| Voluntário | Actividades agendadas, horas validadas |

### Filtros por Role (Data Isolation)

Padrão aplicado em: Tarefas, Faltas, Documentos, Avaliações, Agenda, Notificações, Chat

```typescript
const visibleData = isParticipant ? data.filter(d => d.talentId === myTalentId)
                  : isMentor      ? data.filter(d => MENTOR_MENTEE_IDS.has(d.talentId))
                  : data
```

### Responsividade

- Sidebar colapsa para drawer em mobile (≤768px)
- Grids adaptam de 4 → 2 → 1 coluna
- Tabelas com scroll horizontal em mobile
- Topbar simplificada em mobile (sem breadcrumb longo)

---

## 14. Métricas do Projecto

| Métrica | Valor |
|---------|-------|
| **Total de ficheiros fonte** | ~45 ficheiros `.tsx` / `.ts` |
| **Linhas de código (source)** | ~12.600 linhas |
| **Páginas do dashboard** | 27 páginas |
| **Páginas públicas** | 4 páginas |
| **API Routes** | 5 endpoints |
| **Componentes UI** | 7 componentes reutilizáveis |
| **Componentes de layout** | 3 (AppShell, Sidebar, Topbar) |
| **Roles de utilizador** | 6 |
| **Talentos mock** | 20 |
| **Eventos mock** | 10 |
| **Pagamentos mock** | 20+ registos (vários arrays) |
| **Documentos mock** | 12 |
| **Tipos TypeScript** | 30+ interfaces |
| **CSS custom** | 989 linhas |
| **Ícones SVG** | 38 ícones |
| **Commits git** | 22 commits |
| **Dependências npm** | 4 (next, react, react-dom, resend) |

---

## 15. Histórico de Commits

```
b6f2866  chore: update tsconfig build cache
df9a7d4  feat: add chat, notifications, global search and role-aware filtering
         → /chat (mensagens directas), /notificacoes (envio com taxa de leitura),
           pesquisa global live, Aceitar/Recusar convocatórias, submit modal documentos,
           avaliacoes filtradas por mentor, ícone chat

fd8fa56  feat: pagamentos para estagiários e bolseiros — dados distintos por persona
         → Tab "Pagamentos" no portal, 8 registos por persona, KPIs personalizados

bbf190c  feat: roles estagiário + voluntário — login com 6 perfis, sidebars expandidas
         → Login com grupos Equipa BFA / Participantes, sidebar por role,
           portal voluntário (/voluntario), portal estagiário via /bolseiro com persona

522ef9f  feat: agenda — calendário + catálogo de workshops com inscrição por role
         → Calendário mensal, catálogo por tipo, inscrição por role,
           10 eventos mock, filtros, KPIs

8832f5f  feat: useRole hook — lê cookie de role no cliente
         → Hook client-side com validação dos 6 roles

c3dcd16  feat: mentor sidebar restaurado + tarefas e faltas filtradas por role
         → Mentor vê apenas mentorandos, data isolation em tarefas e faltas

89d56a1  feat: rotina e ritmo de trabalho — heatmap 4 semanas + métricas
         → Heatmap de actividade, métricas semanais, tab "Rotinas" no bolseiro

5329556  feat: presenças, horas e sessões — bolseiro portal, estagiários admin
         → Tab "Presenças", registo de horas, sessões de mentoria, KPIs

637d196  fix: sidebar nav isolation, logout button, functional notifications
         → Logout funcional, notificações por role, sidebar activa correcta

eaeff43  feat: full 3-type participant system (bolseiro/estagiario/voluntario)
         → Três tipos de participante com dados distintos

34ca841  Update tsconfig build info

a737a3c  Add volunteer distinction to mentor portal with separate tab
         → Tab de voluntários no portal do mentor

3247ad1  Complete system audit: fix all remaining non-functional buttons
         → Revisão geral, botões funcionais em todos os módulos

74a2461  Fix dark mode toggle and make all module buttons functional
         → Dark mode via data-theme, botões com lógica real

943ce9f  feat: modulos de voluntariado Fundacao BFA (4 novos modulos)
         → /voluntarios, /actividades, /horas, /relatorios-voluntariado

7fe909c  fix: adicionar botao Acesso RH na landing page e link no footer
         → Botão de acesso ao sistema na landing pública

d36e2fc  feat: portal candidato, emails Resend e gestao de candidaturas RH
         → Formulário de candidatura, API, emails, tracking de estado

a0c6f9e  feat: paginas publicas - landing /programa e formulario /candidatura
         → Landing page do programa e formulário público

b957449  feat: pagina de login redesenhada com painel lateral e cards de perfil
         → Login com painel esquerdo/direito, cards de role

d7666de  fix: sidebar colapsivel, responsividade mobile e bug do menu
         → Sidebar toggle desktop, drawer mobile, responsividade

c0485e7  feat: Next.js 14 full conversion — BFA TalentFlow
         → Migração do protótipo Claude Designer para Next.js 14 App Router
```

---

## 16. Estado Actual e Próximos Passos

### O que está completo

- [x] Protótipo Next.js 14 totalmente funcional
- [x] 6 roles com navegação e dados isolados
- [x] 27 módulos do dashboard implementados
- [x] Sistema de login com cookies
- [x] Páginas públicas (programa, candidatura, portal)
- [x] API Routes com integração Resend
- [x] Tema claro/escuro
- [x] Responsividade mobile
- [x] Pesquisa global
- [x] Notificações por role
- [x] Chat directo 1-a-1
- [x] Centro de notificações (envio RH/Mentor)
- [x] Agenda com convocatórias (Aceitar/Recusar)
- [x] Avaliações 360° com modal de scoring
- [x] Documentos com submissão por participante
- [x] Pagamentos distintos por persona
- [x] Heatmap de actividade
- [x] 9-Box succession planning
- [x] Portal do voluntário com sistema de níveis

### Possíveis próximos passos (refinamento)

- [ ] Ligar a uma base de dados real (Prisma + PostgreSQL / Supabase)
- [ ] Autenticação real (NextAuth.js / Clerk)
- [ ] Persistência de estado (sem perda ao reload)
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Notificações por email reais (expandir Resend)
- [ ] Upload de ficheiros real (Vercel Blob / S3)
- [ ] Dashboard analytics com gráficos mais ricos (Recharts / Chart.js)
- [ ] Internacionalização (i18n) — versão inglesa
- [ ] Testes automatizados (Playwright / Vitest)
- [ ] Modo offline / PWA

---

*Relatório gerado em 9 de Maio de 2026 · BFA TalentFlow v1.0 · 22 commits · branch main*
