import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/tarefas';
import type { Mentor, Talent } from '@/types';

type Props = { talents: Talent[]; mentors: Mentor[] };

export default function TarefasCreate({ talents, mentors }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        priority: 'media' as string,
        due_date: '',
        assigned_to_id: '',
        talent_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url);
    }

    return (
        <>
            <Head title="Nova Tarefa" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Nova Tarefa" description="Criar nova tarefa" />
                </div>

                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    autoFocus
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="description">Descrição</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="priority">Prioridade *</Label>
                                    <Select value={data.priority} onValueChange={(v) => setData('priority', v)}>
                                        <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="baixa">Baixa</SelectItem>
                                            <SelectItem value="media">Média</SelectItem>
                                            <SelectItem value="alta">Alta</SelectItem>
                                            <SelectItem value="urgente">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.priority} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="due_date">Data Limite</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                    <InputError message={errors.due_date} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="assigned_to_id">Atribuir a</Label>
                                    <Select value={data.assigned_to_id} onValueChange={(v) => setData('assigned_to_id', v)}>
                                        <SelectTrigger id="assigned_to_id"><SelectValue placeholder="Seleccionar mentor" /></SelectTrigger>
                                        <SelectContent>
                                            {mentors.map((m) => (
                                                <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.assigned_to_id} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="talent_id">Talento</Label>
                                    <Select value={data.talent_id} onValueChange={(v) => setData('talent_id', v)}>
                                        <SelectTrigger id="talent_id"><SelectValue placeholder="Seleccionar talento" /></SelectTrigger>
                                        <SelectContent>
                                            {talents.map((t) => (
                                                <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.talent_id} />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Criar Tarefa</Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={index(team).url}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TarefasCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Tarefas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        { title: 'Nova', href: '#' },
    ],
});
