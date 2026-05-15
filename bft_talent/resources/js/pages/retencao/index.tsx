import { Head, usePage } from '@inertiajs/react';
import { TrendingDown, TrendingUp, UserCheck, UserMinus, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { index } from '@/routes/retencao';

type Props = {
    data: {
        taxaRetencaoGeral: number;
        totalActivos: number;
        totalSaidas: number;
        saidasMes: number;
        entradasMes: number;
        tempoMedioPermanencia: number;
    };
    historico: { mes: string; retencao: number; entradas: number; saidas: number }[];
    causasSaida: { causa: string; total: number; percentagem: number }[];
};

export default function RetencaoIndex({ data, historico, causasSaida }: Props) {
    return (
        <>
            <Head title="Retenção" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Métricas de Retenção" description="Acompanhamento da retenção de talentos" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <UserCheck className={`h-8 w-8 ${data.taxaRetencaoGeral >= 70 ? 'text-green-600' : 'text-yellow-500'}`} />
                            <div>
                                <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                                <p className="text-2xl font-bold">{data.taxaRetencaoGeral}%</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Activos</p>
                                <p className="text-2xl font-bold">{data.totalActivos}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <UserMinus className="h-8 w-8 text-destructive" />
                            <div>
                                <p className="text-sm text-muted-foreground">Saídas Totais</p>
                                <p className="text-2xl font-bold">{data.totalSaidas}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <TrendingUp className={`h-8 w-8 ${data.entradasMes >= data.saidasMes ? 'text-green-600' : 'text-destructive'}`} />
                            <div>
                                <p className="text-sm text-muted-foreground">Saldo do Mês</p>
                                <p className="text-2xl font-bold">
                                    {data.entradasMes - data.saidasMes >= 0 ? '+' : ''}
                                    {data.entradasMes - data.saidasMes}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {historico.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Evolução da Retenção</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {historico.map((h) => (
                                    <div key={h.mes} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{h.mes}</span>
                                            <span className="text-muted-foreground">{h.retencao}%</span>
                                        </div>
                                        <Progress value={h.retencao} className="h-2" />
                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                            <span>Entradas: {h.entradas}</span>
                                            <span>Saídas: {h.saidas}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {causasSaida.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Causas de Saída</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {causasSaida.map((c) => (
                                    <div key={c.causa} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{c.causa}</span>
                                            <span className="text-muted-foreground">{c.total} ({c.percentagem}%)</span>
                                        </div>
                                        <Progress value={c.percentagem} className="h-2" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio de Permanência</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{data.tempoMedioPermanencia} <span className="text-sm font-normal text-muted-foreground">meses</span></p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RetencaoIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Retenção', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
