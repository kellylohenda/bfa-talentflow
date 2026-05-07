'use client'

import { talents, programs, activity, volunteers, applications } from '@/lib/data'
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

// ── Derived counts ────────────────────────────────────────────────────────────
const bolseiros    = talents.filter(t => t.kind === 'bolseiro')
const estagiarios  = talents.filter(t => t.kind === 'estagiario')
const activeBols   = bolseiros.filter(t => ['active','delayed','risk','onboarding'].includes(t.status))
const activeEst    = estagiarios.filter(t => ['active','delayed','risk','onboarding'].includes(t.status))
const activeVols   = volunteers.filter(v => v.status === 'activo')
const riskCount    = talents.filter(t => t.status === 'risk').length
const alertTalents = talents.filter(t => t.riskScore >= 0.4)
const topTalents   = [...talents].sort((a, b) => b.perf - a.perf).slice(0, 5)

const PROGRAM_COUNTS = [42, 38, 29, 24, 18]

// ── Kind badge ───────────────────────────────────────────────────────────────
function KindBadge({ kind }: { kind: 'bolseiro' | 'estagiario' }) {
  const cfg = kind === 'estagiario'
    ? { bg: '#FF760715', color: '#FF7607', label: 'Estagiário' }
    : { bg: '#1D4ED815', color: '#1D4ED8', label: 'Bolseiro' }
  return (
    <span style={{ padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

export default function OverviewPage() {
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

      {/* ── 3-Type Summary ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Bolseiros */}
        <div className="card" style={{ borderTop: '3px solid #1D4ED8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1D4ED815', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="users" size={18} style={{ color: '#1D4ED8' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.55, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bolseiros</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{activeBols.length}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Pill tone="info" dot={false}>Académico</Pill>
            </div>
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 10 }}>
            Bolsas BIF · BNAC · Liderança+ · Mestrados Patrocinados
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span><strong>{bolseiros.filter(t => t.status === 'active').length}</strong> activos</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><strong style={{ color: 'var(--warn)' }}>{bolseiros.filter(t => t.status === 'delayed').length}</strong> atraso</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><strong style={{ color: 'var(--danger)' }}>{bolseiros.filter(t => t.status === 'risk').length}</strong> risco</span>
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: '#1D4ED808', borderRadius: 6, fontSize: 11, opacity: 0.8 }}>
            Foco académico · Subsídios mensais · Avaliações 360° semestrais
          </div>
        </div>

        {/* Estagiários */}
        <div className="card" style={{ borderTop: '3px solid #FF7607' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FF760715', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="briefcase" size={18} style={{ color: '#FF7607' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.55, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estagiários</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{activeEst.length}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Pill tone="warn" dot={false}>Futuro BFA</Pill>
            </div>
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 10 }}>
            Programa Futuro BFA · Rotações por departamento · Pathway para contratação
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span><strong>{estagiarios.filter(t => t.status === 'active').length}</strong> activos</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><strong>{estagiarios.filter(t => t.status === 'onboarding').length}</strong> onboarding</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><strong style={{ color: 'var(--success)' }}>{estagiarios.filter(t => t.status === 'hired').length}</strong> contratados</span>
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: '#FF760708', borderRadius: 6, fontSize: 11, opacity: 0.8 }}>
            Foco profissional · Rotações · Avaliação de competências · Contratação efectiva
          </div>
        </div>

        {/* Voluntários */}
        <div className="card" style={{ borderTop: '3px solid #10B981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#10B98115', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="users" size={18} style={{ color: '#10B981' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.55, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Voluntários</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{activeVols.length}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Pill tone="success" dot={false}>CSR</Pill>
            </div>
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 10 }}>
            Voluntariado Comunitário · Saúde · Educação · Ambiente · Social · Cultura
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span><strong>{volunteers.reduce((s, v) => s + v.totalHoras, 0)}</strong> horas totais</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><strong>{volunteers.filter(v => v.status === 'desistente').length}</strong> desistentes</span>
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: '#10B98108', borderRadius: 6, fontSize: 11, opacity: 0.8 }}>
            Sem bolsa · Impacto social · Horas por actividade · Responsabilidade corporativa
          </div>
        </div>
      </div>

      {/* ── KPI Strip ───────────────────────────────────────────────────────── */}
      <div className="grid cols-5" style={{ marginBottom: 24 }}>
        <KPI label="Total participantes" value={talents.length + volunteers.length} sub={`${talents.length} talentos + ${volunteers.length} vol.`} icon="users" />
        <KPI label="Programas activos" value={5} icon="layers" />
        <KPI label="Em risco" value={riskCount} delta="Atenção" deltaTone="down" icon="alert" />
        <KPI label="Pagamentos pendentes" value={3} delta="Pendente" deltaTone="flat" icon="cash" />
        <KPI label="Candidaturas abertas" value={applications.filter(a => a.stage !== 'rejeitado').length} delta="Activas" deltaTone="up" icon="funnel" />
      </div>

      {/* ── Two-column layout ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Recent activity */}
          <div className="card">
            <div className="card-head"><span className="card-title">Actividade recente</span></div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {activity.map(item => (
                <li key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--border, #eee)' }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2, #f5f5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: item.type === 'alert' ? 'var(--danger, #dc2626)' : 'var(--primary, #FF7607)' }}>
                    <Icon name={ACTIVITY_ICONS[item.type] ?? 'doc'} size={15} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4 }}>{item.text}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, opacity: 0.55 }}>{item.actor} · {item.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Program distribution */}
          <div className="card">
            <div className="card-head"><span className="card-title">Distribuição por programa</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '8px 0' }}>
              <Donut segments={programs.map((p, i) => ({ value: PROGRAM_COUNTS[i], color: p.color }))} size={130} thickness={16} label={String(PROGRAM_COUNTS.reduce((a, b) => a + b, 0))} sub="talentos" />
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
                {programs.map((p, i) => (
                  <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{p.name}</span>
                    <span style={{ fontSize: 10, opacity: 0.5, marginRight: 4 }}>
                      {p.kind === 'Trainee' ? '🎓' : '📚'}
                    </span>
                    <span style={{ fontWeight: 600 }}>{PROGRAM_COUNTS[i]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 10, display: 'flex', gap: 20, fontSize: 12, opacity: 0.65 }}>
              <span>🎓 <strong>Trainee</strong> = Estagiário (Futuro BFA)</span>
              <span>📚 <strong>Bolsa</strong> = Bolseiro académico</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Priority alerts */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Alertas prioritários</span>
              <Pill tone="danger">{alertTalents.length} em risco</Pill>
            </div>
            <table className="tbl">
              <thead>
                <tr><th>Talento</th><th>Tipo</th><th>Risco</th><th>Estado</th><th></th></tr>
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
                      <td><KindBadge kind={t.kind} /></td>
                      <td><Pill tone={tone}>{Math.round(t.riskScore * 100)}%</Pill></td>
                      <td><Pill tone={t.status === 'risk' ? 'danger' : 'warn'}>{t.status === 'risk' ? 'Em risco' : 'Atraso'}</Pill></td>
                      <td><Link href={`/talentos/${t.id}`} className="btn btn-sm">Ver ficha</Link></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Top performers */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Top talentos</span>
              <span style={{ fontSize: 12, opacity: 0.55 }}>por performance</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {topTalents.map((t, idx) => {
                const prog = programs.find(p => p.id === t.program)
                return (
                  <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: idx < topTalents.length - 1 ? '1px solid var(--border, #eee)' : 'none' }}>
                    <span style={{ width: 20, fontSize: 12, fontWeight: 700, opacity: 0.4, textAlign: 'center' }}>{idx + 1}</span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: prog?.color ?? '#ccc', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                    <KindBadge kind={t.kind} />
                    <div style={{ width: 80 }}>
                      <Bar value={t.perf} tone={t.perf >= 90 ? 'success' : ''} />
                    </div>
                    <span style={{ width: 32, fontSize: 13, fontWeight: 700, textAlign: 'right' }}>{t.perf}</span>
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
