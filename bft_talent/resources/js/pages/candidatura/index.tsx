import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ChevronLeft, 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    Check, 
    ClipboardCheck, 
    User, 
    BookOpen, 
    Lightbulb, 
    Eye 
} from 'lucide-react';

type Program = { id: number; code: string; name: string; descricao: string };

const STEPS = [
    { id: 1, title: 'Programa',      desc: 'Escolha do percurso', icon: <ClipboardCheck size={16} /> },
    { id: 2, title: 'Identificação', desc: 'Dados pessoais',    icon: <User size={16} /> },
    { id: 3, title: 'Académico',     desc: 'Formação e notas',   icon: <BookOpen size={16} /> },
    { id: 4, title: 'Motivação',     desc: 'Carta e ensaio',     icon: <Lightbulb size={16} /> },
    { id: 5, title: 'Revisão',       desc: 'Confirmar dados',    icon: <Eye size={16} /> },
];

const PROVINCIAS = ['Luanda','Benguela','Huambo','Huíla','Cabinda','Bié','Cuanza Norte','Cuanza Sul','Cunene','Lunda Norte','Lunda Sul','Malanje','Moxico','Namibe','Uíge','Zaire','Bengo','Cuando Cubango'];

export default function CandidaturaIndex({ programs }: { programs: Program[] }) {
    const [step, setStep] = useState(1);
    const [done, setDone] = useState<number[]>([]);
    const [ref, setRef] = useState('');
    
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
                
                .pub-top { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid #E7E5E1; }
                .pub-top-inner { max-width: 1240px; margin: 0 auto; padding: 12px 32px; display: flex; align-items: center; gap: 32px; }
                .pub-logo-img { height: 38px; width: auto; }
                
                .pub-cta { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: #fff; color: var(--brand-navy); border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; border: 1px solid #D1D1D1; cursor: pointer; transition: 150ms; }
                .pub-cta:hover { background: #F8F8F7; }
                
                .shell-main { max-width: 1100px; margin: 40px auto; padding: 0 32px 80px; display: grid; grid-template-columns: 280px 1fr; gap: 40px; align-items: start; }
                .stepper { position: sticky; top: 88px; background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
                .stepper h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A8A87; font-weight: 800; margin-bottom: 24px; }
                .step-item { display: flex; gap: 14px; padding: 12px 0; align-items: flex-start; }
                .step-num { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: #F2F2F0; color: #8A8A87; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
                .step-item.s-active .step-num { background: var(--primary); color: #fff; }
                .step-item.s-done .step-num { background: #fff; color: var(--primary); border: 2px solid var(--primary); }
                .step-text b { display: block; font-size: 14px; color: #4A4A4A; font-weight: 700; }
                .step-item.s-active .step-text b { color: var(--brand-navy); }
                
                .form-card { background: #fff; border: 1px solid #E7E5E1; border-radius: 16px; padding: 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
                .form-head h1 { font-size: 28px; letter-spacing: -0.02em; font-weight: 800; color: var(--brand-navy); margin-bottom: 8px; }
                .form-head p { font-size: 15px; color: #666; margin-bottom: 32px; font-weight: 500; }
                
                .field label { font-size: 12px; font-weight: 700; color: #525252; display: block; margin-bottom: 8px; text-transform: uppercase; }
                .field input, .field select, .field textarea { padding: 12px 14px; border: 1px solid #E7E5E1; border-radius: 10px; font-size: 14px; color: #1A1A1A; background: #fff; width: 100%; transition: all 150ms; font-weight: 500; }
                .field input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(255, 102, 0, 0.1); }
                
                .radio-card { border: 1px solid #E7E5E1; border-radius: 12px; padding: 20px; display: flex; gap: 16px; cursor: pointer; transition: all 120ms; align-items: center; }
                .radio-card.selected { border-color: var(--primary); background: #FFF9F5; }
                .radio-card .meta b { display: block; font-size: 15px; font-weight: 700; color: var(--brand-navy); }
                
                .btn-next { background: var(--primary); color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
                .btn-back { background: #fff; border: 1px solid #E7E5E1; padding: 12px 20px; border-radius: 8px; font-size: 15px; font-weight: 700; color: #525252; cursor: pointer; display: flex; align-items: center; gap: 8px; }
                .btn-submit { background: var(--brand-navy); color: #fff; border: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; }
            `}</style>

            <div className="pub-top">
                <div className="pub-top-inner">
                    <Link href="/" className="pub-brand">
                        <img src="/images/logo-bfa.png" alt="BFA Logo" className="pub-logo-img" />
                    </Link>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link href="/" className="pub-cta">
                            <ChevronLeft size={16} /> Voltar
                        </Link>
                    </div>
                </div>
            </div>

            <div className="shell-main">
                {step < 6 && (
                    <div className="stepper">
                        <h3>Candidatura</h3>
                        {STEPS.map((s, i) => (
                            <div key={s.id} className={`step-item ${step === s.id ? 's-active' : ''} ${done.includes(s.id) ? 's-done' : ''}`}>
                                <div className="step-num">
                                    {done.includes(s.id) ? <Check size={14} /> : s.id}
                                </div>
                                <div className="step-text">
                                    <b>{s.title}</b>
                                    <span style={{ fontSize: 11, color: '#8A8A87' }}>{s.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="form-card" style={step === 6 ? { gridColumn: '1 / -1', maxWidth: 640, margin: '0 auto' } : {}}>
                    {step === 6 ? (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <div style={{ width:80, height:80, background: '#FFF9F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <CheckCircle2 size={40} className="text-orange-600" />
                            </div>
                            <h1 style={{ color: 'var(--brand-navy)', fontSize: 32, marginBottom: 16, fontWeight: 800 }}>Submetido com Sucesso!</h1>
                            <p style={{ color: '#525252', fontSize: 16, lineHeight: 1.6, fontWeight: 500 }}>A sua candidatura foi registada. Receberá em breve um email de confirmação.</p>
                            <div style={{ display: 'inline-block', padding: '16px 24px', background: '#F8F8F7', borderRadius: 12, border: '1px solid #E7E5E1', fontSize: 18, margin: '32px 0', fontWeight: 800 }}>
                                Ref: <span style={{ color: 'var(--primary)' }}>{ref}</span>
                            </div>
                            <div style={{ marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center' }}>
                                <Link href={`/portal`} className="pub-cta" style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '14px 28px' }}>
                                    Ir para o Portal <ArrowRight size={18} />
                                </Link>
                                <Link href="/" className="pub-cta" style={{ padding: '14px 28px' }}>
                                    Sair
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submit}>
                            {step === 1 && (
                                <>
                                    <div className="form-head">
                                        <h1>Seleccione o Programa</h1>
                                        <p>Escolha o percurso que melhor se adapta aos seus estudos.</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {programs.map(p => (
                                            <label key={p.id} className={`radio-card ${data.program_code === p.code ? 'selected' : ''}`}>
                                                <input type="radio" value={p.code} checked={data.program_code === p.code} onChange={e => setData('program_code', e.target.value)} className="w-5 h-5 accent-orange-600" />
                                                <div className="meta"><b>{p.name}</b><span className="text-[13px] text-gray-500 font-medium">{p.descricao}</span></div>
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}
                            {/* ... Rest of steps same pattern ... */}
                            {step > 1 && step < 6 && (
                                <div className="form-head">
                                    <h1>{STEPS[step-1].title}</h1>
                                    <p>{STEPS[step-1].desc}</p>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="field col-span-2">
                                        <label>Nome Completo</label>
                                        <input value={data.nome} onChange={e => setData('nome', e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label>Email</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label>BI</label>
                                        <input value={data.bi} onChange={e => setData('bi', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            <div className="form-actions mt-10 pt-8 border-t flex justify-between">
                                <button type="button" className="btn-back" onClick={prev} style={step === 1 ? { visibility: 'hidden' } : {}}>
                                    <ArrowLeft size={16} /> Anterior
                                </button>
                                {step < 5 ? (
                                    <button type="button" className="btn-next" onClick={next} disabled={step === 1 && !data.program_code}>
                                        Seguinte <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button type="submit" className="btn-submit" disabled={processing}>
                                        Finalizar Candidatura
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
