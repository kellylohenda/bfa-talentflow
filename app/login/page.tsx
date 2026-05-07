'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Role } from '@/types'

const ROLES: { id: Role; label: string; desc: string; color: string; initials: string; group?: string }[] = [
  { id: 'rh',         label: 'Gestora de RH',       desc: 'Candidaturas, talentos, pagamentos, compliance e workflows', color: '#FF7607', initials: 'MQ', group: 'Equipa BFA' },
  { id: 'direcao',    label: 'Direcção de RH',       desc: 'Dashboard executivo, KPIs estratégicos, 9-Box e ROI',       color: '#2563EB', initials: 'MB', group: 'Equipa BFA' },
  { id: 'mentor',     label: 'Portal do Mentor',     desc: 'Gerir mentorandos, sessões, tarefas e avaliações',          color: '#7C3AED', initials: 'EC', group: 'Equipa BFA' },
  { id: 'estagiario', label: 'Portal do Estagiário', desc: 'Presenças, rotações, tarefas e desenvolvimento — Futuro BFA', color: '#FF7607', initials: 'LC', group: 'Participantes' },
  { id: 'bolseiro',   label: 'Portal do Bolseiro',   desc: 'Subsídios, sessões académicas, tarefas e mentoria',         color: '#0E7C4A', initials: 'JT', group: 'Participantes' },
  { id: 'voluntario', label: 'Portal do Voluntário', desc: 'As minhas actividades, horas validadas e agenda',           color: '#0891B2', initials: 'AK', group: 'Participantes' },
]

const DEST: Record<Role, string> = {
  rh: '/overview', direcao: '/overview', mentor: '/mentor',
  estagiario: '/bolseiro', bolseiro: '/bolseiro', voluntario: '/voluntario',
}

export default function LoginPage() {
  const [selected, setSelected] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const enter = () => {
    if (!selected || loading) return
    setLoading(true)
    document.cookie = `role=${selected}; path=/; max-age=86400`
    router.push(DEST[selected])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0C0C0B',
      display: 'flex',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1,
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
        background: 'linear-gradient(160deg, #1A1A19 0%, #0C0C0B 100%)',
        borderRight: '1px solid #222221',
      }} className="login-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #FF7607, #9C4500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#fff',
          }}>B</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#F0EFEC', letterSpacing: '-0.01em' }}>BFA TalentFlow</div>
            <div style={{ fontSize: 11, color: '#5A5853' }}>Gestão de Talento · 2026</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#F0EFEC', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Plataforma de<br />Gestão de Talento<br />do BFA
          </div>
          <p style={{ fontSize: 14, color: '#807E78', lineHeight: 1.7, maxWidth: 340 }}>
            Recrutamento, desenvolvimento, mentoria e análise de talento numa única plataforma integrada.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
          {[['23', 'Bolseiros activos'], ['4', 'Perfis de acesso'], ['360°', 'Avaliações']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#FF7607', letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ fontSize: 11, color: '#5A5853', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 40px',
        margin: '0 auto',
      }}>
        {/* Mobile logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }} className="login-mobile-logo">
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, #FF7607, #9C4500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#fff',
          }}>B</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F0EFEC' }}>BFA TalentFlow</div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F0EFEC', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Bem-vindo de volta
          </h1>
          <p style={{ fontSize: 14, color: '#807E78', margin: 0 }}>
            Selecciona o teu perfil para aceder à plataforma
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {ROLES.map((r, i) => {
            const isSelected = selected === r.id
            const showGroup = i === 0 || r.group !== ROLES[i - 1].group
            return (
              <div key={r.id}>
                {showGroup && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#3A3A38', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, marginTop: i > 0 ? 12 : 0 }}>
                    {r.group}
                  </div>
                )}
              <button
                onClick={() => setSelected(r.id)}
                style={{
                  padding: '14px 16px',
                  border: `1.5px solid ${isSelected ? r.color : '#252523'}`,
                  borderRadius: 10,
                  background: isSelected ? `${r.color}14` : '#141413',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'border-color 120ms, background 120ms',
                  width: '100%',
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 9,
                  background: isSelected ? r.color : '#252523',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: isSelected ? '#fff' : '#5A5853',
                  flexShrink: 0,
                  transition: 'background 120ms, color 120ms',
                }}>
                  {r.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F0EFEC', marginBottom: 2 }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#5A5853', lineHeight: 1.4 }}>{r.desc}</div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: isSelected ? r.color : '#252523',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 120ms',
                }}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
              </div>
            )
          })}
        </div>

        <button
          onClick={enter}
          disabled={!selected || loading}
          style={{
            width: '100%', height: 44,
            borderRadius: 9, border: 'none',
            background: selected ? '#FF7607' : '#1E1E1D',
            color: selected ? '#fff' : '#3A3A38',
            fontSize: 14, fontWeight: 600,
            cursor: selected && !loading ? 'pointer' : 'not-allowed',
            transition: 'background 150ms, color 150ms',
            letterSpacing: '-0.01em',
          }}
        >
          {loading ? 'A entrar…' : 'Entrar no TalentFlow →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#3A3A38', marginTop: 24, lineHeight: 1.6 }}>
          Ambiente de demonstração · dados simulados<br />© BFA 2026 · Todos os direitos reservados
        </p>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-panel { display: flex !important; }
          .login-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}
