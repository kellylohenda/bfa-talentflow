import { Head, Link } from '@inertiajs/react';
import { Users, ClipboardList, CreditCard, HandHeart, Calendar, TrendingUp, AlertTriangle, ArrowUpRight, LayoutGrid } from 'lucide-react';

type Stat = { label: string; value: number | string; color: string };

type Props = {
    stats: {
        totalTalents: number;
        activeTalents: number;
        totalApplications: number;
        totalPayments: number;
        totalVolunteers: number;
        totalEvents: number;
    };
    talentsByProgram: { program: string; total: number }[];
    talentsByStatus: Record<string, number>;
    recentApplications: { id: number; name: string; stage: string; program?: string; created_at: string }[];
    recentPayments: { id: number; talent?: string; amount: string; status: string; created_at: string }[];
    topTalents: { id: number; name: string; program?: string; perf: number; status: string; risk_score: string }[];
    userRole: string;
};

export default function Dashboard({ stats, talentsByProgram, talentsByStatus, recentApplications, recentPayments, topTalents, userRole }: Props) {
    const statusLabel: Record<string, string> = {
        activo: 'Activo', concluido: 'Concluído', suspenso: 'Suspenso', risco: 'Em risco',
    };
    const statusTone: Record<string, string> = {
        activo: '#0E7C4A', concluido: '#1D4ED8', suspenso: '#B45309', risco: '#DC2626',
    };

    const stageLabel: Record<string, string> = {
        analise: 'Análise', entrevista: 'Entrevista', avaliacao: 'Avaliação',
        oferta: 'Oferta', convertido: 'Convertido', rejeitado: 'Rejeitado',
    };

    const paymentStatusMap: Record<string, string> = {
        pendente: 'Pendente', processado: 'Processado', pago: 'Pago', cancelado: 'Cancelado',
    };
    const paymentTone: Record<string, string> = {
        pendente: '#B45309', processado: '#1D4ED8', pago: '#0E7C4A', cancelado: '#DC2626',
    };

    const kpis: Stat[] = [
        { label: 'Total Talentos', value: stats.totalTalents, color: '#FF7607' },
        { label: 'Activos', value: stats.activeTalents, color: '#0E7C4A' },
        { label: 'Candidaturas', value: stats.totalApplications, color: '#1D4ED8' },
        { label: 'Pagamentos', value: `${stats.totalPayments}`, color: '#7C3AED' },
    ];

    const secondaryKpis: Stat[] = [
        { label: 'Voluntários', value: stats.totalVolunteers, color: '#0891B2' },
        { label: 'Eventos', value: stats.totalEvents, color: '#B45309' },
    ];

    const talentRiskCount = topTalents.filter(t => parseFloat(t.risk_score) > 0.3).length;

    return (
        <>
            <Head title="Dashboard" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Dashboard Executivo</h1>
                        <p className="page-subtitle">Visão geral do programa de talentos BFA</p>
                    </div>
                </div>

                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    {kpis.map((kpi) => (
                        <div key={kpi.label} className="card" style={{ padding: 18 }}>
                            <div className="kpi">
                                <div className="kpi-label">{kpi.label}</div>
                                <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    {secondaryKpis.map((kpi) => (
                        <div key={kpi.label} className="card" style={{ padding: 18 }}>
                            <div className="kpi">
                                <div className="kpi-label">{kpi.label}</div>
                                <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
                            </div>
                        </div>
                    ))}
                    <div className="card" style={{ padding: 18 }}>
                        <div className="kpi">
                            <div className="kpi-label">Em Risco</div>
                            <div className="kpi-value" style={{ color: '#DC2626' }}>
                                {talentRiskCount}
                                {talentRiskCount > 0 && <ArrowUpRight size={16} style={{ marginLeft: 6 }} />}
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: 18 }}>
                        <div className="kpi">
                            <div className="kpi-label">Taxa Conclusão</div>
                            <div className="kpi-value" style={{ color: '#0E7C4A' }}>
                                {stats.totalTalents > 0
                                    ? Math.round(((talentsByStatus['concluido'] ?? 0) / stats.totalTalents) * 100)
                                    : 0}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid cols-3" style={{ gap: 'clamp(12px, 2vw, 20px)' }}>
                    <div className="card" style={{ padding: 'clamp(12px, 2vw, 18px)', gridColumn: 'span 2' }}>
                        <div className="card-head">
                            <span className="card-title">Distribuição por Programa</span>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            {talentsByProgram.map((item) => {
                                const pct = stats.totalTalents > 0 ? (item.total / stats.totalTalents) * 100 : 0;
                                return (
                                    <div key={item.program} style={{ marginBottom: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                                            <span>{item.program}</span>
                                            <span style={{ fontWeight: 600 }}>{item.total} ({Math.round(pct)}%)</span>
                                        </div>
                                        <div className="bar-track">
                                            <div className="bar-fill" style={{ width: `${pct}%`, background: '#FF7607' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card" style={{ padding: 18 }}>
                        <div className="card-head">
                            <span className="card-title">Talentos por Status</span>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            {Object.entries(talentsByStatus).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <span className={`pill pill-${key === 'activo' ? 'success' : key === 'concluido' ? 'info' : key === 'suspenso' ? 'warn' : 'danger'}`}>
                                        {statusLabel[key] ?? key}
                                    </span>
                                    <span style={{ fontWeight: 600, marginLeft: 'auto' }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid cols-3" style={{ gap: 'clamp(12px, 2vw, 20px)', marginTop: 20 }}>
                    <div className="card" style={{ padding: 'clamp(12px, 2vw, 18px)' }}>
                        <div className="card-head">
                            <span className="card-title">Candidaturas Recentes</span>
                            <Link href="/candidaturas" className="btn btn-sm btn-ghost">Ver todas</Link>
                        </div>
                        <div className="tbl" style={{ marginTop: 12, overflowX: 'auto' }}>
                            {recentApplications.length === 0 ? (
                                <p style={{ color: '#888', padding: 12 }}>Nenhuma candidatura recente</p>
                            ) : (
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        {recentApplications.map((app) => (
                                            <tr key={app.id}>
                                                <td className="cell-person">{app.name}</td>
                                                <td>
                                                    <span className={`pill pill-${app.stage === 'rejeitado' ? 'danger' : app.stage === 'convertido' || app.stage === 'oferta' ? 'success' : 'info'}`}>
                                                        {stageLabel[app.stage] ?? app.stage}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: 12, color: '#888', textAlign: 'right' }}>{app.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="card" style={{ padding: 'clamp(12px, 2vw, 18px)' }}>
                        <div className="card-head">
                            <span className="card-title">Pagamentos Recentes</span>
                            <Link href="/pagamentos" className="btn btn-sm btn-ghost">Ver todos</Link>
                        </div>
                        <div className="tbl" style={{ marginTop: 12, overflowX: 'auto' }}>
                            {recentPayments.length === 0 ? (
                                <p style={{ color: '#888', padding: 12 }}>Nenhum pagamento recente</p>
                            ) : (
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        {recentPayments.map((p) => (
                                            <tr key={p.id}>
                                                <td className="cell-person">{p.talent ?? 'N/A'}</td>
                                                <td style={{ fontWeight: 600 }}>{p.amount} Kz</td>
                                                <td>
                                                    <span className="pill" style={{ background: paymentTone[p.status] ?? '#888', color: '#fff' }}>
                                                        {paymentStatusMap[p.status] ?? p.status}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: 12, color: '#888', textAlign: 'right' }}>{p.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="card" style={{ padding: 'clamp(12px, 2vw, 18px)' }}>
                        <div className="card-head">
                            <span className="card-title">Talentos em Destaque</span>
                            <Link href="/talentos" className="btn btn-sm btn-ghost">Ver todos</Link>
                        </div>
                        <div className="tbl" style={{ marginTop: 12, overflowX: 'auto' }}>
                            {topTalents.length === 0 ? (
                                <p style={{ color: '#888', padding: 12 }}>Nenhum talento activo</p>
                            ) : (
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        {topTalents.map((t) => (
                                            <tr key={t.id}>
                                                <td className="cell-person">{t.name}</td>
                                                <td>
                                                    <div className="bar-track" style={{ width: 60 }}>
                                                        <div className="bar-fill" style={{
                                                            width: `${t.perf}%`,
                                                            background: t.perf >= 85 ? '#0E7C4A' : t.perf >= 70 ? '#B45309' : '#DC2626'
                                                        }} />
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600, fontSize: 13 }}>{t.perf}%</td>
                                                <td>
                                                    {parseFloat(t.risk_score) > 0.3 ? (
                                                        <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <AlertTriangle size={12} /> Risco
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: '#0E7C4A' }}>OK</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ label: 'Dashboard' }],
};
