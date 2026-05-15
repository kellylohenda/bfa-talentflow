import { Head, Link } from '@inertiajs/react';
import { PublicLayout } from '@/components/public-layout';
import { candidatura } from '@/routes';

type Program = { id: number; code: string; name: string; descricao: string };

const PROGRAM_META: Record<string, { tag: string; items: string[] }> = {
    fbfa: {
        tag: 'Trainee · 24 meses',
        items: ['Subsídio mensal · Kz 380.000', 'Formação certificada (CFA, IFB)', 'Mentor sénior dedicado', 'Garantia de contrato · 87% admitidos'],
    },
    bif: {
        tag: 'Bolsa · até 5 anos',
        items: ['Propina + alojamento + subsistência', 'Universidades top: Nova SBE, HEC, LSE', 'Cláusula de retorno · 5 anos no BFA', 'Visitas trimestrais a Luanda'],
    },
    bnac: {
        tag: 'Bolsa · até 4 anos',
        items: ['Propina + subsídio mensal · Kz 220.000', 'UAN, UCAN, ULA e parceiras provinciais', 'Estágio anual obrigatório no BFA', 'Acompanhamento académico contínuo'],
    },
    mest: {
        tag: 'Bolsa · até 3 anos',
        items: ['Propina + subsídio de vida', 'Mestrados estratégicos patrocinados', 'Projeto de investigação aplicada', 'Integração directa na Direcção'],
    },
    lid: {
        tag: 'Liderança · 18 meses',
        items: ['MBA executivo patrocinado', 'Job-shadowing com Direcção', 'Projecto estratégico real', 'Promoção garantida no fim'],
    },
};

const PROCESS = [
    { num: '01 · ATÉ 30 JUN', title: 'Candidatura online', desc: 'Preenche o formulário, anexa o CV e o histórico académico. Demora cerca de 15 minutos.' },
    { num: '02 · JUL', title: 'Avaliação técnica', desc: 'Provas online de raciocínio quantitativo, lógica e inglês. Resultado em 7 dias.' },
    { num: '03 · AGO', title: 'Assessment Day', desc: 'Dia presencial na sede do BFA com dinâmicas de grupo, business case e entrevistas.' },
    { num: '04 · SET', title: 'Resultado & Onboarding', desc: 'Comunicação formal, assinatura de contrato e arranque do programa em Outubro.' },
];

const FAQS = [
    { q: 'Quem pode candidatar-se?', a: 'Cidadãos angolanos com licenciatura concluída ou em fase final, idade até 28 anos para o Futuro BFA, e até 32 anos para a Bolsa Internacional.' },
    { q: 'A candidatura tem custo?', a: 'Não. Todo o processo de candidatura é gratuito, incluindo as provas online e o Assessment Day presencial.' },
    { q: 'Posso candidatar-me a mais que um programa?', a: 'Sim, podes indicar até dois programas por ordem de preferência no mesmo formulário.' },
    { q: 'O que cobre a Bolsa Internacional?', a: 'Propinas integrais, subsídio mensal de subsistência, alojamento, viagens anuais a Luanda e seguro de saúde internacional.' },
    { q: 'Há vagas para estudantes das províncias?', a: 'Sim. A Bolsa Nacional reserva 30% das vagas para estudantes em universidades fora de Luanda.' },
    { q: 'Como são protegidos os meus dados pessoais?', a: 'Cumprimos integralmente a Lei 22/11 da APD. Tens direito a aceder, corrigir ou solicitar a eliminação dos teus dados.' },
];

export default function Welcome({ programs }: { programs: Program[] }) {
    return (
        <PublicLayout>
            <Head title="BFA Talento — Programas de Desenvolvimento" />

            {/* Hero */}
            <section style={{ background: '#fff', borderBottom: '1px solid #E7E5E1', padding: '80px 32px 72px' }}>
                <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FFF0E5', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#FF7607', marginBottom: 24 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7607', display: 'inline-block' }} />
                        Candidaturas abertas · Edição 2026
                    </div>
                    <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20, color: '#1A1A1A' }}>
                        O talento angolano<br />
                        <span style={{ color: '#FF7607' }}>começa aqui.</span>
                    </h1>
                    <p style={{ fontSize: 18, color: '#525252', lineHeight: 1.6, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
                        O BFA investe em pessoas. Trainees, bolseiros, líderes em formação — há um programa para cada ambição.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href={candidatura()} style={{ background: '#FF7607', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', transition: 'background 120ms' }}>
                            Candidatar-me agora
                        </Link>
                        <a href="#programas" style={{ background: '#F2F2F0', color: '#1A1A1A', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, textDecoration: 'none' }}>
                            Ver programas ↓
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section style={{ background: '#1A1A1A', padding: '40px 32px' }}>
                <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
                    {[
                        { n: '87%', label: 'taxa de contratação Futuro BFA' },
                        { n: '400+', label: 'talentos formados desde 2018' },
                        { n: '12', label: 'universidades parceiras' },
                        { n: '5', label: 'programas activos em 2026' },
                    ].map((s, i) => (
                        <div key={i} style={{ padding: '16px 32px', borderRight: i < 3 ? '1px solid #2D2D2C' : undefined, textAlign: 'center' }}>
                            <div style={{ fontSize: 36, fontWeight: 800, color: '#FF7607', letterSpacing: '-0.03em' }}>{s.n}</div>
                            <div style={{ fontSize: 13, color: '#807E78', marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Programs */}
            <section id="programas" style={{ padding: '80px 32px', background: '#FAFAF9' }}>
                <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: '#1A1A1A' }}>Programas</h2>
                    <p style={{ fontSize: 15, color: '#525252', marginBottom: 40 }}>Escolhe o percurso que se adapta à tua fase de carreira.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                        {programs.map((p) => {
                            const meta = PROGRAM_META[p.code] ?? { tag: 'Programa', items: [] };
                            return (
                                <div key={p.id} style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 14, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FF7607', marginBottom: 10 }}>{meta.tag}</div>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 8, color: '#1A1A1A' }}>{p.name}</h3>
                                    <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.55, marginBottom: 20 }}>{p.descricao}</p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {meta.items.map((item, i) => (
                                            <li key={i} style={{ fontSize: 13, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: '#FF7607', fontWeight: 700 }}>✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href={`${candidatura()}?program=${p.code}`} style={{ marginTop: 'auto', display: 'block', textAlign: 'center', background: '#F2F2F0', color: '#1A1A1A', fontWeight: 600, fontSize: 13, padding: '10px', borderRadius: 8, textDecoration: 'none' }}>
                                        Candidatar a {p.name} →
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section style={{ padding: '80px 32px', background: '#fff', borderTop: '1px solid #E7E5E1' }}>
                <div style={{ maxWidth: 960, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: '#1A1A1A' }}>Como funciona</h2>
                    <p style={{ fontSize: 15, color: '#525252', marginBottom: 48 }}>Do formulário ao primeiro dia — quatro etapas simples.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
                        {PROCESS.map((step, i) => (
                            <div key={i}>
                                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#FF7607', marginBottom: 12 }}>{step.num}</div>
                                <div style={{ width: 32, height: 2, background: '#FF7607', marginBottom: 16, borderRadius: 1 }} />
                                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{step.title}</h4>
                                <p style={{ fontSize: 13, color: '#525252', lineHeight: 1.55 }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: '80px 32px', background: '#FAFAF9', borderTop: '1px solid #E7E5E1' }}>
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: '#1A1A1A' }}>Perguntas frequentes</h2>
                    <p style={{ fontSize: 15, color: '#525252', marginBottom: 40 }}>Tudo o que precisas de saber antes de te candidatares.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {FAQS.map((faq, i) => (
                            <div key={i} style={{ borderTop: '1px solid #E7E5E1', padding: '24px 0' }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>{faq.q}</div>
                                <div style={{ fontSize: 14, color: '#525252', lineHeight: 1.6 }}>{faq.a}</div>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid #E7E5E1' }} />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '80px 32px', background: '#1A1A1A', textAlign: 'center' }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16 }}>Pronto para começar?</h2>
                    <p style={{ fontSize: 16, color: '#807E78', marginBottom: 36, lineHeight: 1.6 }}>As candidaturas encerram a 30 de Junho. Não deixes para amanhã.</p>
                    <Link href={candidatura()} style={{ background: '#FF7607', color: '#fff', fontWeight: 700, fontSize: 16, padding: '16px 36px', borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>
                        Candidatar-me agora →
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
