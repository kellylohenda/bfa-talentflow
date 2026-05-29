import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { aprovar, rejeitar } from '@/routes/api/v1/workflows';
import { index, show } from '@/routes/workflows';
import type { Workflow } from '@/types';

type Props = { workflow: Workflow };

const statusPill: Record<string, string> = {
    pendente: 'pill pill-warn',
    em_aprovacao: 'pill pill-info',
    aprovado: 'pill pill-success',
    rejeitado: 'pill pill-danger',
    cancelado: 'pill pill-danger',
};

export default function WorkflowsShow({ workflow }: Props) {
    const handleAprovar = () => {
        router.post(aprovar.url({ workflow: workflow.id }), {}, { preserveScroll: true });
    };

    const handleRejeitar = () => {
        if (!confirm('Tem certeza que deseja rejeitar este workflow?')) {
return;
}

        router.post(rejeitar.url({ workflow: workflow.id }), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={workflow.workflow_code} />
            <div className="section" style={{ padding: '20px 24px 40px' }}>
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft style={{ width: 14, height: 14 }} />
                        </Link>
                        <div>
                            <h1 className="page-title">{workflow.workflow_code}</h1>
                            <p className="page-subtitle">Tipo: {workflow.type}</p>
                        </div>
                    </div>
                    <span className={statusPill[workflow.status] ?? 'pill pill-neutral'}>{workflow.status}</span>
                </div>

                <div className="grid cols-4" style={{ maxWidth: 900, marginBottom: 24 }}>
                    <div className="kpi">
                        <span className="kpi-label">Passo Actual</span>
                        <span className="kpi-value">{workflow.current_step}/{workflow.total_steps}</span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Estado</span>
                        <span className="kpi-value">
                            <span className={statusPill[workflow.status] ?? 'pill pill-neutral'}>
                                {workflow.status}
                            </span>
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Tipo</span>
                        <span className="kpi-value">{workflow.type}</span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Criado em</span>
                        <span className="kpi-value">
                            {new Date(workflow.created_at).toLocaleDateString('pt-PT')}
                        </span>
                    </div>
                </div>

                <div className="grid cols-2" style={{ maxWidth: 900 }}>
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Detalhe do Workflow</span>
                        </div>
                        <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div className="row-between">
                                <span className="muted">Talento</span>
                                <span style={{ fontWeight: 500 }}>{workflow.talent?.name ?? '—'}</span>
                            </div>
                            <div className="row-between">
                                <span className="muted">Tipo</span>
                                <span className="pill pill-neutral">{workflow.type}</span>
                            </div>
                            <div className="row-between">
                                <span className="muted">Passo actual</span>
                                <span>{workflow.current_step}/{workflow.total_steps}</span>
                            </div>
                            {workflow.descricao && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span className="muted">Descrição</span>
                                    <p>{workflow.descricao}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {workflow.steps?.length > 0 && (
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Passos de Aprovação</span>
                            </div>
                            <div className="card-pad">
                                <div className="table-wrap">
                                    <table className="tbl">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 40 }}></th>
                                                <th>Passo</th>
                                                <th>Aprovador</th>
                                                <th>Decisão</th>
                                                <th>Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workflow.steps.map((step) => (
                                                <tr key={step.id}>
                                                    <td>
                                                        {step.decision === 'aprovado' ? (
                                                            <CheckCircle style={{ width: 16, height: 16, color: 'var(--success)' }} />
                                                        ) : step.decision === 'rejeitado' ? (
                                                            <XCircle style={{ width: 16, height: 16, color: 'var(--danger)' }} />
                                                        ) : (
                                                            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--text-3)' }} />
                                                        )}
                                                    </td>
                                                    <td>Passo {step.step_number}</td>
                                                    <td><span className="pill pill-neutral">{step.approver_role}</span></td>
                                                    <td>
                                                        {step.decision ? (
                                                            <span className={`pill ${step.decision === 'aprovado' ? 'pill-success' : 'pill-danger'}`}>
                                                                {step.decision}
                                                            </span>
                                                        ) : <span className="muted">Pendente</span>}
                                                    </td>
                                                    <td>
                                                        {step.decided_at
                                                            ? new Date(step.decided_at).toLocaleDateString('pt-PT')
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="row" style={{ gap: 8, marginTop: 24 }}>
                    {workflow.status === 'em_aprovacao' && (
                        <>
                            <button className="btn btn-primary btn-sm" onClick={handleAprovar}>
                                Aprovar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={handleRejeitar}>
                                Rejeitar
                            </button>
                        </>
                    )}
                    <Link href={index().url} className="btn btn-ghost btn-sm">
                        Voltar
                    </Link>
                </div>
            </div>
        </>
    );
}

WorkflowsShow.layout = {
    breadcrumbs: [{ title: 'Workflows' }],
};
