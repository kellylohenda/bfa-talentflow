'use client'

import { ReactNode } from 'react'

type Tone = 'success' | 'warn' | 'danger' | 'info' | 'neutral' | 'primary'

interface PillProps {
  tone?: Tone
  dot?: boolean
  children: ReactNode
}

export default function Pill({ tone = 'neutral', dot = true, children }: PillProps) {
  return (
    <span className={`pill pill-${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  )
}
