import { Head, usePage } from '@inertiajs/react';
import { DollarSign, TrendingDown, TrendingUp, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/roi';

type Props = {
    data: {
        totalInvestido: number;
        retornoEstimado: number;
        roi: number;
        custoPorTalento: number;
        produtividadeMedia: number;
        taxaRetencao: number;
    };
    historico: { periodo: string; investimento: number; retorno: number }[];
};

function formatCurrency(value: number) {
    return `${value.toLocaleString('pt-PT')} AOA`;
}

export default function RoiIndex({ data, historico }: Props) {
    return (
        <>
            <Head title="ROI" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Análise de ROI" description="Retorno sobre o investimento do programa" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <DollarSign className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Investido</p>
                                <p className="text-2xl font-bold">{formatCurrency(data.totalInvestido)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Retorno Estimado</p>
                                <p className="text-2xl font-bold">{formatCurrency(data.retornoEstimado)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className={`flex items-center gap-4 pt-6 ${data.roi >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                            {data.roi >= 0 ? <TrendingUp className="h-8 w-8" /> : <TrendingDown className="h-8 w-8" />}
                            <div>
                                <p className="text-sm text-muted-foreground">ROI</p>
                                <p className="text-2xl font-bold">{data.roi >= 0 ? '+' : ''}{data.roi}%</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Custo por Talento</p>
                                <p className="text-2xl font-bold">{formatCurrency(data.custoPorTalento)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <TrendingUp className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Produtividade Média</p>
                                <p className="text-2xl font-bold">{data.produtividadeMedia}%</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                                <p className="text-2xl font-bold">{data.taxaRetencao}%</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {historico.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Histórico de ROI</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {historico.map((h) => {
                                    const roiPct = h.investimento > 0 ? ((h.retorno - h.investimento) / h.investimento) * 100 : 0;
                                    return (
                                        <div key={h.periodo} className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-sm">
                                            <span className="font-medium">{h.periodo}</span>
                                            <span className="text-muted-foreground">
                                                {formatCurrency(h.investimento)} → {formatCurrency(h.retorno)}
                                            </span>
                                            <span className={roiPct >= 0 ? 'font-medium text-green-600' : 'font-medium text-destructive'}>
                                                {roiPct >= 0 ? '+' : ''}{roiPct.toFixed(1)}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

RoiIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'ROI', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
