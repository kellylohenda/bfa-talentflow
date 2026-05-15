import { Head, Link } from '@inertiajs/react';
import { PublicLayout } from '@/components/public-layout';
import { portal } from '@/routes';

type Application = {
    ref: string;
    nome: string;
    email: string;
    program: string;
    stage: string;
    stage_label: string;
    submitted_at: string;
};

type StageInfo = { label: string; is_terminal: boolean };

const STAGE_CSS: Record<string, { bg: string; border: string; dot: string; text: string; desc: string }> = {
    analise: {
        bg: 'var(--warn-bg)', border: 'var(--warn-border)', dot: 'var(--warn)', text: 'var(--warn)',
        desc: 'A tua candidatura está a ser avaliada pela nossa equipa. O prazo é de 14 dias úteis.',
    },
    entrevista: {
        bg: 'var(--info-bg)', border: 'var(--info-border)', dot: 'var(--info)', text: 'var(--info)',
        desc: 'Foste seleccionado para entrevista. A equipa de RH entrará em contacto brevemente.',
    },
    avaliacao: {
        bg: 'var(--primary-soft)', border: 'var(--primary)', dot: 'var(--primary)', text: 'var(--primary-deep)',
        desc: 'Estás na fase de avaliação técnica. Bom trabalho até aqui!',
    },
    oferta: {
        bg: 'var(--success-bg)', border: 'var(--success-border)', dot: 'var(--success)', text: 'var(--success)',
        desc: 'Recebeste uma oferta! A equipa de RH entrará em contacto brevemente para os próximos passos.',
    },
    convertido: {
        bg: 'var(--success-bg)', border: 'var(--success-border)', dot: 'var(--success)', text: 'var(--success)',
        desc: 'Parabéns! Foste admitido ao programa BFA Talento. Bem-vindo à família BFA.',
    },
    rejeitado: {
        bg: 'var(--danger-bg)', border: 'var(--danger-border)', dot: 'var(--danger)', text: 'var(--danger)',
        desc: 'Agradecemos a tua candidatura. Nesta edição não foi possível seleccionar-te, mas podes candidatar-te novamente.',
    },
};

function fmt(iso: string) {
    return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function PortalShow({ application, stages }: { application: Application; stages: Record<string, StageInfo> }) {
    const stageLabel = stages[application.stage]?.label ?? application.stage_label;
    const status = {
        ...STAGE_CSS[application.stage] ?? STAGE_CSS['analise'],
        label: stageLabel,
    };

    return (
        <PublicLayout>
            <Head title={`Candidatura ${application.ref} — BFA Talento`} />
            <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px, 6vw, 48px) clamp(12px, 4vw, 20px)' }}>
                <div style={{ width: '100%', maxWidth: 500 }}>
                    {/* Status card */}
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
                        <div style={{ background: status.bg, border: `1px solid ${status.border}`, borderRadius: 0, padding: 'clamp(16px, 3vw, 20px) clamp(16px, 4vw, 28px)', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: status.dot, opacity: 0.15, position: 'absolute' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: status.dot, marginTop: 4, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: status.text, marginBottom: 4 }}>{status.label}</div>
                                <div style={{ fontSize: 13, color: status.text, opacity: 0.85, lineHeight: 1.5 }}>{status.desc}</div>
                            </div>
                        </div>

                        <div style={{ padding: 'clamp(20px, 4vw, 24px) clamp(16px, 4vw, 28px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { label: 'Referência', value: application.ref, mono: true },
                                { label: 'Nome', value: application.nome },
                                { label: 'Programa', value: application.program },
                                { label: 'Submetida em', value: fmt(application.submitted_at) },
                            ].map(({ label, value, mono }) => (
                                <div key={label} style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ fontSize: 12, color: 'var(--text-3)', width: 100, flexShrink: 0, paddingTop: 1 }}>{label}</div>
                                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500, fontFamily: mono ? 'monospace' : undefined }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 'clamp(16px, 3vw, 20px) clamp(16px, 4vw, 24px)', marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Processo</div>
                        {Object.keys(STAGE_CSS).filter((s) => s !== 'rejeitado').map((s, i) => {
                            const order = Object.keys(STAGE_CSS);
                            const currentIdx = order.indexOf(application.stage);
                            const stepIdx = order.indexOf(s);
                            const done = currentIdx > stepIdx;
                            const active = application.stage === s;
                            const label = stages[s]?.label ?? STAGE_CSS[s]?.label ?? s;
                            return (
                                <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 4 ? 12 : 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--bg)" strokeWidth="2"><path d="M2 5l2 2 4-4" /></svg>}
                                            {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bg)' }} />}
                                        </div>
                                        {i < 4 && <div style={{ width: 1, height: 16, background: done ? 'var(--success)' : 'var(--border)', margin: '2px 0' }} />}
                                    </div>
                                    <div style={{ paddingBottom: i < 4 ? 12 : 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--text)' : done ? 'var(--text-2)' : 'var(--text-3)' }}>
                                            {label}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Link href={portal().url} style={{ display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--text-3)', textDecoration: 'none', padding: 8 }}>
                        ← Voltar ao portal
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
