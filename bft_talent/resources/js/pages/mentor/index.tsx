import { Head, Link } from '@inertiajs/react';
import { BfaAvatar } from '@/components/ui/avatar';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/mentor';
import { show } from '@/routes/talentos';
import type { Talent } from '@/types';

type Props = {
    mentees: (Talent & { tarefasPendentes: number; avaliacaoMedia: number | null })[];
    kpis: { totalMentees: number; tarefasPendentes: number; avaliacoesPendentes: number; sessoesMes: number };
};

const statusTone: Record<string, string> = {
    activo: 'success',
    suspenso: 'warn',
    concluido: 'info',
    cancelado: 'danger',
};

export default function MentorIndex({ mentees, kpis }: Props) {
    return (
        <>
            <Head title="Portal do Mentor" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Portal do Mentor</h1>
                        <p className="page-subtitle">Acompanhamento de bolseiros e estagiários</p>
                    </div>
                </div>

                <div className="grid cols-4">
                    <KPI label="Mentees" value={kpis.totalMentees} icon="users" />
                    <KPI label="Tarefas Pendentes" value={kpis.tarefasPendentes} icon="check" />
                    <KPI label="Avaliações Pendentes" value={kpis.avaliacoesPendentes} icon="star" />
                    <KPI label="Sessões Este Mês" value={kpis.sessoesMes} icon="calendar" />
                </div>

                <div className="card">
                    <div className="card-head">
                        <span className="card-title">Meus Mentees</span>
                    </div>
                    <div className="card-pad">
                        {mentees.map((m) => (
                            <div key={m.id} className="row row-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                <div className="cell-person">
                                    <BfaAvatar name={m.name} size={32} />
                                    <div className="meta">
                                        <b>{m.name}</b>
                                        <span>{m.talent_code}</span>
                                    </div>
                                </div>
                                <div className="row" style={{ gap: 16, alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="mono" style={{ fontWeight: 600 }}>{m.tarefasPendentes}</div>
                                        <div className="muted" style={{ fontSize: 11 }}>Tarefas</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="mono" style={{ fontWeight: 600 }}>{m.avaliacaoMedia !== null ? `${m.avaliacaoMedia}%` : '—'}</div>
                                        <div className="muted" style={{ fontSize: 11 }}>Avaliação</div>
                                    </div>
                                    <span className={`pill pill-${statusTone[m.status] ?? 'neutral'}`}>{m.status}</span>
                                    <Link href={show(m.id).url} className="btn btn-ghost btn-sm">Ver ficha</Link>
                                </div>
                            </div>
                        ))}
                        {mentees.length === 0 && (
                            <p className="muted" style={{ padding: '24px 0', textAlign: 'center' }}>Nenhum mentee atribuído.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

MentorIndex.layout = () => ({
    breadcrumbs: [{ title: 'Portal do Mentor', href: index().url }],
});
