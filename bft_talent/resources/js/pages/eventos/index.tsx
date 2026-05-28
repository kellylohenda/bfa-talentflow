import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import { create, index, show } from '@/routes/eventos';
import type { Evento, Paginated } from '@/types';

type Filters = { status?: string; tipo?: string; search?: string };
type Props = { eventos: Paginated<Evento>; filters: Filters };

const statusTone: Record<string, string> = {
    planeado: 'info',
    confirmado: 'success',
    concluido: 'neutral',
    cancelado: 'danger',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function EventosIndex({ eventos, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const mounted = useRef(false);

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;

            return;
        }

        const t = setTimeout(() => {
            router.get(index().url, clean({ ...filters, search }), { preserveState: true, replace: true });
        }, 350);

        return () => clearTimeout(t);
    }, [search]);

    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    function clearFilters() {
        setSearch('');
        router.get(index().url, {}, { preserveState: false, replace: true });
    }

    const hasFilters = !!(filters.search || filters.tipo || filters.status);

    return (
        <>
            <Head title="Eventos" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Eventos</h1>
                        <p className="page-subtitle">Formações, workshops e actividades</p>
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary">
                            <Plus size={14} /> Novo Evento
                        </Link>
                    </div>
                </div>

                <div className="toolbar">
                    <input
                        className="input input-search"
                        placeholder="Pesquisar por título…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="input select"
                        value={filters.tipo || ''}
                        onChange={(e) => setFilter('tipo', e.target.value)}
                    >
                        <option value="">Todos os tipos</option>
                        <option value="formacao">Formação</option>
                        <option value="palestra">Palestra</option>
                        <option value="workshop">Workshop</option>
                        <option value="networking">Networking</option>
                        <option value="outro">Outro</option>
                    </select>
                    <select
                        className="input select"
                        value={filters.status || ''}
                        onChange={(e) => setFilter('status', e.target.value)}
                    >
                        <option value="">Todos os estados</option>
                        <option value="planeado">Planeado</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                            <X size={12} /> Limpar
                        </button>
                    )}
                </div>

                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Tipo</th>
                                <th>Formato</th>
                                <th>Estado</th>
                                <th>Data</th>
                                <th>Vagas</th>
                                <th style={{ textAlign: 'right' }}>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.data.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.titulo}</td>
                                    <td style={{ color: 'var(--text-2)', textTransform: 'capitalize' }}>{e.tipo}</td>
                                    <td style={{ color: 'var(--text-2)', textTransform: 'capitalize' }}>{e.formato}</td>
                                    <td>
                                        <span className={`pill pill-${statusTone[e.status] ?? 'neutral'}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>
                                        {new Date(e.data_inicio).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>{e.vagas ?? '—'}</td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Link href={show(e.id).url} className="btn btn-ghost btn-sm" title="Ver">
                                                <Eye size={14} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {eventos.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>
                                        Nenhum evento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={eventos.links} filters={clean(filters)} />
            </div>
        </>
    );
}

EventosIndex.layout = () => ({
    breadcrumbs: [{ title: 'Eventos', href: index().url }],
});
