import { Head } from '@inertiajs/react';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/relatorios-voluntariado';

type Props = {
    data: {
        totalVoluntarios: number;
        totalHoras: number;
        mediaHorasMes: number;
        taxaParticipacao: number;
        actividadesRealizadas: number;
        impactoEstimado: string;
    };
    porArea: { area: string; voluntarios: number; horas: number; percentagem: number }[];
    historico: { mes: string; horas: number; voluntarios: number }[];
};

export default function RelatoriosVoluntariadoIndex({ data, porArea, historico }: Props) {
    return (
        <>
            <Head title="Relatórios de Voluntariado" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Relatórios de Voluntariado</h1>
                        <p className="page-subtitle">Impacto do voluntariado — métricas e evolução</p>
                    </div>
                </div>

                {/* ── KPI Strip ──────────────────────────────────────────── */}
                <div className="grid cols-4" style={{ marginBottom: 20 }}>
                    <KPI label="Total Voluntários" value={data.totalVoluntarios} icon="users" />
                    <KPI label="Total de Horas" value={`${data.totalHoras}h`} icon="clock" />
                    <KPI label="Média Horas/Mês" value={`${data.mediaHorasMes}h`} deltaTone="up" icon="trending" />
                    <KPI label="Impacto Estimado" value={data.impactoEstimado} icon="award" />
                </div>

                {/* ── Two-column: Area & History ─────────────────────────── */}
                <div className="grid cols-2">
                    {porArea.length > 0 && (
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Horas por Área de Actuação</span>
                            </div>
                            <div className="card-pad">
                                <div className="col" style={{ gap: 14 }}>
                                    {porArea.map((a) => (
                                        <div key={a.area}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                                <span style={{ fontWeight: 500 }}>{a.area}</span>
                                                <span style={{ color: 'var(--text-3)' }}>{a.horas}h · {a.voluntarios} voluntários</span>
                                            </div>
                                            <div className="bar-track">
                                                <div className="bar-fill success" style={{ width: `${a.percentagem}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {historico.length > 0 && (
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Evolução Mensal</span>
                            </div>
                            <div className="card-pad">
                                <div className="col" style={{ gap: 14 }}>
                                    {historico.map((h) => (
                                        <div key={h.mes} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-2)', borderRadius: 6, padding: '6px 10px', fontSize: 13 }}>
                                            <span style={{ fontWeight: 500 }}>{h.mes}</span>
                                            <div style={{ display: 'flex', gap: 16, color: 'var(--text-3)', fontSize: 12 }}>
                                                <span>{h.horas}h</span>
                                                <span>{h.voluntarios} voluntários</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Summary Cards ──────────────────────────────────────── */}
                <div className="grid cols-3" style={{ marginTop: 20 }}>
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Actividades Realizadas</span>
                        </div>
                        <div className="card-pad">
                            <div style={{ fontSize: 32, fontWeight: 700 }}>{data.actividadesRealizadas}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Taxa de Participação</span>
                        </div>
                        <div className="card-pad">
                            <div style={{ fontSize: 32, fontWeight: 700 }}>{data.taxaParticipacao}%</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Média Horas/Voluntário</span>
                        </div>
                        <div className="card-pad">
                            <div style={{ fontSize: 32, fontWeight: 700 }}>
                                {data.totalVoluntarios > 0 ? (data.totalHoras / data.totalVoluntarios).toFixed(1) : 0}h
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

RelatoriosVoluntariadoIndex.layout = () => ({
    breadcrumbs: [{ title: 'Relatórios Voluntariado', href: index().url }],
});
