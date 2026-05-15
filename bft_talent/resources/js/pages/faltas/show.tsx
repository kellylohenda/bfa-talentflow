import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, User, XCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/faltas';
import type { Absence } from '@/types';

type Props = { falta: Absence };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendente: 'outline',
    aprovado: 'default',
    rejeitado: 'destructive',
};

export default function FaltasShow({ falta }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title={`Falta — ${falta.type}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Detalhe da Falta" description={falta.type} />
                    <Badge variant={statusVariant[falta.status] ?? 'secondary'} className="ml-auto">{falta.status}</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Informação da Falta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Talento:</span>
                                <span className="font-medium">{falta.talent?.name ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tipo</span>
                                <span className="font-medium capitalize">{falta.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Início:</span>
                                <span>{new Date(falta.start_date).toLocaleDateString('pt-PT')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Fim:</span>
                                <span>{new Date(falta.end_date).toLocaleDateString('pt-PT')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {falta.justificado ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-muted-foreground">Justificado:</span>
                                <span>{falta.justificado ? 'Sim' : 'Não'}</span>
                            </div>
                            {falta.approved_by && (
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Aprovado por:</span>
                                    <span className="font-medium">{falta.approved_by.name}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {falta.reason && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Motivo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-wrap">{falta.reason}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

FaltasShow.layout = (props: { currentTeam?: { slug: string } | null; falta?: Absence }) => ({
    breadcrumbs: [
        { title: 'Faltas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        {
            title: props.falta?.type ?? 'Detalhe',
            href: props.currentTeam && props.falta ? show({ falta: props.falta.id }).url : '/',
        },
    ],
});
