import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create, destroy, edit, index, show } from '@/routes/tarefas';
import type { Paginated, Task } from '@/types';

type Filters = { status?: string; priority?: string; search?: string };
type Props = { tarefas: Paginated<Task>; filters: Filters };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendente: 'outline',
    em_andamento: 'secondary',
    concluida: 'default',
    cancelada: 'destructive',
};

const priorityVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    baixa: 'secondary',
    media: 'outline',
    alta: 'default',
    urgente: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function TarefasIndex({ tarefas, filters }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const [search, setSearch] = useState(filters.search ?? '');
    const mounted = useRef(false);

    useEffect(() => {
        if (!mounted.current) { mounted.current = true; return; }
        const t = setTimeout(() => {
            router.get(index(team).url, clean({ ...filters, search }), { preserveState: true, replace: true });
        }, 350);
        return () => clearTimeout(t);
    }, [search]);

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    function clearFilters() {
        setSearch('');
        router.get(index(team).url, {}, { preserveState: false, replace: true });
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
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Tarefas" description="Gestão de tarefas" />
                    <Button asChild>
                        <Link href={create(team).url}><Plus className="h-4 w-4" /> Nova Tarefa</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Pesquisar por título…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 w-56"
                    />
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.priority || 'all'} onValueChange={(v) => setFilter('priority', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Prioridade" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as prioridades</SelectItem>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                            <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1 text-muted-foreground">
                            <X className="h-3 w-3" /> Limpar
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Título</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Prioridade</th>
                                <th className="px-4 py-3 text-left font-medium">Atribuído a</th>
                                <th className="px-4 py-3 text-left font-medium">Data Limite</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tarefas.data.map((t) => (
                                <tr key={t.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{t.title}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[t.status] ?? 'secondary'}>{t.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={priorityVariant[t.priority] ?? 'outline'}>{t.priority}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{t.assigned_to?.name ?? '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {t.due_date ? new Date(t.due_date).toLocaleDateString('pt-PT') : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={show({ tarefa: t.id }).url}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={edit({ tarefa: t.id }).url}><Pencil className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(t)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tarefas.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
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

TarefasIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Tarefas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
