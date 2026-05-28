import { Head } from '@inertiajs/react';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/geografia';

type ProvinceData = { provincia: string; total: number; activos: number; universidades: number };
type Props = { data: ProvinceData[]; resumo: { totalProvincias: number; totalTalentos: number; totalUniversidades: number } };

export default function GeografiaIndex({ data, resumo }: Props) {
    return (
        <>
            <Head title="Geografia" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Mapa Geográfico</h1>
                        <p className="page-subtitle">Distribuição de talentos por província</p>
                    </div>
                </div>

                {/* ── KPI Strip ──────────────────────────────────────────── */}
                <div className="grid cols-3" style={{ marginBottom: 20 }}>
                    <KPI label="Províncias" value={resumo.totalProvincias} icon="globe" />
                    <KPI label="Total Talentos" value={resumo.totalTalentos} icon="users" />
                    <KPI label="Universidades" value={resumo.totalUniversidades} icon="graduation" />
                </div>

                {/* ── Distribution ───────────────────────────────────────── */}
                <div className="card">
                    <div className="card-head">
                        <span className="card-title">Distribuição por Província</span>
                    </div>
                    <div className="card-pad">
                        <div className="col" style={{ gap: 14 }}>
                            {data.map((p) => {
                                const max = Math.max(...data.map((d) => d.total));
                                const pct = max > 0 ? (p.total / max) * 100 : 0;

                                return (
                                    <div key={p.provincia} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 140, fontSize: 13, fontWeight: 500 }}>{p.provincia}</div>
                                        <div style={{ flex: 1 }}>
                                            <div className="bar-track">
                                                <div className="bar-fill success" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                        <div style={{ minWidth: 120, fontSize: 12, color: 'var(--text-3)', textAlign: 'right' }}>
                                            {p.activos} activos / {p.total} total
                                        </div>
                                        <div style={{ minWidth: 100, fontSize: 11, color: 'var(--text-4)', textAlign: 'right' }}>
                                            {p.universidades} univ.
                                        </div>
                                    </div>
                                );
                            })}
                            {data.length === 0 && (
                                <p style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>Sem dados disponíveis.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

GeografiaIndex.layout = () => ({
    breadcrumbs: [{ title: 'Geografia', href: index().url }],
});
