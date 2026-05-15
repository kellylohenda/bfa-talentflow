import { Head, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/relatorios';

type Stats = {
    talentos: { total: number; activos: number; bolseiros: number; estagiarios: number };
    candidaturas: { total: number; pendentes: number; aprovadas: number; rejeitadas: number };
    pagamentos: { total: number; pendentes: number; pagos: number; valor_total: string };
    voluntarios: { total: number; activos: number };
    workflows: { pendentes: number; em_aprovacao: number };
};

type Props = { stats?: Stats };

function StatRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

function SkeletonRow() {
    return (
        <div className="flex justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-10 animate-pulse rounded bg-muted" />
        </div>
    );
}

function SkeletonCard({ title }: { title: string }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
            </CardContent>
        </Card>
    );
}

export default function RelatoriosIndex({ stats }: Props) {
    return (
        <>
            <Head title="Relatórios" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Relatórios" description="Indicadores e métricas do programa" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stats ? (
                        <>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Talentos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <StatRow label="Total" value={stats.talentos.total} />
                                    <StatRow label="Activos" value={stats.talentos.activos} />
                                    <StatRow label="Bolseiros" value={stats.talentos.bolseiros} />
                                    <StatRow label="Estagiários" value={stats.talentos.estagiarios} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Candidaturas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <StatRow label="Total" value={stats.candidaturas.total} />
                                    <StatRow label="Pendentes" value={stats.candidaturas.pendentes} />
                                    <StatRow label="Aprovadas" value={stats.candidaturas.aprovadas} />
                                    <StatRow label="Rejeitadas" value={stats.candidaturas.rejeitadas} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Pagamentos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <StatRow label="Total" value={stats.pagamentos.total} />
                                    <StatRow label="Pendentes" value={stats.pagamentos.pendentes} />
                                    <StatRow label="Pagos" value={stats.pagamentos.pagos} />
                                    <StatRow label="Valor Pago" value={`${parseFloat(stats.pagamentos.valor_total).toLocaleString('pt-PT')} AOA`} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Voluntários</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <StatRow label="Total" value={stats.voluntarios.total} />
                                    <StatRow label="Activos" value={stats.voluntarios.activos} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Workflows</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <StatRow label="Pendentes" value={stats.workflows.pendentes} />
                                    <StatRow label="Em aprovação" value={stats.workflows.em_aprovacao} />
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <SkeletonCard title="Talentos" />
                            <SkeletonCard title="Candidaturas" />
                            <SkeletonCard title="Pagamentos" />
                            <SkeletonCard title="Voluntários" />
                            <SkeletonCard title="Workflows" />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

RelatoriosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Relatórios', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
