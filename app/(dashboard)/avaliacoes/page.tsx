'use client'

import { useState } from 'react'
import { talents, programs } from '@/lib/data'
import type { Talent } from '@/types'
import Avatar from '@/components/ui/Avatar'
import Pill from '@/components/ui/Pill'
import KPI from '@/components/ui/KPI'
import Modal from '@/components/ui/Modal'
import Icon from '@/components/ui/Icon'

const CYCLE = 'Q2 2026'
const DUE = '2026-05-31'

const COMPETENCIES = [
  { key: 'atitude',     label: 'Atitude' },
  { key: 'tecnico',     label: 'Desempenho técnico' },
  { key: 'iniciativa',  label: 'Iniciativa' },
  { key: 'comunicacao', label: 'Comunicação' },
  { key: 'equipa',      label: 'Trabalho em equipa' },
]

const SCORE_COLORS = ['', '#dc2626', '#f97316', '#eab308', '#22c55e', '#059669']

interface EvalState {
  scores: Record<string, number>
  notes: string
  recommendation: string
}

const DEFAULT_EVAL: EvalState = {
  scores: {},
  notes: '',
  recommendation: '',
}

export default function AvaliacoesPage() {
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
  const [evalState, setEvalState] = useState<EvalState>(DEFAULT_EVAL)

  // For Q2 2026 cycle, mark submitted for perf > 93
  const isSubmitted = (t: Talent) =>
    submitted.has(t.id) || t.perf > 93

  const evaluations = talents.map(t => ({
    talent: t,
    submitted: isSubmitted(t),
  }))

  const totalCount = evaluations.length
  const submittedCount = evaluations.filter(e => e.submitted).length
  const pendingCount = totalCount - submittedCount

  const openModal = (t: Talent) => {
    setSelectedTalent(t)
    setEvalState(DEFAULT_EVAL)
  }

  const closeModal = () => {
    setSelectedTalent(null)
    setEvalState(DEFAULT_EVAL)
  }

  const setScore = (key: string, score: number) => {
    setEvalState(prev => ({
      ...prev,
      scores: { ...prev.scores, [key]: score },
    }))
  }

  const handleSubmit = () => {
    if (!selectedTalent) return
    const allScored = COMPETENCIES.every(c => evalState.scores[c.key])
    if (!allScored) {
      alert('Por favor, avalie todas as competências antes de submeter.')
      return
    }
    setSubmitted(prev => new Set(prev).add(selectedTalent.id))
    closeModal()
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Avaliações 360°</h1>
          <p className="page-subtitle">Ciclo {CYCLE} · Prazo {DUE}</p>
        </div>
        <button className="btn btn-primary">
          <Icon name="download" size={15} />
          Exportar relatório
        </button>
      </div>

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total avaliações" value={totalCount} icon="users" />
        <KPI
          label="Submetidas"
          value={submittedCount}
          delta={`${Math.round((submittedCount / totalCount) * 100)}%`}
          deltaTone="up"
          icon="check"
        />
        <KPI
          label="Pendentes"
          value={pendingCount}
          delta={pendingCount > 0 ? 'Requer acção' : 'Completo'}
          deltaTone={pendingCount > 0 ? 'down' : 'up'}
          icon="clock"
        />
        <KPI
          label="Ciclo actual"
          value={CYCLE}
          sub={`Prazo: ${DUE}`}
          icon="calendar"
        />
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Estado das avaliações</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Pill tone="success">{submittedCount} submetidas</Pill>
            <Pill tone="warn">{pendingCount} pendentes</Pill>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Talento</th>
              <th>Programa</th>
              <th>Ciclo</th>
              <th>Prazo</th>
              <th>Estado</th>
              <th>Acções</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map(({ talent: t, submitted: isSubmit }) => {
              const prog = programs.find(p => p.id === t.program)
              return (
                <tr key={t.id}>
                  <td>
                    <div className="cell-person">
                      <Avatar name={t.name} size={28} />
                      <div className="meta">
                        <span className="name">{t.name}</span>
                        <span className="sub">{t.course}</span>
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
                  <td style={{ fontSize: 13 }}>{CYCLE}</td>
                  <td style={{ fontSize: 13 }}>{DUE}</td>
                  <td>
                    {isSubmit ? (
                      <Pill tone="success">Submetida</Pill>
                    ) : (
                      <Pill tone="warn">Pendente</Pill>
                    )}
                  </td>
                  <td>
                    {isSubmit ? (
                      <button
                        className="btn btn-sm"
                        onClick={() => openModal(t)}
                      >
                        Ver avaliação
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => openModal(t)}
                      >
                        Avaliar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Evaluation Modal */}
      {selectedTalent && (
        <Modal
          title={`Avaliação 360° — ${selectedTalent.name} · ${CYCLE}`}
          onClose={closeModal}
          width={680}
          footer={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={closeModal}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                <Icon name="check" size={14} />
                Submeter avaliação
              </button>
            </div>
          }
        >
          <div>
            <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, opacity: 0.7 }}>
              Avalie cada competência de 1 (insuficiente) a 5 (excelente)
            </p>

            {COMPETENCIES.map(comp => {
              const current = evalState.scores[comp.key] ?? 0
              return (
                <div
                  key={comp.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 14,
                  }}
                >
                  <span style={{ width: 160, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
                    {comp.label}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        onClick={() => setScore(comp.key, s)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 6,
                          border: current === s
                            ? `2px solid ${SCORE_COLORS[s]}`
                            : '1px solid var(--border, #e5e7eb)',
                          background: current === s ? SCORE_COLORS[s] : 'transparent',
                          color: current === s ? '#fff' : 'inherit',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 14,
                          transition: 'all 0.15s',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {current > 0 && (
                    <span
                      style={{
                        fontSize: 12,
                        color: SCORE_COLORS[current],
                        fontWeight: 600,
                      }}
                    >
                      {current === 1
                        ? 'Insuficiente'
                        : current === 2
                        ? 'Abaixo do esperado'
                        : current === 3
                        ? 'Satisfatório'
                        : current === 4
                        ? 'Bom'
                        : 'Excelente'}
                    </span>
                  )}
                </div>
              )
            })}

            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Notas e observações</label>
              <textarea
                className="input"
                rows={3}
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Descreva o desempenho do talento, pontos fortes e áreas de melhoria..."
                value={evalState.notes}
                onChange={e =>
                  setEvalState(prev => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>

            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Recomendação</label>
              <select
                className="select"
                style={{ width: '100%' }}
                value={evalState.recommendation}
                onChange={e =>
                  setEvalState(prev => ({ ...prev, recommendation: e.target.value }))
                }
              >
                <option value="">Seleccionar recomendação...</option>
                <option value="continuar">Continuar no programa</option>
                <option value="promover">Promover / Acelerar</option>
                <option value="acompanhar">Acompanhar de perto</option>
                <option value="rever">Rever participação</option>
                <option value="contratar">Proposta de contratação</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
