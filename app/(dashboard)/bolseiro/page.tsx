'use client'
import { useState } from 'react'
import { bolseiroPayments, bolseiroNotifs, tasks, rotations } from '@/lib/data'
import { fmtKz } from '@/lib/utils'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Modal from '@/components/ui/Modal'
import Icon from '@/components/ui/Icon'
import Bar from '@/components/ui/Bar'
import type { TaskStatus, PaymentStatus, ParticipantKind } from '@/types'

// ── Persona ───────────────────────────────────────────────────────────────────
// Lwini Capemba = programa Futuro BFA = Estagiária
// Mudar kind para 'bolseiro' para ver a experiência de bolseiro
const ME = {
  name:       'Lwini Capemba',
  id:         'T-1042',
  kind:       'estagiario' as ParticipantKind,
  program:    'Futuro BFA',
  programId:  'fbfa',
  university: 'Universidade Agostinho Neto',
  course:     'Economia',
  year:       'Trainee Y2',
  mentor:     'Edmilson Cardoso',
  dept:       'Banca de Empresas',
  gpa:        17.2,
  perf:       92,
  startDate:  '2024-09-01',
  endDate:    '2026-08-31',
}

const IS_ESTAGIARIO = ME.kind === 'estagiario'

// ── Helpers ───────────────────────────────────────────────────────────────────
function payLabel(s: PaymentStatus) {
  return s === 'paid' ? 'Pago' : s === 'pending' ? 'Pendente' : s === 'failed' ? 'Falhou' : 'Em espera'
}
function payTone(s: PaymentStatus): 'success' | 'warn' | 'danger' | 'neutral' {
  return s === 'paid' ? 'success' : s === 'pending' ? 'warn' : s === 'failed' ? 'danger' : 'neutral'
}
function taskLabel(s: TaskStatus) {
  return s === 'done' ? 'Concluída' : s === 'in_progress' ? 'Em curso' : s === 'overdue' ? 'Atrasada' : 'Pendente'
}
function taskTone(s: TaskStatus): 'success' | 'warn' | 'danger' | 'neutral' {
  return s === 'done' ? 'success' : s === 'in_progress' ? 'warn' : s === 'overdue' ? 'danger' : 'neutral'
}

const myTasks       = tasks.filter(t => t.talentId === ME.id)
const myRotations   = rotations.filter(r => r.talentId === ME.id)
const activeRotation = myRotations.find(r => r.status === 'activa')

const DOC_TYPES_ESTAGIARIO = ['Relatório de Estágio', 'Avaliação do Supervisor', 'Plano de Desenvolvimento', 'Identificação', 'Contrato']
const DOC_TYPES_BOLSEIRO   = ['Boletim', 'Comprovativo Matrícula', 'Relatório Semestral', 'Identificação', 'Contrato']
const DOC_TYPES = IS_ESTAGIARIO ? DOC_TYPES_ESTAGIARIO : DOC_TYPES_BOLSEIRO

// ── Competencies (estagiário self-assessment) ─────────────────────────────────
const COMPETENCIAS = [
  { key: 'tecnico',     label: 'Desempenho Técnico',         self: 4 },
  { key: 'comunicacao', label: 'Comunicação Profissional',   self: 4 },
  { key: 'iniciativa',  label: 'Iniciativa e Proactividade', self: 5 },
  { key: 'equipa',      label: 'Trabalho em Equipa',         self: 5 },
  { key: 'pontualidade',label: 'Pontualidade e Assiduidade', self: 5 },
]

export default function BolseiroPage() {
  type EstagiarioTab = 'inicio' | 'rotacoes' | 'tarefas' | 'perfil'
  type BolseiroTab   = 'inicio' | 'pagamentos' | 'tarefas' | 'perfil'
  type Tab = EstagiarioTab | BolseiroTab

  const [tab, setTab]             = useState<Tab>('inicio')
  const [notifs, setNotifs]       = useState(bolseiroNotifs)
  const [taskList, setTaskList]   = useState(myTasks)
  const [docModal, setDocModal]   = useState(false)
  const [docForm, setDocForm]     = useState({ type: DOC_TYPES[0], period: '', notes: '', file: '' })
  const [docSubmitted, setDocSubmitted] = useState(false)

  const unread       = notifs.filter(n => !n.read).length
  const lastPayment  = bolseiroPayments.find(p => p.status === 'paid')
  const pendingTasks = taskList.filter(t => t.status === 'pending' || t.status === 'in_progress')
  const overdue      = taskList.filter(t => t.status === 'overdue')

  const markTaskDone = (id: string) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, status: 'done' as const, completedAt: '2026-05-07' } : t))
  }

  const handleDocSubmit = () => {
    if (!docForm.period.trim()) return
    setDocSubmitted(true)
    setTimeout(() => {
      setDocModal(false)
      setDocSubmitted(false)
      setDocForm({ type: DOC_TYPES[0], period: '', notes: '', file: '' })
    }, 1200)
  }

  const markRead = (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const TABS: [Tab, string][] = IS_ESTAGIARIO
    ? [['inicio', 'Início'], ['rotacoes', 'Rotações'], ['tarefas', 'As Minhas Tarefas'], ['perfil', 'O Meu Perfil']]
    : [['inicio', 'Início'], ['pagamentos', 'Pagamentos'], ['tarefas', 'As Minhas Tarefas'], ['perfil', 'O Meu Perfil']]

  return (
    <div className="section">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="page-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="page-title" style={{ margin: 0 }}>Olá, {ME.name.split(' ')[0]}</h1>
            {IS_ESTAGIARIO ? (
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#FF760720', color: '#FF7607', border: '1px solid #FF760740' }}>
                Estagiário — Futuro BFA
              </span>
            ) : (
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#1D4ED820', color: '#1D4ED8', border: '1px solid #1D4ED840' }}>
                Bolseiro
              </span>
            )}
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            {IS_ESTAGIARIO
              ? `Programa de Estágio · ${activeRotation ? activeRotation.dept : ME.dept} · ${ME.mentor}`
              : `${ME.program} · ${ME.university}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {unread > 0 && <Pill tone="warn">{unread} notificações</Pill>}
          <button className="btn btn-primary" onClick={() => setDocModal(true)}>
            <Icon name="upload" size={14} />
            {IS_ESTAGIARIO ? 'Submeter Relatório' : 'Submeter Documento'}
          </button>
        </div>
      </div>

      {/* ── KPIs ────────────────────────────────────────────────────────────── */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        {IS_ESTAGIARIO ? (
          <>
            <KPI label="Desempenho" value={`${ME.perf}%`} sub="Ciclo actual" delta="+4pts" deltaTone="up" icon="star" />
            <KPI label="Rotação actual" value={activeRotation?.dept ?? '—'} sub={activeRotation ? `Desde ${activeRotation.startDate}` : 'Sem rotação activa'} icon="briefcase" />
            <KPI label="Rotações concluídas" value={myRotations.filter(r => r.status === 'concluida').length} sub={`de ${myRotations.length} total`} icon="check" />
            <KPI label="Tarefas Pendentes" value={pendingTasks.length} sub={overdue.length > 0 ? `${overdue.length} em atraso` : 'Em dia'} delta={overdue.length > 0 ? 'Urgente' : 'OK'} deltaTone={overdue.length > 0 ? 'down' : 'up'} icon="clock" />
          </>
        ) : (
          <>
            <KPI label="Último Subsídio" value={lastPayment ? fmtKz(lastPayment.amount) : '—'} sub={lastPayment?.date ?? ''} delta="Recebido" deltaTone="up" icon="cash" />
            <KPI label="Desempenho" value={`${ME.perf}%`} sub="Ciclo actual" delta="+4pts" deltaTone="up" icon="star" />
            <KPI label="Média Académica" value={String(ME.gpa)} sub="/ 20 valores" delta="Excelente" deltaTone="up" icon="check" />
            <KPI label="Tarefas Pendentes" value={pendingTasks.length} sub={overdue.length > 0 ? `${overdue.length} em atraso` : 'Em dia'} delta={overdue.length > 0 ? 'Urgente' : 'OK'} deltaTone={overdue.length > 0 ? 'down' : 'up'} icon="clock" />
          </>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {TABS.map(([key, lbl]) => (
          <button key={key} className={`tab ${tab === key ? 'tab-active' : ''}`} onClick={() => setTab(key)}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── INÍCIO ──────────────────────────────────────────────────────────── */}
      {tab === 'inicio' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head"><span className="card-title">Notificações</span></div>
            {notifs.map(n => (
              <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', opacity: n.read ? 0.55 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 13 }}>{n.title}</strong>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
                    <span style={{ fontSize: 11, opacity: 0.5 }}>{n.when}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, opacity: 0.65, margin: 0 }}>{n.text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Next session */}
            <div className="card">
              <div className="card-head"><span className="card-title">Próxima Sessão de Mentoria</span></div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{ME.mentor}</div>
              <div style={{ fontSize: 12, opacity: 0.55, marginBottom: 12 }}>
                {IS_ESTAGIARIO ? `Rotação: ${activeRotation?.dept ?? ME.dept}` : `Dept: ${ME.dept}`}
              </div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 6, padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>8 de Maio · 15h00</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
                  {IS_ESTAGIARIO ? 'Revisão objectivos Q2 — análise de crédito' : 'Revisão Q2 e objectivos académicos'}
                </div>
              </div>
            </div>

            {/* Estagiário: current rotation card */}
            {IS_ESTAGIARIO && activeRotation && (
              <div className="card" style={{ borderLeft: '3px solid #FF7607' }}>
                <div className="card-head">
                  <span className="card-title">Rotação Actual</span>
                  <Pill tone="warn" dot={false}>Em curso</Pill>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{activeRotation.dept}</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 8 }}>Supervisor: {activeRotation.supervisor}</div>
                <div style={{ fontSize: 12, opacity: 0.55 }}>
                  {activeRotation.startDate} → {activeRotation.endDate}
                </div>
                {activeRotation.notes && (
                  <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 6, fontSize: 12, opacity: 0.75 }}>
                    {activeRotation.notes}
                  </div>
                )}
              </div>
            )}

            {/* Urgent tasks */}
            <div className="card">
              <div className="card-head"><span className="card-title">Tarefas Urgentes</span></div>
              {[...overdue, ...pendingTasks].slice(0, 3).map((t) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>Prazo: {t.dueDate}</div>
                  </div>
                  <Pill tone={taskTone(t.status)}>{taskLabel(t.status)}</Pill>
                </div>
              ))}
              {pendingTasks.length === 0 && overdue.length === 0 && (
                <p style={{ opacity: 0.45, fontSize: 13 }}>Sem tarefas urgentes.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ROTAÇÕES (Estagiário only) ───────────────────────────────────────── */}
      {tab === 'rotacoes' && IS_ESTAGIARIO && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Rotation journey */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Percurso de Rotações</span>
              <span style={{ fontSize: 12, opacity: 0.5 }}>{myRotations.length} rotações · desde {ME.startDate}</span>
            </div>
            <div style={{ position: 'relative', padding: '8px 0' }}>
              {myRotations.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', gap: 16, marginBottom: 16, position: 'relative' }}>
                  {/* Timeline line */}
                  {i < myRotations.length - 1 && (
                    <div style={{ position: 'absolute', left: 15, top: 32, width: 2, height: 'calc(100% + 8px)', background: 'var(--border)' }} />
                  )}
                  {/* Dot */}
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: r.status === 'activa' ? '#FF7607' : r.status === 'concluida' ? 'var(--success)' : 'var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 12, fontWeight: 700, zIndex: 1,
                  }}>
                    {r.status === 'activa' ? '→' : r.status === 'concluida' ? '✓' : '○'}
                  </div>
                  <div style={{ flex: 1, padding: '4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{r.dept}</span>
                      <Pill tone={r.status === 'activa' ? 'warn' : r.status === 'concluida' ? 'success' : 'neutral'} dot={false}>
                        {r.status === 'activa' ? 'Em curso' : r.status === 'concluida' ? 'Concluída' : 'Agendada'}
                      </Pill>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                      {r.startDate} → {r.endDate} · Supervisor: {r.supervisor}
                    </div>
                    {r.notes && <div style={{ fontSize: 12, opacity: 0.75, fontStyle: 'italic' }}>{r.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competency self-assessment */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Auto-avaliação de Competências</span>
              <span style={{ fontSize: 11, opacity: 0.5 }}>Escala 1–5 · Ciclo Q2 2026</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.55, marginBottom: 16 }}>
              A sua auto-avaliação é partilhada com o seu mentor antes da avaliação formal.
            </div>
            {COMPETENCIAS.map(c => (
              <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <span style={{ width: 200, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{c.label}</span>
                <div style={{ flex: 1 }}>
                  <Bar value={c.self / 5 * 100} tone={c.self >= 4 ? 'success' : c.self >= 3 ? 'warn' : 'danger'} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, minWidth: 24, color: c.self >= 4 ? 'var(--success)' : c.self >= 3 ? 'var(--warn)' : 'var(--danger)' }}>
                  {c.self}/5
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PAGAMENTOS (Bolseiro only) ───────────────────────────────────────── */}
      {tab === 'pagamentos' && !IS_ESTAGIARIO && (
        <div className="card">
          <div className="card-head"><span className="card-title">Histórico de Pagamentos</span></div>
          <table className="tbl">
            <thead>
              <tr><th>ID</th><th>Período</th><th>Tipo</th><th>Montante</th><th>Estado</th><th>Data</th></tr>
            </thead>
            <tbody>
              {bolseiroPayments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontSize: 12, opacity: 0.55 }}>{p.id}</td>
                  <td>{p.period}</td>
                  <td>{p.type}</td>
                  <td style={{ fontWeight: 600 }}>{fmtKz(p.amount)}</td>
                  <td><Pill tone={payTone(p.status)}>{payLabel(p.status)}</Pill></td>
                  <td style={{ fontSize: 12, opacity: 0.65 }}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '16px 0 0', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>Total recebido</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {fmtKz(bolseiroPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAREFAS ─────────────────────────────────────────────────────────── */}
      {tab === 'tarefas' && (
        <div className="card">
          <div className="card-head"><span className="card-title">As Minhas Tarefas</span></div>
          <table className="tbl">
            <thead>
              <tr><th>Tarefa</th><th>Atribuída por</th><th>Categoria</th><th>Prioridade</th><th>Prazo</th><th>Estado</th><th>Acção</th></tr>
            </thead>
            <tbody>
              {taskList.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{t.title}</div>
                    <div style={{ fontSize: 11, opacity: 0.55 }}>{t.description.slice(0, 70)}{t.description.length > 70 ? '…' : ''}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {t.assignedBy}
                    <div style={{ fontSize: 11, opacity: 0.5 }}>{t.assignedByRole === 'rh' ? 'RH' : 'Mentor'}</div>
                  </td>
                  <td><Pill tone="neutral" dot={false}>{t.category}</Pill></td>
                  <td><Pill tone={t.priority === 'alta' ? 'danger' : t.priority === 'média' ? 'warn' : 'neutral'}>{t.priority}</Pill></td>
                  <td style={{ fontSize: 12, color: t.status === 'overdue' ? 'var(--danger)' : undefined }}>{t.dueDate}</td>
                  <td><Pill tone={taskTone(t.status)}>{taskLabel(t.status)}</Pill></td>
                  <td>
                    {t.status !== 'done'
                      ? <button className="btn btn-sm btn-primary" onClick={() => markTaskDone(t.id)}>Concluir</button>
                      : <span style={{ fontSize: 12, opacity: 0.4 }}>—</span>
                    }
                  </td>
                </tr>
              ))}
              {taskList.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px 0', opacity: 0.4, fontSize: 13 }}>Sem tarefas atribuídas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PERFIL ──────────────────────────────────────────────────────────── */}
      {tab === 'perfil' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <span className="card-title">Informações Pessoais</span>
              <Pill tone={IS_ESTAGIARIO ? 'warn' : 'info'} dot={false}>{IS_ESTAGIARIO ? 'Estagiário' : 'Bolseiro'}</Pill>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(IS_ESTAGIARIO ? [
                ['Nome completo', ME.name],
                ['ID', ME.id],
                ['Tipo', 'Estagiário — Futuro BFA'],
                ['Universidade de origem', ME.university],
                ['Curso', ME.course],
                ['Fase', ME.year],
                ['Departamento actual', activeRotation?.dept ?? ME.dept],
                ['Supervisor actual', activeRotation?.supervisor ?? '—'],
                ['Mentor', ME.mentor],
                ['Data de início', ME.startDate],
                ['Data prevista de fim', ME.endDate],
              ] : [
                ['Nome completo', ME.name],
                ['ID Bolseiro', ME.id],
                ['Tipo', 'Bolseiro BFA'],
                ['Programa', ME.program],
                ['Universidade', ME.university],
                ['Curso', ME.course],
                ['Ano académico', ME.year],
                ['Mentor', ME.mentor],
                ['Data de início', ME.startDate],
              ]).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, opacity: 0.5 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-head">
                <span className="card-title">{IS_ESTAGIARIO ? 'Desempenho no Estágio' : 'Desempenho Académico'}</span>
              </div>
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{ME.perf}%</div>
                <div style={{ fontSize: 13, opacity: 0.55, marginTop: 8 }}>Performance global</div>
              </div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13 }}>Nota académica (GPA)</span>
                  <span style={{ fontWeight: 600 }}>{ME.gpa}/20</span>
                </div>
                <Bar value={ME.gpa * 5} tone={ME.gpa >= 16 ? 'success' : ME.gpa >= 13 ? 'warn' : 'danger'} />
              </div>
            </div>

            {IS_ESTAGIARIO && (
              <div className="card" style={{ background: '#fff8f0', border: '1px solid #FF760730' }}>
                <div className="card-head">
                  <span className="card-title" style={{ color: '#FF7607' }}>O que é o Futuro BFA?</span>
                </div>
                <p style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.7, margin: 0 }}>
                  O <strong>Futuro BFA</strong> é o programa de estágio profissional do BFA. Ao contrário das bolsas académicas (BIF, BNAC, MEST), o Futuro BFA integra-te directamente nas operações do banco, com rotações entre departamentos, mentoria intensiva e avaliação de competências profissionais, com vista à contratação efectiva.
                </p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Rotações por dept.', 'Mentoria dedicada', 'Avaliação 360°', 'Pathway para contratação'].map(tag => (
                    <span key={tag} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: '#FF760715', color: '#FF7607', fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal: Submeter Documento / Relatório ───────────────────────────── */}
      {docModal && (
        <Modal title={IS_ESTAGIARIO ? 'Submeter Relatório de Estágio' : 'Submeter Documento'} onClose={() => setDocModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Tipo de documento</label>
              <select className="select" style={{ width: '100%' }} value={docForm.type} onChange={e => setDocForm(f => ({ ...f, type: e.target.value }))}>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>
                {IS_ESTAGIARIO ? 'Rotação / Período *' : 'Período *'}
              </label>
              <input className="input" placeholder={IS_ESTAGIARIO ? 'Ex: Rotação 4 — Tesouraria Q2 2026' : 'Ex: Q1 2026 / S1 2026'}
                style={{ width: '100%' }} value={docForm.period} onChange={e => setDocForm(f => ({ ...f, period: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Ficheiro</label>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: '20px', textAlign: 'center', fontSize: 13, opacity: 0.6, cursor: 'pointer' }}
                onClick={() => setDocForm(f => ({ ...f, file: 'documento.pdf' }))}>
                {docForm.file ? (
                  <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
                    <Icon name="doc" size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />{docForm.file}
                  </span>
                ) : (
                  <><Icon name="upload" size={20} style={{ display: 'block', margin: '0 auto 6px' }} />Clique para seleccionar ficheiro (PDF, máx. 10 MB)</>
                )}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Notas (opcional)</label>
              <textarea className="input" rows={2} placeholder="Informações adicionais..." style={{ width: '100%', resize: 'vertical' }}
                value={docForm.notes} onChange={e => setDocForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setDocModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleDocSubmit} disabled={!docForm.period.trim() || docSubmitted}>
                {docSubmitted ? 'A submeter…' : 'Submeter'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
