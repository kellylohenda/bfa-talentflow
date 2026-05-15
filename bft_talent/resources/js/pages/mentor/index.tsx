import { Head, usePage } from '@inertiajs/react';
import { BookOpen, ListChecks, Star, User } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/mentor';
import type { Talent } from '@/types';

type Props = {
    mentees: (Talent & { tarefasPendentes: number; avaliacaoMedia: number | null })[];
    kpis: { totalMentees: number; tarefasPendentes: number; avaliacoesPendentes: number; sessoesMes: number };
};

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
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

export default function MentorIndex({ mentees, kpis }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title="Portal do Mentor" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Portal do Mentor" description="Acompanhamento de bolseiros e estagiários" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard icon={<User className="h-5 w-5" />} label="Mentees" value={kpis.totalMentees} />
                    <KpiCard icon={<ListChecks className="h-5 w-5" />} label="Tarefas Pendentes" value={kpis.tarefasPendentes} />
                    <KpiCard icon={<Star className="h-5 w-5" />} label="Avaliações Pendentes" value={kpis.avaliacoesPendentes} />
                    <KpiCard icon={<BookOpen className="h-5 w-5" />} label="Sessões Este Mês" value={kpis.sessoesMes} />
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Meus Mentees</h3>
                    {mentees.map((m) => (
                        <Card key={m.id}>
                            <CardContent className="flex items-center justify-between pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{m.name}</p>
                                        <p className="text-xs text-muted-foreground">{m.talent_code}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="text-center">
                                        <p className="font-medium">{m.tarefasPendentes}</p>
                                        <p className="text-xs text-muted-foreground">Tarefas</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">{m.avaliacaoMedia !== null ? `${m.avaliacaoMedia}%` : '—'}</p>
                                        <p className="text-xs text-muted-foreground">Avaliação</p>
                                    </div>
                                    <Badge variant={m.status === 'activo' ? 'default' : 'secondary'}>{m.status}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {mentees.length === 0 && (
                        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum mentee atribuído.</p>
                    )}
                </div>
            </div>
        </>
    );
}

MentorIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Portal do Mentor', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
