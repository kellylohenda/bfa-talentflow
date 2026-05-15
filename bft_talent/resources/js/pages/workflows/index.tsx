import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create, index, show } from '@/routes/workflows';
import type { Paginated, Workflow } from '@/types';

type Filters = { status?: string; type?: string };
type Props = { workflows: Paginated<Workflow>; filters: Filters };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendente: 'outline',
    em_aprovacao: 'secondary',
    aprovado: 'default',
    rejeitado: 'destructive',
    cancelado: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function WorkflowsIndex({ workflows, filters }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.type);

    return (
        <>
            <Head title="Workflows" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Workflows" description="Processos de aprovação" />
                    <Button asChild>
                        <Link href={create(team).url}><Plus className="h-4 w-4" /> Novo Workflow</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.type || 'all'} onValueChange={(v) => setFilter('type', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="pagamento">Pagamento</SelectItem>
                            <SelectItem value="contrato">Contrato</SelectItem>
                            <SelectItem value="renovacao">Renovação</SelectItem>
                            <SelectItem value="rescisao">Rescisão</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-44"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em_aprovacao">Em aprovação</SelectItem>
                            <SelectItem value="aprovado">Aprovado</SelectItem>
                            <SelectItem value="rejeitado">Rejeitado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={() => router.get(index(team).url, {})} className="h-8 gap-1 text-muted-foreground">
                            <X className="h-3 w-3" /> Limpar
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Código</th>
                                <th className="px-4 py-3 text-left font-medium">Talento</th>
                                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium">Passo</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Data</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {workflows.data.map((w) => (
                                <tr key={w.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{w.workflow_code}</td>
                                    <td className="px-4 py-3 font-medium">{w.talent?.name ?? '—'}</td>
                                    <td className="px-4 py-3"><Badge variant="outline">{w.type}</Badge></td>
                                    <td className="px-4 py-3 text-muted-foreground">{w.current_step}/{w.total_steps}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[w.status] ?? 'secondary'}>{w.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(w.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={show([team, w.id]).url}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {workflows.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
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

WorkflowsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Workflows', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
