import { Head, usePage } from '@inertiajs/react';
import { Clock, Heart, TrendingUp, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { index } from '@/routes/relatorios-voluntariado';

type Props = {
    data: {
        totalVoluntarios: number;
        totalHoras: number;
        mediaHorasMes: number;
        taxaParticipacao: number;
        actividadesRealizadas: number;
        impactoEstimado: string;
    };
    porArea: { area: string; voluntarios: number; horas: number; percentagem: number }[];
    historico: { mes: string; horas: number; voluntarios: number }[];
};

export default function RelatoriosVoluntariadoIndex({ data, porArea, historico }: Props) {
    return (
        <>
            <Head title="Relatórios de Voluntariado" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Impacto do Voluntariado" description="Relatórios e métricas de voluntariado" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Voluntários</p>
                                <p className="text-2xl font-bold">{data.totalVoluntarios}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Clock className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total de Horas</p>
                                <p className="text-2xl font-bold">{data.totalHoras}h</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Média Horas/Mês</p>
                                <p className="text-2xl font-bold">{data.mediaHorasMes}h</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Heart className="h-8 w-8 text-red-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Impacto Estimado</p>
                                <p className="text-lg font-bold">{data.impactoEstimado}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {porArea.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Horas por Área de Actuação</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {porArea.map((a) => (
                                    <div key={a.area} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{a.area}</span>
                                            <span className="text-muted-foreground">{a.horas}h · {a.voluntarios} voluntários</span>
                                        </div>
                                        <Progress value={a.percentagem} className="h-2" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {historico.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Evolução Mensal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {historico.map((h) => (
                                    <div key={h.mes} className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-sm">
                                        <span className="font-medium">{h.mes}</span>
                                        <div className="flex gap-4 text-muted-foreground">
                                            <span>{h.horas}h</span>
                                            <span>{h.voluntarios} voluntários</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Actividades Realizadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{data.actividadesRealizadas}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Participação</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{data.taxaParticipacao}%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Média Horas/Voluntário</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {data.totalVoluntarios > 0 ? (data.totalHoras / data.totalVoluntarios).toFixed(1) : 0}h
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

RelatoriosVoluntariadoIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Relatórios Voluntariado', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
