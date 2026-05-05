'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Role } from '@/types'

const ROLES: { id: Role; label: string; desc: string; color: string }[] = [
  { id: 'rh',       label: 'RH',         desc: 'Gestão de programas, talentos, pagamentos e compliance', color: '#FF7607' },
  { id: 'direcao',  label: 'Direcção',   desc: 'Dashboard executivo, KPIs estratégicos e 9-Box',          color: '#1D4ED8' },
  { id: 'mentor',   label: 'Mentor',     desc: 'Gerir mentorandos, sessões, tarefas e avaliações',         color: '#7C3AED' },
  { id: 'bolseiro', label: 'Bolseiro',   desc: 'Portal do bolseiro — subsídios, tarefas e mentoria',       color: '#0E7C4A' },
]

export default function LoginPage() {
  const [selected, setSelected] = useState<Role | null>(null)
  const router = useRouter()

  const enter = () => {
    if (!selected) return
    document.cookie = `role=${selected}; path=/; max-age=86400`
    const dest = selected === 'bolseiro' ? '/bolseiro' : selected === 'mentor' ? '/mentor' : '/overview'
    router.push(dest)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0F0E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #FF7607, #9C4500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: '#fff',
            margin: '0 auto 16px',
          }}>B</div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#F0EFEC', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            BFA TalentFlow
          </h1>
          <p style={{ fontSize: 14, color: '#807E78', margin: 0 }}>
            Selecciona o teu perfil para continuar
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              style={{
                padding: '14px 18px',
                border: `2px solid ${selected === r.id ? r.color : '#2D2D2B'}`,
                borderRadius: 8,
                background: selected === r.id ? `${r.color}18` : '#1A1A19',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'all 120ms',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: selected === r.id ? r.color : '#2A2A28',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: selected === r.id ? '#fff' : '#807E78',
                flexShrink: 0, transition: 'all 120ms',
              }}>
                {r.label.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#F0EFEC', marginBottom: 2 }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 12, color: '#807E78', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
              {selected === r.id && (
                <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={enter}
          disabled={!selected}
          style={{
            width: '100%', height: 44,
            borderRadius: 8, border: 'none',
            background: selected ? '#FF7607' : '#2A2A28',
            color: selected ? '#fff' : '#5A5853',
            fontSize: 14, fontWeight: 600,
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'all 120ms',
          }}
        >
          Entrar no TalentFlow →
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#5A5853', marginTop: 20 }}>
          Ambiente de demonstração · dados simulados · BFA 2026
        </p>
      </div>
    </div>
  )
}
