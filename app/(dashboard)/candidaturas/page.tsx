'use client'

import { useState, useEffect } from 'react'
import { applications, stages, programs } from '@/lib/data'
import type { Application } from '@/types'
import type { CandidaturaRecord } from '@/lib/store'
import Pill from '@/components/ui/Pill'
import KPI from '@/components/ui/KPI'
import Modal from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import Icon from '@/components/ui/Icon'

const PIPELINE_STAGES = ['triagem', 'entrevista1', 'entrevista2', 'avaliacao', 'aprovacao', 'oferta']

function scoreTone(score: number): 'success' | 'warn' | 'danger' {
  if (score >= 85) return 'success'
  if (score >= 70) return 'warn'
  return 'danger'
}

function stageTone(stage: string): 'info' | 'warn' | 'success' | 'danger' | 'neutral' {
  if (stage === 'oferta') return 'success'
  if (stage === 'rejeitado') return 'danger'
  if (stage === 'aprovacao') return 'info'
  return 'neutral'
}

function stageLabel(stageId: string) {
  return stages.find(s => s.id === stageId)?.label ?? stageId
}

const PROG_NAMES: Record<string, string> = {
  fbfa: 'Futuro BFA',
  bif:  'Bolsa Internacional',
  bnac: 'Bolsa Nacional',
  lid:  'Programa Liderança+',
  mest: 'Mestrado Patrocinado',
}

function StatusPill({ status }: { status: CandidaturaRecord['status'] }) {
  const cfg = {
    pendente:  { bg: '#FEF3C7', color: '#92400E', label: 'Pendente' },
    aprovada:  { bg: '#D1FAE5', color: '#065F46', label: 'Aprovada' },
    recusada:  { bg: '#FEE2E2', color: '#991B1B', label: 'Recusada' },
  }[status]
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {cfg.label}
    </span>
  )
}

const PROGRAMS_OPTS = [
  { id: 'fbfa', name: 'Futuro BFA' },
  { id: 'bif',  name: 'Bolsa Internacional' },
  { id: 'bnac', name: 'Bolsa Nacional' },
  { id: 'lid',  name: 'Liderança+' },
  { id: 'mest', name: 'Mestrado Patrocinado' },
  { id: 'vol',  name: 'Voluntariado' },
]

function TipoBadge({ tipo }: { tipo: string }) {
  const cfg =
    tipo === 'estagiario'   ? { bg: '#FF760715', color: '#FF7607', label: 'Estagiário' } :
    tipo === 'bolseiro'     ? { bg: '#1D4ED815', color: '#1D4ED8', label: 'Bolseiro' } :
    tipo === 'voluntariado' ? { bg: '#10B98115', color: '#10B981', label: 'Voluntariado' } :
                              { bg: '#f3f4f6',   color: '#6b7280', label: tipo }
  return (
    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

export default function CandidaturasPage() {
  const [selected, setSelected] = useState<Application | null>(null)
  const [realCandidaturas, setRealCandidaturas] = useState<CandidaturaRecord[]>([])
  const [loadingReal, setLoadingReal] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tipoFilter, setTipoFilter] = useState('')
  const [novaModal, setNovaModal] = useState(false)
  const [novaForm, setNovaForm] = useState({ name: '', email: '', program: 'fbfa', tipo: 'estagiario', course: '', uni: '', country: 'Angola', source: 'Manual' })

  useEffect(() => {
    fetch('/api/candidaturas')
      .then(r => r.json())
      .then(setRealCandidaturas)
      .catch(() => {})
      .finally(() => setLoadingReal(false))
  }, [])

  async function updateStatus(ref: string, status: 'aprovada' | 'recusada') {
    setActionLoading(ref + status)
    try {
      await fetch(`/api/candidaturas/${ref}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setRealCandidaturas(prev => prev.map(c => c.ref === ref ? { ...c, status } : c))
    } finally {
      setActionLoading(null)
    }
  }

  const filteredApps = tipoFilter ? applications.filter(a => a.tipo === tipoFilter) : applications
  const total = filteredApps.length
  const inProcess = filteredApps.filter(a => !['oferta', 'rejeitado'].includes(a.stage)).length
  const offers = filteredApps.filter(a => a.stage === 'oferta').length
  const rejected = filteredApps.filter(a => a.stage === 'rejeitado').length

  const byStage = (stageId: string) => filteredApps.filter(a => a.stage === stageId)

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Candidaturas</h1>
          <p className="page-subtitle">Funil de recrutamento — Q2 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="select" value={tipoFilter} onChange={e => setTipoFilter(e.target.value)}>
            <option value="">Todos os tipos</option>
            <option value="estagiario">Estagiários</option>
            <option value="bolseiro">Bolseiros</option>
            <option value="voluntariado">Voluntariado</option>
          </select>
          <button className="btn btn-primary" onClick={() => setNovaModal(true)}>
            <Icon name="plus" size={15} />
            Nova candidatura
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total candidaturas" value={total} icon="funnel" />
        <KPI label="Em processo" value={inProcess} icon="users" />
        <KPI label="Ofertas" value={offers} delta="Activas" deltaTone="up" icon="check" />
        <KPI label="Rejeitadas" value={rejected} delta="Este ciclo" deltaTone="flat" icon="x" />
      </div>

      {/* Kanban funnel */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <span className="card-title">Pipeline de candidaturas</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, 1fr)`,
            gap: 12,
            overflowX: 'auto',
          }}
        >
          {PIPELINE_STAGES.map(stageId => {
            const stageApps = byStage(stageId)
            const label = stageLabel(stageId)
            return (
              <div key={stageId}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{label}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'var(--surface-2, #f0f0f0)',
                      borderRadius: 10,
                      padding: '1px 7px',
                    }}
                  >
                    {stageApps.length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stageApps.map(app => {
                    const prog = programs.find(p => p.id === app.program)
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelected(app)}
                        style={{
                          background: 'var(--surface-2, #f8f8f8)',
                          border: '1px solid var(--border, #e5e7eb)',
                          borderRadius: 8,
                          padding: '10px 12px',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{app.name}</span>
                          <TipoBadge tipo={app.tipo} />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11,
                            opacity: 0.65,
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: prog?.color ?? '#ccc',
                              display: 'inline-block',
                            }}
                          />
                          {prog?.name ?? app.program} · {app.uni}
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '1px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              scoreTone(app.score) === 'success'
                                ? 'var(--success-bg, #d1fae5)'
                                : scoreTone(app.score) === 'warn'
                                ? 'var(--warn-bg, #fef3c7)'
                                : 'var(--danger-bg, #fee2e2)',
                            color:
                              scoreTone(app.score) === 'success'
                                ? 'var(--success, #059669)'
                                : scoreTone(app.score) === 'warn'
                                ? 'var(--warn, #d97706)'
                                : 'var(--danger, #dc2626)',
                          }}
                        >
                          {app.score}
                        </span>
                      </div>
                    )
                  })}
                  {stageApps.length === 0 && (
                    <div
                      style={{
                        fontSize: 12,
                        opacity: 0.35,
                        textAlign: 'center',
                        padding: '16px 0',
                        border: '1px dashed var(--border, #e5e7eb)',
                        borderRadius: 8,
                      }}
                    >
                      Sem candidatos
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Full table */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Todas as candidaturas</span>
          <span style={{ fontSize: 12, opacity: 0.55 }}>{total} registos</span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Programa</th>
              <th>Stage</th>
              <th>Score</th>
              <th>Fonte</th>
              <th>Data</th>
              <th>Acções</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => {
              const prog = programs.find(p => p.id === app.program)
              const tone = scoreTone(app.score)
              return (
                <tr key={app.id}>
                  <td style={{ fontSize: 12, opacity: 0.55 }}>{app.id}</td>
                  <td>
                    <div className="cell-person">
                      <Avatar name={app.name} size={28} />
                      <div className="meta">
                        <span className="name">{app.name}</span>
                        <span className="sub">{app.course} · {app.uni}</span>
                      </div>
                    </div>
                  </td>
                  <td><TipoBadge tipo={app.tipo} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: prog?.color ?? '#ccc',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13 }}>{prog?.name}</span>
                    </div>
                  </td>
                  <td>
                    <Pill tone={stageTone(app.stage)}>{stageLabel(app.stage)}</Pill>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 700,
                        background:
                          tone === 'success'
                            ? 'var(--success-bg, #d1fae5)'
                            : tone === 'warn'
                            ? 'var(--warn-bg, #fef3c7)'
                            : 'var(--danger-bg, #fee2e2)',
                        color:
                          tone === 'success'
                            ? 'var(--success, #059669)'
                            : tone === 'warn'
                            ? 'var(--warn, #d97706)'
                            : 'var(--danger, #dc2626)',
                      }}
                    >
                      {app.score}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{app.source}</td>
                  <td style={{ fontSize: 13 }}>{app.appliedAt}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => setSelected(app)}>
                      Ver
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Real portal submissions */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-head">
          <span className="card-title">Candidaturas recebidas via portal</span>
          <span style={{ fontSize: 12, opacity: 0.55 }}>{realCandidaturas.length} {realCandidaturas.length === 1 ? 'registo' : 'registos'}</span>
        </div>
        {loadingReal ? (
          <p style={{ padding: '20px 0', fontSize: 13, opacity: 0.5 }}>A carregar…</p>
        ) : realCandidaturas.length === 0 ? (
          <p style={{ padding: '20px 0', fontSize: 13, opacity: 0.5 }}>Nenhuma candidatura submetida pelo portal ainda.</p>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Referência</th>
                <th>Nome</th>
                <th>Programa</th>
                <th>Curso · Universidade</th>
                <th>Média</th>
                <th>Estado</th>
                <th>Submetida em</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {realCandidaturas.map(c => (
                <tr key={c.ref}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.7 }}>{c.ref}</td>
                  <td>
                    <div className="cell-person">
                      <Avatar name={c.nome} size={28} />
                      <div className="meta">
                        <span className="name">{c.nome}</span>
                        <span className="sub">{c.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{PROG_NAMES[c.program] ?? c.program}</td>
                  <td style={{ fontSize: 13 }}>{c.curso} · {c.uni}</td>
                  <td style={{ fontSize: 13 }}>{c.media}/20</td>
                  <td><StatusPill status={c.status} /></td>
                  <td style={{ fontSize: 12, opacity: 0.6 }}>{new Date(c.submittedAt).toLocaleDateString('pt-PT')}</td>
                  <td>
                    {c.status === 'pendente' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-sm"
                          style={{ background: '#065F46', color: '#fff', borderColor: '#065F46' }}
                          disabled={!!actionLoading}
                          onClick={() => updateStatus(c.ref, 'aprovada')}
                        >
                          {actionLoading === c.ref + 'aprovada' ? '…' : 'Aprovar'}
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: '#FEE2E2', color: '#991B1B', borderColor: '#FCA5A5' }}
                          disabled={!!actionLoading}
                          onClick={() => updateStatus(c.ref, 'recusada')}
                        >
                          {actionLoading === c.ref + 'recusada' ? '…' : 'Recusar'}
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, opacity: 0.5 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {novaModal && (
        <Modal title="Nova Candidatura" onClose={() => setNovaModal(false)} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Nome completo *</label>
                <input className="input" style={{ width: '100%' }} value={novaForm.name} onChange={e => setNovaForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Email *</label>
                <input className="input" type="email" style={{ width: '100%' }} value={novaForm.email} onChange={e => setNovaForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Tipo</label>
                <select className="select" style={{ width: '100%' }} value={novaForm.tipo} onChange={e => setNovaForm(f => ({ ...f, tipo: e.target.value }))}>
                  <option value="estagiario">Estagiário</option>
                  <option value="bolseiro">Bolseiro</option>
                  <option value="voluntariado">Voluntariado</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Programa</label>
                <select className="select" style={{ width: '100%' }} value={novaForm.program} onChange={e => setNovaForm(f => ({ ...f, program: e.target.value }))}>
                  {PROGRAMS_OPTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Curso</label>
                <input className="input" style={{ width: '100%' }} value={novaForm.course} onChange={e => setNovaForm(f => ({ ...f, course: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Universidade</label>
                <input className="input" style={{ width: '100%' }} value={novaForm.uni} onChange={e => setNovaForm(f => ({ ...f, uni: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>País</label>
                <input className="input" style={{ width: '100%' }} value={novaForm.country} onChange={e => setNovaForm(f => ({ ...f, country: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Fonte</label>
                <select className="select" style={{ width: '100%' }} value={novaForm.source} onChange={e => setNovaForm(f => ({ ...f, source: e.target.value }))}>
                  {['Manual', 'Portal', 'LinkedIn', 'Referência', 'Feira Universitária'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button className="btn" onClick={() => setNovaModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                disabled={!novaForm.name.trim() || !novaForm.email.trim()}
                onClick={() => setNovaModal(false)}
              >
                Adicionar candidatura
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {selected && (
        <Modal
          title={`Candidatura — ${selected.name}`}
          onClose={() => setSelected(null)}
          width={600}
        >
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">ID</span>
              <span className="info-value">{selected.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nome</span>
              <span className="info-value">{selected.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Programa</span>
              <span className="info-value">
                {programs.find(p => p.id === selected.program)?.name}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Curso</span>
              <span className="info-value">{selected.course}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Universidade</span>
              <span className="info-value">{selected.uni}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Stage</span>
              <span className="info-value">
                <Pill tone={stageTone(selected.stage)}>{stageLabel(selected.stage)}</Pill>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Score</span>
              <span className="info-value">
                <Pill tone={scoreTone(selected.score)}>{selected.score} / 100</Pill>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Fonte</span>
              <span className="info-value">{selected.source}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data de candidatura</span>
              <span className="info-value">{selected.appliedAt}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
