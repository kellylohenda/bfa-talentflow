import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { PublicLayout } from '@/components/public-layout';
import { candidatura } from '@/routes';

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export default function PortalIndex() {
    const [ref, setRef] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const inp: React.CSSProperties = {
        width: '100%', padding: '11px 13px',
        border: '1px solid #E7E5E1', borderRadius: 8,
        fontSize: 14, fontFamily: 'inherit', color: '#1A1A1A',
        outline: 'none', background: '#fff',
        transition: 'border-color 120ms, box-shadow 120ms',
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({ ref: ref.trim().toUpperCase(), email: email.trim() }),
            });
            const json = await res.json();
            if (!res.ok) {
                setError(json.message ?? 'Referência ou email inválidos.');
                return;
            }
            router.visit(`/portal/${json.ref}`);
        } catch {
            setError('Erro de ligação. Tenta de novo.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <PublicLayout>
            <Head title="Portal do Candidato — BFA Talento" />
            <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
                <div style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 16, padding: '48px 44px', width: '100%', maxWidth: 420 }}>
                    <div style={{ width: 52, height: 52, background: '#FFF0E5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF7607" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Portal do Candidato</h1>
                    <p style={{ fontSize: 14, color: '#525252', marginBottom: 32, lineHeight: 1.5 }}>
                        Acompanha o estado da tua candidatura BFA Talento.<br />
                        Usa a referência recebida por email e o teu email.
                    </p>

                    {error && (
                        <div style={{ background: '#FCEAEA', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 500, color: '#525252' }}>Referência da candidatura</label>
                            <input
                                style={inp}
                                type="text"
                                placeholder="BFA-2026-0001"
                                value={ref}
                                onChange={(e) => setRef(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 500, color: '#525252' }}>Email</label>
                            <input
                                style={inp}
                                type="email"
                                placeholder="o.teu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            style={{
                                width: '100%', background: loading || !ref || !email ? '#E7E5E1' : '#1A1A1A',
                                color: loading || !ref || !email ? '#8A8A87' : '#fff',
                                border: 'none', padding: 13, borderRadius: 8,
                                fontSize: 14, fontWeight: 600, cursor: loading || !ref || !email ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit', marginTop: 8, transition: 'background 120ms',
                            }}
                            disabled={loading || !ref || !email}
                        >
                            {loading ? 'A verificar…' : 'Entrar no portal →'}
                        </button>
                    </form>

                    <p style={{ fontSize: 12, color: '#8A8A87', textAlign: 'center', marginTop: 20 }}>
                        Ainda não te candidataste?{' '}
                        <a href={candidatura()} style={{ color: '#FF7607', textDecoration: 'none', fontWeight: 500 }}>Candidata-te agora</a>
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
