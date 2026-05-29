import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Users, CalendarDays, MapPin, Tag, BookOpen } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { index, show } from '@/routes/eventos';
import type { Evento, Mentor } from '@/types';

type Inscricao = {
    id: number;
    status: string;
    talent?: { id: number; name: string } | null;
    volunteer?: { id: number; nome: string } | null;
};

type Props = {
    evento: Evento & { inscricoes?: Inscricao[] };
};

const statusPill: Record<string, string> = {
    planeado: 'pill-info',
    confirmado: 'pill-success',
    concluido: 'pill-neutral',
    cancelado: 'pill-danger',
};

export default function EventosShow({ evento }: Props) {
    const { auth } = usePage().props as { auth: { user: Mentor & { talent_id?: number | null; volunteer_id?: number | null } } };
    const user = auth.user;
    const inscricoes = evento.inscricoes ?? [];
    const inscritosCount = inscricoes.length;
    const vagasDisponiveis = evento.vagas !== null ? evento.vagas - inscritosCount : null;

    const isAlreadyInscrito = inscricoes.some(
        (i) => (user.talent_id && i.talent?.id === user.talent_id) || (user.volunteer_id && i.volunteer?.id === user.volunteer_id),
    );
    const canInscricao = !isAlreadyInscrito && (vagasDisponiveis === null || vagasDisponiveis > 0) && (user.talent_id || user.volunteer_id);

    function handleInscrever() {
        router.post(`/api/v1/eventos/${evento.id}/inscrever`, {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title={evento.titulo} />
            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="page-title">{evento.titulo}</h1>
                            <p className="page-subtitle">
                                {evento.tipo} · {evento.formato}
                            </p>
                        </div>
                    </div>
                    <div className="page-actions">
                        <span className={`pill ${statusPill[evento.status] ?? 'pill-neutral'}`}>{evento.status}</span>
                        <Link href={`${index().url}/${evento.id}/editar`} className="btn btn-ghost btn-sm">
                            <Pencil size={14} /> Editar
                        </Link>
                        {canInscricao && (
                            <button className="btn btn-primary btn-sm" onClick={handleInscrever}>
                                Inscrever-me
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    <div className="kpi">
                        <div className="kpi-icon" style={{ color: 'var(--primary)' }}><Users size={18} /></div>
                        <div className="kpi-label">Vagas</div>
                        <div className="kpi-value">{vagasDisponiveis !== null ? vagasDisponiveis : '—'}</div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-icon" style={{ color: 'var(--info)' }}><Users size={18} /></div>
                        <div className="kpi-label">Inscritos</div>
                        <div className="kpi-value">{inscritosCount}</div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-icon" style={{ color: 'var(--success)' }}><Tag size={18} /></div>
                        <div className="kpi-label">Estado</div>
                        <div className="kpi-value" style={{ textTransform: 'capitalize' }}>{evento.status}</div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-icon" style={{ color: 'var(--info)' }}><BookOpen size={18} /></div>
                        <div className="kpi-label">Formato</div>
                        <div className="kpi-value" style={{ textTransform: 'capitalize' }}>{evento.formato}</div>
                    </div>
                </div>

                <div className="grid cols-2" style={{ gap: 24 }}>
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Detalhe do Evento</span>
                        </div>
                        <div className="card-pad">
                            <div className="row-between" style={{ padding: '6px 0' }}>
                                <span className="muted">Título</span>
                                <span>{evento.titulo}</span>
                            </div>
                            <div className="divider" />
                            <div className="row-between" style={{ padding: '6px 0' }}>
                                <span className="muted">Tipo</span>
                                <span className="pill pill-neutral">{evento.tipo}</span>
                            </div>
                            <div className="divider" />
                            <div className="row-between" style={{ padding: '6px 0' }}>
                                <span className="muted">Data de Início</span>
                                <span>{new Date(evento.data_inicio).toLocaleDateString('pt-PT')}</span>
                            </div>
                            {evento.data_fim && (
                                <>
                                    <div className="divider" />
                                    <div className="row-between" style={{ padding: '6px 0' }}>
                                        <span className="muted">Data de Fim</span>
                                        <span>{new Date(evento.data_fim).toLocaleDateString('pt-PT')}</span>
                                    </div>
                                </>
                            )}
                            {evento.local && (
                                <>
                                    <div className="divider" />
                                    <div className="row-between" style={{ padding: '6px 0' }}>
                                        <span className="muted">Local</span>
                                        <span>{evento.local}</span>
                                    </div>
                                </>
                            )}
                            <div className="divider" />
                            <div className="row-between" style={{ padding: '6px 0' }}>
                                <span className="muted">Formato</span>
                                <span className="pill pill-info">{evento.formato}</span>
                            </div>
                            {evento.descricao && (
                                <>
                                    <div className="divider" />
                                    <div style={{ paddingTop: 8 }}>
                                        <p className="muted" style={{ marginBottom: 4, fontSize: 12 }}>Descrição</p>
                                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{evento.descricao}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Inscritos</span>
                        </div>
                        {inscricoes.length === 0 ? (
                            <div className="card-pad" style={{ padding: 32, textAlign: 'center', color: 'var(--text-4)' }}>
                                Nenhuma inscrição registada.
                            </div>
                        ) : (
                            <div className="table-wrap">
                                <table className="tbl">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inscricoes.map((insc) => {
                                            const nome = insc.talent?.name ?? insc.volunteer?.nome ?? '—';

                                            return (
                                                <tr key={insc.id}>
                                                    <td>
                                                        <div className="cell-person">
                                                            <BfaAvatar name={nome} size={24} />
                                                            <span>{nome}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`pill ${insc.status === 'inscrito' ? 'pill-success' : 'pill-neutral'}`}>
                                                            {insc.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

EventosShow.layout = {
    breadcrumbs: [{ title: 'Eventos' }],
};
