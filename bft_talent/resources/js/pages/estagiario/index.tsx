import { Head } from '@inertiajs/react';
import { Building, Calendar, Clock, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { BfaAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { KPI } from '@/components/ui/kpi';
import { Progress } from '@/components/ui/progress';
import { index } from '@/routes/estagiarios';

type Rotation = {
    id: number;
    department: string;
    supervisor: string;
    start_date: string;
    end_date: string | null;
    status: string;
    objectivos: string | null;
    avaliacao_final: string | null;
};

type Payment = {
    id: number;
    payment_ref: string;
    type: string;
    period: string;
    amount: string;
    currency: string;
    status: string;
    paid_at: string | null;
};

type Task = {
    id: number;
    task_code: string;
    title: string;
    descricao: string | null;
    status: string;
    prioridade: string;
    due_date: string | null;
};

type Evaluation = {
    id: number;
    period: string;
    tipo: string;
    score: number | null;
    classificacao: string | null;
    comentarios: string | null;
};

type Props = {
    talent: {
        id: number;
        name: string;
        talent_code: string;
        email: string | null;
        kind: string;
        status: string;
        perf: number | null;
        risk_score: string | null;
        start_date: string | null;
        stipend: string | null;
        observacoes: string | null;
        program: { name: string; code: string; descricao: string | null } | null;
        university: { name: string; city: string } | null;
        department: { name: string } | null;
        mentor: { name: string; email: string } | null;
    };
    rotations: Rotation[];
    payments: Payment[];
    tasks: Task[];
    evaluations: Evaluation[];
    stats: {
        lastPayment: { amount: string; period: string } | null;
        totalPayments: number;
        pendingTasks: number;
        overdueTasks: number;
        activeRotation: { department: string; supervisor: string; start_date: string } | null;
        rotationCount: number;
    };
};

const statusTone: Record<string, string> = {
    pendente: 'warn',
    em_andamento: 'info',
    concluida: 'success',
    cancelada: 'danger',
    pago: 'success',
    processado: 'info',
    cancelado: 'danger',
    activa: 'success',
    pendente_pagamento: 'warn',
};

const prioridadeTone: Record<string, string> = {
    urgente: 'danger',
    alta: 'warn',
    media: 'info',
    baixa: 'neutral',
};

function formatKz(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
return '0 Kz';
}

    return num.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Kz';
}

export default function EstagiarioPortal({ talent, rotations, payments, tasks, evaluations, stats }: Props) {
    const [tab, setTab] = useState<'inicio' | 'presencas' | 'rotacoes' | 'pagamentos' | 'tarefas' | 'perfil'>('inicio');
    const firstName = talent.name.split(' ')[0];

    const TABS: [typeof tab, string][] = [
        ['inicio', 'Início'],
        ['presencas', 'Presenças'],
        ['rotacoes', 'Rotações'],
        ['pagamentos', 'Pagamentos'],
        ['tarefas', 'Tarefas'],
        ['perfil', 'Perfil'],
    ];

    return (
        <>
            <Head title="Portal do Estagiário" />
            <div className="section">
                {/* Header */}
                <div className="page-head">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <h1 className="page-title" style={{ margin: 0 }}>
                                Olá, {firstName}
                            </h1>
                            <Badge variant="warn">Estagiário</Badge>
                        </div>
                        <p className="page-subtitle" style={{ margin: 0 }}>
                            {talent.program?.name ?? '—'} · {talent.university?.name ?? '—'} · {talent.department?.name ?? '—'}
                        </p>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    <KPI
                        label="Último Subsídio"
                        value={stats.lastPayment ? formatKz(stats.lastPayment.amount) : '—'}
                        sub={stats.lastPayment?.period ?? 'Sem pagamentos'}
                        icon="cash"
                    />
                    <KPI
                        label="Desempenho"
                        value={talent.perf !== null ? `${talent.perf}%` : '—'}
                        delta={talent.perf !== null && talent.perf >= 70 ? 'Bom' : talent.perf !== null ? 'Em desenvolvimento' : undefined}
                        deltaTone={talent.perf !== null && talent.perf >= 70 ? 'up' : 'flat'}
                        icon="chart"
                    />
                    <KPI
                        label="Rotação Actual"
                        value={stats.activeRotation?.department ?? 'Sem rotação'}
                        sub={stats.activeRotation ? `Supervisor: ${stats.activeRotation.supervisor}` : undefined}
                        icon="building"
                    />
                    <KPI
                        label="Tarefas Pendentes"
                        value={stats.pendingTasks}
                        sub={stats.overdueTasks > 0 ? `${stats.overdueTasks} atrasadas` : 'Em dia'}
                        delta={stats.overdueTasks > 0 ? `${stats.overdueTasks} atrasada(s)` : undefined}
                        deltaTone={stats.overdueTasks > 0 ? 'down' : 'up'}
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

                {/* ── INÍCIO ───────────────────────────────────── */}
                {tab === 'inicio' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {/* Notifications */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Notificações</span>
                            </div>
                            <div className="card-pad">
                                {stats.overdueTasks > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                        <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>Tarefas atrasadas</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                                                Tem {stats.overdueTasks} tarefa(s) com prazo ultrapassado.
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {stats.pendingTasks > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                        <Clock size={16} style={{ color: 'var(--warn)', flexShrink: 0 }} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>Tarefas pendentes</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                                                Tem {stats.pendingTasks} tarefa(s) para concluir.
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {stats.overdueTasks === 0 && stats.pendingTasks === 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                                        <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>Tudo em dia</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                                                Não tem tarefas pendentes ou atrasadas.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Próxima sessão de mentoria */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Mentor</span>
                            </div>
                            <div className="card-pad">
                                {talent.mentor ? (
                                    <div className="cell-person">
                                        <BfaAvatar name={talent.mentor.name} size={36} />
                                        <div className="meta">
                                            <b>{talent.mentor.name}</b>
                                            <span>{talent.mentor.email}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="muted">Nenhum mentor atribuído.</p>
                                )}
                            </div>
                        </div>

                        {/* Rotação actual */}
                        <div className="card" style={{ gridColumn: '1 / -1' }}>
                            <div className="card-head">
                                <span className="card-title">Rotação Actual</span>
                            </div>
                            <div className="card-pad">
                                {stats.activeRotation ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Building size={16} style={{ color: 'var(--primary)' }} />
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>{stats.activeRotation.department}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Departamento</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <User size={16} style={{ color: 'var(--primary)' }} />
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>{stats.activeRotation.supervisor}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Supervisor</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Calendar size={16} style={{ color: 'var(--primary)' }} />
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>{stats.activeRotation.start_date}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Data de início</div>
                                            </div>
                                        </div>
                                        <span className="pill pill-success" style={{ marginLeft: 'auto' }}>Activa</span>
                                    </div>
                                ) : (
                                    <p className="muted">Nenhuma rotação activa no momento.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── PRESENÇAS ─────────────────────────────────── */}
                {tab === 'presencas' && (
                    <div className="card">
                        <div className="card-pad" style={{ padding: 40, textAlign: 'center' }}>
                            <Clock size={32} style={{ color: 'var(--text-4)', marginBottom: 12 }} />
                            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>Presenças em breve</div>
                            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
                                O registo de presenças será disponibilizado em breve.
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ROTAÇÕES ──────────────────────────────────── */}
                {tab === 'rotacoes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Timeline de rotações */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Histórico de Rotações</span>
                                <span className="pill pill-neutral">{stats.rotationCount} rotação(ões)</span>
                            </div>
                            <div className="card-pad">
                                {rotations.length === 0 ? (
                                    <p className="muted" style={{ textAlign: 'center', padding: 20 }}>Nenhuma rotação registada.</p>
                                ) : (
                                    <div style={{ position: 'relative', paddingLeft: 24 }}>
                                        <div style={{ position: 'absolute', left: 7, top: 4, bottom: 4, width: 2, background: 'var(--border)' }} />
                                        {rotations.map((r, i) => (
                                            <div key={r.id} style={{ position: 'relative', paddingBottom: i < rotations.length - 1 ? 20 : 0 }}>
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        left: -21,
                                                        top: 4,
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        background: r.status === 'activa' ? 'var(--primary)' : 'var(--surface-3)',
                                                        border: r.status === 'activa' ? '2px solid var(--primary)' : '2px solid var(--border)',
                                                    }}
                                                />
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <div style={{ fontSize: 14, fontWeight: 600 }}>{r.department}</div>
                                                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                                                            Supervisor: {r.supervisor}
                                                        </div>
                                                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                                                            {r.start_date}{r.end_date ? ` — ${r.end_date}` : ' — Actual'}
                                                        </div>
                                                        {r.objectivos && (
                                                            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4, maxWidth: 500 }}>
                                                                {r.objectivos}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`pill pill-${statusTone[r.status] ?? 'neutral'}`}>{r.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Avaliações */}
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Auto-avaliações</span>
                            </div>
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Período</th>
                                        <th>Tipo</th>
                                        <th>Pontuação</th>
                                        <th>Classificação</th>
                                        <th>Comentários</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluations.map((e) => (
                                        <tr key={e.id}>
                                            <td style={{ fontSize: 13 }}>{e.period}</td>
                                            <td>
                                                <span className="pill pill-info">{e.tipo}</span>
                                            </td>
                                            <td style={{ fontSize: 14, fontWeight: 700 }}>{e.score !== null ? `${e.score}%` : '—'}</td>
                                            <td>
                                                {e.classificacao ? (
                                                    <span className={`pill pill-${e.classificacao === 'excelente' ? 'success' : e.classificacao === 'bom' ? 'info' : e.classificacao === 'suficiente' ? 'warn' : 'neutral'}`}>
                                                        {e.classificacao}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 200 }}>{e.comentarios ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {evaluations.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: 24, opacity: 0.45 }}>
                                                Nenhuma avaliação registada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── PAGAMENTOS ────────────────────────────────── */}
                {tab === 'pagamentos' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="grid cols-4">
                            <KPI label="Último Pagamento" value={stats.lastPayment ? formatKz(stats.lastPayment.amount) : '—'} icon="cash" />
                            <KPI label="Total Recebido" value={formatKz(stats.totalPayments)} icon="cash" />
                            <KPI label="Subsídio Mensal" value={talent.stipend ? formatKz(talent.stipend) : '—'} icon="cash" />
                            <KPI label="Período" value={payments.length > 0 ? payments[0].period : '—'} icon="calendar" />
                        </div>

                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Histórico de Pagamentos</span>
                            </div>
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Ref</th>
                                        <th>Período</th>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                        <th>Estado</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p) => (
                                        <tr key={p.id}>
                                            <td className="mono" style={{ fontSize: 12 }}>{p.payment_ref}</td>
                                            <td style={{ fontSize: 13 }}>{p.period}</td>
                                            <td>
                                                <span className="pill pill-neutral">{p.type}</span>
                                            </td>
                                            <td style={{ fontSize: 14, fontWeight: 700 }}>{formatKz(p.amount)}</td>
                                            <td>
                                                <span className={`pill pill-${statusTone[p.status] ?? 'neutral'}`}>{p.status}</span>
                                            </td>
                                            <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.paid_at ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {payments.length === 0 && (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: 'center', padding: 24, opacity: 0.45 }}>
                                                Nenhum pagamento registado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── TAREFAS ──────────────────────────────────── */}
                {tab === 'tarefas' && (
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Tarefas</span>
                            <span className="pill pill-neutral">{tasks.length} tarefa(s)</span>
                        </div>
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Título</th>
                                    <th>Prioridade</th>
                                    <th>Prazo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((t) => {
                                    const isOverdue = t.status === 'pendente' && t.due_date && new Date(t.due_date.split('/').reverse().join('-')) < new Date();

                                    return (
                                        <tr key={t.id} className={isOverdue ? 'row-danger' : ''}>
                                            <td className="mono" style={{ fontSize: 12 }}>{t.task_code}</td>
                                            <td>
                                                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                                                {t.descricao && (
                                                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{t.descricao}</div>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`pill pill-${prioridadeTone[t.prioridade] ?? 'neutral'}`}>{t.prioridade}</span>
                                            </td>
                                            <td style={{ fontSize: 12, color: isOverdue ? 'var(--danger)' : 'var(--text-3)' }}>
                                                {t.due_date ?? '—'}
                                            </td>
                                            <td>
                                                <span className={`pill pill-${statusTone[t.status] ?? 'neutral'}`}>{t.status}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {tasks.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: 24, opacity: 0.45 }}>
                                            Nenhuma tarefa registada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── PERFIL ────────────────────────────────────── */}
                {tab === 'perfil' && (
                    <div className="card card-pad" style={{ maxWidth: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                            <BfaAvatar name={talent.name} size={64} />
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>{talent.name}</div>
                                <div style={{ fontSize: 13, opacity: 0.6 }}>{talent.talent_code}</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                ['Email', talent.email ?? '—'],
                                ['Programa', talent.program ? `${talent.program.name} (${talent.program.code})` : '—'],
                                ['Universidade', talent.university ? `${talent.university.name}, ${talent.university.city}` : '—'],
                                ['Departamento', talent.department?.name ?? '—'],
                                ['Data de Início', talent.start_date ?? '—'],
                                ['Subsídio', talent.stipend ? formatKz(talent.stipend) : '—'],
                                ['Mentor', talent.mentor ? `${talent.mentor.name} (${talent.mentor.email})` : '—'],
                                ['Estado', talent.status],
                            ].map(([label, value]) => (
                                <div key={label} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)' }}>
                                    <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 3 }}>{label}</div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Performance bar */}
                        <div style={{ marginTop: 24 }}>
                            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                Desempenho
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Progress value={talent.perf ?? 0} style={{ flex: 1 }} />
                                <span style={{ fontSize: 14, fontWeight: 700, minWidth: 40, textAlign: 'right' }}>
                                    {talent.perf !== null ? `${talent.perf}%` : '—'}
                                </span>
                            </div>
                        </div>

                        {talent.observacoes && (
                            <div style={{ marginTop: 20 }}>
                                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    Observações
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                                    {talent.observacoes}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

EstagiarioPortal.layout = () => ({
    breadcrumbs: [{ title: 'Portal do Estagiário', href: index().url }],
});
