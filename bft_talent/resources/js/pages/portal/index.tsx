import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PortalIndex() {
    const { data, setData, post, processing, errors } = useForm({
        ref: '',
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/portal');
    };

    return (
        <>
            <Head title="Portal do Candidato — BFA Talento" />
            
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #FAFAF9; color: #1A1A1A; font-family: Inter, system-ui, sans-serif; }
                
                .pub-top { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid #E7E5E1; }
                .pub-top-inner { max-width: 1240px; margin: 0 auto; padding: 12px 32px; display: flex; align-items: center; gap: 32px; }
                .pub-logo-img { height: 38px; width: auto; }
                
                .main-wrap { min-height: calc(100vh - 65px); display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
                .login-card { background: #fff; border: 1px solid #E7E5E1; border-radius: 16px; padding: 48px; width: 100%; maxWidth: 440px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
                .login-icon { width: 56px; height: 56px; background: #FFF9F5; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: var(--primary); }
                .login-card h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; color: var(--brand-navy); }
                .login-card p { font-size: 14px; color: #525252; margin-bottom: 32px; line-height: 1.6; font-weight: 500; }
                
                .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
                .field label { font-size: 12px; font-weight: 700; color: #525252; text-transform: uppercase; letter-spacing: 0.05em; }
                .field input { padding: 12px 14px; border: 1px solid #E7E5E1; border-radius: 10px; font-size: 15px; font-family: inherit; outline: none; transition: all 150ms; font-weight: 500; }
                .field input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(255, 102, 0, 0.1); }
                .error-msg { color: #DC2626; font-size: 12px; margin-top: 4px; font-weight: 700; }
                
                .btn-login { width: 100%; background: var(--brand-navy); color: #fff; border: none; padding: 14px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 150ms; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .btn-login:hover { background: #1D194A; transform: translateY(-1px); }
                .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
                
                .footer-meta { margin-top: 32px; text-align: center; font-size: 12px; color: #8A8A87; display: flex; align-items: center; font-weight: 700; gap: 8px; justify-content: center; text-transform: uppercase; letter-spacing: 0.05em; }
                .cta-reg { text-align: center; margin-top: 24px; font-size: 14px; color: #525252; font-weight: 500; }
                .cta-reg a { color: var(--primary); text-decoration: none; font-weight: 700; }
            `}</style>

            <div className="pub-top">
                <div className="pub-top-inner">
                    <Link href="/" className="pub-brand">
                        <img src="/images/logo-bfa.png" alt="BFA Logo" className="pub-logo-img" />
                    </Link>
                </div>
            </div>

            <div className="main-wrap">
                <div className="login-card">
                    <div className="login-icon">
                        <Lock size={24} />
                    </div>
                    <h1>Portal do Candidato</h1>
                    <p>Acompanhe o estado da sua candidatura e as próximas fases do programa de talentos BFA.</p>

                    <form onSubmit={submit}>
                        <div className="field">
                            <label>Referência de Candidatura</label>
                            <input 
                                type="text" 
                                value={data.ref} 
                                onChange={e => setData('ref', e.target.value.toUpperCase())} 
                                placeholder="BFA-2026-XXXX" 
                                required 
                            />
                            {errors.ref && <div className="error-msg">{errors.ref}</div>}
                        </div>
                        <div className="field">
                            <label>Email de Registo</label>
                            <input 
                                type="email" 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                placeholder="exemplo@email.ao" 
                                required 
                            />
                            {errors.email && <div className="error-msg">{errors.email}</div>}
                        </div>

                        <button type="submit" className="btn-login" disabled={processing}>
                            {processing ? 'A verificar...' : 'Entrar no Portal'}
                            {!processing && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <div className="footer-meta">
                        <ShieldCheck size={14} />
                        Conformidade APD · Lei 22/11
                    </div>
                    
                    <div className="cta-reg">
                        Ainda não se candidatou? <Link href="/candidatura">Iniciar Candidatura</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
