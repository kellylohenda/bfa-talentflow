import { Head, router } from '@inertiajs/react';
import { Check, X, XCircle } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { index } from '@/routes/horas';
import type { HoursEntry, Paginated } from '@/types';

type Filters = { status?: string };
type Props = { horas: Paginated<HoursEntry>; filters: Filters; canValidate: boolean };

const statusTone: Record<string, string> = {
    pendente: 'warn',
    validado: 'success',
    rejeitado: 'danger',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function HorasIndex({ horas, filters, canValidate }: Props) {
    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status);

    function handleValidate(h: HoursEntry, action: 'validado' | 'rejeitado') {
        if (confirm(`${action === 'validado' ? 'Validar' : 'Rejeitar'} horas de "${h.volunteer?.nome}"?`)) {
            router.patch(`/horas/${h.id}`, { status: action });
        }
    }

    return (
        <>
            <Head title="Horas" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Horas de Voluntariado</h1>
                        <p className="page-subtitle">Registo e validação de horas</p>
                    </div>
                </div>

                <div className="toolbar">
                    <select
                        className="input select"
                        value={filters.status || ''}
                        onChange={(e) => setFilter('status', e.target.value)}
                    >
                        <option value="">Todos os estados</option>
                        <option value="pendente">Pendente</option>
                        <option value="validado">Validado</option>
                        <option value="rejeitado">Rejeitado</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={() => router.get(index().url, {})}>
                            <X size={12} /> Limpar
                        </button>
                    )}
                </div>

                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Voluntário</th>
                                <th>Data</th>
                                <th>Horas</th>
                                <th>Actividade</th>
                                <th>Estado</th>
                                {canValidate && <th style={{ textAlign: 'right' }}>Acções</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {horas.data.map((h) => (
                                <tr key={h.id}>
                                    <td>{h.volunteer?.nome ?? '—'}</td>
                                    <td style={{ color: 'var(--text-2)' }}>
                                        {new Date(h.date).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{parseFloat(h.hours).toFixed(1)}h</td>
                                    <td style={{ color: 'var(--text-2)' }}>{h.activity?.title ?? '—'}</td>
                                    <td>
                                        <span className={`pill pill-${statusTone[h.status] ?? 'neutral'}`}>
                                            {h.status}
                                        </span>
                                    </td>
                                    {canValidate && (
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                                                {h.status === 'pendente' && (
                                                    <>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => handleValidate(h, 'validado')} title="Validar">
                                                            <Check size={14} style={{ color: 'var(--success)' }} />
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => handleValidate(h, 'rejeitado')} title="Rejeitar">
                                                            <XCircle size={14} style={{ color: 'var(--danger)' }} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {horas.data.length === 0 && (
                                <tr>
                                    <td colSpan={canValidate ? 6 : 5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>
                                        Nenhum registo de horas encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={horas.links} filters={clean(filters)} />
            </div>
        </>
    );
}

HorasIndex.layout = () => ({
    breadcrumbs: [{ title: 'Horas', href: index().url }],
});
