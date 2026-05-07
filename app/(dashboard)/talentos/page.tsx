'use client'

import { useState } from 'react'
import { talents, programs, statuses } from '@/lib/data'
import type { Talent } from '@/types'
import Avatar from '@/components/ui/Avatar'
import Pill from '@/components/ui/Pill'
import Bar from '@/components/ui/Bar'
import KPI from '@/components/ui/KPI'
import Icon from '@/components/ui/Icon'
import Modal from '@/components/ui/Modal'
import Link from 'next/link'

type ToneType = 'success' | 'warn' | 'danger' | 'info' | 'neutral' | 'primary'

function statusTone(status: string): ToneType {
  const map: Record<string, ToneType> = {
    active:     'success',
    delayed:    'warn',
    risk:       'danger',
    completed:  'info',
    hired:      'primary',
    onboarding: 'info',
    pending:    'neutral',
  }
  return map[status] ?? 'neutral'
}

function perfTone(perf: number): '' | 'success' | 'warn' | 'danger' {
  if (perf >= 85) return 'success'
  if (perf >= 70) return 'warn'
  return 'danger'
}

export default function TalentosPage() {
  const [search, setSearch] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', email: '', program: 'fbfa', university: '', course: '', country: 'Angola', mentor: '' })

  const totalCount = talents.length
  const activeCount = talents.filter(t => t.status === 'active').length
  const delayedCount = talents.filter(t => t.status === 'delayed').length
  const riskCount = talents.filter(t => t.status === 'risk').length

  const uniqueCountries = Array.from(new Set(talents.map(t => t.country)))

  const filtered = talents.filter(t => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.university.toLowerCase().includes(q) ||
      t.dept.toLowerCase().includes(q)
    const matchProgram = !programFilter || t.program === programFilter
    const matchStatus = !statusFilter || t.status === statusFilter
    const matchCountry = !countryFilter || t.country === countryFilter
    return matchSearch && matchProgram && matchStatus && matchCountry
  })

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Talentos</h1>
          <p className="page-subtitle">Roster de talentos BFA</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModal(true)}>
          <Icon name="plus" size={15} />
          Adicionar talento
        </button>
      </div>

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total" value={totalCount} icon="users" />
        <KPI label="Activos" value={activeCount} delta="Em programa" deltaTone="up" icon="check" />
        <KPI label="Em atraso" value={delayedCount} delta="Atenção" deltaTone="flat" icon="clock" />
        <KPI label="Em risco" value={riskCount} delta="Urgente" deltaTone="down" icon="alert" />
      </div>

      {/* Filter bar */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 300 }}>
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          >
            <Icon name="search" size={15} />
          </span>
          <input
            className="input"
            style={{ paddingLeft: 32, width: '100%' }}
            placeholder="Pesquisar nome, universidade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select"
          value={programFilter}
          onChange={e => setProgramFilter(e.target.value)}
        >
          <option value="">Todos os programas</option>
          {programs.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os estados</option>
          {Object.entries(statuses).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value)}
        >
          <option value="">Todos os países</option>
          {uniqueCountries.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {(search || programFilter || statusFilter || countryFilter) && (
          <button
            className="btn btn-sm"
            onClick={() => {
              setSearch('')
              setProgramFilter('')
              setStatusFilter('')
              setCountryFilter('')
            }}
          >
            Limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Talentos</span>
          <span style={{ fontSize: 12, opacity: 0.55 }}>
            {filtered.length} de {totalCount} registos
          </span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Programa</th>
              <th>Universidade</th>
              <th>GPA</th>
              <th>Performance</th>
              <th>Estado</th>
              <th>Mentor</th>
              <th>Último relatório</th>
              <th>Acções</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const prog = programs.find(p => p.id === t.program)
              const rowClass =
                t.riskScore >= 0.4
                  ? 'row-danger'
                  : t.status === 'delayed'
                  ? 'row-warn'
                  : ''
              return (
                <tr key={t.id} className={rowClass}>
                  <td style={{ fontSize: 12, opacity: 0.55 }}>{t.id}</td>
                  <td>
                    <div className="cell-person">
                      <Avatar name={t.name} size={30} />
                      <div className="meta">
                        <span className="name">{t.name}</span>
                        <span className="sub">{t.course}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: prog?.color ?? '#ccc',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13 }}>{prog?.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{t.university}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{t.gpa}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                      <div style={{ flex: 1 }}>
                        <Bar value={t.perf} tone={perfTone(t.perf)} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, minWidth: 24 }}>{t.perf}</span>
                    </div>
                  </td>
                  <td>
                    <Pill tone={statusTone(t.status)}>
                      {statuses[t.status]?.label ?? t.status}
                    </Pill>
                  </td>
                  <td style={{ fontSize: 13 }}>{t.mentor}</td>
                  <td style={{ fontSize: 12, opacity: 0.65 }}>{t.lastReport}</td>
                  <td>
                    <Link href={`/talentos/${t.id}`} className="btn btn-sm">
                      Ver ficha
                    </Link>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 32, opacity: 0.45 }}>
                  Nenhum talento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {addModal && (
        <Modal title="Adicionar Talento" onClose={() => setAddModal(false)} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Nome completo *</label>
                <input className="input" style={{ width: '100%' }} value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Email *</label>
                <input className="input" type="email" style={{ width: '100%' }} value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Programa</label>
              <select className="select" style={{ width: '100%' }} value={addForm.program} onChange={e => setAddForm(f => ({ ...f, program: e.target.value }))}>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Universidade</label>
                <input className="input" style={{ width: '100%' }} value={addForm.university} onChange={e => setAddForm(f => ({ ...f, university: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Curso</label>
                <input className="input" style={{ width: '100%' }} value={addForm.course} onChange={e => setAddForm(f => ({ ...f, course: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>País</label>
                <input className="input" style={{ width: '100%' }} value={addForm.country} onChange={e => setAddForm(f => ({ ...f, country: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Mentor</label>
                <input className="input" style={{ width: '100%' }} placeholder="Nome do mentor" value={addForm.mentor} onChange={e => setAddForm(f => ({ ...f, mentor: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button className="btn" onClick={() => setAddModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                disabled={!addForm.name.trim() || !addForm.email.trim()}
                onClick={() => setAddModal(false)}
              >
                Adicionar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
