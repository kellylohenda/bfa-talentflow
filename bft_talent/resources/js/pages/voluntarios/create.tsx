import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/voluntarios';
import type { Mentor } from '@/types';

type Props = { mentors: Mentor[] };

export default function VoluntariosCreate({ mentors }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        email: '',
        phone: '',
        area_actuacao: '',
        mentor_user_id: '',
        data_inicio: new Date().toISOString().slice(0, 10),
        motivacao: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Novo Voluntário" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Novo Voluntário</h1>
                        <p className="page-subtitle">Registar voluntário no programa</p>
                    </div>
                    <div className="page-actions">
                        <Link href={index().url} className="btn btn-ghost btn-sm">← Voltar</Link>
                    </div>
                </div>
                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-pad">
                        <form onSubmit={submit}>
                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="nome">Nome *</label>
                                    <input className="input" id="nome" value={data.nome} onChange={(e) => setData('nome', e.target.value)} autoFocus />
                                    <InputError message={errors.nome} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">E-mail *</label>
                                    <input className="input" id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    <InputError message={errors.email} />
                                </div>
                            </div>
                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="phone">Telefone</label>
                                    <input className="input" id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="area_actuacao">Área de Actuação *</label>
                                    <input className="input" id="area_actuacao" value={data.area_actuacao} onChange={(e) => setData('area_actuacao', e.target.value)} />
                                    <InputError message={errors.area_actuacao} />
                                </div>
                            </div>
                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="data_inicio">Data de Início *</label>
                                    <input className="input" id="data_inicio" type="date" value={data.data_inicio} onChange={(e) => setData('data_inicio', e.target.value)} />
                                    <InputError message={errors.data_inicio} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="mentor_user_id">Mentor</label>
                                    <select className="input select" id="mentor_user_id" value={data.mentor_user_id} onChange={(e) => setData('mentor_user_id', e.target.value)}>
                                        <option value="">Seleccionar</option>
                                        {mentors.map((m) => <option key={m.id} value={String(m.id)}>{m.name}</option>)}
                                    </select>
                                    <InputError message={errors.mentor_user_id} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="motivacao">Motivação</label>
                                <textarea
                                    id="motivacao"
                                    rows={3}
                                    className="input"
                                    value={data.motivacao}
                                    onChange={(e) => setData('motivacao', e.target.value)}
                                />
                                <InputError message={errors.motivacao} />
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>Registar Voluntário</button>
                                <Link href={index().url} className="btn btn-ghost">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

VoluntariosCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Voluntários', href: index().url },
        { title: 'Novo', href: '#' },
    ],
});
