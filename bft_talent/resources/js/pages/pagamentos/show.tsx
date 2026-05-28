import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { index, show } from '@/routes/pagamentos';
import type { Payment } from '@/types';

type Props = { pagamento: Payment };

export default function PagamentosShow({ pagamento }: Props) {
    return (
        <>
            <Head title={pagamento.payment_ref} />

            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm"><ArrowLeft style={{ width: 14, height: 14 }} /></Link>
                        <div>
                            <h1 className="page-title">{pagamento.payment_ref}</h1>
                            <p className="page-subtitle">{pagamento.period}</p>
                        </div>
                    </div>
                    <span className="pill pill-info">{pagamento.status}</span>
                </div>

                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-head">
                        <span className="card-title">Detalhe do Pagamento</span>
                    </div>
                    <div className="card-pad">
                        <div className="row-between">
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
                            <span className="muted">Tipo</span>
                            <span><span className="pill pill-neutral">{pagamento.type}</span></span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Valor</span>
                            <span style={{ fontWeight: 500 }}>
                                {parseFloat(pagamento.amount).toLocaleString('pt-PT')} {pagamento.currency}
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
            </div>
        </>
    );
}

PagamentosShow.layout = {
    breadcrumbs: [{ title: 'Pagamentos' }],
};
