import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Trash2, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { BfaAvatar } from '@/components/ui/avatar';
import { create, destroy, index, show } from '@/routes/voluntarios';
import type { Paginated, Volunteer } from '@/types';

type Filters = { status?: string; area?: string; search?: string };
type Props = { voluntarios: Paginated<Volunteer>; filters: Filters };

const statusTone: Record<string, string> = {
    activo: 'success',
    inactivo: 'neutral',
    suspenso: 'danger',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function VoluntariosIndex({ voluntarios, filters }: Props) {
    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status);

    function handleDelete(v: Volunteer) {
        if (confirm(`Apagar voluntário "${v.nome}"?`)) {
            router.delete(destroy(v.id).url);
        }
    }

    return (
        <>
            <Head title="Voluntários" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Voluntários</h1>
                        <p className="page-subtitle">Gestão de voluntários</p>
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary">
                            <Plus size={14} /> Novo Voluntário
                        </Link>
                    </div>
                </div>

                <div className="toolbar">
                    <select
                        className="input select"
                        value={filters.status || ''}
                        onChange={(e) => setFilter('status', e.target.value)}
                    >
                        <option value="">Todos os estados</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="suspenso">Suspenso</option>
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
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Área</th>
                                <th>Horas</th>
                                <th>Estado</th>
                                <th>Mentor</th>
                                <th style={{ textAlign: 'right' }}>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voluntarios.data.map((v) => (
                                <tr key={v.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-3)' }}>{v.volunteer_code}</td>
                                    <td>
                                        <div className="cell-person">
                                            <BfaAvatar name={v.nome} size={26} />
                                            <div className="meta">
                                                <b>{v.nome}</b>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>{v.area_actuacao}</td>
                                    <td>{parseFloat(v.total_horas).toFixed(0)}h</td>
                                    <td>
                                        <span className={`pill pill-${statusTone[v.status] ?? 'neutral'}`}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>{v.mentor?.name ?? '—'}</td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                                            <Link href={show(v.id).url} className="btn btn-ghost btn-sm" title="Ver">
                                                <Eye size={14} />
                                            </Link>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v)} title="Apagar">
                                                <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {voluntarios.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>
                                        Nenhum voluntário encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={voluntarios.links} filters={clean(filters)} />
            </div>
        </>
    );
}

VoluntariosIndex.layout = () => ({
    breadcrumbs: [{ title: 'Voluntários', href: index().url }],
});
