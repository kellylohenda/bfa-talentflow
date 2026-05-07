'use client'

import { useState } from 'react'
import Link from 'next/link'
import { talents, programs } from '@/lib/data'
import { initials, avatarColor } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Bar from '@/components/ui/Bar'
import Modal from '@/components/ui/Modal'

const interns = talents.filter(t => t.program === 'fbfa')

const CHECKLIST_ITEMS = [
  'Contrato assinado',
  'Acesso sistemas',
  'Email corporativo',
  'Badge criado',
  'Orientação RH',
  'Apresentação equipa',
]

const ROTATIONS = [
  { id: 'R-001', talent: 'Kiala Domingos',  from: 'Banca Privada',  to: 'Banca Empresas', start: '2026-05-01', end: '2026-07-31', status: 'active' },
  { id: 'R-002', talent: 'Lwini Capemba',   from: 'Operações',      to: 'Banca Empresas', start: '2026-03-01', end: '2026-05-31', status: 'completed' },
  { id: 'R-003', talent: 'Yuran Bumba',     from: 'TI Sistemas',    to: 'Risco de Crédito', start: '2026-06-01', end: '2026-08-31', status: 'pending' },
]

const ROTATION_TONE: Record<string, 'success' | 'info' | 'neutral'> = {
  active: 'success',
  completed: 'info',
  pending: 'neutral',
}
const ROTATION_LABEL: Record<string, string> = {
  active: 'Activa',
  completed: 'Concluída',
  pending: 'Pendente',
}

type ChecklistState = Record<string, boolean>

const buildInitialChecklist = (): ChecklistState => {
  const state: ChecklistState = {}
  interns.forEach(t => {
    if (t.status === 'onboarding') {
      CHECKLIST_ITEMS.forEach((_, i) => {
        state[`${t.id}_${i}`] = false
      })
    }
  })
  return state
}

export default function PageEstagiarios() {
  const [activeTab, setActiveTab] = useState<'visao' | 'onboarding' | 'rotacoes' | 'avaliacoes'>('visao')
  const [checklist, setChecklist] = useState<ChecklistState>(buildInitialChecklist)
  const [showRotModal, setShowRotModal] = useState(false)
  const [rotations, setRotations] = useState(ROTATIONS)
  const [rotForm, setRotForm] = useState({ talent: '', from: '', to: '', start: '', end: '' })
  const [showEvalModal, setShowEvalModal] = useState(false)
  const [evalTarget, setEvalTarget] = useState<string | null>(null)
  const [evalScores, setEvalScores] = useState<Record<string, number>>({})
  const [evalSubmitted, setEvalSubmitted] = useState<Set<string>>(new Set())

  const total = interns.length
  const onboarding = interns.filter(t => t.status === 'onboarding').length
  const active = interns.filter(t => t.status === 'active').length
  const completed = interns.filter(t => t.status === 'hired' || t.status === 'completed').length

  const evalData = interns.map(t => ({
    talent: t,
    score: t.perf,
    cycle: 'Q1 2026',
    status: evalSubmitted.has(t.id) || t.perf > 80 ? 'submitted' : 'pending',
  }))

  const EVAL_COMPS = ['Competências técnicas', 'Comunicação', 'Iniciativa', 'Trabalho em equipa', 'Pontualidade']

  const submitEval = () => {
    if (!evalTarget) return
    const intern = interns.find(t => t.name === evalTarget)
    if (intern) setEvalSubmitted(prev => { const next = new Set(prev); next.add(intern.id); return next })
    setShowEvalModal(false)
    setEvalScores({})
    setEvalTarget(null)
  }

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const addRotation = () => {
    if (!rotForm.talent || !rotForm.from || !rotForm.to) return
    setRotations(prev => [...prev, { id: `R-00${prev.length + 1}`, ...rotForm, status: 'pending' }])
    setRotForm({ talent: '', from: '', to: '', start: '', end: '' })
    setShowRotModal(false)
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <div className="page-title">Estagiários</div>
          <div className="page-subtitle">Gestão do programa Futuro BFA</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total trainees" value={total} icon="briefcase" />
        <KPI label="Onboarding" value={onboarding} icon="clock" />
        <KPI label="Activos" value={active} icon="check-circle" />
        <KPI label="Concluídos/Contratados" value={completed} icon="star" />
      </div>

      <div className="tabs">
        {(['visao', 'onboarding', 'rotacoes', 'avaliacoes'] as const).map(tab => (
          <button
            key={tab}
            className={`tab${activeTab === tab ? ' tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'visao' ? 'Visão Geral' : tab === 'onboarding' ? 'Onboarding' : tab === 'rotacoes' ? 'Rotações' : 'Avaliações'}
          </button>
        ))}
      </div>

      {activeTab === 'visao' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Programa</th>
                <th>Departamento</th>
                <th>Mentor</th>
                <th>Início</th>
                <th>Performance</th>
                <th>Estado</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {interns.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="cell-person">
                      <Avatar name={t.name} size={28} />
                      <span>{t.name}</span>
                    </div>
                  </td>
                  <td>Futuro BFA · {t.year}</td>
                  <td>{t.dept !== '—' ? t.dept : <span style={{ opacity: 0.4 }}>—</span>}</td>
                  <td>{t.mentor}</td>
                  <td style={{ fontSize: 12 }}>{t.startDate}</td>
                  <td style={{ minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Bar value={t.perf} max={100} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{t.perf}</span>
                    </div>
                  </td>
                  <td>
                    <Pill
                      tone={t.status === 'active' ? 'success' : t.status === 'onboarding' ? 'info' : t.status === 'hired' ? 'info' : 'neutral'}
                      dot={false}
                    >
                      {t.status === 'active' ? 'Activo' : t.status === 'onboarding' ? 'Onboarding' : t.status === 'hired' ? 'Contratado' : 'Concluído'}
                    </Pill>
                  </td>
                  <td>
                    <Link href={`/talentos/${t.id}`} className="btn btn-sm">Ver ficha</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'onboarding' && (
        <div className="grid cols-3">
          {interns.filter(t => t.status === 'onboarding').map(t => {
            const checked = CHECKLIST_ITEMS.filter((_, i) => checklist[`${t.id}_${i}`]).length
            return (
              <div key={t.id} className="card card-pad">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Avatar name={t.name} size={36} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>Mentor: {t.mentor}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700 }}>
                    {checked}/{CHECKLIST_ITEMS.length}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {CHECKLIST_ITEMS.map((item, i) => {
                    const key = `${t.id}_${i}`
                    return (
                      <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={!!checklist[key]}
                          onChange={() => toggleCheck(key)}
                        />
                        <span style={{ textDecoration: checklist[key] ? 'line-through' : 'none', opacity: checklist[key] ? 0.5 : 1 }}>
                          {item}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}
          {interns.filter(t => t.status === 'onboarding').length === 0 && (
            <div className="card card-pad" style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5 }}>
              Sem talentos em onboarding
            </div>
          )}
        </div>
      )}

      {activeTab === 'rotacoes' && (
        <div className="card">
          <div className="card-head">
            <div className="card-title">Rotações</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowRotModal(true)}>Nova rotação</button>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Talento</th>
                <th>De</th>
                <th>Para</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rotations.map(r => (
                <tr key={r.id}>
                  <td><span className="mono">{r.id}</span></td>
                  <td>{r.talent}</td>
                  <td>{r.from}</td>
                  <td>{r.to}</td>
                  <td style={{ fontSize: 12 }}>{r.start}</td>
                  <td style={{ fontSize: 12 }}>{r.end}</td>
                  <td><Pill tone={ROTATION_TONE[r.status]} dot={false}>{ROTATION_LABEL[r.status]}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'avaliacoes' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Talento</th>
                <th>Pontuação</th>
                <th>Ciclo</th>
                <th>Estado</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {evalData.map(({ talent, score, cycle, status }) => (
                <tr key={talent.id}>
                  <td>
                    <div className="cell-person">
                      <Avatar name={talent.name} size={28} />
                      <span>{talent.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Bar value={score} max={100} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{score}</span>
                    </div>
                  </td>
                  <td>{cycle}</td>
                  <td>
                    <Pill tone={status === 'submitted' ? 'success' : 'warn'} dot={false}>
                      {status === 'submitted' ? 'Submetida' : 'Pendente'}
                    </Pill>
                  </td>
                  <td>
                    <button className="btn btn-sm" onClick={() => { setEvalTarget(talent.name); setShowEvalModal(true) }}>
                      {status === 'submitted' ? 'Ver' : 'Submeter'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRotModal && (
        <Modal title="Nova Rotação" onClose={() => setShowRotModal(false)}>
          <div className="form-group">
            <label className="form-label">Talento</label>
            <select className="select" value={rotForm.talent} onChange={e => setRotForm(f => ({ ...f, talent: e.target.value }))}>
              <option value="">Seleccionar talento...</option>
              {interns.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">De (departamento)</label>
              <input className="input" value={rotForm.from} onChange={e => setRotForm(f => ({ ...f, from: e.target.value }))} placeholder="Dept. origem" />
            </div>
            <div className="form-group">
              <label className="form-label">Para (departamento)</label>
              <input className="input" value={rotForm.to} onChange={e => setRotForm(f => ({ ...f, to: e.target.value }))} placeholder="Dept. destino" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Data início</label>
              <input className="input" type="date" value={rotForm.start} onChange={e => setRotForm(f => ({ ...f, start: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Data fim</label>
              <input className="input" type="date" value={rotForm.end} onChange={e => setRotForm(f => ({ ...f, end: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={addRotation}>Criar rotação</button>
          </div>
        </Modal>
      )}

      {showEvalModal && evalTarget && (
        <Modal title={`Avaliação — ${evalTarget}`} onClose={() => { setShowEvalModal(false); setEvalScores({}) }}>
          <div style={{ opacity: 0.6, marginBottom: 16, fontSize: 13 }}>Avaliação de desempenho Q1 2026 · Classifique de 1 (Insuficiente) a 5 (Excelente)</div>
          {EVAL_COMPS.map(comp => {
            const score = evalScores[comp] ?? 0
            return (
              <div key={comp} className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{comp}</span>
                  {score > 0 && (
                    <span style={{ fontWeight: 700, color: score >= 4 ? 'var(--success)' : score >= 3 ? 'var(--warn)' : 'var(--danger)' }}>
                      {score}/5
                    </span>
                  )}
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      className="btn btn-sm"
                      style={{
                        minWidth: 40,
                        background: score === n ? (n >= 4 ? 'var(--success)' : n >= 3 ? 'var(--warn)' : 'var(--danger)') : undefined,
                        color: score === n ? '#fff' : undefined,
                        borderColor: score === n ? 'transparent' : undefined,
                        fontWeight: score === n ? 700 : undefined,
                      }}
                      onClick={() => setEvalScores(prev => ({ ...prev, [comp]: n }))}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              onClick={submitEval}
              disabled={Object.keys(evalScores).length < EVAL_COMPS.length}
            >
              Submeter avaliação
            </button>
            <button className="btn" onClick={() => { setShowEvalModal(false); setEvalScores({}) }}>Cancelar</button>
          </div>
          {Object.keys(evalScores).length < EVAL_COMPS.length && (
            <p style={{ fontSize: 11, opacity: 0.5, marginTop: 8 }}>
              Preencha todas as {EVAL_COMPS.length} competências para submeter.
            </p>
          )}
        </Modal>
      )}
    </div>
  )
}
