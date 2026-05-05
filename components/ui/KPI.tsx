'use client'

import Icon from './Icon'

type DeltaTone = 'up' | 'down' | 'flat'

interface KPIProps {
  label: string
  value: string | number
  sub?: string
  delta?: string
  deltaTone?: DeltaTone
  icon?: string
  spark?: number[]
}

export default function KPI({
  label,
  value,
  sub,
  delta,
  deltaTone = 'up',
  icon,
}: KPIProps) {
  return (
    <div className="kpi">
      <div className="kpi-label">
        {icon && (
          <span style={{ marginRight: 6, opacity: 0.6 }}>
            <Icon name={icon} size={14} />
          </span>
        )}
        {label}
      </div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {delta && (
        <div className={`kpi-delta kpi-delta-${deltaTone}`}>{delta}</div>
      )}
    </div>
  )
}
