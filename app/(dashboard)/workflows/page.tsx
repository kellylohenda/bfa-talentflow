'use client'

import { useState } from 'react'
import { workflows as initialWorkflows } from '@/lib/data'
import { fmtKz, fmtKzShort } from '@/lib/utils'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Modal from '@/components/ui/Modal'
import type { Workflow } from '@/types'

const STEPS = ['Submissão', 'Validação RH', 'Aprovação Financeira', 'Pagamento']

export default function PageWorkflows() {
  const [wfList, setWfList] = useState<Workflow[]>([...initialWorkflows])
  const [selected, setSelected] = useState<Workflow | null>(null)
  const [toastId, setToastId] = useState<string | null>(null)

  const pendentes = wfList.length
  const urgentes = wfList.filter(w => w.urgency === 'high').length
  const avgSteps = wfList.length ? (wfList.reduce((s, w) => s + w.step, 0) / wfList.length).toFixed(1) : '0'
  const totalValue = wfList.reduce((s, w) => s + w.amount, 0)

  const aprovar = (id: string) => {
    setWfList(prev => {
      const updated = prev.map(w => {
        if (w.id !== id) return w
        const nextStep = w.step + 1
        return { ...w, step: nextStep }
      })
      return updated.filter(w => w.step <= w.totalSteps)
    })
    setToastId(id)
    setTimeout(() => setToastId(null), 1500)
    setSelected(null)
  }

  const rejeitar = (id: string) => {
    setWfList(prev => prev.filter(w => w.id !== id))
    setSelected(null)
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <div className="page-title">Workflows</div>
          <div className="page-subtitle">Aprovação de pagamentos e processos financeiros</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Pendentes" value={pendentes} icon="clock" />
        <KPI label="Urgentes" value={urgentes} icon="alert-triangle" />
        <KPI label="Passo médio" value={avgSteps + '/4'} icon="activity" />
        <KPI label="Valor pendente" value={fmtKzShort(totalValue)} icon="cash" />
      </div>

      {wfList.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Todos os workflows processados</div>
          <div style={{ opacity: 0.6 }}>Não existem workflows pendentes de aprovação.</div>
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Talento</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Urgência</th>
                <th>Submetido</th>
                <th>Passo</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {wfList.map(wf => (
                <tr key={wf.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(wf)}>
                  <td onClick={e => e.stopPropagation()}><span className="mono">{wf.id}</span></td>
                  <td onClick={e => e.stopPropagation()}>{wf.talent}</td>
                  <td onClick={e => e.stopPropagation()}>{wf.type}</td>
                  <td onClick={e => e.stopPropagation()} style={{ fontWeight: 600 }}>{fmtKz(wf.amount)}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <Pill tone={wf.urgency === 'high' ? 'danger' : 'neutral'} dot={false}>
                      {wf.urgency === 'high' ? 'Urgente' : wf.urgency === 'normal' ? 'Normal' : 'Baixa'}
                    </Pill>
                  </td>
                  <td onClick={e => e.stopPropagation()} style={{ fontSize: 12 }}>{wf.submitted}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <span className="mono">{wf.step}/{wf.totalSteps}</span>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>{STEPS[wf.step - 1]}</div>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => aprovar(wf.id)}
                      >
                        {toastId === wf.id ? '✓ Aprovado' : 'Aprovar'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => rejeitar(wf.id)}>Rejeitar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal title={`Workflow ${selected.id}`} onClose={() => setSelected(null)}>
          <div className="info-grid">
            <div className="info-item"><span className="form-label">Talento</span><span>{selected.talent}</span></div>
            <div className="info-item"><span className="form-label">Tipo</span><span>{selected.type}</span></div>
            <div className="info-item"><span className="form-label">Valor</span><span style={{ fontWeight: 600 }}>{fmtKz(selected.amount)}</span></div>
            <div className="info-item">
              <span className="form-label">Urgência</span>
              <Pill tone={selected.urgency === 'high' ? 'danger' : 'neutral'} dot={false}>
                {selected.urgency === 'high' ? 'Urgente' : selected.urgency === 'normal' ? 'Normal' : 'Baixa'}
              </Pill>
            </div>
            <div className="info-item"><span className="form-label">Submetido</span><span>{selected.submitted}</span></div>
            <div className="info-item"><span className="form-label">Passo actual</span><span>{selected.step}/{selected.totalSteps} — {STEPS[selected.step - 1]}</span></div>
          </div>

          {/* Step progress visualization */}
          <div style={{ marginTop: 24, marginBottom: 8 }}>
            <div className="form-label" style={{ marginBottom: 12 }}>Progresso do workflow</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {STEPS.map((step, i) => {
                const stepNum = i + 1
                const filled = stepNum <= selected.step
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: filled ? 'var(--primary)' : 'var(--surface-2, #e5e7eb)',
                        color: filled ? '#fff' : 'var(--text-2, #888)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13,
                        border: filled ? 'none' : '2px solid var(--border)',
                      }}>
                        {stepNum}
                      </div>
                      <div style={{ fontSize: 10, textAlign: 'center', maxWidth: 64, opacity: 0.7 }}>{step}</div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{
                        flex: 1, height: 2,
                        background: stepNum < selected.step ? 'var(--primary)' : 'var(--border)',
                        margin: '0 4px', marginBottom: 22,
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => aprovar(selected.id)}>Aprovar</button>
            <button className="btn btn-danger" onClick={() => rejeitar(selected.id)}>Rejeitar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
