import { Head, router, usePage } from '@inertiajs/react';
import { Building, Calendar, User, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index } from '@/routes/estagiarios';
import type { Paginated, Talent, Rotation } from '@/types';

type Filters = { status?: string; department_id?: string };
type Props = { estagiarios: Paginated<Talent & { rotations: Rotation[] }>; filters: Filters };

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function EstagiariosIndex({ estagiarios, filters }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.department_id);

    return (
        <>
            <Head title="Estagiários" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Estagiários" description="Gestão de estágios e rotações" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="suspenso">Suspenso</SelectItem>
                            <SelectItem value="concluido">Concluído</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={() => router.get(index(team).url, {})} className="h-8 gap-1 text-muted-foreground">
                            <X className="h-3 w-3" /> Limpar
                        </Button>
                    )}
                </div>

                <div className="space-y-3">
                    {estagiarios.data.map((e) => (
                        <div key={e.id} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{e.name}</p>
                                        <p className="text-xs text-muted-foreground">{e.talent_code}</p>
                                    </div>
                                </div>
                                <Badge variant={e.status === 'activo' ? 'default' : 'secondary'}>{e.status}</Badge>
                            </div>
                            {e.rotations.length > 0 && (
                                <div className="mt-3 space-y-1.5">
                                    <p className="text-xs font-medium text-muted-foreground">Rotações</p>
                                    {e.rotations.map((r) => (
                                        <div key={r.id} className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2 text-sm">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{r.department?.name ?? '—'}</span>
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {new Date(r.start_date).toLocaleDateString('pt-PT')}
                                                {r.end_date ? ` — ${new Date(r.end_date).toLocaleDateString('pt-PT')}` : ''}
                                            </span>
                                            <Badge variant="outline" className="ml-auto">{r.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {estagiarios.data.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground">Nenhum estagiário encontrado.</div>
                    )}
                </div>

                <TablePagination links={estagiarios.links} filters={clean(filters)} />
            </div>
        </>
    );
}

EstagiariosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Estagiários', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
