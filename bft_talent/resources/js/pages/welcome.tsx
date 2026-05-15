import { Head, Link } from '@inertiajs/react';
import { PublicLayout } from '@/components/public-layout';
import { candidatura } from '@/routes';
import { useState, useEffect } from 'react';

type Benefit = { text: string };

type Program = { id: number; code: string; name: string; descricao: string; tag: string; benefits: Benefit[] };

type Stat = { n: string; label: string };

type FaqItem = { question: string; answer: string };

type ProcessStep = { period: string; title: string; description: string };

export default function Welcome({ programs, stats, faqs, processSteps }: { programs: Program[]; stats: Stat[]; faqs: FaqItem[]; processSteps: ProcessStep[] }) {
    const [width, setWidth] = useState(1200);
    const [isDark, setIsDark] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const handler = () => setWidth(window.innerWidth);
        handler();
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    useEffect(() => {
        const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        check();
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const processCols = width < 480 ? 1 : width < 768 ? 2 : 4;
    const statsCols = width < 480 ? 1 : width < 640 ? 2 : 4;
    const heroVertical = width < 480;
    const isSmall = width < 768;

    return (
        <PublicLayout>
            <Head title="BFA Talento — Programas de Desenvolvimento" />

            {/* Hero */}
            <section style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                padding: 'clamp(48px, 8vw, 80px) clamp(16px, 4vw, 32px)',
            }}>
                <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', width: '100%' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'var(--primary-soft)', borderRadius: 999,
                        padding: '6px 14px', fontSize: 12, fontWeight: 600,
                        color: 'var(--primary)', marginBottom: 24,
                        flexWrap: 'wrap', justifyContent: 'center',
                    }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: 'var(--primary)', display: 'inline-block',
                            flexShrink: 0,
                        }} />
                        Candidaturas abertas · Edição 2026
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 800,
                        letterSpacing: '-0.03em', lineHeight: 1.1,
                        marginBottom: 20, color: 'var(--text)',
                    }}>
                        O talento angolano<br />
                        <span style={{ color: 'var(--primary)' }}>começa aqui.</span>
                    </h1>
                    <p style={{
                        fontSize: 18, color: 'var(--text-2)', lineHeight: 1.6,
                        marginBottom: 36, maxWidth: 560, margin: '0 auto 36px',
                    }}>
                        O BFA investe em pessoas. Trainees, bolseiros, líderes em formação — há um programa para cada ambição.
                    </p>
                    <div style={{
                        display: 'flex', gap: 12, justifyContent: 'center',
                        flexWrap: 'wrap',
                        flexDirection: heroVertical ? 'column' : 'row',
                        alignItems: heroVertical ? 'stretch' : 'center',
                    }}>
                        <Link
                            href={candidatura().url}
                            style={{
                                background: 'var(--primary)', color: '#fff',
                                fontWeight: 700, fontSize: 15,
                                padding: '14px 28px', borderRadius: 10,
                                textDecoration: 'none', transition: 'background 120ms',
                                textAlign: 'center',
                            }}
                        >
                            Candidatar-me agora
                        </Link>
                        <a
                            href="#programas"
                            style={{
                                background: 'var(--surface-3)', color: 'var(--text)',
                                fontWeight: 600, fontSize: 15,
                                padding: '14px 28px', borderRadius: 10,
                                textDecoration: 'none', textAlign: 'center',
                            }}
                        >
                            Ver programas ↓
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section style={{
                padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 32px)',
                background: 'var(--bg)',
            }}>
                <div style={{
                    maxWidth: 1240, margin: '0 auto', borderRadius: 16,
                    background: isDark ? 'var(--surface)' : 'var(--primary-soft)',
                    display: 'flex',
                    flexDirection: isSmall ? 'row' : undefined,
                    overflowX: isSmall ? 'auto' : undefined,
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: isSmall ? 'x mandatory' : undefined,
                    gap: 0,
                    ...(isSmall ? {} : {
                        display: 'grid',
                        gridTemplateColumns: `repeat(4, 1fr)`,
                    }),
                }}>
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            style={{
                                padding: 'clamp(20px, 3vw, 32px)',
                                textAlign: 'center',
                                ...(isSmall ? {
                                    flexShrink: 0,
                                    minWidth: 200,
                                    scrollSnapAlign: 'start',
                                    borderRight: i < 3 ? '1px solid var(--border)' : undefined,
                                } : {
                                    borderRight: i % statsCols < statsCols - 1 ? '1px solid var(--border)' : undefined,
                                    borderBottom: i < 4 - statsCols ? '1px solid var(--border)' : undefined,
                                }),
                            }}
                        >
                            <div style={{
                                fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 800,
                                color: isDark ? 'var(--primary)' : 'var(--text)',
                                letterSpacing: '-0.03em',
                            }}>
                                {s.n}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: isDark ? 'var(--text-3)' : 'var(--text-2)',
                                marginTop: 4,
                            }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Programs */}
            <section id="programas" style={{
                padding: 'clamp(48px, 6vw, 80px) clamp(16px, 4vw, 32px)',
                background: 'var(--bg)',
            }}>
                <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800,
                        letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)',
                    }}>
                        Programas
                    </h2>
                    <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 40 }}>
                        Escolhe o percurso que se adapta à tua fase de carreira.
                    </p>
                    <div style={isSmall ? {
                        display: 'flex',
                        gap: 20,
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        scrollSnapType: 'x mandatory',
                        paddingBottom: 8,
                    } : {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 20,
                    }}>
                        {programs.map((p) => {
                            return (
                                <div
                                    key={p.id}
                                    style={{
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 14,
                                        padding: 'clamp(20px, 3vw, 28px)',
                                        display: 'flex', flexDirection: 'column',
                                        ...(isSmall ? { flexShrink: 0, width: 300, scrollSnapAlign: 'start' } : {}),
                                    }}
                                >
                                    <div style={{
                                        fontSize: 11, fontWeight: 600,
                                        letterSpacing: '0.06em', textTransform: 'uppercase',
                                        color: 'var(--primary)', marginBottom: 10,
                                    }}>
                                        {p.tag}
                                    </div>
                                    <h3 style={{
                                        fontSize: 20, fontWeight: 700,
                                        letterSpacing: '-0.01em', marginBottom: 8,
                                        color: 'var(--text)',
                                    }}>
                                        {p.name}
                                    </h3>
                                    <p style={{
                                        fontSize: 14, color: 'var(--text-2)',
                                        lineHeight: 1.55, marginBottom: 20,
                                    }}>
                                        {p.descricao}
                                    </p>
                                    <ul style={{
                                        listStyle: 'none', padding: 0, margin: '0 0 24px',
                                        display: 'flex', flexDirection: 'column', gap: 6,
                                    }}>
                                        {p.benefits.map((b, i) => (
                                            <li
                                                key={i}
                                                style={{
                                                    fontSize: 13, color: 'var(--text)',
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                }}
                                            >
                                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                                                {b.text}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={candidatura().url + `?program=${p.code}`}
                                        style={{
                                            marginTop: 'auto', display: 'block',
                                            textAlign: 'center',
                                            background: 'var(--surface-3)',
                                            color: 'var(--text)', fontWeight: 600,
                                            fontSize: 13, padding: '10px',
                                            borderRadius: 8, textDecoration: 'none',
                                        }}
                                    >
                                        Candidatar a {p.name} →
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section style={{
                padding: 'clamp(48px, 6vw, 80px) clamp(16px, 4vw, 32px)',
                background: 'var(--surface)',
                borderTop: '1px solid var(--border)',
            }}>
                <div style={{ maxWidth: 960, margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800,
                        letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)',
                    }}>
                        Como funciona
                    </h2>
                    <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 48 }}>
                        Do formulário ao primeiro dia — quatro etapas simples.
                    </p>
                    <div style={isSmall ? {
                        display: 'flex',
                        gap: 24,
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        scrollSnapType: 'x mandatory',
                        paddingBottom: 8,
                    } : {
                        display: 'grid',
                        gridTemplateColumns: `repeat(${processCols}, 1fr)`,
                        gap: 24,
                    }}>
                        {processSteps.map((step, i) => (
                            <div key={i} style={isSmall ? { flexShrink: 0, width: 260, scrollSnapAlign: 'start' } : {}}>
                                <div style={{
                                    fontSize: 10, fontWeight: 700,
                                    letterSpacing: '0.1em', color: 'var(--primary)',
                                    marginBottom: 12,
                                }}>
                                    {step.period}
                                </div>
                                <div style={{
                                    width: 32, height: 2, background: 'var(--primary)',
                                    marginBottom: 16, borderRadius: 1,
                                }} />
                                <h4 style={{
                                    fontSize: 16, fontWeight: 700,
                                    color: 'var(--text)', marginBottom: 8,
                                }}>
                                    {step.title}
                                </h4>
                                <p style={{
                                    fontSize: 13, color: 'var(--text-2)',
                                    lineHeight: 1.55,
                                }}>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={{
                padding: 'clamp(48px, 6vw, 80px) clamp(16px, 4vw, 32px)',
                background: 'var(--bg)',
                borderTop: '1px solid var(--border)',
            }}>
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800,
                        letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)',
                    }}>
                        Perguntas frequentes
                    </h2>
                    <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 40 }}>
                        Tudo o que precisas de saber antes de te candidatares.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {faqs.map((faq, i) => (
                            <div key={i} style={{
                                borderTop: '1px solid var(--border)',
                                padding: 'clamp(20px, 2vw, 24px) 0',
                                cursor: 'pointer',
                            }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                <div style={{
                                    fontSize: 15, fontWeight: 600,
                                    color: 'var(--text)',
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', gap: 12,
                                }}>
                                    {faq.question}
                                    <span style={{
                                        fontSize: 18, color: 'var(--text-3)',
                                        transition: 'transform 200ms',
                                        transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                                        flexShrink: 0,
                                    }}>+</span>
                                </div>
                                {openFaq === i && (
                                    <div style={{
                                        fontSize: 14, color: 'var(--text-2)',
                                        lineHeight: 1.6, marginTop: 12,
                                    }}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid var(--border)' }} />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                padding: 'clamp(48px, 6vw, 80px) clamp(16px, 4vw, 32px)',
                textAlign: 'center',
                background: isDark ? 'var(--surface)' : 'var(--surface-3)',
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800,
                        color: 'var(--text)', letterSpacing: '-0.02em',
                        marginBottom: 16,
                    }}>
                        Pronto para começar?
                    </h2>
                    <p style={{
                        fontSize: 16, color: 'var(--text-2)',
                        marginBottom: 36, lineHeight: 1.6,
                    }}>
                        As candidaturas encerram a 30 de Junho. Não deixes para amanhã.
                    </p>
                    <Link
                        href={candidatura().url}
                        style={{
                            background: 'var(--primary)', color: '#fff',
                            fontWeight: 700, fontSize: 16,
                            padding: '16px 36px', borderRadius: 10,
                            textDecoration: 'none', display: 'inline-block',
                        }}
                    >
                        Candidatar-me agora →
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
