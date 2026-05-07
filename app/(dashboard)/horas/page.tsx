'use client'

import { useState } from 'react'
import { hoursEntries, volunteers, volunteerActivities } from '@/lib/data'
import type { HoursEntry } from '@/types'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Icon from '@/components/ui/Icon'
import Modal from '@/components/ui/Modal'

export default function HorasPage() {
  const [filterVol, setFilterVol]     = useState('todos')
  const [filterAct, setFilterAct]     = useState('todos')
  const [filterValid, setFilterValid] = useState<'todos' | 'validado' | 'pendente'>('todos')
  const [actionId, setActionId]       = useState<string | null>(null)
  const [entries, setEntries]         = useState<HoursEntry[]>(hoursEntries)
  const [newModal, setNewModal]       = useState(false)
  const [newForm, setNewForm]         = useState({ voluntarioId: '', actividadeId: '', horas: 4, data: '' })

  const totalHoras    = entries.filter(h => h.validado).reduce((s, h) => s + h.horas, 0)
  const pendentes     = entries.filter(h => !h.validado).length
  const totalEntries  = entries.length
  const mediaPerVol   = volunteers.length > 0
    ? Math.round(entries.filter(h => h.validado).reduce((s, h) => s + h.horas, 0) / volunteers.filter(v => v.status === 'activo').length)
    : 0

  const filtered = entries.filter(h => {
    const matchVol   = filterVol   === 'todos' || h.voluntarioId === filterVol
    const matchAct   = filterAct   === 'todos' || h.actividadeId === filterAct
    const matchValid = filterValid === 'todos' || (filterValid === 'validado' ? h.validado : !h.validado)
    return matchVol && matchAct && matchValid
  })

  function handleNewEntry() {
    if (!newForm.voluntarioId || !newForm.actividadeId || !newForm.data) return
    const vol = volunteers.find(v => v.id === newForm.voluntarioId)
    const act = volunteerActivities.find(a => a.id === newForm.actividadeId)
    const entry: HoursEntry = {
      id: `H-${String(entries.length + 1).padStart(3, '0')}`,
      voluntarioId: newForm.voluntarioId,
      voluntarioNome: vol?.nome ?? '',
      actividadeId: newForm.actividadeId,
      actividadeNome: act?.nome ?? '',
      data: newForm.data,
      horas: newForm.horas,
      validado: false,
      validadoPor: null,
    }
    setEntries(prev => [entry, ...prev])
    setNewForm({ voluntarioId: '', actividadeId: '', horas: 4, data: '' })
    setNewModal(false)
  }

  function validate(id: string) {
    setActionId(id)
    setTimeout(() => {
      setEntries(prev => prev.map(h => h.id === id ? { ...h, validado: true, validadoPor: 'Lurdes Cassinda' } : h))
      setActionId(null)
    }, 600)
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Registo de Horas</h1>
          <p className="page-subtitle">Base de horas por voluntário e actividade — Fundação BFA</p>
        </div>
        <button className="btn btn-primary" onClick={() => setNewModal(true)}>
          <Icon name="plus" size={15} />
          Registar horas
        </button>
      </div>

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total registos"     value={totalEntries} icon="doc" />
        <KPI label="Horas validadas"    value={totalHoras}   icon="check"  delta="h acumuladas" deltaTone="up" />
        <KPI label="Pendentes validação"value={pendentes}    icon="clock"  delta={pendentes > 0 ? 'Requer atenção' : 'Tudo em dia'} deltaTone={pendentes > 0 ? 'down' : 'up'} />
        <KPI label="Média por voluntário activo" value={`${mediaPerVol} h`} icon="users" />
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', flex: '1 1 160px' }}
            value={filterVol}
            onChange={e => setFilterVol(e.target.value)}
          >
            <option value="todos">Todos os voluntários</option>
            {volunteers.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
          </select>
          <select
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', flex: '1 1 160px' }}
            value={filterAct}
            onChange={e => setFilterAct(e.target.value)}
          >
            <option value="todos">Todas as actividades</option>
            {volunteerActivities.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
          <select
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
            value={filterValid}
            onChange={e => setFilterValid(e.target.value as 'todos' | 'validado' | 'pendente')}
          >
            <option value="todos">Todos</option>
            <option value="validado">Validados</option>
            <option value="pendente">Pendentes</option>
          </select>
          <span style={{ fontSize: 12, opacity: 0.5, marginLeft: 'auto' }}>{filtered.length} registo(s)</span>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Voluntário</th>
              <th>Actividade</th>
              <th>Data</th>
              <th>Horas</th>
              <th>Validação</th>
              <th>Validado por</th>
              <th>Acções</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => (
              <tr key={h.id}>
                <td style={{ fontSize: 11, opacity: 0.5 }}>{h.id}</td>
                <td style={{ fontSize: 13, fontWeight: 500 }}>{h.voluntarioNome}</td>
                <td style={{ fontSize: 12 }}>{h.actividadeNome}</td>
                <td style={{ fontSize: 13 }}>{new Date(h.data).toLocaleDateString('pt-PT')}</td>
                <td>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{h.horas}</span>
                  <span style={{ fontSize: 11, opacity: 0.5 }}> h</span>
                </td>
                <td>
                  <Pill tone={h.validado ? 'success' : 'warn'}>
                    {h.validado ? 'Validado' : 'Pendente'}
                  </Pill>
                </td>
                <td style={{ fontSize: 12, opacity: 0.6 }}>{h.validadoPor ?? '—'}</td>
                <td>
                  {!h.validado ? (
                    <button
                      className="btn btn-sm"
                      style={{ background: 'var(--success-bg)', color: 'var(--success)', borderColor: 'var(--success)' }}
                      disabled={actionId === h.id}
                      onClick={() => validate(h.id)}
                    >
                      {actionId === h.id ? '…' : 'Validar'}
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, opacity: 0.4 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px 0', opacity: 0.4, fontSize: 13 }}>Sem registos</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary by volunteer */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-head">
          <span className="card-title">Resumo por voluntário</span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Voluntário</th>
              <th>Actividades</th>
              <th>Horas validadas</th>
              <th>Horas pendentes</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {volunteers
              .filter(v => entries.some(h => h.voluntarioId === v.id))
              .map(v => {
                const vEntries  = entries.filter(h => h.voluntarioId === v.id)
                const validated = vEntries.filter(h => h.validado).reduce((s, h) => s + h.horas, 0)
                const pending   = vEntries.filter(h => !h.validado).reduce((s, h) => s + h.horas, 0)
                const acts      = new Set(vEntries.map(h => h.actividadeId)).size
                return (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{v.nome}</td>
                    <td style={{ fontSize: 13 }}>{acts}</td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>{validated} h</span>
                    </td>
                    <td>
                      {pending > 0
                        ? <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>{pending} h</span>
                        : <span style={{ fontSize: 12, opacity: 0.4 }}>—</span>
                      }
                    </td>
                    <td>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{validated + pending} h</span>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {newModal && (
        <Modal title="Registar Horas" onClose={() => setNewModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Voluntário *</label>
              <select className="select" style={{ width: '100%' }} value={newForm.voluntarioId} onChange={e => setNewForm(f => ({ ...f, voluntarioId: e.target.value }))}>
                <option value="">Seleccionar voluntário...</option>
                {volunteers.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Actividade *</label>
              <select className="select" style={{ width: '100%' }} value={newForm.actividadeId} onChange={e => setNewForm(f => ({ ...f, actividadeId: e.target.value }))}>
                <option value="">Seleccionar actividade...</option>
                {volunteerActivities.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Data *</label>
                <input className="input" type="date" style={{ width: '100%' }} value={newForm.data} onChange={e => setNewForm(f => ({ ...f, data: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Horas</label>
                <input className="input" type="number" min={1} max={12} style={{ width: '100%' }} value={newForm.horas} onChange={e => setNewForm(f => ({ ...f, horas: Number(e.target.value) }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button className="btn" onClick={() => setNewModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                disabled={!newForm.voluntarioId || !newForm.actividadeId || !newForm.data}
                onClick={handleNewEntry}
              >
                Registar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
