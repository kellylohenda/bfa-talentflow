'use client'
import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Bar from '@/components/ui/Bar'

type AlertSeverity = 'high' | 'medium' | 'low'

interface ComplianceAlert {
  id: string
  talent: string
  type: string
  description: string
  severity: AlertSeverity
  dueDate: string
  status: 'open' | 'resolved'
}

const ALERTS: ComplianceAlert[] = [
  { id: 'CA-001', talent: 'Adélio Sebastião',      type: 'Documentação',  description: 'Boletim académico Q1 em falta — prazo ultrapassado há 14 dias.',      severity: 'high',   dueDate: '2026-04-15', status: 'open' },
  { id: 'CA-002', talent: 'Nzinga Matondo',         type: 'Pagamento',     description: 'Pagamento SWIFT falhou — IBAN inválido. Reprocessamento necessário.',  severity: 'high',   dueDate: '2026-05-07', status: 'open' },
  { id: 'CA-003', talent: 'Walter Tchitangueleca',  type: 'Faltas',        description: 'Terceira falta injustificada — advertência formal emitida.',            severity: 'high',   dueDate: '2026-04-20', status: 'resolved' },
  { id: 'CA-004', talent: 'Esperança Quimbamba',    type: 'Relatório',     description: 'Relatório semestral pendente — prazo em 3 dias.',                      severity: 'medium', dueDate: '2026-05-08', status: 'open' },
  { id: 'CA-005', talent: 'Adélio Sebastião',      type: 'Desempenho',    description: 'Risco de incumprimento — GPA abaixo do mínimo (13,2 < 14).',           severity: 'medium', dueDate: '2026-06-01', status: 'open' },
  { id: 'CA-006', talent: 'Helga Pacavira',         type: 'Relatório',     description: 'Relatório trimestral Q1 pendente.',                                    severity: 'medium', dueDate: '2026-05-15', status: 'open' },
  { id: 'CA-007', talent: 'Fernando Ngoma',         type: 'Onboarding',    description: 'Documentação de onboarding incompleta — falta NIF.',                   severity: 'low',    dueDate: '2026-05-20', status: 'open' },
  { id: 'CA-008', talent: 'Beatriz Sapalo',         type: 'Pós-conclusão', description: 'Proposta de contratação enviada — aguarda assinatura.',                severity: 'low',    dueDate: '2026-05-31', status: 'open' },
]

const complianceChecks = [
  { area: 'Documentação académica',  score: 84, required: 90 },
  { area: 'Relatórios de progresso', score: 76, required: 85 },
  { area: 'Pagamentos em dia',       score: 92, required: 95 },
  { area: 'Avaliações de mentor',    score: 88, required: 90 },
  { area: 'Contratos assinados',     score: 100, required: 100 },
  { area: 'Seguros / Vistos',        score: 97, required: 95 },
]

export default function CompliancePage() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(ALERTS)
  const [filter, setFilter] = useState<string>('all')

  const open = alerts.filter(a => a.status === 'open')
  const high = open.filter(a => a.severity === 'high')

  const resolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a))
  }

  const visible = filter === 'all' ? alerts
    : filter === 'open' ? alerts.filter(a => a.status === 'open')
    : filter === 'resolved' ? alerts.filter(a => a.status === 'resolved')
    : alerts.filter(a => a.severity === filter)

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Compliance</h1>
          <p className="page-subtitle">Conformidade regulatória e alertas de incumprimento</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>Relatório Compliance</button>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Alertas Abertos" value={open.length} sub="Requerem acção" delta={open.length > 3 ? 'Urgente' : 'OK'} deltaTone={open.length > 3 ? 'down' : 'up'} icon="alert" />
        <KPI label="Críticos" value={high.length} sub="Severidade alta" delta={high.length > 0 ? 'Atenção' : 'OK'} deltaTone={high.length > 0 ? 'down' : 'up'} icon="x" />
        <KPI label="Score Compliance" value="87%" sub="Meta: 95%" delta="-8pts" deltaTone="down" icon="check" />
        <KPI label="Resolvidos (30d)" value={alerts.filter(a => a.status === 'resolved').length} sub="Último mês" delta="Fechados" deltaTone="up" icon="star" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-head"><span className="card-title">Áreas de Conformidade</span></div>
          {complianceChecks.map(c => (
            <div key={c.area} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13 }}>{c.area}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, opacity: 0.5 }}>Meta: {c.required}%</span>
                  <Pill tone={c.score >= c.required ? 'success' : c.score >= c.required - 10 ? 'warn' : 'danger'}>{c.score}%</Pill>
                </div>
              </div>
              <Bar value={c.score} tone={c.score >= c.required ? 'success' : c.score >= c.required - 10 ? 'warn' : 'danger'} />
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Resumo por Tipo</span></div>
          {Array.from(new Set(ALERTS.map(a => a.type))).map(type => {
            const count = open.filter(a => a.type === type).length
            return count > 0 ? (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13 }}>{type}</span>
                <Pill tone={count >= 2 ? 'danger' : 'warn'}>{count}</Pill>
              </div>
            ) : null
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <span className="card-title">Alertas</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all','open','high','medium','low','resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : ''}`}>
                {f === 'all' ? 'Todos' : f === 'open' ? 'Abertos' : f === 'resolved' ? 'Resolvidos' : f === 'high' ? 'Alta' : f === 'medium' ? 'Média' : 'Baixa'}
              </button>
            ))}
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>Talento</th><th>Tipo</th><th>Descrição</th><th>Severidade</th><th>Prazo</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {visible.map(a => (
              <tr key={a.id}>
                <td style={{ fontSize: 12, opacity: 0.55 }}>{a.id}</td>
                <td>
                  <div className="cell-person">
                    <Avatar name={a.talent} size={24} />
                    <span>{a.talent}</span>
                  </div>
                </td>
                <td><Pill tone="neutral" dot={false}>{a.type}</Pill></td>
                <td style={{ fontSize: 12, maxWidth: 280 }}>{a.description}</td>
                <td>
                  <Pill tone={a.severity === 'high' ? 'danger' : a.severity === 'medium' ? 'warn' : 'neutral'}>
                    {a.severity === 'high' ? 'Alta' : a.severity === 'medium' ? 'Média' : 'Baixa'}
                  </Pill>
                </td>
                <td style={{ fontSize: 12 }}>{a.dueDate}</td>
                <td>
                  <Pill tone={a.status === 'open' ? 'warn' : 'success'}>
                    {a.status === 'open' ? 'Aberto' : 'Resolvido'}
                  </Pill>
                </td>
                <td>
                  {a.status === 'open' && (
                    <button className="btn btn-sm" onClick={() => resolve(a.id)}>Resolver</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
