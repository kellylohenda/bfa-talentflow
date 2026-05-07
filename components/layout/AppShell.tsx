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
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedSb = localStorage.getItem('sb-collapsed')
    if (savedSb === 'true') setCollapsed(true)

    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleDesktop = () => {
    setCollapsed(c => {
      const next = !c
      localStorage.setItem('sb-collapsed', String(next))
      return next
    })
  }

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      document.documentElement.setAttribute('data-theme', next)
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
        <Topbar
          role={role}
          onToggleDesktop={toggleDesktop}
          onToggleMobile={toggleMobile}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="page">
          {children}
        </div>
      </div>
    </div>
  )
}
