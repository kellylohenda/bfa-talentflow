'use client'
import { useState } from 'react'
import { fmtKzShort } from '@/lib/utils'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Bar from '@/components/ui/Bar'

const YEARS = ['2026', '2025', '2024']

const roiByProgram = [
  { prog: 'Futuro BFA',         invested: 142000000, hired: 12, salaryOffset: 280000000, roi: 97 },
  { prog: 'Bolsa Internacional',invested: 98000000,  hired: 6,  salaryOffset: 168000000, roi: 71 },
  { prog: 'Bolsa Nacional',     invested: 56000000,  hired: 8,  salaryOffset: 144000000, roi: 157 },
  { prog: 'Liderança+',         invested: 38000000,  hired: 5,  salaryOffset: 120000000, roi: 216 },
  { prog: 'Mestrado Patrocin.', invested: 74000000,  hired: 3,  salaryOffset: 96000000,  roi: 30 },
]

const costBreakdown = [
  { label: 'Subsídios mensais',      amount: 185000000, pct: 42 },
  { label: 'Propinas internacionais',amount: 132000000, pct: 30 },
  { label: 'Alojamento',             amount: 66000000,  pct: 15 },
  { label: 'Material didáctico',     amount: 22000000,  pct: 5 },
  { label: 'Outros',                 amount: 35200000,  pct: 8 },
]

export default function ROIPage() {
  const [year, setYear] = useState('2026')

  const totalInvested = roiByProgram.reduce((s, r) => s + r.invested, 0)
  const totalHired = roiByProgram.reduce((s, r) => s + r.hired, 0)
  const avgROI = Math.round(roiByProgram.reduce((s, r) => s + r.roi, 0) / roiByProgram.length)
  const costPerHire = Math.round(totalInvested / totalHired)

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">ROI & Análise de Custos</h1>
          <p className="page-subtitle">Retorno sobre investimento dos programas de talento</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="select" value={year} onChange={e => setYear(e.target.value)}>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
          <button className="btn btn-primary">Exportar</button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total Investido" value={fmtKzShort(totalInvested)} sub={`${year} YTD`} icon="cash" />
        <KPI label="ROI Médio" value={`${avgROI}%`} sub="Todos os programas" delta="+12pts vs 2025" deltaTone="up" icon="star" />
        <KPI label="Custo por Contratação" value={fmtKzShort(costPerHire)} sub="vs recrutamento externo" icon="users" />
        <KPI label="Contratações Geradas" value={totalHired} sub="Ex-bolseiros efectivos" delta="Efectivos" deltaTone="up" icon="check" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-head"><span className="card-title">ROI por Programa</span></div>
          {roiByProgram.map(r => (
            <div key={r.prog} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{r.prog}</span>
                <Pill tone={r.roi >= 100 ? 'success' : r.roi >= 50 ? 'warn' : 'neutral'}>ROI {r.roi}%</Pill>
              </div>
              <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 4 }}>
                Investido: {fmtKzShort(r.invested)} · Retorno est.: {fmtKzShort(r.salaryOffset)} · {r.hired} contrat.
              </div>
              <Bar value={Math.min(r.roi, 100)} tone={r.roi >= 100 ? 'success' : r.roi >= 50 ? 'warn' : 'danger'} />
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Distribuição de Custos</span></div>
          {costBreakdown.map(c => (
            <div key={c.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13 }}>{c.label}</span>
                <span style={{ fontSize: 12, opacity: 0.55 }}>{fmtKzShort(c.amount)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}><Bar value={c.pct} tone="warn" /></div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{c.pct}%</span>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Total</strong>
              <strong>{fmtKzShort(costBreakdown.reduce((s, c) => s + c.amount, 0))}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">Comparação: Custo Próprio vs Recrutamento Externo</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, padding: '8px 0' }}>
          {[
            { label: 'Custo médio — formação interna', value: fmtKzShort(costPerHire),              color: 'var(--success)', note: 'Por contratação via programa' },
            { label: 'Custo — recrutamento externo',   value: fmtKzShort(costPerHire * 2.4),         color: 'var(--danger)', note: 'Estimativa head-hunter' },
            { label: 'Poupança total acumulada',       value: fmtKzShort(costPerHire * 1.4 * totalHired), color: 'var(--primary)', note: '2022–2026' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: 20, background: 'var(--surface-2)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 11, opacity: 0.55, marginTop: 6 }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
