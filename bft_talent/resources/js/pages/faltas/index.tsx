import { Head, Link, router } from '@inertiajs/react';
import { Check, Plus, X, XCircle } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { BfaAvatar } from '@/components/ui/avatar';
import { create, index, update } from '@/routes/faltas';
import type { Absence, Paginated } from '@/types';

type Filters = { status?: string; type?: string };
type Props = { faltas: Paginated<Absence>; filters: Filters };

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

const pillClass: Record<string, string> = {
    pendente: 'pill pill-warn',
    aprovado: 'pill pill-success',
    rejeitado: 'pill pill-danger',
};

export default function FaltasIndex({ faltas, filters }: Props) {
    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.type);

    function handleApprove(falta: Absence) {
        if (confirm(`Aprovar falta de "${falta.talent?.name}"?`)) {
            router.patch(update({ falta: falta.id }).url, { status: 'aprovado' });
        }
    }

    function handleReject(falta: Absence) {
        if (confirm(`Rejeitar falta de "${falta.talent?.name}"?`)) {
            router.patch(update({ falta: falta.id }).url, { status: 'rejeitado' });
        }
    }

    return (
        <>
            <Head title="Faltas" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Faltas</h1>
                        <p className="page-subtitle">Gestão de faltas e ausências</p>
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary"><Plus /> Nova Falta</Link>
                    </div>
                </div>

                <div className="toolbar">
                    <select className="select" value={filters.status || ''} onChange={(e) => setFilter('status', e.target.value)}>
                        <option value="">Todos os estados</option>
                        <option value="pendente">Pendente</option>
                        <option value="aprovado">Aprovado</option>
                        <option value="rejeitado">Rejeitado</option>
                    </select>
                    {hasFilters && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => router.get(index().url, {})}>
                            <X /> Limpar
                        </button>
                    )}
                </div>

                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Talento</th>
                                <th>Tipo</th>
                                <th>Data Início</th>
                                <th>Data Fim</th>
                                <th>Justificado</th>
                                <th>Estado</th>
                                <th>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faltas.data.map((f) => (
                                <tr key={f.id}>
                                    <td className="cell-person">
                                        <BfaAvatar name={f.talent?.name ?? '—'} size={28} />
                                        <div className="meta">
                                            <b>{f.talent?.name ?? '—'}</b>
                                        </div>
                                    </td>
                                    <td className="muted capitalize">{f.type}</td>
                                    <td className="muted">
                                        {new Date(f.start_date).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="muted">
                                        {new Date(f.end_date).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td>
                                        {f.justificado ? (
                                            <Check className="text-green-600" size={16} />
                                        ) : (
                                            <XCircle className="muted" size={16} />
                                        )}
                                    </td>
                                    <td>
                                        <span className={pillClass[f.status] ?? 'pill pill-neutral'}>{f.status}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-1">
                                            {f.status === 'pendente' && (
                                                <>
                                                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleApprove(f)}>
                                                        <Check className="text-green-600" size={16} />
                                                    </button>
                                                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleReject(f)}>
                                                        <XCircle className="text-red-600" size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {faltas.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center muted" style={{ padding: '2rem 0' }}>
                                        Nenhuma falta encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={faltas.links} filters={clean(filters)} />
            </div>
        </>
    );
}

FaltasIndex.layout = () => ({
    breadcrumbs: [{ title: 'Faltas', href: index().url }],
});
