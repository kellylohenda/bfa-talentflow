import { cookies } from 'next/headers'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import type { Role } from '@/types'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const role = (cookies().get('role')?.value ?? 'rh') as Role
  return (
    <div className="app" data-density="compact" data-sidebar="expanded" id="app-shell">
      <Sidebar role={role} />
      <div className="main">
        <Topbar />
        <div className="page">
          {children}
        </div>
      </div>
    </div>
  )
}
