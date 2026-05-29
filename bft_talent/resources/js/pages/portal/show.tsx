import { Head, Link, router } from '@inertiajs/react';
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    LogOut, 
    Calendar, 
    Info, 
    ArrowRight 
} from 'lucide-react';

type Application = {
    ref: string;
    nome: string;
    email: string;
    program: string;
    stage: string;
    stage_label: string;
    submitted_at: string;
};

const CFG: Record<string, any> = {
  aprovada: {
    label: 'Aprovada',
    bg: '#E5F4EC', border: '#0E7C4A', text: '#065F46', icon: <CheckCircle2 size={24} />
  },
  pendente: {
    label: 'Em Análise',
    bg: '#FFF5F0', border: '#F58220', text: '#333333', icon: <Clock size={24} />
  },
  recusada: {
    label: 'Finalizada',
    bg: '#FCEAEA', border: '#B91C1C', text: '#991B1B', icon: <AlertCircle size={24} />
  },
};

export default function PortalShow({ application }: { application: Application }) {
    let sk = 'pendente';

    if (['integrado', 'oferta'].includes(application.stage)) {
sk = 'aprovada';
}

    if (['rejeitado', 'recusada'].includes(application.stage)) {
sk = 'recusada';
}

    const c = CFG[sk];

    return (
        <>
            <Head title={`Candidatura ${application.ref} — BFA Talento`} />
            
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #F5F5F5; color: #333333; font-family: 'Inter', system-ui, sans-serif; }
                
                .header { background: #FFFFFF; border-bottom: 1px solid #E5E5E5; padding: 16px 0; position: sticky; top: 0; z-index: 50; }
                .header-inner { max-width: 1000px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; }
                
                .main { max-width: 800px; margin: 60px auto; padding: 0 32px 100px; }
                
                .card { background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 18px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 24px; }
                .status-banner { border-radius: 14px; padding: 24px 32px; display: flex; gap: 20px; align-items: center; margin-bottom: 32px; border: 1px solid; }
                
                .label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #6B7280; margin-bottom: 8px; display: block; }
                .title { font-size: 28px; font-weight: 800; color: #333333; margin-bottom: 8px; letter-spacing: -0.02em; }
                
                .row { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #F5F5F5; font-size: 15px; }
                .row:last-child { border-bottom: none; }
                .row span { color: #6B7280; font-weight: 500; }
                .row b { color: #333333; font-weight: 700; }
                
                .logout-btn { background: #FFFFFF; border: 1px solid #E5E5E5; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #6B7280; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .logout-btn:hover { background: #F5F5F5; color: #F58220; border-color: #F58220; }
            `}</style>

            <div className="header">
                <div className="header-inner">
                    <Link href="/">
                        <img src="/images/logo-bfa.png" alt="BFA Logo" style={{ height: 32 }} />
                    </Link>
                    <Link href="/portal/logout" method="post" as="button" className="logout-btn">
                        <LogOut size={16} /> Sair do Portal
                    </Link>
                </div>
            </div>

            <div className="main">
                <div style={{ marginBottom: 40 }}>
                  <span className="label">Acesso Reservado</span>
                  <h1 className="title">Bem-vindo, {application.nome.split(' ')[0]}</h1>
                  <p style={{ color: '#6B7280', fontSize: 16, fontWeight: 500 }}>Acompanhe aqui o progresso institucional da sua candidatura.</p>
                </div>

                <div className="status-banner" style={{ background: c.bg, borderColor: c.border, color: c.text }}>
                    <div style={{ background: '#FFFFFF', padding: 12, borderRadius: 12, color: c.border, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        {c.icon}
                    </div>
                    <div>
                        <b style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Estado Actual</b>
                        <p style={{ fontSize: 18, fontWeight: 800 }}>{c.label} · {application.stage_label}</p>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #F5F5F5' }}>
                        <Info size={20} style={{ color: '#F58220' }} />
                        <b style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detalhes do Processo</b>
                    </div>
                    <div className="row"><span>Referência</span><b style={{ color: '#F58220' }}>{application.ref}</b></div>
                    <div className="row"><span>Programa</span><b>{application.program}</b></div>
                    <div className="row"><span>Data de Submissão</span><b>{new Date(application.submitted_at).toLocaleDateString()}</b></div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #F5F5F5' }}>
                        <Calendar size={20} style={{ color: '#F58220' }} />
                        <b style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Próximos Passos</b>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.6 }}>
                        O seu processo está a ser avaliado pela nossa equipa de recursos humanos. <br/>
                        <b>Aguarde por um contacto oficial via email ou telemóvel registrados.</b>
                    </p>
                </div>
            </div>
        </>
    );
}
