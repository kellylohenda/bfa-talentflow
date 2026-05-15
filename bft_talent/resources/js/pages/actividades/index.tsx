import { Head, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { index } from '@/routes/actividades';
import type { VolunteerActivity } from '@/types';

type Props = { actividades: VolunteerActivity[] };

export default function ActividadesIndex({ actividades }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title="Actividades" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Actividades de Voluntariado" description="Catálogo de actividades disponíveis" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {actividades.map((a) => (
                        <Card key={a.id} className="flex flex-col">
                            <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-medium">{a.title}</h3>
                                    <Badge variant="outline" className="capitalize">{a.area}</Badge>
                                </div>
                                {a.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                                )}
                                <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(a.date).toLocaleDateString('pt-PT')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {a.total_horas}h
                                    </span>
                                    {a.local && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {a.local}
                                        </span>
                                    )}
                                    {a.vagas !== null && (
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" /> {a.vagas} vagas
                                        </span>
                                    )}
                                </div>
                                <Button size="sm" className="mt-2 w-full">Inscrever-me</Button>
                            </CardContent>
                        </Card>
                    ))}
                    {actividades.length === 0 && (
                        <div className="col-span-full py-10 text-center text-muted-foreground">
                            Nenhuma actividade disponível de momento.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ActividadesIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Actividades', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
