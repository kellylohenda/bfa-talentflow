'use client'
import { useState } from 'react'
import { bolseiroPayments, bolseiroNotifs, tasks } from '@/lib/data'
import { fmtKz } from '@/lib/utils'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Modal from '@/components/ui/Modal'
import Icon from '@/components/ui/Icon'
import type { TaskStatus, PaymentStatus } from '@/types'

const ME = {
  name: 'Lwini Capemba',
  id: 'T-1042',
  program: 'Futuro BFA',
  university: 'Universidade Agostinho Neto',
  course: 'Economia',
  year: 'Trainee Y1',
  mentor: 'Edmilson Cardoso',
  dept: 'Banca de Empresas',
  gpa: 17.2,
  perf: 92,
  startDate: '2024-09-01',
}

function payLabel(s: PaymentStatus) {
  return s === 'paid' ? 'Pago' : s === 'pending' ? 'Pendente' : s === 'failed' ? 'Falhou' : 'Em espera'
}
function payTone(s: PaymentStatus): 'success' | 'warn' | 'danger' | 'neutral' {
  return s === 'paid' ? 'success' : s === 'pending' ? 'warn' : s === 'failed' ? 'danger' : 'neutral'
}
function taskLabel(s: TaskStatus) {
  return s === 'done' ? 'Concluída' : s === 'in_progress' ? 'Em curso' : s === 'overdue' ? 'Atrasada' : 'Pendente'
}
function taskTone(s: TaskStatus): 'success' | 'warn' | 'danger' | 'neutral' {
  return s === 'done' ? 'success' : s === 'in_progress' ? 'warn' : s === 'overdue' ? 'danger' : 'neutral'
}

const myTasks = tasks.filter(t => t.talentId === ME.id)

const DOC_TYPES = ['Boletim', 'Relatório', 'Comprovativo', 'Identificação', 'Contrato']

export default function BolseiroPage() {
  const [tab, setTab] = useState<'inicio' | 'pagamentos' | 'tarefas' | 'perfil'>('inicio')
  const [notifs, setNotifs] = useState(bolseiroNotifs)
  const [taskList, setTaskList] = useState(myTasks)
  const [docModal, setDocModal] = useState(false)
  const [docForm, setDocForm] = useState({ type: 'Boletim', period: '', notes: '', file: '' })
  const [docSubmitted, setDocSubmitted] = useState(false)

  const unread = notifs.filter(n => !n.read).length
  const lastPayment = bolseiroPayments.find(p => p.status === 'paid')
  const pendingTasks = taskList.filter(t => t.status === 'pending' || t.status === 'in_progress')
  const overdue = taskList.filter(t => t.status === 'overdue')

  const markTaskDone = (id: string) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, status: 'done' as const, completedAt: '2026-05-07' } : t))
  }

  const handleDocSubmit = () => {
    if (!docForm.period.trim()) return
    setDocSubmitted(true)
    setTimeout(() => {
      setDocModal(false)
      setDocSubmitted(false)
      setDocForm({ type: 'Boletim', period: '', notes: '', file: '' })
    }, 1200)
  }

  const markRead = (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Olá, {ME.name.split(' ')[0]}</h1>
          <p className="page-subtitle">{ME.program} · {ME.university}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {unread > 0 && (
            <Pill tone="warn">{unread} notificações</Pill>
          )}
          <button className="btn btn-primary" onClick={() => setDocModal(true)}>
            <Icon name="upload" size={14} />
            Submeter Documento
          </button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Último Subsídio" value={lastPayment ? fmtKz(lastPayment.amount) : '—'} sub={lastPayment?.date ?? ''} delta="Recebido" deltaTone="up" icon="cash" />
        <KPI label="Desempenho" value={`${ME.perf}%`} sub="Ciclo actual" delta="+4pts" deltaTone="up" icon="star" />
        <KPI label="Média Académica" value={String(ME.gpa)} sub="/ 20 valores" delta="Excelente" deltaTone="up" icon="check" />
        <KPI label="Tarefas Pendentes" value={pendingTasks.length} sub={overdue.length > 0 ? `${overdue.length} em atraso` : 'Em dia'} delta={overdue.length > 0 ? 'Urgente' : 'OK'} deltaTone={overdue.length > 0 ? 'down' : 'up'} icon="clock" />
      </div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        {(['inicio','pagamentos','tarefas','perfil'] as const).map(t => (
          <button key={t} className={`tab ${tab === t ? 'tab-active' : ''}`} onClick={() => setTab(t)}>
            {t === 'inicio' ? 'Início' : t === 'pagamentos' ? 'Pagamentos' : t === 'tarefas' ? 'As Minhas Tarefas' : 'O Meu Perfil'}
          </button>
        ))}
      </div>

      {tab === 'inicio' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head"><span className="card-title">Notificações</span></div>
            {notifs.map(n => (
              <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', opacity: n.read ? 0.55 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 13 }}>{n.title}</strong>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
                    <span style={{ fontSize: 11, opacity: 0.5 }}>{n.when}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, opacity: 0.65, margin: 0 }}>{n.text}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-head"><span className="card-title">Próxima Sessão de Mentoria</span></div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{ME.mentor}</div>
              <div style={{ fontSize: 12, opacity: 0.55, marginBottom: 12 }}>Departamento: {ME.dept}</div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 6, padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>8 de Maio · 15h00</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>Revisão Q2 e objectivos de estágio</div>
              </div>
            </div>
            <div className="card">
              <div className="card-head"><span className="card-title">Tarefas Urgentes</span></div>
              {[...overdue, ...pendingTasks].slice(0, 3).map((t) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>Prazo: {t.dueDate}</div>
                  </div>
                  <Pill tone={taskTone(t.status)}>{taskLabel(t.status)}</Pill>
                </div>
              ))}
              {pendingTasks.length === 0 && overdue.length === 0 && (
                <p style={{ opacity: 0.45, fontSize: 13 }}>Sem tarefas urgentes.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'pagamentos' && (
        <div className="card">
          <div className="card-head"><span className="card-title">Histórico de Pagamentos</span></div>
          <table className="tbl">
            <thead>
              <tr><th>ID</th><th>Período</th><th>Tipo</th><th>Montante</th><th>Estado</th><th>Data</th></tr>
            </thead>
            <tbody>
              {bolseiroPayments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontSize: 12, opacity: 0.55 }}>{p.id}</td>
                  <td>{p.period}</td>
                  <td>{p.type}</td>
                  <td style={{ fontWeight: 600 }}>{fmtKz(p.amount)}</td>
                  <td><Pill tone={payTone(p.status)}>{payLabel(p.status)}</Pill></td>
                  <td style={{ fontSize: 12, opacity: 0.65 }}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '16px 0 0', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>Total recebido</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {fmtKz(bolseiroPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'tarefas' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>Tarefa</th><th>Atribuída por</th><th>Categoria</th><th>Prioridade</th><th>Prazo</th><th>Estado</th><th>Acção</th></tr>
            </thead>
            <tbody>
              {taskList.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{t.title}</div>
                    <div style={{ fontSize: 11, opacity: 0.55 }}>{t.description.slice(0, 70)}...</div>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {t.assignedBy}
                    <div style={{ fontSize: 11, opacity: 0.5 }}>{t.assignedByRole === 'rh' ? 'RH' : 'Mentor'}</div>
                  </td>
                  <td><Pill tone="neutral" dot={false}>{t.category}</Pill></td>
                  <td>
                    <Pill tone={t.priority === 'alta' ? 'danger' : t.priority === 'média' ? 'warn' : 'neutral'}>
                      {t.priority}
                    </Pill>
                  </td>
                  <td style={{ fontSize: 12 }}>{t.dueDate}</td>
                  <td><Pill tone={taskTone(t.status)}>{taskLabel(t.status)}</Pill></td>
                  <td>
                    {t.status !== 'done' ? (
                      <button className="btn btn-sm btn-primary" onClick={() => markTaskDone(t.id)}>Concluir</button>
                    ) : (
                      <span style={{ fontSize: 12, opacity: 0.4 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'perfil' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head"><span className="card-title">Informações Pessoais</span></div>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                ['Nome completo', ME.name],
                ['ID Bolseiro', ME.id],
                ['Programa', ME.program],
                ['Universidade', ME.university],
                ['Curso', ME.course],
                ['Ano / Fase', ME.year],
                ['Departamento BFA', ME.dept],
                ['Mentor', ME.mentor],
                ['Data de início', ME.startDate],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, opacity: 0.5 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="card-title">Desempenho Académico</span></div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{ME.gpa}</div>
              <div style={{ fontSize: 14, opacity: 0.55, marginTop: 8 }}>Média académica / 20</div>
            </div>
            <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13 }}>Desempenho no programa</span>
                <span style={{ fontWeight: 600 }}>{ME.perf}%</span>
              </div>
              <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ME.perf}%`, background: 'var(--primary)', borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>
      )}
      {docModal && (
        <Modal title="Submeter Documento" onClose={() => setDocModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Tipo de documento</label>
              <select
                className="select"
                style={{ width: '100%' }}
                value={docForm.type}
                onChange={e => setDocForm(f => ({ ...f, type: e.target.value }))}
              >
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Período *</label>
              <input
                className="input"
                placeholder="Ex: Q1 2026 / S1 2026"
                style={{ width: '100%' }}
                value={docForm.period}
                onChange={e => setDocForm(f => ({ ...f, period: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Ficheiro</label>
              <div
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 8,
                  padding: '20px',
                  textAlign: 'center',
                  fontSize: 13,
                  opacity: 0.6,
                  cursor: 'pointer',
                }}
                onClick={() => setDocForm(f => ({ ...f, file: 'documento.pdf' }))}
              >
                {docForm.file ? (
                  <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
                    <Icon name="doc" size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    {docForm.file}
                  </span>
                ) : (
                  <>
                    <Icon name="upload" size={20} style={{ marginBottom: 6, display: 'block', margin: '0 auto 6px' }} />
                    Clique para seleccionar ficheiro (PDF, máx. 10 MB)
                  </>
                )}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Notas (opcional)</label>
              <textarea
                className="input"
                rows={2}
                placeholder="Informações adicionais..."
                style={{ width: '100%', resize: 'vertical' }}
                value={docForm.notes}
                onChange={e => setDocForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setDocModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                onClick={handleDocSubmit}
                disabled={!docForm.period.trim() || docSubmitted}
              >
                {docSubmitted ? 'A submeter…' : 'Submeter'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
