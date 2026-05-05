'use client'

import { useState } from 'react'
import { absences as initialAbsences, talents } from '@/lib/data'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Modal from '@/components/ui/Modal'
import type { Absence } from '@/types'

type AbsStatus = 'pending' | 'approved' | 'rejected'

const STATUS_META: Record<AbsStatus, { label: string; tone: 'warn' | 'success' | 'danger' }> = {
  pending:  { label: 'Pendente',  tone: 'warn' },
  approved: { label: 'Aprovada', tone: 'success' },
  rejected: { label: 'Rejeitada', tone: 'danger' },
}

export default function PageFaltas() {
  const [absenceList, setAbsenceList] = useState<Absence[]>([...initialAbsences])
  const [activeTab, setActiveTab] = useState<'pendentes' | 'historico' | 'impacto'>('pendentes')
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null)
  const [rhNote, setRhNote] = useState('')

  const pendentes = absenceList.filter(a => a.status === 'pending')
  const historico = absenceList.filter(a => a.status !== 'pending')
  const aprovadas = absenceList.filter(a => a.status === 'approved')
  const rejeitadas = absenceList.filter(a => a.status === 'rejected')
  const injustAprovadas = absenceList.filter(a => a.status === 'approved' && a.type === 'injustificada')

  const decidir = (id: string, decision: 'approved' | 'rejected') => {
    setAbsenceList(prev => prev.map(a =>
      a.id === id ? {
        ...a,
        status: decision,
        approvedBy: 'Mariana Quissama (RH)',
        rhNote: rhNote || null,
      } : a
    ))
    setSelectedAbsence(null)
    setRhNote('')
  }

  // Impacto por talento
  const talentImpact = talents.map(talent => {
    const tAbsences = absenceList.filter(a => a.talentId === talent.id)
    const totalDays = tAbsences.reduce((s, a) => s + a.days, 0)
    const injust = tAbsences.filter(a => a.type === 'injustificada').length
    const aprov = tAbsences.filter(a => a.status === 'approved').length
    return { talent, total: tAbsences.length, approved: aprov, injust, days: totalDays }
  }).filter(r => r.total > 0)

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <div className="page-title">Faltas</div>
          <div className="page-subtitle">Gestão de ausências e pedidos de falta</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Pendentes" value={pendentes.length} icon="clock" />
        <KPI label="Aprovadas" value={aprovadas.length} icon="check-circle" />
        <KPI label="Rejeitadas" value={rejeitadas.length} icon="x-circle" />
        <KPI label="Injustif. aprovadas" value={injustAprovadas.length} icon="alert-triangle" />
      </div>

      <div className="tabs">
        <button className={`tab${activeTab === 'pendentes' ? ' tab--active' : ''}`} onClick={() => setActiveTab('pendentes')}>
          Pendentes <span className="tab-count">{pendentes.length}</span>
        </button>
        <button className={`tab${activeTab === 'historico' ? ' tab--active' : ''}`} onClick={() => setActiveTab('historico')}>
          Histórico <span className="tab-count">{historico.length}</span>
        </button>
        <button className={`tab${activeTab === 'impacto' ? ' tab--active' : ''}`} onClick={() => setActiveTab('impacto')}>
          Impacto por talento
        </button>
      </div>

      {(activeTab === 'pendentes' || activeTab === 'historico') && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Talento</th>
                <th>Tipo</th>
                <th>Motivo</th>
                <th>Data</th>
                <th>Dias</th>
                <th>Estado</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'pendentes' ? pendentes : historico).map(abs => {
                const sm = STATUS_META[abs.status as AbsStatus]
                return (
                  <tr key={abs.id}>
                    <td><span className="mono">{abs.id}</span></td>
                    <td>{abs.talentName}</td>
                    <td>
                      <Pill tone={abs.type === 'justificada' ? 'info' : 'danger'} dot={false}>
                        {abs.type === 'justificada' ? 'Justificada' : 'Injustificada'}
                      </Pill>
                    </td>
                    <td>{abs.reason || <span style={{ opacity: 0.4 }}>—</span>}</td>
                    <td>{abs.date}</td>
                    <td>{abs.days}</td>
                    <td><Pill tone={sm.tone} dot={false}>{sm.label}</Pill></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm" onClick={() => { setSelectedAbsence(abs); setRhNote('') }}>Ver</button>
                        {abs.status === 'pending' && (
                          <button className="btn btn-sm btn-primary" onClick={() => { setSelectedAbsence(abs); setRhNote('') }}>Decidir</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'impacto' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Talento</th>
                <th>Total faltas</th>
                <th>Aprovadas</th>
                <th>Injustificadas</th>
                <th>Dias perdidos</th>
                <th>Risco</th>
              </tr>
            </thead>
            <tbody>
              {talentImpact.map(({ talent, total, approved, injust, days }) => {
                const riskTone = injust >= 3 ? 'danger' : injust >= 2 ? 'warn' : 'success'
                const riskLabel = injust >= 3 ? 'Alto' : injust >= 2 ? 'Médio' : 'Baixo'
                return (
                  <tr key={talent.id}>
                    <td>{talent.name}</td>
                    <td>{total}</td>
                    <td>{approved}</td>
                    <td>{injust}</td>
                    <td>{days}</td>
                    <td><Pill tone={riskTone} dot={false}>{riskLabel}</Pill></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedAbsence && (
        <Modal
          title={`Falta ${selectedAbsence.id}`}
          onClose={() => { setSelectedAbsence(null); setRhNote('') }}
        >
          <div className="info-grid">
            <div className="info-item"><span className="form-label">Talento</span><span>{selectedAbsence.talentName}</span></div>
            <div className="info-item"><span className="form-label">Data</span><span>{selectedAbsence.date}</span></div>
            <div className="info-item">
              <span className="form-label">Tipo</span>
              <Pill tone={selectedAbsence.type === 'justificada' ? 'info' : 'danger'} dot={false}>
                {selectedAbsence.type === 'justificada' ? 'Justificada' : 'Injustificada'}
              </Pill>
            </div>
            <div className="info-item"><span className="form-label">Dias</span><span>{selectedAbsence.days}</span></div>
            <div className="info-item"><span className="form-label">Pedido em</span><span>{selectedAbsence.requestedAt}</span></div>
            <div className="info-item">
              <span className="form-label">Estado</span>
              <Pill tone={STATUS_META[selectedAbsence.status as AbsStatus].tone} dot={false}>
                {STATUS_META[selectedAbsence.status as AbsStatus].label}
              </Pill>
            </div>
          </div>

          {selectedAbsence.reason && (
            <div style={{ marginTop: 16, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
              <div className="form-label" style={{ marginBottom: 4 }}>Motivo</div>
              <div style={{ fontSize: 14 }}>{selectedAbsence.reason}</div>
            </div>
          )}

          {selectedAbsence.mentorNote && (
            <div style={{ marginTop: 12, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
              <div className="form-label" style={{ marginBottom: 4 }}>Nota do mentor</div>
              <div style={{ fontSize: 14 }}>{selectedAbsence.mentorNote}</div>
            </div>
          )}

          {selectedAbsence.rhNote && (
            <div style={{ marginTop: 12, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
              <div className="form-label" style={{ marginBottom: 4 }}>Nota RH</div>
              <div style={{ fontSize: 14 }}>{selectedAbsence.rhNote}</div>
            </div>
          )}

          {selectedAbsence.status === 'pending' && (
            <div style={{ marginTop: 20 }}>
              <div className="form-group">
                <label className="form-label">Nota RH (opcional)</label>
                <textarea
                  className="input"
                  rows={3}
                  value={rhNote}
                  onChange={e => setRhNote(e.target.value)}
                  placeholder="Adicionar nota..."
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn btn-primary" onClick={() => decidir(selectedAbsence.id, 'approved')}>Aprovar</button>
                <button className="btn btn-danger" onClick={() => decidir(selectedAbsence.id, 'rejected')}>Rejeitar</button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
