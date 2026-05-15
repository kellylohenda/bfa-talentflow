import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, Plus, X, XCircle } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create, index, show, update } from '@/routes/faltas';
import type { Absence, Paginated } from '@/types';

type Filters = { status?: string; type?: string };
type Props = { faltas: Paginated<Absence>; filters: Filters };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendente: 'outline',
    aprovado: 'default',
    rejeitado: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function FaltasIndex({ faltas, filters }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.type);

    function handleApprove(falta: Absence) {
        if (confirm(`Aprovar falta de "${falta.talent?.name}"?`)) {
            router.patch(update({ falta: falta.id }).url, { status: 'aprovado' });
        }
    }

    function handleReject(falta: Absence) {
        if (confirm(`Rejeitar falta de "${falta.talent?.name}"?`)) {
            router.patch(update({ falta: falta.id }).url, { status: 'rejeitado' });
        }
    }

    return (
        <>
            <Head title="Faltas" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Faltas" description="Gestão de faltas e ausências" />
                    <Button asChild>
                        <Link href={create(team).url}><Plus className="h-4 w-4" /> Nova Falta</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="aprovado">Aprovado</SelectItem>
                            <SelectItem value="rejeitado">Rejeitado</SelectItem>
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
                                <th className="px-4 py-3 text-left font-medium">Talento</th>
                                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium">Data Início</th>
                                <th className="px-4 py-3 text-left font-medium">Data Fim</th>
                                <th className="px-4 py-3 text-left font-medium">Justificado</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {faltas.data.map((f) => (
                                <tr key={f.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{f.talent?.name ?? '—'}</td>
                                    <td className="px-4 py-3 capitalize text-muted-foreground">{f.type}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(f.start_date).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(f.end_date).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {f.justificado ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[f.status] ?? 'secondary'}>{f.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {f.status === 'pendente' && (
                                                <>
                                                    <Button variant="ghost" size="sm" onClick={() => handleApprove(f)}>
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleReject(f)}>
                                                        <XCircle className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {faltas.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                        Nenhuma falta encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={faltas.links} filters={clean(filters)} />
            </div>
        </>
    );
}

FaltasIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Faltas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
