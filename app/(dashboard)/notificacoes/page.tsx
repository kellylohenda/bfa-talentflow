'use client'

import { useState } from 'react'
import { useRole } from '@/lib/useRole'
import { talents } from '@/lib/data'
import Avatar from '@/components/ui/Avatar'
import Pill from '@/components/ui/Pill'
import KPI from '@/components/ui/KPI'
import Modal from '@/components/ui/Modal'
import Icon from '@/components/ui/Icon'

type NotifTipo = 'info' | 'alerta' | 'prazo' | 'convocatoria' | 'aprovacao'
type NotifTarget = 'todos' | 'bolseiros' | 'estagiarios' | 'mentores' | 'individual'

interface SentNotif {
  id: string
  titulo: string
  mensagem: string
  tipo: NotifTipo
  target: NotifTarget
  targetName: string
  sentAt: string
  sentBy: string
  reads: number
  total: number
}

const TIPO_META: Record<NotifTipo, { label: string; tone: 'info' | 'warn' | 'danger' | 'success' | 'neutral'; icon: string }> = {
  info:         { label: 'Informação',   tone: 'info',    icon: 'bell'    },
  alerta:       { label: 'Alerta',       tone: 'warn',    icon: 'alert'   },
  prazo:        { label: 'Prazo',        tone: 'danger',  icon: 'clock'   },
  convocatoria: { label: 'Convocatória', tone: 'neutral', icon: 'calendar'},
  aprovacao:    { label: 'Aprovação',    tone: 'success', icon: 'check'   },
}

const SEED_NOTIFS: SentNotif[] = [
  {
    id: 'N-001', titulo: 'Prazo de submissão de relatórios', tipo: 'prazo',
    mensagem: 'Lembrete: o prazo para submissão dos relatórios Q1 é 10 de Maio. Por favor, submeta os documentos através do portal.',
    target: 'todos', targetName: 'Todos os participantes',
    sentAt: '2026-05-05 09:00', sentBy: 'Mariana Quissama', reads: 18, total: 24,
  },
  {
    id: 'N-002', titulo: 'Sessão de avaliação intercalar', tipo: 'convocatoria',
    mensagem: 'A sessão de avaliação intercalar Q2 decorrerá no dia 19 de Maio, das 09h às 17h, na Sala de Avaliações — RH, Piso 4. Presença obrigatória.',
    target: 'estagiarios', targetName: 'Estagiários',
    sentAt: '2026-05-04 14:30', sentBy: 'Mariana Quissama', reads: 8, total: 10,
  },
  {
    id: 'N-003', titulo: 'Actualização do portal — nova secção de agenda', tipo: 'info',
    mensagem: 'O portal foi actualizado com uma nova secção de Agenda & Workshops. Explore os próximos eventos e inscreva-se nas actividades disponíveis.',
    target: 'todos', targetName: 'Todos os participantes',
    sentAt: '2026-05-02 10:00', sentBy: 'Mariana Quissama', reads: 22, total: 24,
  },
  {
    id: 'N-004', titulo: 'Avaliação 360° pendente', tipo: 'alerta',
    mensagem: 'Tem avaliações pendentes no ciclo Q2 2026. Por favor, submeta as avaliações dos seus mentorandos até 31 de Maio.',
    target: 'mentores', targetName: 'Mentores',
    sentAt: '2026-05-01 08:00', sentBy: 'Mariana Quissama', reads: 5, total: 7,
  },
  {
    id: 'N-005', titulo: 'Bolsa aprovada — renovação Q3', tipo: 'aprovacao',
    mensagem: 'A sua bolsa para Q3 2026 foi aprovada. O processamento do pagamento ocorrerá até 1 de Julho.',
    target: 'individual', targetName: 'Lwini Capemba',
    sentAt: '2026-04-28 16:45', sentBy: 'Mariana Quissama', reads: 1, total: 1,
  },
]

const MENTOR_NAME = 'Edmilson Cardoso'
const mentorMenteeIds = ['T-1042', 'T-1048', 'T-1058']

export default function NotificacoesPage() {
  const role = useRole()
  const isMentor = role === 'mentor'
  const isRH = role === 'rh' || role === 'direcao'

  const [notifs, setNotifs] = useState<SentNotif[]>(SEED_NOTIFS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    titulo: '',
    mensagem: '',
    tipo: 'info' as NotifTipo,
    target: 'todos' as NotifTarget,
    talentId: '',
  })

  const mentorMentees = talents.filter(t => mentorMenteeIds.includes(t.id))
  const targetOptions: { value: NotifTarget; label: string }[] = isMentor
    ? [{ value: 'individual', label: 'Mentorado específico' }]
    : [
        { value: 'todos',       label: 'Todos os participantes' },
        { value: 'bolseiros',   label: 'Apenas bolseiros' },
        { value: 'estagiarios', label: 'Apenas estagiários' },
        { value: 'mentores',    label: 'Apenas mentores' },
        { value: 'individual',  label: 'Participante específico' },
      ]

  const myName = isMentor ? MENTOR_NAME : 'Mariana Quissama'

  const myNotifs = isMentor
    ? notifs.filter(n => n.sentBy === MENTOR_NAME || n.sentBy === 'Mariana Quissama')
    : notifs

  const totalSent = myNotifs.length
  const totalReads = myNotifs.reduce((s, n) => s + n.reads, 0)
  const totalRecipients = myNotifs.reduce((s, n) => s + n.total, 0)
  const readRate = totalRecipients > 0 ? Math.round((totalReads / totalRecipients) * 100) : 0

  const resolveTargetName = () => {
    if (form.target === 'individual') {
      const t = talents.find(t => t.id === form.talentId)
      return t?.name ?? 'Participante'
    }
    return targetOptions.find(o => o.value === form.target)?.label ?? form.target
  }

  const handleSend = () => {
    if (!form.titulo.trim() || !form.mensagem.trim()) return
    const now = new Date()
    const sentAt = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    const targetTotal = form.target === 'individual' ? 1
      : form.target === 'todos' ? 24
      : form.target === 'bolseiros' ? 9
      : form.target === 'estagiarios' ? 10
      : form.target === 'mentores' ? 7
      : 1
    const newNotif: SentNotif = {
      id: `N-${String(notifs.length + 1).padStart(3, '0')}`,
      titulo: form.titulo,
      mensagem: form.mensagem,
      tipo: form.tipo,
      target: form.target,
      targetName: resolveTargetName(),
      sentAt,
      sentBy: myName,
      reads: 0,
      total: targetTotal,
    }
    setNotifs(prev => [newNotif, ...prev])
    setShowModal(false)
    setForm({ titulo: '', mensagem: '', tipo: 'info', target: 'todos', talentId: '' })
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Notificações</h1>
          <p className="page-subtitle">
            {isMentor ? 'Enviar comunicações aos seus mentorandos' : 'Gestão e envio de notificações para participantes'}
          </p>
        </div>
        {(isRH || isMentor) && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Icon name="bell" size={14} />
            Nova notificação
          </button>
        )}
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Enviadas" value={totalSent} sub="Total de notificações" icon="bell" />
        <KPI label="Leituras" value={totalReads} sub="Confirmadas" deltaTone="up" icon="check" />
        <KPI label="Taxa de leitura" value={`${readRate}%`} sub="Média geral" deltaTone={readRate > 70 ? 'up' : 'flat'} icon="trending" />
        <KPI label="Destinatários únicos" value={totalRecipients} sub="Total acumulado" icon="users" />
      </div>

      <div className="card">
        <div className="card-head">
          <span className="card-title">Histórico de notificações</span>
          <Pill tone="neutral">{myNotifs.length} notificações</Pill>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {myNotifs.map((n, i) => {
            const meta = TIPO_META[n.tipo]
            const pct = n.total > 0 ? Math.round((n.reads / n.total) * 100) : 0
            return (
              <div key={n.id} style={{ padding: '16px 0', borderBottom: i < myNotifs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <Pill tone={meta.tone} dot={false}>{meta.label}</Pill>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{n.titulo}</div>
                      <div style={{ fontSize: 12, opacity: 0.65, lineHeight: 1.5 }}>{n.mensagem}</div>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right', marginLeft: 16 }}>
                    <div style={{ fontSize: 11, opacity: 0.45 }}>{n.sentAt}</div>
                    <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>por {n.sentBy}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="users" size={12} />
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{n.targetName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{n.reads}/{n.total} leituras</span>
                    <div style={{ width: 60, height: 4, borderRadius: 4, background: 'var(--surface-2)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pct > 70 ? '#22c55e' : pct > 40 ? '#f59e0b' : '#ef4444', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 11, opacity: 0.45 }}>{pct}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <Modal title="Nova notificação" onClose={() => setShowModal(false)} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Título *</label>
              <input className="input" style={{ width: '100%' }} placeholder="Ex: Prazo de submissão" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Tipo</label>
                <select className="select" style={{ width: '100%' }} value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as NotifTipo }))}>
                  {(Object.entries(TIPO_META) as [NotifTipo, typeof TIPO_META[NotifTipo]][]).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Destinatário</label>
                <select className="select" style={{ width: '100%' }} value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value as NotifTarget, talentId: '' }))}>
                  {targetOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            {form.target === 'individual' && (
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Participante *</label>
                <select className="select" style={{ width: '100%' }} value={form.talentId} onChange={e => setForm(f => ({ ...f, talentId: e.target.value }))}>
                  <option value="">Seleccionar...</option>
                  {(isMentor ? mentorMentees : talents).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Mensagem *</label>
              <textarea
                className="input"
                rows={4}
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Escreva a mensagem que será enviada aos destinatários..."
                value={form.mensagem}
                onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
              />
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--surface-2)', fontSize: 12, opacity: 0.7 }}>
              <Icon name="bell" size={12} /> Esta notificação aparecerá no sino de notificações de {form.target === 'individual' ? 'um participante' : `todos os ${resolveTargetName().toLowerCase()}`}.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                disabled={!form.titulo.trim() || !form.mensagem.trim() || (form.target === 'individual' && !form.talentId)}
                onClick={handleSend}
              >
                <Icon name="bell" size={14} />
                Enviar notificação
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
