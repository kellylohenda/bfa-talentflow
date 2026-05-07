'use client'

import { useState } from 'react'
import { volunteerActivities, hoursEntries, volunteers } from '@/lib/data'
import type { VolunteerActivity, ActivityStatus, ActivityType } from '@/types'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Modal from '@/components/ui/Modal'
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
const STATUS_TONE: Record<ActivityStatus, 'success' | 'info' | 'warn' | 'neutral'> = {
  concluida: 'success',
  em_curso:  'info',
  agendada:  'warn',
  cancelada: 'neutral',
}
const STATUS_LABEL: Record<ActivityStatus, string> = {
  concluida: 'Concluída',
  em_curso:  'Em curso',
  agendada:  'Agendada',
  cancelada: 'Cancelada',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ActividadesPage() {
  const [selected, setSelected] = useState<VolunteerActivity | null>(null)
  const [filterTipo, setTipo]   = useState<ActivityType | 'todos'>('todos')
  const [filterStatus, setStatus] = useState<ActivityStatus | 'todos'>('todos')
  const [view, setView]           = useState<'lista' | 'cronograma'>('cronograma')
  const [newModal, setNewModal]   = useState(false)
  const [newForm, setNewForm]     = useState({ nome: '', tipo: 'saude' as ActivityType, data: '', local: '', provincia: 'Luanda', horaInicio: '09:00', horaFim: '17:00', vagasTotal: 20, horasPrevistas: 8, coordenador: '' })

  const concluidas = volunteerActivities.filter(a => a.status === 'concluida').length
  const agendadas  = volunteerActivities.filter(a => a.status === 'agendada').length
  const totalVagasUsadas = volunteerActivities.reduce((s, a) => s + a.inscritos, 0)
  const totalHorasPrev   = volunteerActivities.reduce((s, a) => s + (a.horasPrevistas * a.inscritos), 0)

  const filtered = volunteerActivities.filter(a =>
    (filterTipo   === 'todos' || a.tipo   === filterTipo) &&
    (filterStatus === 'todos' || a.status === filterStatus)
  ).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())

  // Group by month for cronograma view
  const byMonth: Record<string, VolunteerActivity[]> = {}
  filtered.forEach(a => {
    const key = a.data.slice(0, 7) // YYYY-MM
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(a)
  })

  const selectedParticipants = selected
    ? hoursEntries.filter(h => h.actividadeId === selected.id)
    : []

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Actividades</h1>
          <p className="page-subtitle">Cronograma e gestão — Fundação BFA · {new Date().getFullYear()}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn${view === 'cronograma' ? ' btn-primary' : ''}`}
            onClick={() => setView('cronograma')}
            style={{ fontSize: 12 }}
          >
            Cronograma
          </button>
          <button
            className={`btn${view === 'lista' ? ' btn-primary' : ''}`}
            onClick={() => setView('lista')}
            style={{ fontSize: 12 }}
          >
            Lista
          </button>
          <button className="btn btn-primary" onClick={() => setNewModal(true)}>
            <Icon name="plus" size={15} />
            Nova actividade
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total actividades"      value={volunteerActivities.length} icon="calendar" />
        <KPI label="Concluídas"             value={concluidas} icon="check" delta="Este ano" deltaTone="up" />
        <KPI label="Agendadas"              value={agendadas}  icon="clock" delta="Próximas" deltaTone="flat" />
        <KPI label="Participações totais"   value={totalVagasUsadas} icon="users" delta={`${totalHorasPrev} h previstas`} deltaTone="up" />
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
            value={filterTipo}
            onChange={e => setTipo(e.target.value as ActivityType | 'todos')}
          >
            <option value="todos">Todos os tipos</option>
            <option value="saude">Saúde</option>
            <option value="educacao">Educação</option>
            <option value="ambiente">Ambiente</option>
            <option value="social">Social</option>
            <option value="cultura">Cultura</option>
          </select>
          <select
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
            value={filterStatus}
            onChange={e => setStatus(e.target.value as ActivityStatus | 'todos')}
          >
            <option value="todos">Todos os estados</option>
            <option value="agendada">Agendada</option>
            <option value="em_curso">Em curso</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <span style={{ fontSize: 12, opacity: 0.5, marginLeft: 'auto' }}>{filtered.length} actividade(s)</span>
        </div>
      </div>

      {/* Cronograma View */}
      {view === 'cronograma' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {Object.entries(byMonth).map(([month, acts]) => {
            const [y, m] = month.split('-')
            const label = new Date(+y, +m - 1, 1).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
            return (
              <div key={month}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginBottom: 10 }}>
                  {label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {acts.map(a => (
                    <div
                      key={a.id}
                      className="card"
                      style={{ padding: '16px 20px', cursor: 'pointer', borderLeft: `4px solid ${TYPE_COLOR[a.tipo]}`, transition: 'box-shadow 0.15s' }}
                      onClick={() => setSelected(a)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                        {/* Date badge */}
                        <div style={{ flexShrink: 0, textAlign: 'center', background: 'var(--surface-2)', borderRadius: 8, padding: '8px 14px', minWidth: 52 }}>
                          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
                            {new Date(a.data).getDate()}
                          </div>
                          <div style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.5, marginTop: 2 }}>
                            {new Date(a.data).toLocaleDateString('pt-PT', { month: 'short' })}
                          </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 600, fontSize: 15 }}>{a.nome}</span>
                            <Pill tone={STATUS_TONE[a.status]}>{STATUS_LABEL[a.status]}</Pill>
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>
                            <Icon name="pin" size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                            {a.local} · {a.provincia}
                            <span style={{ margin: '0 8px' }}>·</span>
                            <Icon name="clock" size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                            {a.horaInicio}–{a.horaFim}
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.7 }}>{a.descricao}</div>
                        </div>

                        <div style={{ display: 'flex', gap: 20, flexShrink: 0, textAlign: 'center' }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>{a.inscritos}/{a.vagasTotal}</div>
                            <div style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase' }}>Inscritos</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>{a.horasPrevistas} h</div>
                            <div style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase' }}>Por vol.</div>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginTop: 10, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(a.inscritos / a.vagasTotal) * 100}%`, background: TYPE_COLOR[a.tipo], borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lista View */}
      {view === 'lista' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Actividade</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Local</th>
                <th>Inscritos</th>
                <th>Horas/vol.</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontSize: 11, opacity: 0.5 }}>{a.id}</td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{a.nome}</div>
                    <div style={{ fontSize: 11, opacity: 0.55 }}>{a.coordenador}</div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLOR[a.tipo] }} />
                      {TYPE_LABEL[a.tipo]}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{fmtDate(a.data)}</td>
                  <td style={{ fontSize: 12 }}>{a.local}</td>
                  <td style={{ fontSize: 13 }}>{a.inscritos}/{a.vagasTotal}</td>
                  <td style={{ fontSize: 13 }}>{a.horasPrevistas} h</td>
                  <td><Pill tone={STATUS_TONE[a.status]}>{STATUS_LABEL[a.status]}</Pill></td>
                  <td><button className="btn btn-sm" onClick={() => setSelected(a)}>Ver</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {newModal && (
        <Modal title="Nova Actividade" onClose={() => setNewModal(false)} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Nome da actividade *</label>
              <input className="input" style={{ width: '100%' }} placeholder="Ex: Rastreio de Saúde Luanda" value={newForm.nome} onChange={e => setNewForm(f => ({ ...f, nome: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Tipo</label>
                <select className="select" style={{ width: '100%' }} value={newForm.tipo} onChange={e => setNewForm(f => ({ ...f, tipo: e.target.value as ActivityType }))}>
                  {(['saude','educacao','ambiente','social','cultura'] as ActivityType[]).map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Data *</label>
                <input className="input" type="date" style={{ width: '100%' }} value={newForm.data} onChange={e => setNewForm(f => ({ ...f, data: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Hora início</label>
                <input className="input" type="time" style={{ width: '100%' }} value={newForm.horaInicio} onChange={e => setNewForm(f => ({ ...f, horaInicio: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Hora fim</label>
                <input className="input" type="time" style={{ width: '100%' }} value={newForm.horaFim} onChange={e => setNewForm(f => ({ ...f, horaFim: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Local</label>
                <input className="input" style={{ width: '100%' }} placeholder="Ex: Hospital Geral" value={newForm.local} onChange={e => setNewForm(f => ({ ...f, local: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Província</label>
                <input className="input" style={{ width: '100%' }} value={newForm.provincia} onChange={e => setNewForm(f => ({ ...f, provincia: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Vagas</label>
                <input className="input" type="number" style={{ width: '100%' }} value={newForm.vagasTotal} onChange={e => setNewForm(f => ({ ...f, vagasTotal: Number(e.target.value) }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Horas por vol.</label>
                <input className="input" type="number" style={{ width: '100%' }} value={newForm.horasPrevistas} onChange={e => setNewForm(f => ({ ...f, horasPrevistas: Number(e.target.value) }))} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Coordenador</label>
              <input className="input" style={{ width: '100%' }} placeholder="Nome do coordenador" value={newForm.coordenador} onChange={e => setNewForm(f => ({ ...f, coordenador: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button className="btn" onClick={() => setNewModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                disabled={!newForm.nome.trim() || !newForm.data}
                onClick={() => setNewModal(false)}
              >
                Criar actividade
              </button>
            </div>
          </div>
        </Modal>
      )}

      {selected && (
        <Modal title={`Actividade — ${selected.nome}`} onClose={() => setSelected(null)} width={640}>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Tipo</span><span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: TYPE_COLOR[selected.tipo] }} />{TYPE_LABEL[selected.tipo]}</span></div>
            <div className="info-item"><span className="info-label">Estado</span><span className="info-value"><Pill tone={STATUS_TONE[selected.status]}>{STATUS_LABEL[selected.status]}</Pill></span></div>
            <div className="info-item"><span className="info-label">Data</span><span className="info-value">{fmtDate(selected.data)}</span></div>
            <div className="info-item"><span className="info-label">Horário</span><span className="info-value">{selected.horaInicio} – {selected.horaFim}</span></div>
            <div className="info-item"><span className="info-label">Local</span><span className="info-value">{selected.local}</span></div>
            <div className="info-item"><span className="info-label">Província</span><span className="info-value">{selected.provincia}</span></div>
            <div className="info-item"><span className="info-label">Coordenador</span><span className="info-value">{selected.coordenador}</span></div>
            <div className="info-item"><span className="info-label">Vagas</span><span className="info-value">{selected.inscritos} / {selected.vagasTotal}</span></div>
            <div className="info-item"><span className="info-label">Horas por voluntário</span><span className="info-value" style={{ fontWeight: 700 }}>{selected.horasPrevistas} h</span></div>
            <div className="info-item"><span className="info-label">Total horas geradas</span><span className="info-value" style={{ fontWeight: 700, color: 'var(--orange)' }}>{selected.horasPrevistas * selected.inscritos} h</span></div>
          </div>
          <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 8, fontSize: 13, opacity: 0.8 }}>{selected.descricao}</div>

          {selectedParticipants.length > 0 && (
            <>
              <div style={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '20px 0 10px' }}>
                Voluntários participantes
              </div>
              <table className="tbl">
                <thead><tr><th>Voluntário</th><th>Horas</th><th>Validado</th><th>Por</th></tr></thead>
                <tbody>
                  {selectedParticipants.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontSize: 13 }}>{h.voluntarioNome}</td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>{h.horas} h</td>
                      <td><Pill tone={h.validado ? 'success' : 'warn'}>{h.validado ? 'Sim' : 'Pendente'}</Pill></td>
                      <td style={{ fontSize: 12, opacity: 0.6 }}>{h.validadoPor ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Modal>
      )}
    </div>
  )
}
