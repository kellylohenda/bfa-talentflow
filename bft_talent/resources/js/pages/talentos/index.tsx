import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import { BfaAvatar } from '@/components/ui/avatar';
import { create, destroy, edit, index, show } from '@/routes/talentos';
import type { Paginated, Talent } from '@/types';

type Filters = { kind?: string; status?: string; search?: string };
type Props = { talents: Paginated<Talent>; filters: Filters };

const kindLabel: Record<string, string> = { bolseiro: 'Bolseiro', estagiario: 'Estagiário' };

const statusTone: Record<string, string> = {
    activo: 'success',
    suspenso: 'warn',
    concluido: 'info',
    cancelado: 'danger',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function TalentosIndex({ talents, filters }: Props) {
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

    const hasFilters = !!(filters.search || filters.kind || filters.status);

    function handleDelete(talent: Talent) {
        if (confirm(`Apagar talento "${talent.name}"?`)) {
            router.delete(destroy(talent.id).url);
        }
    }

    return (
        <>
            <Head title="Talentos" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Talentos</h1>
                        <p className="page-subtitle">Gestão de bolseiros e estagiários</p>
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary">
                            <Plus size={14} /> Novo Talento
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="toolbar">
                    <input
                        className="input input-search"
                        placeholder="Pesquisar por nome…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="input select"
                        value={filters.kind || ''}
                        onChange={(e) => setFilter('kind', e.target.value)}
                    >
                        <option value="">Todos os tipos</option>
                        <option value="bolseiro">Bolseiro</option>
                        <option value="estagiario">Estagiário</option>
                    </select>
                    <select
                        className="input select"
                        value={filters.status || ''}
                        onChange={(e) => setFilter('status', e.target.value)}
                    >
                        <option value="">Todos os estados</option>
                        <option value="activo">Activo</option>
                        <option value="suspenso">Suspenso</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                            <X size={12} /> Limpar
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Tipo</th>
                                <th>Programa</th>
                                <th>Estado</th>
                                <th>Mentor</th>
                                <th style={{ textAlign: 'right' }}>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {talents.data.map((talent) => (
                                <tr key={talent.id}>
                                    <td className="mono" style={{ fontSize: 11 }}>{talent.talent_code}</td>
                                    <td>
                                        <div className="cell-person">
                                            <BfaAvatar name={talent.name} size={26} />
                                            <div className="meta">
                                                <b>{talent.name}</b>
                                                <span>{talent.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="pill pill-primary">{kindLabel[talent.kind] ?? talent.kind}</span>
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>{talent.program?.name ?? '—'}</td>
                                    <td>
                                        <span className={`pill pill-${statusTone[talent.status] ?? 'neutral'}`}>
                                            {talent.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>{talent.mentor?.name ?? '—'}</td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                                            <Link href={show(talent.id).url} className="btn btn-ghost btn-sm" title="Ver">
                                                <Eye size={14} />
                                            </Link>
                                            <Link href={edit(talent.id).url} className="btn btn-ghost btn-sm" title="Editar">
                                                <Pencil size={14} />
                                            </Link>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(talent)} title="Apagar">
                                                <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {talents.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>
                                        Nenhum talento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={talents.links} filters={clean(filters)} />
            </div>
        </>
    );
}

TalentosIndex.layout = () => ({
    breadcrumbs: [{ title: 'Talentos', href: index().url }],
});
