import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { marcarPago } from '@/routes/api/v1/pagamentos';
import { index, show } from '@/routes/pagamentos';
import type { Payment } from '@/types';

type Props = { pagamento: Payment };

const statusPill: Record<string, string> = {
    pendente: 'pill pill-warn',
    processado: 'pill pill-info',
    pago: 'pill pill-success',
    cancelado: 'pill pill-danger',
};

export default function PagamentosShow({ pagamento }: Props) {
    const handleMarcarPago = () => {
        router.post(marcarPago.url({ payment: pagamento.id }), {}, { preserveScroll: true });
    };

    const handleCancelar = () => {
        if (!confirm('Tem certeza que deseja cancelar este pagamento?')) {
return;
}

        router.post(`/api/v1/pagamentos/${pagamento.id}/cancelar`);
    };

    return (
        <>
            <Head title={pagamento.payment_ref} />

            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft style={{ width: 14, height: 14 }} />
                        </Link>
                        <div>
                            <h1 className="page-title">{pagamento.payment_ref}</h1>
                            <p className="page-subtitle">{pagamento.period}</p>
                        </div>
                    </div>
                    <span className={statusPill[pagamento.status] ?? 'pill pill-neutral'}>
                        {pagamento.status}
                    </span>
                </div>

                <div className="grid cols-4" style={{ maxWidth: 900, marginBottom: 24 }}>
                    <div className="kpi">
                        <span className="kpi-label">Valor</span>
                        <span className="kpi-value">
                            {parseFloat(pagamento.amount).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} {pagamento.currency}
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Estado</span>
                        <span className="kpi-value">
                            <span className={statusPill[pagamento.status] ?? 'pill pill-neutral'}>
                                {pagamento.status}
                            </span>
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Data Pagamento</span>
                        <span className="kpi-value">
                            {pagamento.paid_at
                                ? new Date(pagamento.paid_at).toLocaleDateString('pt-PT')
                                : '—'}
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Tipo</span>
                        <span className="kpi-value">{pagamento.type}</span>
                    </div>
                </div>

                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-head">
                        <span className="card-title">Detalhe do Pagamento</span>
                    </div>
                    <div className="card-pad">
                        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                            <BfaAvatar name={pagamento.talent?.name ?? '—'} size={28} />
                            <span className="muted">Talento</span>
                            <span style={{ fontWeight: 500 }}>{pagamento.talent?.name ?? '—'}</span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Programa</span>
                            <span>{pagamento.talent?.program?.name ?? '—'}</span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Período</span>
                            <span>{pagamento.period}</span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Tipo</span>
                            <span className="pill pill-neutral">{pagamento.type}</span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Valor</span>
                            <span style={{ fontWeight: 500 }}>
                                {parseFloat(pagamento.amount).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} {pagamento.currency}
                            </span>
                        </div>
                        {pagamento.paid_at && (
                            <>
                                <div className="divider" />
                                <div className="row-between">
                                    <span className="muted">Pago em</span>
                                    <span>{new Date(pagamento.paid_at).toLocaleDateString('pt-PT')}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="row" style={{ gap: 8, marginTop: 24 }}>
                    {pagamento.status === 'pendente' && (
                        <>
                            <button className="btn btn-primary btn-sm" onClick={handleMarcarPago}>
                                Marcar como Pago
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={handleCancelar}>
                                Cancelar
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

PagamentosShow.layout = {
    breadcrumbs: [{ title: 'Pagamentos' }],
};
