import { Head, useForm, Link } from '@inertiajs/react';

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
                .pub-top { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #E7E5E1; }
                .pub-top-inner { max-width: 1240px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 32px; }
                .pub-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #1A1A1A; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
                .pub-logo { width: 32px; height: 32px; background: #1A1A1A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border-radius: 5px; }
                
                .main-wrap { min-height: calc(100vh - 65px); display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
                .login-card { background: #fff; border: 1px solid #E7E5E1; border-radius: 14px; padding: 40px; width: 100%; maxWidth: 440px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
                .login-icon { width: 56px; height: 56px; background: #FFF0E5; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: #FF7607; }
                .login-card h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; }
                .login-card p { font-size: 14px; color: #525252; margin-bottom: 32px; line-height: 1.6; }
                
                .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
                .field label { font-size: 12px; font-weight: 500; color: #525252; }
                .field input { padding: 12px 14px; border: 1px solid #E7E5E1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: all 120ms; }
                .field input:focus { border-color: #FF7607; box-shadow: 0 0 0 3px #FFF0E5; }
                .error-msg { color: #DC2626; font-size: 12px; margin-top: 4px; }
                
                .btn-login { width: 100%; background: #1A1A1A; color: #fff; border: none; padding: 13px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 120ms; margin-top: 8px; }
                .btn-login:hover { background: #FF7607; }
                .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
                
                .footer-meta { margin-top: 32px; text-align: center; font-size: 12px; color: #8A8A87; display: flex; align-items: center; gap: 8px; justify-content: center; }
                .cta-reg { text-align: center; margin-top: 24px; font-size: 13px; color: #525252; }
                .cta-reg a { color: #FF7607; text-decoration: none; font-weight: 600; }
            `}</style>

            <div className="pub-top">
                <div className="pub-top-inner">
                    <Link href="/" className="pub-brand">
                        <div className="pub-logo">B</div>
                        <div>BFA Talento</div>
                    </Link>
                </div>
            </div>

            <div className="main-wrap">
                <div className="login-card">
                    <div className="login-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                    <h1>Portal do Candidato</h1>
                    <p>Insere os dados da tua candidatura para acompanhar o estado e resultados do processo.</p>

                    <form onSubmit={submit}>
                        <div className="field">
                            <label>Referência da Candidatura</label>
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
                            <label>Email de Candidatura</label>
                            <input 
                                type="email" 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                placeholder="oseu@email.ao" 
                                required 
                            />
                            {errors.email && <div className="error-msg">{errors.email}</div>}
                        </div>

                        <button type="submit" className="btn-login" disabled={processing}>
                            {processing ? 'A verificar...' : 'Entrar no Portal →'}
                        </button>
                    </form>

                    <div className="footer-meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Conformidade APD · Lei 22/11
                    </div>
                    
                    <div className="cta-reg">
                        Ainda não se candidatou? <Link href="/candidatura">Candidatar agora</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
