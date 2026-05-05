'use client'

type BarTone = '' | 'success' | 'warn' | 'danger'

interface BarProps {
  value: number
  max?: number
  tone?: BarTone
}

export default function Bar({ value, max = 100, tone = '' }: BarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const fillClass = ['bar-fill', tone].filter(Boolean).join(' ')

  return (
    <div className="bar-track">
      <div className={fillClass} style={{ width: `${pct}%` }} />
    </div>
  )
}
