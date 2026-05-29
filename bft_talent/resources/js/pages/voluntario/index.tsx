import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BfaAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { KPI } from '@/components/ui/kpi';

type HoursEntry = {
    id: number;
    data: string;
    horas: number;
    actividade: string;
    validado: boolean;
    validado_por: string | null;
};

type Activity = {
    id: number;
    nome: string;
    tipo: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    local: string;
    vagas_total: number;
    inscritos_count: number;
    status: string;
    descricao: string;
};

type Inscricao = {
    activity_id: number;
    actividade_nome: string;
    data: string;
    presente: boolean;
    horas_registadas: number;
};

type Props = {
    voluntario: {
        id: number;
        nome: string;
        email: string;
        phone: string;
        area_actuacao: string;
        total_horas: number;
        data_inicio: string;
        motivacao: string;
        status: string;
        volunteer_code: string;
        mentor: { name: string; email: string } | null;
    };
    hoursEntries: HoursEntry[];
    activities: Activity[];
    inscricoes: Inscricao[];
    level: { label: string; color: string; bg: string; minH: number };
    nextLevel: { label: string; minH: number; hoursNeeded: number } | null;
    stats: { totalHoras: number; validH: number; pendingH: number; activityCount: number };
};

const LEVELS = [
    { label: 'Iniciante', minH: 0, color: '#6B7280', bg: '#F3F4F6' },
    { label: 'Bronze', minH: 50, color: '#B45309', bg: '#FEF3C7' },
    { label: 'Prata', minH: 100, color: '#6B7280', bg: '#F3F4F6' },
    { label: 'Ouro', minH: 200, color: '#D97706', bg: '#FEF9C3' },
    { label: 'Platina', minH: 400, color: '#2563EB', bg: '#EFF6FF' },
];

const AREA_LABEL: Record<string, string> = {
    educacao: 'Educação',
    saude: 'Saúde',
    ambiente: 'Ambiente',
    social: 'Social',
    cultura: 'Cultura',
};

const AREA_COLOR: Record<string, string> = {
    educacao: '#1D4ED8',
    saude: '#DC2626',
    ambiente: '#0E7C4A',
    social: '#7C3AED',
    cultura: '#B45309',
};

const statusLabel: Record<string, string> = {
    agendada: 'Agendada',
    em_curso: 'Em curso',
    concluida: 'Concluída',
    cancelada: 'Cancelada',
};

export default function VoluntarioPortal({ voluntario, hoursEntries, activities, inscricoes, level, nextLevel, stats }: Props) {
    const [tab, setTab] = useState<'inicio' | 'horas' | 'actividades' | 'perfil'>('inicio');
    const { data, setData, post, processing, reset } = useForm({
        activity_id: '',
        data: '',
        horas: '',
        descricao: '',
    });

    const enrolledIds = new Set(inscricoes.map((i) => i.activity_id));
    const upcomingActivities = activities.filter((a) => a.status !== 'concluida').slice(0, 3);

    const TABS: [typeof tab, string][] = [
        ['inicio', 'Início'],
        ['horas', 'As Minhas Horas'],
        ['actividades', 'Actividades'],
        ['perfil', 'O Meu Perfil'],
    ];

    function submitHours(e: React.FormEvent) {
        e.preventDefault();
        post('/voluntario/horas', {
            onSuccess: () => reset(),
        });
    }

    function inscrever(activityId: number) {
        router.post('/voluntario/inscrever', { activity_id: activityId });
    }

    return (
        <>
            <Head title="Portal do Voluntário" />
            <div className="section">
                {/* Header */}
                <div className="page-head">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <h1 className="page-title" style={{ margin: 0 }}>
                                Olá, {voluntario.nome.split(' ')[0]}
                            </h1>
                            <span
                                style={{
                                    padding: '3px 10px',
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: level.bg,
                                    color: level.color,
                                    border: `1px solid ${level.color}40`,
                                }}
                            >
                                Voluntário {level.label}
                            </span>
                        </div>
                        <p className="page-subtitle" style={{ margin: 0 }}>
                            {AREA_LABEL[voluntario.area_actuacao] ?? voluntario.area_actuacao} · {voluntario.volunteer_code}
                        </p>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    <KPI label="Total de horas" value={`${stats.totalHoras}h`} sub="Acumuladas" delta="Activo" deltaTone="up" icon="clock" />
                    <KPI
                        label="Nível actual"
                        value={level.label}
                        sub={nextLevel ? `Faltam ${nextLevel.hoursNeeded}h para ${nextLevel.label}` : 'Nível máximo'}
                        icon="star"
                    />
                    <KPI label="Actividades" value={stats.activityCount} sub="Participadas" icon="check" />
                    <KPI
                        label="Horas validadas"
                        value={`${stats.validH}h`}
                        sub={stats.pendingH > 0 ? `${stats.pendingH}h pendentes` : 'Todas validadas'}
                        deltaTone={stats.pendingH > 0 ? 'flat' : 'up'}
                        icon="check"
                    />
                </div>

                {/* Tabs */}
                <div className="tabs" style={{ marginBottom: 20 }}>
                    {TABS.map(([key, lbl]) => (
                        <button key={key} className={`tab ${tab === key ? 'tab-active' : ''}`} onClick={() => setTab(key)}>
                            {lbl}
                        </button>
                    ))}
                </div>

                {/* ── INÍCIO ──────────────────────────────────────────────────── */}
                {tab === 'inicio' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {/* Progresso de nível */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Progresso de Nível</span>
                            </div>
                            <div className="card-pad">
                                {LEVELS.map((l) => {
                                    const achieved = stats.totalHoras >= l.minH;
                                    const isCurrent = l.label === level.label;

                                    return (
                                        <div
                                            key={l.label}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                padding: '8px 0',
                                                borderBottom: '1px solid var(--border)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    background: achieved ? l.bg : 'var(--surface-2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    color: achieved ? l.color : 'var(--text)',
                                                    opacity: achieved ? 1 : 0.35,
                                                    border: isCurrent ? `2px solid ${l.color}` : 'none',
                                                }}
                                            >
                                                {achieved ? '✓' : '—'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500 }}>{l.label}</div>
                                                <div style={{ fontSize: 11, opacity: 0.55 }}>a partir de {l.minH}h</div>
                                            </div>
                                            {isCurrent && (
                                                <span
                                                    style={{
                                                        padding: '2px 8px',
                                                        borderRadius: 10,
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        background: l.bg,
                                                        color: l.color,
                                                    }}
                                                >
                                                    Actual
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                                {nextLevel && (
                                    <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)', marginTop: 8 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                                            {nextLevel.hoursNeeded}h para {nextLevel.label}
                                        </div>
                                        <div className="bar-track">
                                            <div
                                                className="bar-fill"
                                                style={{
                                                    background: level.color,
                                                    width: `${Math.round(((stats.totalHoras - level.minH) / (nextLevel.minH - level.minH)) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Próximas actividades */}
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Próximas Actividades</span>
                                </div>
                                <div className="card-pad">
                                    {upcomingActivities.length === 0 ? (
                                        <p className="muted">Sem actividades próximas.</p>
                                    ) : (
                                        upcomingActivities.map((a) => (
                                            <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.nome}</div>
                                                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 3 }}>
                                                    {a.data} · {a.hora_inicio} · {a.local}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Horas por actividade */}
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Horas por Actividade</span>
                                </div>
                                <div className="card-pad">
                                    {hoursEntries.slice(0, 5).map((h) => (
                                        <div
                                            key={h.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 0',
                                                borderBottom: '1px solid var(--border)',
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: 13 }}>{h.actividade}</div>
                                                <div style={{ fontSize: 11, opacity: 0.5 }}>{h.data}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 14, fontWeight: 700 }}>{h.horas}h</span>
                                                {h.validado ? (
                                                    <span className="pill pill-success" style={{ fontSize: 11 }}>
                                                        ✓ Validado
                                                    </span>
                                                ) : (
                                                    <span className="pill pill-warn" style={{ fontSize: 11 }}>
                                                        Pendente
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {hoursEntries.length === 0 && <p className="muted">Nenhum registo de horas.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── AS MINHAS HORAS ────────────────────────────────────────── */}
                {tab === 'horas' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="grid cols-4">
                            <KPI label="Horas totais" value={`${stats.totalHoras}h`} icon="clock" />
                            <KPI label="Validadas" value={`${stats.validH}h`} delta="Confirmadas" deltaTone="up" icon="check" />
                            <KPI label="Pendentes" value={`${stats.pendingH}h`} icon="clock" />
                            <KPI label="Actividades" value={stats.activityCount} sub="Participadas" icon="calendar" />
                        </div>

                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Registo de Horas</span>
                            </div>
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Actividade</th>
                                        <th>Horas</th>
                                        <th>Estado</th>
                                        <th>Validado por</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...hoursEntries].reverse().map((h) => (
                                        <tr key={h.id}>
                                            <td style={{ fontSize: 13 }}>{h.data}</td>
                                            <td style={{ fontSize: 13 }}>{h.actividade}</td>
                                            <td style={{ fontSize: 14, fontWeight: 700 }}>{h.horas}h</td>
                                            <td>
                                                {h.validado ? (
                                                    <span className="pill pill-success">Validado</span>
                                                ) : (
                                                    <span className="pill pill-warn">Pendente</span>
                                                )}
                                            </td>
                                            <td style={{ fontSize: 12, opacity: 0.6 }}>{h.validado_por ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {hoursEntries.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: 24, opacity: 0.45 }}>
                                                Nenhum registo de horas encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Registar Novas Horas</span>
                            </div>
                            <div className="card-pad">
                                <form onSubmit={submitHours} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
                                    <div className="form-group">
                                        <label className="form-label">Actividade</label>
                                        <select
                                            className="select"
                                            value={data.activity_id}
                                            onChange={(e) => setData('activity_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccionar actividade</option>
                                            {activities.map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Data</label>
                                        <input
                                            type="date"
                                            className="input"
                                            value={data.data}
                                            onChange={(e) => setData('data', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Horas</label>
                                        <input
                                            type="number"
                                            className="input"
                                            min="0.5"
                                            step="0.5"
                                            value={data.horas}
                                            onChange={(e) => setData('horas', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Descrição</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={data.descricao}
                                            onChange={(e) => setData('descricao', e.target.value)}
                                            placeholder="Breve descrição da actividade"
                                        />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? 'A enviar...' : 'Registar Horas'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ACTIVIDADES ─────────────────────────────────────────────── */}
                {tab === 'actividades' && (
                    <div className="grid cols-2">
                        {activities.map((a) => {
                            const areaColor = AREA_COLOR[a.tipo] ?? '#6B7280';
                            const isEnrolled = enrolledIds.has(a.id);
                            const canEnroll = !isEnrolled && (a.status === 'agendada' || a.status === 'em_curso');

                            return (
                                <div key={a.id} className="card" style={{ borderLeft: `3px solid ${areaColor}` }}>
                                    <div className="card-pad">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <span
                                                style={{
                                                    padding: '2px 10px',
                                                    borderRadius: 10,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    background: areaColor + '20',
                                                    color: areaColor,
                                                }}
                                            >
                                                {AREA_LABEL[a.tipo] ?? a.tipo}
                                            </span>
                                            <span className={`pill pill-${a.status === 'concluida' ? 'success' : a.status === 'em_curso' ? 'warn' : a.status === 'cancelada' ? 'danger' : 'info'}`}>
                                                {statusLabel[a.status] ?? a.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{a.nome}</div>
                                        <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 4 }}>
                                            {a.data} · {a.hora_inicio}–{a.hora_fim}
                                        </div>
                                        <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 8 }}>{a.local}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 12, opacity: 0.55 }}>
                                                {a.inscritos_count}/{a.vagas_total} inscritos
                                            </span>
                                            {isEnrolled && (
                                                <span style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>✓ Inscrito</span>
                                            )}
                                            {canEnroll && (
                                                <button className="btn btn-sm btn-primary" onClick={() => inscrever(a.id)}>
                                                    Inscrever-me
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {activities.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
                                Nenhuma actividade disponível.
                            </div>
                        )}
                    </div>
                )}

                {/* ── O MEU PERFIL ────────────────────────────────────────────── */}
                {tab === 'perfil' && (
                    <div className="card card-pad" style={{ maxWidth: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                            <BfaAvatar name={voluntario.nome} size={64} color={level.color} />
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>{voluntario.nome}</div>
                                <div style={{ fontSize: 13, opacity: 0.6 }}>{voluntario.volunteer_code}</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                ['Email', voluntario.email],
                                ['Telefone', voluntario.phone],
                                ['Área de actuação', AREA_LABEL[voluntario.area_actuacao] ?? voluntario.area_actuacao],
                                ['Data de inscrição', voluntario.data_inicio],
                                ['Nível', level.label],
                                ['Total de horas', `${stats.totalHoras}h`],
                                ['Mentor', voluntario.mentor ? `${voluntario.mentor.name} (${voluntario.mentor.email})` : '—'],
                                ['Estado', voluntario.status === 'activo' ? '✓ Activo' : voluntario.status],
                            ].map(([label, value]) => (
                                <div key={label} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)' }}>
                                    <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 3 }}>{label}</div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

VoluntarioPortal.layout = () => ({
    breadcrumbs: [{ title: 'Portal do Voluntário', href: '/voluntario' }],
});
