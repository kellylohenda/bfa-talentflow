import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create, index, show } from '@/routes/eventos';
import type { Evento, Paginated } from '@/types';

type Filters = { status?: string; tipo?: string; search?: string };
type Props = { eventos: Paginated<Evento>; filters: Filters };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    planeado: 'secondary',
    confirmado: 'default',
    concluido: 'default',
    cancelado: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function EventosIndex({ eventos, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const mounted = useRef(false);

    useEffect(() => {
        if (!mounted.current) { mounted.current = true; return; }
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
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Eventos" description="Formações, workshops e actividades" />
                    <Button asChild>
                        <Link href={create().url}><Plus className="h-4 w-4" /> Novo Evento</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Pesquisar por título…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 w-56"
                    />
                    <Select value={filters.tipo || 'all'} onValueChange={(v) => setFilter('tipo', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="formacao">Formação</SelectItem>
                            <SelectItem value="palestra">Palestra</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="planeado">Planeado</SelectItem>
                            <SelectItem value="confirmado">Confirmado</SelectItem>
                            <SelectItem value="concluido">Concluído</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
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
                                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium">Formato</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Data</th>
                                <th className="px-4 py-3 text-left font-medium">Vagas</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {eventos.data.map((e) => (
                                <tr key={e.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{e.titulo}</td>
                                    <td className="px-4 py-3 text-muted-foreground capitalize">{e.tipo}</td>
                                    <td className="px-4 py-3 text-muted-foreground capitalize">{e.formato}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[e.status] ?? 'secondary'}>{e.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(e.data_inicio).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{e.vagas ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={show(e.id).url}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {eventos.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
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
