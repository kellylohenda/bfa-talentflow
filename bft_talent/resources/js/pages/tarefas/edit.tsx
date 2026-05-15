import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, show, update } from '@/routes/tarefas';
import type { Mentor, Talent, Task } from '@/types';

type Props = { tarefa: Task; talents: Talent[]; mentors: Mentor[] };

export default function TarefasEdit({ tarefa, talents, mentors }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, patch, processing, errors } = useForm({
        title: tarefa.title,
        description: tarefa.description ?? '',
        status: tarefa.status,
        priority: tarefa.priority,
        due_date: tarefa.due_date ?? '',
        assigned_to_id: String(tarefa.assigned_to?.id ?? ''),
        talent_id: String(tarefa.talent?.id ?? ''),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(update({ tarefa: tarefa.id }).url);
    }

    return (
        <>
            <Head title={`Editar — ${tarefa.title}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={show({ tarefa: tarefa.id }).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Editar Tarefa" description={tarefa.title} />
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
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v as Task['status'])}>
                                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pendente">Pendente</SelectItem>
                                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                                            <SelectItem value="concluida">Concluída</SelectItem>
                                            <SelectItem value="cancelada">Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="priority">Prioridade</Label>
                                    <Select value={data.priority} onValueChange={(v) => setData('priority', v as Task['priority'])}>
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
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="assigned_to_id">Atribuir a</Label>
                                    <Select value={data.assigned_to_id} onValueChange={(v) => setData('assigned_to_id', v)}>
                                        <SelectTrigger id="assigned_to_id"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
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
                                        <SelectTrigger id="talent_id"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {talents.map((t) => (
                                                <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.talent_id} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
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

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Guardar Alterações</Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={show({ tarefa: tarefa.id }).url}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TarefasEdit.layout = (props: { currentTeam?: { slug: string } | null; tarefa?: Task }) => ({
    breadcrumbs: [
        { title: 'Tarefas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        {
            title: props.tarefa?.title ?? 'Editar',
            href: props.currentTeam && props.tarefa ? show({ tarefa: props.tarefa.id }).url : '/',
        },
        { title: 'Editar', href: '#' },
    ],
});
