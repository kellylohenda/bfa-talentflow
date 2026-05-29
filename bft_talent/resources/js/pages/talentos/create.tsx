import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/talentos';
import type { Department, Mentor, Program, University } from '@/types';

type Props = {
    programs: Program[];
    universities: University[];
    departments: Department[];
    mentors: Mentor[];
};

export default function TalentosCreate({ programs, universities, departments, mentors }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        kind: 'bolseiro' as 'bolseiro' | 'estagiario',
        program_id: '',
        university_id: '',
        department_id: '',
        mentor_user_id: '',
        stipend: '',
        start_date: '',
        end_date: '',
        observacoes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Novo Talento" />

            <div className="section">
                <div className="page-head">
                    <h1>Novo Talento</h1>
                    <p>Registar bolseiro ou estagiário</p>
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
                                    <label className="form-label">E-mail</label>
                                    <input className="input" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipo *</label>
                                <select className="input select" value={data.kind} onChange={e => setData('kind', e.target.value as 'bolseiro' | 'estagiario')}>
                                    <option value="bolseiro">Bolseiro</option>
                                    <option value="estagiario">Estagiário</option>
                                </select>
                                <InputError message={errors.kind} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Programa *</label>
                                <select className="input select" value={data.program_id} onChange={e => setData('program_id', e.target.value)}>
                                    <option value="">Seleccionar programa</option>
                                    {programs.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                                </select>
                                <InputError message={errors.program_id} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Universidade</label>
                                    <select className="input select" value={data.university_id} onChange={e => setData('university_id', e.target.value)}>
                                        <option value="">Seleccionar</option>
                                        {universities.map(u => <option key={u.id} value={String(u.id)}>{u.name}</option>)}
                                    </select>
                                    <InputError message={errors.university_id} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Departamento</label>
                                    <select className="input select" value={data.department_id} onChange={e => setData('department_id', e.target.value)}>
                                        <option value="">Seleccionar</option>
                                        {departments.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
                                    </select>
                                    <InputError message={errors.department_id} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Mentor</label>
                                    <select className="input select" value={data.mentor_user_id} onChange={e => setData('mentor_user_id', e.target.value)}>
                                        <option value="">Seleccionar mentor</option>
                                        {mentors.map(m => <option key={m.id} value={String(m.id)}>{m.name}</option>)}
                                    </select>
                                    <InputError message={errors.mentor_user_id} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bolsa (AOA)</label>
                                    <input className="input" type="number" min="0" step="0.01" value={data.stipend} onChange={e => setData('stipend', e.target.value)} />
                                    <InputError message={errors.stipend} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Data de Início</label>
                                    <input className="input" type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                                    <InputError message={errors.start_date} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Data de Fim</label>
                                    <input className="input" type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Observações</label>
                                <textarea className="input" rows={3} value={data.observacoes} onChange={e => setData('observacoes', e.target.value)} />
                                <InputError message={errors.observacoes} />
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 24, borderTop: '1px solid #F5F5F5' }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'A gravar...' : 'Criar Talento'}
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

TalentosCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Talentos', href: index().url },
        { title: 'Novo', href: '#' },
    ],
});
