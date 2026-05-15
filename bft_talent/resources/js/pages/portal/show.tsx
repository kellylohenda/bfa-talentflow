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

const STAGE_CONFIG: Record<string, { bg: string; border: string; dot: string; text: string; label: string; desc: string }> = {
    analise: {
        bg: '#FFFBEB', border: '#FDE68A', dot: '#D97706', text: '#92400E',
        label: 'Em análise',
        desc: 'A tua candidatura está a ser avaliada pela nossa equipa. O prazo é de 14 dias úteis.',
    },
    entrevista: {
        bg: '#E6EEFD', border: '#B7CCF5', dot: '#1D4ED8', text: '#1E3A8A',
        label: 'Entrevista',
        desc: 'Foste seleccionado para entrevista. A equipa de RH entrará em contacto brevemente.',
    },
    avaliacao: {
        bg: '#FFF0E5', border: '#FDDBB4', dot: '#FF7607', text: '#9C4500',
        label: 'Em avaliação',
        desc: 'Estás na fase de avaliação técnica. Bom trabalho até aqui!',
    },
    oferta: {
        bg: '#E5F4EC', border: '#B7DFC8', dot: '#059669', text: '#065F46',
        label: 'Oferta',
        desc: 'Recebeste uma oferta! A equipa de RH entrará em contacto brevemente para os próximos passos.',
    },
    convertido: {
        bg: '#E5F4EC', border: '#B7DFC8', dot: '#059669', text: '#065F46',
        label: 'Admitido',
        desc: 'Parabéns! Foste admitido ao programa BFA Talento. Bem-vindo à família BFA.',
    },
    rejeitado: {
        bg: '#FFF7F7', border: '#FCA5A5', dot: '#DC2626', text: '#991B1B',
        label: 'Não seleccionado',
        desc: 'Agradecemos a tua candidatura. Nesta edição não foi possível seleccionar-te, mas podes candidatar-te novamente.',
    },
};

function fmt(iso: string) {
    return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function PortalShow({ application }: { application: Application }) {
    const status = STAGE_CONFIG[application.stage] ?? STAGE_CONFIG['analise'];

    return (
        <PublicLayout>
            <Head title={`Candidatura ${application.ref} — BFA Talento`} />
            <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
                <div style={{ width: '100%', maxWidth: 500 }}>
                    {/* Status card */}
                    <div style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
                        <div style={{ background: status.bg, border: `1px solid ${status.border}`, borderRadius: 0, padding: '20px 28px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: status.dot, opacity: 0.15, position: 'absolute' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: status.dot, marginTop: 4, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: status.text, marginBottom: 4 }}>{status.label}</div>
                                <div style={{ fontSize: 13, color: status.text, opacity: 0.85, lineHeight: 1.5 }}>{status.desc}</div>
                            </div>
                        </div>

                        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { label: 'Referência', value: application.ref, mono: true },
                                { label: 'Nome', value: application.nome },
                                { label: 'Programa', value: application.program },
                                { label: 'Submetida em', value: fmt(application.submitted_at) },
                            ].map(({ label, value, mono }) => (
                                <div key={label} style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ fontSize: 12, color: '#8A8A87', width: 100, flexShrink: 0, paddingTop: 1 }}>{label}</div>
                                    <div style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 500, fontFamily: mono ? 'monospace' : undefined }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#8A8A87', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Processo</div>
                        {(['analise', 'entrevista', 'avaliacao', 'oferta', 'convertido'] as const).map((s, i) => {
                            const stages = ['analise', 'entrevista', 'avaliacao', 'oferta', 'convertido', 'rejeitado'];
                            const currentIdx = stages.indexOf(application.stage);
                            const stepIdx = stages.indexOf(s);
                            const done = currentIdx > stepIdx;
                            const active = application.stage === s;
                            return (
                                <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 4 ? 12 : 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? '#059669' : active ? '#FF7607' : '#E7E5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2"><path d="M2 5l2 2 4-4" /></svg>}
                                            {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                                        </div>
                                        {i < 4 && <div style={{ width: 1, height: 16, background: done ? '#059669' : '#E7E5E1', margin: '2px 0' }} />}
                                    </div>
                                    <div style={{ paddingBottom: i < 4 ? 12 : 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#1A1A1A' : done ? '#525252' : '#8A8A87' }}>
                                            {STAGE_CONFIG[s]?.label ?? s}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Link href={portal()} style={{ display: 'block', textAlign: 'center', fontSize: 13, color: '#8A8A87', textDecoration: 'none', padding: 8 }}>
                        ← Voltar ao portal
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
