import { Head, router } from '@inertiajs/react';
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
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    color: 'var(--text)',
    outline: 'none',
    background: 'var(--surface)',
    transition: 'border-color 120ms, box-shadow 120ms',
};

function Field({ label, error, children }: { label: string; error?: string | false; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>
            {children}
            {error && <div style={{ fontSize: 12, color: 'var(--danger)', lineHeight: 1.4 }}>{error}</div>}
        </div>
    );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(k: keyof FormData, v: string | boolean): string {
    switch (k) {
        case 'program_code':
            return !v ? 'Seleciona um programa.' : '';
        case 'nome':
            return !v ? 'Nome é obrigatório.' : String(v).length < 2 ? 'Mínimo 2 caracteres.' : '';
        case 'email':
            return !v ? 'Email é obrigatório.' : !EMAIL_RE.test(String(v)) ? 'Email inválido.' : '';
        case 'tel':
            return '';
        case 'grau':
            return !v ? 'Seleciona o grau académico.' : '';
        case 'uni':
            return !v ? 'Universidade é obrigatória.' : '';
        case 'curso':
            return !v ? 'Curso é obrigatório.' : '';
        case 'motivacao':
            return String(v).length < 50 ? 'Mínimo 50 caracteres (' + String(v).length + '/50).' : '';
        case 'rgpd':
            return !v ? 'Aceita a política de privacidade.' : '';
    }
}

export default function CandidaturaIndex({ programs }: { programs: Program[] }) {
    const [step, setStep] = useState(1);
    const [d, setD] = useState<FormData>(INIT);
    const [ref, setRef] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

    const urlParams = new URLSearchParams(window.location.search);
    const preselected = urlParams.get('program') ?? '';

    const set = (k: keyof FormData, v: string | boolean) => {
        setD((prev) => ({ ...prev, [k]: v }));
        setErrors((prev) => ({ ...prev, [k]: validateField(k, v) }));
    };

    const handleBlur = (k: keyof FormData) => {
        setTouched((prev) => ({ ...prev, [k]: true }));
        setErrors((prev) => ({ ...prev, [k]: validateField(k, d[k]) }));
    };

    const stepFields: Record<number, (keyof FormData)[]> = {
        1: ['program_code'],
        2: ['nome', 'email'],
        3: ['grau', 'uni', 'curso'],
        4: ['motivacao'],
        5: ['rgpd'],
    };

    function validateStep(s: number): boolean {
        const fields = stepFields[s] ?? [];
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        let valid = true;
        for (const f of fields) {
            const err = validateField(f, d[f]);
            newErrors[f] = err;
            if (err) valid = false;
        }
        setErrors((prev) => ({ ...prev, ...newErrors }));
        setTouched((prev) => {
            const next = { ...prev };
            for (const f of fields) next[f] = true;
            return next;
        });
        return valid;
    }

    function goToStep(next: number) {
        if (next > step && !validateStep(step)) return;
        setStep(next);
    }

    const valid: Record<number, boolean> = {
        1: !!(d.program_code || preselected),
        2: !!(d.nome && d.email && EMAIL_RE.test(d.email)),
        3: !!(d.grau && d.uni && d.curso),
        4: d.motivacao.length >= 50,
        5: d.rgpd,
    };

    const effectiveProgram = d.program_code || preselected;

    function submit() {
        setSubmitting(true);
        setError('');
        router.post('/candidatura', {
            ...d,
            program_code: effectiveProgram,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const responseRef = (page.props.flash as Record<string, unknown>)?.ref as string | undefined;
                if (responseRef) {
                    setRef(responseRef);
                    setStep(6);
                }
            },
            onError: (errors) => {
                const msgs = Object.values(errors).flat();
                setError(msgs[0] || 'Erro.');
            },
            onFinish: () => setSubmitting(false),
        });
    }

    const selectedProgram = programs.find((p) => p.code === effectiveProgram);

    const s: Record<string, React.CSSProperties> = {
        wrap: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'clamp(32px, 6vw, 48px) clamp(12px, 4vw, 20px) 80px' },
        card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(24px, 4vw, 40px)', width: '100%', maxWidth: 560 },
        btn: { width: '100%', background: 'var(--text)', color: 'var(--bg)', border: 'none', padding: 13, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 120ms' },
        btnSec: { width: '100%', background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)', padding: 13, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
        row: { display: 'flex', gap: 12 },
    };

    if (step === 6) {
        return (
            <PublicLayout>
                <Head title="Candidatura submetida — BFA Talento" />
                <div style={s.wrap}>
                    <div style={{ ...s.card, textAlign: 'center' }}>
                        <div style={{ width: 56, height: 56, background: 'var(--success-bg)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12l3 3 5-5" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em', color: 'var(--text)' }}>Candidatura submetida!</h1>
                        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                            Recebemos a tua candidatura com sucesso. Usa a referência abaixo para acompanhar o estado.
                        </p>
                        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 4 }}>REFERÊNCIA</div>
                            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--text)', fontFamily: 'monospace' }}>{ref}</div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>Enviámos também um email de confirmação para <strong>{d.email}</strong>.</p>
                        <a href={`/portal/${ref}`} style={{ ...s.btn as React.CSSProperties, display: 'block', textAlign: 'center', textDecoration: 'none', padding: '13px' }}>
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
                <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                    {STEPS.map((st, i) => (
                        <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%', fontSize: 12, fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: step === st.id ? 'var(--primary)' : step > st.id ? 'var(--success)' : 'var(--border)',
                                color: step >= st.id ? '#fff' : 'var(--text-3)',
                                flexShrink: 0,
                            }}>
                                {step > st.id ? '✓' : st.id}
                            </div>
                            <span style={{ fontSize: 12, color: step === st.id ? 'var(--text)' : 'var(--text-3)', fontWeight: step === st.id ? 600 : 400 }}>
                                {st.title}
                            </span>
                            {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: 'var(--border)' }} />}
                        </div>
                    ))}
                </div>

                <div style={s.card}>
                    {error && (
                        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>{error}</div>
                    )}

                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>Escolhe o programa</h2>
                                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Podes indicar uma 2.ª preferência na motivação.</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {programs.map((p) => {
                                    const active = (d.program_code || preselected) === p.code;
                                    return (
                                        <button key={p.code} onClick={() => set('program_code', p.code)} style={{
                                            width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 10,
                                            border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                                            background: active ? 'var(--primary-soft)' : 'var(--surface)',
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            transition: 'border-color 120ms, background 120ms',
                                        }}>
                                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{p.name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{p.descricao}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            {touched.program_code && errors.program_code && <div style={{ fontSize: 12, color: 'var(--danger)', lineHeight: 1.4 }}>{errors.program_code}</div>}
                            <button style={{ ...s.btn, background: valid[1] ? 'var(--text)' : 'var(--disabled)', color: valid[1] ? 'var(--bg)' : 'var(--text-3)', cursor: valid[1] ? 'pointer' : 'not-allowed' }} disabled={!valid[1]} onClick={() => goToStep(2)}>
                                Continuar →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Dados pessoais</h2>
                            <Field label="Nome completo *" error={touched.nome && errors.nome}>
                                <input style={{ ...inp, borderColor: touched.nome && errors.nome ? 'var(--danger)' : 'var(--border)' }} value={d.nome} onChange={(e) => set('nome', e.target.value)} onBlur={() => handleBlur('nome')} placeholder="Ana Ferreira da Silva" required />
                            </Field>
                            <Field label="Email *" error={touched.email && errors.email}>
                                <input style={{ ...inp, borderColor: touched.email && errors.email ? 'var(--danger)' : 'var(--border)' }} type="email" value={d.email} onChange={(e) => set('email', e.target.value)} onBlur={() => handleBlur('email')} placeholder="ana.silva@email.com" required />
                            </Field>
                            <Field label="Telemóvel">
                                <input style={inp} value={d.tel} onChange={(e) => set('tel', e.target.value)} placeholder="+244 9XX XXX XXX" />
                            </Field>
                            <div style={s.row}>
                                <button style={s.btnSec} onClick={() => setStep(1)}>← Voltar</button>
                                <button style={{ ...s.btn, background: valid[2] ? 'var(--text)' : 'var(--disabled)', color: valid[2] ? 'var(--bg)' : 'var(--text-3)', cursor: valid[2] ? 'pointer' : 'not-allowed' }} disabled={!valid[2]} onClick={() => goToStep(3)}>
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Formação académica</h2>
                            <Field label="Grau" error={touched.grau && errors.grau}>
                                <select style={{ ...inp, borderColor: touched.grau && errors.grau ? 'var(--danger)' : 'var(--border)' }} value={d.grau} onChange={(e) => set('grau', e.target.value)} onBlur={() => handleBlur('grau')}>
                                    <option value="">Seleccionar…</option>
                                    <option value="licenciatura">Licenciatura</option>
                                    <option value="mestrado">Mestrado</option>
                                    <option value="doutoramento">Doutoramento</option>
                                </select>
                            </Field>
                            <Field label="Universidade *" error={touched.uni && errors.uni}>
                                <input style={{ ...inp, borderColor: touched.uni && errors.uni ? 'var(--danger)' : 'var(--border)' }} value={d.uni} onChange={(e) => set('uni', e.target.value)} onBlur={() => handleBlur('uni')} placeholder="Universidade Agostinho Neto" required />
                            </Field>
                            <Field label="Curso *" error={touched.curso && errors.curso}>
                                <input style={{ ...inp, borderColor: touched.curso && errors.curso ? 'var(--danger)' : 'var(--border)' }} value={d.curso} onChange={(e) => set('curso', e.target.value)} onBlur={() => handleBlur('curso')} placeholder="Gestão de Empresas" required />
                            </Field>
                            <div style={s.row}>
                                <button style={s.btnSec} onClick={() => setStep(2)}>← Voltar</button>
                                <button style={{ ...s.btn, background: valid[3] ? 'var(--text)' : 'var(--disabled)', color: valid[3] ? 'var(--bg)' : 'var(--text-3)', cursor: valid[3] ? 'pointer' : 'not-allowed' }} disabled={!valid[3]} onClick={() => setStep(4)}>
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>Carta de motivação</h2>
                                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Mínimo 50 caracteres. Explica porque te candidatas ao BFA.</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <textarea
                                    style={{ ...inp, height: 160, resize: 'vertical', borderColor: touched.motivacao && errors.motivacao ? 'var(--danger)' : 'var(--border)' } as React.CSSProperties}
                                    value={d.motivacao}
                                    onChange={(e) => set('motivacao', e.target.value)}
                                    onBlur={() => handleBlur('motivacao')}
                                    placeholder="Candido-me ao BFA Talento porque…"
                                />
                                {touched.motivacao && errors.motivacao && <div style={{ fontSize: 12, color: 'var(--danger)', lineHeight: 1.4 }}>{errors.motivacao}</div>}
                            </div>
                            <div style={{ fontSize: 12, color: d.motivacao.length >= 50 ? 'var(--success)' : 'var(--text-3)', textAlign: 'right' }}>
                                {d.motivacao.length} / 50 mín.
                            </div>
                            <div style={s.row}>
                                <button style={s.btnSec} onClick={() => setStep(3)}>← Voltar</button>
                                <button style={{ ...s.btn, background: valid[4] ? 'var(--text)' : 'var(--disabled)', color: valid[4] ? 'var(--bg)' : 'var(--text-3)', cursor: valid[4] ? 'pointer' : 'not-allowed' }} disabled={!valid[4]} onClick={() => goToStep(5)}>
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Revisão</h2>
                            <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'Programa', value: selectedProgram?.name ?? effectiveProgram },
                                    { label: 'Nome', value: d.nome },
                                    { label: 'Email', value: d.email },
                                    { label: 'Telemóvel', value: d.tel || '—' },
                                    { label: 'Universidade', value: d.uni },
                                    { label: 'Curso', value: d.curso },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', gap: 12 }}>
                                        <div style={{ fontSize: 12, color: 'var(--text-3)', width: 90, flexShrink: 0 }}>{label}</div>
                                        <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                                <input type="checkbox" checked={d.rgpd} onChange={(e) => set('rgpd', e.target.checked)} onBlur={() => handleBlur('rgpd')} style={{ marginTop: 2, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                                    Autorizo o tratamento dos meus dados pessoais nos termos da Lei 22/11 (APD) e da política de privacidade do BFA.
                                </span>
                            </label>
                            {touched.rgpd && errors.rgpd && <div style={{ fontSize: 12, color: 'var(--danger)', lineHeight: 1.4 }}>{errors.rgpd}</div>}
                            <div style={s.row}>
                                <button style={s.btnSec} onClick={() => setStep(4)}>← Voltar</button>
                                <button
                                    style={{ ...s.btn, background: valid[5] && !submitting ? 'var(--primary)' : 'var(--disabled)', color: valid[5] && !submitting ? '#fff' : 'var(--text-3)', cursor: valid[5] && !submitting ? 'pointer' : 'not-allowed' }}
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
