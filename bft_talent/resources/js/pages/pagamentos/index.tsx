import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { BfaAvatar } from '@/components/ui/avatar';
import { create, index, show } from '@/routes/pagamentos';
import type { Paginated, Payment } from '@/types';

type Filters = { status?: string; period?: string; talent_id?: string };
type Props = { pagamentos: Paginated<Payment>; filters: Filters };

const statusTone: Record<string, string> = {
    pendente: 'warn',
    processado: 'info',
    pago: 'success',
    cancelado: 'danger',
};

const statusLabel: Record<string, string> = {
    pendente: 'Pendente',
    processado: 'Processado',
    pago: 'Pago',
    cancelado: 'Cancelado',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function PagamentosIndex({ pagamentos, filters }: Props) {
    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.period);

    return (
        <>
            <Head title="Pagamentos" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Pagamentos</h1>
                        <p className="page-subtitle">Gestão de bolsas e subsídios</p>
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary">
                            <Plus size={14} /> Novo Pagamento
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="toolbar">
                    <select
                        className="input select"
                        value={filters.status || ''}
                        onChange={(e) => setFilter('status', e.target.value)}
                    >
                        <option value="">Todos os estados</option>
                        <option value="pendente">Pendente</option>
                        <option value="processado">Processado</option>
                        <option value="pago">Pago</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={() => router.get(index().url, {})}>
                            <X size={12} /> Limpar
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Referência</th>
                                <th>Talento</th>
                                <th>Período</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagamentos.data.map((p) => (
                                <tr key={p.id}>
                                    <td className="mono" style={{ fontSize: 11 }}>{p.payment_ref}</td>
                                    <td>
                                        <div className="cell-person">
                                            <BfaAvatar name={p.talent?.name ?? 'N/A'} size={26} />
                                            <div className="meta">
                                                <b>{p.talent?.name ?? '—'}</b>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>{p.period}</td>
                                    <td><span className="pill pill-neutral">{p.type}</span></td>
                                    <td style={{ fontWeight: 600 }}>
                                        {parseFloat(p.amount).toLocaleString('pt-AO')} {p.currency}
                                    </td>
                                    <td>
                                        <span className={`pill pill-${statusTone[p.status] ?? 'neutral'}`}>
                                            {statusLabel[p.status] ?? p.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Link href={show(p.id).url} className="btn btn-ghost btn-sm" title="Ver">
                                                <Eye size={14} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pagamentos.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>
                                        Nenhum pagamento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={pagamentos.links} filters={clean(filters)} />
            </div>
        </>
    );
}

PagamentosIndex.layout = () => ({
    breadcrumbs: [{ title: 'Pagamentos', href: index().url }],
});
