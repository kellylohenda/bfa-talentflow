import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/mensagens';

type Utilizador = { id: number; name: string; email: string };
type Props = { utilizadores: Utilizador[] };

export default function MensagensCreate({ utilizadores }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        to_user_id: '',
        subject: '',
        body: '',
        tipo: 'geral',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Nova Mensagem" />
            <div className="section">
                <div className="page-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft size={14} />
                        </Link>
                        <div>
                            <h1 className="page-title">Nova Mensagem</h1>
                            <p className="page-subtitle">Enviar mensagem interna</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-pad">
                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Destinatário *</label>
                                <select className="input select" value={data.to_user_id} onChange={(e) => setData('to_user_id', e.target.value)}>
                                    <option value="">Seleccionar utilizador</option>
                                    {utilizadores.map((u) => (
                                        <option key={u.id} value={String(u.id)}>{u.name} — {u.email}</option>
                                    ))}
                                </select>
                                <InputError message={errors.to_user_id} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Assunto *</label>
                                <input
                                    className="input"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    autoFocus
                                />
                                <InputError message={errors.subject} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tipo</label>
                                <select className="input select" value={data.tipo} onChange={(e) => setData('tipo', e.target.value)}>
                                    <option value="geral">Geral</option>
                                    <option value="notificacao">Notificação</option>
                                    <option value="alerta">Alerta</option>
                                </select>
                                <InputError message={errors.tipo} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mensagem *</label>
                                <textarea
                                    className="input"
                                    rows={6}
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                />
                                <InputError message={errors.body} />
                            </div>
                            <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>Enviar Mensagem</button>
                                <Link href={index().url} className="btn btn-ghost">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

MensagensCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Mensagens', href: index().url },
        { title: 'Nova', href: '#' },
    ],
});
