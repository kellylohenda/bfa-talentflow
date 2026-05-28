import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { index, show, update } from '@/routes/tarefas';
import type { Mentor, Talent, Task } from '@/types';

type Props = { tarefa: Task; talents: Talent[]; mentors: Mentor[] };

export default function TarefasEdit({ tarefa, talents, mentors }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        title: tarefa.title,
        description: tarefa.description ?? '',
        status: tarefa.status,
        priority: tarefa.priority,
        due_date: tarefa.due_date ?? '',
        assigned_to_id: String(tarefa.assigned_to?.id ?? ''),
        talent_id: String(tarefa.talent?.id ?? ''),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(update({ tarefa: tarefa.id }).url);
    }

    return (
        <>
            <Head title={`Editar — ${tarefa.title}`} />
            <div className="section" style={{ padding: '20px 24px 40px' }}>
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={show({ tarefa: tarefa.id }).url} className="btn btn-ghost btn-sm"><ArrowLeft style={{ width: 14, height: 14 }} /></Link>
                        <div>
                            <h1 className="page-title">Editar Tarefa</h1>
                            <p className="page-subtitle">{tarefa.title}</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-pad">
                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">Título *</label>
                                <input
                                    id="title"
                                    className="input"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="description">Descrição</label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="input"
                                    style={{ height: 'auto', padding: '8px 10px', resize: 'vertical' }}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="status">Estado</label>
                                    <select
                                        id="status"
                                        className="input select"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as Task['status'])}
                                    >
                                        <option value="pendente">Pendente</option>
                                        <option value="em_andamento">Em Andamento</option>
                                        <option value="concluida">Concluída</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="priority">Prioridade</label>
                                    <select
                                        id="priority"
                                        className="input select"
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value as Task['priority'])}
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                        <option value="urgente">Urgente</option>
                                    </select>
                                    <InputError message={errors.priority} />
                                </div>
                            </div>

                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="assigned_to_id">Atribuir a</label>
                                    <select
                                        id="assigned_to_id"
                                        className="input select"
                                        value={data.assigned_to_id}
                                        onChange={(e) => setData('assigned_to_id', e.target.value)}
                                    >
                                        <option value="">Seleccionar</option>
                                        {mentors.map((m) => (
                                            <option key={m.id} value={String(m.id)}>{m.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.assigned_to_id} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="talent_id">Talento</label>
                                    <select
                                        id="talent_id"
                                        className="input select"
                                        value={data.talent_id}
                                        onChange={(e) => setData('talent_id', e.target.value)}
                                    >
                                        <option value="">Seleccionar</option>
                                        {talents.map((t) => (
                                            <option key={t.id} value={String(t.id)}>{t.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.talent_id} />
                                </div>
                            </div>

                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="due_date">Data Limite</label>
                                    <input
                                        id="due_date"
                                        type="date"
                                        className="input"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                    <InputError message={errors.due_date} />
                                </div>
                            </div>

                            <div className="row" style={{ gap: 8, paddingTop: 8 }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>Guardar Alterações</button>
                                <Link href={show({ tarefa: tarefa.id }).url} className="btn">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

TarefasEdit.layout = {
    breadcrumbs: [{ title: 'Tarefas' }],
};
