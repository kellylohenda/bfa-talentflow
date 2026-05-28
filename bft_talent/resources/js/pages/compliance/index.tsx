import { Head } from '@inertiajs/react';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/compliance';

type Props = {
    data: {
        conformidadeGeral: number;
        documentosPendentes: number;
        documentosAprovados: number;
        documentosRejeitados: number;
        contratosActivos: number;
        contratosExpirados: number;
        emConformidade: number;
        naoConformidade: number;
    };
    categorias: { nome: string; conformidade: number; total: number }[];
};

export default function ComplianceIndex({ data, categorias }: Props) {
    return (
        <>
            <Head title="Compliance" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Compliance</h1>
                        <p className="page-subtitle">Monitorização de conformidade regulatória</p>
                    </div>
                </div>

                {/* ── KPI Strip ──────────────────────────────────────────── */}
                <div className="grid cols-4" style={{ marginBottom: 20 }}>
                    <KPI label="Conformidade Geral" value={`${data.conformidadeGeral}%`} deltaTone={data.conformidadeGeral >= 80 ? 'up' : 'down'} icon="shield" />
                    <KPI label="Documentos" value={`${data.documentosAprovados}/${data.documentosAprovados + data.documentosPendentes + data.documentosRejeitados}`} icon="doc" />
                    <KPI label="Em Conformidade" value={data.emConformidade} delta={`${data.documentosAprovados} aprovados`} deltaTone="up" icon="check" />
                    <KPI label="Não Conformidade" value={data.naoConformidade} delta="Atenção" deltaTone="down" icon="x" />
                </div>

                {/* ── Category Bars ──────────────────────────────────────── */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-head">
                        <span className="card-title">Conformidade por Categoria</span>
                    </div>
                    <div className="card-pad">
                        <div className="col" style={{ gap: 14 }}>
                            {categorias.map((c) => {
                                const pct = c.total > 0 ? Math.round((c.conformidade / c.total) * 100) : 0;

                                return (
                                    <div key={c.nome}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                            <span style={{ fontWeight: 500 }}>{c.nome}</span>
                                            <span style={{ color: 'var(--text-3)' }}>{c.conformidade}/{c.total} ({pct}%)</span>
                                        </div>
                                        <div className="bar-track">
                                            <div className={`bar-fill ${pct >= 80 ? 'success' : pct >= 50 ? 'warn' : 'danger'}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                            {categorias.length === 0 && (
                                <p style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>Sem dados disponíveis.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Contracts & Documents ──────────────────────────────── */}
                <div className="grid cols-2">
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Estado dos Contratos</span>
                        </div>
                        <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 18px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--success)' }}>{data.contratosActivos}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Activos</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--danger)' }}>{data.contratosExpirados}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Expirados</div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Documentos por Estado</span>
                        </div>
                        <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 18px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <span className="pill pill-warn">{data.documentosPendentes}</span>
                                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Pendentes</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span className="pill pill-success">{data.documentosAprovados}</span>
                                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Aprovados</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span className="pill pill-danger">{data.documentosRejeitados}</span>
                                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Rejeitados</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ComplianceIndex.layout = () => ({
    breadcrumbs: [{ title: 'Compliance', href: index().url }],
});
