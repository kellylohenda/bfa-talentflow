import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

type Program = { id: number; code: string; name: string; descricao: string };

const STEPS = [
    { id: 1, title: 'Programa',      desc: 'Escolha do percurso' },
    { id: 2, title: 'Identificação', desc: 'Dados pessoais' },
    { id: 3, title: 'Académico',     desc: 'Formação e notas' },
    { id: 4, title: 'Motivação',     desc: 'Carta e ensaio' },
    { id: 5, title: 'Revisão',       desc: 'Confirmar e submeter' },
];

const PROVINCIAS = ['Luanda','Benguela','Huambo','Huíla','Cabinda','Bié','Cuanza Norte','Cuanza Sul','Cunene','Lunda Norte','Lunda Sul','Malanje','Moxico','Namibe','Uíge','Zaire','Bengo','Cuando Cubango'];

export default function CandidaturaIndex({ programs }: { programs: Program[] }) {
    const [step, setStep] = useState(1);
    const [done, setDone] = useState<number[]>([]);
    const [ref, setRef] = useState('');
    
    // Get preselected program from URL safely
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const preselected = urlParams?.get('program') ?? '';

    const { data, setData, post, processing, errors } = useForm({
        program_code: preselected,
        nome: '',
        email: '',
        tel: '',
        genero: '',
        bi: '',
        dob: '',
        provincia: '',
        morada: '',
        grau: '',
        uni: '',
        curso: '',
        anoFim: '',
        media: '',
        ingles: '',
        motivacao: '',
        rgpd: false,
    });

    const next = () => {
        setDone(prev => Array.from(new Set([...prev, step])));
        setStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prev = () => {
        setStep(s => s - 1);
        window.scrollTo({ top: 0 });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/candidatura', {
            onSuccess: (page) => {
                const responseRef = (page.props.flash as any)?.ref;
                if (responseRef) {
                    setRef(responseRef);
                    setStep(6);
                }
            },
        });
    };

    const selectedProgram = programs.find(p => p.code === data.program_code);

    return (
        <>
            <Head title="Candidatura — BFA Talento" />
            
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #FAFAF9; color: #1A1A1A; font-family: Inter, system-ui, sans-serif; }
                .pub-top { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #E7E5E1; }
                .pub-top-inner { max-width: 1240px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 32px; }
                .pub-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #1A1A1A; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
                .pub-logo { width: 32px; height: 32px; background: #1A1A1A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border-radius: 5px; }
                .pub-cta { display: inline-flex; align-items: center; padding: 10px 18px; background: #1A1A1A; color: #fff; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: background 120ms; }
                .pub-cta:hover { background: #FF7607; }
                
                .shell-main { max-width: 1200px; margin: 40px auto; padding: 0 32px 80px; display: grid; grid-template-columns: 300px 1fr; gap: 40px; align-items: start; }
                .stepper { position: sticky; top: 88px; background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; padding: 28px; }
                .stepper h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A8A87; font-weight: 600; margin-bottom: 20px; }
                .step-item { display: flex; gap: 12px; padding: 10px 0; align-items: flex-start; }
                .step-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: #F2F2F0; color: #8A8A87; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; border: 2px solid transparent; }
                .step-item.s-active .step-num { background: #FF7607; color: #fff; border-color: #FFDDB8; }
                .step-item.s-done .step-num { background: #fff; color: #FF7607; border-color: #FF7607; }
                .step-text b { display: block; font-size: 14px; color: #525252; font-weight: 500; }
                .step-item.s-active .step-text b { color: #1A1A1A; font-weight: 600; }
                .step-text span { font-size: 12px; color: #8A8A87; }
                .step-line { width: 2px; height: 12px; background: #E7E5E1; margin: 0 13px; }
                
                .form-card { background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; padding: 40px 48px; }
                .form-head h1 { font-size: 28px; letter-spacing: -0.02em; font-weight: 600; margin-bottom: 6px; }
                .form-head p { font-size: 14px; color: #525252; margin-bottom: 32px; }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
                .field { display: flex; flex-direction: column; gap: 6px; }
                .field-full { grid-column: 1 / -1; }
                .field label { font-size: 12px; font-weight: 500; color: #525252; }
                .req { color: #FF7607; margin-left: 2px; }
                .field input, .field select, .field textarea { padding: 11px 13px; border: 1px solid #E7E5E1; border-radius: 8px; font-size: 14px; font-family: inherit; color: #1A1A1A; background: #fff; outline: none; transition: border-color 120ms, box-shadow 120ms; width: 100%; }
                .field input:focus, .field select:focus, .field textarea:focus { border-color: #FF7607; box-shadow: 0 0 0 3px #FFF0E5; }
                .error-msg { color: #DC2626; font-size: 12px; margin-top: 4px; }
                
                .radio-group { display: flex; flex-direction: column; gap: 10px; }
                .radio-card { border: 1px solid #E7E5E1; border-radius: 10px; padding: 16px; display: flex; gap: 14px; cursor: pointer; transition: all 120ms; align-items: center; }
                .radio-card:hover { border-color: #FF7607; }
                .radio-card.selected { border-color: #FF7607; background: #FFF8F2; }
                .radio-card input { accent-color: #FF7607; }
                .radio-card .meta b { display: block; font-size: 15px; font-weight: 600; color: #1A1A1A; }
                .radio-card .meta span { font-size: 12px; color: #525252; }
                
                .form-actions { display: flex; justify-content: space-between; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E7E5E1; }
                .btn-back { background: none; border: 1px solid #E7E5E1; padding: 11px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #525252; cursor: pointer; }
                .btn-next { background: #FF7607; color: #fff; border: none; padding: 11px 22px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; }
                .btn-submit { background: #1A1A1A; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; }
                
                .success-wrap { text-align: center; padding: 48px 24px; }
                .success-icon { width: 72px; height: 72px; border-radius: 50%; background: #FFF0E5; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
                .success-ref { display: inline-block; padding: 12px 20px; background: #F2F2F0; border-radius: 8px; font-family: monospace; font-size: 16px; margin: 24px 0; }
                .success-ref b { color: #FF7607; }
                
                .review-section { padding: 20px; background: #FAFAF9; border-radius: 8px; margin-bottom: 12px; }
                .review-section h4 { font-size: 11px; text-transform: uppercase; color: #8A8A87; margin-bottom: 12px; }
                .review-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
                .review-row span { color: #8A8A87; }
                
                @media (max-width: 900px) {
                    .shell-main { grid-template-columns: 1fr; padding: 20px; }
                    .stepper { display: none; }
                    .form-card { padding: 32px 24px; }
                }
            `}</style>

            <div className="pub-top">
                <div className="pub-top-inner">
                    <Link href="/" className="pub-brand">
                        <div className="pub-logo">B</div>
                        <div>BFA Talento <small>· Candidatura {new Date().getFullYear()}</small></div>
                    </Link>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link href="/" className="pub-cta" style={{ background: '#fff', color: '#1A1A1A', border: '1px solid #E7E5E1' }}>← Voltar ao programa</Link>
                    </div>
                </div>
            </div>

            <div className="shell-main">
                {step < 6 && (
                    <div className="stepper">
                        <h3>Etapas</h3>
                        {STEPS.map((s, i) => (
                            <div key={s.id}>
                                <div className={`step-item ${step === s.id ? 's-active' : ''} ${done.includes(s.id) ? 's-done' : ''}`}>
                                    <div className="step-num">{done.includes(s.id) ? '✓' : s.id}</div>
                                    <div className="step-text"><b>{s.title}</b><span>{s.desc}</span></div>
                                </div>
                                {i < STEPS.length - 1 && <div className="step-line" />}
                            </div>
                        ))}
                    </div>
                )}

                <div className="form-card" style={step === 6 ? { gridColumn: '1 / -1', maxWidth: 640, margin: '0 auto' } : {}}>
                    {step === 6 ? (
                        <div className="success-wrap">
                            <div className="success-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF7607" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h1>Candidatura submetida!</h1>
                            <p>Recebemos o teu processo com sucesso. Enviámos um email de confirmação para <b>{data.email}</b>.</p>
                            <div className="success-ref">Referência · <b>{ref}</b></div>
                            <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <Link href={`/portal`} className="pub-cta" style={{ background: '#FF7607' }}>Acompanhar estado →</Link>
                                <Link href="/" className="pub-cta" style={{ background: '#fff', color: '#1A1A1A', border: '1px solid #E7E5E1' }}>Voltar ao início</Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submit}>
                            {step === 1 && (
                                <>
                                    <div className="form-head">
                                        <h1>Programa</h1>
                                        <p>Escolhe o programa que melhor se adapta aos teus objetivos.</p>
                                    </div>
                                    <div className="radio-group">
                                        {programs.map(p => (
                                            <label key={p.id} className={`radio-card ${data.program_code === p.code ? 'selected' : ''}`}>
                                                <input type="radio" name="program" value={p.code} checked={data.program_code === p.code} onChange={e => setData('program_code', e.target.value)} />
                                                <div className="meta"><b>{p.name}</b><span>{p.descricao}</span></div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.program_code && <div className="error-msg">{errors.program_code}</div>}
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="form-head">
                                        <h1>Identificação</h1>
                                        <p>Dados básicos para o teu registo.</p>
                                    </div>
                                    <div className="form-grid">
                                        <div className="field field-full">
                                            <label>Nome completo <span className="req">*</span></label>
                                            <input type="text" value={data.nome} onChange={e => setData('nome', e.target.value)} placeholder="Como consta no BI" />
                                            {errors.nome && <div className="error-msg">{errors.nome}</div>}
                                        </div>
                                        <div className="field">
                                            <label>Email <span className="req">*</span></label>
                                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="exemplo@email.com" />
                                            {errors.email && <div className="error-msg">{errors.email}</div>}
                                        </div>
                                        <div className="field">
                                            <label>Telemóvel</label>
                                            <input type="tel" value={data.tel} onChange={e => setData('tel', e.target.value)} placeholder="+244..." />
                                        </div>
                                        <div className="field">
                                            <label>Nº do BI <span className="req">*</span></label>
                                            <input type="text" value={data.bi} onChange={e => setData('bi', e.target.value)} placeholder="000000000LA000" />
                                        </div>
                                        <div className="field">
                                            <label>Província <span className="req">*</span></label>
                                            <select value={data.provincia} onChange={e => setData('provincia', e.target.value)}>
                                                <option value="">Seleccionar...</option>
                                                {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="form-head">
                                        <h1>Formação Académica</h1>
                                        <p>Indica os teus estudos mais recentes.</p>
                                    </div>
                                    <div className="form-grid">
                                        <div className="field">
                                            <label>Grau Académico <span className="req">*</span></label>
                                            <select value={data.grau} onChange={e => setData('grau', e.target.value)}>
                                                <option value="">Seleccionar...</option>
                                                <option value="Licenciatura">Licenciatura</option>
                                                <option value="Mestrado">Mestrado</option>
                                            </select>
                                        </div>
                                        <div className="field">
                                            <label>Curso <span className="req">*</span></label>
                                            <input type="text" value={data.curso} onChange={e => setData('curso', e.target.value)} />
                                        </div>
                                        <div className="field field-full">
                                            <label>Universidade <span className="req">*</span></label>
                                            <input type="text" value={data.uni} onChange={e => setData('uni', e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 4 && (
                                <>
                                    <div className="form-head">
                                        <h1>Motivação</h1>
                                        <p>Uma breve descrição do porquê te candidatas ao BFA.</p>
                                    </div>
                                    <div className="field field-full">
                                        <textarea rows={8} value={data.motivacao} onChange={e => setData('motivacao', e.target.value)} placeholder="Candido-me ao BFA porque..." />
                                        {errors.motivacao && <div className="error-msg">{errors.motivacao}</div>}
                                    </div>
                                </>
                            )}

                            {step === 5 && (
                                <>
                                    <div className="form-head">
                                        <h1>Revisão</h1>
                                        <p>Confirma os dados antes de submeter.</p>
                                    </div>
                                    <div className="review-section">
                                        <h4>Resumo</h4>
                                        <div className="review-row"><span>Programa:</span><b>{selectedProgram?.name}</b></div>
                                        <div className="review-row"><span>Nome:</span><b>{data.nome}</b></div>
                                        <div className="review-row"><span>Email:</span><b>{data.email}</b></div>
                                        <div className="review-row"><span>Curso:</span><b>{data.curso}</b></div>
                                    </div>
                                    <label style={{ display: 'flex', gap: 10, marginTop: 20, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={data.rgpd} onChange={e => setData('rgpd', e.target.checked)} />
                                        <span style={{ fontSize: 13, color: '#525252', lineHeight: 1.5 }}>
                                            Declaro que os dados são verdadeiros e autorizo o tratamento ao abrigo da Lei 22/11 (APD).
                                        </span>
                                    </label>
                                    {errors.rgpd && <div className="error-msg">{errors.rgpd}</div>}
                                </>
                            )}

                            <div className="form-actions">
                                <button type="button" className="btn-back" onClick={prev} style={step === 1 ? { visibility: 'hidden' } : {}}>← Voltar</button>
                                {step < 5 ? (
                                    <button type="button" className="btn-next" onClick={next} disabled={step === 1 && !data.program_code}>Continuar →</button>
                                ) : (
                                    <button type="submit" className="btn-submit" disabled={processing || !data.rgpd}>
                                        {processing ? 'A processar...' : 'Submeter Candidatura'}
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
