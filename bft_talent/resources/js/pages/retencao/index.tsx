import { Head } from '@inertiajs/react';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/retencao';

type Props = {
    data: {
        taxaRetencaoGeral: number;
        totalActivos: number;
        totalSaidas: number;
        saidasMes: number;
        entradasMes: number;
        tempoMedioPermanencia: number;
    };
    historico: { mes: string; retencao: number; entradas: number; saidas: number }[];
    causasSaida: { causa: string; total: number; percentagem: number }[];
};

export default function RetencaoIndex({ data, historico, causasSaida }: Props) {
    return (
        <>
            <Head title="Retenção" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Retenção</h1>
                        <p className="page-subtitle">Acompanhamento da retenção de talentos</p>
                    </div>
                </div>

                {/* ── KPI Strip ──────────────────────────────────────────── */}
                <div className="grid cols-4" style={{ marginBottom: 20 }}>
                    <KPI
                        label="Taxa de Retenção"
                        value={`${data.taxaRetencaoGeral}%`}
                        deltaTone={data.taxaRetencaoGeral >= 70 ? 'up' : 'down'}
                        icon="check"
                    />
                    <KPI label="Total Activos" value={data.totalActivos} icon="users" />
                    <KPI label="Saídas Totais" value={data.totalSaidas} delta="Atenção" deltaTone="down" icon="x" />
                    <KPI
                        label="Saldo do Mês"
                        value={`${data.entradasMes - data.saidasMes >= 0 ? '+' : ''}${data.entradasMes - data.saidasMes}`}
                        delta={`${data.entradasMes} entradas · ${data.saidasMes} saídas`}
                        deltaTone={data.entradasMes >= data.saidasMes ? 'up' : 'down'}
                        icon="trending"
                    />
                </div>

                {/* ── Two-column: Evolution & Causes ─────────────────────── */}
                <div className="grid cols-2">
                    {historico.length > 0 && (
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Evolução da Retenção</span>
                            </div>
                            <div className="card-pad">
                                <div className="col" style={{ gap: 14 }}>
                                    {historico.map((h) => (
                                        <div key={h.mes}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                                <span style={{ fontWeight: 500 }}>{h.mes}</span>
                                                <span style={{ color: 'var(--text-3)' }}>{h.retencao}%</span>
                                            </div>
                                            <div className="bar-track">
                                                <div className={`bar-fill ${h.retencao >= 80 ? 'success' : h.retencao >= 60 ? 'warn' : 'danger'}`} style={{ width: `${h.retencao}%` }} />
                                            </div>
                                            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>
                                                <span>Entradas: {h.entradas}</span>
                                                <span>Saídas: {h.saidas}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {causasSaida.length > 0 && (
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Causas de Saída</span>
                            </div>
                            <div className="card-pad">
                                <div className="col" style={{ gap: 14 }}>
                                    {causasSaida.map((c) => (
                                        <div key={c.causa}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                                <span style={{ fontWeight: 500 }}>{c.causa}</span>
                                                <span style={{ color: 'var(--text-3)' }}>{c.total} ({c.percentagem}%)</span>
                                            </div>
                                            <div className="bar-track">
                                                <div className="bar-fill danger" style={{ width: `${c.percentagem}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Avg Tenure ─────────────────────────────────────────── */}
                <div className="card" style={{ marginTop: 20 }}>
                    <div className="card-head">
                        <span className="card-title">Tempo Médio de Permanência</span>
                    </div>
                    <div className="card-pad">
                        <div style={{ fontSize: 32, fontWeight: 700 }}>
                            {data.tempoMedioPermanencia} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-3)' }}>meses</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

RetencaoIndex.layout = () => ({
    breadcrumbs: [{ title: 'Retenção', href: index().url }],
});
