import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Role } from '@/types'

const defaultPage: Record<Role, string> = {
  rh:       '/overview',
  direcao:  '/overview',
  mentor:   '/mentor',
  bolseiro: '/bolseiro',
}

export default function Home() {
  const role = (cookies().get('role')?.value ?? 'rh') as Role
  redirect(defaultPage[role] ?? '/overview')
}
