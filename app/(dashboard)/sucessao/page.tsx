'use client'

import { useState } from 'react'
import { nineBox, talents } from '@/lib/data'
import Avatar from '@/components/ui/Avatar'
import KPI from '@/components/ui/KPI'
import Pill from '@/components/ui/Pill'
import Bar from '@/components/ui/Bar'
import Modal from '@/components/ui/Modal'
import type { NineBoxItem } from '@/types'

const CELL_LABELS: Record<string, string> = {
  '3,3': 'Estrela',
  '2,3': 'Alto Potencial',
  '1,3': 'Enigma',
  '3,2': 'Pilar',
  '2,2': 'Core',
  '1,2': 'Inconsistente',
  '3,1': 'Especialista',
  '2,1': 'A Desenvolver',
  '1,1': 'Em Risco',
}

const CELL_TONE: Record<string, string> = {
  '3,3': '#0E7C4A',
  '2,3': '#1D4ED8',
  '1,3': '#7C3AED',
  '3,2': '#0E7C4A',
  '2,2': '#FF7607',
  '1,2': '#B45309',
  '3,1': '#0891B2',
  '2,1': '#B45309',
  '1,1': '#DC2626',
}

const NEXT_ROLES: Record<string, string> = {
  'T-1048': 'Gestor de Carteira Sénior',
  'T-1051': 'Director de Banca Internacional',
  'T-1058': 'Director Comercial',
  'T-1042': 'Analista Sénior',
  'T-1046': 'Responsável Contabilidade',
  'T-1054': 'Gestor Risco Sénior',
  'T-1043': 'Analista Finanças Sénior',
  'T-1045': 'Tech Lead',
}

export default function PageSucessao() {
  const [selected, setSelected] = useState<NineBoxItem | null>(null)

  const stars = nineBox.filter(n => n.x === 3 && n.y === 3).length
  const highPerf = nineBox.filter(n => n.x >= 2).length
  const atRisk = nineBox.filter(n => n.x === 1 && n.y === 1).length
  const total = nineBox.length

  const getCellItems = (x: number, y: number) => nineBox.filter(n => n.x === x && n.y === y)

  const selectedTalent = selected ? talents.find(t => t.id === selected.id) : null

  const successionRows = nineBox
    .filter(n => NEXT_ROLES[n.id])
    .map(n => {
      const t = talents.find(tt => tt.id === n.id)
      return { ...n, talent: t }
    })

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <div className="page-title">Planeamento de Sucessão</div>
          <div className="page-subtitle">Matriz 9-Box de desempenho e potencial</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Estrelas (3×3)" value={stars} icon="star" />
        <KPI label="Alto desempenho" value={highPerf} icon="check-circle" />
        <KPI label="Em risco" value={atRisk} icon="alert-triangle" />
        <KPI label="Total mapeados" value={total} icon="briefcase" />
      </div>

      {/* 9-Box Grid */}
      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="card-title">Matriz 9-Box</div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>Eixo X: Desempenho · Eixo Y: Potencial</div>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Y-axis label */}
          <div style={{ position: 'absolute', left: -32, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: 11, opacity: 0.5, whiteSpace: 'nowrap' }}>
            Potencial →
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginLeft: 8 }}>
            {/* Row y=3 (top), columns x=1,2,3 */}
            {[3, 2, 1].map(y =>
              [1, 2, 3].map(x => {
                const key = `${x},${y}`
                const label = CELL_LABELS[key]
                const color = CELL_TONE[key]
                const items = getCellItems(x, y)
                return (
                  <div
                    key={key}
                    style={{
                      background: color + '18',
                      border: `1px solid ${color}40`,
                      borderRadius: 8,
                      padding: 12,
                      minHeight: 100,
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 8 }}>{label}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setSelected(item)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            textAlign: 'left', padding: '2px 0', fontSize: 12,
                            color: 'var(--text)', textDecoration: 'underline', textDecorationStyle: 'dotted',
                          }}
                        >
                          {item.name.split(' ').slice(0, 2).join(' ')}
                        </button>
                      ))}
                      {items.length === 0 && (
                        <span style={{ fontSize: 11, opacity: 0.3 }}>—</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* X-axis label */}
          <div style={{ textAlign: 'center', fontSize: 11, opacity: 0.5, marginTop: 8 }}>
            ← Desempenho →
          </div>
        </div>
      </div>

      {/* Succession table */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Pipeline de sucessão</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Talento</th>
              <th>Posição actual</th>
              <th>Desempenho</th>
              <th>Potencial</th>
              <th>Box</th>
              <th>Próximo papel</th>
            </tr>
          </thead>
          <tbody>
            {successionRows.map(({ id, name, x, y, talent }) => {
              const cellLabel = CELL_LABELS[`${x},${y}`]
              const cellColor = CELL_TONE[`${x},${y}`]
              return (
                <tr key={id}>
                  <td>
                    <div className="cell-person">
                      <Avatar name={name} size={28} />
                      <div>
                        <div style={{ fontWeight: 500 }}>{name}</div>
                        <div style={{ fontSize: 12, opacity: 0.6 }}>{talent?.program?.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{talent?.dept !== '—' ? talent?.dept : talent?.course}</td>
                  <td style={{ minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Bar value={talent?.perf ?? 0} max={100} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{talent?.perf}</span>
                    </div>
                  </td>
                  <td>
                    <Pill
                      tone={talent?.potential === 'alto' ? 'success' : talent?.potential === 'médio' ? 'warn' : 'neutral'}
                      dot={false}
                    >
                      {talent?.potential ?? '—'}
                    </Pill>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cellColor }}>{cellLabel}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{NEXT_ROLES[id]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          {selectedTalent && (
            <>
              <div className="info-grid">
                <div className="info-item"><span className="form-label">Programa</span><span>{selectedTalent.program.toUpperCase()}</span></div>
                <div className="info-item"><span className="form-label">Curso</span><span>{selectedTalent.course}</span></div>
                <div className="info-item"><span className="form-label">Mentor</span><span>{selectedTalent.mentor}</span></div>
                <div className="info-item"><span className="form-label">GPA</span><span>{selectedTalent.gpa}</span></div>
                <div className="info-item">
                  <span className="form-label">Potencial</span>
                  <Pill tone={selectedTalent.potential === 'alto' ? 'success' : selectedTalent.potential === 'médio' ? 'warn' : 'neutral'} dot={false}>
                    {selectedTalent.potential}
                  </Pill>
                </div>
                <div className="info-item">
                  <span className="form-label">Box</span>
                  <span style={{ fontWeight: 700, color: CELL_TONE[`${selected.x},${selected.y}`] }}>
                    {CELL_LABELS[`${selected.x},${selected.y}`]}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="form-label" style={{ marginBottom: 8 }}>Performance</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1 }}><Bar value={selectedTalent.perf} max={100} /></div>
                  <span style={{ fontWeight: 700 }}>{selectedTalent.perf}/100</span>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="form-label" style={{ marginBottom: 8 }}>Risco de saída</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1 }}><Bar value={Math.round(selectedTalent.riskScore * 100)} max={100} tone={selectedTalent.riskScore >= 0.5 ? 'danger' : 'warn'} /></div>
                  <span style={{ fontWeight: 700 }}>{Math.round(selectedTalent.riskScore * 100)}%</span>
                </div>
              </div>
              {NEXT_ROLES[selected.id] && (
                <div style={{ marginTop: 16, padding: 12, background: 'var(--surface)', borderRadius: 8 }}>
                  <div className="form-label" style={{ marginBottom: 4 }}>Próximo papel recomendado</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{NEXT_ROLES[selected.id]}</div>
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </div>
  )
}
