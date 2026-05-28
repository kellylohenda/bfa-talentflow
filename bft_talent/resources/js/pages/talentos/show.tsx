import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, AlertCircle, CheckCircle2 } from 'lucide-react';
import { index, edit as editRoute } from '@/routes/talentos';
import type { Talent, Program, University, Department, Mentor } from '@/types';

type Props = {
    talent: Talent;
    programs: Program[];
    universities: University[];
    departments: Department[];
    mentors: Mentor[];
    canEdit: boolean;
};

export default function TalentosShow({ talent, canEdit }: Props) {
    console.log('Talent Data:', talent);

    if (!talent) return <div className="card card-pad">Erro: Talento não encontrado.</div>;

    const talentId = talent.id || (talent as any).talento_id;
    const riskScore = parseFloat(String(talent.risk_score ?? '0'));
    const riskTone = riskScore >= 0.6 ? 'danger' : riskScore >= 0.3 ? 'warn' : 'success';

    // Cálculo de completude (campos básicos)
    const fields = [
        { key: 'email', label: 'E-mail' },
        { key: 'program', label: 'Programa' },
        { key: 'university', label: 'Universidade' },
        { key: 'department', label: 'Departamento' },
        { key: 'mentor', label: 'Mentor' },
        { key: 'stipend', label: 'Bolsa' },
        { key: 'perf', label: 'Performance' },
        { key: 'start_date', label: 'Data Início' },
    ];
    const filledFields = fields.filter(f => talent[f.key as keyof Talent]);
    const missingFields = fields.filter(f => !talent[f.key as keyof Talent]);
    const completeness = Math.round((filledFields.length / fields.length) * 100);

    return (
        <>
            <Head title={talent.name} />

            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft style={{ width: 14, height: 14 }} />
                        </Link>
                        <div>
                            <h1 className="page-title">{talent.name}</h1>
                            <p className="page-subtitle">{talent.talent_code} &middot; {talent.kind === 'bolseiro' ? 'Bolseiro' : 'Estagiário'}</p>
                        </div>
                    </div>
                    <div className="page-actions">
                        {canEdit && talentId && (
                            <Link href={editRoute(talentId).url} className="btn btn-primary">
                                <Pencil size={14} /> Editar Perfil
                            </Link>
                        )}
                        <span className={`pill ${talent.status === 'activo' ? 'pill-success' : talent.status === 'concluido' ? 'pill-info' : talent.status === 'suspenso' ? 'pill-warn' : 'pill-danger'}`}>
                            <span className="dot" /> {talent.status}
                        </span>
                    </div>
                </div>

                {/* ── Barra de Completude ─────────────────────── */}
                <div className="card" style={{ marginBottom: 8 }}>
                    <div className="card-pad" style={{ padding: '12px 18px' }}>
                        <div className="row-between">
                            <div className="row" style={{ gap: 12 }}>
                                <div className="muted" style={{ fontSize: 12 }}>Completude do Perfil</div>
                                <div className="bar-track" style={{ width: 200 }}>
                                    <div className="bar-fill" style={{ width: `${completeness}%`, background: completeness === 100 ? 'var(--success)' : 'var(--primary)' }} />
                                </div>
                                <b style={{ fontSize: 13 }}>{completeness}%</b>
                            </div>
                            {missingFields.length > 0 ? (
                                <div className="row" style={{ color: 'var(--warn)', fontSize: 12, fontWeight: 500 }}>
                                    <AlertCircle size={14} /> {missingFields.length} campos em falta
                                </div>
                            ) : (
                                <div className="row" style={{ color: 'var(--success)', fontSize: 12, fontWeight: 500 }}>
                                    <CheckCircle2 size={14} /> Perfil Completo
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── KPIs ──────────────────────────────── */}
                <div className="grid cols-4">
                    <div className="kpi">
                        <div className="kpi-label">Tipo</div>
                        <div className="kpi-value kpi-value-sm">
                            {talent.kind === 'bolseiro' ? 'Bolseiro' : 'Estagiário'}
                        </div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-label">Performance</div>
                        <div className="kpi-value kpi-value-sm" style={{ color: (talent.perf ?? 0) >= 85 ? 'var(--success)' : (talent.perf ?? 0) >= 70 ? 'var(--warn)' : 'var(--danger)' }}>
                            {talent.perf ?? '—'}{talent.perf != null ? '%' : ''}
                        </div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-label">Risco</div>
                        <div className="kpi-value kpi-value-sm" style={{ color: `var(--${riskTone})` }}>
                            {riskScore > 0 ? `${Math.round(riskScore * 100)}%` : 'Baixo'}
                        </div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-label">Bolsa Mensal</div>
                        <div className="kpi-value kpi-value-sm">
                            {talent.stipend ? `${parseFloat(talent.stipend).toLocaleString('pt-AO')} Kz` : '—'}
                        </div>
                    </div>
                </div>

                <div className="grid cols-2">
                    {/* ── Informação Pessoal ─────────────── */}
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Informação Pessoal</span>
                        </div>
                        <div className="card-pad">
                            <div className="row-between"><span className="muted">Nome</span><span>{talent.name}</span></div>
                            <div className="divider" />
                            <div className="row-between"><span className="muted">E-mail</span><span style={{ color: talent.email ? 'inherit' : 'var(--text-4)' }}>{talent.email ?? '—'}</span></div>
                            <div className="divider" />
                            <div className="row-between"><span className="muted">Tipo</span><span className={`pill ${talent.kind === 'bolseiro' ? 'pill-primary' : 'pill-info'}`}>{talent.kind === 'bolseiro' ? 'Bolseiro' : 'Estagiário'}</span></div>
                            <div className="divider" />
                            <div className="row-between"><span className="muted">Estado</span><span className={`pill ${talent.status === 'activo' ? 'pill-success' : talent.status === 'concluido' ? 'pill-info' : 'pill-warn'}`}>{talent.status}</span></div>
                            <div className="divider" />
                            <div className="row-between"><span className="muted">Data Início</span><span>{talent.start_date ? new Date(talent.start_date).toLocaleDateString('pt-PT') : '—'}</span></div>
                            <div className="divider" />
                            <div className="row-between"><span className="muted">Data Fim</span><span>{talent.end_date ? new Date(talent.end_date).toLocaleDateString('pt-PT') : '—'}</span></div>
                        </div>
                    </div>

                    {/* ── Programa & Desempenho ──────────── */}
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Programa & Desempenho</span>
                        </div>
                        <div className="card-pad">
                            <div className="row-between">
                                <span className="muted">Programa</span>
                                <span style={{ fontWeight: 500, color: talent.program ? 'inherit' : 'var(--text-4)' }}>
                                    {talent.program?.name ?? '—'}
                                </span>
                            </div>
                            <div className="divider" />
                            <div className="row-between">
                                <span className="muted">Universidade</span>
                                <span style={{ color: talent.university ? 'inherit' : 'var(--text-4)' }}>
                                    {talent.university?.name ?? '—'}
                                </span>
                            </div>
                            <div className="divider" />
                            <div className="row-between">
                                <span className="muted">Departamento</span>
                                <span style={{ color: talent.department ? 'inherit' : 'var(--text-4)' }}>
                                    {talent.department?.name ?? '—'}
                                </span>
                            </div>
                            <div className="divider" />
                            <div className="row-between">
                                <span className="muted">Mentor</span>
                                <span style={{ color: talent.mentor ? 'inherit' : 'var(--text-4)' }}>
                                    {talent.mentor?.name ?? '—'}
                                </span>
                            </div>
                            <div className="divider" />
                            <div className="row-between"><span className="muted">Desempenho Atual</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div className="bar-track" style={{ width: 60 }}>
                                        <div className="bar-fill" style={{ width: `${talent.perf ?? 0}%`, background: (talent.perf ?? 0) >= 85 ? 'var(--success)' : (talent.perf ?? 0) >= 70 ? 'var(--warn)' : 'var(--danger)' }} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{talent.perf ?? '—'}{talent.perf != null ? '%' : ''}</span>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="row-between"><span className="muted">Score de Risco</span>
                                <span className={`pill pill-${riskTone}`}>{riskScore > 0 ? `${Math.round(riskScore * 100)}%` : 'Baixo'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Alertas de Dados em Falta ──────────────── */}
                {missingFields.length > 0 && canEdit && (
                    <div className="card" style={{ borderLeft: '4px solid var(--warn)', background: 'var(--warn-bg)' }}>
                        <div className="card-pad" style={{ padding: '12px 18px' }}>
                            <div className="row" style={{ gap: 12 }}>
                                <AlertCircle style={{ color: 'var(--warn)' }} size={18} />
                                <div>
                                    <b style={{ fontSize: 13, color: 'var(--warn)' }}>Dados em falta detectados</b>
                                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-2)' }}>
                                        Faltam os seguintes campos: {missingFields.map(f => f.label).join(', ')}. 
                                        <Link href={talentId ? editRoute(talentId).url : '#'} style={{ marginLeft: 8, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Completar agora &rarr;</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Rotações ─────────────────────────── */}
                {talent.rotations && talent.rotations.length > 0 && (
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Histórico de Rotações</span>
                            <span className="tab-count">{talent.rotations.length}</span>
                        </div>
                        <div className="table-wrap">
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Departamento</th>
                                        <th>Supervisor</th>
                                        <th>Início</th>
                                        <th>Fim</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {talent.rotations.map((r: any) => (
                                        <tr key={r.id}>
                                            <td>{r.department?.name ?? r.department_id ?? '—'}</td>
                                            <td>{r.supervisor ?? '—'}</td>
                                            <td>{r.start_date ? new Date(r.start_date).toLocaleDateString('pt-PT') : '—'}</td>
                                            <td>{r.end_date ? new Date(r.end_date).toLocaleDateString('pt-PT') : '—'}</td>
                                            <td><span className={`pill ${r.status === 'activa' ? 'pill-success' : r.status === 'concluida' ? 'pill-info' : 'pill-neutral'}`}>{r.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Pagamentos ───────────────────────── */}
                {talent.payments && talent.payments.length > 0 && (
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Pagamentos Recentes</span>
                            <span className="tab-count">{talent.payments.length}</span>
                        </div>
                        <div className="table-wrap">
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th>Referência</th>
                                        <th>Tipo</th>
                                        <th>Período</th>
                                        <th>Valor</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {talent.payments.map((p: any) => (
                                        <tr key={p.id}>
                                            <td className="mono" style={{ fontSize: 11 }}>{p.payment_ref}</td>
                                            <td>{p.type}</td>
                                            <td>{p.period}</td>
                                            <td style={{ fontWeight: 600 }}>{parseFloat(p.amount).toLocaleString('pt-AO')} {p.currency}</td>
                                            <td><span className={`pill ${p.status === 'pago' ? 'pill-success' : p.status === 'pendente' ? 'pill-warn' : 'pill-danger'}`}>{p.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Observações ──────────────────────── */}
                {talent.observacoes && (
                    <div className="card" style={{ maxWidth: 800 }}>
                        <div className="card-head">
                            <span className="card-title">Observações e Notas</span>
                        </div>
                        <div className="card-pad">
                            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{talent.observacoes}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

TalentosShow.layout = {
    breadcrumbs: [{ title: 'Talentos' }],
};
