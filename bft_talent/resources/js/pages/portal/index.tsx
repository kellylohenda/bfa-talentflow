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
            <Head title="Acesso ao Portal — BFA Talento" />
            
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #F5F5F5; color: #333333; font-family: 'Inter', system-ui, sans-serif; }
                
                .login-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 32px; }
                .login-card { 
                  background: #FFFFFF; border: 1px solid #E5E5E5; 
                  border-radius: 18px; padding: 64px 56px; width: 100%; 
                  max-width: 480px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
                }
                
                .login-icon { width: 64px; height: 64px; background: #FFF5F0; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 32px; color: #F58220; }
                .login-card h1 { font-size: 32px; font-weight: 800; color: #333333; margin-bottom: 12px; letter-spacing: -0.02em; }
                .login-card p { font-size: 16px; color: #6B7280; margin-bottom: 40px; line-height: 1.6; font-weight: 500; }
                
                .field { margin-bottom: 24px; }
                .field label { font-size: 12px; font-weight: 800; color: #333333; display: block; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
                .field input { padding: 14px 18px; border: 1px solid #E5E5E5; border-radius: 10px; font-size: 16px; width: 100%; transition: 0.2s; font-weight: 500; font-family: inherit; }
                .field input:focus { border-color: #F58220; outline: none; box-shadow: 0 0 0 4px rgba(245, 130, 32, 0.1); }
                .err { color: #D62D20; font-size: 12px; margin-top: 8px; font-weight: 700; }
                
                .btn-enter { width: 100%; background: #F58220; color: #FFFFFF; border: none; padding: 16px; border-radius: 12px; font-size: 16px; font-weight: 800; cursor: pointer; transition: 0.3s; margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 12px; }
                .btn-enter:hover { background: #D96A0B; transform: translateY(-1px); }
                .btn-enter:disabled { opacity: 0.5; cursor: not-allowed; }
                
                .meta-footer { margin-top: 48px; border-top: 1px solid #F5F5F5; pt-24; display: flex; align-items: center; justify-content: center; gap: 12px; color: #9CA3AF; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
            `}</style>

            <div className="login-shell">
                <div className="login-card">
                    <div className="flex justify-center mb-10">
                        <Link href="/">
                            <img src="/images/logo-bfa.png" alt="BFA Logo" style={{ height: 38 }} />
                        </Link>
                    </div>

                    <div className="login-icon mx-auto">
                        <Lock size={32} />
                    </div>
                    
                    <h1 className="text-center">Acesso ao Portal</h1>
                    <p className="text-center">Acompanhe hoje os passos que definem o seu amanhã no BFA.</p>

                    <form onSubmit={submit}>
                        <div className="field">
                            <label>Candidatura (Ref)</label>
                            <input 
                                value={data.ref} 
                                onChange={e => setData('ref', e.target.value.toUpperCase())} 
                                placeholder="BFA-2026-XXXX" 
                            />
                            {errors.ref && <div className="err">{errors.ref}</div>}
                        </div>
                        <div className="field">
                            <label>Email Institucional</label>
                            <input 
                                type="email"
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                placeholder="exemplo@email.ao" 
                            />
                            {errors.email && <div className="err">{errors.email}</div>}
                        </div>

                        <button type="submit" className="btn-enter" disabled={processing}>
                            {processing ? 'A processar...' : 'Entrar no Portal'}
                            {!processing && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="meta-footer pt-8">
                        <ShieldCheck size={16} /> Conformidade APD
                    </div>
                </div>
            </div>
        </>
    );
}
