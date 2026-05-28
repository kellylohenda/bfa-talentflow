import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Users, Briefcase, HandHeart } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { Donut } from '@/components/ui/charts';
import { KPI } from '@/components/ui/kpi';

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
};

const PROGRAM_COLORS = ['#1D4ED8', '#FF7607', '#0E7C4A', '#7C3AED', '#0891B2'];

export default function Dashboard({ stats, talentsByProgram, talentsByStatus, recentApplications, recentPayments, topTalents }: Props) {
    const statusLabel: Record<string, string> = {
        activo: 'Activo', concluido: 'Concluído', suspenso: 'Suspenso', cancelado: 'Cancelado',
    };

    const stageLabel: Record<string, string> = {
        analise: 'Análise', entrevista: 'Entrevista', avaliacao: 'Avaliação',
        oferta: 'Oferta', convertido: 'Convertido', rejeitado: 'Rejeitado',
    };

    const paymentStatusMap: Record<string, string> = {
        pendente: 'Pendente', processado: 'Processado', pago: 'Pago', cancelado: 'Cancelado',
    };

    const riskCount = topTalents.filter((t) => parseFloat(t.risk_score) > 0.3).length;
    const completedCount = talentsByStatus['concluido'] ?? 0;
    const completionRate = stats.totalTalents > 0 ? Math.round((completedCount / stats.totalTalents) * 100) : 0;

    const donutSegments = talentsByProgram.map((item, i) => ({
        value: item.total,
        color: PROGRAM_COLORS[i % PROGRAM_COLORS.length],
    }));

    return (
        <>
            <Head title="Dashboard" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Visão Geral</h1>
                        <p className="page-subtitle">Dashboard executivo — BFA TalentFlow</p>
                    </div>
                </div>

                {/* ── 3-Type Summary ──────────────────────────────────────── */}
                <div className="grid cols-3" style={{ marginBottom: 20 }}>
                    {/* Bolseiros */}
                    <div className="card" style={{ borderTop: '3px solid #1D4ED8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1D4ED815', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users size={18} style={{ color: '#1D4ED8' }} />
                            </div>
                            <div>
                                <div className="kpi-label">Bolseiros</div>
                                <div className="kpi-value" style={{ fontSize: 22 }}>{stats.totalTalents}</div>
                            </div>
                            <span className="pill pill-info" style={{ marginLeft: 'auto' }}>Académico</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>
                            Bolsas BIF · BNAC · Liderança+ · Mestrados
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                            <span><strong>{stats.activeTalents}</strong> activos</span>
                            <span style={{ color: 'var(--text-4)' }}>·</span>
                            <span><strong style={{ color: 'var(--warn)' }}>{talentsByStatus['suspenso'] ?? 0}</strong> suspensos</span>
                            <span style={{ color: 'var(--text-4)' }}>·</span>
                            <span><strong style={{ color: 'var(--danger)' }}>{riskCount}</strong> risco</span>
                        </div>
                    </div>

                    {/* Estagiários */}
                    <div className="card" style={{ borderTop: '3px solid #FF7607' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FF760715', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Briefcase size={18} style={{ color: '#FF7607' }} />
                            </div>
                            <div>
                                <div className="kpi-label">Candidaturas</div>
                                <div className="kpi-value" style={{ fontSize: 22 }}>{stats.totalApplications}</div>
                            </div>
                            <span className="pill pill-primary" style={{ marginLeft: 'auto' }}>Pipeline</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>
                            Processo seletivo · Entrevistas · Avaliações
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                            <span><strong>{stats.totalApplications}</strong> total</span>
                            <span style={{ color: 'var(--text-4)' }}>·</span>
                            <span><strong style={{ color: 'var(--success)' }}>{completedCount}</strong> convertidas</span>
                        </div>
                    </div>

                    {/* Voluntários */}
                    <div className="card" style={{ borderTop: '3px solid #0E7C4A' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0E7C4A15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <HandHeart size={18} style={{ color: '#0E7C4A' }} />
                            </div>
                            <div>
                                <div className="kpi-label">Voluntários</div>
                                <div className="kpi-value" style={{ fontSize: 22 }}>{stats.totalVolunteers}</div>
                            </div>
                            <span className="pill pill-success" style={{ marginLeft: 'auto' }}>CSR</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>
                            Voluntariado Comunitário · Saúde · Educação
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                            <span><strong>{stats.totalEvents}</strong> eventos</span>
                        </div>
                    </div>
                </div>

                {/* ── KPI Strip ────────────────────────────────────────────── */}
                <div className="grid cols-5" style={{ marginBottom: 24 }}>
                    <KPI label="Total participantes" value={stats.totalTalents + stats.totalVolunteers} sub={`${stats.totalTalents} talentos + ${stats.totalVolunteers} vol.`} icon="users" />
                    <KPI label="Activos" value={stats.activeTalents} delta={`${completionRate}% conclusão`} deltaTone="up" icon="trending" />
                    <KPI label="Em risco" value={riskCount} delta="Atenção" deltaTone="down" icon="alert" />
                    <KPI label="Pagamentos" value={stats.totalPayments} icon="cash" />
                    <KPI label="Candidaturas" value={stats.totalApplications} delta="Activas" deltaTone="up" icon="funnel" />
                </div>

                {/* ── Two-column layout ────────────────────────────────────── */}
                <div className="grid cols-2" style={{ gap: 20 }}>
                    {/* LEFT */}
                    <div className="col" style={{ gap: 20 }}>
                        {/* Program distribution */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Distribuição por programa</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 18px' }}>
                                <Donut
                                    segments={donutSegments}
                                    size={130}
                                    thickness={16}
                                    label={String(stats.totalTalents)}
                                    sub="talentos"
                                />
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
                                    {talentsByProgram.map((item, i) => (
                                        <li key={item.program} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13 }}>
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: PROGRAM_COLORS[i % PROGRAM_COLORS.length], flexShrink: 0 }} />
                                            <span style={{ flex: 1 }}>{item.program}</span>
                                            <span style={{ fontWeight: 600 }}>{item.total}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Status distribution */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Talentos por status</span>
                            </div>
                            <div style={{ padding: '12px 18px' }}>
                                {Object.entries(talentsByStatus).map(([key, val]) => (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <span className={`pill pill-${key === 'activo' ? 'success' : key === 'concluido' ? 'info' : key === 'suspenso' ? 'warn' : 'danger'}`}>
                                            {statusLabel[key] ?? key}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <div className="bar-track">
                                                <div className="bar-fill" style={{
                                                    width: `${stats.totalTalents > 0 ? (val / stats.totalTalents) * 100 : 0}%`,
                                                    background: key === 'activo' ? 'var(--success)' : key === 'concluido' ? 'var(--info)' : key === 'suspenso' ? 'var(--warn)' : 'var(--danger)',
                                                }} />
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: 600, minWidth: 30, textAlign: 'right' }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col" style={{ gap: 20 }}>
                        {/* Priority alerts */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Talentos em destaque</span>
                                <Link href="/talentos" className="btn btn-sm btn-ghost">Ver todos</Link>
                            </div>
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Talento</th>
                                        <th>Performance</th>
                                        <th>Risco</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topTalents.length === 0 ? (
                                        <tr><td colSpan={3} style={{ padding: 16, textAlign: 'center', color: 'var(--text-3)' }}>Nenhum talento activo</td></tr>
                                    ) : (
                                        topTalents.slice(0, 5).map((t) => (
                                            <tr key={t.id}>
                                                <td>
                                                    <div className="cell-person">
                                                        <BfaAvatar name={t.name} size={26} />
                                                        <div className="meta">
                                                            <b>{t.name}</b>
                                                            <span>{t.program ?? '—'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <div className="bar-track" style={{ width: 60 }}>
                                                            <div className="bar-fill" style={{
                                                                width: `${t.perf}%`,
                                                                background: t.perf >= 85 ? 'var(--success)' : t.perf >= 70 ? 'var(--warn)' : 'var(--danger)',
                                                            }} />
                                                        </div>
                                                        <span style={{ fontWeight: 600, fontSize: 13 }}>{t.perf}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {parseFloat(t.risk_score) > 0.3 ? (
                                                        <span className="pill pill-danger">
                                                            <AlertTriangle size={10} /> Risco
                                                        </span>
                                                    ) : (
                                                        <span className="pill pill-success">OK</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Recent applications */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Candidaturas recentes</span>
                                <Link href="/candidaturas" className="btn btn-sm btn-ghost">Ver todas</Link>
                            </div>
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Candidato</th>
                                        <th>Estado</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentApplications.length === 0 ? (
                                        <tr><td colSpan={3} style={{ padding: 16, textAlign: 'center', color: 'var(--text-3)' }}>Nenhuma candidatura recente</td></tr>
                                    ) : (
                                        recentApplications.slice(0, 5).map((app) => (
                                            <tr key={app.id}>
                                                <td>
                                                    <div className="cell-person">
                                                        <BfaAvatar name={app.name} size={26} />
                                                        <div className="meta">
                                                            <b>{app.name}</b>
                                                            <span>{app.program ?? '—'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`pill pill-${app.stage === 'rejeitado' ? 'danger' : app.stage === 'convertido' || app.stage === 'oferta' ? 'success' : 'info'}`}>
                                                        {stageLabel[app.stage] ?? app.stage}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{app.created_at}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Recent payments */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Pagamentos recentes</span>
                                <Link href="/pagamentos" className="btn btn-sm btn-ghost">Ver todos</Link>
                            </div>
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Talento</th>
                                        <th>Valor</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPayments.length === 0 ? (
                                        <tr><td colSpan={3} style={{ padding: 16, textAlign: 'center', color: 'var(--text-3)' }}>Nenhum pagamento recente</td></tr>
                                    ) : (
                                        recentPayments.slice(0, 5).map((p) => (
                                            <tr key={p.id}>
                                                <td style={{ fontWeight: 500 }}>{p.talent ?? 'N/A'}</td>
                                                <td style={{ fontWeight: 600 }}>{Number(p.amount).toLocaleString('pt-AO')} Kz</td>
                                                <td>
                                                    <span className={`pill pill-${p.status === 'pago' ? 'success' : p.status === 'pendente' ? 'warn' : p.status === 'cancelado' ? 'danger' : 'info'}`}>
                                                        {paymentStatusMap[p.status] ?? p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Visão Geral' }],
};
