import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, XCircle } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { index, show } from '@/routes/faltas';
import type { Absence } from '@/types';

type Props = { falta: Absence };

const pillClass: Record<string, string> = {
    pendente: 'pill pill-warn',
    aprovado: 'pill pill-success',
    rejeitado: 'pill pill-danger',
};

export default function FaltasShow({ falta }: Props) {
    return (
        <>
            <Head title={`Falta — ${falta.type}`} />
            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 12 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm"><ArrowLeft style={{ width: 14, height: 14 }} /></Link>
                        <div>
                            <h1 className="page-title">Detalhe da Falta</h1>
                            <p className="page-subtitle">{falta.type}</p>
                        </div>
                    </div>
                    <div className="page-actions">
                        <span className={pillClass[falta.status] ?? 'pill pill-neutral'}>{falta.status}</span>
                    </div>
                </div>

                <div className="grid cols-2">
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Informação da Falta</span>
                        </div>
                        <div className="card-pad">
                            <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                                <BfaAvatar name={falta.talent?.name ?? '—'} size={28} />
                                <span className="muted">Talento:</span>
                                <span><b>{falta.talent?.name ?? '—'}</b></span>
                            </div>
                            <div className="divider" />
                            <div className="row-between">
                                <span className="muted">Tipo</span>
                                <span><b style={{ textTransform: 'capitalize' }}>{falta.type}</b></span>
                            </div>
                            <div className="divider" />
                            <div className="row-between">
                                <span className="muted">Início</span>
                                <span>{new Date(falta.start_date).toLocaleDateString('pt-PT')}</span>
                            </div>
                            <div className="divider" />
                            <div className="row-between">
                                <span className="muted">Fim</span>
                                <span>{new Date(falta.end_date).toLocaleDateString('pt-PT')}</span>
                            </div>
                            <div className="divider" />
                            <div className="row-between">
                                <span className="muted">Justificado</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {falta.justificado ? (
                                        <Check style={{ width: 16, height: 16, color: 'var(--success)' }} />
                                    ) : (
                                        <XCircle style={{ width: 16, height: 16, color: 'var(--text-3)' }} />
                                    )}
                                    {falta.justificado ? 'Sim' : 'Não'}
                                </span>
                            </div>
                            {falta.approved_by && (
                                <>
                                    <div className="divider" />
                                    <div className="row-between">
                                        <span className="muted">Aprovado por</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <BfaAvatar name={falta.approved_by.name} size={20} />
                                            <b>{falta.approved_by.name}</b>
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {falta.reason && (
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Motivo</span>
                            </div>
                            <div className="card-pad">
                                <p style={{ whiteSpace: 'pre-wrap' }}>{falta.reason}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

FaltasShow.layout = {
    breadcrumbs: [{ title: 'Faltas' }],
};
