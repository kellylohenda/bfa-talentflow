import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/voluntarios';
import type { Volunteer } from '@/types';

type Props = { voluntario: Volunteer };

export default function VoluntariosShow({ voluntario }: Props) {
    return (
        <>
            <Head title={voluntario.nome} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index().url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title={voluntario.nome} description={voluntario.volunteer_code} />
                    <Badge className="ml-auto">{voluntario.status}</Badge>
                </div>
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">E-mail</span>
                            <span>{voluntario.email}</span>
                        </div>
                        {voluntario.phone && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Telefone</span>
                                <span>{voluntario.phone}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Área de Actuação</span>
                            <span>{voluntario.area_actuacao}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total de Horas</span>
                            <span className="font-medium">{parseFloat(voluntario.total_horas).toFixed(0)}h</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Data de Início</span>
                            <span>{new Date(voluntario.data_inicio).toLocaleDateString('pt-PT')}</span>
                        </div>
                        {voluntario.mentor && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Mentor</span>
                                <span>{voluntario.mentor.name}</span>
                            </div>
                        )}
                        {voluntario.motivacao && (
                            <div>
                                <span className="text-muted-foreground">Motivação</span>
                                <p className="mt-1">{voluntario.motivacao}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

VoluntariosShow.layout = (props: { voluntario?: Volunteer }) => ({
    breadcrumbs: [
        { title: 'Voluntários', href: index().url },
        {
            title: props.voluntario?.nome ?? 'Detalhe',
            href: props.voluntario ? show(props.voluntario.id).url : '/',
        },
    ],
});
