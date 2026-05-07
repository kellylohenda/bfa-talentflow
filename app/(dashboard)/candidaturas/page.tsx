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

export default function CandidaturasPage() {
  const [selected, setSelected] = useState<Application | null>(null)
  const [realCandidaturas, setRealCandidaturas] = useState<CandidaturaRecord[]>([])
  const [loadingReal, setLoadingReal] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

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

  const total = applications.length
  const inProcess = applications.filter(a => !['oferta', 'rejeitado'].includes(a.stage)).length
  const offers = applications.filter(a => a.stage === 'oferta').length
  const rejected = applications.filter(a => a.stage === 'rejeitado').length

  const byStage = (stageId: string) => applications.filter(a => a.stage === stageId)

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Candidaturas</h1>
          <p className="page-subtitle">Funil de recrutamento — Q2 2026</p>
        </div>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} />
          Nova candidatura
        </button>
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
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                          {app.name}
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
                          {prog?.name} · {app.uni}
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
              <th>Programa</th>
              <th>Stage</th>
              <th>Score</th>
              <th>Fonte</th>
              <th>Data</th>
              <th>Acções</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => {
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
