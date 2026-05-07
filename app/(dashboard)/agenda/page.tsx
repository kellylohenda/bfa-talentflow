'use client'

import { useState } from 'react'
import { eventos } from '@/lib/data'
import { useRole } from '@/lib/useRole'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Icon from '@/components/ui/Icon'
import type { Evento, EventoTipo } from '@/types'

// ── Constants ─────────────────────────────────────────────────────────────────
const CURRENT_USER_ID = 'T-1042' // Lwini (estagiário demo)
const TODAY = '2026-05-07'
const MONTH_YEAR = { year: 2026, month: 4 } // 0-indexed May = 4

const TIPO_META: Record<EventoTipo, { label: string; color: string; bg: string }> = {
  workshop:      { label: 'Workshop',     color: '#1D4ED8', bg: '#EFF6FF' },
  formacao:      { label: 'Formação',     color: '#7C3AED', bg: '#F5F3FF' },
  evento:        { label: 'Evento',       color: '#0E7C4A', bg: '#ECFDF5' },
  mentoria:      { label: 'Mentoria',     color: '#FF7607', bg: '#FFF7ED' },
  convocatoria:  { label: 'Convocatória', color: '#DC2626', bg: '#FEF2F2' },
  avaliacao:     { label: 'Avaliação',    color: '#92400E', bg: '#FEF3C7' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1 // Mon-first
  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function pad2(n: number) { return String(n).padStart(2, '0') }
function dateStr(year: number, month: number, day: number) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`
}

export default function PageAgenda() {
  const role = useRole()
  const [tab, setTab] = useState<'calendario' | 'workshops'>('calendario')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(() => {
    const already = eventos.filter(e => e.inscritos.includes(CURRENT_USER_ID)).map(e => e.id)
    return new Set(already)
  })
  const [filterTipo, setFilterTipo] = useState<EventoTipo | 'todos'>('todos')
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  // ── Role-aware filtering ───────────────────────────────────────────────────
  const visibleEventos = eventos.filter(e => {
    if (e.audiencia.includes('todos')) return true
    if (role === 'rh' || role === 'direcao') return true
    if (role === 'mentor' && e.audiencia.includes('mentor')) return true
    if (role === 'mentor') return true // mentors see all to manage
    if (role === 'bolseiro' && (e.audiencia.includes('bolseiro') || e.audiencia.includes('todos'))) return true
    if (role === 'bolseiro' && e.audiencia.includes('estagiario')) return true // bolseiros transitioning
    return false
  })

  // ── Calendar ───────────────────────────────────────────────────────────────
  const { year, month } = MONTH_YEAR
  const cells = buildCalendar(year, month)
  const MONTH_NAME = 'Maio 2026'
  const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  function eventosOnDay(day: number) {
    const d = dateStr(year, month, day)
    return visibleEventos.filter(e => e.data === d)
  }

  const selectedEvents = selectedDay
    ? visibleEventos.filter(e => e.data === selectedDay)
    : []

  // ── Workshop catalogue ─────────────────────────────────────────────────────
  const upcoming = [...visibleEventos]
    .filter(e => e.data >= TODAY)
    .sort((a, b) => a.data.localeCompare(b.data))
  const filteredUpcoming = filterTipo === 'todos'
    ? upcoming
    : upcoming.filter(e => e.tipo === filterTipo)

  const enroll = (id: string) => setEnrolledIds(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const myEnrolled = visibleEventos.filter(e => enrolledIds.has(e.id) && e.data >= TODAY)
  const obrigatorios = visibleEventos.filter(e => e.obrigatorio && e.data >= TODAY)
  const thisMonth = visibleEventos.filter(e => e.data.startsWith('2026-05'))

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Agenda & Workshops</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            {role === 'rh' || role === 'direcao'
              ? 'Todos os eventos, workshops e convocatórias do programa'
              : role === 'mentor'
              ? 'Eventos e sessões dos seus mentorandos'
              : 'A sua agenda pessoal — workshops e eventos disponíveis'}
          </p>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Inscrições activas" value={myEnrolled.length} sub="Próximos eventos" icon="check" />
        <KPI label="Obrigatórios" value={obrigatorios.length} sub="Presença obrigatória" deltaTone="down" delta={obrigatorios.length > 0 ? 'Atenção' : ''} icon="alert-triangle" />
        <KPI label="Este mês" value={thisMonth.length} sub="Maio 2026" icon="calendar" />
        <KPI label="Total disponíveis" value={visibleEventos.length} sub="Todos os programas" icon="layers" />
      </div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab${tab === 'calendario' ? ' tab-active' : ''}`} onClick={() => setTab('calendario')}>
          Calendário
        </button>
        <button className={`tab${tab === 'workshops' ? ' tab-active' : ''}`} onClick={() => setTab('workshops')}>
          Workshops & Eventos
        </button>
      </div>

      {/* ── CALENDÁRIO ─────────────────────────────────────────────────────── */}
      {tab === 'calendario' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          {/* Calendar grid */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">{MONTH_NAME}</span>
              <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                {Object.entries(TIPO_META).slice(0, 4).map(([tipo, m]) => (
                  <span key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
              {DAY_LABELS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, opacity: 0.45, padding: '4px 0' }}>{d}</div>
              ))}
            </div>
            {/* Calendar cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const ds = dateStr(year, month, day)
                const dayEvents = eventosOnDay(day)
                const isToday = ds === TODAY
                const isSelected = ds === selectedDay
                const isWeekend = (i % 7) >= 5
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDay(isSelected ? null : ds)}
                    style={{
                      minHeight: 64,
                      borderRadius: 6,
                      padding: '6px 4px',
                      background: isSelected ? 'var(--primary)' : isToday ? '#FFF7ED' : 'var(--surface-2)',
                      border: isToday ? '1px solid #FF7607' : '1px solid transparent',
                      cursor: 'pointer',
                      opacity: isWeekend && dayEvents.length === 0 ? 0.4 : 1,
                    }}
                  >
                    <div style={{
                      fontSize: 12,
                      fontWeight: isToday ? 700 : 500,
                      color: isSelected ? '#fff' : isToday ? '#FF7607' : 'var(--text)',
                      marginBottom: 4,
                    }}>
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {dayEvents.slice(0, 3).map(e => {
                        const m = TIPO_META[e.tipo]
                        return (
                          <div key={e.id} style={{
                            fontSize: 9,
                            padding: '1px 4px',
                            borderRadius: 3,
                            background: isSelected ? 'rgba(255,255,255,0.25)' : m.bg,
                            color: isSelected ? '#fff' : m.color,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {e.titulo.split(':')[0].split('—')[0].trim()}
                          </div>
                        )
                      })}
                      {dayEvents.length > 3 && (
                        <div style={{ fontSize: 9, opacity: 0.6, color: isSelected ? '#fff' : undefined }}>+{dayEvents.length - 3}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Day detail / next events panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {selectedDay ? (
              <div className="card">
                <div className="card-head">
                  <span className="card-title">
                    {new Date(selectedDay + 'T12:00:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}
                  </span>
                  <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, fontSize: 18, lineHeight: 1 }}>×</button>
                </div>
                {selectedEvents.length === 0 ? (
                  <p style={{ fontSize: 13, opacity: 0.5 }}>Sem eventos neste dia.</p>
                ) : (
                  selectedEvents.map(e => {
                    const m = TIPO_META[e.tipo]
                    const enrolled = enrolledIds.has(e.id)
                    const canEnroll = role === 'bolseiro' && !e.obrigatorio
                    return (
                      <div key={e.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color }}>{m.label}</span>
                          {e.obrigatorio && <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#FEE2E2', color: '#991B1B' }}>Obrigatório</span>}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{e.titulo}</div>
                        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 2 }}>{e.horaInicio} – {e.horaFim}</div>
                        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>{e.local}</div>
                        {canEnroll && (
                          <button
                            className={`btn btn-sm${enrolled ? '' : ' btn-primary'}`}
                            style={enrolled ? { background: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0' } : {}}
                            onClick={() => enroll(e.id)}
                          >
                            {enrolled ? '✓ Inscrito' : 'Inscrever'}
                          </button>
                        )}
                        {e.obrigatorio && (
                          <span style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>✓ Confirmado automaticamente</span>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            ) : (
              <div className="card">
                <div className="card-head"><span className="card-title">Próximos eventos</span></div>
                {upcoming.slice(0, 5).map(e => {
                  const m = TIPO_META[e.tipo]
                  const [, , day] = e.data.split('-')
                  return (
                    <div key={e.id} onClick={() => setSelectedDay(e.data)}
                      style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: m.color, flexShrink: 0 }}>
                        {parseInt(day)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{e.titulo}</div>
                        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{e.horaInicio} · {e.local.split('—')[0].trim()}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Legend */}
            <div className="card">
              <div className="card-head"><span className="card-title">Legenda</span></div>
              {Object.entries(TIPO_META).map(([tipo, m]) => (
                <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 13 }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WORKSHOPS & EVENTOS ─────────────────────────────────────────────── */}
      {tab === 'workshops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['todos', ...Object.keys(TIPO_META)] as const).map(tipo => {
              const m = tipo !== 'todos' ? TIPO_META[tipo as EventoTipo] : null
              const isActive = filterTipo === tipo
              return (
                <button
                  key={tipo}
                  onClick={() => setFilterTipo(tipo as EventoTipo | 'todos')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isActive ? 'none' : '1px solid var(--border)',
                    background: isActive ? (m?.color ?? 'var(--primary)') : 'transparent',
                    color: isActive ? '#fff' : 'var(--text)',
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {tipo === 'todos' ? 'Todos' : m?.label}
                </button>
              )
            })}
          </div>

          {/* Event cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {filteredUpcoming.map(e => {
              const m = TIPO_META[e.tipo]
              const enrolled = enrolledIds.has(e.id)
              const expanded = expandedEvent === e.id
              const vagas = e.vagasTotal != null ? e.vagasTotal - e.inscritos.length : null
              const past = e.data < TODAY
              const canEnroll = (role === 'bolseiro' || role === 'mentor') && !e.obrigatorio && !past

              return (
                <div key={e.id} className="card" style={{ borderTop: `3px solid ${m.color}`, opacity: past ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color }}>{m.label}</span>
                      {e.obrigatorio && <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#FEE2E2', color: '#991B1B' }}>Obrigatório</span>}
                    </div>
                    {vagas != null && (
                      <span style={{ fontSize: 11, opacity: 0.55, whiteSpace: 'nowrap' }}>{vagas} vagas</span>
                    )}
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{e.titulo}</div>

                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 4 }}>
                    {new Date(e.data + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {' · '}{e.horaInicio}–{e.horaFim}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 4 }}>
                    <Icon name="briefcase" size={11} /> {e.facilitador}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 10 }}>
                    {e.local}
                  </div>

                  {expanded && (
                    <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 12, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 6 }}>
                      {e.descricao}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="btn btn-sm" onClick={() => setExpandedEvent(expanded ? null : e.id)} style={{ fontSize: 11 }}>
                      {expanded ? 'Menos info' : 'Mais info'}
                    </button>
                    {canEnroll && (
                      <button
                        className={`btn btn-sm${enrolled ? '' : ' btn-primary'}`}
                        style={enrolled ? { background: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0' } : {}}
                        onClick={() => enroll(e.id)}
                      >
                        {enrolled ? '✓ Inscrito' : '+ Inscrever'}
                      </button>
                    )}
                    {e.obrigatorio && !past && (
                      <span style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>✓ Presença confirmada</span>
                    )}
                    {past && (
                      <span style={{ fontSize: 11, opacity: 0.45 }}>Evento passado</span>
                    )}
                    {(role === 'rh' || role === 'direcao') && (
                      <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.55 }}>{e.inscritos.length} inscritos</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredUpcoming.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 40, opacity: 0.45 }}>
              Sem eventos disponíveis para o filtro seleccionado.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
