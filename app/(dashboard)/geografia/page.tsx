'use client'

import { geo } from '@/lib/data'
import { fmtKzShort } from '@/lib/utils'
import KPI from '@/components/ui/KPI'
import { HBar, Donut } from '@/components/ui/Charts'

const total = geo.reduce((s, g) => s + g.count, 0)
const countries = Array.from(new Set(geo.map(g => g.country)))
const cities = geo.length

const abroad = geo.filter(g => g.country !== 'Angola').reduce((s, g) => s + g.count, 0)
const local = geo.filter(g => g.country === 'Angola').reduce((s, g) => s + g.count, 0)

// Group by country
const byCountry = countries.map(c => {
  const points = geo.filter(g => g.country === c)
  return {
    country: c,
    count: points.reduce((s, g) => s + g.count, 0),
    cost: points.reduce((s, g) => s + g.cost, 0),
    cities: points,
  }
}).sort((a, b) => b.count - a.count)

const COUNTRY_COLORS: Record<string, string> = {
  'Angola': '#FF7607',
  'Portugal': '#1D4ED8',
  'França': '#7C3AED',
  'Reino Unido': '#0E7C4A',
  'Brasil': '#B45309',
}

export default function PageGeografia() {
  const totalCost = geo.reduce((s, g) => s + g.cost, 0)

  const donutSegments = byCountry.map(c => ({
    value: c.count,
    color: COUNTRY_COLORS[c.country] ?? '#888',
  }))

  const hbarData = geo
    .sort((a, b) => b.count - a.count)
    .map(g => ({
      label: g.city,
      value: g.count,
      color: COUNTRY_COLORS[g.country] ?? '#888',
    }))

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <div className="page-title">Geografia</div>
          <div className="page-subtitle">Distribuição geográfica de bolseiros e trainees</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <KPI label="Cidades" value={cities} icon="map" />
        <KPI label="Países" value={countries.length} icon="globe" />
        <KPI label="No estrangeiro" value={abroad} icon="briefcase" />
        <KPI label="Em Angola" value={local} icon="check-circle" />
      </div>

      <div className="grid cols-3" style={{ marginBottom: 24 }}>
        {/* Main table */}
        <div className="card" style={{ gridColumn: '1 / 3' }}>
          <div className="card-head"><div className="card-title">Distribuição por localização</div></div>
          <table className="tbl">
            <thead>
              <tr>
                <th>País</th>
                <th>Cidade</th>
                <th>Talentos</th>
                <th>Custo total</th>
                <th>% do total</th>
              </tr>
            </thead>
            <tbody>
              {geo.map(g => (
                <tr key={g.city}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: COUNTRY_COLORS[g.country] ?? '#888',
                        flexShrink: 0,
                      }} />
                      {g.country}
                    </div>
                  </td>
                  <td>{g.city}</td>
                  <td style={{ fontWeight: 600 }}>{g.count}</td>
                  <td>{fmtKzShort(g.cost)}</td>
                  <td>{Math.round((g.count / total) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Donut */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 16 }}>Por país</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <Donut segments={donutSegments} size={140} label={String(total)} sub="talentos" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {byCountry.map(c => (
              <div key={c.country} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COUNTRY_COLORS[c.country] ?? '#888' }} />
                  <span style={{ fontSize: 13 }}>{c.country}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{c.count}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: 12, background: 'var(--surface)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Angola vs. Internacional</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span style={{ color: '#FF7607' }}>Angola: {Math.round((local / total) * 100)}%</span>
              <span style={{ color: '#1D4ED8' }}>Intl: {Math.round((abroad / total) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* HBar chart */}
      <div className="card card-pad">
        <div className="card-title" style={{ marginBottom: 16 }}>Top cidades por número de talentos</div>
        <HBar data={hbarData} format={v => String(v)} />
      </div>
    </div>
  )
}
