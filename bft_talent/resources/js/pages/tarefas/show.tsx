import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/tarefas';
import type { Task } from '@/types';

type Props = { tarefa: Task };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendente: 'outline',
    em_andamento: 'secondary',
    concluida: 'default',
    cancelada: 'destructive',
};

const priorityVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    baixa: 'secondary',
    media: 'outline',
    alta: 'default',
    urgente: 'destructive',
};

export default function TarefasShow({ tarefa }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title={tarefa.title} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title={tarefa.title} description={`Prioridade: ${tarefa.priority}`} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Detalhes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estado</span>
                                <Badge variant={statusVariant[tarefa.status] ?? 'secondary'}>{tarefa.status}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Prioridade</span>
                                <Badge variant={priorityVariant[tarefa.priority] ?? 'outline'}>{tarefa.priority}</Badge>
                            </div>
                            {tarefa.due_date && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Data Limite</span>
                                    <span className="font-medium">{new Date(tarefa.due_date).toLocaleDateString('pt-PT')}</span>
                                </div>
                            )}
                            {tarefa.assigned_to && (
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Atribuído a:</span>
                                    <span className="font-medium">{tarefa.assigned_to.name}</span>
                                </div>
                            )}
                            {tarefa.talent && (
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Talento:</span>
                                    <span className="font-medium">{tarefa.talent.name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Criada em:</span>
                                <span>{new Date(tarefa.created_at).toLocaleDateString('pt-PT')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {tarefa.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Descrição</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-wrap">{tarefa.description}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

TarefasShow.layout = (props: { currentTeam?: { slug: string } | null; tarefa?: Task }) => ({
    breadcrumbs: [
        { title: 'Tarefas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        {
            title: props.tarefa?.title ?? 'Detalhe',
            href: props.currentTeam && props.tarefa ? show({ tarefa: props.tarefa.id }).url : '/',
        },
    ],
});
