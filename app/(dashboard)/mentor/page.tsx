'use client'
import { useState } from 'react'
import { talents, tasks as initialTasks, absences, volunteers, hoursEntries, volunteerActivities } from '@/lib/data'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Avatar from '@/components/ui/Avatar'
import Bar from '@/components/ui/Bar'
import Modal from '@/components/ui/Modal'
import Icon from '@/components/ui/Icon'
import type { Task, TaskStatus } from '@/types'

const MY_MENTOR      = 'Edmilson Cardoso'
const MY_MENTEES     = talents.filter(t => t.mentor === MY_MENTOR)
const MENTEE_IDS     = MY_MENTEES.map(m => m.id)
const MY_VOLUNTEERS  = volunteers.filter(v => v.mentor === MY_MENTOR)
const MY_VOL_IDS     = MY_VOLUNTEERS.map(v => v.id)

const AREA_LABEL: Record<string, string> = {
  saude: 'Saúde', educacao: 'Educação', ambiente: 'Ambiente', social: 'Social', cultura: 'Cultura',
}
const AREA_COLOR: Record<string, string> = {
  saude: '#EF4444', educacao: '#3B82F6', ambiente: '#10B981', social: '#F59E0B', cultura: '#8B5CF6',
}

// ── Sessions ──────────────────────────────────────────────────────────────────
interface MentorSession {
  id: string; date: string; time: string; mentee: string; menteeId: string
  topic: string; dur: number; status: 'upcoming' | 'done'; notes: string
}
const INIT_SESSIONS: MentorSession[] = [
  { id: 'S-001', date: '2026-05-08', time: '15:00', mentee: 'Lwini Capemba',   menteeId: 'T-1042', topic: 'Análise de crédito e plano Q2',       dur: 60, status: 'upcoming', notes: '' },
  { id: 'S-002', date: '2026-05-06', time: '10:00', mentee: 'Kiala Domingos',  menteeId: 'T-1048', topic: 'Revisão do relatório de estágio',     dur: 45, status: 'upcoming', notes: '' },
  { id: 'S-003', date: '2026-04-30', time: '14:00', mentee: 'Lwini Capemba',   menteeId: 'T-1042', topic: 'Balanço mensal e próximos objectivos', dur: 60, status: 'done',     notes: 'Muito boa evolução. Definidos 3 objectivos para Maio.' },
  { id: 'S-004', date: '2026-04-22', time: '11:00', mentee: 'Alberto Massano', menteeId: 'T-1047', topic: 'Plano de carreira — transição',        dur: 90, status: 'done',     notes: 'Exploradas opções na Banca Privada e TI.' },
  { id: 'S-005', date: '2026-04-15', time: '15:00', mentee: 'Kiala Domingos',  menteeId: 'T-1048', topic: 'Rotação Banca Privada',               dur: 60, status: 'done',     notes: '' },
]

// ── Evaluations ───────────────────────────────────────────────────────────────
const EVAL_COMPS = [
  { key: 'atitude',     label: 'Atitude e Comprometimento' },
  { key: 'tecnico',     label: 'Desempenho Técnico' },
  { key: 'iniciativa',  label: 'Iniciativa e Proactividade' },
  { key: 'comunicacao', label: 'Comunicação' },
  { key: 'equipa',      label: 'Trabalho em Equipa' },
]
const REC_OPTS: { value: string; label: string; tone: 'success' | 'info' | 'warn' | 'danger' }[] = [
  { value: 'excelente',    label: 'Excelente — integração recomendada', tone: 'success' },
  { value: 'continuar',    label: 'Continuar programa normalmente',     tone: 'info' },
  { value: 'desenvolvimento', label: 'Plano de desenvolvimento activo', tone: 'warn' },
  { value: 'risco',        label: 'Em risco — acção necessária',        tone: 'danger' },
]
interface MentorEval {
  id: string; menteeId: string; menteeName: string; cycle: string
  scores: Record<string, number>; notes: string; recommendation: string; submittedAt: string
}
const INIT_EVALS: MentorEval[] = [
  { id: 'ME-001', menteeId: 'T-1042', menteeName: 'Lwini Capemba',   cycle: 'Q1 2026', scores: { atitude: 5, tecnico: 4, iniciativa: 5, comunicacao: 4, equipa: 5 }, notes: 'Excelente. Candidata natural à integração no BFA.',     recommendation: 'excelente',    submittedAt: '2026-04-15' },
  { id: 'ME-002', menteeId: 'T-1048', menteeName: 'Kiala Domingos',  cycle: 'Q1 2026', scores: { atitude: 4, tecnico: 4, iniciativa: 3, comunicacao: 4, equipa: 4 }, notes: 'Bom progresso. Deve desenvolver mais a iniciativa.',   recommendation: 'continuar',    submittedAt: '2026-04-16' },
  { id: 'ME-003', menteeId: 'T-1047', menteeName: 'Alberto Massano', cycle: 'Q1 2026', scores: { atitude: 3, tecnico: 3, iniciativa: 2, comunicacao: 3, equipa: 4 }, notes: 'Período difícil. Plano de desenvolvimento em curso.',  recommendation: 'desenvolvimento', submittedAt: '2026-04-17' },
]
const CURRENT_CYCLE = 'Q2 2026'

// ── Tasks helpers ─────────────────────────────────────────────────────────────
const TASK_CATEGORIES = ['Relatório', 'Formação', 'Documento', 'PDI', 'Apresentação', 'Avaliação']
function taskTone(s: TaskStatus): 'success' | 'warn' | 'danger' | 'neutral' {
  return s === 'done' ? 'success' : s === 'overdue' ? 'danger' : s === 'in_progress' ? 'warn' : 'neutral'
}
function taskLabel(s: TaskStatus) {
  return s === 'done' ? 'Concluída' : s === 'overdue' ? 'Atrasada' : s === 'in_progress' ? 'Em curso' : 'Pendente'
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MentorPage() {
  type Tab = 'dashboard' | 'sessoes' | 'avaliacoes' | 'tarefas' | 'faltas' | 'mentorandos' | 'voluntarios'
  const [tab, setTab] = useState<Tab>('dashboard')

  // Sessions
  const [sessions, setSessions]     = useState<MentorSession[]>(INIT_SESSIONS)
  const [newSessionModal, setNS]    = useState(false)
  const [sessionForm, setSF]        = useState({ mentee: MY_MENTEES[0]?.name ?? '', menteeId: MY_MENTEES[0]?.id ?? '', date: '2026-05-12', time: '15:00', topic: '', dur: 60 })
  const [sessionNoteModal, setSNM]  = useState<MentorSession | null>(null)
  const [noteText, setNoteText]     = useState('')

  // Evaluations
  const [evals, setEvals]           = useState<MentorEval[]>(INIT_EVALS)
  const [evalModal, setEvalModal]   = useState<typeof MY_MENTEES[0] | null>(null)
  const [evalScores, setEvalScores] = useState<Record<string, number>>({})
  const [evalNotes, setEvalNotes]   = useState('')
  const [evalRec, setEvalRec]       = useState('continuar')

  // Tasks
  const [taskList, setTaskList]     = useState<Task[]>(initialTasks.filter(t => MENTEE_IDS.includes(t.talentId)))
  const [newTaskModal, setNTM]      = useState(false)
  const [taskForm, setTF]           = useState({ title: '', description: '', talentId: '', priority: 'alta', category: 'Relatório', dueDate: '' })

  // Faltas
  const [myAbsences, setMyAbsences] = useState(absences.filter(a => MENTEE_IDS.includes(a.talentId)))
  const [absModal, setAbsModal]     = useState<typeof myAbsences[0] | null>(null)
  const [mentorNote, setMentorNote] = useState('')

  // Voluntários
  const [volEntries, setVolEntries]     = useState(hoursEntries.filter(h => MY_VOL_IDS.includes(h.voluntarioId)))
  const [volNoteModal, setVolNoteModal] = useState<typeof MY_VOLUNTEERS[0] | null>(null)
  const [volNote, setVolNote]           = useState('')
  const [volNotes, setVolNotes]         = useState<Record<string, string>>({})
  const [regHorasModal, setRegHorasModal] = useState<typeof MY_VOLUNTEERS[0] | null>(null)
  const [regHorasForm, setRegHorasForm]   = useState({ actividadeId: '', horas: 4, data: '' })

  // Derived
  const upcoming       = sessions.filter(s => s.status === 'upcoming')
  const pendingTasks   = taskList.filter(t => t.status !== 'done')
  const overdueTasks   = taskList.filter(t => t.status === 'overdue')
  const pendingAbsences= myAbsences.filter(a => a.status === 'pending')
  const evalsDue       = MY_MENTEES.filter(m => !evals.some(e => e.menteeId === m.id && e.cycle === CURRENT_CYCLE))
  const atRisk         = MY_MENTEES.filter(m => m.riskScore > 55)

  // Notifications derived
  const lowActivityVols = MY_VOLUNTEERS.filter(v => v.status === 'activo' && v.totalHoras < 20)
  const notifications = [
    ...evalsDue.map(m    => ({ id: `ev-${m.id}`,  type: 'eval',    icon: 'star',     tone: 'warn'    as const, text: `Avaliação ${CURRENT_CYCLE} pendente — ${m.name}`,           action: () => { setTab('avaliacoes'); setEvalModal(m) } })),
    ...overdueTasks.map(t => ({ id: `tk-${t.id}`,  type: 'task',    icon: 'clock',    tone: 'danger'  as const, text: `Tarefa em atraso — ${t.talentName}: ${t.title}`,            action: () => setTab('tarefas') })),
    ...atRisk.map(m      => ({ id: `rk-${m.id}`,  type: 'risk',    icon: 'alert',    tone: 'danger'  as const, text: `${m.name} em risco (score ${m.riskScore}) — plano activo`,  action: () => setTab('mentorandos') })),
    ...pendingAbsences.map(a => ({ id: `ab-${a.id}`, type: 'absence', icon: 'calendar', tone: 'flat'   as const, text: `Falta pendente de ${a.talentName} — ${a.date}`,            action: () => setTab('faltas') })),
    ...upcoming.map(s    => ({ id: `ss-${s.id}`,  type: 'session', icon: 'briefcase', tone: 'info'   as const, text: `Sessão com ${s.mentee} — ${s.date} às ${s.time}`,           action: () => setTab('sessoes') })),
    ...lowActivityVols.map(v => ({ id: `vl-${v.id}`, type: 'volunteer', icon: 'users', tone: 'flat' as const, text: `Voluntário com baixa actividade — ${v.nome} (${v.totalHoras}h)`, action: () => setTab('voluntarios') })),
  ]

  // Handlers
  const addSession = () => {
    if (!sessionForm.topic.trim()) return
    setSessions(p => [{ id: `S-${String(p.length+1).padStart(3,'0')}`, ...sessionForm, status: 'upcoming', notes: '' }, ...p])
    setSF({ mentee: MY_MENTEES[0]?.name ?? '', menteeId: MY_MENTEES[0]?.id ?? '', date: '2026-05-12', time: '15:00', topic: '', dur: 60 })
    setNS(false)
  }

  const markSessionDone = (id: string) => {
    setSessions(p => p.map(s => s.id === id ? { ...s, status: 'done' as const } : s))
  }

  const saveSessionNote = () => {
    if (!sessionNoteModal) return
    setSessions(p => p.map(s => s.id === sessionNoteModal.id ? { ...s, notes: noteText } : s))
    setSNM(null); setNoteText('')
  }

  const submitEval = () => {
    if (!evalModal || Object.keys(evalScores).length < EVAL_COMPS.length) return
    const newEval: MentorEval = {
      id: `ME-${String(evals.length+1).padStart(3,'0')}`,
      menteeId: evalModal.id, menteeName: evalModal.name,
      cycle: CURRENT_CYCLE, scores: evalScores,
      notes: evalNotes, recommendation: evalRec,
      submittedAt: new Date().toISOString().slice(0,10),
    }
    setEvals(p => [newEval, ...p])
    setEvalModal(null); setEvalScores({}); setEvalNotes(''); setEvalRec('continuar')
  }

  const addTask = () => {
    if (!taskForm.title.trim() || !taskForm.talentId || !taskForm.dueDate) return
    const mentee = MY_MENTEES.find(m => m.id === taskForm.talentId)
    const t: Task = {
      id: `TK-M${String(taskList.length+1).padStart(3,'0')}`,
      title: taskForm.title, description: taskForm.description,
      talentId: taskForm.talentId, talentName: mentee?.name ?? '',
      assignedBy: MY_MENTOR, assignedByRole: 'mentor',
      category: taskForm.category,
      priority: taskForm.priority as 'alta' | 'média' | 'baixa',
      status: 'pending', dueDate: taskForm.dueDate, completedAt: null,
    }
    setTaskList(p => [t, ...p])
    setTF({ title: '', description: '', talentId: '', priority: 'alta', category: 'Relatório', dueDate: '' })
    setNTM(false)
  }

  const saveAbsenceNote = () => {
    if (!absModal) return
    setMyAbsences(p => p.map(a => a.id === absModal.id ? { ...a, mentorNote } : a))
    setAbsModal(null); setMentorNote('')
  }

  const saveVolNote = () => {
    if (!volNoteModal) return
    setVolNotes(p => ({ ...p, [volNoteModal.id]: volNote }))
    setVolNoteModal(null); setVolNote('')
  }

  const registarHoras = () => {
    if (!regHorasModal || !regHorasForm.actividadeId || !regHorasForm.data) return
    const act = volunteerActivities.find(a => a.id === regHorasForm.actividadeId)
    const entry = {
      id: `H-M${String(volEntries.length + 1).padStart(3, '0')}`,
      voluntarioId: regHorasModal.id,
      voluntarioNome: regHorasModal.nome,
      actividadeId: regHorasForm.actividadeId,
      actividadeNome: act?.nome ?? '',
      data: regHorasForm.data,
      horas: regHorasForm.horas,
      validado: true,
      validadoPor: MY_MENTOR,
    }
    setVolEntries(p => [entry, ...p])
    setRegHorasModal(null)
    setRegHorasForm({ actividadeId: '', horas: 4, data: '' })
  }

  const avgScore = (scores: Record<string,number>) => {
    const vals = Object.values(scores)
    return vals.length ? Math.round(vals.reduce((s,v) => s+v, 0) / vals.length * 20) : 0
  }

  const SCORE_COLOR = (n: number) => n >= 4 ? 'var(--success)' : n >= 3 ? 'var(--warn)' : 'var(--danger)'

  return (
    <div className="section">
      {/* Header */}
      <div className="page-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={MY_MENTOR} size={40} />
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>Portal do Mentor</h1>
            <p className="page-subtitle" style={{ margin: 0 }}>{MY_MENTOR} · Banca de Empresas</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {notifications.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--warn-bg, #fef3c7)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>
              <Icon name="bell" size={14} />
              {notifications.length} alerta{notifications.length !== 1 ? 's' : ''}
            </div>
          )}
          <button className="btn btn-primary" onClick={() => setNS(true)}>
            <Icon name="plus" size={14} />
            Nova Sessão
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid cols-6" style={{ marginBottom: 24 }}>
        <KPI label="Bolseiros" value={MY_MENTEES.length} icon="users" sub="Programa talentos" />
        <KPI label="Voluntários" value={MY_VOLUNTEERS.length} icon="users" sub="Voluntariado" />
        <KPI label="Sessões realizadas" value={sessions.filter(s => s.status === 'done').length} icon="check" delta="Este mês" deltaTone="up" />
        <KPI label="Avaliações pendentes" value={evalsDue.length} icon="star" delta={evalsDue.length > 0 ? CURRENT_CYCLE : 'Em dia'} deltaTone={evalsDue.length > 0 ? 'flat' : 'up'} />
        <KPI label="Tarefas em atraso" value={overdueTasks.length} icon="clock" delta={overdueTasks.length > 0 ? 'Atenção' : 'OK'} deltaTone={overdueTasks.length > 0 ? 'down' : 'up'} />
        <KPI label="Faltas pendentes" value={pendingAbsences.length} icon="calendar" delta={pendingAbsences.length > 0 ? 'Rever' : 'OK'} deltaTone={pendingAbsences.length > 0 ? 'flat' : 'up'} />
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {([
          ['dashboard',    'Visão Geral'],
          ['sessoes',      'Sessões'],
          ['avaliacoes',   `Avaliações${evalsDue.length > 0 ? ` (${evalsDue.length})` : ''}`],
          ['tarefas',      `Tarefas${overdueTasks.length > 0 ? ` (${overdueTasks.length})` : ''}`],
          ['faltas',       `Faltas${pendingAbsences.length > 0 ? ` (${pendingAbsences.length})` : ''}`],
          ['mentorandos',  'Bolseiros'],
          ['voluntarios',  `Voluntários (${MY_VOLUNTEERS.length})`],
        ] as [Tab, string][]).map(([key, lbl]) => (
          <button key={key} className={`tab ${tab === key ? 'tab-active' : ''}`} onClick={() => setTab(key)}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ────────────────────────────────────────────────────────── */}
      {tab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Alerts */}
          {notifications.length > 0 && (
            <div className="card">
              <div className="card-head"><span className="card-title">Alertas e notificações</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={n.action}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                      background: n.tone === 'danger' ? 'var(--danger-bg, #fee2e2)' : n.tone === 'warn' ? 'var(--warn-bg, #fef3c7)' : 'var(--surface-2)',
                      borderRadius: 8, cursor: 'pointer',
                      borderLeft: `3px solid ${n.tone === 'danger' ? 'var(--danger)' : n.tone === 'warn' ? 'var(--warn)' : 'var(--primary)'}`,
                    }}
                  >
                    <Icon name={n.icon} size={15} style={{ opacity: 0.7, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, flex: 1 }}>{n.text}</span>
                    <Icon name="arrowRight" size={13} style={{ opacity: 0.35 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Próximas sessões */}
            <div className="card">
              <div className="card-head">
                <span className="card-title">Próximas Sessões</span>
                <button className="btn btn-sm btn-primary" onClick={() => setNS(true)}>+ Agendar</button>
              </div>
              {upcoming.length === 0 ? (
                <p style={{ opacity: 0.45, fontSize: 13, marginTop: 8 }}>Nenhuma sessão agendada.</p>
              ) : upcoming.map(s => (
                <div key={s.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={s.mentee} size={24} />
                      <strong style={{ fontSize: 13 }}>{s.mentee}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm" style={{ fontSize: 11 }} onClick={() => { setSNM(s); setNoteText(s.notes) }}>
                        <Icon name="doc" size={12} /> Notas
                      </button>
                      <button className="btn btn-sm btn-primary" style={{ fontSize: 11 }} onClick={() => markSessionDone(s.id)}>
                        Realizada
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.55 }}>{s.date} às {s.time} · {s.dur} min</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{s.topic}</div>
                </div>
              ))}
            </div>

            {/* Bolseiros — desempenho + avaliação */}
            <div className="card" style={{ borderTop: '3px solid #3B82F6' }}>
              <div className="card-head">
                <div>
                  <span className="card-title">Bolseiros — Programa de Talentos</span>
                  <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>Desenvolvimento profissional · Bolsa de estudo · Avaliação 360°</div>
                </div>
                <Pill tone="info" dot={false}>BFA Talentos</Pill>
              </div>
              {MY_MENTEES.map(m => {
                const evalDue = !evals.some(e => e.menteeId === m.id && e.cycle === CURRENT_CYCLE)
                return (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <Avatar name={m.name} size={30} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                        <span style={{ fontSize: 11, opacity: 0.5 }}>{m.program.toUpperCase()}</span>
                        {m.riskScore > 55 && <Pill tone="danger">Risco</Pill>}
                        {evalDue && <Pill tone="warn">Aval. pendente</Pill>}
                      </div>
                      <Bar value={m.perf} tone={m.perf >= 85 ? 'success' : m.perf >= 70 ? 'warn' : 'danger'} />
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{m.perf}%</div>
                      <div style={{ fontSize: 10, opacity: 0.5 }}>GPA {m.gpa}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Voluntários — horas e actividade */}
            <div className="card" style={{ borderTop: '3px solid #10B981' }}>
              <div className="card-head">
                <div>
                  <span className="card-title">Voluntários — Voluntariado Comunitário</span>
                  <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>Responsabilidade social · Horas por actividade · Sem bolsa</div>
                </div>
                <Pill tone="success" dot={false}>CSR</Pill>
              </div>
              {MY_VOLUNTEERS.map(v => {
                const vHours = volEntries.filter(h => h.voluntarioId === v.id).reduce((s, h) => s + h.horas, 0) + v.totalHoras
                return (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <Avatar name={v.nome} size={30} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{v.nome}</span>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: AREA_COLOR[v.areaActuacao] }} />
                        <span style={{ fontSize: 11, opacity: 0.6 }}>{AREA_LABEL[v.areaActuacao]}</span>
                        {v.totalHoras < 20 && <Pill tone="warn">Baixa actividade</Pill>}
                      </div>
                      <Bar value={Math.min(vHours / 100 * 100, 100)} tone={vHours >= 40 ? 'success' : vHours >= 20 ? 'warn' : 'danger'} />
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{vHours}h</div>
                      <div style={{ fontSize: 10, opacity: 0.5 }}>total horas</div>
                    </div>
                  </div>
                )
              })}
              {MY_VOLUNTEERS.length === 0 && <p style={{ fontSize: 13, opacity: 0.45 }}>Sem voluntários atribuídos.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── SESSÕES ───────────────────────────────────────────────────────────── */}
      {tab === 'sessoes' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Todas as sessões</span>
            <button className="btn btn-sm btn-primary" onClick={() => setNS(true)}>+ Nova Sessão</button>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Data</th><th>Hora</th><th>Mentorando</th><th>Tema</th><th>Dur.</th><th>Estado</th><th>Notas</th><th>Acção</th></tr>
            </thead>
            <tbody>
              {sessions.sort((a,b) => b.date.localeCompare(a.date)).map(s => (
                <tr key={s.id}>
                  <td style={{ fontSize: 12 }}>{s.date}</td>
                  <td style={{ fontSize: 12 }}>{s.time}</td>
                  <td>
                    <div className="cell-person">
                      <Avatar name={s.mentee} size={24} />
                      <span style={{ fontSize: 13 }}>{s.mentee}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{s.topic}</td>
                  <td style={{ fontSize: 12 }}>{s.dur} min</td>
                  <td><Pill tone={s.status === 'upcoming' ? 'info' : 'success'}>{s.status === 'upcoming' ? 'Agendada' : 'Realizada'}</Pill></td>
                  <td style={{ fontSize: 12, opacity: 0.6, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.notes || <span style={{ opacity: 0.4 }}>—</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-sm" onClick={() => { setSNM(s); setNoteText(s.notes) }}>
                        <Icon name="doc" size={12} />
                      </button>
                      {s.status === 'upcoming' && (
                        <button className="btn btn-sm btn-primary" style={{ fontSize: 11 }} onClick={() => markSessionDone(s.id)}>Realizada</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── AVALIAÇÕES ────────────────────────────────────────────────────────── */}
      {tab === 'avaliacoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status by mentee for current cycle */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Ciclo actual — {CURRENT_CYCLE}</span>
              <span style={{ fontSize: 12, opacity: 0.5 }}>Prazo: 31 Mai 2026</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 8 }}>
              {MY_MENTEES.map(m => {
                const submitted = evals.find(e => e.menteeId === m.id && e.cycle === CURRENT_CYCLE)
                return (
                  <div key={m.id} style={{
                    padding: '14px 16px', borderRadius: 10,
                    border: `1px solid ${submitted ? 'var(--success)' : 'var(--warn)'}`,
                    background: submitted ? 'var(--success-bg, #d1fae5)' : 'var(--warn-bg, #fef3c7)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Avatar name={m.name} size={28} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: 11, opacity: 0.6 }}>{m.program.toUpperCase()}</div>
                      </div>
                    </div>
                    {submitted ? (
                      <>
                        <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginBottom: 4 }}>
                          ✓ Submetida em {submitted.submittedAt}
                        </div>
                        <div style={{ fontSize: 11, opacity: 0.7 }}>
                          Nota média: {avgScore(submitted.scores)}% · {REC_OPTS.find(r => r.value === submitted.recommendation)?.label.split(' —')[0]}
                        </div>
                      </>
                    ) : (
                      <button className="btn btn-sm btn-primary" style={{ width: '100%' }} onClick={() => { setEvalModal(m); setEvalScores({}); setEvalNotes(''); setEvalRec('continuar') }}>
                        Avaliar agora
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Evaluation history */}
          <div className="card">
            <div className="card-head"><span className="card-title">Histórico de avaliações</span></div>
            <table className="tbl">
              <thead>
                <tr><th>Mentorando</th><th>Ciclo</th><th>Nota média</th><th>Recomendação</th><th>Notas</th><th>Data</th></tr>
              </thead>
              <tbody>
                {evals.map(e => {
                  const rec = REC_OPTS.find(r => r.value === e.recommendation)
                  return (
                    <tr key={e.id}>
                      <td>
                        <div className="cell-person">
                          <Avatar name={e.menteeName} size={24} />
                          <span style={{ fontSize: 13 }}>{e.menteeName}</span>
                        </div>
                      </td>
                      <td><Pill tone="neutral" dot={false}>{e.cycle}</Pill></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 60 }}><Bar value={avgScore(e.scores)} tone={avgScore(e.scores) >= 80 ? 'success' : avgScore(e.scores) >= 60 ? 'warn' : 'danger'} /></div>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{avgScore(e.scores)}%</span>
                        </div>
                      </td>
                      <td>{rec && <Pill tone={rec.tone} dot={false}>{rec.label.split(' —')[0]}</Pill>}</td>
                      <td style={{ fontSize: 12, opacity: 0.6, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.notes || <span style={{ opacity: 0.4 }}>—</span>}
                      </td>
                      <td style={{ fontSize: 12, opacity: 0.6 }}>{e.submittedAt}</td>
                    </tr>
                  )
                })}
                {evals.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px 0', opacity: 0.4, fontSize: 13 }}>Sem avaliações submetidas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAREFAS ───────────────────────────────────────────────────────────── */}
      {tab === 'tarefas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <span className="card-title">Tarefas atribuídas</span>
              <button className="btn btn-sm btn-primary" onClick={() => setNTM(true)}>
                <Icon name="plus" size={13} /> Nova Tarefa
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr><th>Tarefa</th><th>Mentorando</th><th>Categoria</th><th>Prioridade</th><th>Prazo</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {taskList.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{t.title}</div>
                      {t.description && <div style={{ fontSize: 11, opacity: 0.55 }}>{t.description.slice(0, 70)}{t.description.length > 70 ? '…' : ''}</div>}
                    </td>
                    <td>
                      <div className="cell-person">
                        <Avatar name={t.talentName} size={22} />
                        <span style={{ fontSize: 13 }}>{t.talentName}</span>
                      </div>
                    </td>
                    <td><Pill tone="neutral" dot={false}>{t.category}</Pill></td>
                    <td><Pill tone={t.priority === 'alta' ? 'danger' : t.priority === 'média' ? 'warn' : 'neutral'}>{t.priority}</Pill></td>
                    <td style={{ fontSize: 12, color: t.status === 'overdue' ? 'var(--danger)' : undefined }}>{t.dueDate}</td>
                    <td><Pill tone={taskTone(t.status)} dot={false}>{taskLabel(t.status)}</Pill></td>
                  </tr>
                ))}
                {taskList.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px 0', opacity: 0.4, fontSize: 13 }}>Sem tarefas atribuídas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── FALTAS ────────────────────────────────────────────────────────────── */}
      {tab === 'faltas' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Faltas dos meus mentorandos</span>
            <span style={{ fontSize: 12, opacity: 0.5 }}>{myAbsences.length} registos</span>
          </div>
          {myAbsences.length === 0 ? (
            <p style={{ padding: '24px 0', fontSize: 13, opacity: 0.45 }}>Nenhuma falta registada para os seus mentorandos.</p>
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>Mentorando</th><th>Tipo</th><th>Data</th><th>Dias</th><th>Motivo</th><th>Nota mentor</th><th>Estado</th><th>Acção</th></tr>
              </thead>
              <tbody>
                {myAbsences.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="cell-person">
                        <Avatar name={a.talentName} size={24} />
                        <span style={{ fontSize: 13 }}>{a.talentName}</span>
                      </div>
                    </td>
                    <td><Pill tone={a.type === 'justificada' ? 'info' : 'danger'} dot={false}>{a.type === 'justificada' ? 'Justificada' : 'Injustificada'}</Pill></td>
                    <td style={{ fontSize: 12 }}>{a.date}</td>
                    <td style={{ fontSize: 13 }}>{a.days}</td>
                    <td style={{ fontSize: 12, opacity: 0.7 }}>{a.reason || <span style={{ opacity: 0.4 }}>—</span>}</td>
                    <td style={{ fontSize: 12, opacity: a.mentorNote ? 1 : 0.4, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.mentorNote || '—'}
                    </td>
                    <td><Pill tone={a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'danger' : 'warn'} dot={false}>{a.status === 'approved' ? 'Aprovada' : a.status === 'rejected' ? 'Rejeitada' : 'Pendente'}</Pill></td>
                    <td>
                      <button className="btn btn-sm" onClick={() => { setAbsModal(a); setMentorNote(a.mentorNote ?? '') }}>
                        {a.mentorNote ? 'Editar nota' : 'Adicionar nota'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── MENTORANDOS ───────────────────────────────────────────────────────── */}
      {tab === 'mentorandos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MY_MENTEES.map(m => {
            const mTasks    = taskList.filter(t => t.talentId === m.id)
            const mAbsences = myAbsences.filter(a => a.talentId === m.id)
            const mEvals    = evals.filter(e => e.menteeId === m.id)
            const lastEval  = mEvals[0]
            const evalQ2    = mEvals.find(e => e.cycle === CURRENT_CYCLE)
            return (
              <div key={m.id} className="card" style={{ padding: '20px 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                  <Avatar name={m.name} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{m.name}</span>
                      <Pill tone="neutral" dot={false}>{m.program.toUpperCase()}</Pill>
                      {m.riskScore > 55 && <Pill tone="danger">Em risco</Pill>}
                      {!evalQ2 && <Pill tone="warn">Aval. {CURRENT_CYCLE} pendente</Pill>}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                      {m.university} · {m.course} · {m.dept !== '—' ? m.dept : 'Sem departamento atribuído'}
                    </div>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => { setEvalModal(m); setEvalScores({}); setEvalNotes(''); setEvalRec('continuar') }}>
                    {evalQ2 ? 'Ver avaliação' : `Avaliar — ${CURRENT_CYCLE}`}
                  </button>
                </div>

                {/* Metrics grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                  {[
                    { label: 'Desempenho', val: `${m.perf}%`, bar: m.perf, barTone: m.perf >= 85 ? 'success' : m.perf >= 70 ? 'warn' : 'danger' as 'success' | 'warn' | 'danger' },
                    { label: 'GPA académico', val: `${m.gpa}/20`, bar: m.gpa * 5, barTone: m.gpa >= 16 ? 'success' : m.gpa >= 13 ? 'warn' : 'danger' as 'success' | 'warn' | 'danger' },
                    { label: 'Tarefas concluídas', val: `${mTasks.filter(t => t.status === 'done').length}/${mTasks.length}`, bar: mTasks.length ? mTasks.filter(t => t.status === 'done').length / mTasks.length * 100 : 0, barTone: 'success' as const },
                    { label: 'Risk score', val: `${m.riskScore}`, bar: 100 - m.riskScore, barTone: m.riskScore > 55 ? 'danger' : m.riskScore > 30 ? 'warn' : 'success' as 'success' | 'warn' | 'danger' },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{item.val}</div>
                      <Bar value={item.bar} tone={item.barTone} />
                    </div>
                  ))}
                </div>

                {/* Activity summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {/* Sessions */}
                  <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sessões</div>
                    {sessions.filter(s => s.menteeId === m.id).slice(0, 2).map(s => (
                      <div key={s.id} style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>{s.date}</span>
                        <Pill tone={s.status === 'upcoming' ? 'info' : 'success'} dot={false}>{s.status === 'upcoming' ? 'Agend.' : 'Realiz.'}</Pill>
                      </div>
                    ))}
                    {sessions.filter(s => s.menteeId === m.id).length === 0 && <span style={{ fontSize: 12, opacity: 0.4 }}>Sem sessões</span>}
                  </div>
                  {/* Absences */}
                  <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Faltas</div>
                    {mAbsences.slice(0, 2).map(a => (
                      <div key={a.id} style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>{a.date} ({a.days}d)</span>
                        <Pill tone={a.type === 'justificada' ? 'info' : 'danger'} dot={false}>{a.type === 'justificada' ? 'Just.' : 'Injust.'}</Pill>
                      </div>
                    ))}
                    {mAbsences.length === 0 && <span style={{ fontSize: 12, opacity: 0.4 }}>Sem faltas</span>}
                  </div>
                  {/* Last evaluation */}
                  <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Última avaliação</div>
                    {lastEval ? (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{lastEval.cycle} — {avgScore(lastEval.scores)}%</div>
                        <div style={{ fontSize: 11, opacity: 0.6 }}>{REC_OPTS.find(r => r.value === lastEval.recommendation)?.label.split(' —')[0]}</div>
                      </>
                    ) : <span style={{ fontSize: 12, opacity: 0.4 }}>Sem avaliações</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── VOLUNTÁRIOS ──────────────────────────────────────────────────────── */}
      {tab === 'voluntarios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Context banner */}
          <div style={{
            padding: '14px 18px', borderRadius: 10,
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            border: '1px solid #6ee7b7', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 22 }}>🤝</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#065f46' }}>Voluntários — Responsabilidade Social Corporativa</div>
              <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>
                Ao contrário dos bolseiros (desenvolvimento profissional, bolsas, avaliações 360°), estes voluntários contribuem com o seu tempo em causas sociais e comunitárias. O acompanhamento é feito por horas e actividades.
              </div>
            </div>
          </div>

          {/* Volunteer cards */}
          {MY_VOLUNTEERS.map(v => {
            const vEntries = volEntries.filter(h => h.voluntarioId === v.id)
            const totalH   = vEntries.reduce((s, h) => s + h.horas, 0) + v.totalHoras
            const note     = volNotes[v.id] ?? ''
            return (
              <div key={v.id} className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <Avatar name={v.nome} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{v.nome}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                        background: AREA_COLOR[v.areaActuacao] + '22', color: AREA_COLOR[v.areaActuacao],
                      }}>
                        {AREA_LABEL[v.areaActuacao]}
                      </span>
                      <Pill tone={v.status === 'activo' ? 'success' : v.status === 'desistente' ? 'danger' : 'neutral'} dot={false}>
                        {v.status === 'activo' ? 'Activo' : v.status === 'desistente' ? 'Desistente' : 'Inactivo'}
                      </Pill>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{v.profissao} · {v.instituicao} · {v.provincia}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm" onClick={() => { setVolNoteModal(v); setVolNote(note) }}>
                      <Icon name="doc" size={12} /> Nota
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={() => { setRegHorasModal(v); setRegHorasForm({ actividadeId: '', horas: 4, data: '' }) }}>
                      + Registar horas
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                  <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 4 }}>Total de horas</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{totalH}h</div>
                    <Bar value={Math.min(totalH, 100)} tone={totalH >= 40 ? 'success' : totalH >= 20 ? 'warn' : 'danger'} />
                  </div>
                  <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 4 }}>Registos de horas</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{vEntries.length}</div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>actividades participadas</div>
                  </div>
                  <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 4 }}>Nota do mentor</div>
                    {note ? (
                      <div style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.4 }}>{note.slice(0, 80)}{note.length > 80 ? '…' : ''}</div>
                    ) : (
                      <div style={{ fontSize: 12, opacity: 0.4 }}>Sem nota registada</div>
                    )}
                  </div>
                </div>

                {/* Recent entries */}
                {vEntries.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Últimas actividades</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {vEntries.slice(0, 3).map(e => (
                        <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '6px 8px', background: 'var(--surface-2)', borderRadius: 6 }}>
                          <span style={{ opacity: 0.6, minWidth: 80 }}>{e.data}</span>
                          <span style={{ flex: 1 }}>{e.actividadeNome}</span>
                          <span style={{ fontWeight: 700 }}>{e.horas}h</span>
                          <Pill tone={e.validado ? 'success' : 'warn'} dot={false}>{e.validado ? 'Validado' : 'Pendente'}</Pill>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {MY_VOLUNTEERS.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 32, opacity: 0.45 }}>
              Nenhum voluntário atribuído a este mentor.
            </div>
          )}
        </div>
      )}

      {/* ── MODALS ────────────────────────────────────────────────────────────── */}

      {/* Nova Sessão */}
      {newSessionModal && (
        <Modal title="Agendar Nova Sessão" onClose={() => setNS(false)}
          footer={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setNS(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={addSession} disabled={!sessionForm.topic.trim()}>Agendar</button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Mentorando</label>
              <select className="select" style={{ width: '100%' }}
                value={sessionForm.menteeId}
                onChange={e => { const m = MY_MENTEES.find(x => x.id === e.target.value); setSF(f => ({ ...f, menteeId: e.target.value, mentee: m?.name ?? '' })) }}
              >
                {MY_MENTEES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Data</label>
                <input type="date" className="input" style={{ width: '100%' }} value={sessionForm.date} onChange={e => setSF(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Hora</label>
                <input type="time" className="input" style={{ width: '100%' }} value={sessionForm.time} onChange={e => setSF(f => ({ ...f, time: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Duração</label>
                <select className="select" style={{ width: '100%' }} value={sessionForm.dur} onChange={e => setSF(f => ({ ...f, dur: Number(e.target.value) }))}>
                  {[30,45,60,90].map(n => <option key={n} value={n}>{n} min</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Tema *</label>
              <input className="input" style={{ width: '100%' }} placeholder="Ex: Revisão objectivos Q2" value={sessionForm.topic} onChange={e => setSF(f => ({ ...f, topic: e.target.value }))} />
            </div>
          </div>
        </Modal>
      )}

      {/* Notas de sessão */}
      {sessionNoteModal && (
        <Modal title={`Notas — ${sessionNoteModal.mentee}`} onClose={() => setSNM(null)}>
          <div style={{ marginBottom: 8, fontSize: 13, opacity: 0.6 }}>{sessionNoteModal.date} · {sessionNoteModal.topic}</div>
          <textarea className="input" rows={5} style={{ width: '100%', resize: 'vertical' }} placeholder="Notas da sessão…" value={noteText} onChange={e => setNoteText(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn" onClick={() => setSNM(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={saveSessionNote}>Guardar notas</button>
          </div>
        </Modal>
      )}

      {/* Avaliar mentorando */}
      {evalModal && (
        <Modal title={`Avaliar — ${evalModal.name} · ${CURRENT_CYCLE}`} onClose={() => setEvalModal(null)} width={560}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>Classifique cada competência de 1 (Insuficiente) a 5 (Excelente)</div>
          {EVAL_COMPS.map(comp => {
            const score = evalScores[comp.key] ?? 0
            return (
              <div key={comp.key} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>{comp.label}</label>
                  {score > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: SCORE_COLOR(score) }}>{score}/5</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} className="btn btn-sm" style={{
                      flex: 1, fontWeight: evalScores[comp.key] === n ? 700 : undefined,
                      background: evalScores[comp.key] === n ? SCORE_COLOR(n) : undefined,
                      color: evalScores[comp.key] === n ? '#fff' : undefined,
                      borderColor: evalScores[comp.key] === n ? 'transparent' : undefined,
                    }}
                      onClick={() => setEvalScores(p => ({ ...p, [comp.key]: n }))}
                    >{n}</button>
                  ))}
                </div>
              </div>
            )
          })}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Recomendação</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {REC_OPTS.map(r => (
                <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 10px', borderRadius: 6, border: `1px solid ${evalRec === r.value ? 'var(--primary)' : 'var(--border)'}`, background: evalRec === r.value ? 'var(--primary-light, #eff6ff)' : undefined }}>
                  <input type="radio" name="rec" value={r.value} checked={evalRec === r.value} onChange={() => setEvalRec(r.value)} />
                  <span style={{ fontSize: 13 }}>{r.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Notas e observações</label>
            <textarea className="input" rows={3} style={{ width: '100%', resize: 'vertical' }} placeholder="Observações sobre o desempenho…" value={evalNotes} onChange={e => setEvalNotes(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn" onClick={() => setEvalModal(null)}>Cancelar</button>
            <button className="btn btn-primary" disabled={Object.keys(evalScores).length < EVAL_COMPS.length} onClick={submitEval}>
              Submeter avaliação
            </button>
          </div>
          {Object.keys(evalScores).length < EVAL_COMPS.length && (
            <p style={{ fontSize: 11, opacity: 0.5, marginTop: 8, textAlign: 'right' }}>
              Preencha as {EVAL_COMPS.length} competências para submeter ({Object.keys(evalScores).length}/{EVAL_COMPS.length})
            </p>
          )}
        </Modal>
      )}

      {/* Nova Tarefa */}
      {newTaskModal && (
        <Modal title="Nova Tarefa" onClose={() => setNTM(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Mentorando *</label>
              <select className="select" style={{ width: '100%' }} value={taskForm.talentId} onChange={e => setTF(f => ({ ...f, talentId: e.target.value }))}>
                <option value="">Seleccionar…</option>
                {MY_MENTEES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Título *</label>
              <input className="input" style={{ width: '100%' }} value={taskForm.title} onChange={e => setTF(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Entregar relatório de rotação" />
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Descrição</label>
              <textarea className="input" rows={2} style={{ width: '100%', resize: 'vertical' }} value={taskForm.description} onChange={e => setTF(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Categoria</label>
                <select className="select" style={{ width: '100%' }} value={taskForm.category} onChange={e => setTF(f => ({ ...f, category: e.target.value }))}>
                  {TASK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Prioridade</label>
                <select className="select" style={{ width: '100%' }} value={taskForm.priority} onChange={e => setTF(f => ({ ...f, priority: e.target.value }))}>
                  <option value="alta">Alta</option>
                  <option value="média">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Prazo *</label>
                <input type="date" className="input" style={{ width: '100%' }} value={taskForm.dueDate} onChange={e => setTF(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setNTM(false)}>Cancelar</button>
              <button className="btn btn-primary" disabled={!taskForm.title.trim() || !taskForm.talentId || !taskForm.dueDate} onClick={addTask}>Criar tarefa</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Nota de voluntário */}
      {volNoteModal && (
        <Modal title={`Nota — ${volNoteModal.nome}`} onClose={() => setVolNoteModal(null)}>
          <div style={{ marginBottom: 8, fontSize: 13, opacity: 0.6 }}>{volNoteModal.profissao} · {AREA_LABEL[volNoteModal.areaActuacao]}</div>
          <textarea className="input" rows={4} style={{ width: '100%', resize: 'vertical' }} placeholder="Observações sobre o voluntário, comprometimento, pontos de atenção…" value={volNote} onChange={e => setVolNote(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn" onClick={() => setVolNoteModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={saveVolNote}>Guardar nota</button>
          </div>
        </Modal>
      )}

      {/* Registar horas voluntário */}
      {regHorasModal && (
        <Modal title={`Registar Horas — ${regHorasModal.nome}`} onClose={() => setRegHorasModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Actividade *</label>
              <select className="select" style={{ width: '100%' }} value={regHorasForm.actividadeId} onChange={e => setRegHorasForm(f => ({ ...f, actividadeId: e.target.value }))}>
                <option value="">Seleccionar actividade…</option>
                {volunteerActivities.map(a => <option key={a.id} value={a.id}>{a.nome} ({a.data})</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Data *</label>
                <input type="date" className="input" style={{ width: '100%' }} value={regHorasForm.data} onChange={e => setRegHorasForm(f => ({ ...f, data: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Horas</label>
                <select className="select" style={{ width: '100%' }} value={regHorasForm.horas} onChange={e => setRegHorasForm(f => ({ ...f, horas: Number(e.target.value) }))}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}h</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setRegHorasModal(null)}>Cancelar</button>
              <button className="btn btn-primary" disabled={!regHorasForm.actividadeId || !regHorasForm.data} onClick={registarHoras}>Registar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Nota de falta */}
      {absModal && (
        <Modal title={`Falta — ${absModal.talentName}`} onClose={() => setAbsModal(null)}>
          <div className="info-grid" style={{ marginBottom: 16 }}>
            <div className="info-item"><span className="info-label">Data</span><span className="info-value">{absModal.date}</span></div>
            <div className="info-item"><span className="info-label">Dias</span><span className="info-value">{absModal.days}</span></div>
            <div className="info-item"><span className="info-label">Tipo</span><span className="info-value"><Pill tone={absModal.type === 'justificada' ? 'info' : 'danger'} dot={false}>{absModal.type}</Pill></span></div>
            <div className="info-item"><span className="info-label">Estado RH</span><span className="info-value"><Pill tone={absModal.status === 'approved' ? 'success' : absModal.status === 'rejected' ? 'danger' : 'warn'} dot={false}>{absModal.status === 'approved' ? 'Aprovada' : absModal.status === 'rejected' ? 'Rejeitada' : 'Pendente'}</Pill></span></div>
          </div>
          {absModal.reason && <div style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 6, fontSize: 13, marginBottom: 12 }}><b>Motivo:</b> {absModal.reason}</div>}
          <div>
            <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Nota do mentor (visível para o RH)</label>
            <textarea className="input" rows={3} style={{ width: '100%', resize: 'vertical' }} value={mentorNote} onChange={e => setMentorNote(e.target.value)} placeholder="Ex: Situação excepcional, apoio mentor…" />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn" onClick={() => setAbsModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={saveAbsenceNote}>Guardar nota</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
