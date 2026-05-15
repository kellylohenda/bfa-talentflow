'use client'
import { useState } from 'react'
import KPI from '@/components/ui/KPI'
import Bar from '@/components/ui/Bar'

const YEARS = ['2026', '2025', '2024']

const retentionByProgram = [
  { prog: 'Futuro BFA',         total: 42, retained: 38, hired: 12, rate: 90 },
  { prog: 'Bolsa Internacional',total: 18, retained: 16, hired: 6,  rate: 89 },
  { prog: 'Bolsa Nacional',     total: 35, retained: 28, hired: 8,  rate: 80 },
  { prog: 'Liderança+',         total: 12, retained: 12, hired: 5,  rate: 100 },
  { prog: 'Mestrado Patrocin.', total: 8,  retained: 8,  hired: 3,  rate: 100 },
]

const retentionByYear = [
  { year: '2022', rate: 78 },
  { year: '2023', rate: 83 },
  { year: '2024', rate: 86 },
  { year: '2025', rate: 88 },
  { year: '2026', rate: 91 },
]

const exitReasons = [
  { reason: 'Proposta externa (salário)', count: 8,  pct: 38 },
  { reason: 'Conclusão de bolsa',         count: 5,  pct: 24 },
  { reason: 'Motivos pessoais',           count: 4,  pct: 19 },
  { reason: 'Desempenho insuficiente',    count: 3,  pct: 14 },
  { reason: 'Relocação geográfica',       count: 1,  pct: 5 },
]

export default function RetencaoPage() {
  const [year, setYear] = useState('2026')

  const hired = 34
  const active = 156
  const avgRetention = Math.round(retentionByProgram.reduce((s, r) => s + r.rate, 0) / retentionByProgram.length)

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Retenção</h1>
          <p className="page-subtitle">Análise de retenção e contratação de ex-bolseiros</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="select" value={year} onChange={e => setYear(e.target.value)}>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => window.print()}>Exportar</button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Taxa de Retenção" value={`${avgRetention}%`} sub="Média todos os programas" delta="+3pts vs 2025" deltaTone="up" icon="users" />
        <KPI label="Contratados BFA" value={hired} sub="Ex-bolseiros efectivos" delta="Efectivos" deltaTone="up" icon="check" />
        <KPI label="Em Programa" value={active} sub="Activos actualmente" icon="star" />
        <KPI label="Meta Retenção" value="90%" sub="Objectivo anual" delta="Atingido" deltaTone="up" icon="layers" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-head"><span className="card-title">Retenção por Programa</span></div>
          {retentionByProgram.map(r => (
            <div key={r.prog} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{r.prog}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{r.rate}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <Bar value={r.rate} tone={r.rate >= 90 ? 'success' : r.rate >= 80 ? 'warn' : 'danger'} />
                </div>
                <span style={{ fontSize: 11, opacity: 0.55, whiteSpace: 'nowrap' }}>{r.retained}/{r.total}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Evolução da Taxa (últimos 5 anos)</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {retentionByYear.map(r => (
              <div key={r.year} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, minWidth: 40 }}>{r.year}</span>
                <div style={{ flex: 1 }}>
                  <Bar value={r.rate} tone={r.rate >= 90 ? 'success' : 'warn'} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{r.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">Motivos de Saída</span></div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Motivo</th>
              <th>Casos</th>
              <th>Distribuição</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {exitReasons.map(r => (
              <tr key={r.reason}>
                <td>{r.reason}</td>
                <td><strong>{r.count}</strong></td>
                <td style={{ minWidth: 160 }}>
                  <Bar value={r.pct} tone={r.reason.includes('Proposta') ? 'warn' : ''} />
                </td>
                <td>{r.pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
