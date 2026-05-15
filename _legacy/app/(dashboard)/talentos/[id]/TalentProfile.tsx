'use client'

import { useState } from 'react'
import { talents, programs, payments, tasks, statuses } from '@/lib/data'
import { fmtKz } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import Pill from '@/components/ui/Pill'
import Bar from '@/components/ui/Bar'
import KPI from '@/components/ui/KPI'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'

type ToneType = 'success' | 'warn' | 'danger' | 'info' | 'neutral' | 'primary'

function statusTone(status: string): ToneType {
  const map: Record<string, ToneType> = {
    active:     'success',
    delayed:    'warn',
    risk:       'danger',
    completed:  'info',
    hired:      'primary',
    onboarding: 'info',
    pending:    'neutral',
  }
  return map[status] ?? 'neutral'
}

const COMPETENCIES = [
  'Atitude',
  'Desempenho técnico',
  'Iniciativa',
  'Comunicação',
  'Trabalho em equipa',
]

const EVAL_SCORES: Record<string, number[]> = {
  Q1: [4, 4, 3, 5, 4],
  Q2: [4, 5, 4, 5, 5],
}

interface Props {
  talentId: string
}

export default function TalentProfile({ talentId }: Props) {
  const [activeTab, setActiveTab] = useState<'visao' | 'avaliacoes' | 'tarefas' | 'historico'>('visao')

  const talent = talents.find(t => t.id === talentId)
  if (!talent) {
    return (
      <div className="section">
        <div className="page-head">
          <h1 className="page-title">Talento não encontrado</h1>
        </div>
        <Link href="/talentos" className="btn">
          ← Voltar
        </Link>
      </div>
    )
  }

  const prog = programs.find(p => p.id === talent.program)
  const talentPayments = payments.filter(p => p.talent === talent.id)
  const talentTasks = tasks.filter(t => t.talentId === talent.id)

  const riskTone = talent.riskScore >= 0.6 ? 'danger' : talent.riskScore >= 0.4 ? 'warn' : 'success'

  return (
    <div className="section">
      {/* Breadcrumb */}
      <div style={{ marginBottom: 12 }}>
        <Link href="/talentos" style={{ fontSize: 13, opacity: 0.6, textDecoration: 'none' }}>
          ← Talentos
        </Link>
      </div>

      {/* Header */}
      <div
        className="card"
        style={{ marginBottom: 20, padding: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <Avatar name={talent.name} size={72} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{talent.name}</h1>
              {prog && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: 20,
                    background: prog.color + '22',
                    color: prog.color,
                    border: `1px solid ${prog.color}44`,
                  }}
                >
                  {prog.name}
                </span>
              )}
              <Pill tone={statusTone(talent.status)}>
                {statuses[talent.status]?.label ?? talent.status}
              </Pill>
            </div>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.65 }}>
              {talent.course} · {talent.university} · {talent.city}, {talent.country}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.5 }}>
              ID {talent.id} · Início {talent.startDate}
            </p>
          </div>
          <button className="btn btn-sm">
            <Icon name="cog" size={14} />
            Editar
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid cols-3" style={{ marginBottom: 20 }}>
        <KPI label="GPA" value={talent.gpa} sub={`${talent.year}`} icon="graduation" />
        <div className="kpi">
          <div className="kpi-label">
            <span style={{ marginRight: 6, opacity: 0.6 }}>
              <Icon name="trending" size={14} />
            </span>
            Performance
          </div>
          <div className="kpi-value">{talent.perf}</div>
          <div style={{ marginTop: 6 }}>
            <Bar
              value={talent.perf}
              tone={talent.perf >= 85 ? 'success' : talent.perf >= 70 ? 'warn' : 'danger'}
            />
          </div>
        </div>
        <KPI
          label="Subsídio mensal"
          value={talent.stipend > 0 ? fmtKz(talent.stipend) : '—'}
          icon="cash"
        />
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {(
          [
            { key: 'visao', label: 'Visão Geral' },
            { key: 'avaliacoes', label: 'Avaliações' },
            { key: 'tarefas', label: 'Tarefas', count: talentTasks.length },
            { key: 'historico', label: 'Histórico', count: talentPayments.length },
          ] as const
        ).map(tab => (
          <button
            key={tab.key}
            className={`tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {'count' in tab && tab.count !== undefined && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'visao' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Informação geral</span>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Universidade</span>
              <span className="info-value">{talent.university}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Curso</span>
              <span className="info-value">{talent.course}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ano</span>
              <span className="info-value">{talent.year}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Cidade / País</span>
              <span className="info-value">{talent.city}, {talent.country}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Departamento</span>
              <span className="info-value">{talent.dept}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mentor</span>
              <span className="info-value">{talent.mentor}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data de início</span>
              <span className="info-value">{talent.startDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Último relatório</span>
              <span className="info-value">{talent.lastReport}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Potencial</span>
              <span className="info-value" style={{ textTransform: 'capitalize' }}>
                {talent.potential}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>Score de risco</span>
              <Pill tone={riskTone}>{Math.round(talent.riskScore * 100)}%</Pill>
            </div>
            <Bar
              value={Math.round(talent.riskScore * 100)}
              tone={riskTone === 'success' ? '' : riskTone}
            />
          </div>
        </div>
      )}

      {activeTab === 'avaliacoes' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Avaliações 360°</span>
            <Pill tone="info">Ciclo Q2 2026</Pill>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Competência</th>
                <th>Q1 2026</th>
                <th>Q2 2026</th>
                <th>Evolução</th>
              </tr>
            </thead>
            <tbody>
              {COMPETENCIES.map((comp, i) => {
                const q1 = EVAL_SCORES.Q1[i]
                const q2 = EVAL_SCORES.Q2[i]
                const delta = q2 - q1
                return (
                  <tr key={comp}>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{comp}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <span
                            key={s}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              fontWeight: 700,
                              background: s <= q1 ? 'var(--primary, #FF7607)' : 'var(--surface-2, #f0f0f0)',
                              color: s <= q1 ? '#fff' : 'var(--text-muted, #999)',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <span
                            key={s}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              fontWeight: 700,
                              background: s <= q2 ? 'var(--primary, #FF7607)' : 'var(--surface-2, #f0f0f0)',
                              color: s <= q2 ? '#fff' : 'var(--text-muted, #999)',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color:
                            delta > 0
                              ? 'var(--success, #059669)'
                              : delta < 0
                              ? 'var(--danger, #dc2626)'
                              : 'var(--text-muted, #999)',
                        }}
                      >
                        {delta > 0 ? '+' : ''}{delta}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'tarefas' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Tarefas</span>
            <span style={{ fontSize: 12, opacity: 0.55 }}>{talentTasks.length} tarefas</span>
          </div>
          {talentTasks.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.45, padding: 32 }}>
              Sem tarefas atribuídas
            </p>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Prioridade</th>
                  <th>Estado</th>
                  <th>Prazo</th>
                  <th>Atribuído por</th>
                </tr>
              </thead>
              <tbody>
                {talentTasks.map(task => {
                  const stateTone: ToneType =
                    task.status === 'done'
                      ? 'success'
                      : task.status === 'overdue'
                      ? 'danger'
                      : task.status === 'in_progress'
                      ? 'info'
                      : 'neutral'
                  const stateLabel =
                    task.status === 'done'
                      ? 'Concluída'
                      : task.status === 'overdue'
                      ? 'Em atraso'
                      : task.status === 'in_progress'
                      ? 'Em curso'
                      : 'Pendente'
                  const priTone: ToneType =
                    task.priority === 'alta'
                      ? 'danger'
                      : task.priority === 'média'
                      ? 'warn'
                      : 'neutral'
                  return (
                    <tr key={task.id}>
                      <td style={{ fontSize: 12, opacity: 0.55 }}>{task.id}</td>
                      <td style={{ fontSize: 13 }}>{task.title}</td>
                      <td style={{ fontSize: 13 }}>{task.category}</td>
                      <td>
                        <Pill tone={priTone}>{task.priority}</Pill>
                      </td>
                      <td>
                        <Pill tone={stateTone}>{stateLabel}</Pill>
                      </td>
                      <td style={{ fontSize: 13 }}>{task.dueDate}</td>
                      <td style={{ fontSize: 13 }}>{task.assignedBy}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Histórico de pagamentos</span>
            <span style={{ fontSize: 12, opacity: 0.55 }}>{talentPayments.length} registos</span>
          </div>
          {talentPayments.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.45, padding: 32 }}>
              Sem pagamentos registados
            </p>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Período</th>
                  <th>Valor</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Pago em</th>
                </tr>
              </thead>
              <tbody>
                {talentPayments.map(p => {
                  const payTone: ToneType =
                    p.status === 'paid'
                      ? 'success'
                      : p.status === 'pending'
                      ? 'warn'
                      : p.status === 'failed'
                      ? 'danger'
                      : 'neutral'
                  const payLabel =
                    p.status === 'paid'
                      ? 'Pago'
                      : p.status === 'pending'
                      ? 'Pendente'
                      : p.status === 'failed'
                      ? 'Falhado'
                      : 'Suspenso'
                  return (
                    <tr key={p.id}>
                      <td style={{ fontSize: 12, opacity: 0.55 }}>{p.id}</td>
                      <td style={{ fontSize: 13 }}>{p.type}</td>
                      <td style={{ fontSize: 13 }}>{p.period}</td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>{fmtKz(p.amount)}</td>
                      <td style={{ fontSize: 13 }}>{p.method}</td>
                      <td>
                        <Pill tone={payTone}>{payLabel}</Pill>
                      </td>
                      <td style={{ fontSize: 13 }}>{p.paidAt ?? '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
