'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'
import { initials, avatarColor } from '@/lib/utils'
import type { Role } from '@/types'

interface NavItem {
  id: string
  label: string
  icon: string
  badge?: number
}

interface NavSection {
  section: string
  items: NavItem[]
}

const NAV_BY_ROLE: Record<Role, NavSection[]> = {
  rh: [
    {
      section: 'Operação',
      items: [
        { id: 'overview',      label: 'Dashboard',    icon: 'dashboard' },
        { id: 'candidaturas',  label: 'Candidaturas', icon: 'funnel',    badge: 12 },
        { id: 'talentos',      label: 'Talentos',     icon: 'users' },
        { id: 'estagiarios',   label: 'Estagiários',  icon: 'graduation' },
        { id: 'tarefas',       label: 'Tarefas',      icon: 'check' },
        { id: 'faltas',        label: 'Faltas',        icon: 'calendar' },
        { id: 'pagamentos',    label: 'Pagamentos',   icon: 'cash',      badge: 3 },
        { id: 'workflows',     label: 'Aprovações',   icon: 'layers',    badge: 6 },
        { id: 'documentos',    label: 'Documentos',   icon: 'doc' },
      ],
    },
    {
      section: 'Desenvolvimento',
      items: [
        { id: 'avaliacoes',    label: 'Avaliações',   icon: 'star' },
        { id: 'mentoria',      label: 'Mentoria',     icon: 'briefcase' },
        { id: 'sucessao',      label: 'Sucessão',     icon: 'grid' },
        { id: 'retencao',      label: 'Retenção',     icon: 'shield' },
      ],
    },
    {
      section: 'Análise',
      items: [
        { id: 'geografia',     label: 'Geografia',    icon: 'globe' },
        { id: 'roi',           label: 'ROI',          icon: 'chart' },
        { id: 'compliance',    label: 'Compliance',   icon: 'shield' },
      ],
    },
    {
      section: 'Voluntariado',
      items: [
        { id: 'voluntarios',               label: 'Voluntários',  icon: 'users'    },
        { id: 'actividades',               label: 'Actividades',  icon: 'calendar' },
        { id: 'horas',                     label: 'Horas',        icon: 'clock'    },
        { id: 'relatorios-voluntariado',   label: 'Relatórios',   icon: 'chart'    },
      ],
    },
  ],
  direcao: [
    {
      section: 'Estratégico',
      items: [
        { id: 'overview',      label: 'Dashboard',    icon: 'dashboard' },
        { id: 'roi',           label: 'ROI',          icon: 'chart' },
        { id: 'sucessao',      label: 'Sucessão',     icon: 'grid' },
        { id: 'geografia',     label: 'Geografia',    icon: 'globe' },
      ],
    },
    {
      section: 'Talento',
      items: [
        { id: 'talentos',      label: 'Talentos',     icon: 'users' },
        { id: 'avaliacoes',    label: 'Avaliações',   icon: 'star' },
        { id: 'retencao',      label: 'Retenção',     icon: 'shield' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { id: 'workflows',     label: 'Aprovações',   icon: 'layers' },
        { id: 'compliance',    label: 'Compliance',   icon: 'shield' },
      ],
    },
    {
      section: 'Voluntariado',
      items: [
        { id: 'voluntarios',             label: 'Voluntários', icon: 'users'  },
        { id: 'relatorios-voluntariado', label: 'Relatórios',  icon: 'chart'  },
      ],
    },
  ],
  mentor: [
    {
      section: 'Mentoria',
      items: [
        { id: 'mentor',        label: 'Dashboard',    icon: 'dashboard' },
        { id: 'mentoria',      label: 'Mentorandos',  icon: 'users' },
        { id: 'tarefas',       label: 'Tarefas',      icon: 'check' },
      ],
    },
  ],
  bolseiro: [
    {
      section: 'O Meu Programa',
      items: [
        { id: 'bolseiro',      label: 'Início',       icon: 'dashboard' },
        { id: 'pagamentos',    label: 'Pagamentos',   icon: 'cash' },
        { id: 'documentos',    label: 'Documentos',   icon: 'doc' },
        { id: 'tarefas',       label: 'Tarefas',      icon: 'check' },
        { id: 'faltas',        label: 'Faltas',        icon: 'calendar' },
      ],
    },
  ],
}

const USER_BY_ROLE: Record<Role, { name: string; sub: string }> = {
  rh:       { name: 'Mariana Quissama',  sub: 'Gestora de Programa · RH' },
  direcao:  { name: 'Dr. Manuel Bemba',  sub: 'Direcção de RH' },
  mentor:   { name: 'Edmilson Cardoso',  sub: 'Director · Banca de Empresas' },
  bolseiro: { name: 'Lwini Capemba',     sub: 'Trainee Y1 · Futuro BFA' },
}

const ROLE_PILLS: { key: Role; label: string }[] = [
  { key: 'rh',       label: 'RH' },
  { key: 'direcao',  label: 'Dir.' },
  { key: 'mentor',   label: 'Mentor' },
  { key: 'bolseiro', label: 'Bolseiro' },
]

const DEFAULT_PAGE: Record<Role, string> = {
  rh:       '/overview',
  direcao:  '/overview',
  mentor:   '/mentor',
  bolseiro: '/bolseiro',
}

interface SidebarProps {
  role: Role
  collapsed?: boolean
}

export default function Sidebar({ role, collapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const sections = NAV_BY_ROLE[role] ?? []
  const user = USER_BY_ROLE[role]

  // Extract first path segment to match nav items correctly (handles /talentos/T-1042)
  const activeSegment = pathname.split('/').filter(Boolean)[0] ?? ''

  const handleRoleSwitch = (r: Role) => {
    document.cookie = `role=${r}; path=/; max-age=31536000`
    router.push(DEFAULT_PAGE[r])
    router.refresh()
  }

  const inits = initials(user.name)
  const avatarBg = avatarColor(user.name)

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sb-brand">
        <div className="sb-logo">B</div>
        <div className="sb-brand-text">
          <b>TalentFlow</b>
          <span>BFA · {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Role switcher */}
      <div className="sb-role">
        <div className="sb-role-label">Perfil activo</div>
        <div className="sb-role-pills">
          {ROLE_PILLS.map(({ key, label }) => (
            <button
              key={key}
              className={`sb-role-pill${key === role ? ' active' : ''}`}
              onClick={() => handleRoleSwitch(key)}
              title={key}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sb-nav">
        {sections.map(sec => (
          <div key={sec.section} className="sb-section">
            <div className="sb-section-label">{sec.section}</div>
            {sec.items.map(item => {
              const isActive = activeSegment === item.id
              return (
                <Link
                  key={item.id}
                  href={`/${item.id}`}
                  className={`sb-link${isActive ? ' active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sb-icon">
                    <Icon name={item.icon} size={16} />
                  </span>
                  <span>{item.label}</span>
                  {item.badge != null && (
                    <span className="sb-badge">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="sb-user">
        <div
          className="sb-avatar"
          style={{ background: avatarBg }}
          title={user.name}
        >
          {inits}
        </div>
        <div className="sb-user-text">
          <b>{user.name}</b>
          <span>{user.sub}</span>
        </div>
      </div>
    </aside>
  )
}
