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

const STATUS_CONFIG: Record<string, any> = {
  aprovada: {
    label: 'Candidatura Aprovada',
    desc: 'Parabéns! Foste selecionado para o programa BFA Talento. Entraremos em contacto brevemente.',
    bg: '#E5F4EC', border: '#0E7C4A', dot: '#0E7C4A', textColor: '#065F46',
    icon: <CheckCircle2 size={28} />
  },
  pendente: {
    label: 'Candidatura em Análise',
    desc: 'O teu processo está a ser avaliado. Poderemos solicitar informações adicionais brevemente.',
    bg: '#FEF6E4', border: '#B45309', dot: '#B45309', textColor: '#92400E',
    icon: <Clock size={28} />
  },
  recusada: {
    label: 'Não Seleccionado',
    desc: 'Agradecemos o teu interesse. Convidamos-te a tentar novamente numa próxima edição.',
    bg: '#FCEAEA', border: '#B91C1C', dot: '#B91C1C', textColor: '#991B1B',
    icon: <AlertCircle size={28} />
  },
};

function fmt(iso: string) {
    return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function PortalShow({ application }: { application: Application }) {
    
    let statusKey = 'pendente';
    if (application.stage === 'integrado' || application.stage === 'oferta') statusKey = 'aprovada';
    if (application.stage === 'rejeitado' || application.stage === 'recusada') statusKey = 'recusada';
    
    const cfg = STATUS_CONFIG[statusKey];

    return (
        <>
            <Head title={`Estado ${application.ref} — BFA Talento`} />
            
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #FAFAF9; color: #1A1A1A; font-family: Inter, system-ui, sans-serif; }
                .top { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid #E7E5E1; }
                .top-inner { max-width: 1000px; margin: 0 auto; padding: 12px 32px; display: flex; align-items: center; gap: 12px; }
                .pub-logo-img { height: 38px; width: auto; }
                .brand { font-weight: 700; font-size: 17px; text-decoration: none; color: var(--brand-navy); display: flex; align-items: center; gap: 10px; }
                .logout-btn { margin-left: auto; background: none; border: 1px solid #E7E5E1; padding: 8px 14px; border-radius: 6px; font-size: 13px; color: #525252; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 700; }
                
                .main { max-width: 760px; margin: 40px auto; padding: 0 20px 80px; }
                .status-card { border: 2px solid; border-radius: 14px; padding: 28px 32px; margin-bottom: 24px; display: flex; gap: 18px; align-items: flex-start; }
                .status-icon { flex-shrink: 0; width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                .card { background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; padding: 28px 32px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
                .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #F2F2F0; font-size: 14px; }
                .row:last-child { border: none; }
                .row span { color: #525252; font-weight: 500; }
                .row b { color: var(--brand-navy); font-weight: 700; }
            `}</style>

            <div className="top">
                <div className="top-inner">
                    <Link href="/" className="brand">
                        <img src="/images/logo-bfa.png" alt="BFA Logo" className="pub-logo-img" />
                    </Link>
                    <Link href="/portal/logout" className="logout-btn" method="post" as="button">
                        <LogOut size={16} /> Sair
                    </Link>
                </div>
            </div>

            <div className="main">
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4, color: 'var(--brand-navy)' }}>
                    Olá, {application.nome.split(' ')[0]}
                  </h1>
                  <p style={{ fontSize: 14, color: '#525252', fontWeight: 500 }}>Acompanha o estado da tua candidatura institucional.</p>
                </div>

                <div style={{ marginBottom: 20, display:'inline-block', padding: '6px 14px', background: '#F2F2F0', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#525252' }}>
                  ID Candidatura: <span style={{ color: 'var(--primary)' }}>{application.ref}</span>
                </div>

                <div className="status-card" style={{ background: cfg.bg, borderColor: cfg.border }}>
                  <div className="status-icon" style={{ background: `${cfg.border}22`, color: cfg.border }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: cfg.dot, marginBottom: 4 }}>{cfg.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-navy)', marginBottom: 6 }}>{statusKey === 'aprovada' ? 'Resultado Final' : 'Fase do Processo'}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: cfg.textColor, fontWeight: 500 }}>{cfg.desc}</div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-navy)', marginBottom: 16, borderBottom: '1px solid #F2F2F0', paddingBottom: 10 }}>Resumo</div>
                  <div className="row"><span>Programa</span><b>{application.program}</b></div>
                  <div className="row"><span>Estado Actual</span><b>{application.stage_label}</b></div>
                  <div className="row"><span>Submetida em</span><b>{fmt(application.submitted_at)}</b></div>
                </div>
            </div>
        </>
    );
}
