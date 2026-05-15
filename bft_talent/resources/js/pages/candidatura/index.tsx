import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { PublicLayout } from '@/components/public-layout';

type Program = { id: number; code: string; name: string; descricao: string };

const STEPS = [
    { id: 1, title: 'Programa', desc: 'Escolha do percurso' },
    { id: 2, title: 'Identificação', desc: 'Dados pessoais' },
    { id: 3, title: 'Académico', desc: 'Formação' },
    { id: 4, title: 'Motivação', desc: 'Carta curta' },
    { id: 5, title: 'Revisão', desc: 'Confirmar e submeter' },
];

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

type FormData = {
    program_code: string;
    nome: string;
    email: string;
    tel: string;
    grau: string;
    uni: string;
    curso: string;
    motivacao: string;
    rgpd: boolean;
};

const INIT: FormData = {
    program_code: '',
    nome: '',
    email: '',
    tel: '',
    grau: '',
    uni: '',
    curso: '',
    motivacao: '',
    rgpd: false,
};

const inp: React.CSSProperties = {
    width: '100%',
    padding: '11px 13px',
    border: '1px solid #E7E5E1',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#1A1A1A',
    outline: 'none',
    background: '#fff',
    transition: 'border-color 120ms, box-shadow 120ms',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#525252' }}>{label}</label>
            {children}
        </div>
    );
}

export default function CandidaturaIndex({ programs }: { programs: Program[] }) {
    const [step, setStep] = useState(1);
    const [d, setD] = useState<FormData>(INIT);
    const [ref, setRef] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const preselected = urlParams.get('program') ?? '';

    const set = (k: keyof FormData, v: string | boolean) => setD((prev) => ({ ...prev, [k]: v }));

    const valid: Record<number, boolean> = {
        1: !!(d.program_code || preselected),
        2: !!(d.nome && d.email),
        3: !!(d.uni && d.curso),
        4: d.motivacao.length >= 50,
        5: d.rgpd,
    };

    const effectiveProgram = d.program_code || preselected;

    async function submit() {
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/candidatura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({ ...d, program_code: effectiveProgram }),
            });
            const json = await res.json();
            if (!res.ok) {
                const msgs = json.errors ? Object.values(json.errors as Record<string, string[]>).flat() : [json.message ?? 'Erro desconhecido.'];
                setError(msgs[0]);
                return;
            }
            setRef(json.ref);
            setStep(6);
        } catch {
            setError('Erro de ligação. Tenta de novo.');
        } finally {
            setSubmitting(false);
        }
    }

    const selectedProgram = programs.find((p) => p.code === effectiveProgram);

    const s: Record<string, React.CSSProperties> = {
        wrap: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 20px 80px' },
        card: { background: '#fff', border: '1px solid #E7E5E1', borderRadius: 16, padding: '40px', width: '100%', maxWidth: 560 },
        btn: { width: '100%', background: '#1A1A1A', color: '#fff', border: 'none', padding: 13, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 120ms' },
        btnSec: { width: '100%', background: 'transparent', color: '#525252', border: '1px solid #E7E5E1', padding: 13, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
        row: { display: 'flex', gap: 12 },
    };

    if (step === 6) {
        return (
            <PublicLayout>
                <Head title="Candidatura submetida — BFA Talento" />
                <div style={s.wrap}>
                    <div style={{ ...s.card, textAlign: 'center' }}>
                        <div style={{ width: 56, height: 56, background: '#E5F4EC', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12l3 3 5-5" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>Candidatura submetida!</h1>
                        <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.6, marginBottom: 24 }}>
                            Recebemos a tua candidatura com sucesso. Usa a referência abaixo para acompanhar o estado.
                        </p>
                        <div style={{ background: '#F2F2F0', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#8A8A87', marginBottom: 4 }}>REFERÊNCIA</div>
                            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em', color: '#1A1A1A', fontFamily: 'monospace' }}>{ref}</div>
                        </div>
                        <p style={{ fontSize: 13, color: '#8A8A87', marginBottom: 24 }}>Enviámos também um email de confirmação para <strong>{d.email}</strong>.</p>
                        <a href={`/portal/${ref}`} style={{ ...s.btn as React.AnchorHTMLAttributes<HTMLAnchorElement>['style'], display: 'block', textAlign: 'center', textDecoration: 'none', padding: '13px' }}>
                            Acompanhar candidatura →
                        </a>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Candidatura — BFA Talento" />
            <div style={s.wrap}>
                {/* Step indicator */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center' }}>
                    {STEPS.map((st, i) => (
                        <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%', fontSize: 12, fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: step === st.id ? '#FF7607' : step > st.id ? '#059669' : '#E7E5E1',
                                color: step >= st.id ? '#fff' : '#8A8A87',
                                flexShrink: 0,
                            }}>
                                {step > st.id ? '✓' : st.id}
                            </div>
                            <span style={{ fontSize: 12, color: step === st.id ? '#1A1A1A' : '#8A8A87', fontWeight: step === st.id ? 600 : 400, display: i < STEPS.length - 1 ? undefined : undefined }}>
                                {st.title}
                            </span>
                            {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: '#E7E5E1' }} />}
                        </div>
                    ))}
                </div>

                <div style={s.card}>
                    {error && (
                        <div style={{ background: '#FCEAEA', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>{error}</div>
                    )}

                    {/* Step 1: Program */}
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Escolhe o programa</h2>
                                <p style={{ fontSize: 13, color: '#525252' }}>Podes indicar uma 2.ª preferência na motivação.</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {programs.map((p) => {
                                    const active = (d.program_code || preselected) === p.code;
                                    return (
                                        <button key={p.code} onClick={() => set('program_code', p.code)} style={{
                                            width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 10,
                                            border: `2px solid ${active ? '#FF7607' : '#E7E5E1'}`,
                                            background: active ? '#FFF0E5' : '#fff',
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            transition: 'border-color 120ms, background 120ms',
                                        }}>
                                            <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{p.name}</div>
                                            <div style={{ fontSize: 12, color: '#525252', marginTop: 2 }}>{p.descricao}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            <button style={{ ...s.btn, background: valid[1] ? '#1A1A1A' : '#E7E5E1', color: valid[1] ? '#fff' : '#8A8A87', cursor: valid[1] ? 'pointer' : 'not-allowed' }} disabled={!valid[1]} onClick={() => setStep(2)}>
                                Continuar →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Personal */}
                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Dados pessoais</h2>
                            <Field label="Nome completo *">
                                <input style={inp} value={d.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Ana Ferreira da Silva" required />
                            </Field>
                            <Field label="Email *">
                                <input style={inp} type="email" value={d.email} onChange={(e) => set('email', e.target.value)} placeholder="ana.silva@email.com" required />
                            </Field>
                            <Field label="Telemóvel">
                                <input style={inp} value={d.tel} onChange={(e) => set('tel', e.target.value)} placeholder="+244 9XX XXX XXX" />
                            </Field>
                            <div style={s.row}>
                                <button style={s.btnSec} onClick={() => setStep(1)}>← Voltar</button>
                                <button style={{ ...s.btn, background: valid[2] ? '#1A1A1A' : '#E7E5E1', color: valid[2] ? '#fff' : '#8A8A87', cursor: valid[2] ? 'pointer' : 'not-allowed' }} disabled={!valid[2]} onClick={() => setStep(3)}>
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Academic */}
                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Formação académica</h2>
                            <Field label="Grau">
                                <select style={inp} value={d.grau} onChange={(e) => set('grau', e.target.value)}>
                                    <option value="">Seleccionar…</option>
                                    <option value="licenciatura">Licenciatura</option>
                                    <option value="mestrado">Mestrado</option>
                                    <option value="doutoramento">Doutoramento</option>
                                </select>
                            </Field>
                            <Field label="Universidade *">
                                <input style={inp} value={d.uni} onChange={(e) => set('uni', e.target.value)} placeholder="Universidade Agostinho Neto" required />
                            </Field>
                            <Field label="Curso *">
                                <input style={inp} value={d.curso} onChange={(e) => set('curso', e.target.value)} placeholder="Gestão de Empresas" required />
                            </Field>
                            <div style={s.row}>
                                <button style={s.btnSec} onClick={() => setStep(2)}>← Voltar</button>
                                <button style={{ ...s.btn, background: valid[3] ? '#1A1A1A' : '#E7E5E1', color: valid[3] ? '#fff' : '#8A8A87', cursor: valid[3] ? 'pointer' : 'not-allowed' }} disabled={!valid[3]} onClick={() => setStep(4)}>
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Motivation */}
                    {step === 4 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Carta de motivação</h2>
                                <p style={{ fontSize: 13, color: '#525252' }}>Mínimo 50 caracteres. Explica porque te candidatas ao BFA.</p>
                            </div>
                            <textarea
                                style={{ ...inp, height: 160, resize: 'vertical' } as React.CSSProperties}
                                value={d.motivacao}
                                onChange={(e) => set('motivacao', e.target.value)}
                                placeholder="Candido-me ao BFA Talento porque…"
                            />
                            <div style={{ fontSize: 12, color: d.motivacao.length >= 50 ? '#059669' : '#8A8A87', textAlign: 'right' }}>
                                {d.motivacao.length} / 50 mín.
                            </div>
                            <div style={s.row}>
                                <button style={s.btnSec} onClick={() => setStep(3)}>← Voltar</button>
                                <button style={{ ...s.btn, background: valid[4] ? '#1A1A1A' : '#E7E5E1', color: valid[4] ? '#fff' : '#8A8A87', cursor: valid[4] ? 'pointer' : 'not-allowed' }} disabled={!valid[4]} onClick={() => setStep(5)}>
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {step === 5 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Revisão</h2>
                            <div style={{ background: '#F2F2F0', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'Programa', value: selectedProgram?.name ?? effectiveProgram },
                                    { label: 'Nome', value: d.nome },
                                    { label: 'Email', value: d.email },
                                    { label: 'Telemóvel', value: d.tel || '—' },
                                    { label: 'Universidade', value: d.uni },
                                    { label: 'Curso', value: d.curso },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', gap: 12 }}>
                                        <div style={{ fontSize: 12, color: '#8A8A87', width: 90, flexShrink: 0 }}>{label}</div>
                                        <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                                <input type="checkbox" checked={d.rgpd} onChange={(e) => set('rgpd', e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: '#525252', lineHeight: 1.5 }}>
                                    Autorizo o tratamento dos meus dados pessoais nos termos da Lei 22/11 (APD) e da política de privacidade do BFA.
                                </span>
                            </label>
                            <div style={s.row}>
                                <button style={s.btnSec} onClick={() => setStep(4)}>← Voltar</button>
                                <button
                                    style={{ ...s.btn, background: valid[5] && !submitting ? '#FF7607' : '#E7E5E1', color: valid[5] && !submitting ? '#fff' : '#8A8A87', cursor: valid[5] && !submitting ? 'pointer' : 'not-allowed' }}
                                    disabled={!valid[5] || submitting}
                                    onClick={submit}
                                >
                                    {submitting ? 'A enviar…' : 'Submeter candidatura →'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
