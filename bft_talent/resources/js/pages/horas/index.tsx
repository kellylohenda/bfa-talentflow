import { Head, router, usePage } from '@inertiajs/react';
import { Check, X, XCircle } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index } from '@/routes/horas';
import type { HoursEntry, Paginated } from '@/types';

type Filters = { status?: string };
type Props = { horas: Paginated<HoursEntry>; filters: Filters; canValidate: boolean };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendente: 'outline',
    validado: 'default',
    rejeitado: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function HorasIndex({ horas, filters, canValidate }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status);

    function handleValidate(h: HoursEntry, action: 'validado' | 'rejeitado') {
        if (confirm(`${action === 'validado' ? 'Validar' : 'Rejeitar'} horas de "${h.volunteer?.nome}"?`)) {
            router.patch(`/horas/${h.id}`, { status: action });
        }
    }

    return (
        <>
            <Head title="Horas" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Horas de Voluntariado" description="Registo e validação de horas" />

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="validado">Validado</SelectItem>
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
                                <th className="px-4 py-3 text-left font-medium">Voluntário</th>
                                <th className="px-4 py-3 text-left font-medium">Data</th>
                                <th className="px-4 py-3 text-left font-medium">Horas</th>
                                <th className="px-4 py-3 text-left font-medium">Actividade</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                {canValidate && <th className="px-4 py-3 text-right font-medium">Acções</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {horas.data.map((h) => (
                                <tr key={h.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{h.volunteer?.nome ?? '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(h.date).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{parseFloat(h.hours).toFixed(1)}h</td>
                                    <td className="px-4 py-3 text-muted-foreground">{h.activity?.title ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[h.status] ?? 'secondary'}>{h.status}</Badge>
                                    </td>
                                    {canValidate && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                {h.status === 'pendente' && (
                                                    <>
                                                        <Button variant="ghost" size="sm" onClick={() => handleValidate(h, 'validado')}>
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleValidate(h, 'rejeitado')}>
                                                            <XCircle className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {horas.data.length === 0 && (
                                <tr>
                                    <td colSpan={canValidate ? 6 : 5} className="px-4 py-10 text-center text-muted-foreground">
                                        Nenhum registo de horas encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={horas.links} filters={clean(filters)} />
            </div>
        </>
    );
}

HorasIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Horas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
