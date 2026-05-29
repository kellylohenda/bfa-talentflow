import { Head, Link, router } from '@inertiajs/react';
import { Building, Calendar, Eye, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { BfaAvatar } from '@/components/ui/avatar';
import { index } from '@/routes/estagiarios';
import { show } from '@/routes/talentos';
import type { Paginated, Talent, Rotation } from '@/types';

type Filters = { status?: string; department_id?: string };
type Props = { estagiarios: Paginated<Talent & { rotations: Rotation[] }>; filters: Filters };

const statusTone: Record<string, string> = {
    activo: 'success',
    suspenso: 'warn',
    concluido: 'info',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function EstagiariosIndex({ estagiarios, filters }: Props) {
    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.department_id);

    return (
        <>
            <Head title="Estagiários" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Estagiários</h1>
                        <p className="page-subtitle">Gestão de estágios e rotações</p>
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
                        <option value="suspenso">Suspenso</option>
                        <option value="concluido">Concluído</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={() => router.get(index().url, {})}>
                            <X size={12} /> Limpar
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {estagiarios.data.map((e) => (
                        <div key={e.id} className="card">
                            <div className="card-pad">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <BfaAvatar name={e.name} size={36} />
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{e.name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{e.talent_code}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className={`pill pill-${statusTone[e.status] ?? 'neutral'}`}>{e.status}</span>
                                        <Link href={show(e.id).url} className="btn btn-ghost btn-sm"><Eye size={14} /></Link>
                                    </div>
                                </div>
                                {e.rotations.length > 0 && (
                                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)' }}>Rotações</div>
                                        {e.rotations.map((r) => (
                                            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 6, fontSize: 14 }}>
                                                <Building size={14} style={{ color: 'var(--text-3)' }} />
                                                <span style={{ fontWeight: 500 }}>{r.department?.name ?? '—'}</span>
                                                <Calendar size={14} style={{ color: 'var(--text-3)' }} />
                                                <span style={{ color: 'var(--text-2)' }}>
                                                    {new Date(r.start_date).toLocaleDateString('pt-PT')}
                                                    {r.end_date ? ` — ${new Date(r.end_date).toLocaleDateString('pt-PT')}` : ''}
                                                </span>
                                                <span className="pill pill-info" style={{ marginLeft: 'auto' }}>{r.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {estagiarios.data.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>Nenhum estagiário encontrado.</div>
                    )}
                </div>

                <TablePagination links={estagiarios.links} filters={clean(filters)} />
            </div>
        </>
    );
}

EstagiariosIndex.layout = () => ({
    breadcrumbs: [{ title: 'Estagiários', href: index().url }],
});
