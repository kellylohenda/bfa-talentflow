'use client'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import type { Role } from '@/types'

interface AppShellProps {
  role: Role
  children: React.ReactNode
}

export default function AppShell({ role, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sb-collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  const toggleDesktop = () => {
    setCollapsed(c => {
      const next = !c
      localStorage.setItem('sb-collapsed', String(next))
      return next
    })
  }

  const toggleMobile = () => setMobileOpen(o => !o)
  const closeMobile = () => setMobileOpen(false)

  return (
    <div
      className="app"
      data-density="compact"
      data-sidebar={collapsed ? 'icon' : 'expanded'}
      data-mobile-open={mobileOpen ? 'true' : 'false'}
      id="app-shell"
    >
      {mobileOpen && (
        <div className="sb-overlay" onClick={closeMobile} />
      )}
      <Sidebar role={role} collapsed={collapsed} />
      <div className="main">
        <Topbar onToggleDesktop={toggleDesktop} onToggleMobile={toggleMobile} />
        <div className="page">
          {children}
        </div>
      </div>
    </div>
  )
}
