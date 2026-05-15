import { Head, usePage } from '@inertiajs/react';
import { Globe, MapPin, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/geografia';

type ProvinceData = { provincia: string; total: number; activos: number; universidades: number };
type Props = { data: ProvinceData[]; resumo: { totalProvincias: number; totalTalentos: number; totalUniversidades: number } };

export default function GeografiaIndex({ data, resumo }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title="Geografia" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Distribuição Geográfica" description="Mapa de talentos por província" />

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Globe className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Províncias</p>
                                <p className="text-2xl font-bold">{resumo.totalProvincias}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Talentos</p>
                                <p className="text-2xl font-bold">{resumo.totalTalentos}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <MapPin className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Universidades</p>
                                <p className="text-2xl font-bold">{resumo.totalUniversidades}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Distribuição por Província</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.map((p) => {
                                const max = Math.max(...data.map((d) => d.total));
                                const pct = max > 0 ? (p.total / max) * 100 : 0;
                                return (
                                    <div key={p.provincia} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{p.provincia}</span>
                                            <span className="text-muted-foreground">
                                                {p.activos} activos / {p.total} total
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{p.universidades} universidades</p>
                                    </div>
                                );
                            })}
                            {data.length === 0 && (
                                <p className="py-6 text-center text-sm text-muted-foreground">Sem dados disponíveis.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

GeografiaIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Geografia', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
