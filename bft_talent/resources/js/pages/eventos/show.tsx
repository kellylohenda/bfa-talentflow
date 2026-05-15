import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/eventos';
import type { Evento } from '@/types';

type Props = { evento: Evento };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    planeado: 'secondary',
    confirmado: 'default',
    concluido: 'default',
    cancelado: 'destructive',
};

export default function EventosShow({ evento }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title={evento.titulo} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title={evento.titulo} description={`${evento.tipo} · ${evento.formato}`} />
                    <Badge variant={statusVariant[evento.status] ?? 'secondary'} className="ml-auto">
                        {evento.status}
                    </Badge>
                </div>
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Detalhes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Data de Início</span>
                            <span className="ml-auto">{new Date(evento.data_inicio).toLocaleDateString('pt-PT')}</span>
                        </div>
                        {evento.data_fim && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Data de Fim</span>
                                <span className="ml-auto">{new Date(evento.data_fim).toLocaleDateString('pt-PT')}</span>
                            </div>
                        )}
                        {evento.local && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Local</span>
                                <span className="ml-auto">{evento.local}</span>
                            </div>
                        )}
                        {evento.vagas !== null && (
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Vagas</span>
                                <span className="ml-auto">{evento.vagas}</span>
                            </div>
                        )}
                        {evento.descricao && (
                            <div className="pt-2">
                                <p className="mb-1 text-muted-foreground">Descrição</p>
                                <p className="whitespace-pre-wrap leading-relaxed">{evento.descricao}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EventosShow.layout = (props: { currentTeam?: { slug: string } | null; evento?: Evento }) => ({
    breadcrumbs: [
        { title: 'Eventos', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        {
            title: props.evento?.titulo ?? 'Detalhe',
            href: props.currentTeam && props.evento
                ? show([props.currentTeam.slug, props.evento.id]).url
                : '/',
        },
    ],
});
