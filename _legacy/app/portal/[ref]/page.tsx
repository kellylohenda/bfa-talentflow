'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const PROGRAMS: Record<string, string> = {
  fbfa: 'Futuro BFA',
  bif:  'Bolsa Internacional',
  bnac: 'Bolsa Nacional',
  lid:  'Programa Liderança+',
  mest: 'Mestrado Patrocinado',
}

type CandidaturaData = {
  ref: string
  nome: string
  email: string
  program: string
  status: 'pendente' | 'aprovada' | 'recusada'
  submittedAt: string
  curso: string
  uni: string
  media: string
}

const STATUS_CONFIG = {
  pendente: {
    label: 'Em análise',
    desc: 'A tua candidatura está a ser avaliada pela nossa equipa. O prazo é de 14 dias úteis.',
    bg: '#FFFBEB', border: '#FDE68A', dot: '#D97706', textColor: '#92400E',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  aprovada: {
    label: 'Aprovada',
    desc: 'Parabéns! A tua candidatura foi aprovada. A equipa de RH entrará em contacto brevemente.',
    bg: '#ECFDF5', border: '#6EE7B7', dot: '#059669', textColor: '#065F46',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l3 3 5-5" />
      </svg>
    ),
  },
  recusada: {
    label: 'Não seleccionado',
    desc: 'Agradecemos a tua candidatura. Nesta edição não foi possível seleccionar-te, mas podes candidatar-te novamente.',
    bg: '#FFF7F7', border: '#FCA5A5', dot: '#DC2626', textColor: '#991B1B',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function PortalStatusPage() {
  const params = useParams()
  const router = useRouter()
  const ref = params.ref as string

  const [data, setData] = useState<CandidaturaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/portal/${ref}`)
      .then(r => {
        if (r.status === 401) { router.replace('/portal'); return null }
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(d => { if (d) setData(d) })
      .catch(() => setError('Não foi possível carregar a candidatura.'))
      .finally(() => setLoading(false))
  }, [ref, router])

  async function logout() {
    await fetch('/api/portal/logout', { method: 'POST' })
    router.push('/portal')
  }

  const cfg = data ? STATUS_CONFIG[data.status] : null

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAFAF9; color: #1A1A1A; font-family: Inter, system-ui, sans-serif; }
        .top { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #E7E5E1; }
        .top-inner { max-width: 1000px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 12px; }
        .pub-logo { width: 32px; height: 32px; background: #1A1A1A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border-radius: 5px; }
        .brand { font-weight: 700; font-size: 17px; text-decoration: none; color: #1A1A1A; display: flex; align-items: center; gap: 10px; }
        .logout-btn { margin-left: auto; background: none; border: 1px solid #E7E5E1; padding: 8px 14px; border-radius: 6px; font-size: 13px; color: #525252; cursor: pointer; font-family: inherit; }
        .logout-btn:hover { background: #F2F2F0; }
        .main { max-width: 700px; margin: 40px auto; padding: 0 20px 80px; }
        .status-card { border: 2px solid; border-radius: 14px; padding: 28px 32px; margin-bottom: 24px; display: flex; gap: 18px; align-items: flex-start; }
        .status-icon { flex-shrink: 0; width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .status-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
        .status-title { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 6px; }
        .status-desc { font-size: 14px; line-height: 1.6; }
        .card { background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; padding: 28px 32px; margin-bottom: 16px; }
        .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8A8A87; margin-bottom: 16px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F2F2F0; font-size: 14px; }
        .row:last-child { border: none; }
        .row span { color: #525252; }
        .row b { color: #1A1A1A; font-weight: 500; }
        .ref-badge { display: inline-block; background: #F2F2F0; padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 14px; margin-bottom: 20px; }
        .ref-badge b { color: #FF7607; }
        .cta-link { display: inline-flex; align-items: center; gap: 6px; background: #FF7607; color: #fff; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-top: 4px; }
        .loading { text-align: center; padding: 80px 20px; color: #8A8A87; font-size: 15px; }
        .error-msg { text-align: center; padding: 60px 20px; color: #991B1B; }
        @media (max-width: 600px) {
          .top-inner { padding: 16px 20px; }
          .status-card { flex-direction: column; padding: 22px; }
          .card { padding: 20px; }
        }
      `}</style>

      <div className="top">
        <div className="top-inner">
          <Link href="/programa" className="brand">
            <div className="pub-logo">B</div>
            BFA Talento
          </Link>
          <button className="logout-btn" onClick={logout}>Sair</button>
        </div>
      </div>

      <div className="main">
        {loading && <div className="loading">A carregar…</div>}
        {error && <div className="error-msg">{error}</div>}

        {data && cfg && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                Olá, {data.nome.split(' ')[0]}
              </h1>
              <p style={{ fontSize: 14, color: '#525252' }}>Portal de acompanhamento da candidatura BFA Talento</p>
            </div>

            <div className="ref-badge">
              Referência · <b>{data.ref}</b>
            </div>

            {/* Status card */}
            <div
              className="status-card"
              style={{ background: cfg.bg, borderColor: cfg.border }}
            >
              <div className="status-icon" style={{ background: `${cfg.border}66` }}>
                {cfg.icon}
              </div>
              <div>
                <div className="status-label" style={{ color: cfg.dot }}>{cfg.label}</div>
                <div className="status-title">{data.status === 'aprovada' ? 'Parabéns!' : data.status === 'pendente' ? 'Candidatura em avaliação' : 'Resultado final'}</div>
                <div className="status-desc" style={{ color: cfg.textColor }}>{cfg.desc}</div>
              </div>
            </div>

            {/* Details */}
            <div className="card">
              <div className="card-title">Detalhes da candidatura</div>
              <div className="row"><span>Programa</span><b>{PROGRAMS[data.program] ?? data.program}</b></div>
              <div className="row"><span>Curso</span><b>{data.curso}</b></div>
              <div className="row"><span>Universidade</span><b>{data.uni}</b></div>
              <div className="row"><span>Média</span><b>{data.media} / 20</b></div>
              <div className="row"><span>Data de submissão</span><b>{fmt(data.submittedAt)}</b></div>
            </div>

            {/* Timeline */}
            <div className="card">
              <div className="card-title">Calendário do processo</div>
              <div className="row"><span>Submissão</span><b>{fmt(data.submittedAt)}</b></div>
              <div className="row"><span>Análise inicial</span><b>Até 14 dias úteis</b></div>
              <div className="row"><span>Resultados finais</span><b>Julho 2026</b></div>
            </div>

            {data.status === 'recusada' && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <a href="/candidatura" className="cta-link">
                  Candidatar-me na próxima edição →
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
