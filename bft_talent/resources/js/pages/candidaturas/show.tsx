import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/candidaturas';
import type { Application } from '@/types';

type Props = { candidatura: Application };

export default function CandidaturasShow({ candidatura }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title={candidatura.name} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading title={candidatura.name} description={candidatura.email} />
                    <Badge className="ml-auto">{candidatura.stage}</Badge>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Detalhe</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Telefone</span>
                            <span>{candidatura.phone ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Programa</span>
                            <span>{candidatura.program?.name ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Universidade</span>
                            <span>{candidatura.university?.name ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tipo</span>
                            <span>{candidatura.tipo ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Data</span>
                            <span>{new Date(candidatura.created_at).toLocaleDateString('pt-PT')}</span>
                        </div>
                        {candidatura.observacoes && (
                            <div>
                                <span className="text-muted-foreground">Observações</span>
                                <p className="mt-1">{candidatura.observacoes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CandidaturasShow.layout = (props: { currentTeam?: { slug: string } | null; candidatura?: Application }) => ({
    breadcrumbs: [
        { title: 'Candidaturas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        {
            title: props.candidatura?.name ?? 'Detalhe',
            href: props.currentTeam && props.candidatura
                ? show([props.currentTeam.slug, props.candidatura.id]).url
                : '/',
        },
    ],
});
