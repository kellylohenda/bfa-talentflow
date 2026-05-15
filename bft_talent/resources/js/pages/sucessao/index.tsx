import { Head, usePage } from '@inertiajs/react';
import { TrendingUp, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/sucessao';
import type { Talent } from '@/types';

type MatrixTalent = Talent & { performance: number; potencial: number };

const performanceLevels = ['Baixo', 'Médio', 'Alto'] as const;
const potencialLevels = ['Baixo', 'Médio', 'Alto'] as const;

const boxLabels: string[][] = [
    ['Atenção', 'Equilibrado', 'Estrela'],
    ['Acompanhar', 'Núcleo', 'Alta Performance'],
    ['Reavaliar', 'Potencial', 'Top Talento'],
];

const boxColors: string[][] = [
    ['border-red-300 bg-red-50 dark:bg-red-950/20', 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20', 'border-green-300 bg-green-50 dark:bg-green-950/20'],
    ['border-orange-300 bg-orange-50 dark:bg-orange-950/20', 'border-blue-300 bg-blue-50 dark:bg-blue-950/20', 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20'],
    ['border-red-400 bg-red-100 dark:bg-red-950/40', 'border-purple-300 bg-purple-50 dark:bg-purple-950/20', 'border-green-400 bg-green-100 dark:bg-green-950/40'],
];

type Props = { data: MatrixTalent[]; resumo: { total: number; altoPotencial: number; altaPerformance: number; risco: number } };

export default function SucessaoIndex({ data, resumo }: Props) {
    function getBox(potencial: number, performance: number) {
        const pIdx = performance < 33 ? 0 : performance < 66 ? 1 : 2;
        const potIdx = potencial < 33 ? 0 : potencial < 66 ? 1 : 2;
        return { row: pIdx, col: potIdx };
    }

    const grid: MatrixTalent[][] = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => [] as MatrixTalent[]));
    data.forEach((t) => {
        const { row, col } = getBox(t.potencial, t.performance);
        grid[row][col].push(t);
    });

    return (
        <>
            <Head title="Sucessão" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Matriz de Sucessão (9-Box)" description="Mapeamento de talento e potencial" />

                <div className="grid gap-4 sm:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{resumo.total}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Alto Potencial</p>
                                <p className="text-2xl font-bold">{resumo.altoPotencial}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Alta Performance</p>
                                <p className="text-2xl font-bold">{resumo.altaPerformance}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <TrendingUp className="h-8 w-8 text-destructive" />
                            <div>
                                <p className="text-sm text-muted-foreground">Em Risco</p>
                                <p className="text-2xl font-bold">{resumo.risco}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {performanceLevels.map((perf, row) =>
                        potencialLevels.map((pot, col) => {
                            const talents = grid[row][col];
                            return (
                                <Card key={`${row}-${col}`} className={`${boxColors[row][col]} border-2`}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-medium">
                                            {boxLabels[row][col]}
                                        </CardTitle>
                                        <p className="text-[10px] text-muted-foreground">
                                            {perf} · {pot}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        {talents.map((t) => (
                                            <div key={t.id} className="flex items-center justify-between rounded bg-background/80 px-2 py-1 text-xs">
                                                <span className="font-medium truncate">{t.name}</span>
                                                <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                                            </div>
                                        ))}
                                        {talents.length === 0 && (
                                            <p className="py-2 text-center text-[10px] text-muted-foreground">—</p>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        }),
                    )}
                </div>
            </div>
        </>
    );
}

SucessaoIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Sucessão', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
