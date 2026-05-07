'use client'

import { useState } from 'react'
import { volunteers, hoursEntries } from '@/lib/data'
import type { Volunteer, VolunteerStatus, ActivityType } from '@/types'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Modal from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import Icon from '@/components/ui/Icon'

const STATUS_TONE: Record<VolunteerStatus, 'success' | 'danger' | 'neutral'> = {
  activo:     'success',
  inactivo:   'neutral',
  desistente: 'danger',
}
const STATUS_LABEL: Record<VolunteerStatus, string> = {
  activo:     'Activo',
  inactivo:   'Inactivo',
  desistente: 'Desistente',
}

const AREA_LABEL: Record<ActivityType, string> = {
  saude:    'Saúde',
  educacao: 'Educação',
  ambiente: 'Ambiente',
  social:   'Social',
  cultura:  'Cultura',
}
const AREA_COLOR: Record<ActivityType, string> = {
  saude:    '#EF4444',
  educacao: '#3B82F6',
  ambiente: '#10B981',
  social:   '#F59E0B',
  cultura:  '#8B5CF6',
}

export default function VoluntariosPage() {
  const [search, setSearch]         = useState('')
  const [filterStatus, setStatus]   = useState<VolunteerStatus | 'todos'>('todos')
  const [filterArea, setArea]       = useState<ActivityType | 'todos'>('todos')
  const [selected, setSelected]     = useState<Volunteer | null>(null)
  const [newModal, setNewModal]     = useState(false)
  const [newForm, setNewForm]       = useState({ nome: '', email: '', tel: '', profissao: '', instituicao: '', provincia: 'Luanda', local: '', areaActuacao: 'educacao' as ActivityType })

  const total      = volunteers.length
  const activos    = volunteers.filter(v => v.status === 'activo').length
  const desistentes= volunteers.filter(v => v.status === 'desistente').length
  const totalHoras = volunteers.reduce((s, v) => s + v.totalHoras, 0)

  const filtered = volunteers.filter(v => {
    const q = search.toLowerCase()
    const matchSearch = !q || v.nome.toLowerCase().includes(q) || v.profissao.toLowerCase().includes(q) || v.instituicao.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'todos' || v.status === filterStatus
    const matchArea   = filterArea   === 'todos' || v.areaActuacao === filterArea
    return matchSearch && matchStatus && matchArea
  })

  const selectedHours = selected
    ? hoursEntries.filter(h => h.voluntarioId === selected.id)
    : []

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Voluntários</h1>
          <p className="page-subtitle">Base de dados — Fundação BFA · {new Date().getFullYear()}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setNewModal(true)}>
          <Icon name="plus" size={15} />
          Registar voluntário
        </button>
      </div>

      {/* Context banner */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, padding: '12px 16px', borderRadius: 10, background: '#10B98108', border: '1px solid #10B98130', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18 }}>🤝</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981', marginBottom: 3 }}>Voluntários — Programa CSR · Fundação BFA</div>
            <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>Cidadãos que se inscrevem voluntariamente para participar em actividades de impacto social. Sem bolsa nem contratação — contribuem com horas em áreas como saúde, educação, ambiente, cultura e acção social.</div>
          </div>
        </div>
        <div style={{ padding: '12px 16px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', minWidth: 220 }}>
          <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Difere de Talentos (Bolseiros/Estagiários)</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, opacity: 0.8, lineHeight: 1.8 }}>
            <li>Sem bolsa ou subsídio</li>
            <li>Sem pathway para contratação</li>
            <li>Contabilização por horas de actividade</li>
            <li>Foco em responsabilidade social (CSR)</li>
          </ul>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total inscritos"   value={total}      icon="users"  />
        <KPI label="Activos"           value={activos}    icon="check"  delta={`${Math.round(activos/total*100)}%`} deltaTone="up" />
        <KPI label="Desistentes"       value={desistentes}icon="x"      delta="Este ano" deltaTone="flat" />
        <KPI label="Horas acumuladas"  value={totalHoras} icon="clock"  delta="Validadas" deltaTone="up" />
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
              <Icon name="search" size={14} />
            </span>
            <input
              style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
              placeholder="Pesquisar por nome, profissão ou instituição…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
            value={filterStatus}
            onChange={e => setStatus(e.target.value as VolunteerStatus | 'todos')}
          >
            <option value="todos">Todos os estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="desistente">Desistente</option>
          </select>
          <select
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
            value={filterArea}
            onChange={e => setArea(e.target.value as ActivityType | 'todos')}
          >
            <option value="todos">Todas as áreas</option>
            <option value="saude">Saúde</option>
            <option value="educacao">Educação</option>
            <option value="ambiente">Ambiente</option>
            <option value="social">Social</option>
            <option value="cultura">Cultura</option>
          </select>
          <span style={{ fontSize: 12, opacity: 0.5, marginLeft: 'auto' }}>{filtered.length} resultado(s)</span>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Profissão</th>
              <th>Instituição</th>
              <th>Área</th>
              <th>Província</th>
              <th>Inscrição</th>
              <th>Estado</th>
              <th>Horas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td>
                  <div className="cell-person">
                    <Avatar name={v.nome} size={28} />
                    <div className="meta">
                      <span className="name">{v.nome}</span>
                      <span className="sub">{v.email}</span>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13 }}>{v.profissao}</td>
                <td style={{ fontSize: 13 }}>{v.instituicao}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: AREA_COLOR[v.areaActuacao], flexShrink: 0 }} />
                    {AREA_LABEL[v.areaActuacao]}
                  </span>
                </td>
                <td style={{ fontSize: 13 }}>{v.provincia}</td>
                <td style={{ fontSize: 13 }}>{new Date(v.dataInscricao).toLocaleDateString('pt-PT')}</td>
                <td>
                  <Pill tone={STATUS_TONE[v.status]}>{STATUS_LABEL[v.status]}</Pill>
                </td>
                <td>
                  <span style={{ fontSize: 13, fontWeight: 600, color: v.totalHoras >= 40 ? 'var(--success)' : 'var(--text)' }}>
                    {v.totalHoras} h
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm" onClick={() => setSelected(v)}>Ver</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px 0', opacity: 0.4, fontSize: 13 }}>Sem resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <Modal title={`Voluntário — ${selected.nome}`} onClose={() => setSelected(null)} width={620}>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">ID</span><span className="info-value">{selected.id}</span></div>
            <div className="info-item"><span className="info-label">Estado</span><span className="info-value"><Pill tone={STATUS_TONE[selected.status]}>{STATUS_LABEL[selected.status]}</Pill></span></div>
            <div className="info-item"><span className="info-label">Profissão</span><span className="info-value">{selected.profissao}</span></div>
            <div className="info-item"><span className="info-label">Instituição</span><span className="info-value">{selected.instituicao}</span></div>
            <div className="info-item"><span className="info-label">Email</span><span className="info-value">{selected.email}</span></div>
            <div className="info-item"><span className="info-label">Telemóvel</span><span className="info-value">{selected.tel}</span></div>
            <div className="info-item"><span className="info-label">Província</span><span className="info-value">{selected.provincia}</span></div>
            <div className="info-item"><span className="info-label">Local de actuação</span><span className="info-value">{selected.local}</span></div>
            <div className="info-item"><span className="info-label">Área principal</span><span className="info-value">{AREA_LABEL[selected.areaActuacao]}</span></div>
            <div className="info-item"><span className="info-label">Data de inscrição</span><span className="info-value">{new Date(selected.dataInscricao).toLocaleDateString('pt-PT')}</span></div>
            <div className="info-item"><span className="info-label">Total de horas</span><span className="info-value" style={{ fontWeight: 700, color: 'var(--orange)' }}>{selected.totalHoras} h</span></div>
          </div>

          {selectedHours.length > 0 && (
            <>
              <div style={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '20px 0 10px' }}>
                Histórico de actividades
              </div>
              <table className="tbl">
                <thead><tr><th>Actividade</th><th>Data</th><th>Horas</th><th>Validado</th></tr></thead>
                <tbody>
                  {selectedHours.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontSize: 12 }}>{h.actividadeNome}</td>
                      <td style={{ fontSize: 12 }}>{new Date(h.data).toLocaleDateString('pt-PT')}</td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>{h.horas} h</td>
                      <td>
                        {h.validado
                          ? <Pill tone="success">Sim</Pill>
                          : <Pill tone="warn">Pendente</Pill>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Modal>
      )}

      {newModal && (
        <Modal title="Registar Voluntário" onClose={() => setNewModal(false)} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Nome completo *</label>
                <input className="input" style={{ width: '100%' }} value={newForm.nome} onChange={e => setNewForm(f => ({ ...f, nome: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Email *</label>
                <input className="input" type="email" style={{ width: '100%' }} value={newForm.email} onChange={e => setNewForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Telemóvel</label>
                <input className="input" style={{ width: '100%' }} value={newForm.tel} onChange={e => setNewForm(f => ({ ...f, tel: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Profissão</label>
                <input className="input" style={{ width: '100%' }} value={newForm.profissao} onChange={e => setNewForm(f => ({ ...f, profissao: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Instituição</label>
              <input className="input" style={{ width: '100%' }} value={newForm.instituicao} onChange={e => setNewForm(f => ({ ...f, instituicao: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Área de actuação</label>
                <select className="select" style={{ width: '100%' }} value={newForm.areaActuacao} onChange={e => setNewForm(f => ({ ...f, areaActuacao: e.target.value as ActivityType }))}>
                  <option value="saude">Saúde</option>
                  <option value="educacao">Educação</option>
                  <option value="ambiente">Ambiente</option>
                  <option value="social">Social</option>
                  <option value="cultura">Cultura</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Província</label>
                <input className="input" style={{ width: '100%' }} value={newForm.provincia} onChange={e => setNewForm(f => ({ ...f, provincia: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Local de actuação</label>
              <input className="input" style={{ width: '100%' }} placeholder="Ex: Hospital Geral de Luanda" value={newForm.local} onChange={e => setNewForm(f => ({ ...f, local: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button className="btn" onClick={() => setNewModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                disabled={!newForm.nome.trim() || !newForm.email.trim()}
                onClick={() => setNewModal(false)}
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
