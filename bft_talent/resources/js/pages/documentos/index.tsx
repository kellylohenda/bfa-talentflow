import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { destroy, index, show } from '@/routes/documentos';
import type { Document, Paginated } from '@/types';

type Filters = { status?: string; category?: string };
type Props = { documentos: Paginated<Document>; filters: Filters };

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

const pillClass: Record<string, string> = {
    pendente: 'pill pill-warn',
    aprovado: 'pill pill-success',
    rejeitado: 'pill pill-danger',
};

export default function DocumentosIndex({ documentos, filters }: Props) {
    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.category);

    function handleDelete(d: Document) {
        if (confirm(`Remover documento "${d.name}"?`)) {
            router.delete(destroy({ documento: d.id }).url);
        }
    }

    return (
        <>
            <Head title="Documentos" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Documentos</h1>
                        <p className="page-subtitle">Gestão de documentos</p>
                    </div>
                </div>

                <div className="toolbar">
                    <select className="input select" value={filters.status || ''} onChange={(e) => setFilter('status', e.target.value)}>
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
                                <th>Título</th>
                                <th>Categoria</th>
                                <th>Estado</th>
                                <th>Tipo</th>
                                <th>Data</th>
                                <th>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentos.data.map((d) => (
                                <tr key={d.id}>
                                    <td><b>{d.name}</b></td>
                                    <td className="muted">{d.category}</td>
                                    <td>
                                        <span className={pillClass[d.status] ?? 'pill pill-neutral'}>{d.status}</span>
                                    </td>
                                    <td className="muted">{d.owner_type.split('\\').pop()}</td>
                                    <td className="muted">
                                        {new Date(d.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                                            <Link href={show({ documento: d.id }).url} className="btn btn-ghost btn-sm">
                                                <Eye size={16} />
                                            </Link>
                                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleDelete(d)}>
                                                <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {documentos.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        Nenhum documento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={documentos.links} filters={clean(filters)} />
            </div>
        </>
    );
}

DocumentosIndex.layout = () => ({
    breadcrumbs: [{ title: 'Documentos', href: index().url }],
});
