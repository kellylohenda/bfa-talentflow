import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Trash2, X } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { destroy, index, show } from '@/routes/documentos';
import type { Document, Paginated } from '@/types';

type Filters = { status?: string; category?: string };
type Props = { documentos: Paginated<Document>; filters: Filters };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    aprovado: 'default',
    pendente: 'secondary',
    rejeitado: 'destructive',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function DocumentosIndex({ documentos, filters }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.status || filters.category);

    function handleDelete(d: Document) {
        if (confirm(`Remover documento "${d.name}"?`)) {
            router.delete(destroy({ documento: d.id }).url);
        }
    }

    return (
        <>
            <Head title="Documentos" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Documentos" description="Gestão de documentos" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.status || 'all'} onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
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
                                <th className="px-4 py-3 text-left font-medium">Título</th>
                                <th className="px-4 py-3 text-left font-medium">Categoria</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium">Data</th>
                                <th className="px-4 py-3 text-right font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {documentos.data.map((d) => (
                                <tr key={d.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{d.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{d.category}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[d.status] ?? 'secondary'}>{d.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{d.owner_type.split('\\').pop()}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(d.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={show({ documento: d.id }).url}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(d)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {documentos.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                                        Nenhum documento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={documentos.links} filters={clean(filters)} />
            </div>
        </>
    );
}

DocumentosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Documentos', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
