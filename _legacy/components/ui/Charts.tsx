'use client'

// ---- Spark ----
interface SparkProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function Spark({ data, width = 64, height = 22, color = 'var(--primary)' }: SparkProps) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 2) - 1}`)
    .join(' ')

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ---- Donut ----
interface DonutSegment {
  value: number
  color: string
}

interface DonutProps {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  label?: string
  sub?: string
}

export function Donut({ segments, size = 120, thickness = 14, label, sub }: DonutProps) {
  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1

  let offset = 0
  const arcs = segments.map((seg, i) => {
    const pct = seg.value / total
    const dash = pct * circ
    const gap = circ - dash
    const rotation = offset * 360
    offset += pct
    return (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth={thickness}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={0}
        transform={`rotate(${rotation - 90} ${cx} ${cy})`}
        strokeLinecap="butt"
      />
    )
  })

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      {arcs}
      {label && (
        <text
          x={cx}
          y={cy + (sub ? -6 : 5)}
          textAnchor="middle"
          fontSize={size * 0.18}
          fontWeight={700}
          fill="currentColor"
        >
          {label}
        </text>
      )}
      {sub && (
        <text
          x={cx}
          y={cy + size * 0.12}
          textAnchor="middle"
          fontSize={size * 0.11}
          fill="currentColor"
          opacity={0.6}
        >
          {sub}
        </text>
      )}
    </svg>
  )
}

// ---- HBar ----
interface HBarItem {
  label: string
  value: number
  color?: string
}

interface HBarProps {
  data: HBarItem[]
  max?: number
  format?: (v: number) => string
  height?: number
  color?: string
}

export function HBar({
  data,
  max,
  format,
  height = 22,
  color = 'var(--primary)',
}: HBarProps) {
  const maxVal = max ?? Math.max(...data.map((d) => d.value), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {data.map((item, i) => {
        const pct = Math.min(100, (item.value / maxVal) * 100)
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 90, fontSize: 12, opacity: 0.7, flexShrink: 0, textAlign: 'right' }}>
              {item.label}
            </span>
            <div
              style={{
                flex: 1,
                height,
                background: 'var(--surface-2, #f0f0f0)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: item.color ?? color,
                  borderRadius: 4,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <span style={{ width: 48, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {format ? format(item.value) : item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ---- VBars ----
interface VBarsItem {
  label: string
  value: number
  color?: string
}

interface VBarsProps {
  data: VBarsItem[]
  height?: number
  color?: string
  format?: (v: number) => string
}

export function VBars({ data, height = 100, color = 'var(--primary)', format }: VBarsProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        height: height + 32,
        paddingBottom: 24,
        position: 'relative',
      }}
    >
      {data.map((item, i) => {
        const pct = Math.min(100, (item.value / maxVal) * 100)
        const barH = (pct / 100) * height
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: height + 24,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 600, marginBottom: 2 }}>
              {format ? format(item.value) : item.value}
            </span>
            <div
              style={{
                width: '100%',
                height: barH,
                background: item.color ?? color,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.3s',
              }}
            />
            <span
              style={{
                fontSize: 10,
                opacity: 0.6,
                marginTop: 4,
                textAlign: 'center',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
