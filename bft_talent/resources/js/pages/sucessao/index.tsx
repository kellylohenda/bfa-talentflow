import { Head } from '@inertiajs/react';
import { KPI } from '@/components/ui/kpi';
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

type Props = { data: MatrixTalent[]; resumo: { total: number; altoPotencial: number; altaPerformance: number; risco: number } };

export default function SucessaoIndex({ data, resumo }: Props) {
    function getBox(potencial: number, performance: number) {
        const pIdx = performance < 33 ? 0 : performance < 66 ? 1 : 2;
        const potIdx = potencial < 33 ? 0 : potencial < 66 ? 1 : 2;

        return { row: pIdx, col: potIdx };
    }

    const grid: MatrixTalent[][][] = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => [] as MatrixTalent[]));
    data.forEach((t) => {
        const { row, col } = getBox(t.potencial, t.performance);
        grid[row][col].push(t);
    });

    const pillTone = (label: string) => {
        if (label === 'Estrela' || label === 'Top Talento' || label === 'Alta Performance') {
return 'success';
}

        if (label === 'Núcleo' || label === 'Potencial' || label === 'Equilibrado') {
return 'info';
}

        if (label === 'Reavaliar' || label === 'Acompanhar') {
return 'warn';
}

        return 'danger';
    };

    return (
        <>
            <Head title="Sucessão" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Matriz de Sucessão (9-Box)</h1>
                        <p className="page-subtitle">Mapeamento de talento e potencial</p>
                    </div>
                </div>

                {/* ── KPI Strip ──────────────────────────────────────────── */}
                <div className="grid cols-4" style={{ marginBottom: 20 }}>
                    <KPI label="Total" value={resumo.total} icon="users" />
                    <KPI label="Alto Potencial" value={resumo.altoPotencial} delta="Destaque" deltaTone="up" icon="trending" />
                    <KPI label="Alta Performance" value={resumo.altaPerformance} delta="Destaque" deltaTone="up" icon="star" />
                    <KPI label="Em Risco" value={resumo.risco} delta="Atenção" deltaTone="down" icon="alert" />
                </div>

                {/* ── 9-Box Matrix ───────────────────────────────────────── */}
                <div className="grid cols-3" style={{ gap: 12 }}>
                    {performanceLevels.map((perf, row) =>
                        potencialLevels.map((pot, col) => {
                            const talents = grid[row][col];
                            const label = boxLabels[row][col];

                            return (
                                <div key={`${row}-${col}`} className="card" style={{ borderTop: '3px solid', borderColor: pillTone(label) === 'success' ? 'var(--success)' : pillTone(label) === 'warn' ? 'var(--warn)' : pillTone(label) === 'info' ? 'var(--info)' : 'var(--danger)' }}>
                                    <div className="card-head">
                                        <span className="card-title" style={{ fontSize: 13 }}>{label}</span>
                                        <span className={`pill pill-${pillTone(label)}`} style={{ fontSize: 10 }}>{perf} · {pot}</span>
                                    </div>
                                    <div className="card-pad" style={{ padding: '8px 14px' }}>
                                        {talents.map((t) => (
                                            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-2)', borderRadius: 6, padding: '5px 8px', marginBottom: 4, fontSize: 12 }}>
                                                <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                                                <span className="pill pill-neutral" style={{ fontSize: 10 }}>{t.status}</span>
                                            </div>
                                        ))}
                                        {talents.length === 0 && (
                                            <p style={{ padding: '8px 0', textAlign: 'center', fontSize: 11, color: 'var(--text-4)' }}>—</p>
                                        )}
                                    </div>
                                </div>
                            );
                        }),
                    )}
                </div>
            </div>
        </>
    );
}

SucessaoIndex.layout = () => ({
    breadcrumbs: [{ title: 'Sucessão', href: index().url }],
});
