import { cookies } from 'next/headers'
import AppShell from '@/components/layout/AppShell'
import type { Role } from '@/types'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const role = (cookies().get('role')?.value ?? 'rh') as Role
  return (
    <AppShell role={role}>
      {children}
    </AppShell>
  )
}
