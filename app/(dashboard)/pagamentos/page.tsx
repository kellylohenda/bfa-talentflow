'use client'

import { useState } from 'react'
import { payments, talents } from '@/lib/data'
import type { Payment, PaymentStatus } from '@/types'
import { fmtKz, fmtKzShort } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import Pill from '@/components/ui/Pill'
import KPI from '@/components/ui/KPI'
import Icon from '@/components/ui/Icon'

type ToneType = 'success' | 'warn' | 'danger' | 'info' | 'neutral' | 'primary'

function payTone(status: PaymentStatus): ToneType {
  const map: Record<PaymentStatus, ToneType> = {
    paid:    'success',
    pending: 'warn',
    failed:  'danger',
    hold:    'neutral',
  }
  return map[status]
}

function payLabel(status: PaymentStatus): string {
  const map: Record<PaymentStatus, string> = {
    paid:    'Pago',
    pending: 'Pendente',
    failed:  'Falhado',
    hold:    'Suspenso',
  }
  return map[status]
}

export default function PagamentosPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [localStatuses, setLocalStatuses] = useState<Record<string, PaymentStatus>>({})

  const getStatus = (p: Payment): PaymentStatus =>
    localStatuses[p.id] ?? p.status

  const totalPaid = payments
    .filter(p => getStatus(p) === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingCount = payments.filter(p => getStatus(p) === 'pending').length
  const failedCount = payments.filter(p => getStatus(p) === 'failed').length
  const swiftCount = payments.filter(
    p => p.method === 'SWIFT' && ['pending', 'hold'].includes(getStatus(p))
  ).length

  const uniqueTypes = Array.from(new Set(payments.map(p => p.type)))

  const filtered = payments.filter(p => {
    const status = getStatus(p)
    const matchStatus = !statusFilter || status === statusFilter
    const matchType = !typeFilter || p.type === typeFilter
    const q = search.toLowerCase()
    const matchSearch = !q || p.talentName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    return matchStatus && matchType && matchSearch
  })

  const approve = (id: string) => {
    setLocalStatuses(prev => ({ ...prev, [id]: 'paid' }))
  }

  const reprocess = (id: string) => {
    setLocalStatuses(prev => ({ ...prev, [id]: 'pending' }))
  }

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Pagamentos</h1>
          <p className="page-subtitle">Gestão de subsídios e propinas</p>
        </div>
        <button className="btn btn-primary">
          <Icon name="plus" size={15} />
          Novo pagamento
        </button>
      </div>

      {/* KPIs */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI
          label="Total pago este mês"
          value={fmtKzShort(totalPaid)}
          icon="cash"
          delta="Confirmado"
          deltaTone="up"
        />
        <KPI
          label="Pendentes"
          value={pendingCount}
          delta="Aguardam aprovação"
          deltaTone="flat"
          icon="clock"
        />
        <KPI
          label="Falhados"
          value={failedCount}
          delta="Requer atenção"
          deltaTone="down"
          icon="alert"
        />
        <KPI
          label="SWIFT em processamento"
          value={swiftCount}
          icon="globe"
          delta="Internacionais"
          deltaTone="flat"
        />
      </div>

      {/* Filter bar */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
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
            placeholder="Pesquisar talento ou ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os estados</option>
          <option value="paid">Pago</option>
          <option value="pending">Pendente</option>
          <option value="failed">Falhado</option>
          <option value="hold">Suspenso</option>
        </select>

        <select
          className="select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {uniqueTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {(search || statusFilter || typeFilter) && (
          <button
            className="btn btn-sm"
            onClick={() => {
              setSearch('')
              setStatusFilter('')
              setTypeFilter('')
            }}
          >
            Limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Registos de pagamento</span>
          <span style={{ fontSize: 12, opacity: 0.55 }}>
            {filtered.length} de {payments.length} registos
          </span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Talento</th>
              <th>Tipo</th>
              <th>Período</th>
              <th>Valor</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Pago em</th>
              <th>Acções</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const status = getStatus(p)
              const talentData = talents.find(t => t.id === p.talent)
              return (
                <tr key={p.id}>
                  <td style={{ fontSize: 12, opacity: 0.55 }}>{p.id}</td>
                  <td>
                    <div className="cell-person">
                      <Avatar name={p.talentName} size={28} />
                      <div className="meta">
                        <span className="name">{p.talentName}</span>
                        {talentData && (
                          <span className="sub">{talentData.program.toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{p.type}</td>
                  <td style={{ fontSize: 13 }}>{p.period}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{fmtKz(p.amount)}</td>
                  <td style={{ fontSize: 13 }}>{p.method}</td>
                  <td>
                    <Pill tone={payTone(status)}>{payLabel(status)}</Pill>
                  </td>
                  <td style={{ fontSize: 13 }}>{p.paidAt ?? '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {status === 'failed' && (
                        <button
                          className="btn btn-sm"
                          onClick={() => reprocess(p.id)}
                          title="Reprocessar"
                        >
                          Reprocessar
                        </button>
                      )}
                      {status === 'pending' && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => approve(p.id)}
                          title="Aprovar pagamento"
                        >
                          Aprovar
                        </button>
                      )}
                      {(status === 'paid' || status === 'hold') && (
                        <span style={{ fontSize: 12, opacity: 0.4 }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 32, opacity: 0.45 }}>
                  Nenhum pagamento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
