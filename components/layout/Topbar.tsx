'use client'

import { usePathname } from 'next/navigation'
import Icon from '@/components/ui/Icon'

const PATH_LABELS: Record<string, string> = {
  overview:     'Visão Geral',
  candidaturas: 'Candidaturas',
  talentos:     'Talentos',
  pagamentos:   'Pagamentos',
  avaliacoes:   'Avaliações 360°',
  mentoria:     'Mentoria',
  estagiarios:  'Estagiários',
  tarefas:      'Tarefas',
  faltas:       'Faltas',
  sucessao:     'Sucessão · 9-Box',
  geografia:    'Mapa Geográfico',
  roi:          'ROI & Custos',
  workflows:    'Aprovações',
  retencao:     'Retenção',
  compliance:   'Compliance',
  mentor:       'Portal do Mentor',
  bolseiro:     'Portal do Bolseiro',
  documentos:   'Documentos',
}

interface TopbarProps {
  onToggleDesktop: () => void
  onToggleMobile: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Topbar({ onToggleDesktop, onToggleMobile, theme, onToggleTheme }: TopbarProps) {
  const pathname = usePathname()
  const segment = pathname.split('/').filter(Boolean)[0] ?? ''
  const label = PATH_LABELS[segment] ?? segment

  return (
    <header className="topbar">
      {/* Desktop collapse toggle */}
      <button
        className="btn btn-ghost tb-toggle tb-toggle-desktop"
        onClick={onToggleDesktop}
        aria-label="Colapsar menu"
        title="Colapsar / Expandir menu"
      >
        <Icon name="menu" size={18} />
      </button>

      {/* Mobile hamburger */}
      <button
        className="btn btn-ghost tb-toggle tb-toggle-mobile"
        onClick={onToggleMobile}
        aria-label="Abrir menu"
      >
        <Icon name="menu" size={18} />
      </button>

      {/* Breadcrumb */}
      <div className="tb-crumb">
        <span style={{ opacity: 0.45, fontSize: 13 }}>BFA TalentFlow</span>
        <span style={{ opacity: 0.3, margin: '0 6px' }}>/</span>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
      </div>

      {/* Search */}
      <div className="tb-search">
        <Icon name="search" size={14} />
        <input
          className="input input-search"
          placeholder="Pesquisar..."
          type="search"
        />
      </div>

      <div className="tb-spacer" />

      <div className="tb-env">
        <span>Demo · 2026</span>
      </div>

      <div className="tb-divider" />

      <button className="btn btn-ghost" style={{ position: 'relative' }} aria-label="Notificações">
        <Icon name="bell" size={18} />
        <span
          style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--danger)',
            border: '1.5px solid var(--surface)',
          }}
        />
      </button>

      <button
        className="btn btn-ghost"
        aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        onClick={onToggleTheme}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
      </button>
    </header>
  )
}
