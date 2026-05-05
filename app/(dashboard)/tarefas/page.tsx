'use client'

import { useState } from 'react'
import { tasks as initialTasks, talents } from '@/lib/data'
import { initials, avatarColor } from '@/lib/utils'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Modal from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import type { Task } from '@/types'

const STATUS_META: Record<string, { label: string; tone: 'neutral' | 'info' | 'success' | 'danger' | 'warn' }> = {
  pending:     { label: 'Pendente',    tone: 'neutral' },
  in_progress: { label: 'Em curso',   tone: 'info' },
  done:        { label: 'Concluída',  tone: 'success' },
  overdue:     { label: 'Em atraso',  tone: 'danger' },
}
const PRIORITY_META: Record<string, { label: string; tone: 'danger' | 'warn' | 'neutral' }> = {
  alta:  { label: 'Alta',  tone: 'danger' },
  média: { label: 'Média', tone: 'warn' },
  baixa: { label: 'Baixa', tone: 'neutral' },
}

const TODAY = '2026-05-05'

const activeTalents = talents.filter(t => t.status === 'active' || t.status === 'onboarding')

const CATEGORIES = ['Relatório', 'Formação', 'Documento', 'PDI', 'Apresentação', 'Avaliação', 'Certificação']

export default function PageTarefas() {
  const [taskList, setTaskList] = useState<Task[]>([...initialTasks])
  const [activeTab, setActiveTab] = useState<'lista' | 'talento' | 'criar'>('lista')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    talentId: '',
    assignedBy: 'Mariana Quissama',
    category: 'Relatório',
    priority: 'alta',
    dueDate: '',
  })

  const total = taskList.length
  const pendentes = taskList.filter(t => t.status === 'pending').length
  const emCurso = taskList.filter(t => t.status === 'in_progress').length
  const emAtraso = taskList.filter(t => t.status === 'overdue').length
  const concluidas = taskList.filter(t => t.status === 'done').length

  const filtered = taskList.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false
    return true
  })

  const markDone = (id: string) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, status: 'done' as const, completedAt: TODAY } : t))
  }

  const grouped = activeTalents.map(talent => ({
    talent,
    tasks: taskList.filter(t => t.talentId === talent.id),
  })).filter(g => g.tasks.length > 0)

  const handleCreate = () => {
    if (!form.title.trim() || !form.dueDate) return
    const talent = activeTalents.find(t => t.id === form.talentId)
    const newTask: Task = {
      id: `TK-${String(taskList.length + 1).padStart(4, '0')}`,
      title: form.title,
      description: form.description,
      talentId: form.talentId,
      talentName: talent?.name ?? '',
      assignedBy: form.assignedBy,
      assignedByRole: 'rh',
      category: form.category,
      priority: form.priority as 'alta' | 'média' | 'baixa',
      status: 'pending',
      dueDate: form.dueDate,
      completedAt: null,
    }
    setTaskList(prev => [...prev, newTask])
    setForm({ title: '', description: '', talentId: '', assignedBy: 'Mariana Quissama', category: 'Relatório', priority: 'alta', dueDate: '' })
    setActiveTab('lista')
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <div className="page-title">Tarefas</div>
          <div className="page-subtitle">Gestão de tarefas dos talentos</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Total" value={total} icon="list" />
        <KPI label="Pendentes" value={pendentes} icon="clock" />
        <KPI label="Em curso" value={emCurso} icon="activity" />
        <KPI label="Em atraso" value={emAtraso} icon="alert-triangle" sub="Acção necessária" />
      </div>
      <div style={{ marginBottom: 24 }}>
        <KPI label="Concluídas" value={concluidas} icon="check-circle" />
      </div>

      <div className="tabs">
        <button className={`tab${activeTab === 'lista' ? ' tab--active' : ''}`} onClick={() => setActiveTab('lista')}>
          Todas as tarefas <span className="tab-count">{total}</span>
        </button>
        <button className={`tab${activeTab === 'talento' ? ' tab--active' : ''}`} onClick={() => setActiveTab('talento')}>
          Por talento
        </button>
        <button className={`tab${activeTab === 'criar' ? ' tab--active' : ''}`} onClick={() => setActiveTab('criar')}>
          + Nova tarefa
        </button>
      </div>

      {activeTab === 'lista' && (
        <div className="card">
          <div className="toolbar" style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
            <select className="select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">Todos os estados</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em curso</option>
              <option value="overdue">Em atraso</option>
              <option value="done">Concluída</option>
            </select>
            <select className="select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="all">Todas as prioridades</option>
              <option value="alta">Alta</option>
              <option value="média">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tarefa</th>
                <th>Talento</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Prazo</th>
                <th>Estado</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => {
                const isOverdue = task.status === 'overdue'
                const sm = STATUS_META[task.status]
                const pm = PRIORITY_META[task.priority]
                return (
                  <tr key={task.id} className={isOverdue ? 'row-active' : ''}>
                    <td><span className="mono">{task.id}</span></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>por {task.assignedBy}</div>
                    </td>
                    <td>{task.talentName}</td>
                    <td><Pill tone="neutral" dot={false}>{task.category}</Pill></td>
                    <td><Pill tone={pm.tone} dot={false}>{pm.label}</Pill></td>
                    <td style={{ color: isOverdue ? 'var(--danger)' : undefined }}>{task.dueDate}</td>
                    <td><Pill tone={sm.tone} dot={false}>{sm.label}</Pill></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm" onClick={() => setSelectedTask(task)}>Ver</button>
                        {task.status !== 'done' && (
                          <button className="btn btn-sm btn-primary" onClick={() => markDone(task.id)}>Concluir</button>
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

      {activeTab === 'talento' && (
        <div className="grid cols-3">
          {grouped.map(({ talent, tasks: tTasks }) => (
            <div key={talent.id} className="card">
              <div className="card-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={talent.name} size={36} />
                  <div>
                    <div className="card-title">{talent.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>Mentor: {talent.mentor}</div>
                  </div>
                </div>
                <button
                  className="btn btn-xs btn-primary"
                  onClick={() => { setForm(f => ({ ...f, talentId: talent.id })); setActiveTab('criar') }}
                >
                  + Tarefa
                </button>
              </div>
              <div style={{ padding: '0 16px 16px' }}>
                {tTasks.map(task => {
                  const sm = STATUS_META[task.status]
                  const pm = PRIORITY_META[task.priority]
                  return (
                    <div key={task.id} style={{ borderBottom: '1px solid var(--border)', padding: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                          <Pill tone={sm.tone} dot={false}>{sm.label}</Pill>
                          <Pill tone={pm.tone} dot={false}>{pm.label}</Pill>
                        </div>
                      </div>
                      {task.status !== 'done' && (
                        <button className="btn btn-xs" onClick={() => markDone(task.id)}>Concluir</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'criar' && (
        <div className="card card-pad" style={{ maxWidth: 640 }}>
          <div className="card-title" style={{ marginBottom: 20 }}>Nova tarefa</div>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título da tarefa" />
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descrição detalhada..." style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Talento</label>
            <select className="select" value={form.talentId} onChange={e => setForm(f => ({ ...f, talentId: e.target.value }))}>
              <option value="">Seleccionar talento...</option>
              {activeTalents.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Atribuído por</label>
            <input className="input" value={form.assignedBy} onChange={e => setForm(f => ({ ...f, assignedBy: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select className="select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select className="select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Prazo *</label>
            <input className="input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={handleCreate} disabled={!form.title.trim() || !form.dueDate}>Criar tarefa</button>
        </div>
      )}

      {selectedTask && (
        <Modal title={`Tarefa ${selectedTask.id}`} onClose={() => setSelectedTask(null)}>
          <div className="info-grid">
            <div className="info-item"><span className="form-label">Título</span><span>{selectedTask.title}</span></div>
            <div className="info-item"><span className="form-label">Talento</span><span>{selectedTask.talentName}</span></div>
            <div className="info-item"><span className="form-label">Atribuído por</span><span>{selectedTask.assignedBy}</span></div>
            <div className="info-item"><span className="form-label">Categoria</span><span>{selectedTask.category}</span></div>
            <div className="info-item"><span className="form-label">Prioridade</span><Pill tone={PRIORITY_META[selectedTask.priority].tone} dot={false}>{PRIORITY_META[selectedTask.priority].label}</Pill></div>
            <div className="info-item"><span className="form-label">Estado</span><Pill tone={STATUS_META[selectedTask.status].tone} dot={false}>{STATUS_META[selectedTask.status].label}</Pill></div>
            <div className="info-item"><span className="form-label">Prazo</span><span>{selectedTask.dueDate}</span></div>
            {selectedTask.completedAt && <div className="info-item"><span className="form-label">Concluída em</span><span>{selectedTask.completedAt}</span></div>}
          </div>
          {selectedTask.description && (
            <div style={{ marginTop: 16, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
              <div className="form-label" style={{ marginBottom: 4 }}>Descrição</div>
              <div style={{ fontSize: 14 }}>{selectedTask.description}</div>
            </div>
          )}
          {selectedTask.status !== 'done' && (
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-primary" onClick={() => { markDone(selectedTask.id); setSelectedTask(null) }}>Concluir tarefa</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
