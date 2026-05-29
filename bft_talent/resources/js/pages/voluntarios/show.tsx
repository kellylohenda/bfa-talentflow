import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { index } from '@/routes/voluntarios';
import type { Volunteer, HoursEntry, Evento } from '@/types';

type EventoInscricao = {
    id: number;
    evento: Evento | null;
    inscrito_at: string | null;
    status: string;
};

type Props = {
    voluntario: Volunteer & {
        hoursEntries?: HoursEntry[];
        eventoInscricoes?: EventoInscricao[];
    };
};

const statusPill: Record<string, string> = {
    activo: 'pill pill-success',
    inactivo: 'pill pill-neutral',
    suspenso: 'pill pill-danger',
};

const hoursPill: Record<string, string> = {
    pendente: 'pill pill-warn',
    validado: 'pill pill-success',
    rejeitado: 'pill pill-danger',
};

function niveauLabel(hours: number): string {
    if (hours >= 200) {
return 'Ouro';
}

    if (hours >= 100) {
return 'Prata';
}

    if (hours >= 50) {
return 'Bronze';
}

    return 'Iniciante';
}

export default function VoluntariosShow({ voluntario }: Props) {
    const totalHoras = parseFloat(voluntario.total_horas);
    const activities = voluntario.eventoInscricoes ?? [];
    const recentHours = voluntario.hoursEntries ?? [];

    return (
        <>
            <Head title={voluntario.nome} />
            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 12 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft style={{ width: 14, height: 14 }} />
                        </Link>
                        <div>
                            <h1 className="page-title">{voluntario.nome}</h1>
                            <p className="page-subtitle">{voluntario.volunteer_code}</p>
                        </div>
                    </div>
                    <div className="page-actions">
                        <span className={statusPill[voluntario.status] ?? 'pill pill-neutral'}>
                            {voluntario.status}
                        </span>
                    </div>
                </div>

                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    <div className="kpi">
                        <span className="kpi-label">Total Horas</span>
                        <span className="kpi-value">{totalHoras.toFixed(0)}h</span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Área</span>
                        <span className="kpi-value">{voluntario.area_actuacao}</span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Estado</span>
                        <span className="kpi-value">
                            <span className={statusPill[voluntario.status] ?? 'pill pill-neutral'}>{voluntario.status}</span>
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Nível</span>
                        <span className="kpi-value">{niveauLabel(totalHoras)}</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-head">
                        <span className="card-title">Perfil do Voluntário</span>
                    </div>
                    <div className="card-pad">
                        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                            <BfaAvatar name={voluntario.nome} size={28} />
                            <span className="muted">Nome:</span>
                            <span><b>{voluntario.nome}</b></span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">E-mail</span>
                            <span>{voluntario.email}</span>
                        </div>
                        {voluntario.phone && (
                            <>
                                <div className="divider" />
                                <div className="row-between">
                                    <span className="muted">Telefone</span>
                                    <span>{voluntario.phone}</span>
                                </div>
                            </>
                        )}
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Área</span>
                            <span>{voluntario.area_actuacao}</span>
                        </div>
                        {voluntario.mentor && (
                            <>
                                <div className="divider" />
                                <div className="row-between">
                                    <span className="muted">Mentor</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <BfaAvatar name={voluntario.mentor.name} size={20} />
                                        <b>{voluntario.mentor.name}</b>
                                    </span>
                                </div>
                            </>
                        )}
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Data início</span>
                            <span>{new Date(voluntario.data_inicio).toLocaleDateString('pt-PT')}</span>
                        </div>
                        {voluntario.motivacao && (
                            <>
                                <div className="divider" />
                                <div>
                                    <span className="muted">Motivação</span>
                                    <p style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{voluntario.motivacao}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {activities.length > 0 && (
                    <div className="card" style={{ marginTop: 24 }}>
                        <div className="card-head">
                            <span className="card-title">Actividades</span>
                        </div>
                        <div className="card-pad">
                            <div className="table-wrap">
                                <table className="tbl">
                                    <thead>
                                        <tr>
                                            <th>Actividade</th>
                                            <th>Data</th>
                                            <th>Horas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activities.map((insc) => (
                                            <tr key={insc.id}>
                                                <td>{insc.evento?.titulo ?? '—'}</td>
                                                <td className="mono">
                                                    {insc.inscrito_at
                                                        ? new Date(insc.inscrito_at).toLocaleDateString('pt-PT')
                                                        : '—'}
                                                </td>
                                                <td className="mono">{insc.evento?.data_inicio
                                                    ? new Date(insc.evento.data_inicio).toLocaleDateString('pt-PT')
                                                    : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {recentHours.length > 0 && (
                    <div className="card" style={{ marginTop: 24 }}>
                        <div className="card-head">
                            <span className="card-title">Horas Recentes</span>
                        </div>
                        <div className="card-pad">
                            <div className="table-wrap">
                                <table className="tbl">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Horas</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentHours.map((h) => (
                                            <tr key={h.id}>
                                                <td className="mono">
                                                    {new Date(h.date).toLocaleDateString('pt-PT')}
                                                </td>
                                                <td className="mono">{h.hours}h</td>
                                                <td>
                                                    <span className={hoursPill[h.status] ?? 'pill pill-neutral'}>{h.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row" style={{ gap: 8, marginTop: 24 }}>
                    <Link href={`/voluntarios/${voluntario.id}/edit`} className="btn btn-ghost btn-sm">
                        <Pencil style={{ width: 14, height: 14 }} /> Editar
                    </Link>
                    {voluntario.status === 'activo' && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                                if (confirm('Tem certeza que deseja inactivar este voluntário?')) {
                                    router.patch(`/voluntarios/${voluntario.id}`, { status: 'inactivo' });
                                }
                            }}
                        >
                            Inactivar
                        </button>
                    )}
                </div>

                <div style={{ marginTop: 24 }}>
                    <Link href={index().url} className="btn btn-ghost btn-sm">← Voltar</Link>
                </div>
            </div>
        </>
    );
}

VoluntariosShow.layout = {
    breadcrumbs: [{ title: 'Voluntários' }],
};
