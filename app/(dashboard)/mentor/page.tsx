'use client'
import { useState } from 'react'
import { talents, tasks } from '@/lib/data'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Avatar from '@/components/ui/Avatar'
import Bar from '@/components/ui/Bar'
import Modal from '@/components/ui/Modal'
import type { Task, TaskStatus } from '@/types'

const MY_MENTOR = 'Edmilson Cardoso'
const MY_MENTEES = talents.filter(t => t.mentor === MY_MENTOR)

interface MentorSession {
  id: string; date: string; time: string; mentee: string; topic: string; dur: number; status: 'upcoming' | 'done'
}

const SESSIONS: MentorSession[] = [
  { id: 'S-001', date: '2026-05-08', time: '15:00', mentee: 'Lwini Capemba',   topic: 'Análise de crédito e plano Q2',       dur: 60, status: 'upcoming' },
  { id: 'S-002', date: '2026-05-06', time: '10:00', mentee: 'Kiala Domingos',  topic: 'Revisão do relatório de estágio',     dur: 45, status: 'upcoming' },
  { id: 'S-003', date: '2026-04-30', time: '14:00', mentee: 'Lwini Capemba',   topic: 'Balanço mensal e próximos objectivos',dur: 60, status: 'done' },
  { id: 'S-004', date: '2026-04-22', time: '11:00', mentee: 'Alberto Massano', topic: 'Plano de carreira — transição',        dur: 90, status: 'done' },
  { id: 'S-005', date: '2026-04-15', time: '15:00', mentee: 'Kiala Domingos',  topic: 'Rotação Banca Privada',               dur: 60, status: 'done' },
]

const myTasks = tasks.filter(t => t.assignedBy === MY_MENTOR)

function taskTone(s: TaskStatus): 'success' | 'warn' | 'danger' | 'neutral' {
  return s === 'done' ? 'success' : s === 'overdue' ? 'danger' : s === 'in_progress' ? 'warn' : 'neutral'
}
function taskLabel(s: TaskStatus) {
  return s === 'done' ? 'Concluída' : s === 'overdue' ? 'Atrasada' : s === 'in_progress' ? 'Em curso' : 'Pendente'
}

export default function MentorPage() {
  const [tab, setTab] = useState<'dashboard' | 'sessoes' | 'tarefas' | 'mentorandos'>('dashboard')
  const [newSession, setNewSession] = useState(false)

  const upcoming = SESSIONS.filter(s => s.status === 'upcoming')
  const done = SESSIONS.filter(s => s.status === 'done')
  const pendingTasks = myTasks.filter(t => t.status !== 'done')

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={MY_MENTOR} size={36} />
            <div>
              <h1 className="page-title" style={{ margin: 0 }}>Portal do Mentor</h1>
              <p className="page-subtitle" style={{ margin: 0 }}>{MY_MENTOR} · Banca de Empresas</p>
            </div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setNewSession(true)}>+ Nova Sessão</button>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Mentorandos" value={MY_MENTEES.length} sub="Activos" icon="users" />
        <KPI label="Sessões este mês" value={done.length} sub="Realizadas" delta="Concluídas" deltaTone="up" icon="check" />
        <KPI label="Próximas sessões" value={upcoming.length} sub="Agendadas" icon="calendar" />
        <KPI label="Tarefas pendentes" value={pendingTasks.length} sub="Para mentorandos" delta={pendingTasks.length > 3 ? 'Atenção' : 'OK'} deltaTone={pendingTasks.length > 3 ? 'flat' : 'up'} icon="clock" />
      </div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        {(['dashboard','sessoes','tarefas','mentorandos'] as const).map(t => (
          <button key={t} className={`tab ${tab === t ? 'tab-active' : ''}`} onClick={() => setTab(t)}>
            {t === 'dashboard' ? 'Visão Geral' : t === 'sessoes' ? 'Sessões' : t === 'tarefas' ? 'Tarefas' : 'Mentorandos'}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-head"><span className="card-title">Próximas Sessões</span></div>
            {upcoming.length === 0 ? (
              <p style={{ opacity: 0.45, fontSize: 13 }}>Nenhuma sessão agendada.</p>
            ) : upcoming.map(s => (
              <div key={s.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 14 }}>{s.mentee}</strong>
                  <Pill tone="info">Agendada</Pill>
                </div>
                <div style={{ fontSize: 12, opacity: 0.55 }}>{s.date} às {s.time} · {s.dur} min</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{s.topic}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-head"><span className="card-title">Mentorandos — Desempenho</span></div>
            {MY_MENTEES.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar name={m.name} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{m.name}</div>
                  <Bar value={m.perf} tone={m.perf >= 85 ? 'success' : m.perf >= 70 ? 'warn' : 'danger'} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{m.perf}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'sessoes' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>Data</th><th>Hora</th><th>Mentorando</th><th>Tema</th><th>Duração</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {SESSIONS.map(s => (
                <tr key={s.id}>
                  <td>{s.date}</td>
                  <td>{s.time}</td>
                  <td>
                    <div className="cell-person">
                      <Avatar name={s.mentee} size={24} />
                      <span>{s.mentee}</span>
                    </div>
                  </td>
                  <td>{s.topic}</td>
                  <td>{s.dur} min</td>
                  <td>
                    <Pill tone={s.status === 'upcoming' ? 'info' : 'success'}>
                      {s.status === 'upcoming' ? 'Agendada' : 'Realizada'}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'tarefas' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>Tarefa</th><th>Mentorando</th><th>Categoria</th><th>Prioridade</th><th>Prazo</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {myTasks.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{t.title}</div>
                    <div style={{ fontSize: 11, opacity: 0.55 }}>{t.description.slice(0, 60)}...</div>
                  </td>
                  <td>{t.talentName}</td>
                  <td><Pill tone="neutral" dot={false}>{t.category}</Pill></td>
                  <td>
                    <Pill tone={t.priority === 'alta' ? 'danger' : t.priority === 'média' ? 'warn' : 'neutral'}>
                      {t.priority}
                    </Pill>
                  </td>
                  <td style={{ fontSize: 12 }}>{t.dueDate}</td>
                  <td><Pill tone={taskTone(t.status)}>{taskLabel(t.status)}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'mentorandos' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>Nome</th><th>Programa</th><th>Universidade</th><th>Desempenho</th><th>GPA</th><th>Último Relatório</th></tr>
            </thead>
            <tbody>
              {MY_MENTEES.map(m => (
                <tr key={m.id}>
                  <td>
                    <div className="cell-person">
                      <Avatar name={m.name} size={28} />
                      <div className="meta">
                        <span className="name">{m.name}</span>
                        <span className="sub">{m.id}</span>
                      </div>
                    </div>
                  </td>
                  <td><Pill tone="neutral" dot={false}>{m.program.toUpperCase()}</Pill></td>
                  <td style={{ fontSize: 12 }}>{m.university}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80 }}>
                        <Bar value={m.perf} tone={m.perf >= 85 ? 'success' : m.perf >= 70 ? 'warn' : 'danger'} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{m.perf}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{m.gpa}</td>
                  <td style={{ fontSize: 12, opacity: 0.65 }}>{m.lastReport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {newSession && (
        <Modal title="Agendar Nova Sessão" onClose={() => setNewSession(false)}
          footer={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setNewSession(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setNewSession(false)}>Agendar Sessão</button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Mentorando</label>
              <select className="select" style={{ width: '100%' }}>
                {MY_MENTEES.map(m => <option key={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Data</label>
                <input type="date" className="input" defaultValue="2026-05-12" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Hora</label>
                <input type="time" className="input" defaultValue="15:00" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 6 }}>Tema</label>
              <input className="input" placeholder="Ex: Revisão objectivos Q2" style={{ width: '100%' }} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
