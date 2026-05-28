import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import { create, destroy, edit, index, show } from '@/routes/tarefas';
import type { Paginated, Task } from '@/types';

type Filters = { status?: string; priority?: string; search?: string };
type Props = { tarefas: Paginated<Task>; filters: Filters };

const statusPill: Record<string, string> = {
    pendente: 'pill pill-neutral',
    em_andamento: 'pill pill-info',
    concluida: 'pill pill-success',
    cancelada: 'pill pill-danger',
};

const statusLabel: Record<string, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    concluida: 'Concluída',
    cancelada: 'Cancelada',
};

const priorityPill: Record<string, string> = {
    baixa: 'pill pill-neutral',
    media: 'pill pill-info',
    alta: 'pill pill-warn',
    urgente: 'pill pill-danger',
};

const priorityLabel: Record<string, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
    urgente: 'Urgente',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function TarefasIndex({ tarefas, filters }: Props) {
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

    const hasFilters = !!(filters.search || filters.status || filters.priority);

    function handleDelete(t: Task) {
        if (confirm(`Apagar tarefa "${t.title}"?`)) {
            router.delete(destroy({ tarefa: t.id }).url);
        }
    }

    return (
        <>
            <Head title="Tarefas" />
            <div className="section" style={{ padding: '20px 24px 40px' }}>
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Tarefas</h1>
                        <p className="page-subtitle">Gestão de tarefas</p>
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary"><Plus style={{ width: 14, height: 14 }} /> Nova Tarefa</Link>
                    </div>
                </div>

                <div className="toolbar">
                    <input
                        className="input input-search"
                        placeholder="Pesquisar por título…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 224 }}
                    />
                    <select className="input select" style={{ width: 144 }} value={filters.status || ''} onChange={(e) => setFilter('status', e.target.value)}>
                        <option value="">Todos os estados</option>
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                    <select className="input select" style={{ width: 152 }} value={filters.priority || ''} onChange={(e) => setFilter('priority', e.target.value)}>
                        <option value="">Todas as prioridades</option>
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ gap: 4 }}>
                            <X style={{ width: 12, height: 12 }} /> Limpar
                        </button>
                    )}
                </div>

                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Estado</th>
                                <th>Prioridade</th>
                                <th>Atribuído a</th>
                                <th>Data Limite</th>
                                <th style={{ textAlign: 'right' }}>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tarefas.data.map((t) => (
                                <tr key={t.id}>
                                    <td style={{ fontWeight: 500 }}>{t.title}</td>
                                    <td>
                                        <span className={statusPill[t.status] ?? 'pill pill-neutral'}>
                                            {statusLabel[t.status] ?? t.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={priorityPill[t.priority] ?? 'pill pill-neutral'}>
                                            {priorityLabel[t.priority] ?? t.priority}
                                        </span>
                                    </td>
                                    <td className="muted">{t.assigned_to?.name ?? '—'}</td>
                                    <td className="muted">
                                        {t.due_date ? new Date(t.due_date).toLocaleDateString('pt-PT') : '—'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                                            <Link href={show({ tarefa: t.id }).url} className="btn btn-ghost btn-sm">
                                                <Eye style={{ width: 14, height: 14 }} />
                                            </Link>
                                            <Link href={edit({ tarefa: t.id }).url} className="btn btn-ghost btn-sm">
                                                <Pencil style={{ width: 14, height: 14 }} />
                                            </Link>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t)}>
                                                <Trash2 style={{ width: 14, height: 14, color: 'var(--danger)' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tarefas.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px' }} className="muted">
                                        Nenhuma tarefa encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={tarefas.links} filters={clean(filters)} />
            </div>
        </>
    );
}

TarefasIndex.layout = () => ({
    breadcrumbs: [{ title: 'Tarefas', href: index().url }],
});
