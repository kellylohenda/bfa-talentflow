import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/candidaturas';
import type { Program, University } from '@/types';

type Props = { programs: Program[]; universities: University[] };

export default function CandidaturasCreate({ programs, universities }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        program_id: '',
        university_id: '',
        tipo: '' as '' | 'bolseiro' | 'estagiario',
        observacoes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Nova Candidatura" />

            <div className="section">
                <div className="page-head">
                    <h1>Nova Candidatura</h1>
                    <p>Registar candidatura ao programa</p>
                </div>

                <div className="card" style={{ maxWidth: 700 }}>
                    <div className="card-pad">
                        <form onSubmit={submit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Nome *</label>
                                    <input className="input" value={data.name} onChange={e => setData('name', e.target.value)} autoFocus />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">E-mail *</label>
                                    <input className="input" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Telefone</label>
                                    <input className="input" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tipo</label>
                                    <select className="input select" value={data.tipo} onChange={e => setData('tipo', e.target.value as '' | 'bolseiro' | 'estagiario')}>
                                        <option value="">Seleccionar</option>
                                        <option value="bolseiro">Bolseiro</option>
                                        <option value="estagiario">Estagiário</option>
                                    </select>
                                    <InputError message={errors.tipo} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Programa *</label>
                                <select className="input select" value={data.program_id} onChange={e => setData('program_id', e.target.value)}>
                                    <option value="">Seleccionar programa</option>
                                    {programs.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                                </select>
                                <InputError message={errors.program_id} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Universidade</label>
                                <select className="input select" value={data.university_id} onChange={e => setData('university_id', e.target.value)}>
                                    <option value="">Seleccionar</option>
                                    {universities.map(u => <option key={u.id} value={String(u.id)}>{u.name}</option>)}
                                </select>
                                <InputError message={errors.university_id} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Observações</label>
                                <textarea className="input" rows={3} value={data.observacoes} onChange={e => setData('observacoes', e.target.value)} />
                                <InputError message={errors.observacoes} />
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 24, borderTop: '1px solid #F5F5F5' }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'A gravar...' : 'Criar Candidatura'}
                                </button>
                                <Link href={index().url} className="btn btn-outline">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

CandidaturasCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Candidaturas', href: index().url },
        { title: 'Nova', href: '#' },
    ],
});
