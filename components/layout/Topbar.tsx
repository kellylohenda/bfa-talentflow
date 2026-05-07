'use client'

import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import Icon from '@/components/ui/Icon'
import { talents, payments, applications, workflows, tasks, bolseiroNotifs } from '@/lib/data'
import type { Role } from '@/types'

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
  bolseiro:     'Portal do Bolseiro / Estagiário',
  voluntario:   'Portal do Voluntário',
  agenda:       'Agenda & Workshops',
  documentos:   'Documentos',
  voluntarios:  'Voluntários',
  actividades:  'Actividades',
  horas:        'Horas',
}

type NotifTone = 'danger' | 'warn' | 'info' | 'neutral'
type NotifItem = { id: string; icon: string; tone: NotifTone; title: string; sub: string }

function buildNotifications(role: Role): NotifItem[] {
  if (role === 'rh') {
    const riskTalents = talents.filter(t => t.riskScore >= 0.4)
    const badPayments = payments.filter(p => p.status === 'pending' || p.status === 'failed')
    const newApps = applications.filter(a => a.stage === 'triagem')
    const urgentWf = workflows.filter(w => w.urgency === 'high')
    return [
      ...riskTalents.map(t => ({
        id: `risk-${t.id}`, icon: 'alert', tone: 'danger' as const,
        title: `${t.name} em risco`,
        sub: `Score ${Math.round(t.riskScore * 100)}% · ${t.program.toUpperCase()}`,
      })),
      ...badPayments.map(p => ({
        id: `pay-${p.id}`, icon: 'cash',
        tone: p.status === 'failed' ? 'danger' as const : 'warn' as const,
        title: p.status === 'failed' ? `Pagamento falhou — ${p.talentName}` : `Pagamento pendente — ${p.talentName}`,
        sub: `${p.type} · ${p.period}`,
      })),
      ...newApps.map(a => ({
        id: `app-${a.id}`, icon: 'funnel', tone: 'info' as const,
        title: `Nova candidatura — ${a.name}`,
        sub: `${a.uni} · ${a.course}`,
      })),
      ...urgentWf.map(w => ({
        id: `wf-${w.id}`, icon: 'layers', tone: 'warn' as const,
        title: `Aprovação urgente — ${w.talent}`,
        sub: w.type,
      })),
    ]
  }

  if (role === 'direcao') {
    const riskTalents = talents.filter(t => t.riskScore >= 0.4)
    const urgentWf = workflows.filter(w => w.urgency === 'high')
    const failedPays = payments.filter(p => p.status === 'failed')
    return [
      ...riskTalents.map(t => ({
        id: `risk-${t.id}`, icon: 'alert', tone: 'danger' as const,
        title: `${t.name} em risco`,
        sub: `Score ${Math.round(t.riskScore * 100)}%`,
      })),
      ...failedPays.map(p => ({
        id: `pay-${p.id}`, icon: 'cash', tone: 'danger' as const,
        title: `Pagamento falhou — ${p.talentName}`,
        sub: p.type,
      })),
      ...urgentWf.map(w => ({
        id: `wf-${w.id}`, icon: 'layers', tone: 'warn' as const,
        title: `Aprovação urgente — ${w.talent}`,
        sub: w.type,
      })),
    ]
  }

  if (role === 'mentor') {
    const MY_MENTOR = 'Edmilson Cardoso'
    const atRisk = talents.filter(t => t.mentor === MY_MENTOR && t.riskScore >= 0.4)
    const overdueTasks = tasks.filter(t => t.assignedBy === MY_MENTOR && t.status === 'overdue')
    const pendingTasks = tasks.filter(t => t.assignedBy === MY_MENTOR && t.status === 'pending').slice(0, 3)
    return [
      ...atRisk.map(t => ({
        id: `risk-${t.id}`, icon: 'alert', tone: 'danger' as const,
        title: `${t.name} em risco`,
        sub: `Score ${Math.round(t.riskScore * 100)}% — requer atenção`,
      })),
      ...overdueTasks.map(t => ({
        id: `tk-${t.id}`, icon: 'clock', tone: 'danger' as const,
        title: `Tarefa em atraso — ${t.talentName}`,
        sub: t.title,
      })),
      ...pendingTasks.map(t => ({
        id: `pd-${t.id}`, icon: 'check', tone: 'info' as const,
        title: `Tarefa pendente — ${t.talentName}`,
        sub: t.title,
      })),
    ]
  }

  if (role === 'bolseiro' || role === 'estagiario') {
    return bolseiroNotifs.map(n => ({
      id: `bn-${n.id}`,
      icon: n.type === 'payment' ? 'cash' : n.type === 'doc' ? 'doc' : n.type === 'mentor' ? 'briefcase' : 'bell',
      tone: !n.read ? 'info' as const : 'neutral' as const,
      title: n.title,
      sub: n.text,
    }))
  }

  if (role === 'voluntario') {
    return [
      { id: 'v-1', icon: 'calendar', tone: 'info' as const, title: 'Actividade agendada', sub: 'Escola Primária Sambizanga · 24 Mai' },
      { id: 'v-2', icon: 'clock', tone: 'neutral' as const, title: 'Horas validadas', sub: '4h · Tutoria Escolar · Fev 2026' },
    ]
  }

  return []
}

const TONE_COLORS: Record<NotifTone, { bg: string; color: string }> = {
  danger:  { bg: '#FEE2E2', color: '#DC2626' },
  warn:    { bg: '#FEF3C7', color: '#D97706' },
  info:    { bg: '#DBEAFE', color: '#2563EB' },
  neutral: { bg: '#F3F4F6', color: '#6B7280' },
}

interface TopbarProps {
  role: Role
  onToggleDesktop: () => void
  onToggleMobile: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Topbar({ role, onToggleDesktop, onToggleMobile, theme, onToggleTheme }: TopbarProps) {
  const pathname = usePathname()
  const segment = pathname.split('/').filter(Boolean)[0] ?? ''
  const label = PATH_LABELS[segment] ?? segment

  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const notifs = buildNotifications(role)
  const count = notifs.length

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

      {/* Notification bell */}
      <div style={{ position: 'relative' }} ref={notifRef}>
        <button
          className="btn btn-ghost"
          style={{ position: 'relative' }}
          aria-label="Notificações"
          onClick={() => setNotifOpen(o => !o)}
        >
          <Icon name="bell" size={18} />
          {count > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              minWidth: 16, height: 16, borderRadius: 8,
              background: 'var(--danger)',
              border: '1.5px solid var(--surface)',
              fontSize: 9, fontWeight: 700, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 3px',
              lineHeight: 1,
            }}>
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>

        {notifOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: 360,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            zIndex: 200,
            overflow: 'hidden',
          }}>
            {/* Panel header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Notificações</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                background: count > 0 ? '#FEE2E2' : '#F3F4F6',
                color: count > 0 ? '#DC2626' : '#6B7280',
              }}>
                {count} {count === 1 ? 'alerta' : 'alertas'}
              </span>
            </div>

            {/* Notification list */}
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {notifs.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, opacity: 0.4 }}>
                  Sem notificações pendentes
                </div>
              ) : notifs.map((n, idx) => {
                const colors = TONE_COLORS[n.tone]
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: idx < notifs.length - 1 ? '1px solid var(--border)' : 'none',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      cursor: 'default',
                    }}
                  >
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: colors.bg,
                      color: colors.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon name={n.icon} size={14} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>
                        {n.title}
                      </div>
                      <div style={{
                        fontSize: 12, opacity: 0.6,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {n.sub}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Panel footer */}
            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--border)',
              fontSize: 12,
              opacity: 0.5,
              textAlign: 'center',
            }}>
              {role === 'rh' ? 'RH · Gestora de Programa'
                : role === 'direcao' ? 'Direcção de RH'
                : role === 'mentor' ? 'Portal do Mentor · Edmilson Cardoso'
                : 'Portal do Bolseiro'}
            </div>
          </div>
        )}
      </div>

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
