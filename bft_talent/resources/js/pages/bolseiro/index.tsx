import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { BfaAvatar } from '@/components/ui/avatar';
import { KPI } from '@/components/ui/kpi';
import { index } from '@/routes/bolseiro';
import { show as showPagamento } from '@/routes/pagamentos';
import { show as showTarefa } from '@/routes/tarefas';
import type { Mentor, Task, Payment, Talent, MentorSession, Presenca } from '@/types';

type TabKey = 'inicio' | 'sessoes' | 'pagamentos' | 'tarefas' | 'perfil';

type Props = {
    kpis: { tarefasPendentes: number; pagamentosPendentes: number; sessoesMes: number; desempenho: number };
    bolseiro: Talent | null;
    mentor: Mentor | null;
    tarefas: Task[];
    pagamentos: Payment[];
    absences: unknown[];
    documents: unknown[];
    mentorSessions: MentorSession[];
    presencas: Presenca[];
};

const statusTone: Record<string, string> = {
    pendente: 'warn',
    concluido: 'success',
    concluida: 'success',
    pago: 'success',
    pendente_pagamento: 'warn',
    agendada: 'info',
    realizada: 'success',
    cancelada: 'danger',
};

const priorityTone: Record<string, string> = {
    baixa: 'info',
    media: 'warn',
    alta: 'danger',
    urgente: 'danger',
};

const sessionTypeLabel: Record<string, string> = {
    mentoria: 'Mentoria',
    workshop: 'Workshop',
    avaliacao: 'Avaliação',
    orientacao: 'Orientação',
};

const KIND_LABEL: Record<string, string> = {
    bolseiro: 'Bolseiro',
    estagiario: 'Estagiário',
};

export default function BolseiroIndex({ kpis, bolseiro, mentor, tarefas, pagamentos, mentorSessions, presencas }: Props) {
    const [tab, setTab] = useState<TabKey>('inicio');

    const TABS: [TabKey, string][] = [
        ['inicio', 'Início'],
        ['sessoes', 'Presenças & Sessões'],
        ['pagamentos', 'Pagamentos'],
        ['tarefas', 'As Minhas Tarefas'],
        ['perfil', 'O Meu Perfil'],
    ];

    const totalSessoes = mentorSessions.length;
    const frequentadas = mentorSessions.filter((s) => s.status === 'realizada').length;
    const taxaPresenca = totalSessoes > 0 ? Math.round((frequentadas / totalSessoes) * 100) : 0;

    return (
        <>
            <Head title="Portal do Bolseiro" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Portal do Bolseiro</h1>
                        <p className="page-subtitle">Bem-vindo ao teu painel pessoal</p>
                    </div>
                </div>

                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    <KPI label="Tarefas Pendentes" value={kpis.tarefasPendentes} icon="check" />
                    <KPI label="Pagamentos Pendentes" value={kpis.pagamentosPendentes} icon="cash" />
                    <KPI label="Sessões Este Mês" value={kpis.sessoesMes} icon="calendar" />
                    <KPI label="Desempenho" value={`${kpis.desempenho}%`} icon="chart" />
                </div>

                <div className="tabs" style={{ marginBottom: 20 }}>
                    {TABS.map(([key, lbl]) => (
                        <button key={key} className={`tab ${tab === key ? 'tab-active' : ''}`} onClick={() => setTab(key)}>
                            {lbl}
                        </button>
                    ))}
                </div>

                {/* ── INÍCIO ──────────────────────────────────────────────────── */}
                {tab === 'inicio' && (
                    <>
                        {mentor && (
                            <div className="card" style={{ marginBottom: 16 }}>
                                <div className="card-head">
                                    <span className="card-title">Meu Mentor</span>
                                </div>
                                <div className="card-pad">
                                    <div className="cell-person">
                                        <BfaAvatar name={mentor.name} size={36} />
                                        <div className="meta">
                                            <b>{mentor.name}</b>
                                            <span>{mentor.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid cols-2">
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Tarefas Recentes</span>
                                </div>
                                <div className="card-pad">
                                    {tarefas.length === 0 && <p className="muted">Nenhuma tarefa pendente.</p>}
                                    {tarefas.slice(0, 5).map((t) => (
                                        <div key={t.id} className="row row-between" style={{ padding: '6px 0' }}>
                                            <Link href={showTarefa(t.id).url}>{t.title}</Link>
                                            <span className={`pill pill-${statusTone[t.status] ?? 'neutral'}`}>{t.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-head">
                                    <span className="card-title">Últimos Pagamentos</span>
                                </div>
                                <div className="card-pad">
                                    {pagamentos.length === 0 && <p className="muted">Nenhum pagamento registado.</p>}
                                    {pagamentos.slice(0, 5).map((p) => (
                                        <div key={p.id} className="row row-between" style={{ padding: '6px 0' }}>
                                            <Link href={showPagamento(p.id).url}>{p.period}</Link>
                                            <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                                                <span className="mono">{parseFloat(p.amount).toLocaleString('pt-PT')} {p.currency}</span>
                                                <span className={`pill pill-${statusTone[p.status] ?? 'neutral'}`}>{p.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ── PRESENÇAS & SESSÕES ────────────────────────────────────── */}
                {tab === 'sessoes' && (
                    <>
                        <div className="grid cols-3" style={{ marginBottom: 20 }}>
                            <KPI label="Sessões Agendadas" value={totalSessoes} icon="calendar" />
                            <KPI label="Frequentadas" value={frequentadas} icon="check" />
                            <KPI label="Taxa de Presença" value={`${taxaPresenca}%`} icon="chart" />
                        </div>

                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Sessões de Mentoria</span>
                            </div>
                            <div className="card-pad">
                                {mentorSessions.length === 0 && <p className="muted">Nenhuma sessão registada.</p>}
                                {mentorSessions.length > 0 && (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Tipo</th>
                                                <th>Título</th>
                                                <th>Duração</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mentorSessions.map((s) => (
                                                <tr key={s.id}>
                                                    <td className="mono">{s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString('pt-PT') : '—'}</td>
                                                    <td>
                                                        <span className="pill pill-info">{sessionTypeLabel[s.formato] ?? s.formato}</span>
                                                    </td>
                                                    <td>{s.session_code}</td>
                                                    <td className="mono">{s.duracao_min} min</td>
                                                    <td>
                                                        <span className={`pill pill-${statusTone[s.status] ?? 'neutral'}`}>{s.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* ── PAGAMENTOS ──────────────────────────────────────────────── */}
                {tab === 'pagamentos' && (
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Pagamentos</span>
                        </div>
                        <div className="card-pad">
                            {pagamentos.length === 0 && <p className="muted">Nenhum pagamento registado.</p>}
                            {pagamentos.length > 0 && (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Período</th>
                                            <th>Montante</th>
                                            <th>Tipo</th>
                                            <th>Estado</th>
                                            <th>Data de Pagamento</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagamentos.map((p) => (
                                            <tr key={p.id}>
                                                <td><Link href={showPagamento(p.id).url}>{p.period}</Link></td>
                                                <td className="mono">{parseFloat(p.amount).toLocaleString('pt-PT')} {p.currency}</td>
                                                <td>{p.type}</td>
                                                <td><span className={`pill pill-${statusTone[p.status] ?? 'neutral'}`}>{p.status}</span></td>
                                                <td className="mono">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('pt-PT') : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ── AS MINHAS TAREFAS ──────────────────────────────────────── */}
                {tab === 'tarefas' && (
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">As Minhas Tarefas</span>
                        </div>
                        <div className="card-pad">
                            {tarefas.length === 0 && <p className="muted">Nenhuma tarefa atribuída.</p>}
                            {tarefas.length > 0 && (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Prioridade</th>
                                            <th>Prazo</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tarefas.map((t) => (
                                            <tr key={t.id}>
                                                <td><Link href={showTarefa(t.id).url}>{t.title}</Link></td>
                                                <td>
                                                    <span className={`pill pill-${priorityTone[t.priority] ?? 'neutral'}`}>{t.priority}</span>
                                                </td>
                                                <td className="mono">{t.due_date ? new Date(t.due_date).toLocaleDateString('pt-PT') : '—'}</td>
                                                <td>
                                                    <span className={`pill pill-${statusTone[t.status] ?? 'neutral'}`}>{t.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ── O MEU PERFIL ────────────────────────────────────────────── */}
                {tab === 'perfil' && (
                    <div className="card card-pad" style={{ maxWidth: 600 }}>
                        {bolseiro && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                    <BfaAvatar name={bolseiro.name} size={64} />
                                    <div>
                                        <div style={{ fontSize: 20, fontWeight: 700 }}>{bolseiro.name}</div>
                                        <div style={{ fontSize: 13, opacity: 0.6 }}>{bolseiro.talent_code}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    {[
                                        ['Nome', bolseiro.name],
                                        ['ID', bolseiro.talent_code],
                                        ['Tipo', KIND_LABEL[bolseiro.kind] ?? bolseiro.kind],
                                        ['Programa', bolseiro.program?.name ?? '—'],
                                        ['Universidade', bolseiro.university?.name ?? '—'],
                                        ['Departamento', bolseiro.department?.name ?? '—'],
                                        ['Mentor', bolseiro.mentor ? `${bolseiro.mentor.name} (${bolseiro.mentor.email})` : '—'],
                                        ['Performance', bolseiro.perf != null ? `${bolseiro.perf}%` : '—'],
                                        ['Estado', bolseiro.status === 'activo' ? '✓ Activo' : bolseiro.status],
                                    ].map(([label, value]) => (
                                        <div key={label} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)' }}>
                                            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 3 }}>{label}</div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {!bolseiro && <p className="muted">Dados do perfil não disponíveis.</p>}
                    </div>
                )}
            </div>
        </>
    );
}

BolseiroIndex.layout = () => ({
    breadcrumbs: [{ title: 'Portal do Bolseiro', href: index().url }],
});
