import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/faltas';
import type { Talent } from '@/types';

type Props = { talents: Talent[] };

export default function FaltasCreate({ talents }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        type: '',
        reason: '',
        start_date: '',
        end_date: '',
        justificado: false,
        talent_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Nova Falta" />
            <div className="section">
                <div className="page-head">
                    <div className="flex items-center gap-3">
                        <Link href={index().url} className="btn btn-ghost btn-sm"><ArrowLeft /></Link>
                        <div>
                            <h1 className="page-title">Nova Falta</h1>
                            <p className="page-subtitle">Registar falta ou ausência</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-pad">
                        <form onSubmit={submit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="talent_id">Talento *</label>
                                <select
                                    id="talent_id"
                                    className="select"
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

                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="start_date">Data Início *</label>
                                    <input
                                        id="start_date"
                                        type="date"
                                        className="input"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="end_date">Data Fim *</label>
                                    <input
                                        id="end_date"
                                        type="date"
                                        className="input"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="type">Tipo *</label>
                                    <select
                                        id="type"
                                        className="select"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="doenca">Doença</option>
                                        <option value="pessoal">Motivo Pessoal</option>
                                        <option value="ferias">Férias</option>
                                        <option value="academico">Compromisso Académico</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="justificado">Justificado</label>
                                    <select
                                        id="justificado"
                                        className="select"
                                        value={data.justificado ? 'sim' : 'nao'}
                                        onChange={(e) => setData('justificado', e.target.value === 'sim')}
                                    >
                                        <option value="nao">Não</option>
                                        <option value="sim">Sim</option>
                                    </select>
                                    <InputError message={errors.justificado} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="reason">Motivo</label>
                                <textarea
                                    id="reason"
                                    rows={3}
                                    className="input"
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                />
                                <InputError message={errors.reason} />
                            </div>

                            <div className="flex gap-2" style={{ paddingTop: 8 }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>Criar Falta</button>
                                <Link href={index().url} className="btn btn-ghost">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

FaltasCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Faltas', href: index().url },
        { title: 'Nova', href: '#' },
    ],
});
