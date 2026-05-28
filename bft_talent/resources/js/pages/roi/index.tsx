import { Head } from '@inertiajs/react';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/roi';

type Props = {
    data: {
        totalInvestido: number;
        retornoEstimado: number;
        roi: number;
        custoPorTalento: number;
        produtividadeMedia: number;
        taxaRetencao: number;
    };
    historico: { periodo: string; investimento: number; retorno: number }[];
};

function formatCurrency(value: number) {
    return `${value.toLocaleString('pt-PT')} AOA`;
}

export default function RoiIndex({ data, historico }: Props) {
    return (
        <>
            <Head title="ROI" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">ROI e Custos</h1>
                        <p className="page-subtitle">Retorno sobre o investimento do programa</p>
                    </div>
                </div>

                {/* ── KPI Strip ──────────────────────────────────────────── */}
                <div className="grid cols-3" style={{ marginBottom: 20 }}>
                    <KPI label="Total Investido" value={formatCurrency(data.totalInvestido)} icon="cash" />
                    <KPI
                        label="Retorno Estimado"
                        value={formatCurrency(data.retornoEstimado)}
                        delta={`${data.roi >= 0 ? '+' : ''}${data.roi}%`}
                        deltaTone={data.roi >= 0 ? 'up' : 'down'}
                        icon="trending"
                    />
                    <KPI label="Custo por Talento" value={formatCurrency(data.custoPorTalento)} icon="users" />
                </div>

                <div className="grid cols-3" style={{ marginBottom: 20 }}>
                    <KPI label="ROI" value={`${data.roi >= 0 ? '+' : ''}${data.roi}%`} deltaTone={data.roi >= 0 ? 'up' : 'down'} icon="chart" />
                    <KPI label="Produtividade Média" value={`${data.produtividadeMedia}%`} icon="trending" />
                    <KPI label="Taxa de Retenção" value={`${data.taxaRetencao}%`} icon="users" />
                </div>

                {/* ── History Table ──────────────────────────────────────── */}
                {historico.length > 0 && (
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Histórico de ROI</span>
                        </div>
                        <div className="table-wrap">
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Período</th>
                                        <th>Investimento</th>
                                        <th>Retorno</th>
                                        <th style={{ textAlign: 'right' }}>ROI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historico.map((h) => {
                                        const roiPct = h.investimento > 0 ? ((h.retorno - h.investimento) / h.investimento) * 100 : 0;

                                        return (
                                            <tr key={h.periodo}>
                                                <td style={{ fontWeight: 500 }}>{h.periodo}</td>
                                                <td>{formatCurrency(h.investimento)}</td>
                                                <td>{formatCurrency(h.retorno)}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <span className={`pill pill-${roiPct >= 0 ? 'success' : 'danger'}`}>
                                                        {roiPct >= 0 ? '+' : ''}{roiPct.toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

RoiIndex.layout = () => ({
    breadcrumbs: [{ title: 'ROI', href: index().url }],
});
