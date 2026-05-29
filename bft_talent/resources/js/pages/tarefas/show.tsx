import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { update, destroy } from '@/routes/api/v1/tarefas';
import { index, show, edit } from '@/routes/tarefas';
import type { Task } from '@/types';

type Props = { tarefa: Task };

const statusPill: Record<string, string> = {
    pendente: 'pill pill-neutral',
    em_andamento: 'pill pill-info',
    concluida: 'pill pill-success',
    cancelada: 'pill pill-danger',
};

const statusLabel: Record<string, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    concluida: 'Concluída',
    cancelada: 'Cancelada',
};

const priorityPill: Record<string, string> = {
    baixa: 'pill pill-neutral',
    media: 'pill pill-info',
    alta: 'pill pill-warn',
    urgente: 'pill pill-danger',
};

const priorityLabel: Record<string, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
    urgente: 'Urgente',
};

export default function TarefasShow({ tarefa }: Props) {
    const handleStatusChange = (newStatus: string) => {
        router.put(update.url({ tarefa: tarefa.id }), { status: newStatus } as any, { preserveScroll: true });
    };

    const handleEliminar = () => {
        if (!confirm('Tem certeza que deseja eliminar esta tarefa?')) {
return;
}

        router.delete(destroy.url({ tarefa: tarefa.id }));
    };

    return (
        <>
            <Head title={tarefa.title} />
            <div className="section" style={{ padding: '20px 24px 40px' }}>
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft style={{ width: 14, height: 14 }} />
                        </Link>
                        <div>
                            <h1 className="page-title">{tarefa.title}</h1>
                            <p className="page-subtitle">{priorityLabel[tarefa.priority] ?? tarefa.priority}</p>
                        </div>
                    </div>
                    <span className={statusPill[tarefa.status] ?? 'pill pill-neutral'}>
                        {statusLabel[tarefa.status] ?? tarefa.status}
                    </span>
                </div>

                <div className="grid cols-4" style={{ maxWidth: 900, marginBottom: 24 }}>
                    <div className="kpi">
                        <span className="kpi-label">Prioridade</span>
                        <span className="kpi-value">
                            <span className={priorityPill[tarefa.priority] ?? 'pill pill-neutral'}>
                                {priorityLabel[tarefa.priority] ?? tarefa.priority}
                            </span>
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Estado</span>
                        <span className="kpi-value">
                            <span className={statusPill[tarefa.status] ?? 'pill pill-neutral'}>
                                {statusLabel[tarefa.status] ?? tarefa.status}
                            </span>
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Prazo</span>
                        <span className="kpi-value">
                            {tarefa.due_date
                                ? new Date(tarefa.due_date).toLocaleDateString('pt-PT')
                                : '—'}
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Talento</span>
                        <span className="kpi-value">{tarefa.talent?.name ?? '—'}</span>
                    </div>
                </div>

                <div className="grid cols-2" style={{ maxWidth: 900 }}>
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Detalhe da Tarefa</span>
                        </div>
                        <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div className="row-between">
                                <span className="muted">Título</span>
                                <span style={{ fontWeight: 500 }}>{tarefa.title}</span>
                            </div>
                            <div className="row-between">
                                <span className="muted">Estado</span>
                                <span className={statusPill[tarefa.status] ?? 'pill pill-neutral'}>
                                    {statusLabel[tarefa.status] ?? tarefa.status}
                                </span>
                            </div>
                            <div className="row-between">
                                <span className="muted">Prioridade</span>
                                <span className={priorityPill[tarefa.priority] ?? 'pill pill-neutral'}>
                                    {priorityLabel[tarefa.priority] ?? tarefa.priority}
                                </span>
                            </div>
                            {tarefa.due_date && (
                                <div className="row-between">
                                    <span className="muted">Data Limite</span>
                                    <span style={{ fontWeight: 500 }}>
                                        {new Date(tarefa.due_date).toLocaleDateString('pt-PT')}
                                    </span>
                                </div>
                            )}
                            {tarefa.created_by && (
                                <div className="row-between">
                                    <span className="muted">Criado por</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <User style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                        <span style={{ fontWeight: 500 }}>{tarefa.created_by.name}</span>
                                    </span>
                                </div>
                            )}
                            <div className="row-between">
                                <span className="muted">Criada em</span>
                                <span>{new Date(tarefa.created_at).toLocaleDateString('pt-PT')}</span>
                            </div>
                        </div>
                    </div>

                    {tarefa.description && (
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Descrição</span>
                            </div>
                            <div className="card-pad">
                                <p style={{ whiteSpace: 'pre-wrap' }}>{tarefa.description}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="row" style={{ gap: 8, marginTop: 24 }}>
                    <Link href={edit.url({ tarefa: tarefa.id })} className="btn btn-ghost btn-sm">
                        Editar
                    </Link>
                    {tarefa.status === 'pendente' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange('em_andamento')}>
                            Iniciar
                        </button>
                    )}
                    {tarefa.status === 'em_andamento' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange('concluida')}>
                            Concluir
                        </button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={handleEliminar}>
                        Eliminar
                    </button>
                    <Link href={index().url} className="btn btn-ghost btn-sm">
                        Voltar
                    </Link>
                </div>
            </div>
        </>
    );
}

TarefasShow.layout = {
    breadcrumbs: [{ title: 'Tarefas' }],
};
