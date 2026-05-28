import { Head, Link } from '@inertiajs/react';
import { candidatura, portal } from '@/routes';

type Benefit = { text: string };
type Program = { id: number; code: string; name: string; descricao: string; tag: string; benefits: Benefit[] };
type Stat = { n: string; label: string };
type FaqItem = { question: string; answer: string };
type ProcessStep = { period: string; title: string; description: string };

type Props = {
    programs: Program[];
    stats: Stat[];
    faqs: FaqItem[];
    processSteps: ProcessStep[];
};

export default function Welcome({ programs, stats, faqs, processSteps }: Props) {
    return (
        <>
            <Head title="BFA Talento — O teu percurso começa aqui" />
            
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #fff; color: #1A1A1A; font-family: Inter, system-ui, sans-serif; }
                .pub-top {
                  position: sticky; top: 0; z-index: 50;
                  background: rgba(255,255,255,0.94);
                  backdrop-filter: blur(12px);
                  border-bottom: 1px solid #E7E5E1;
                }
                .pub-top-inner {
                  max-width: 1240px; margin: 0 auto;
                  padding: 16px 32px;
                  display: flex; align-items: center; gap: 32px;
                }
                .pub-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #1A1A1A; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
                .pub-logo { width: 32px; height: 32px; background: #1A1A1A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border-radius: 5px; }
                .pub-brand small { font-weight: 400; color: #8A8A87; font-size: 12px; }
                .pub-nav { display: flex; gap: 4px; margin-left: auto; margin-right: 8px; }
                .pub-nav a { padding: 8px 14px; font-size: 14px; color: #525252; text-decoration: none; border-radius: 6px; }
                .pub-nav a:hover { background: #F2F2F0; color: #1A1A1A; }
                .pub-cta { display: inline-flex; align-items: center; padding: 10px 18px; background: #1A1A1A; color: #fff; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; border: none; transition: background 120ms; cursor: pointer; }
                .pub-cta:hover { background: #FF7607; color: #fff; }
                .pub-cta-primary { background: #FF7607; }
                .pub-cta-primary:hover { background: #9C4500; }
                .hero { position: relative; padding: 96px 32px 120px; overflow: hidden; background: linear-gradient(180deg,#fff 0%,#FAFAF9 100%); }
                .hero-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1.15fr 1fr; gap: 64px; align-items: center; }
                .hero h1 { font-size: clamp(44px,6.2vw,84px); line-height: 0.98; letter-spacing: -0.04em; font-weight: 600; color: var(--text); }
                .hero h1 em { font-style: normal; color: #FF7607; }
                .hero p { margin-top: 28px; font-size: 19px; line-height: 1.55; color: #525252; max-width: 520px; }
                .hero-actions { margin-top: 40px; display: flex; gap: 12px; flex-wrap: wrap; }
                .hero-actions .pub-cta { padding: 14px 22px; font-size: 15px; }
                .hero-meta { margin-top: 56px; display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; max-width: 480px; }
                .hero-meta .num { font-size: 32px; font-weight: 600; letter-spacing: -0.02em; }
                .hero-meta .lbl { font-size: 12px; color: #8A8A87; margin-top: 4px; }
                .hero-collage { position: relative; aspect-ratio: 4/5; max-width: 460px; justify-self: end; }
                .hc-card { position: absolute; background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.06); overflow: hidden; }
                .hc-photo-1 { top:0; left:0; width:70%; height:60%; background: linear-gradient(135deg,#FFB870,#FF7607); display:flex; align-items:flex-end; padding:20px; }
                .hc-photo-2 { bottom:0; right:0; width:60%; height:50%; background: linear-gradient(135deg,#1A1A1A,#3A3A38); display:flex; align-items:flex-end; padding:20px; }
                .hc-card .label { color:#fff; font-size:13px; font-weight:500; position:relative; z-index:1; }
                .hc-stat { position:absolute; top:50%; left:-8%; background:#fff; padding:18px 22px; border-radius:10px; border:1px solid #E7E5E1; box-shadow:0 8px 24px rgba(0,0,0,0.08); }
                .hc-stat .num { font-size:28px; font-weight:600; color:#FF7607; letter-spacing:-0.02em; }
                .hc-stat .lbl { font-size:11px; color:#8A8A87; margin-top:2px; text-transform:uppercase; letter-spacing:0.06em; }
                .traj { position:absolute; top:0; right:-8%; width:60%; height:100%; opacity:0.5; pointer-events:none; }
                .numbers-strip { background:#1A1A1A; color:#fff; padding:48px 32px; }
                .numbers-grid { max-width:1180px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:48px; }
                .num-item .big { font-size:48px; font-weight:600; letter-spacing:-0.03em; color:#FF7607; }
                .num-item .lbl { font-size:13px; color:#B0AEA9; margin-top:4px; }
                .pub-section { padding:96px 32px; }
                .pub-container { max-width:1180px; margin:0 auto; }
                .pub-eyebrow { display:inline-block; font-size:12px; text-transform:uppercase; letter-spacing:0.12em; color:#FF7607; font-weight:600; margin-bottom:16px; }
                .pub-h2 { font-size:clamp(28px,3.5vw,44px); line-height:1.1; letter-spacing:-0.025em; font-weight:600; }
                .programs-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; margin-top:56px; }
                .prog-card { border:1px solid #E7E5E1; border-radius:12px; padding:32px; background:#fff; transition:border-color 120ms,transform 120ms; text-decoration: none; color: inherit; }
                .prog-card:hover { border-color:#FF7607; transform:translateY(-2px); }
                .prog-card .tag { display:inline-block; padding:4px 10px; background:#FFF0E5; color:#9C4500; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; border-radius:99px; margin-bottom:16px; }
                .prog-card h3 { font-size:22px; letter-spacing:-0.015em; margin-bottom:8px; font-weight:600; }
                .prog-card p { font-size:14px; color:#525252; line-height:1.55; margin-bottom:18px; }
                .prog-card ul { list-style:none; }
                .prog-card li { font-size:13px; color:#525252; padding:6px 0; display:flex; align-items:flex-start; gap:10px; }
                .prog-card li::before { content:''; flex-shrink:0; margin-top:7px; width:5px; height:5px; border-radius:50%; background:#FF7607; }
                .process-bg { background:#FAFAF9; }
                .process-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:56px; }
                .process-step .pnum { font-size:11px; color:#FF7607; font-weight:600; letter-spacing:0.1em; margin-bottom:12px; }
                .process-step h4 { font-size:17px; font-weight:600; margin-bottom:8px; letter-spacing:-0.01em; }
                .process-step p { font-size:13px; color:#525252; line-height:1.55; }
                .process-step .line { height:2px; background:#E7E5E1; margin-bottom:16px; position:relative; }
                .process-step .line::before { content:''; position:absolute; inset:0; width:30%; background:#FF7607; }
                .testimonial-section { background:#1A1A1A; color:#fff; padding:96px 32px; }
                .t-grid { max-width:1180px; margin:0 auto; display:grid; grid-template-columns:1fr 1.4fr; gap:64px; align-items:center; }
                .t-portrait { aspect-ratio:1; background:linear-gradient(135deg,#FFB870,#FF7607); border-radius:12px; position:relative; overflow:hidden; }
                .t-badge { position:absolute; bottom:24px; left:24px; background:rgba(0,0,0,0.5); backdrop-filter:blur(8px); padding:10px 14px; border-radius:8px; font-size:12px; color:#fff; }
                .t-badge b { display:block; font-size:14px; font-weight:600; margin-bottom:2px; }
                .testimonial-section blockquote { font-size:clamp(22px,2.6vw,32px); line-height:1.32; letter-spacing:-0.015em; color:#F0EFEC; font-weight:500; }
                .testimonial-section blockquote::before { content:'"'; display:block; font-size:80px; line-height:0.5; color:#FF7607; margin-bottom:24px; font-family:Georgia,serif; }
                .testimonial-section cite { display:block; margin-top:28px; font-style:normal; font-size:14px; color:#B0AEA9; }
                .testimonial-section cite b { color:#fff; font-weight:600; }
                .faq-list { margin-top:48px; border-top:1px solid #E7E5E1; }
                .faq-item { border-bottom:1px solid #E7E5E1; }
                .faq-item summary { list-style:none; padding:24px 0; font-size:17px; font-weight:500; cursor:pointer; display:flex; justify-content:space-between; align-items:center; color:#1A1A1A; }
                .faq-item summary:hover { color:#FF7607; }
                .faq-item summary::after { content:'+'; font-size:22px; font-weight:300; color:#8A8A87; flex-shrink:0; transition:transform 200ms; }
                .faq-item[open] summary::after { transform:rotate(45deg); }
                .faq-item p { padding-bottom:24px; font-size:14px; line-height:1.6; color:#525252; max-width:760px; }
                .cta-banner { background:#FF7607; color:#fff; text-align:center; padding:96px 32px; }
                .cta-banner h2 { font-size:clamp(36px,5vw,56px); font-weight:600; letter-spacing:-0.03em; line-height:1.05; max-width:800px; margin:0 auto; }
                .cta-banner p { margin-top:20px; font-size:18px; color:rgba(255,255,255,0.9); max-width:560px; margin-left:auto; margin-right:auto; }
                .cta-banner .pub-cta { margin-top:36px; background:#1A1A1A; font-size:16px; padding:16px 28px; }
                .cta-banner .pub-cta:hover { background:#fff; color:#FF7607; }
                .pub-footer { background:#1A1A1A; color:#B0AEA9; padding:64px 32px 32px; }
                .pub-footer-inner { max-width:1180px; margin:0 auto; display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; }
                .pub-footer h5 { font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:#fff; margin-bottom:16px; font-weight:600; }
                .pub-footer ul { list-style:none; display:flex; flex-direction:column; gap:10px; }
                .pub-footer a { color:#B0AEA9; text-decoration:none; font-size:14px; }
                .pub-footer a:hover { color:#fff; }
                .pub-footer-desc { margin-top:16px; font-size:13px; color:#6F6D69; max-width:300px; line-height:1.55; }
                .pub-footer-bottom { max-width:1180px; margin:48px auto 0; padding-top:24px; border-top:1px solid #2D2D2B; display:flex; justify-content:space-between; font-size:12px; }
                @media (max-width:900px) {
                  .hero-grid { grid-template-columns:1fr; }
                  .hero-collage { display:none; }
                  .numbers-grid { grid-template-columns:repeat(2,1fr); }
                  .programs-grid { grid-template-columns:1fr; }
                  .process-steps { grid-template-columns:repeat(2,1fr); }
                  .t-grid { grid-template-columns:1fr; }
                  .pub-footer-inner { grid-template-columns:1fr 1fr; gap:32px; }
                  .pub-top-inner { padding:14px 20px; gap:16px; }
                  .pub-nav { display:none; }
                }
                @media (max-width:480px) {
                  .hero { padding:64px 20px 80px; }
                  .pub-section { padding:64px 20px; }
                  .numbers-grid { grid-template-columns:1fr 1fr; gap:24px; }
                  .pub-footer-inner { grid-template-columns:1fr; }
                  .pub-footer-bottom { flex-direction:column; gap:8px; }
                  .cta-banner { padding:64px 20px; }
                  .process-steps { grid-template-columns:1fr; }
                }
            `}</style>

            <div className="pub-top">
                <div className="pub-top-inner">
                    <Link href="/" className="pub-brand">
                        <div className="pub-logo">B</div>
                        <div>BFA Talento <small>· {new Date().getFullYear()}</small></div>
                    </Link>
                    <nav className="pub-nav">
                        <a href="#programas">Programas</a>
                        <a href="#processo">Como funciona</a>
                        <a href="#testemunho">Testemunhos</a>
                        <a href="#faq">FAQ</a>
                    </nav>
                    <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
                        <Link href={portal().url} className="pub-cta" style={{ background: '#fff', color: '#525252', border: '1px solid #E7E5E1', fontSize: 13 }}>Consultar Estado →</Link>
                        <Link href={candidatura().url} className="pub-cta pub-cta-primary">Candidatar-me →</Link>
                    </div>
                </div>
            </div>

            <section className="hero">
                <svg className="traj" viewBox="0 0 600 800" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                        <linearGradient id="trajg" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FF7607" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#FF7607" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M-50 700 Q 200 400, 350 380 T 700 -50" stroke="url(#trajg)" strokeWidth="180" fill="none" strokeLinecap="round" />
                </svg>
                <div className="hero-grid">
                    <div>
                        <span className="pub-eyebrow">Candidaturas abertas · Edição {new Date().getFullYear()}</span>
                        <h1>O teu percurso<br/>começa <em>aqui.</em></h1>
                        <p>O Programa BFA Talento prepara a próxima geração de líderes da banca angolana com formação académica, mentoria sénior e experiência prática nas áreas mais estratégicas do banco.</p>
                        <div className="hero-actions">
                            <Link href={candidatura().url} className="pub-cta pub-cta-primary">Iniciar candidatura</Link>
                            <a href="#programas" className="pub-cta" style={{ background: '#fff', color: '#1A1A1A', border: '1px solid #E7E5E1' }}>Ver programas</a>
                        </div>
                        <div className="hero-meta">
                            {stats.slice(0,3).map(s => (
                                <div key={s.label}>
                                    <div className="num">{s.n}</div>
                                    <div className="lbl" style={{ textTransform: 'capitalize' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hero-collage">
                        <div className="hc-card hc-photo-1">
                            <svg viewBox="0 0 200 200" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}>
                                <circle cx="100" cy="80" r="38" fill="#fff" />
                                <path d="M40 200 Q 40 130, 100 130 Q 160 130, 160 200 Z" fill="#fff" />
                            </svg>
                            <span className="label">Lwini Capemba · Trainee Y1 · Investimento</span>
                        </div>
                        <div className="hc-card hc-photo-2">
                            <svg viewBox="0 0 200 200" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}>
                                <circle cx="100" cy="80" r="38" fill="#FF7607" />
                                <path d="M40 200 Q 40 130, 100 130 Q 160 130, 160 200 Z" fill="#FF7607" />
                            </svg>
                            <span className="label">Joaquim T. · Bolseiro Nova SBE · Lisboa</span>
                        </div>
                        <div className="hc-stat">
                            <div className="num">Kz 1,86 B</div>
                            <div className="lbl">Investidos em Formação</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="numbers-strip">
                <div className="numbers-grid">
                    {stats.map(s => (
                        <div key={s.label} className="num-item">
                            <div className="big">{s.n}</div>
                            <div className="lbl" style={{ textTransform: 'capitalize' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="pub-section" id="programas">
                <div className="pub-container">
                    <span className="pub-eyebrow">Caminhos de Sucesso</span>
                    <h2 className="pub-h2">Encontra o programa<br/>que se adequa a ti.</h2>
                    <p style={{ marginTop: 24, fontSize: 19, lineHeight: 1.55, color: '#525252', maxWidth: 640 }}>
                        Da licenciatura ao mestrado internacional, do trainee ao programa de liderança — temos um percurso para cada fase da tua carreira.
                    </p>
                    <div className="programs-grid">
                        {programs.map(p => (
                            <Link key={p.id} href={candidatura().url + `?program=${p.code}`} className="prog-card">
                                <span className="tag">{p.tag}</span>
                                <h3>{p.name}</h3>
                                <p>{p.descricao}</p>
                                <ul>
                                    {p.benefits.map((b, i) => <li key={i}>{b.text}</li>)}
                                </ul>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pub-section process-bg" id="processo">
                <div className="pub-container">
                    <span className="pub-eyebrow">Recrutamento</span>
                    <h2 className="pub-h2">Como funciona<br/>a candidatura.</h2>
                    <div className="process-steps">
                        {processSteps.map((s, i) => (
                            <div key={i} className="process-step">
                                <div className="line" />
                                <div className="pnum">{s.period}</div>
                                <h4>{s.title}</h4>
                                <p>{s.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="testimonial-section" id="testemunho">
                <div className="t-grid">
                    <div className="t-portrait">
                        <svg viewBox="0 0 400 400" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }}>
                            <circle cx="200" cy="160" r="78" fill="#fff" />
                            <path d="M70 400 Q 70 260, 200 260 Q 330 260, 330 400 Z" fill="#fff" />
                        </svg>
                        <div className="t-badge">
                            <b>Lwini Capemba</b>
                            Trainee Y1 · Investimento
                        </div>
                    </div>
                    <div>
                        <blockquote>
                            O que me surpreendeu não foi a formação técnica — foi a confiança que o BFA deposita em nós desde o primeiro dia.
                        </blockquote>
                        <cite><b>Lwini Capemba</b> · Licenciada em Economia · UAN</cite>
                    </div>
                </div>
            </section>

            <section className="pub-section" id="faq">
                <div className="pub-container">
                    <span className="pub-eyebrow">Perguntas frequentes</span>
                    <h2 className="pub-h2">Tudo o que precisas<br/>de saber.</h2>
                    <div className="faq-list">
                        {faqs.map((f, i) => (
                            <details key={i} className="faq-item">
                                <summary>{f.question}</summary>
                                <p>{f.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-banner">
                <h2>Estás pronto para começar?</h2>
                <p>Candidaturas para a próxima edição abertas. Prepara o teu futuro hoje.</p>
                <Link href={candidatura().url} className="pub-cta">Iniciar candidatura →</Link>
            </section>

            <footer className="pub-footer">
                <div className="pub-footer-inner">
                    <div>
                        <div className="pub-brand" style={{ color: '#fff' }}>
                            <div className="pub-logo" style={{ background: '#FF7607' }}>B</div>
                            <div>BFA Talento</div>
                        </div>
                        <p className="pub-footer-desc">Programa de Talento do Banco de Fomento Angola. Investir em pessoas é investir no futuro de Angola.</p>
                    </div>
                    <div>
                        <h5>Programas</h5>
                        <ul>
                            {programs.map(p => <li key={p.id}><Link href={candidatura().url + `?program=${p.code}`}>{p.name}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h5>Recursos</h5>
                        <ul>
                            <li><a href="#faq">FAQ</a></li>
                            <li><a href="#">Calendário</a></li>
                            <li><a href="#">Política de privacidade</a></li>
                            <li><Link href="/login">Área Reservada</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Contacto</h5>
                        <ul>
                            <li><a href="mailto:talento@bfa.ao">talento@bfa.ao</a></li>
                            <li>Sede BFA · Luanda</li>
                        </ul>
                    </div>
                </div>
                <div className="pub-footer-bottom">
                    <span>© {new Date().getFullYear()} Banco de Fomento Angola. Todos os direitos reservados.</span>
                    <span>Conformidade APD ✓ · Lei 22/11</span>
                </div>
            </footer>
        </>
    );
}
