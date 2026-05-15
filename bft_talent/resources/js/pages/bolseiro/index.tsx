import { Head, usePage } from '@inertiajs/react';
import { Calendar, DollarSign, GraduationCap, ListChecks, User, Video } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/bolseiro';
import type { Mentor, Task, Payment } from '@/types';

type KpiCardProps = { icon: React.ReactNode; label: string; value: string | number };
function KpiCard({ icon, label, value }: KpiCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">{icon}</div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

type Props = {
    kpis: { tarefasPendentes: number; pagamentosPendentes: number; sessoesMes: number; desempenho: number };
    mentor: Mentor | null;
    tarefas: Task[];
    pagamentos: Payment[];
};

export default function BolseiroIndex({ kpis, mentor, tarefas, pagamentos }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title="Portal do Bolseiro" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Portal do Bolseiro" description="Bem-vindo ao teu painel pessoal" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard icon={<ListChecks className="h-5 w-5" />} label="Tarefas Pendentes" value={kpis.tarefasPendentes} />
                    <KpiCard icon={<DollarSign className="h-5 w-5" />} label="Pagamentos Pendentes" value={kpis.pagamentosPendentes} />
                    <KpiCard icon={<Video className="h-5 w-5" />} label="Sessões Este Mês" value={kpis.sessoesMes} />
                    <KpiCard icon={<GraduationCap className="h-5 w-5" />} label="Desempenho" value={`${kpis.desempenho}%`} />
                </div>

                {mentor && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Meu Mentor</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">{mentor.name}</p>
                                <p className="text-xs text-muted-foreground">{mentor.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas Recentes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {tarefas.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente.</p>}
                            {tarefas.slice(0, 5).map((t) => (
                                <div key={t.id} className="flex items-center justify-between text-sm">
                                    <span className="truncate">{t.title}</span>
                                    <Badge variant={t.status === 'pendente' ? 'outline' : 'secondary'}>{t.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Últimos Pagamentos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {pagamentos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum pagamento registado.</p>}
                            {pagamentos.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center justify-between text-sm">
                                    <span>{p.period}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{parseFloat(p.amount).toLocaleString('pt-PT')} {p.currency}</span>
                                        <Badge variant={p.status === 'pago' ? 'default' : 'outline'}>{p.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

BolseiroIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Portal do Bolseiro', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
