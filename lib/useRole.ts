'use client'
import { useState, useEffect } from 'react'
import type { Role } from '@/types'

export function useRole(): Role {
  const [role, setRole] = useState<Role>('rh')
  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)role=([^;]+)/)
    if (m && ['rh','direcao','mentor','bolseiro'].includes(m[1])) {
      setRole(m[1] as Role)
    }
  }, [])
  return role
}
