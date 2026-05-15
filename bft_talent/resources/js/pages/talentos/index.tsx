import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create, destroy, edit, index, show } from '@/routes/talentos';
import type { Paginated, Talent } from '@/types';

type Filters = { kind?: string; status?: string; search?: string };
type Props = { talents: Paginated<Talent>; filters: Filters };

const kindLabel: Record<string, string> = { bolseiro: 'Bolseiro', estagiario: 'Estagiário' };
const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    activo: 'default',
    suspenso: 'outline',
    concluido: 'secondary',
    cancelado: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function TalentosIndex({ talents, filters }: Props) {
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

    const hasFilters = !!(filters.search || filters.kind || filters.status);

    function handleDelete(talent: Talent) {
        if (confirm(`Apagar talento "${talent.name}"?`)) {
            router.delete(destroy(talent.id).url);
        }
    }

    return (
        <>
            <Head title="Talentos" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Talentos" description="Gestão de bolseiros e estagiários" />
                    <Button asChild>
                        <Link href={create().url}><Plus className="h-4 w-4" /> Novo Talento</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Pesquisar por nome…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 w-56"
                    />
                    <Select value={filters.kind || 'all'} onValueChange={(v) => setFilter('kind', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="bolseiro">Bolseiro</SelectItem>
                            <SelectItem value="estagiario">Estagiário</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="suspenso">Suspenso</SelectItem>
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
                                <th className="px-4 py-3 text-left font-medium">Código</th>
                                <th className="px-4 py-3 text-left font-medium">Nome</th>
                                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium">Programa</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Mentor</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {talents.data.map((talent) => (
                                <tr key={talent.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{talent.talent_code}</td>
                                    <td className="px-4 py-3 font-medium">{talent.name}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline">{kindLabel[talent.kind] ?? talent.kind}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{talent.program?.name ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[talent.status] ?? 'secondary'}>{talent.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{talent.mentor?.name ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={show(talent.id).url}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={edit(talent.id).url}><Pencil className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(talent)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {talents.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
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

TalentosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Talentos', href: index().url }],
});
