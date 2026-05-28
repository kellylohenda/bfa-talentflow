import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { index, show } from '@/routes/tarefas';
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
    return (
        <>
            <Head title={tarefa.title} />
            <div className="section" style={{ padding: '20px 24px 40px' }}>
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm"><ArrowLeft style={{ width: 14, height: 14 }} /></Link>
                        <div>
                            <h1 className="page-title">{tarefa.title}</h1>
                            <p className="page-subtitle">Prioridade: {tarefa.priority}</p>
                        </div>
                    </div>
                </div>

                <div className="grid cols-2">
                    <div className="card">
                        <div className="card-head">
                            <span className="card-title">Detalhes</span>
                        </div>
                        <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                                    <span style={{ fontWeight: 500 }}>{new Date(tarefa.due_date).toLocaleDateString('pt-PT')}</span>
                                </div>
                            )}
                            {tarefa.assigned_to && (
                                <div className="row" style={{ gap: 8 }}>
                                    <User style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                    <span className="muted">Atribuído a:</span>
                                    <span style={{ fontWeight: 500 }}>{tarefa.assigned_to.name}</span>
                                </div>
                            )}
                            {tarefa.talent && (
                                <div className="row" style={{ gap: 8 }}>
                                    <User style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                    <span className="muted">Talento:</span>
                                    <span style={{ fontWeight: 500 }}>{tarefa.talent.name}</span>
                                </div>
                            )}
                            <div className="row" style={{ gap: 8 }}>
                                <Calendar style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                <span className="muted">Criada em:</span>
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
            </div>
        </>
    );
}

TarefasShow.layout = {
    breadcrumbs: [{ title: 'Tarefas' }],
};
