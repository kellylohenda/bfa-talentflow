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
    Briefcase
} from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="BFA Talento — O teu percurso começa aqui" />
            
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #FFFFFF; color: #333333; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
                
                /* Layout BFA: Minimalista, Premium, Espaço Branco */
                .pub-top {
                  position: sticky; top: 0; z-index: 50;
                  background: #FFFFFF;
                  border-bottom: 1px solid #F0F0F0;
                  padding: 14px 0;
                }
                .pub-top-inner {
                  max-width: 1200px; margin: 0 auto;
                  padding: 0 32px;
                  display: flex; align-items: center; justify-content: space-between;
                }
                .pub-logo-img { height: 32px; width: auto; object-fit: contain; }
                .pub-nav { display: flex; gap: 32px; }
                .pub-nav a { font-size: 14px; color: #333333; text-decoration: none; font-weight: 500; transition: 0.2s; }
                .pub-nav a:hover { color: #F58220; }
                
                .pub-cta { 
                  display: inline-flex; align-items: center; gap: 8px; 
                  padding: 12px 24px; background: #F58220; color: #FFFFFF; 
                  border-radius: 10px; text-decoration: none; font-size: 14px; 
                  font-weight: 700; border: none; transition: 0.3s; cursor: pointer; 
                }
                .pub-cta:hover { background: #D96A0B; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245, 130, 32, 0.2); }
                .pub-cta-ghost { background: transparent; color: #333333; border: 1px solid #E5E5E5; }
                .pub-cta-ghost:hover { background: #F5F5F5; border-color: #D1D1D1; transform: none; box-shadow: none; }

                /* Hero Section */
                .hero { padding: 100px 32px; background: #FFFFFF; overflow: hidden; }
                .hero-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 80px; align-items: center; }
                .hero h1 { font-size: clamp(40px, 5.5vw, 68px); line-height: 1.1; letter-spacing: -0.03em; font-weight: 800; color: #333333; }
                .hero h1 em { font-style: normal; color: #F58220; }
                .hero p { margin-top: 24px; font-size: 20px; line-height: 1.6; color: #4A4A4A; max-width: 580px; }
                
                .hero-image-wrap { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
                .hero-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
                
                /* Seções Suaves em Cinza Claro */
                .bg-soft { background: #F5F5F5; padding: 100px 32px; }
                
                .numbers-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; text-align: center; }
                .num-item .big { font-size: 52px; font-weight: 800; color: #F58220; letter-spacing: -0.04em; }
                .num-item .lbl { font-size: 14px; color: #6B7280; margin-top: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

                /* Section Styles */
                .pub-section { padding: 120px 32px; background: #FFFFFF; }
                .pub-eyebrow { display: inline-block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #F58220; font-weight: 800; margin-bottom: 20px; }
                .pub-h2 { font-size: clamp(32px, 4vw, 48px); line-height: 1.15; letter-spacing: -0.02em; font-weight: 800; color: #333333; }
                
                /* BFA Cards: Rounded 18px, Soft Shadow */
                .prog-card { 
                  background: #FFFFFF; border: 1px solid #F0F0F0; 
                  border-radius: 18px; padding: 48px; 
                  transition: 0.3s; text-decoration: none; color: inherit; 
                  box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
                }
                .prog-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); border-color: #F58220; }
                .prog-card h3 { font-size: 24px; color: #333333; font-weight: 700; margin-bottom: 12px; }
                .prog-card .icon-wrap { width: 48px; height: 48px; background: #FFF5F0; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #F58220; margin-bottom: 24px; }
                
                /* Testimonial BFA Style */
                .t-card { 
                  max-width: 1200px; margin: 0 auto; 
                  display: grid; grid-template-columns: 1fr 1.2fr; gap: 0; 
                  background: #FFFFFF; border-radius: 18px; overflow: hidden; 
                  box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
                }
                .t-image { width: 100%; height: 600px; object-fit: cover; }
                .t-content { padding: 80px; display: flex; flex-direction: column; justify-content: center; background: #FFFFFF; }
                .t-content blockquote { font-size: 36px; font-weight: 700; line-height: 1.3; color: #333333; margin-bottom: 40px; position: relative; }
                .t-content blockquote::before { content: '“'; position: absolute; left: -40px; top: -10px; font-size: 80px; color: #F58220; opacity: 0.3; }

                /* Footer BFA Style */
                .footer { background: #FFFFFF; padding: 100px 32px 40px; border-top: 1px solid #F0F0F0; }
                .footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 80px; }
                .footer h5 { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #333333; margin-bottom: 28px; }
                .footer ul { list-style: none; }
                .footer li { margin-bottom: 16px; font-size: 15px; }
                .footer a { color: #6B7280; text-decoration: none; transition: 0.2s; }
                .footer a:hover { color: #F58220; }
            `}</style>

            <div className="pub-top">
                <div className="pub-top-inner">
                    <Link href="/">
                        <img src="/images/logo-bfa.png" alt="BFA Logo" className="pub-logo-img" />
                    </Link>
                    <nav className="pub-nav">
                        <a href="#programas">Programas</a>
                        <a href="#impacto">Impacto</a>
                        <a href="#testemunho">Carreiras</a>
                    </nav>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Link href={portal().url} className="pub-cta pub-cta-ghost">
                           Consultar Estado
                        </Link>
                        <Link href={candidatura().url} className="pub-cta">
                            Candidatar-me <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            <section className="hero">
                <div className="hero-grid">
                    <div>
                        <span className="pub-eyebrow">Institucional BFA</span>
                        <h1>O seu <em>talento</em> move o futuro.</h1>
                        <p>O Programa BFA Talento identifica e potencia a próxima geração de líderes da banca nacional através de uma experiência de excelência profissional.</p>
                        <div style={{ marginTop: 48, display: 'flex', gap: 20 }}>
                            <Link href={candidatura().url} className="pub-cta" style={{ padding: '16px 32px', fontSize: 16 }}>
                                Iniciar Candidatura
                            </Link>
                            <a href="#programas" className="pub-cta pub-cta-ghost" style={{ padding: '16px 32px', fontSize: 16 }}>
                                Conhecer Programas
                            </a>
                        </div>
                    </div>
                    <div className="hero-image-wrap">
                        <img src="/images/hero-graduates.png" alt="Graduados BFA" />
                    </div>
                </div>
            </section>

            <section className="bg-soft">
                <div className="numbers-grid">
                    <div className="num-item">
                        <div className="big">Nº 1</div>
                        <div className="lbl">Banco Privado Nacional</div>
                    </div>
                    <div className="num-item">
                        <div className="big">+200</div>
                        <div className="lbl">Postos de Atendimento</div>
                    </div>
                    <div className="num-item">
                        <div className="big">+100</div>
                        <div className="lbl">Projectos Sociais Activos</div>
                    </div>
                    <div className="num-item">
                        <div className="big">99%</div>
                        <div className="lbl">ADN Angolano</div>
                    </div>
                </div>
            </section>

            <section className="pub-section" id="programas">
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <span className="pub-eyebrow">Oportunidades de Carreira</span>
                    <h2 className="pub-h2">Impacto real no seu percurso profissional e na sociedade.</h2>
                    
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:32, marginTop:80 }}>
                        <div className="prog-card">
                            <div className="icon-wrap"><GraduationCap size={24} /></div>
                            <h3>Futuro BFA (Trainees)</h3>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6B7280' }}>
                                O percurso para recém-licenciados com elevado potencial. Integre uma equipa de alto desempenho e desenvolva competências de liderança estratégica.
                            </p>
                        </div>
                        <div className="prog-card">
                            <div className="icon-wrap"><Heart size={24} /></div>
                            <h3>BFA Solidário</h3>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6B7280' }}>
                                Fundo social que apoia ONGs nas áreas da Saúde e Inclusão. Onde o capital financeiro se transforma em capital humano e esperança.
                            </p>
                        </div>
                        <div className="prog-card">
                            <div className="icon-wrap"><Globe size={24} /></div>
                            <h3>Fundo Social BFA</h3>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6B7280' }}>
                                O nosso compromisso com a educação nacional e a literacia financeira. Construindo as bases para um futuro próspero e consciente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-soft" id="testemunho">
                <div className="t-card">
                    <img src="/images/testimonial-lwini.png" alt="Lwini Capemba" className="t-image" />
                    <div className="t-content">
                        <span className="pub-eyebrow">A Nossa Experiência</span>
                        <blockquote>
                            "O BFA não me deu apenas um primeiro emprego, deu-me a visão de como a banca pode ser um motor de mudança para Angola."
                        </blockquote>
                        <cite style={{ fontStyle:'normal' }}>
                            <b style={{ color:'#333333', fontSize:20, display:'block', marginBottom:4 }}>Lwini Capemba</b>
                            <span style={{ color:'#6B7280', fontWeight:500 }}>Licenciada em Economia · Programa Futuro BFA</span>
                        </cite>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-grid">
                    <div>
                        <img src="/images/logo-bfa.png" alt="BFA Logo" style={{ height: 32, marginBottom: 32 }} />
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6B7280', maxWidth: 300 }}>
                            Instituição financeira de referência, focada na excelência do serviço e no desenvolvimento sustentável de Angola através do capital humano.
                        </p>
                    </div>
                    <div>
                        <h5>Navegação</h5>
                        <ul>
                            <li><a href="#programas">Programas</a></li>
                            <li><a href="#testemunho">Testemunhos</a></li>
                            <li><Link href={portal().url}>Acesso Candidato</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Redes Sociais</h5>
                        <ul>
                            <li><a href="https://linkedin.com/company/bfa">LinkedIn</a></li>
                            <li><a href="https://facebook.com/bfa">Facebook</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Institucional</h5>
                        <ul>
                            <li>Luanda, Angola</li>
                            <li>carreiras@bfa.ao</li>
                        </ul>
                    </div>
                </div>
                <div style={{ maxWidth: 1200, margin: '80px auto 0', paddingTop: 32, borderTop: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9CA3AF' }}>
                    <span>© {new Date().getFullYear()} Banco de Fomento Angola. Todos os direitos reservados.</span>
                    <span>Conformidade APD · Lei 22/11</span>
                </div>
            </footer>
        </>
    );
}
