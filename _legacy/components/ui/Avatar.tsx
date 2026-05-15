'use client'

import { initials, avatarColor } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: number
  color?: string
}

export default function Avatar({ name, size = 26, color }: AvatarProps) {
  const bg = color ?? avatarColor(name)
  const fontSize = Math.round(size * 0.38)

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize,
        background: bg,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials(name)}
    </div>
  )
}
