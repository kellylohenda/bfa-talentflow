'use client'
import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'

type DocStatus = 'submetido' | 'pendente' | 'rejeitado' | 'aprovado'
type DocType = 'Boletim' | 'Relatório' | 'Contrato' | 'Identificação' | 'Comprovativo'

interface DocItem {
  id: string; talentId: string; talentName: string; type: DocType; name: string
  period: string; status: DocStatus; submittedAt: string | null; size: string | null
}

const DOCS: DocItem[] = [
  { id: 'D-001', talentId: 'T-1042', talentName: 'Lwini Capemba',       type: 'Boletim',       name: 'Boletim Q1 2026',           period: 'Q1 2026', status: 'aprovado',  submittedAt: '2026-04-10', size: '842 KB' },
  { id: 'D-002', talentId: 'T-1042', talentName: 'Lwini Capemba',       type: 'Relatório',     name: 'Relatório Semestral S1',    period: 'S1 2026', status: 'aprovado',  submittedAt: '2026-04-28', size: '1.2 MB' },
  { id: 'D-003', talentId: 'T-1043', talentName: 'Joaquim Tchindemba',  type: 'Boletim',       name: 'Transcript 2º sem',         period: 'S2 2025', status: 'submetido', submittedAt: '2026-04-25', size: '628 KB' },
  { id: 'D-004', talentId: 'T-1044', talentName: 'Esperança Quimbamba', type: 'Relatório',     name: 'Relatório Q1 2026',         period: 'Q1 2026', status: 'pendente',  submittedAt: null,         size: null },
  { id: 'D-005', talentId: 'T-1045', talentName: 'Yuran Bumba',         type: 'Boletim',       name: 'Boletim Q1 2026',           period: 'Q1 2026', status: 'aprovado',  submittedAt: '2026-04-20', size: '756 KB' },
  { id: 'D-006', talentId: 'T-1046', talentName: 'Domingas Kassinda',   type: 'Boletim',       name: 'Boletim semestral Porto',   period: 'S1 2026', status: 'submetido', submittedAt: '2026-04-28', size: '1.8 MB' },
  { id: 'D-007', talentId: 'T-1047', talentName: 'Adélio Sebastião',    type: 'Relatório',     name: 'Relatório Q1 2026',         period: 'Q1 2026', status: 'pendente',  submittedAt: null,         size: null },
  { id: 'D-008', talentId: 'T-1048', talentName: 'Kiala Domingos',      type: 'Relatório',     name: 'Relatório estágio — Banca', period: 'Q1 2026', status: 'aprovado',  submittedAt: '2026-04-14', size: '2.1 MB' },
  { id: 'D-009', talentId: 'T-1049', talentName: 'Nzinga Matondo',      type: 'Comprovativo',  name: 'Comprovativo IBAN',         period: '2026',    status: 'rejeitado', submittedAt: '2026-04-20', size: '128 KB' },
  { id: 'D-010', talentId: 'T-1050', talentName: 'Fernando Ngoma',      type: 'Identificação', name: 'NIF + BI Digitalizado',     period: '2026',    status: 'pendente',  submittedAt: null,         size: null },
  { id: 'D-011', talentId: 'T-1051', talentName: 'Carla Bunga',         type: 'Boletim',       name: 'Transcript HEC 1º ano',     period: 'S1 2026', status: 'aprovado',  submittedAt: '2026-04-25', size: '980 KB' },
  { id: 'D-012', talentId: 'T-1054', talentName: 'Heitor Quitumba',     type: 'Comprovativo',  name: 'Factura propina LSE',       period: 'T2 2026', status: 'submetido', submittedAt: '2026-04-28', size: '340 KB' },
]

function statusTone(s: DocStatus): 'success' | 'warn' | 'danger' | 'info' {
  return s === 'aprovado' ? 'success' : s === 'submetido' ? 'info' : s === 'pendente' ? 'warn' : 'danger'
}
function statusLabel(s: DocStatus) {
  return s === 'aprovado' ? 'Aprovado' : s === 'submetido' ? 'Submetido' : s === 'pendente' ? 'Pendente' : 'Rejeitado'
}

export default function DocumentosPage() {
  const [docs, setDocs] = useState<DocItem[]>(DOCS)
  const [filter, setFilter] = useState<DocStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const pending = docs.filter(d => d.status === 'pendente').length
  const submitted = docs.filter(d => d.status === 'submetido').length
  const approved = docs.filter(d => d.status === 'aprovado').length
  const rejected = docs.filter(d => d.status === 'rejeitado').length

  const visible = docs.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false
    if (search && !d.talentName.toLowerCase().includes(search.toLowerCase()) && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const approve = (id: string) => setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'aprovado' as DocStatus } : d))
  const reject  = (id: string) => setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'rejeitado' as DocStatus } : d))

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Documentos</h1>
          <p className="page-subtitle">Gestão de documentos e submissões académicas</p>
        </div>
        <button className="btn btn-primary">Solicitar Documento</button>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Pendentes" value={pending} sub="Por submeter" delta={pending > 2 ? 'Atenção' : 'OK'} deltaTone={pending > 2 ? 'flat' : 'up'} icon="clock" />
        <KPI label="A Rever" value={submitted} sub="Aguardam validação" delta={submitted > 0 ? 'Rever' : 'OK'} deltaTone="flat" icon="doc" />
        <KPI label="Aprovados" value={approved} sub="Validados" delta="Completos" deltaTone="up" icon="check" />
        <KPI label="Rejeitados" value={rejected} sub="Requerem resubmissão" delta={rejected > 0 ? 'Acção' : 'OK'} deltaTone={rejected > 0 ? 'down' : 'up'} icon="alert" />
      </div>

      <div className="card">
        <div className="card-head">
          <span className="card-title">Todos os Documentos</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 180 }} />
            {(['all','pendente','submetido','aprovado','rejeitado'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : ''}`}>
                {f === 'all' ? 'Todos' : statusLabel(f as DocStatus)}
              </button>
            ))}
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Documento</th><th>Bolseiro</th><th>Tipo</th><th>Período</th><th>Submissão</th><th>Tamanho</th><th>Estado</th><th>Acções</th></tr>
          </thead>
          <tbody>
            {visible.map(d => (
              <tr key={d.id}>
                <td>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{d.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{d.id}</div>
                </td>
                <td>
                  <div className="cell-person">
                    <Avatar name={d.talentName} size={24} />
                    <span style={{ fontSize: 13 }}>{d.talentName}</span>
                  </div>
                </td>
                <td><Pill tone="neutral" dot={false}>{d.type}</Pill></td>
                <td style={{ fontSize: 12 }}>{d.period}</td>
                <td style={{ fontSize: 12, opacity: 0.65 }}>{d.submittedAt ?? <span style={{ opacity: 0.4 }}>Aguarda</span>}</td>
                <td style={{ fontSize: 12 }}>{d.size ?? '—'}</td>
                <td><Pill tone={statusTone(d.status)}>{statusLabel(d.status)}</Pill></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {d.status === 'submetido' && (
                      <>
                        <button className="btn btn-sm btn-primary" onClick={() => approve(d.id)}>Aprovar</button>
                        <button className="btn btn-sm" onClick={() => reject(d.id)}>Rejeitar</button>
                      </>
                    )}
                    {d.status === 'aprovado' && (
                      <button className="btn btn-sm">Download</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, opacity: 0.45 }}>Nenhum documento encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
