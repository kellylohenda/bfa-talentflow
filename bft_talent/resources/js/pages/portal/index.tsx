import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { PublicLayout } from '@/components/public-layout';
import { candidatura } from '@/routes';

const REF_RE = /^BFA-\d{4}-\d{4}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PortalIndex() {
    const [ref, setRef] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<{ ref?: string; email?: string }>({});
    const [touched, setTouched] = useState<{ ref?: boolean; email?: boolean }>({});

    const inp: React.CSSProperties = {
        width: '100%', padding: '11px 13px',
        border: '1px solid var(--border)', borderRadius: 8,
        fontSize: 14, fontFamily: 'inherit', color: 'var(--text)',
        outline: 'none', background: 'var(--surface)',
        transition: 'border-color 120ms, box-shadow 120ms',
    };

    const validRef = ref.trim().length > 0 && REF_RE.test(ref.trim());
    const validEmail = email.trim().length > 0 && EMAIL_RE.test(email.trim());
    const canSubmit = validRef && validEmail && !loading;

    function validateRef(v: string): string {
        if (!v.trim()) return 'Referência é obrigatória.';
        if (!REF_RE.test(v.trim())) return 'Formato inválido (ex: BFA-2026-0001).';
        return '';
    }

    function validateEmail(v: string): string {
        if (!v.trim()) return 'Email é obrigatório.';
        if (!EMAIL_RE.test(v.trim())) return 'Email inválido.';
        return '';
    }

    function handleRefChange(v: string) {
        setRef(v);
        setErrors((prev) => ({ ...prev, ref: validateRef(v) }));
    }

    function handleEmailChange(v: string) {
        setEmail(v);
        setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
    }

    function handleBlur(field: 'ref' | 'email') {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const refErr = validateRef(ref);
        const emailErr = validateEmail(email);
        setErrors({ ref: refErr, email: emailErr });
        setTouched({ ref: true, email: true });
        if (refErr || emailErr) return;
        setError('');
        setLoading(true);
        router.post('/portal', { ref: ref.trim().toUpperCase(), email: email.trim() }, {
            preserveState: true,
            onSuccess: (page) => {
                router.visit(`/portal/${page.props.flash?.ref || ref.trim().toUpperCase()}`);
            },
            onError: (errors) => {
                setError(errors.message || errors.ref?.[0] || errors.email?.[0] || 'Referência ou email inválidos.');
            },
            onFinish: () => setLoading(false),
        });
    }

    return (
        <PublicLayout>
            <Head title="Portal do Candidato — BFA Talento" />
            <div style={{ padding: 'clamp(64px, 10vw, 120px) clamp(12px, 4vw, 20px) 80px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(28px, 5vw, 48px)', width: '100%', maxWidth: 500, boxShadow: 'var(--shadow-2)' }}>
                    <div style={{ width: 64, height: 64, background: 'var(--primary-soft)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)' }}>Portal do Candidato</h1>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 32, lineHeight: 1.6 }}>
                        Acompanha o estado da tua candidatura BFA Talento a qualquer momento.
                    </p>

                    {error && (
                        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>Referência da candidatura</label>
                            <input
                                style={{ ...inp, borderColor: touched.ref && errors.ref ? 'var(--danger)' : 'var(--border)' }}
                                type="text"
                                placeholder="BFA-2026-0001"
                                value={ref}
                                onChange={(e) => handleRefChange(e.target.value.toUpperCase())}
                                onBlur={() => handleBlur('ref')}
                                required
                            />
                            {touched.ref && errors.ref && <div style={{ fontSize: 12, color: 'var(--danger)', lineHeight: 1.4 }}>{errors.ref}</div>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>Email</label>
                            <input
                                style={{ ...inp, borderColor: touched.email && errors.email ? 'var(--danger)' : 'var(--border)' }}
                                type="email"
                                placeholder="o.teu@email.com"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                onBlur={() => handleBlur('email')}
                                required
                            />
                            {touched.email && errors.email && <div style={{ fontSize: 12, color: 'var(--danger)', lineHeight: 1.4 }}>{errors.email}</div>}
                        </div>
                        <button
                            style={{
                                width: '100%', background: canSubmit ? 'var(--text)' : 'var(--disabled)',
                                color: canSubmit ? 'var(--bg)' : 'var(--text-3)',
                                border: 'none', padding: 14, borderRadius: 10,
                                fontSize: 15, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed',
                                fontFamily: 'inherit', transition: 'background 120ms',
                            }}
                            disabled={!canSubmit}
                            onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.background = 'var(--primary)'; }}
                            onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.background = 'var(--text)'; }}
                        >
                            {loading ? 'A verificar…' : 'Entrar no portal →'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-3)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Dados encriptados · Lei 22/11 (APD)
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', marginTop: 20 }}>
                        Ainda não te candidataste?{' '}
                        <a href={candidatura().url} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Candidata-te agora</a>
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
