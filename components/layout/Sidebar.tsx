'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'
import { Role } from '@/types'

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
        { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
        { id: 'candidaturas', label: 'Candidaturas', icon: 'funnel', badge: 12 },
        { id: 'talentos', label: 'Talentos', icon: 'users' },
        { id: 'estagiarios', label: 'Estagiários', icon: 'graduation' },
        { id: 'tarefas', label: 'Tarefas', icon: 'check' },
        { id: 'faltas', label: 'Faltas', icon: 'calendar' },
        { id: 'pagamentos', label: 'Pagamentos', icon: 'cash', badge: 3 },
        { id: 'workflows', label: 'Aprovações', icon: 'check', badge: 6 },
        { id: 'retencao', label: 'Retenção', icon: 'shield' },
      ],
    },
    {
      section: 'Desenvolvimento',
      items: [
        { id: 'avaliacoes', label: 'Avaliações', icon: 'star' },
        { id: 'mentoria', label: 'Mentoria', icon: 'briefcase' },
        { id: 'sucessao', label: 'Sucessão', icon: 'grid' },
      ],
    },
    {
      section: 'Análise',
      items: [
        { id: 'geografia', label: 'Geografia', icon: 'globe' },
        { id: 'roi', label: 'ROI', icon: 'chart' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { id: 'compliance', label: 'Compliance', icon: 'shield' },
      ],
    },
  ],
  direcao: [
    {
      section: 'Estratégico',
      items: [
        { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
        { id: 'roi', label: 'ROI', icon: 'chart' },
        { id: 'sucessao', label: 'Sucessão', icon: 'grid' },
        { id: 'geografia', label: 'Geografia', icon: 'globe' },
      ],
    },
    {
      section: 'Talento',
      items: [
        { id: 'talentos', label: 'Talentos', icon: 'users' },
        { id: 'avaliacoes', label: 'Avaliações', icon: 'star' },
        { id: 'retencao', label: 'Retenção', icon: 'shield' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { id: 'workflows', label: 'Aprovações', icon: 'check' },
        { id: 'compliance', label: 'Compliance', icon: 'shield' },
      ],
    },
  ],
  mentor: [
    {
      section: 'Mentoria',
      items: [
        { id: 'mentor', label: 'Dashboard', icon: 'dashboard' },
      ],
    },
  ],
  bolseiro: [
    {
      section: 'O Meu Programa',
      items: [
        { id: 'bolseiro', label: 'Início', icon: 'dashboard' },
        { id: 'pagamentos', label: 'Pagamentos', icon: 'cash' },
        { id: 'documentos', label: 'Documentos', icon: 'doc' },
        { id: 'mentoria', label: 'Mentoria', icon: 'briefcase' },
        { id: 'tarefas', label: 'Tarefas', icon: 'check' },
        { id: 'faltas', label: 'Faltas', icon: 'calendar' },
      ],
    },
    {
      section: 'Comunidade',
      items: [
        { id: 'eventos', label: 'Eventos', icon: 'calendar' },
      ],
    },
  ],
}

const USER_BY_ROLE: Record<Role, { name: string; sub: string }> = {
  rh: { name: 'Mariana Quissama', sub: 'Gestora de Programa · RH' },
  direcao: { name: 'Dr. Manuel Bemba', sub: 'Direcção de RH' },
  mentor: { name: 'Edmilson Cardoso', sub: 'Director · Banca de Empresas' },
  bolseiro: { name: 'Lwini Capemba', sub: 'Trainee Y1 · Futuro BFA' },
}

const ROLE_PILLS: { key: Role; label: string }[] = [
  { key: 'rh', label: 'RH' },
  { key: 'direcao', label: 'Direcção' },
  { key: 'mentor', label: 'Mentor' },
  { key: 'bolseiro', label: 'Bolseiro' },
]

const DEFAULT_PAGE: Record<Role, string> = {
  rh: '/overview',
  direcao: '/overview',
  mentor: '/mentor',
  bolseiro: '/bolseiro',
}

interface SidebarProps {
  role: Role
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const sections = NAV_BY_ROLE[role] ?? []
  const user = USER_BY_ROLE[role]

  const handleRoleSwitch = (r: Role) => {
    document.cookie = `role=${r}; path=/; max-age=31536000`
    router.push(DEFAULT_PAGE[r])
  }

  const currentPage = pathname.replace('/', '')

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <Icon name="layers" size={22} />
        <span>TalentFlow</span>
      </div>

      <div className="sb-role">
        {ROLE_PILLS.map(({ key, label }) => (
          <button
            key={key}
            className={`pill ${key === role ? 'pill-primary' : 'pill-neutral'}`}
            onClick={() => handleRoleSwitch(key)}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {label}
          </button>
        ))}
      </div>

      <nav className="sb-nav">
        {sections.map((sec) => (
          <div key={sec.section} className="sb-section">
            <div className="sb-section-label">{sec.section}</div>
            {sec.items.map((item) => {
              const isActive = currentPage === item.id
              return (
                <Link
                  key={item.id}
                  href={`/${item.id}`}
                  className={`sb-item${isActive ? ' active' : ''}`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                  {item.badge != null && (
                    <span className="tab-badge">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sb-user">
        <div className="sb-user-name">{user.name}</div>
        <div className="sb-user-sub">{user.sub}</div>
      </div>
    </aside>
  )
}
