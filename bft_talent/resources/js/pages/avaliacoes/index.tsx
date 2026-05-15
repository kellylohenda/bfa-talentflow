import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Star, X } from 'lucide-react';
import { useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/avaliacoes';
import type { Avaliacao, Mentor, Paginated, Talent } from '@/types';

type Filters = { periodo?: string; criterio?: string };
type Props = {
    avaliacoes: Paginated<Avaliacao>;
    filters: Filters;
    talents: Talent[];
    mentors: Mentor[];
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function AvaliacoesIndex({ avaliacoes, filters, talents, mentors }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const [modalOpen, setModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        target_id: '',
        reviewer_id: '',
        criterio: '',
        score: '',
        feedback: '',
        periodo: '',
    });

    function setFilter(key: keyof Filters, value: string) {
        router.get(index(team).url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.periodo || filters.criterio);

    function openModal() {
        reset();
        setModalOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url, {
            onSuccess: () => {
                setModalOpen(false);
                reset();
            },
        });
    }

    return (
        <>
            <Head title="Avaliações" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Avaliações 360°" description="Avaliações de desempenho" />
                    <Button onClick={openModal}><Star className="h-4 w-4" /> Nova Avaliação</Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.criterio || 'all'} onValueChange={(v) => setFilter('criterio', v === 'all' ? '' : v)}>
                        <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Critério" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os critérios</SelectItem>
                            <SelectItem value="desempenho">Desempenho</SelectItem>
                            <SelectItem value="competencia">Competência</SelectItem>
                            <SelectItem value="comportamento">Comportamento</SelectItem>
                            <SelectItem value="lideranca">Liderança</SelectItem>
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
                                <th className="px-4 py-3 text-left font-medium">Avaliado</th>
                                <th className="px-4 py-3 text-left font-medium">Avaliador</th>
                                <th className="px-4 py-3 text-left font-medium">Critério</th>
                                <th className="px-4 py-3 text-left font-medium">Pontuação</th>
                                <th className="px-4 py-3 text-left font-medium">Período</th>
                                <th className="px-4 py-3 text-left font-medium">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {avaliacoes.data.map((a) => (
                                <tr key={a.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{a.target?.name ?? '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{a.reviewer?.name ?? '—'}</td>
                                    <td className="px-4 py-3 capitalize text-muted-foreground">{a.criterio}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{a.score !== null ? `${a.score}/100` : '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{a.periodo}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(a.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                </tr>
                            ))}
                            {avaliacoes.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                                        Nenhuma avaliação encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={avaliacoes.links} filters={clean(filters)} />

                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Avaliação</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="target_id">Avaliado *</Label>
                                <Select value={data.target_id} onValueChange={(v) => setData('target_id', v)}>
                                    <SelectTrigger id="target_id"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                    <SelectContent>
                                        {talents.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="reviewer_id">Avaliador *</Label>
                                <Select value={data.reviewer_id} onValueChange={(v) => setData('reviewer_id', v)}>
                                    <SelectTrigger id="reviewer_id"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                    <SelectContent>
                                        {mentors.map((m) => (
                                            <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="criterio">Critério *</Label>
                                    <Select value={data.criterio} onValueChange={(v) => setData('criterio', v)}>
                                        <SelectTrigger id="criterio"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="desempenho">Desempenho</SelectItem>
                                            <SelectItem value="competencia">Competência</SelectItem>
                                            <SelectItem value="comportamento">Comportamento</SelectItem>
                                            <SelectItem value="lideranca">Liderança</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="score">Pontuação (0-100)</Label>
                                    <Input
                                        id="score"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.score}
                                        onChange={(e) => setData('score', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="periodo">Período</Label>
                                <Input
                                    id="periodo"
                                    value={data.periodo}
                                    onChange={(e) => setData('periodo', e.target.value)}
                                    placeholder="ex: 2026-S1"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="feedback">Feedback</Label>
                                <textarea
                                    id="feedback"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.feedback}
                                    onChange={(e) => setData('feedback', e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Guardar Avaliação</Button>
                                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

AvaliacoesIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Avaliações', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
