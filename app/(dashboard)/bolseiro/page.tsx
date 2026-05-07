'use client'
import { useState } from 'react'
import { bolseiroPayments, bolseiroNotifs, tasks, rotations, presencas, sessoesBolseiro } from '@/lib/data'
import { fmtKz } from '@/lib/utils'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Modal from '@/components/ui/Modal'
import Icon from '@/components/ui/Icon'
import Bar from '@/components/ui/Bar'
import type { TaskStatus, PaymentStatus, ParticipantKind, PresencaStatus } from '@/types'

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

const myTasks        = tasks.filter(t => t.talentId === ME.id)
const myRotations    = rotations.filter(r => r.talentId === ME.id)
const activeRotation = myRotations.find(r => r.status === 'activa')
const myPresencas    = presencas.filter(p => p.talentId === ME.id)
const mySessoes      = sessoesBolseiro.filter(s => s.talentId === ME.id)

// ── Presença stats ────────────────────────────────────────────────────────────
const SEMANA_ACTUAL = ['2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08']
const MES_ACTUAL    = myPresencas.filter(p => p.date >= '2026-05-01')
const HISTORICO     = myPresencas.filter(p => p.date >= '2026-04-01')
const presHist      = HISTORICO.filter(p => p.status === 'presente')
const totalHorasMes = presHist.reduce((s, p) => s + (p.horas ?? 0), 0)
const diasTrabalhados = presHist.length
const taxaPresenca  = HISTORICO.filter(p => p.status !== 'pendente').length > 0
  ? Math.round(presHist.length / HISTORICO.filter(p => p.status !== 'pendente').length * 100)
  : 0
const horasEstaSemana = SEMANA_ACTUAL.reduce((s, d) => {
  const p = myPresencas.find(p => p.date === d)
  return s + (p?.horas ?? 0)
}, 0)
const avgChegada = (() => {
  const times = presHist.filter(p => p.entrada).map(p => {
    const [h, m] = p.entrada!.split(':').map(Number)
    return h * 60 + m
  })
  if (!times.length) return '—'
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  return `${String(Math.floor(avg / 60)).padStart(2, '0')}:${String(avg % 60).padStart(2, '0')}`
})()

function presStatusStyle(s: PresencaStatus): { bg: string; color: string; label: string } {
  return s === 'presente'   ? { bg: '#D1FAE5', color: '#065F46', label: 'Presente' }
       : s === 'ausente'    ? { bg: '#FEE2E2', color: '#991B1B', label: 'Ausente' }
       : s === 'justificado'? { bg: '#FEF3C7', color: '#92400E', label: 'Justificado' }
       :                     { bg: '#F3F4F6', color: '#6B7280', label: 'Pendente' }
}

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
  type EstagiarioTab = 'inicio' | 'presencas' | 'rotacoes' | 'tarefas' | 'perfil'
  type BolseiroTab   = 'inicio' | 'presencas' | 'pagamentos' | 'tarefas' | 'perfil'
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

  const [checkingIn, setCheckingIn]   = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const todayRecord = myPresencas.find(p => p.date === '2026-05-07')
  const checkedInToday  = todayRecord?.entrada != null
  const checkedOutToday = todayRecord?.saida   != null

  const TABS: [Tab, string][] = IS_ESTAGIARIO
    ? [['inicio', 'Início'], ['presencas', 'Presenças & Horas'], ['rotacoes', 'Rotações'], ['tarefas', 'As Minhas Tarefas'], ['perfil', 'O Meu Perfil']]
    : [['inicio', 'Início'], ['presencas', 'Presenças & Sessões'], ['pagamentos', 'Pagamentos'], ['tarefas', 'As Minhas Tarefas'], ['perfil', 'O Meu Perfil']]

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

        {/* ── Rotinas & Ritmo de Trabalho ──────────────────────────────────── */}
        {IS_ESTAGIARIO && (
          <div className="card" style={{ marginTop: 0 }}>
            <div className="card-head">
              <span className="card-title">Rotina & Ritmo de Trabalho</span>
              <span style={{ fontSize: 12, opacity: 0.5 }}>Últimas 4 semanas</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
              {/* Consistency score */}
              <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--surface-2)', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: taxaPresenca >= 90 ? '#065F46' : taxaPresenca >= 75 ? '#92400E' : '#991B1B' }}>
                  {taxaPresenca}%
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Consistência</div>
                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                  {taxaPresenca >= 90 ? 'Excelente' : taxaPresenca >= 75 ? 'Boa' : 'A melhorar'}
                </div>
              </div>
              {/* Average arrival */}
              <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--surface-2)', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{avgChegada}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Chegada média</div>
                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                  {avgChegada <= '08:15' ? 'Muito pontual' : avgChegada <= '08:30' ? 'Pontual' : 'Atenção'}
                </div>
              </div>
              {/* Avg hours/day */}
              <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--surface-2)', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>
                  {diasTrabalhados > 0 ? (totalHorasMes / diasTrabalhados).toFixed(1) : '—'}h
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Média diária</div>
                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>Por dia de trabalho</div>
              </div>
              {/* This week */}
              <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--surface-2)', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{horasEstaSemana.toFixed(1)}h</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Esta semana</div>
                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                  {horasEstaSemana >= 35 ? 'Semana completa' : `Faltam ~${(40 - horasEstaSemana).toFixed(0)}h`}
                </div>
              </div>
            </div>

            {/* Weekly heatmap — last 4 weeks */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.65, marginBottom: 10 }}>Calendário das últimas 4 semanas</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(20, 1fr)', gap: 4, alignItems: 'center' }}>
                {/* Day labels */}
                {['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', '', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', '', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', '', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((d, i) => (
                  <div key={i} style={{ fontSize: 10, opacity: 0.45, textAlign: 'center' }}>{d}</div>
                ))}
              </div>
              {/* 4 weeks × 5 days grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: 4, marginTop: 4 }}>
                {[
                  '2026-04-06','2026-04-07','2026-04-08','2026-04-09','2026-04-10',
                  '2026-04-13','2026-04-14','2026-04-15','2026-04-16','2026-04-17',
                  '2026-04-20','2026-04-21','2026-04-22','2026-04-23','2026-04-24',
                  '2026-04-27','2026-04-28','2026-04-29','2026-04-30','2026-05-01',
                ].map(date => {
                  const rec = myPresencas.find(p => p.date === date)
                  const s = rec ? presStatusStyle(rec.status) : null
                  const isToday = date === '2026-05-07'
                  return (
                    <div key={date} title={`${date}${rec ? ` · ${rec.horas ?? 0}h · ${s?.label}` : ' · Sem registo'}`}
                      style={{ width: '100%', aspectRatio: '1', borderRadius: 4, background: s ? s.bg : 'var(--surface-2)', border: isToday ? '2px solid var(--primary)' : '1px solid transparent', cursor: 'default', opacity: !rec ? 0.3 : 1 }} />
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, opacity: 0.55 }}>
                {[['#D1FAE5', 'Presente'], ['#FEE2E2', 'Ausente'], ['#FEF3C7', 'Justificado'], ['var(--surface-2)', 'Sem registo']].map(([bg, label]) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: bg, display: 'inline-block', border: '1px solid rgba(0,0,0,0.08)' }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {/* ── PRESENÇAS & HORAS ────────────────────────────────────────────────── */}
      {tab === 'presencas' && IS_ESTAGIARIO && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* KPIs */}
          <div className="grid cols-4">
            <KPI label="Dias trabalhados" value={diasTrabalhados} sub="Desde Abril" icon="check" />
            <KPI label="Horas totais" value={`${totalHorasMes.toFixed(0)}h`} sub="Desde Abril" icon="clock" />
            <KPI label="Taxa de presença" value={`${taxaPresenca}%`} sub="Excluindo justificados" delta={taxaPresenca >= 90 ? 'Excelente' : 'Atenção'} deltaTone={taxaPresenca >= 90 ? 'up' : 'flat'} icon="star" />
            <KPI label="Esta semana" value={`${horasEstaSemana.toFixed(1)}h`} sub={`Chegada média: ${avgChegada}`} icon="briefcase" />
          </div>

          {/* Check-in / Check-out + Semana actual */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <div className="card-head">
                <span className="card-title">Ponto de Hoje</span>
                <span style={{ fontSize: 12, opacity: 0.5 }}>7 de Maio de 2026</span>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>Departamento</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{activeRotation?.dept ?? ME.dept}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div style={{ padding: '10px 12px', borderRadius: 8, background: checkedInToday ? '#D1FAE5' : 'var(--surface-2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>Entrada</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: checkedInToday ? '#065F46' : 'var(--text)' }}>
                    {todayRecord?.entrada ?? '—'}
                  </div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: 8, background: checkedOutToday ? '#D1FAE5' : 'var(--surface-2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>Saída</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: checkedOutToday ? '#065F46' : 'var(--text)' }}>
                    {todayRecord?.saida ?? '—'}
                  </div>
                </div>
              </div>
              {!checkedInToday && (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setCheckingIn(true)} disabled={checkingIn}>
                  {checkingIn ? 'Registado ✓' : <><Icon name="check" size={14} /> Registar Entrada</>}
                </button>
              )}
              {checkedInToday && !checkedOutToday && (
                <button className="btn" style={{ width: '100%', background: '#065F46', color: '#fff', borderColor: '#065F46' }}
                  onClick={() => setCheckingOut(true)} disabled={checkingOut}>
                  {checkingOut ? 'Registado ✓' : <><Icon name="clock" size={14} /> Registar Saída</>}
                </button>
              )}
              {checkedInToday && checkedOutToday && (
                <div style={{ textAlign: 'center', padding: '8px', borderRadius: 8, background: '#D1FAE5', fontSize: 13, fontWeight: 600, color: '#065F46' }}>
                  ✓ Ponto completo hoje
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-head">
                <span className="card-title">Semana Actual</span>
                <span style={{ fontSize: 12, opacity: 0.5 }}>5–9 Maio</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 12 }}>
                {[['Seg', '2026-05-04'], ['Ter', '2026-05-05'], ['Qua', '2026-05-06'], ['Qui', '2026-05-07'], ['Sex', '2026-05-08']].map(([day, date]) => {
                  const rec = myPresencas.find(p => p.date === date)
                  const s = presStatusStyle(rec?.status ?? 'pendente')
                  const isEmpty = !rec
                  return (
                    <div key={day} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>{day}</div>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isEmpty ? 'var(--surface-2)' : s.bg, color: isEmpty ? 'var(--text)' : s.color, fontSize: 11, fontWeight: 700, border: date === '2026-05-07' ? '2px solid var(--primary)' : 'none', opacity: isEmpty ? 0.35 : 1 }}>
                        {isEmpty ? '—' : rec!.status === 'presente' ? '✓' : rec!.status === 'ausente' ? '✗' : rec!.status === 'justificado' ? 'J' : '●'}
                      </div>
                      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>{rec?.horas ? `${rec.horas}h` : ''}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, opacity: 0.65, flexWrap: 'wrap' }}>
                {[['#D1FAE5', '#065F46', 'Presente'], ['#FEE2E2', '#991B1B', 'Ausente'], ['#FEF3C7', '#92400E', 'Justificado']].map(([bg, color, label]) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: bg, border: `1px solid ${color}`, display: 'inline-block' }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Histórico completo */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Histórico de Presenças</span>
              <span style={{ fontSize: 12, opacity: 0.5 }}>{HISTORICO.length} dias registados</span>
            </div>
            <table className="tbl">
              <thead>
                <tr><th>Data</th><th>Departamento</th><th>Entrada</th><th>Saída</th><th>Horas</th><th>Estado</th><th>Supervisor</th><th>Nota</th></tr>
              </thead>
              <tbody>
                {[...HISTORICO].reverse().map(p => {
                  const s = presStatusStyle(p.status)
                  return (
                    <tr key={p.id}>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{p.date}</td>
                      <td style={{ fontSize: 13 }}>{p.dept}</td>
                      <td style={{ fontSize: 13, fontFamily: 'monospace' }}>{p.entrada ?? '—'}</td>
                      <td style={{ fontSize: 13, fontFamily: 'monospace' }}>{p.saida ?? '—'}</td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>{p.horas != null ? `${p.horas}h` : '—'}</td>
                      <td>
                        <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td>
                        {p.supervisorOk
                          ? <span style={{ color: 'var(--success)', fontSize: 12 }}>✓ Confirmado</span>
                          : <span style={{ opacity: 0.4, fontSize: 12 }}>Pendente</span>}
                      </td>
                      <td style={{ fontSize: 12, opacity: 0.6, maxWidth: 180 }}>{p.nota || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRESENÇAS & SESSÕES (Bolseiro) ──────────────────────────────────── */}
      {tab === 'presencas' && !IS_ESTAGIARIO && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid cols-4">
            <KPI label="Sessões agendadas" value={mySessoes.length} icon="calendar" />
            <KPI label="Frequentadas" value={mySessoes.filter(s => s.presente).length} icon="check" />
            <KPI label="Taxa de presença" value={mySessoes.length ? `${Math.round(mySessoes.filter(s => s.presente).length / mySessoes.length * 100)}%` : '—'} delta="Do programa" deltaTone="up" icon="star" />
            <KPI label="Horas de programa" value={`${mySessoes.filter(s => s.presente).reduce((a, s) => a + s.duracaoH, 0)}h`} sub="Acumuladas" icon="clock" />
          </div>
          <div className="card">
            <div className="card-head"><span className="card-title">Histórico de Sessões</span></div>
            <table className="tbl">
              <thead>
                <tr><th>Data</th><th>Tipo</th><th>Sessão</th><th>Duração</th><th>Presença</th><th>Nota</th></tr>
              </thead>
              <tbody>
                {[...mySessoes].reverse().map(s => (
                  <tr key={s.id}>
                    <td style={{ fontSize: 13 }}>{s.date}</td>
                    <td><Pill tone={s.tipo === 'mentoria' ? 'info' : s.tipo === 'avaliacao' ? 'warn' : s.tipo === 'workshop' ? 'primary' : 'neutral'} dot={false}>{s.tipo}</Pill></td>
                    <td style={{ fontSize: 13 }}>{s.titulo}</td>
                    <td style={{ fontSize: 13 }}>{s.duracaoH}h</td>
                    <td>
                      {s.presente
                        ? <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: 13 }}>✓ Presente</span>
                        : <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: 13 }}>✗ Ausente</span>}
                    </td>
                    <td style={{ fontSize: 12, opacity: 0.6 }}>{s.nota || '—'}</td>
                  </tr>
                ))}
                {mySessoes.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px 0', opacity: 0.4, fontSize: 13 }}>Sem sessões registadas.</td></tr>
                )}
              </tbody>
            </table>
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
