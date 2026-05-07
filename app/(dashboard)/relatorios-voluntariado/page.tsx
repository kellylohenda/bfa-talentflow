'use client'

import { useState } from 'react'
import { volunteers, volunteerActivities, hoursEntries } from '@/lib/data'
import type { ActivityType } from '@/types'
import KPI from '@/components/ui/KPI'
import Icon from '@/components/ui/Icon'

const TYPE_LABEL: Record<ActivityType, string> = {
  saude:    'Saúde',
  educacao: 'Educação',
  ambiente: 'Ambiente',
  social:   'Social',
  cultura:  'Cultura',
}
const TYPE_COLOR: Record<ActivityType, string> = {
  saude:    '#EF4444',
  educacao: '#3B82F6',
  ambiente: '#10B981',
  social:   '#F59E0B',
  cultura:  '#8B5CF6',
}

type Period = 'S1-2026' | 'S2-2025' | '2025' | '2026'

const PERIOD_RANGES: Record<Period, { start: string; end: string; label: string }> = {
  'S1-2026': { start: '2026-01-01', end: '2026-06-30', label: '1º Semestre 2026' },
  'S2-2025': { start: '2025-07-01', end: '2025-12-31', label: '2º Semestre 2025' },
  '2025':    { start: '2025-01-01', end: '2025-12-31', label: 'Ano 2025' },
  '2026':    { start: '2026-01-01', end: '2026-12-31', label: 'Ano 2026' },
}

function inRange(date: string, start: string, end: string) {
  return date >= start && date <= end
}

export default function RelatoriosVoluntariadoPage() {
  const [period, setPeriod] = useState<Period>('S1-2026')
  const range = PERIOD_RANGES[period]

  // Filter activities and hours by period
  const periodActivities = volunteerActivities.filter(a => inRange(a.data, range.start, range.end))
  const periodHours      = hoursEntries.filter(h => inRange(h.data, range.start, range.end))

  const horasValidadas   = periodHours.filter(h => h.validado).reduce((s, h) => s + h.horas, 0)
  const horasPendentes   = periodHours.filter(h => !h.validado).reduce((s, h) => s + h.horas, 0)
  const voluntariosAtivos= new Set(periodHours.map(h => h.voluntarioId)).size
  const participacoes    = periodHours.length
  const concluidas       = periodActivities.filter(a => a.status === 'concluida').length

  // By type breakdown
  const byType = (['saude', 'educacao', 'ambiente', 'social', 'cultura'] as ActivityType[]).map(tipo => {
    const acts  = periodActivities.filter(a => a.tipo === tipo)
    const horas = periodHours
      .filter(h => {
        const act = periodActivities.find(a => a.id === h.actividadeId)
        return act?.tipo === tipo
      })
      .filter(h => h.validado)
      .reduce((s, h) => s + h.horas, 0)
    return { tipo, acts: acts.length, horas, inscritos: acts.reduce((s, a) => s + a.inscritos, 0) }
  }).filter(r => r.acts > 0)

  const maxHoras = Math.max(...byType.map(r => r.horas), 1)

  // Top volunteers in period
  const topVols = volunteers
    .map(v => {
      const h = periodHours.filter(h => h.voluntarioId === v.id && h.validado).reduce((s, h) => s + h.horas, 0)
      return { ...v, periodHoras: h }
    })
    .filter(v => v.periodHoras > 0)
    .sort((a, b) => b.periodHoras - a.periodHoras)
    .slice(0, 8)

  // Activities list for period
  const actList = periodActivities.sort((a, b) => a.data.localeCompare(b.data))

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Relatórios · Voluntariado</h1>
          <p className="page-subtitle">Fundação BFA — emissão semestral e anual</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600 }}
            value={period}
            onChange={e => setPeriod(e.target.value as Period)}
          >
            <option value="S1-2026">1º Semestre 2026</option>
            <option value="S2-2025">2º Semestre 2025</option>
            <option value="2026">Ano 2026</option>
            <option value="2025">Ano 2025</option>
          </select>
          <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="download" size={14} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Period banner */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="doc" size={16} style={{ opacity: 0.5 }} />
        <span style={{ fontWeight: 600, fontSize: 14 }}>Relatório de Actividades de Voluntariado</span>
        <span style={{ fontSize: 13, opacity: 0.6 }}>· {range.label}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.45 }}>
          Gerado em {new Date().toLocaleDateString('pt-PT')}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Actividades realizadas" value={concluidas}       icon="calendar" delta={`de ${periodActivities.length} agendadas`} deltaTone="up" />
        <KPI label="Voluntários envolvidos" value={voluntariosAtivos}icon="users"    delta={`de ${volunteers.filter(v=>v.status==='activo').length} activos`} deltaTone="up" />
        <KPI label="Horas validadas"        value={horasValidadas}   icon="clock"    delta={horasPendentes > 0 ? `+ ${horasPendentes} pendentes` : 'Tudo validado'} deltaTone={horasPendentes > 0 ? 'flat' : 'up'} />
        <KPI label="Participações totais"   value={participacoes}    icon="award" />
      </div>

      {/* By type breakdown */}
      <div className="grid cols-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-head">
            <span className="card-title">Horas por área temática</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            {byType.length === 0 && <p style={{ fontSize: 13, opacity: 0.4 }}>Sem dados no período.</p>}
            {byType.map(r => (
              <div key={r.tipo}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: TYPE_COLOR[r.tipo], flexShrink: 0 }} />
                    {TYPE_LABEL[r.tipo]}
                    <span style={{ fontSize: 11, opacity: 0.5 }}>· {r.acts} activ. · {r.inscritos} part.</span>
                  </span>
                  <span style={{ fontWeight: 700 }}>{r.horas} h</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(r.horas / maxHoras) * 100}%`, background: TYPE_COLOR[r.tipo], borderRadius: 3, transition: 'width 0.4s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top volunteers */}
        <div className="card">
          <div className="card-head">
            <span className="card-title">Voluntários mais activos</span>
          </div>
          {topVols.length === 0 && <p style={{ fontSize: 13, opacity: 0.4, marginTop: 8 }}>Sem dados no período.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {topVols.map((v, i) => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.35, width: 18 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{v.nome}</div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{v.profissao} · {v.instituicao}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? 'var(--orange)' : 'var(--text)' }}>
                  {v.periodHoras} h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activities table */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Actividades do período</span>
          <span style={{ fontSize: 12, opacity: 0.5 }}>{actList.length} registos</span>
        </div>
        {actList.length === 0 ? (
          <p style={{ fontSize: 13, opacity: 0.4, padding: '16px 0' }}>Sem actividades no período seleccionado.</p>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Actividade</th>
                <th>Área</th>
                <th>Data</th>
                <th>Local</th>
                <th>Voluntários</th>
                <th>Horas geradas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {actList.map(a => {
                const hGeradas = hoursEntries
                  .filter(h => h.actividadeId === a.id && h.validado)
                  .reduce((s, h) => s + h.horas, 0)
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{a.nome}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLOR[a.tipo] }} />
                        {TYPE_LABEL[a.tipo]}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{new Date(a.data).toLocaleDateString('pt-PT')}</td>
                    <td style={{ fontSize: 12 }}>{a.local}</td>
                    <td style={{ fontSize: 13 }}>{a.inscritos}</td>
                    <td style={{ fontSize: 13, fontWeight: 700 }}>{hGeradas > 0 ? `${hGeradas} h` : `${a.horasPrevistas * a.inscritos} h (prev.)`}</td>
                    <td style={{ fontSize: 12 }}>
                      {a.status === 'concluida' ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>Concluída</span>
                       : a.status === 'agendada' ? <span style={{ color: 'var(--warn)', fontWeight: 600 }}>Agendada</span>
                       : a.status === 'em_curso' ? <span style={{ color: '#3B82F6', fontWeight: 600 }}>Em curso</span>
                       : <span style={{ opacity: 0.5 }}>Cancelada</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Totals footer */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', marginTop: 16, display: 'flex', gap: 32, flexWrap: 'wrap', fontSize: 13 }}>
        <div><span style={{ opacity: 0.6 }}>Total voluntários inscritos: </span><strong>{volunteers.length}</strong></div>
        <div><span style={{ opacity: 0.6 }}>Activos no período: </span><strong>{voluntariosAtivos}</strong></div>
        <div><span style={{ opacity: 0.6 }}>Actividades concluídas: </span><strong>{concluidas}</strong></div>
        <div><span style={{ opacity: 0.6 }}>Horas totais validadas: </span><strong style={{ color: 'var(--orange)' }}>{horasValidadas} h</strong></div>
      </div>
    </div>
  )
}
