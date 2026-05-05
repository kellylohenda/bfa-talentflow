# BFA TalentFlow - Sistema de Gestão de Talentos & Bolsas

Aplicação Next.js 16 moderna para gestão de talentos, bolsas bancárias e programas de desenvolvimento em Angola.

## 🚀 Características Principais

- **Autenticação Completa**: Sistema de login/logout com JWT e autenticação segura
- **Multi-Role**: Diferentes interfaces para RH, Direção, Mentores e Bolseiros
- **Gestão de Talentos**: Cadastro, rastreamento e desenvolvimento de talentos
- **Candidaturas**: Funil kanban com 6 etapas (candidatura → onboarding)
- **Pagamentos**: Processamento e rastreamento de pagamentos em Kwanzas
- **Mentoria**: Sistema de matching de mentores com IA
- **Avaliações 360°**: Feedback de múltiplas perspectivas
- **Matriz 9-Box**: Sucessão e planejamento de carreira
- **Páginas Públicas**: Landing page (Programa) e formulário de candidatura
- **Dark Mode**: Suporte a tema escuro nativo
- **Responsivo**: Design mobile-first para todos os dispositivos

## 📊 Stack Técnico

### Frontend
- **Next.js 16** - Framework React moderno com App Router
- **React 18** - Interface reativa
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utilitário
- **Lucide React** - Ícones modernos

### Backend & Data
- **PostgreSQL (Neon)** - Banco de dados relacional
- **Redis (Upstash)** - Cache em tempo real
- **JWT** - Autenticação stateless
- **bcryptjs** - Hash de senhas seguro

### Features
- **Server Actions** - Operações CRUD sem API routes explícitas
- **Route Handlers** - API RESTful customizada
- **Middleware** - Proteção de rotas baseada em autenticação
- **Streaming** - Renderização progressiva

## 🛠️ Setup Local

### Requisitos
- Node.js 18+ 
- PostgreSQL 14+ (Neon)
- Redis (Upstash)

### Instalação

```bash
# Clonar e instalar dependências
git clone <repo-url>
cd bfa-talentflow
npm install --legacy-peer-deps

# Configurar variáveis de ambiente
cp .env.local.example .env.local
# Adicionar DATABASE_URL, KV_REST_API_URL, KV_REST_API_TOKEN

# Inicializar database (automático ao primeiro request)
npm run dev
# Visitar http://localhost:3000/api/seed para popular dados

# Compilar para produção
npm run build
npm run start
```

## 📚 Estrutura do Projeto

```
/app
  /api                    # API routes (auth, seed, etc)
    /auth                 # Autenticação
    /seed                 # Dados iniciais
  /dashboard              # Área protegida
    /talents              # Gestão de talentos
    /applications         # Candidaturas (funil)
    /payments             # Processamento de pagamentos
    /mentors              # Mentoria e sessões
    /nine-box             # Matriz sucessão
    /evaluations          # Avaliações 360°
    /workflows            # Workflows de aprovação
    /compliance           # Auditoria e compliance
  /login                  # Página de login
  /programa               # Landing page pública
  /inscricao              # Formulário de candidatura
  /layout.tsx             # Root layout

/components
  /ui                     # Componentes reutilizáveis (Card, Button, Badge)
  /layout                 # Layout components (Shell, Sidebar, Topbar)

/lib
  /db.ts                  # Cliente PostgreSQL
  /redis.ts               # Cliente Redis & cache utils
  /auth.ts                # Funções de autenticação

/styles
  /globals.css            # Estilos globais e design tokens

/types
  /index.ts               # TypeScript interfaces

/public                   # Ativos estáticos
```

## 🔐 Autenticação

### Credenciais Demo

```
RH:
  Email: rh@bfa.ao
  Senha: demo123

Direção:
  Email: director@bfa.ao
  Senha: demo123

Mentor:
  Email: mentor@bfa.ao
  Senha: demo123
```

### Fluxo de Autenticação

1. Usuário faz login em `/login`
2. API valida credenciais contra PostgreSQL
3. JWT token gerado e armazenado em HTTP-only cookie
4. Middleware protege rotas em `/dashboard`
5. Dados do usuário disponíveis em todas as páginas

## 🗄️ Schema do Banco de Dados

```sql
-- Usuários (RH, Direção, Mentor, Bolseiro)
users (id, email, name, password_hash, role, status, created_at)

-- Talentos/Bolseiros
talents (id, first_name, last_name, email, phone, institution, 
         course, gpa, status, program, location, mentor_id, created_at)

-- Candidaturas
applications (id, talent_id, program_id, stage, status, created_at)

-- Pagamentos
payments (id, talent_id, amount, currency, month, year, 
          status, payment_method, swift_code, created_at)

-- Mentores
mentors (id, user_id, specialization, bio, experience_years, 
         availability, created_at)

-- Sessões de mentoria
sessions (id, talent_id, mentor_id, date, duration_minutes, 
          status, created_at)
```

## 🎨 Design System

### Cores
- **Primária**: Orange (#FF7607)
- **Secundárias**: Blue (#1D4ED8), Green (#0E7C4A), Purple (#7C3AED)
- **Neutras**: Cinzento, Anthracite, Creme

### Tipografia
- **Inter** - Body text
- **System fonts** - Headlines

### Densidade Visual
- **Compact** (32px) - Muita informação
- **Balanced** (38px) - Padrão
- **Comfortable** (48px) - Espaçado

Ajustável via painel de settings no topbar!

## 📱 Páginas Implementadas

### Dashboard (Protegido)
✅ Overview - KPIs e atividades recentes  
✅ Talentos - Tabela com filtros de status/programa  
✅ Candidaturas - Funil Kanban 6 etapas  
✅ Pagamentos - Processamento e rastreamento  
✅ Mentores - Pool, sessões, matching IA  
✅ 9-Box - Matriz desempenho/potencial  
✅ Avaliações 360° - Feedback multi-perspectiva  
✅ Workflows - Aprovações com SLA  
✅ Compliance - Auditoria Lei 22/11  

### Públicas
✅ Home - Landing page com programas  
✅ Programa - Detalhe dos programas  
✅ Inscrição - Formulário multi-step 4 fases  

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Conectar repo ao Vercel
vercel link

# Configurar env vars no Vercel dashboard
# DATABASE_URL, KV_REST_API_URL, KV_REST_API_TOKEN, JWT_SECRET

# Deploy automático via git push
git push origin main
```

### Variáveis de Ambiente Necessárias

```env
# Database
DATABASE_URL=postgresql://user:password@host/db

# Redis
KV_REST_API_URL=https://api.upstash.com/...
KV_REST_API_TOKEN=...
REDIS_URL=redis://...

# Auth
JWT_SECRET=seu-secret-super-seguro-aqui

# App
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

## 🧪 Dados de Teste

Automaticamente populados quando você visita `/api/seed`:

- **3 usuários**: RH, Direção, Mentor
- **3 talentos**: Lwini Capemba, Joaquim Tchindemba, Nzinga Matondo
- **Dados realistas**: Angola/Portugal, universidades reais, GPA reais

## 📈 Próximos Passos (Roadmap)

- [ ] Integração com email (transacional + digest)
- [ ] Gráficos avançados (Recharts)
- [ ] Mapa geográfico (React Simple Maps)
- [ ] Geração de PDFs (relatórios)
- [ ] Importação/exportação Excel
- [ ] Notificações em tempo real (WebSockets)
- [ ] Integração com sistemas bancários (SWIFT)
- [ ] App mobile nativa (React Native)

## 📄 License

Propriedade da BFA - 2024

## 👥 Suporte

Para questões, bugs ou sugestões:
- Email: info@bfa.ao
- Telefone: +244 22 412 3456
