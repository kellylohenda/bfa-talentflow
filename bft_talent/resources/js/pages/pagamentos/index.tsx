import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create, index, show } from '@/routes/pagamentos';
import type { Paginated, Payment } from '@/types';

type Filters = { status?: string; period?: string; talent_id?: string };
type Props = { pagamentos: Paginated<Payment>; filters: Filters };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendente: 'outline',
    processado: 'secondary',
    pago: 'default',
    cancelado: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function PagamentosIndex({ pagamentos, filters }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.period);

    return (
        <>
            <Head title="Pagamentos" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Pagamentos" description="Gestão de bolsas e subsídios" />
                    <Button asChild>
                        <Link href={create(team).url}><Plus className="h-4 w-4" /> Novo Pagamento</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="processado">Processado</SelectItem>
                            <SelectItem value="pago">Pago</SelectItem>
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
                                <th className="px-4 py-3 text-left font-medium">Referência</th>
                                <th className="px-4 py-3 text-left font-medium">Talento</th>
                                <th className="px-4 py-3 text-left font-medium">Período</th>
                                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium">Valor</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {pagamentos.data.map((p) => (
                                <tr key={p.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.payment_ref}</td>
                                    <td className="px-4 py-3 font-medium">{p.talent?.name ?? '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{p.period}</td>
                                    <td className="px-4 py-3"><Badge variant="outline">{p.type}</Badge></td>
                                    <td className="px-4 py-3">
                                        {parseFloat(p.amount).toLocaleString('pt-PT')} {p.currency}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[p.status] ?? 'secondary'}>{p.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={show([team, p.id]).url}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pagamentos.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                        Nenhum pagamento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={pagamentos.links} filters={clean(filters)} />
            </div>
        </>
    );
}

PagamentosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Pagamentos', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
