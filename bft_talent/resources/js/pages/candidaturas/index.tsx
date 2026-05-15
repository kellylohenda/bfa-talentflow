import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create, destroy, index, show } from '@/routes/candidaturas';
import type { Application, Paginated } from '@/types';

type Filters = { stage?: string; tipo?: string; search?: string };
type Props = { candidaturas: Paginated<Application>; filters: Filters };

const stageVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    analise: 'outline',
    entrevista: 'secondary',
    avaliacao: 'secondary',
    oferta: 'default',
    convertido: 'default',
    rejeitado: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function CandidaturasIndex({ candidaturas, filters }: Props) {
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

    const hasFilters = !!(filters.search || filters.stage || filters.tipo);

    function handleDelete(c: Application) {
        if (confirm(`Apagar candidatura de "${c.name}"?`)) {
            router.delete(destroy(c.id).url);
        }
    }

    return (
        <>
            <Head title="Candidaturas" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Candidaturas" description="Gestão de candidaturas ao programa" />
                    <Button asChild>
                        <Link href={create().url}><Plus className="h-4 w-4" /> Nova Candidatura</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Pesquisar por nome…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 w-56"
                    />
                    <Select value={filters.stage || 'all'} onValueChange={(v) => setFilter('stage', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Fase" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as fases</SelectItem>
                            <SelectItem value="analise">Análise</SelectItem>
                            <SelectItem value="entrevista">Entrevista</SelectItem>
                            <SelectItem value="avaliacao">Avaliação</SelectItem>
                            <SelectItem value="oferta">Oferta</SelectItem>
                            <SelectItem value="convertido">Convertido</SelectItem>
                            <SelectItem value="rejeitado">Rejeitado</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.tipo || 'all'} onValueChange={(v) => setFilter('tipo', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="bolseiro">Bolseiro</SelectItem>
                            <SelectItem value="estagiario">Estagiário</SelectItem>
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
                                <th className="px-4 py-3 text-left font-medium">Nome</th>
                                <th className="px-4 py-3 text-left font-medium">E-mail</th>
                                <th className="px-4 py-3 text-left font-medium">Programa</th>
                                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Data</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {candidaturas.data.map((c) => (
                                <tr key={c.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{c.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{c.program?.name ?? '—'}</td>
                                    <td className="px-4 py-3">{c.tipo && <Badge variant="outline">{c.tipo}</Badge>}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={stageVariant[c.stage] ?? 'secondary'}>{c.stage}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(c.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={show(c.id).url}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(c)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {candidaturas.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                        Nenhuma candidatura encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={candidaturas.links} filters={clean(filters)} />
            </div>
        </>
    );
}

CandidaturasIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Candidaturas', href: index().url }],
});
