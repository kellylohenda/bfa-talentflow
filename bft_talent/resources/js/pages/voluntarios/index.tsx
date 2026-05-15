import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, Trash2, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create, destroy, index, show } from '@/routes/voluntarios';
import type { Paginated, Volunteer } from '@/types';

type Filters = { status?: string; area?: string; search?: string };
type Props = { voluntarios: Paginated<Volunteer>; filters: Filters };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    activo: 'default',
    inactivo: 'secondary',
    suspenso: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function VoluntariosIndex({ voluntarios, filters }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status);

    function handleDelete(v: Volunteer) {
        if (confirm(`Apagar voluntário "${v.nome}"?`)) {
            router.delete(destroy([team, v.id]).url);
        }
    }

    return (
        <>
            <Head title="Voluntários" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Voluntários" description="Gestão de voluntários" />
                    <Button asChild>
                        <Link href={create(team).url}><Plus className="h-4 w-4" /> Novo Voluntário</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="inactivo">Inactivo</SelectItem>
                            <SelectItem value="suspenso">Suspenso</SelectItem>
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
                                <th className="px-4 py-3 text-left font-medium">Nome</th>
                                <th className="px-4 py-3 text-left font-medium">Área</th>
                                <th className="px-4 py-3 text-left font-medium">Horas</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Mentor</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {voluntarios.data.map((v) => (
                                <tr key={v.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.volunteer_code}</td>
                                    <td className="px-4 py-3 font-medium">{v.nome}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{v.area_actuacao}</td>
                                    <td className="px-4 py-3">{parseFloat(v.total_horas).toFixed(0)}h</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[v.status] ?? 'secondary'}>{v.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{v.mentor?.name ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={show([team, v.id]).url}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(v)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {voluntarios.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
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

VoluntariosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Voluntários', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
