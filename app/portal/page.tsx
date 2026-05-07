'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PortalLoginPage() {
  const router = useRouter()
  const [ref, setRef] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: ref.trim().toUpperCase(), email: email.trim() }),
      })
      if (!res.ok) {
        setError('Referência ou email inválidos. Verifica os dados e tenta novamente.')
        return
      }
      const data = await res.json()
      router.push(`/portal/${data.ref}`)
    } catch {
      setError('Erro de ligação. Tenta de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAFAF9; color: #1A1A1A; font-family: Inter, system-ui, sans-serif; }
        .pub-top { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #E7E5E1; }
        .pub-top-inner { max-width: 1240px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 32px; }
        .pub-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #1A1A1A; font-weight: 700; font-size: 17px; }
        .pub-logo { width: 32px; height: 32px; background: #1A1A1A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border-radius: 5px; }
        .wrap { min-height: calc(100vh - 65px); display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
        .card { background: #fff; border: 1px solid #E7E5E1; border-radius: 16px; padding: 48px 44px; width: 100%; max-width: 420px; }
        .card-icon { width: 52px; height: 52px; background: #FFF0E5; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; }
        .subtitle { font-size: 14px; color: #525252; margin-bottom: 32px; line-height: 1.5; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        label { font-size: 12px; font-weight: 500; color: #525252; }
        input { padding: 11px 13px; border: 1px solid #E7E5E1; border-radius: 8px; font-size: 14px; font-family: inherit; color: #1A1A1A; outline: none; transition: border-color 120ms, box-shadow 120ms; }
        input:focus { border-color: #FF7607; box-shadow: 0 0 0 3px #FFF0E5; }
        .btn { width: 100%; background: #1A1A1A; color: #fff; border: none; padding: 13px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 8px; transition: background 120ms; }
        .btn:hover:not(:disabled) { background: #FF7607; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error { background: #FEE2E2; color: #991B1B; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
        .hint { font-size: 12px; color: #8A8A87; text-align: center; margin-top: 20px; }
        .hint a { color: #FF7607; text-decoration: none; }
      `}</style>

      <div className="pub-top">
        <div className="pub-top-inner">
          <Link href="/programa" className="pub-brand">
            <div className="pub-logo">B</div>
            BFA Talento
          </Link>
          <div style={{ marginLeft: 'auto' }}>
            <Link href="/candidatura" style={{ fontSize: 13, color: '#525252', textDecoration: 'none' }}>
              Candidatar-me →
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="card">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF7607" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1>Portal do Candidato</h1>
          <p className="subtitle">
            Acompanha o estado da tua candidatura BFA Talento.<br />
            Usa a referência recebida por email e o teu email.
          </p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Referência da candidatura</label>
              <input
                type="text"
                placeholder="BFA-2026-XXXX"
                value={ref}
                onChange={e => setRef(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="o.teu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn" disabled={loading || !ref || !email}>
              {loading ? 'A verificar…' : 'Entrar no portal →'}
            </button>
          </form>

          <p className="hint">
            Ainda não te candidataste? <a href="/candidatura">Candidata-te agora</a>
          </p>
        </div>
      </div>
    </>
  )
}
