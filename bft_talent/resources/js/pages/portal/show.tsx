import { Head, Link, router } from '@inertiajs/react';

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
    desc: 'Parabéns! Foste selecionado para o programa BFA Talento. A nossa equipa de RH entrará em contacto para os próximos passos.',
    bg: '#ECFDF5', border: '#10B981', dot: '#059669', textColor: '#065F46',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l3 3 5-5" />
      </svg>
    ),
  },
  pendente: {
    label: 'Candidatura em Análise',
    desc: 'O teu processo está a ser avaliado. Poderemos solicitar informações adicionais ou convidar-te para provas técnicas brevemente.',
    bg: '#FFFBEB', border: '#F59E0B', dot: '#D97706', textColor: '#92400E',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  recusada: {
    label: 'Não Seleccionado',
    desc: 'Agradecemos o teu interesse. Nesta edição não foi possível avançar com a tua candidatura, mas convidamos-te a tentar novamente no futuro.',
    bg: '#FFF7F7', border: '#FCA5A5', dot: '#DC2626', textColor: '#991B1B',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

function fmt(iso: string) {
    return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function PortalShow({ application }: { application: Application }) {
    
    // Map current stages to legacy status types
    let statusKey = 'pendente';
    if (application.stage === 'integrado' || application.stage === 'oferta') statusKey = 'aprovada';
    if (application.stage === 'rejeitado' || application.stage === 'recusada') statusKey = 'recusada';
    
    const cfg = STATUS_CONFIG[statusKey];

    const logout = () => {
        router.post('/portal/logout'); // Adjust if route differs
    };

    return (
        <>
            <Head title={`Estado ${application.ref} — BFA Talento`} />
            
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #FAFAF9; color: #1A1A1A; font-family: Inter, system-ui, sans-serif; }
                .top { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #E7E5E1; }
                .top-inner { max-width: 1000px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 12px; }
                .pub-logo { width: 32px; height: 32px; background: #1A1A1A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border-radius: 5px; }
                .brand { font-weight: 700; font-size: 17px; text-decoration: none; color: #1A1A1A; display: flex; align-items: center; gap: 10px; }
                .logout-btn { margin-left: auto; background: none; border: 1px solid #E7E5E1; padding: 8px 14px; border-radius: 6px; font-size: 13px; color: #525252; cursor: pointer; }
                .logout-btn:hover { background: #F2F2F0; }
                
                .main { max-width: 700px; margin: 40px auto; padding: 0 20px 80px; }
                .status-card { border: 2px solid; border-radius: 14px; padding: 28px 32px; margin-bottom: 24px; display: flex; gap: 18px; align-items: flex-start; }
                .status-icon { flex-shrink: 0; width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .status-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
                .status-title { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 6px; }
                .status-desc { font-size: 14px; line-height: 1.6; }
                
                .card { background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; padding: 28px 32px; margin-bottom: 16px; }
                .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8A8A87; margin-bottom: 16px; }
                .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F2F2F0; font-size: 14px; }
                .row:last-child { border: none; }
                .row span { color: #525252; }
                .row b { color: #1A1A1A; font-weight: 500; }
                
                .ref-badge { display: inline-block; background: #F2F2F0; padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 14px; margin-bottom: 20px; }
                .ref-badge b { color: #FF7607; }
                
                @media (max-width: 600px) {
                  .status-card { flex-direction: column; padding: 22px; }
                }
            `}</style>

            <div className="top">
                <div className="top-inner">
                    <Link href="/" className="brand">
                        <div className="pub-logo">B</div>
                        BFA Talento
                    </Link>
                    <Link href="/portal" className="logout-btn">Sair</Link>
                </div>
            </div>

            <div className="main">
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                    Olá, {application.nome.split(' ')[0]}
                  </h1>
                  <p style={{ fontSize: 14, color: '#525252' }}>Acompanha aqui o progresso da tua candidatura.</p>
                </div>

                <div className="ref-badge">
                  Referência · <b>{application.ref}</b>
                </div>

                <div className="status-card" style={{ background: cfg.bg, borderColor: cfg.border }}>
                  <div className="status-icon" style={{ background: `${cfg.border}22` }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div className="status-label" style={{ color: cfg.dot }}>{cfg.label}</div>
                    <div className="status-title">
                        {statusKey === 'aprovada' ? 'Parabéns!' : statusKey === 'pendente' ? 'Em Avaliação' : 'Resultado Final'}
                    </div>
                    <div className="status-desc" style={{ color: cfg.textColor }}>{cfg.desc}</div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">Detalhes do Processo</div>
                  <div className="row"><span>Programa</span><b>{application.program}</b></div>
                  <div className="row"><span>Estado Actual</span><b>{application.stage_label}</b></div>
                  <div className="row"><span>Submetida em</span><b>{fmt(application.submitted_at)}</b></div>
                </div>

                <div className="card">
                  <div className="card-title">Calendário Estimado</div>
                  <div className="row"><span>Análise Inicial</span><b>Concluída</b></div>
                  <div className="row"><span>Provas Técnicas</span><b>Em curso</b></div>
                  <div className="row"><span>Resultado Final</span><b>Julho 2026</b></div>
                </div>

                {statusKey === 'recusada' && (
                  <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Link href="/candidatura" style={{ background: '#FF7607', color: '#fff', textDecoration: 'none', padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>Tentar novamente na próxima edição →</Link>
                  </div>
                )}
            </div>
        </>
    );
}
