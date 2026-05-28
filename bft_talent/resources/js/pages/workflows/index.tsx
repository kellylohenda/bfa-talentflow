import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { create, index, show } from '@/routes/workflows';
import type { Paginated, Workflow } from '@/types';

type Filters = { status?: string; type?: string };
type Props = { workflows: Paginated<Workflow>; filters: Filters };

const statusPill: Record<string, string> = {
    pendente: 'pill pill-warn',
    em_aprovacao: 'pill pill-info',
    aprovado: 'pill pill-success',
    rejeitado: 'pill pill-danger',
    cancelado: 'pill pill-danger',
};

const statusLabel: Record<string, string> = {
    pendente: 'Pendente',
    em_aprovacao: 'Em aprovação',
    aprovado: 'Aprovado',
    rejeitado: 'Rejeitado',
    cancelado: 'Cancelado',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function WorkflowsIndex({ workflows, filters }: Props) {
    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.type);

    return (
        <>
            <Head title="Workflows" />
            <div className="section" style={{ padding: '20px 24px 40px' }}>
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Workflows</h1>
                        <p className="page-subtitle">Processos de aprovação</p>
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary"><Plus style={{ width: 14, height: 14 }} /> Novo Workflow</Link>
                    </div>
                </div>

                <div className="toolbar">
                    <select className="input select" style={{ width: 160 }} value={filters.type || ''} onChange={(e) => setFilter('type', e.target.value)}>
                        <option value="">Todos os tipos</option>
                        <option value="pagamento">Pagamento</option>
                        <option value="contrato">Contrato</option>
                        <option value="renovacao">Renovação</option>
                        <option value="rescisao">Rescisão</option>
                        <option value="outro">Outro</option>
                    </select>
                    <select className="input select" style={{ width: 176 }} value={filters.status || ''} onChange={(e) => setFilter('status', e.target.value)}>
                        <option value="">Todos os estados</option>
                        <option value="pendente">Pendente</option>
                        <option value="em_aprovacao">Em aprovação</option>
                        <option value="aprovado">Aprovado</option>
                        <option value="rejeitado">Rejeitado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={() => router.get(index().url, {})} style={{ gap: 4 }}>
                            <X style={{ width: 12, height: 12 }} /> Limpar
                        </button>
                    )}
                </div>

                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Talento</th>
                                <th>Tipo</th>
                                <th>Passo</th>
                                <th>Estado</th>
                                <th>Data</th>
                                <th style={{ textAlign: 'right' }}>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workflows.data.map((w) => (
                                <tr key={w.id}>
                                    <td className="mono muted" style={{ fontSize: 12 }}>{w.workflow_code}</td>
                                    <td style={{ fontWeight: 500 }}>{w.talent?.name ?? '—'}</td>
                                    <td><span className="pill pill-neutral">{w.type}</span></td>
                                    <td className="muted">{w.current_step}/{w.total_steps}</td>
                                    <td>
                                        <span className={statusPill[w.status] ?? 'pill pill-neutral'}>
                                            {statusLabel[w.status] ?? w.status}
                                        </span>
                                    </td>
                                    <td className="muted">
                                        {new Date(w.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Link href={show({ workflow: w.id }).url} className="btn btn-ghost btn-sm">
                                                <Eye style={{ width: 14, height: 14 }} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {workflows.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px 16px' }} className="muted">
                                        Nenhum workflow encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={workflows.links} filters={clean(filters)} />
            </div>
        </>
    );
}

WorkflowsIndex.layout = () => ({
    breadcrumbs: [{ title: 'Workflows', href: index().url }],
});
