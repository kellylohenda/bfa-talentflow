import { Head, router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/relatorios';

type Stats = {
    talentos: { total: number; activos: number; bolseiros: number; estagiarios: number };
    candidaturas: { total: number; pendentes: number; aprovadas: number; rejeitadas: number };
    pagamentos: { total: number; pendentes: number; pagos: number; valor_total: string };
    voluntarios: { total: number; activos: number };
    workflows: { pendentes: number; em_aprovacao: number };
};

type Props = { stats?: Stats };

function ExportButton({ type, label }: { type: string; label: string }) {
    return (
        <a
            href={`/relatorios/export?type=${type}`}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
            <Download size={14} /> {label}
        </a>
    );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0' }}>
            <span style={{ color: 'var(--text-3)' }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
        </div>
    );
}

function SkeletonRow() {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
            <div style={{ height: 14, width: 96, borderRadius: 4, background: 'var(--surface-2)' }} />
            <div style={{ height: 14, width: 40, borderRadius: 4, background: 'var(--surface-2)' }} />
        </div>
    );
}

function SkeletonCard({ title }: { title: string }) {
    return (
        <div className="card">
            <div className="card-head">
                <span className="card-title">{title}</span>
            </div>
            <div className="card-pad">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
            </div>
        </div>
    );
}

export default function RelatoriosIndex({ stats }: Props) {
    return (
        <>
            <Head title="Relatórios" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Relatórios</h1>
                        <p className="page-subtitle">Indicadores e métricas do programa</p>
                    </div>
                </div>

                {/* ── KPI Strip ──────────────────────────────────────────── */}
                {stats && (
                    <div className="grid cols-5" style={{ marginBottom: 20 }}>
                        <KPI label="Total Talentos" value={stats.talentos.total} sub={`${stats.talentos.activos} activos`} icon="users" />
                        <KPI label="Candidaturas" value={stats.candidaturas.total} sub={`${stats.candidaturas.pendentes} pendentes`} icon="funnel" />
                        <KPI label="Pagamentos" value={stats.pagamentos.total} sub={`${parseFloat(stats.pagamentos.valor_total).toLocaleString('pt-PT')} AOA`} icon="cash" />
                        <KPI label="Voluntários" value={stats.voluntarios.total} sub={`${stats.voluntarios.activos} activos`} icon="users" />
                        <KPI label="Workflows" value={stats.workflows.pendentes + stats.workflows.em_aprovacao} sub={`${stats.workflows.pendentes} pendentes`} icon="layers" />
                    </div>
                )}

                {/* ── Detail Cards ───────────────────────────────────────── */}
                <div className="grid cols-3">
                    {stats ? (
                        <>
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Talentos</span>
                                    <ExportButton type="talentos" label="Exportar CSV" />
                                </div>
                                <div className="card-pad">
                                    <StatRow label="Total" value={stats.talentos.total} />
                                    <StatRow label="Activos" value={stats.talentos.activos} />
                                    <StatRow label="Bolseiros" value={stats.talentos.bolseiros} />
                                    <StatRow label="Estagiários" value={stats.talentos.estagiarios} />
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Candidaturas</span>
                                    <ExportButton type="candidaturas" label="Exportar CSV" />
                                </div>
                                <div className="card-pad">
                                    <StatRow label="Total" value={stats.candidaturas.total} />
                                    <StatRow label="Pendentes" value={stats.candidaturas.pendentes} />
                                    <StatRow label="Aprovadas" value={stats.candidaturas.aprovadas} />
                                    <StatRow label="Rejeitadas" value={stats.candidaturas.rejeitadas} />
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Pagamentos</span>
                                    <ExportButton type="pagamentos" label="Exportar CSV" />
                                </div>
                                <div className="card-pad">
                                    <StatRow label="Total" value={stats.pagamentos.total} />
                                    <StatRow label="Pendentes" value={stats.pagamentos.pendentes} />
                                    <StatRow label="Pagos" value={stats.pagamentos.pagos} />
                                    <StatRow label="Valor Pago" value={`${parseFloat(stats.pagamentos.valor_total).toLocaleString('pt-PT')} AOA`} />
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Voluntários</span>
                                    <ExportButton type="voluntarios" label="Exportar CSV" />
                                </div>
                                <div className="card-pad">
                                    <StatRow label="Total" value={stats.voluntarios.total} />
                                    <StatRow label="Activos" value={stats.voluntarios.activos} />
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Workflows</span>
                                    <ExportButton type="workflows" label="Exportar CSV" />
                                </div>
                                <div className="card-pad">
                                    <StatRow label="Pendentes" value={stats.workflows.pendentes} />
                                    <StatRow label="Em aprovação" value={stats.workflows.em_aprovacao} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <SkeletonCard title="Talentos" />
                            <SkeletonCard title="Candidaturas" />
                            <SkeletonCard title="Pagamentos" />
                            <SkeletonCard title="Voluntários" />
                            <SkeletonCard title="Workflows" />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

RelatoriosIndex.layout = () => ({
    breadcrumbs: [{ title: 'Relatórios', href: index().url }],
});
