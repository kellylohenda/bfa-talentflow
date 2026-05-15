import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Mail, User } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/talentos';
import type { Talent } from '@/types';

type Props = { talent: Talent };

export default function TalentosShow({ talent }: Props) {
    return (
        <>
            <Head title={talent.name} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading title={talent.name} description={talent.talent_code} />
                    <Badge variant={talent.status === 'activo' ? 'default' : 'secondary'} className="ml-auto">
                        {talent.status}
                    </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Informação Pessoal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Tipo:</span>
                                <Badge variant="outline">
                                    {talent.kind === 'bolseiro' ? 'Bolseiro' : 'Estagiário'}
                                </Badge>
                            </div>
                            {talent.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{talent.email}</span>
                                </div>
                            )}
                            {talent.start_date && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Início:</span>
                                    <span>{new Date(talent.start_date).toLocaleDateString('pt-PT')}</span>
                                </div>
                            )}
                            {talent.end_date && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Fim:</span>
                                    <span>{new Date(talent.end_date).toLocaleDateString('pt-PT')}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Programa & Desempenho
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {talent.program && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Programa</span>
                                    <span className="font-medium">{talent.program.name}</span>
                                </div>
                            )}
                            {talent.university && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Universidade</span>
                                    <span className="font-medium">{talent.university.name}</span>
                                </div>
                            )}
                            {talent.department && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Departamento</span>
                                    <span className="font-medium">{talent.department.name}</span>
                                </div>
                            )}
                            {talent.mentor && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mentor</span>
                                    <span className="font-medium">{talent.mentor.name}</span>
                                </div>
                            )}
                            {talent.stipend && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bolsa</span>
                                    <span className="font-medium">
                                        {parseFloat(talent.stipend).toLocaleString('pt-PT')} AOA
                                    </span>
                                </div>
                            )}
                            {talent.perf !== null && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Desempenho</span>
                                    <span className="font-medium">{talent.perf}%</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {talent.observacoes && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Observações</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{talent.observacoes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

TalentosShow.layout = (props: { currentTeam?: { slug: string } | null; talent?: Talent }) => ({
    breadcrumbs: [
        { title: 'Talentos', href: index().url },
        { title: props.talent?.name ?? 'Detalhe', href: show(props.talent.id).url },
    ],
});
