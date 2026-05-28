import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/eventos';

export default function EventosCreate() {
    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        tipo: 'formacao',
        formato: 'presencial',
        descricao: '',
        data_inicio: new Date().toISOString().slice(0, 10),
        data_fim: '',
        local: '',
        vagas: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Novo Evento" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Novo Evento</h1>
                        <p className="page-subtitle">Agendar evento ou actividade</p>
                    </div>
                    <div className="page-actions">
                        <Link href={index().url} className="btn btn-ghost btn-sm">← Voltar</Link>
                    </div>
                </div>
                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-pad">
                        <form onSubmit={submit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="titulo">Título *</label>
                                <input className="input" id="titulo" value={data.titulo} onChange={(e) => setData('titulo', e.target.value)} autoFocus />
                                <InputError message={errors.titulo} />
                            </div>
                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="tipo">Tipo *</label>
                                    <select className="input select" id="tipo" value={data.tipo} onChange={(e) => setData('tipo', e.target.value)}>
                                        <option value="formacao">Formação</option>
                                        <option value="palestra">Palestra</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="networking">Networking</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                    <InputError message={errors.tipo} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="formato">Formato *</label>
                                    <select className="input select" id="formato" value={data.formato} onChange={(e) => setData('formato', e.target.value)}>
                                        <option value="presencial">Presencial</option>
                                        <option value="online">Online</option>
                                        <option value="hibrido">Híbrido</option>
                                    </select>
                                    <InputError message={errors.formato} />
                                </div>
                            </div>
                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="data_inicio">Data de Início *</label>
                                    <input className="input" id="data_inicio" type="date" value={data.data_inicio} onChange={(e) => setData('data_inicio', e.target.value)} />
                                    <InputError message={errors.data_inicio} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="data_fim">Data de Fim</label>
                                    <input className="input" id="data_fim" type="date" value={data.data_fim} onChange={(e) => setData('data_fim', e.target.value)} />
                                    <InputError message={errors.data_fim} />
                                </div>
                            </div>
                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="local">Local</label>
                                    <input className="input" id="local" value={data.local} onChange={(e) => setData('local', e.target.value)} />
                                    <InputError message={errors.local} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="vagas">Vagas</label>
                                    <input className="input" id="vagas" type="number" min="1" value={data.vagas} onChange={(e) => setData('vagas', e.target.value)} />
                                    <InputError message={errors.vagas} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="descricao">Descrição</label>
                                <textarea
                                    id="descricao"
                                    rows={3}
                                    className="input"
                                    value={data.descricao}
                                    onChange={(e) => setData('descricao', e.target.value)}
                                />
                                <InputError message={errors.descricao} />
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>Criar Evento</button>
                                <Link href={index().url} className="btn btn-ghost">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

EventosCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Eventos', href: index().url },
        { title: 'Novo', href: '#' },
    ],
});
