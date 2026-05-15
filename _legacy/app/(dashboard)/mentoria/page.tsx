'use client'

import { useState } from 'react'
import { mentors, talents } from '@/lib/data'
import { initials, avatarColor } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Bar from '@/components/ui/Bar'
import Modal from '@/components/ui/Modal'

interface MatchSuggestion {
  mentor: string
  mentee: string
  score: number
  reasons: string[]
}

const INITIAL_SUGGESTIONS: MatchSuggestion[] = [
  { mentor: 'Sofia Mendes',      mentee: 'Tomás Quissanga',  score: 94, reasons: ['Finanças', 'Lisboa', 'Bif'] },
  { mentor: 'Patrícia Lopes',    mentee: 'Pedro Bastos',     score: 91, reasons: ['TI', 'Luanda', 'fbfa'] },
  { mentor: 'José Almeida',      mentee: 'Inês Caholo',      score: 88, reasons: ['Matemática', 'Analítica'] },
  { mentor: 'Edmilson Cardoso',  mentee: 'Liliana Bange',    score: 86, reasons: ['Economia', 'BFA'] },
  { mentor: 'Domingos Vieira',   mentee: 'Eunice Bula',      score: 83, reasons: ['Contabilidade'] },
]

const activeTalents = talents.filter(t => t.status === 'active' || t.status === 'onboarding')

export default function PageMentoria() {
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>(INITIAL_SUGGESTIONS)
  const [showAtribuirModal, setShowAtribuirModal] = useState(false)
  const [atribuirTarget, setAtribuirTarget] = useState<MatchSuggestion | null>(null)
  const [atribuirForm, setAtribuirForm] = useState({
    menteeId: '',
    mentorName: '',
    startDate: '',
    frequency: 'Quinzenal',
    notes: '',
  })

  const removeSuggestion = (mentee: string) => {
    setSuggestions(prev => prev.filter(s => s.mentee !== mentee))
  }

  const handleAtribuir = (s: MatchSuggestion) => {
    setAtribuirTarget(s)
    setAtribuirForm(f => ({ ...f, mentorName: s.mentor, menteeId: s.mentee }))
    setShowAtribuirModal(true)
  }

  const submitAtribuir = () => {
    if (atribuirTarget) removeSuggestion(atribuirTarget.mentee)
    setShowAtribuirModal(false)
    setAtribuirTarget(null)
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <div className="page-title">Mentoria Pro</div>
          <div className="page-subtitle">Sugestões de emparelhamento e gestão de mentores</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Pares activos" value={23} icon="briefcase" />
        <KPI label="Sugestões pendentes" value={suggestions.length} icon="star" />
        <KPI label="Taxa de sucesso" value="87%" icon="check-circle" />
        <KPI label="Próximas sessões" value={8} icon="calendar" />
      </div>

      {/* Suggestions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <div className="card-title">Sugestões de emparelhamento</div>
        </div>
        {suggestions.length === 0 ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', opacity: 0.5 }}>
            Sem sugestões pendentes
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Mentorando</th>
                <th>Mentor sugerido</th>
                <th>Compatibilidade</th>
                <th>Motivos</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map(s => (
                <tr key={s.mentee}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={s.mentee} size={28} />
                      <span>{s.mentee}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={s.mentor} size={28} />
                      <span>{s.mentor}</span>
                    </div>
                  </td>
                  <td style={{ minWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <Bar value={s.score} max={100} tone="success" />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{s.score}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {s.reasons.map(r => (
                        <Pill key={r} tone="neutral" dot={false}>{r}</Pill>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-primary" onClick={() => removeSuggestion(s.mentee)}>Aprovar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => removeSuggestion(s.mentee)}>Rejeitar</button>
                      <button className="btn btn-sm" onClick={() => handleAtribuir(s)}>Atribuir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mentors table */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Mentores</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Departamento</th>
              <th>Mentorandos</th>
              <th>Rating</th>
              <th>Disponibilidade</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map(m => {
              const full = m.mentees >= 8
              return (
                <tr key={m.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={m.name} size={28} />
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td>{m.dept}</td>
                  <td>{m.mentees}/8</td>
                  <td>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(i => (
                        <span key={i} style={{ color: i <= Math.round(m.rating) ? '#F59E0B' : 'var(--border)', fontSize: 14 }}>★</span>
                      ))}
                      <span style={{ fontSize: 12, marginLeft: 4, opacity: 0.7 }}>{m.rating}</span>
                    </div>
                  </td>
                  <td>
                    <Pill tone={full ? 'danger' : 'success'} dot={false}>
                      {full ? 'Lotado' : 'Verde'}
                    </Pill>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showAtribuirModal && (
        <Modal title="Atribuir Mentoria" onClose={() => setShowAtribuirModal(false)}>
          <div className="form-group">
            <label className="form-label">Mentorando</label>
            <select className="select" value={atribuirForm.menteeId} onChange={e => setAtribuirForm(f => ({ ...f, menteeId: e.target.value }))}>
              <option value={atribuirTarget?.mentee}>{atribuirTarget?.mentee}</option>
              {activeTalents.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Mentor</label>
            <select className="select" value={atribuirForm.mentorName} onChange={e => setAtribuirForm(f => ({ ...f, mentorName: e.target.value }))}>
              {mentors.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Data de início</label>
            <input className="input" type="date" value={atribuirForm.startDate} onChange={e => setAtribuirForm(f => ({ ...f, startDate: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Frequência</label>
            <select className="select" value={atribuirForm.frequency} onChange={e => setAtribuirForm(f => ({ ...f, frequency: e.target.value }))}>
              <option value="Quinzenal">Quinzenal</option>
              <option value="Mensal">Mensal</option>
              <option value="Semanal">Semanal</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notas</label>
            <textarea className="input" rows={3} value={atribuirForm.notes} onChange={e => setAtribuirForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notas adicionais..." style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={submitAtribuir}>Confirmar atribuição</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
