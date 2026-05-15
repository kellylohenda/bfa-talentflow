'use client'

import { useState } from 'react'
import { volunteers, volunteerActivities, hoursEntries, eventos } from '@/lib/data'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Icon from '@/components/ui/Icon'

// ── Persona ───────────────────────────────────────────────────────────────────
const ME_ID = 'V-001'
const ME = volunteers.find(v => v.id === ME_ID)!

const AREA_LABEL: Record<string, string> = {
  educacao: 'Educação', saude: 'Saúde', ambiente: 'Ambiente', social: 'Social', cultura: 'Cultura',
}
const AREA_COLOR: Record<string, string> = {
  educacao: '#1D4ED8', saude: '#DC2626', ambiente: '#0E7C4A', social: '#7C3AED', cultura: '#B45309',
}

// ── Níveis de voluntariado ────────────────────────────────────────────────────
const LEVELS = [
  { label: 'Bronze',   minH: 0,   maxH: 49,  color: '#B45309', bg: '#FEF3C7' },
  { label: 'Prata',    minH: 50,  maxH: 99,  color: '#6B7280', bg: '#F3F4F6' },
  { label: 'Ouro',     minH: 100, maxH: 199, color: '#D97706', bg: '#FEF9C3' },
  { label: 'Platina',  minH: 200, maxH: 999, color: '#2563EB', bg: '#EFF6FF' },
]
function getLevel(h: number) {
  return LEVELS.find(l => h >= l.minH && h <= l.maxH) ?? LEVELS[0]
}

export default function VoluntarioPage() {
  const [tab, setTab] = useState<'inicio' | 'horas' | 'actividades' | 'perfil'>('inicio')

  const myHours  = hoursEntries.filter(h => h.voluntarioId === ME_ID)
  const totalH   = myHours.reduce((s, h) => s + h.horas, 0)
  const validH   = myHours.filter(h => h.validado).reduce((s, h) => s + h.horas, 0)
  const pendingH = myHours.filter(h => !h.validado).reduce((s, h) => s + h.horas, 0)
  const level    = getLevel(ME.totalHoras)
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1]

  const upcomingActivities = volunteerActivities.filter(a => a.status === 'agendada' || a.status === 'em_curso')
  const myUpcoming = eventos.filter(e =>
    (e.audiencia.includes('voluntario') || e.audiencia.includes('todos')) && e.data >= '2026-05-07'
  )

  const TABS: [typeof tab, string][] = [
    ['inicio', 'Início'],
    ['horas', 'As Minhas Horas'],
    ['actividades', 'Actividades'],
    ['perfil', 'O Meu Perfil'],
  ]

  return (
    <div className="section">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="page-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="page-title" style={{ margin: 0 }}>Olá, {ME.nome.split(' ')[0]}</h1>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: level.bg, color: level.color, border: `1px solid ${level.color}40` }}>
              Voluntária {level.label}
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            {ME.profissao} · {AREA_LABEL[ME.areaActuacao]} · {ME.provincia}
          </p>
        </div>
      </div>

      {/* ── KPIs ────────────────────────────────────────────────────────────── */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total de horas" value={`${ME.totalHoras}h`} sub="Acumuladas" delta="Activo" deltaTone="up" icon="clock" />
        <KPI label="Nível actual" value={level.label} sub={nextLevel ? `Faltam ${nextLevel.minH - ME.totalHoras}h para ${nextLevel.label}` : 'Nível máximo'} icon="star" />
        <KPI label="Actividades" value={myHours.length} sub="Participadas" icon="check" />
        <KPI label="Horas validadas" value={`${validH}h`} sub={pendingH > 0 ? `${pendingH}h pendentes` : 'Todas validadas'} deltaTone={pendingH > 0 ? 'flat' : 'up'} icon="check" />
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {TABS.map(([key, lbl]) => (
          <button key={key} className={`tab ${tab === key ? 'tab-active' : ''}`} onClick={() => setTab(key)}>{lbl}</button>
        ))}
      </div>

      {/* ── INÍCIO ──────────────────────────────────────────────────────────── */}
      {tab === 'inicio' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Progresso de nível */}
          <div className="card">
            <div className="card-head"><span className="card-title">Progresso de Nível</span></div>
            <div style={{ marginBottom: 16 }}>
              {LEVELS.map(l => {
                const achieved = ME.totalHoras >= l.minH
                const isCurrent = l.label === level.label
                return (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: achieved ? l.bg : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: achieved ? l.color : 'var(--text)', opacity: achieved ? 1 : 0.35, border: isCurrent ? `2px solid ${l.color}` : 'none' }}>
                      {achieved ? '✓' : '—'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500 }}>{l.label}</div>
                      <div style={{ fontSize: 11, opacity: 0.55 }}>a partir de {l.minH}h</div>
                    </div>
                    {isCurrent && <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: l.bg, color: l.color }}>Actual</span>}
                  </div>
                )
              })}
            </div>
            {nextLevel && (
              <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  {nextLevel.minH - ME.totalHoras}h para {nextLevel.label}
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: level.color, width: `${Math.round(((ME.totalHoras - level.minH) / (nextLevel.minH - level.minH)) * 100)}%` }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Próximas actividades */}
            <div className="card">
              <div className="card-head"><span className="card-title">Próximas Actividades</span></div>
              {myUpcoming.length === 0 ? (
                <p style={{ opacity: 0.45, fontSize: 13 }}>Sem actividades próximas.</p>
              ) : myUpcoming.slice(0, 3).map(e => (
                <div key={e.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.titulo}</div>
                  <div style={{ fontSize: 11, opacity: 0.55, marginTop: 3 }}>{e.data} · {e.horaInicio} · {e.local.split('—')[0].trim()}</div>
                </div>
              ))}
            </div>

            {/* Resumo de horas */}
            <div className="card">
              <div className="card-head"><span className="card-title">Horas por Actividade</span></div>
              {myHours.slice(0, 5).map(h => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 13 }}>{h.actividadeNome}</div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>{h.data}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{h.horas}h</span>
                    {h.validado
                      ? <span style={{ fontSize: 11, color: 'var(--success)' }}>✓</span>
                      : <span style={{ fontSize: 11, opacity: 0.4 }}>Pendente</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HORAS ───────────────────────────────────────────────────────────── */}
      {tab === 'horas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid cols-4">
            <KPI label="Horas totais" value={`${ME.totalHoras}h`} icon="clock" />
            <KPI label="Validadas" value={`${validH}h`} delta="Confirmadas" deltaTone="up" icon="check" />
            <KPI label="Pendentes" value={`${pendingH}h`} icon="clock" />
            <KPI label="Actividades" value={myHours.length} sub="Participadas" icon="calendar" />
          </div>
          <div className="card">
            <div className="card-head"><span className="card-title">Registo de Horas</span></div>
            <table className="tbl">
              <thead>
                <tr><th>Data</th><th>Actividade</th><th>Horas</th><th>Estado</th><th>Validado por</th></tr>
              </thead>
              <tbody>
                {[...myHours].reverse().map(h => (
                  <tr key={h.id}>
                    <td style={{ fontSize: 13 }}>{h.data}</td>
                    <td style={{ fontSize: 13 }}>{h.actividadeNome}</td>
                    <td style={{ fontSize: 14, fontWeight: 700 }}>{h.horas}h</td>
                    <td>
                      {h.validado
                        ? <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#D1FAE5', color: '#065F46' }}>Validado</span>
                        : <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#FEF3C7', color: '#92400E' }}>Pendente</span>}
                    </td>
                    <td style={{ fontSize: 12, opacity: 0.6 }}>{h.validadoPor ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ACTIVIDADES ─────────────────────────────────────────────────────── */}
      {tab === 'actividades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid cols-2">
            {volunteerActivities.map(a => {
              const areaColor = AREA_COLOR[a.tipo] ?? '#6B7280'
              const participated = myHours.some(h => h.actividadeId === a.id)
              return (
                <div key={a.id} className="card" style={{ borderLeft: `3px solid ${areaColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: areaColor + '20', color: areaColor }}>{AREA_LABEL[a.tipo]}</span>
                    <Pill tone={a.status === 'concluida' ? 'success' : a.status === 'em_curso' ? 'warn' : a.status === 'cancelada' ? 'danger' : 'info'} dot={false}>
                      {a.status === 'concluida' ? 'Concluída' : a.status === 'em_curso' ? 'Em curso' : a.status === 'cancelada' ? 'Cancelada' : 'Agendada'}
                    </Pill>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{a.nome}</div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 4 }}>{a.data} · {a.horaInicio}–{a.horaFim}</div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 8 }}>{a.local} · {a.provincia}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, opacity: 0.55 }}>{a.inscritos}/{a.vagasTotal} inscritos · {a.horasPrevistas}h previstas</span>
                    {participated && (
                      <span style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>✓ Participei</span>
                    )}
                    {!participated && a.status === 'agendada' && (
                      <button className="btn btn-sm btn-primary">Inscrever</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── PERFIL ──────────────────────────────────────────────────────────── */}
      {tab === 'perfil' && (
        <div className="card card-pad" style={{ maxWidth: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: level.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: level.color }}>
              {ME.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{ME.nome}</div>
              <div style={{ fontSize: 13, opacity: 0.6 }}>{ME.profissao} · {ME.instituicao}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Email', ME.email],
              ['Telefone', ME.tel],
              ['Área de actuação', AREA_LABEL[ME.areaActuacao]],
              ['Província', ME.provincia],
              ['Local', ME.local],
              ['Data de inscrição', ME.dataInscricao],
              ['Nível', level.label],
              ['Total de horas', `${ME.totalHoras}h`],
              ['Mentor/Coord.', ME.mentor ?? '—'],
              ['Estado', ME.status === 'activo' ? '✓ Activo' : ME.status],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)' }}>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
