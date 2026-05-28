import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/tarefas';
import type { Mentor, Talent } from '@/types';

type Props = { talents: Talent[]; mentors: Mentor[] };

export default function TarefasCreate({ talents, mentors }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        priority: 'media' as string,
        due_date: '',
        assigned_to_id: '',
        talent_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Nova Tarefa" />
            <div className="section" style={{ padding: '20px 24px 40px' }}>
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm"><ArrowLeft style={{ width: 14, height: 14 }} /></Link>
                        <div>
                            <h1 className="page-title">Nova Tarefa</h1>
                            <p className="page-subtitle">Criar nova tarefa</p>
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
                                    autoFocus
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
                                    <label className="form-label" htmlFor="priority">Prioridade *</label>
                                    <select
                                        id="priority"
                                        className="input select"
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                        <option value="urgente">Urgente</option>
                                    </select>
                                    <InputError message={errors.priority} />
                                </div>
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

                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="assigned_to_id">Atribuir a</label>
                                    <select
                                        id="assigned_to_id"
                                        className="input select"
                                        value={data.assigned_to_id}
                                        onChange={(e) => setData('assigned_to_id', e.target.value)}
                                    >
                                        <option value="">Seleccionar mentor</option>
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
                                        <option value="">Seleccionar talento</option>
                                        {talents.map((t) => (
                                            <option key={t.id} value={String(t.id)}>{t.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.talent_id} />
                                </div>
                            </div>

                            <div className="row" style={{ gap: 8, paddingTop: 8 }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>Criar Tarefa</button>
                                <Link href={index().url} className="btn">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

TarefasCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Tarefas', href: index().url },
        { title: 'Nova', href: '#' },
    ],
});
