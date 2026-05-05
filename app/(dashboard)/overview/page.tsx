'use client'

import { talents, programs, activity } from '@/lib/data'
import { initials, avatarColor } from '@/lib/utils'
import Icon from '@/components/ui/Icon'
import Avatar from '@/components/ui/Avatar'
import Pill from '@/components/ui/Pill'
import Bar from '@/components/ui/Bar'
import KPI from '@/components/ui/KPI'
import { Donut } from '@/components/ui/Charts'
import Link from 'next/link'

const ACTIVITY_ICONS: Record<string, string> = {
  payment:     'cash',
  alert:       'alert',
  evaluation:  'star',
  application: 'funnel',
  doc:         'doc',
  hire:        'briefcase',
  mentor:      'briefcase',
}

const PROGRAM_COUNTS = [42, 38, 29, 24, 18]

export default function OverviewPage() {
  const activeCount = talents.filter(t =>
    ['active', 'delayed', 'risk', 'onboarding'].includes(t.status)
  ).length
  const riskCount = talents.filter(t => t.status === 'risk').length
  const alertTalents = talents.filter(t => t.riskScore >= 0.4)

  const topTalents = [...talents]
    .sort((a, b) => b.perf - a.perf)
    .slice(0, 5)

  const donutSegments = programs.map((p, i) => ({
    value: PROGRAM_COUNTS[i],
    color: p.color,
  }))

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Dashboard executivo — BFA TalentFlow</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid cols-5" style={{ marginBottom: 24 }}>
        <KPI
          label="Talentos activos"
          value={activeCount}
          sub="+12 vs 2025"
          icon="users"
        />
        <KPI
          label="Programas activos"
          value={5}
          icon="layers"
        />
        <KPI
          label="Em risco"
          value={riskCount}
          delta="Atenção"
          deltaTone="down"
          icon="alert"
        />
        <KPI
          label="Pagamentos pendentes"
          value={3}
          delta="Pendente"
          deltaTone="flat"
          icon="cash"
        />
        <KPI
          label="Candidaturas abertas"
          value={12}
          delta="Activas"
          deltaTone="up"
          icon="funnel"
        />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Actividade recente */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Actividade recente</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {activity.map(item => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border, #eee)',
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--surface-2, #f5f5f5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: item.type === 'alert' ? 'var(--danger, #dc2626)' : 'var(--primary, #FF7607)',
                    }}
                  >
                    <Icon name={ACTIVITY_ICONS[item.type] ?? 'doc'} size={15} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4 }}>{item.text}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, opacity: 0.55 }}>
                      {item.actor} · {item.when}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Distribuição por programa */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Distribuição por programa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '8px 0' }}>
              <Donut
                segments={donutSegments}
                size={130}
                thickness={16}
                label={String(PROGRAM_COUNTS.reduce((a, b) => a + b, 0))}
                sub="talentos"
              />
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
                {programs.map((p, i) => (
                  <li
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '5px 0',
                      fontSize: 13,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: p.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{p.name}</span>
                    <span style={{ fontWeight: 600 }}>{PROGRAM_COUNTS[i]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Alertas prioritários */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Alertas prioritários</span>
              <Pill tone="danger">{alertTalents.length} em risco</Pill>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Talento</th>
                  <th>Risco</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {alertTalents.map(t => {
                  const tone = t.riskScore >= 0.6 ? 'danger' : 'warn'
                  return (
                    <tr key={t.id}>
                      <td>
                        <div className="cell-person">
                          <Avatar name={t.name} size={28} />
                          <div className="meta">
                            <span className="name">{t.name}</span>
                            <span className="sub">{t.program.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Pill tone={tone}>{Math.round(t.riskScore * 100)}%</Pill>
                      </td>
                      <td>
                        <Pill tone={t.status === 'risk' ? 'danger' : 'warn'}>
                          {t.status === 'risk' ? 'Em risco' : 'Atraso'}
                        </Pill>
                      </td>
                      <td>
                        <Link href={`/talentos/${t.id}`} className="btn btn-sm">
                          Ver ficha
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Top talentos */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Top talentos</span>
              <span style={{ fontSize: 12, opacity: 0.55 }}>por performance</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {topTalents.map((t, idx) => {
                const prog = programs.find(p => p.id === t.program)
                return (
                  <li
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 0',
                      borderBottom: idx < topTalents.length - 1 ? '1px solid var(--border, #eee)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        opacity: 0.4,
                        textAlign: 'center',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: prog?.color ?? '#ccc',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                    <div style={{ width: 80 }}>
                      <Bar value={t.perf} tone={t.perf >= 90 ? 'success' : ''} />
                    </div>
                    <span style={{ width: 32, fontSize: 13, fontWeight: 700, textAlign: 'right' }}>
                      {t.perf}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
