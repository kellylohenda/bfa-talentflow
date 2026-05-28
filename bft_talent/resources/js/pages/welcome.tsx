import { Head, Link } from '@inertiajs/react';
import { candidatura, portal } from '@/routes';
import { 
    GraduationCap, 
    Heart, 
    Globe, 
    CheckCircle2, 
    ArrowRight, 
    Users2, 
    BadgeCheck, 
    ShieldCheck, 
    ChevronRight,
    Search,
    UserCircle,
    Calendar,
    Briefcase,
    Milestone
} from 'lucide-react';

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
                
                /* Layout Original / Antigo */
                .pub-top {
                  position: sticky; top: 0; z-index: 50;
                  background: rgba(255,255,255,0.98);
                  backdrop-filter: blur(8px);
                  border-bottom: 1px solid #E7E5E1;
                }
                .pub-top-inner {
                  max-width: 1240px; margin: 0 auto;
                  padding: 12px 32px;
                  display: flex; align-items: center; gap: 32px;
                }
                .pub-logo-img { height: 38px; width: auto; object-fit: contain; }
                .pub-nav { display: flex; gap: 4px; margin-left: auto; margin-right: 16px; }
                .pub-nav a { padding: 8px 14px; font-size: 14px; color: #4A4A4A; text-decoration: none; border-radius: 6px; font-weight: 600; }
                .pub-nav a:hover { color: var(--primary); }
                
                .pub-cta { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--brand-navy); color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; border: none; transition: 150ms; cursor: pointer; }
                .pub-cta:hover { background: #1D194A; transform: translateY(-1px); }
                .pub-cta-primary { background: var(--primary); }
                .pub-cta-primary:hover { background: #D95700; }

                /* Hero Original Claro */
                .hero { position: relative; padding: 80px 32px 100px; background: #fff; overflow: hidden; }
                .hero-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
                .hero h1 { font-size: clamp(40px, 5.5vw, 76px); line-height: 1.05; letter-spacing: -0.04em; font-weight: 800; color: var(--brand-navy); }
                .hero h1 em { font-style: normal; color: var(--primary); }
                .hero p { margin-top: 24px; font-size: 19px; line-height: 1.6; color: #525252; max-width: 520px; }
                
                /* Foto do Hero */
                .hero-image-wrap { position: relative; width: 100%; aspect-ratio: 1/1; border-radius: 24px; overflow: hidden; box-shadow: 0 32px 64px rgba(0,0,0,0.12); }
                .hero-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
                
                /* SECÇÃO MARINHO (Substitui o Preto) */
                .navy-section { background: var(--brand-navy); color: #fff; padding: 80px 32px; }
                .navy-section .pub-h2 { color: #fff; }
                .navy-section .pub-eyebrow { color: var(--primary); }
                
                .numbers-grid { maxWidth: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 40px; }
                .num-item .big { font-size: 48px; font-weight: 800; color: var(--primary); letter-spacing: -0.03em; }
                .num-item .lbl { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; font-weight: 600; text-transform: uppercase; }

                .pub-section { padding: 90px 32px; }
                .pub-eyebrow { display:inline-block; font-size:12px; text-transform:uppercase; letter-spacing:0.12em; color:var(--primary); font-weight:800; margin-bottom:16px; }
                .pub-h2 { font-size:clamp(32px,3.8vw,48px); line-height:1.1; letter-spacing:-0.03em; font-weight:800; color: var(--brand-navy); }
                
                .prog-card { border:1px solid #E7E5E1; border-radius:16px; padding:32px; background:#fff; transition: 200ms; text-decoration: none; color: inherit; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                .prog-card:hover { border-color: var(--primary); transform: translateY(-4px); }
                .prog-card h3 { font-size: 22px; color: var(--brand-navy); font-weight: 700; margin-bottom: 8px; }
                
                /* Foto do Testemunho Real */
                .t-card { display: grid; grid-template-columns: 1fr 1.2fr; gap: 0; background: var(--brand-navy); border-radius: 24px; overflow: hidden; min-height: 500px; box-shadow: 0 32px 64px rgba(0,0,0,0.15); }
                .t-image { width: 100%; height: 100%; min-height: 500px; object-fit: cover; }
                .t-content { padding: 64px; display: flex; flex-direction: column; justify-content: center; }
                .t-content blockquote { font-size: 32px; font-weight: 600; line-height: 1.3; color: #fff; margin-bottom: 32px; font-style: italic; }
                
                .faq-item summary { list-style:none; padding:24px 0; font-size:18px; font-weight:700; cursor:pointer; color: var(--brand-navy); display: flex; justify-content: space-between; align-items: center; }
                .faq-item summary:hover { color: var(--primary); }
                
                .footer { background: #F8F8F7; padding: 80px 32px 40px; border-top: 1px solid #E7E5E1; color: #4A4A4A; }
                .footer-brand img { height: 44px; margin-bottom: 24px; }
                .footer h5 { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--brand-navy); margin-bottom: 24px; }
                .footer li { margin-bottom: 12px; font-size: 14px; font-weight: 500; }
                .footer a { color: #525252; text-decoration: none; transition: 150ms; }
                .footer a:hover { color: var(--primary); }
            `}</style>

            <div className="pub-top">
                <div className="pub-top-inner">
                    <Link href="/" className="pub-brand">
                        <img src="/images/logo-bfa.png" alt="BFA Logo" className="pub-logo-img" />
                    </Link>
                    <nav className="pub-nav">
                        <a href="#programas">Programas</a>
                        <a href="#processo">Recrutamento</a>
                        <a href="#testemunho">Impacto</a>
                        <a href="#faq">FAQ</a>
                    </nav>
                    <div style={{ display: 'flex', gap: 12, marginLeft: 'auto', alignItems: 'center' }}>
                        <Link href={portal().url} className="pub-cta" style={{ background: 'transparent', color: 'var(--brand-navy)', border: '1px solid #D1D1D1', fontSize: 13, boxShadow: 'none' }}>
                           <Search size={14} /> Consultar Estado
                        </Link>
                        <Link href={candidatura().url} className="pub-cta pub-cta-primary">
                            Candidatar-me <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            <section className="hero">
                <div className="hero-grid">
                    <div>
                        <span className="pub-eyebrow">Plataforma de Carreiras BFA</span>
                        <h1>Liderar agora o<br/><em>futuro</em> da banca.</h1>
                        <p>O BFA Talento identifica e potencia os melhores licenciados angolanos, integrando-os num ambiente de excelência e inovação.</p>
                        <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
                            <Link href={candidatura().url} className="pub-cta pub-cta-primary" style={{ padding: '16px 28px', fontSize: 16 }}>
                                Iniciar candidatura <ArrowRight size={20} />
                            </Link>
                            <a href="#programas" className="pub-cta" style={{ background: '#fff', color: 'var(--brand-navy)', border: '1px solid #D1D1D1' }}>
                                Ver programas
                            </a>
                        </div>
                        <div style={{ marginTop: 56, display: 'flex', gap: 40 }}>
                             <div><b style={{ fontSize: 32, fontWeight: 800, color: 'var(--brand-navy)' }}>1,5k+</b><p style={{ fontSize: 12, color: '#8A8A87', fontWeight: 700, textTransform: 'uppercase' }}>Candidaturas/Ano</p></div>
                             <div><b style={{ fontSize: 32, fontWeight: 800, color: 'var(--brand-navy)' }}>100+</b><p style={{ fontSize: 12, color: '#8A8A87', fontWeight: 700, textTransform: 'uppercase' }}>Projectos Sociais</p></div>
                        </div>
                    </div>
                    <div className="hero-image-wrap">
                        <img src="/images/hero-graduates.png" alt="Graduados BFA" />
                    </div>
                </div>
            </section>

            {/* SECÇÃO ADN DE EXCELÊNCIA - EM AZUL MARINHO (SUBSTITUI PRETO) */}
            <section className="navy-section" id="adn">
                <div className="numbers-grid">
                    <div className="num-item">
                        <div className="big">Nº 1</div>
                        <div className="lbl">Banco Privado em Angola</div>
                    </div>
                    <div className="num-item">
                        <div className="big">+200</div>
                        <div className="lbl">Postos de Atendimento</div>
                    </div>
                    <div className="num-item">
                        <div className="big">Sona</div>
                        <div className="lbl">ADN Cultural Angolano</div>
                    </div>
                    <div className="num-item">
                        <div className="big">Digital</div>
                        <div className="lbl">Liderança em Inovação</div>
                    </div>
                </div>
            </section>

            <section className="pub-section" id="programas">
                <div style={{ maxWidth: 1180, margin: '0 auto' }}>
                    <span className="pub-eyebrow">Programas de Oportunidade</span>
                    <h2 className="pub-h2">Impacto Real na Carreira.</h2>
                    <p style={{ marginTop: 24, fontSize: 18, color: '#525252', maxWidth: 640 }}>
                        No BFA, oferecemos percursos estruturados para quem quer fazer a diferença no sector financeiro e na sociedade angolana.
                    </p>
                    <div className="programs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:24, marginTop:56 }}>
                        <div className="prog-card">
                            <GraduationCap size={32} className="text-orange-500 mb-6" />
                            <h3>Futuro BFA (Trainees)</h3>
                            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#525252' }}>Programa de recrutamento para recém-licenciados com elevado potencial de liderança.</p>
                            <Link href={candidatura().url} style={{ marginTop: 20, display:'inline-flex', alignItems:'center', gap:8, color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>
                                Saber mais <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="prog-card">
                            <Heart size={32} className="text-orange-500 mb-6" />
                            <h3>BFA Solidário</h3>
                            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#525252' }}>Iniciativa de apoio a ONGs nas áreas da Saúde e Inclusão Social em todo o país.</p>
                            <Link href="/impacto" style={{ marginTop: 20, display:'inline-flex', alignItems:'center', gap:8, color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>
                                Ver impacto <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="prog-card">
                            <Globe size={32} className="text-orange-500 mb-6" />
                            <h3>Fundo Social BFA</h3>
                            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#525252' }}>Investimento em projectos de educação e literacia financeira para as comunidades.</p>
                             <Link href="/social" style={{ marginTop: 20, display:'inline-flex', alignItems:'center', gap:8, color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>
                                Descobrir <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECÇÃO RESPONSABILIDADE BFA - EM AZUL MARINHO (SUBSTITUI PRETO) */}
            <section className="navy-section" id="testemunho">
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div className="t-card">
                        <img src="/images/testimonial-lwini.png" alt="Lwini Capemba" className="t-image" />
                        <div className="t-content">
                            <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform:'uppercase', fontSize:12, letterSpacing:'0.1em', marginBottom:16, display:'block' }}>A Nossa Liderança</span>
                            <blockquote>
                                "O BFA deu-me a confiança de ser uma gestora activa ainda no início da minha carreira. É um banco que acredita nas pessoas."
                            </blockquote>
                            <cite style={{ fontStyle:'normal', color:'rgba(255,255,255,0.6)' }}>
                                <b style={{ color:'#fff', display:'block', fontSize:18 }}>Lwini Capemba</b>
                                Licenciada em Economia · Programa Futuro BFA
                            </cite>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pub-section" id="faq">
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <span className="pub-eyebrow" style={{ textAlign: 'center', display: 'block' }}>Perguntas Frequentes</span>
                    <h2 className="pub-h2" style={{ textAlign: 'center' }}>Tudo o que precisa de saber.</h2>
                    <div style={{ marginTop: 48 }}>
                        <details className="faq-item" style={{ borderBottom: '1px solid #F1F1F0' }}>
                            <summary>Quem se pode candidatar ao Futuro BFA? <ArrowRight size={16} /></summary>
                            <p style={{ paddingBottom: 24, fontSize: 15, color: '#525252', lineHeight: 1.6 }}>Jovens angolanos finalistas ou recém-licenciados em Economia, Gestão, Engenharia, Direito ou Informática, com média igual ou superior a 14 valores.</p>
                        </details>
                        <details className="faq-item" style={{ borderBottom: '1px solid #F1F1F0' }}>
                            <summary>O BFA oferece bolsas externas ao público? <ArrowRight size={16} /></summary>
                            <p style={{ paddingBottom: 24, fontSize: 15, color: '#525252', lineHeight: 1.6 }}>O BFA privilegia o investimento social corporativo e o fortalecimento das instituições nacionais. Actualmente, o foco é o programa de formação integrada Futuro BFA.</p>
                        </details>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 64 }}>
                    <div>
                        <div className="footer-brand">
                             <img src="/images/logo-bfa.png" alt="BFA Logo" />
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#666', maxWidth: 300 }}>
                            Instituição de referência no mercado financeiro angolano, focada no desenvolvimento e na excelência de talentos.
                        </p>
                    </div>
                    <div>
                        <h5>Plataforma</h5>
                        <ul style={{ listStyle:'none' }}>
                            <li><a href="#programas">Programas</a></li>
                            <li><a href="#processo">Recrutamento</a></li>
                            <li><Link href={portal().url}>Acesso Candidato</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Social</h5>
                        <ul style={{ listStyle:'none' }}>
                            <li><a href="https://linkedin.com/company/bfa">LinkedIn</a></li>
                            <li><a href="https://facebook.com/bfa">Facebook</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Institucional</h5>
                        <ul style={{ listStyle:'none' }}>
                            <li>Luanda, Angola</li>
                            <li>carreiras@bfa.ao</li>
                        </ul>
                    </div>
                </div>
                <div style={{ maxWidth: 1180, margin: '64px auto 0', paddingTop: 24, borderTop: '1px solid #E7E5E1', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8A8A87', fontWeight: 600 }}>
                    <span>© {new Date().getFullYear()} Banco de Fomento Angola. Todos os direitos reservados.</span>
                    <span>Conformidade APD · Lei 22/11</span>
                </div>
            </footer>
        </>
    );
}
