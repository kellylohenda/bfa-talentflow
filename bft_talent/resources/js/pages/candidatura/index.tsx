import { Head, useForm, Link } from '@inertiajs/react';
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
import { useState } from 'react';

type Program = { id: number; code: string; name: string; descricao: string };

const STEPS = [
    { id: 1, title: 'Programa',      desc: 'Escolha', icon: <ClipboardCheck size={16} /> },
    { id: 2, title: 'Identificação', desc: 'Dados',   icon: <User size={16} /> },
    { id: 3, title: 'Académico',     desc: 'Estudos', icon: <BookOpen size={16} /> },
    { id: 4, title: 'Motivação',     desc: 'Carta',   icon: <Lightbulb size={16} /> },
    { id: 5, title: 'Revisão',       desc: 'Resumo',  icon: <Eye size={16} /> },
];

const PROVINCIAS = ['Luanda','Benguela','Huambo','Huíla','Cabinda','Bié','Cuanza Norte','Cuanza Sul','Cunene','Lunda Norte','Lunda Sul','Malanje','Moxico','Namibe','Uíge','Zaire','Bengo','Cuando Cubango'];

export default function CandidaturaIndex({ programs }: { programs: Program[] }) {
    const [step, setStep] = useState(1);
    const [done, setDone] = useState<number[]>([]);
    const [ref, setRef] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        program_code: '',
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
            <Head title="Candidatura Institucional — BFA Talento" />

            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #F5F5F5; color: #333333; font-family: 'Inter', system-ui, sans-serif; }

                .pub-top { position: sticky; top: 0; z-index: 50; background: #FFFFFF; border-bottom: 1px solid #E5E5E5; padding: 16px 0; }
                .pub-top-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; }
                .pub-logo-img { height: 32px; width: auto; }

                .main-container { max-width: 1100px; margin: 60px auto; padding: 0 32px 100px; display: grid; grid-template-columns: 280px 1fr; gap: 60px; align-items: start; }

                .stepper { background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 18px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                .step-item { display: flex; gap: 16px; padding: 18px 0; align-items: center; border-bottom: 1px solid #F5F5F5; }
                .step-item:last-child { border-bottom: none; }
                .step-num { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: #F5F5F5; color: #9CA3AF; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }
                .step-item.active .step-num { background: #F58220; color: #FFFFFF; }
                .step-item.done .step-num { background: #FFF5F0; color: #F58220; border: 2px solid #F58220; }
                .step-text b { display: block; font-size: 14px; color: #333333; font-weight: 700; }

                .form-card { background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 18px; padding: 60px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                .form-head h1 { font-size: 32px; font-weight: 800; color: #333333; margin-bottom: 12px; letter-spacing: -0.02em; }
                .form-head p { font-size: 16px; color: #6B7280; margin-bottom: 48px; font-weight: 500; }

                .field { margin-bottom: 20px; }
                .field label { font-size: 12px; font-weight: 800; color: #333333; display: block; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
                .field input, .field select, .field textarea { padding: 14px 18px; border: 1px solid #E5E5E5; border-radius: 10px; font-size: 15px; width: 100%; transition: 0.2s; font-weight: 500; background: #FFFFFF; color: #333333; }
                .field input:focus, .field select:focus, .field textarea:focus { border-color: #F58220; outline: none; box-shadow: 0 0 0 4px rgba(245, 130, 32, 0.1); }
                .field textarea { resize: vertical; min-height: 120px; }

                .radio-choice { border: 1px solid #E5E5E5; border-radius: 14px; padding: 24px; display: flex; gap: 16px; cursor: pointer; transition: 0.2s; align-items: center; }
                .radio-choice:hover { border-color: #F58220; background: #FFF5F0; }
                .radio-choice.selected { border-color: #F58220; background: #FFF5F0; }
                .radio-choice b { display: block; font-size: 17px; font-weight: 800; color: #333333; }

                .checkbox-row { display: flex; align-items: flex-start; gap: 12px; margin-top: 16px; }
                .checkbox-row input[type="checkbox"] { width: 20px; height: 20px; accent-color: #F58220; flex-shrink: 0; margin-top: 2px; }
                .checkbox-row span { font-size: 14px; color: #6B7280; line-height: 1.5; }

                .btn-next { background: #F58220; color: #FFFFFF; border: none; padding: 16px 32px; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
                .btn-next:hover { background: #D96A0B; transform: translateY(-1px); }
                .btn-next:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
                .btn-back { background: #FFFFFF; border: 1px solid #E5E5E5; padding: 16px 32px; border-radius: 10px; font-size: 16px; font-weight: 800; color: #6B7280; cursor: pointer; transition: 0.2s; }

                .footer-nav { display: flex; justify-content: space-between; margin-top: 48px; padding-top: 32px; border-top: 1px solid #F5F5F5; }

                .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .summary-item { padding: 16px; background: #F9FAFB; border-radius: 12px; border: 1px solid #F5F5F5; }
                .summary-item.full { grid-column: 1 / -1; }
                .summary-item label { font-size: 11px; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px; }
                .summary-item p { font-size: 15px; color: #333333; font-weight: 600; margin: 0; }
            `}</style>

            <div className="pub-top">
                <div className="pub-top-inner">
                    <Link href="/">
                        <img src="/images/logo-bfa.png" alt="BFA Logo" className="pub-logo-img" />
                    </Link>
                    <Link href="/" style={{ color: '#F58220', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                        ← Sair do formulário
                    </Link>
                </div>
            </div>

            <div className="main-container">
                {step < 6 && (
                    <div className="stepper">
                        <p style={{ fontSize:11, fontWeight:800, color:'#9CA3AF', textTransform:'uppercase', marginBottom:24, letterSpacing:'0.1em' }}>Progresso</p>
                        {STEPS.map((s, i) => (
                            <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${done.includes(s.id) ? 'done' : ''}`}>
                                <div className="step-num">{done.includes(s.id) ? <Check size={16} /> : s.id}</div>
                                <div className="step-text"><b>{s.title}</b></div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="form-card" style={step === 6 ? { gridColumn: '1 / -1', maxWidth: 700, margin: '0 auto' } : {}}>
                    {step === 6 ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width:100, height:100, background: '#FFF5F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                                <CheckCircle2 size={48} style={{ color: '#F58220' }} />
                            </div>
                            <h1>Candidatura Enviada</h1>
                            <p>Recebemos o seu registo institucional. A sua referência é <b>{ref}</b>. Verifique o seu email para mais detalhes.</p>
                            <Link href="/portal" className="btn-next" style={{ margin: '40px auto 0' }}>
                                Ir para o Portal <ArrowRight size={20} />
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={submit}>
                            <div className="form-head">
                                <h1>{STEPS[step-1].title}</h1>
                                <p>Preencha os dados com rigor para o processo institucional.</p>
                            </div>

                            {step === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {programs.map(p => (
                                        <label key={p.id} className={`radio-choice ${data.program_code === p.code ? 'selected' : ''}`}>
                                            <input type="radio" value={p.code} checked={data.program_code === p.code} onChange={e => setData('program_code', e.target.value)} style={{ width:20, height:20, accentColor: '#F58220' }} />
                                            <div><b>{p.name}</b><span style={{ fontSize:14, color:'#6B7280' }}>{p.descricao}</span></div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {step === 2 && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                                        <label>Nome Completo</label>
                                        <input value={data.nome} onChange={e => setData('nome', e.target.value.toUpperCase())} placeholder="COMO NO BILHETE DE IDENTIDADE" />
                                    </div>
                                    <div className="field">
                                        <label>Email Pessoal / Académico</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="exemplo@email.ao" />
                                    </div>
                                    <div className="field">
                                        <label>Telemóvel</label>
                                        <input value={data.tel} onChange={e => setData('tel', e.target.value)} placeholder="+244..." />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                    <div className="field">
                                        <label>Género</label>
                                        <select value={data.genero} onChange={e => setData('genero', e.target.value)}>
                                            <option value="">Seleccionar</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Feminino</option>
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label>BI / Nº Identificação</label>
                                        <input value={data.bi} onChange={e => setData('bi', e.target.value)} placeholder="000000000LA000" />
                                    </div>
                                    <div className="field">
                                        <label>Data de Nascimento</label>
                                        <input type="date" value={data.dob} onChange={e => setData('dob', e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label>Província</label>
                                        <select value={data.provincia} onChange={e => setData('provincia', e.target.value)}>
                                            <option value="">Seleccionar província</option>
                                            {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                                        <label>Morada</label>
                                        <input value={data.morada} onChange={e => setData('morada', e.target.value)} placeholder="Rua, bairro, município" />
                                    </div>
                                    <div className="field">
                                        <label>Grau Académico</label>
                                        <select value={data.grau} onChange={e => setData('grau', e.target.value)}>
                                            <option value="">Seleccionar</option>
                                            <option value="licenciatura">Licenciatura</option>
                                            <option value="mestrado">Mestrado</option>
                                            <option value="doutoramento">Doutoramento</option>
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label>Universidade</label>
                                        <input value={data.uni} onChange={e => setData('uni', e.target.value)} placeholder="Nome da instituição" />
                                    </div>
                                    <div className="field">
                                        <label>Curso</label>
                                        <input value={data.curso} onChange={e => setData('curso', e.target.value)} placeholder="Ex: Engenharia Informática" />
                                    </div>
                                    <div className="field">
                                        <label>Ano de Conclusão</label>
                                        <input type="number" min="1990" max="2030" value={data.anoFim} onChange={e => setData('anoFim', e.target.value)} placeholder="2024" />
                                    </div>
                                    <div className="field">
                                        <label>Média</label>
                                        <input type="number" min="0" max="20" step="0.1" value={data.media} onChange={e => setData('media', e.target.value)} placeholder="15.0" />
                                    </div>
                                    <div className="field">
                                        <label>Nível de Inglês</label>
                                        <select value={data.ingles} onChange={e => setData('ingles', e.target.value)}>
                                            <option value="">Seleccionar</option>
                                            <option value="basico">Básico</option>
                                            <option value="intermediario">Intermediário</option>
                                            <option value="avancado">Avançado</option>
                                            <option value="nativo">Nativo</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div>
                                    <div className="field">
                                        <label>Carta de Motivação</label>
                                        <textarea
                                            value={data.motivacao}
                                            onChange={e => setData('motivacao', e.target.value)}
                                            placeholder="Escreva a sua carta de motivação aqui. Explique porque deseja participar neste programa e quais são os seus objectivos..."
                                            rows={10}
                                        />
                                    </div>
                                    <div className="field">
                                        <div className="checkbox-row">
                                            <input
                                                type="checkbox"
                                                id="rgpd"
                                                checked={data.rgpd}
                                                onChange={e => setData('rgpd', e.target.checked)}
                                            />
                                            <span>
                                                Autorizo o tratamento dos meus dados pessoais nos termos da Lei de Protecção de Dados Pessoais de Angola (Lei n.º 22/11) e do RGPD. Os dados serão utilizados exclusivamente para fins de selecção e gestão do programa.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div>
                                    <div className="summary-grid">
                                        <div className="summary-item">
                                            <label>Programa</label>
                                            <p>{selectedProgram?.name || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Nome</label>
                                            <p>{data.nome || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Email</label>
                                            <p>{data.email || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Telemóvel</label>
                                            <p>{data.tel || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Género</label>
                                            <p>{data.genero === 'M' ? 'Masculino' : data.genero === 'F' ? 'Feminino' : '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>BI / Identificação</label>
                                            <p>{data.bi || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Data de Nascimento</label>
                                            <p>{data.dob || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Província</label>
                                            <p>{data.provincia || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Morada</label>
                                            <p>{data.morada || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Grau Académico</label>
                                            <p>{data.grau ? data.grau.charAt(0).toUpperCase() + data.grau.slice(1) : '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Universidade</label>
                                            <p>{data.uni || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Curso</label>
                                            <p>{data.curso || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Ano de Conclusão</label>
                                            <p>{data.anoFim || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Média</label>
                                            <p>{data.media || '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>Nível de Inglês</label>
                                            <p>{data.ingles ? data.ingles.charAt(0).toUpperCase() + data.ingles.slice(1) : '—'}</p>
                                        </div>
                                        <div className="summary-item">
                                            <label>RGPD</label>
                                            <p>{data.rgpd ? 'Autorizado' : 'Não autorizado'}</p>
                                        </div>
                                        <div className="summary-item full">
                                            <label>Carta de Motivação</label>
                                            <p>{data.motivacao || '—'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="footer-nav">
                                <button type="button" className="btn-back" onClick={prev} style={step === 1 ? { visibility: 'hidden' } : {}}>
                                    <ArrowLeft size={18} /> Anterior
                                </button>
                                {step < 5 ? (
                                    <button type="button" className="btn-next" onClick={next} disabled={step === 1 && !data.program_code}>
                                        Próximo <ArrowRight size={20} />
                                    </button>
                                ) : (
                                    <button type="submit" className="btn-next" disabled={processing}>
                                        {processing ? 'A submeter...' : 'Submeter Candidatura'} <CheckCircle2 size={20} />
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
