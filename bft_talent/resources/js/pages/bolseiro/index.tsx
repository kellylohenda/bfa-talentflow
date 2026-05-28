import { Head } from '@inertiajs/react';
import { BfaAvatar } from '@/components/ui/avatar';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/bolseiro';
import type { Mentor, Task, Payment } from '@/types';

type Props = {
    kpis: { tarefasPendentes: number; pagamentosPendentes: number; sessoesMes: number; desempenho: number };
    mentor: Mentor | null;
    tarefas: Task[];
    pagamentos: Payment[];
};

const statusTone: Record<string, string> = {
    pendente: 'warn',
    concluido: 'success',
    pago: 'success',
    pendente_pagamento: 'warn',
};

export default function BolseiroIndex({ kpis, mentor, tarefas, pagamentos }: Props) {
    return (
        <>
            <Head title="Portal do Bolseiro" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Portal do Bolseiro</h1>
                        <p className="page-subtitle">Bem-vindo ao teu painel pessoal</p>
                    </div>
                </div>

                <div className="grid cols-4">
                    <KPI label="Tarefas Pendentes" value={kpis.tarefasPendentes} icon="check" />
                    <KPI label="Pagamentos Pendentes" value={kpis.pagamentosPendentes} icon="cash" />
                    <KPI label="Sessões Este Mês" value={kpis.sessoesMes} icon="calendar" />
                    <KPI label="Desempenho" value={`${kpis.desempenho}%`} icon="chart" />
                </div>

                {mentor && (
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Meu Mentor</span>
                        </div>
                        <div className="card-pad">
                            <div className="cell-person">
                                <BfaAvatar name={mentor.name} size={36} />
                                <div className="meta">
                                    <b>{mentor.name}</b>
                                    <span>{mentor.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid cols-2">
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Tarefas Recentes</span>
                        </div>
                        <div className="card-pad">
                            {tarefas.length === 0 && <p className="muted">Nenhuma tarefa pendente.</p>}
                            {tarefas.slice(0, 5).map((t) => (
                                <div key={t.id} className="row row-between" style={{ padding: '6px 0' }}>
                                    <span>{t.title}</span>
                                    <span className={`pill pill-${statusTone[t.status] ?? 'neutral'}`}>{t.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Últimos Pagamentos</span>
                        </div>
                        <div className="card-pad">
                            {pagamentos.length === 0 && <p className="muted">Nenhum pagamento registado.</p>}
                            {pagamentos.slice(0, 5).map((p) => (
                                <div key={p.id} className="row row-between" style={{ padding: '6px 0' }}>
                                    <span>{p.period}</span>
                                    <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                                        <span className="mono">{parseFloat(p.amount).toLocaleString('pt-PT')} {p.currency}</span>
                                        <span className={`pill pill-${statusTone[p.status] ?? 'neutral'}`}>{p.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

BolseiroIndex.layout = () => ({
    breadcrumbs: [{ title: 'Portal do Bolseiro', href: index().url }],
});
