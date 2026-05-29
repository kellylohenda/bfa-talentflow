import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { index } from '@/routes/faltas';
import type { Absence } from '@/types';

type Props = { falta: Absence & { dias?: number } };

const pillClass: Record<string, string> = {
    pendente: 'pill pill-warn',
    aprovado: 'pill pill-success',
    aprovada: 'pill pill-success',
    rejeitado: 'pill pill-danger',
    rejeitada: 'pill pill-danger',
};

export default function FaltasShow({ falta }: Props) {
    const dias = falta.dias ?? Math.ceil(
        (new Date(falta.end_date).getTime() - new Date(falta.start_date).getTime()) / 86400000
    ) + 1;

    return (
        <>
            <Head title={`Falta — ${falta.type}`} />
            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 12 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft style={{ width: 14, height: 14 }} />
                        </Link>
                        <div>
                            <h1 className="page-title">Detalhe da Falta</h1>
                            <p className="page-subtitle">{falta.type}</p>
                        </div>
                    </div>
                    <div className="page-actions">
                        <span className={pillClass[falta.status] ?? 'pill pill-neutral'}>{falta.status}</span>
                    </div>
                </div>

                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    <div className="kpi">
                        <span className="kpi-label">Dias</span>
                        <span className="kpi-value">{dias}</span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Estado</span>
                        <span className="kpi-value">
                            <span className={pillClass[falta.status] ?? 'pill pill-neutral'}>{falta.status}</span>
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Tipo</span>
                        <span className="kpi-value" style={{ textTransform: 'capitalize' }}>{falta.type}</span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Justificada</span>
                        <span className="kpi-value">{falta.justificado ? 'Sim' : 'Não'}</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-head">
                        <span className="card-title">Detalhe da Falta</span>
                    </div>
                    <div className="card-pad">
                        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                            <BfaAvatar name={falta.talent?.name ?? '—'} size={28} />
                            <span className="muted">Talento:</span>
                            <span><b>{falta.talent?.name ?? '—'}</b></span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Datas</span>
                            <span>
                                {new Date(falta.start_date).toLocaleDateString('pt-PT')} — {new Date(falta.end_date).toLocaleDateString('pt-PT')}
                            </span>
                        </div>
                        {falta.reason && (
                            <>
                                <div className="divider" />
                                <div className="row-between">
                                    <span className="muted">Motivo</span>
                                    <span style={{ maxWidth: 400, textAlign: 'right', whiteSpace: 'pre-wrap' }}>{falta.reason}</span>
                                </div>
                            </>
                        )}
                        {falta.approved_by && (
                            <>
                                <div className="divider" />
                                <div className="row-between">
                                    <span className="muted">Quem aprovou</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <BfaAvatar name={falta.approved_by.name} size={20} />
                                        <b>{falta.approved_by.name}</b>
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {falta.status === 'pendente' && (
                    <div className="row" style={{ gap: 8, marginTop: 24 }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => router.patch(`/faltas/${falta.id}`, { status: 'aprovada' })}
                        >
                            Aprovar
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => router.patch(`/faltas/${falta.id}`, { status: 'rejeitada' })}
                        >
                            Rejeitar
                        </button>
                    </div>
                )}

                <div style={{ marginTop: 24 }}>
                    <Link href={index().url} className="btn btn-ghost btn-sm">← Voltar</Link>
                </div>
            </div>
        </>
    );
}

FaltasShow.layout = {
    breadcrumbs: [{ title: 'Faltas' }],
};
